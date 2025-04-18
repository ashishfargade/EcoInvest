import yfinance as yf
import pandas as pd
import json
import os
from datetime import datetime
from fpdf import FPDF
from cachetools import TTLCache

# Cache: store max 100 items, each for 1 day (86400 seconds)
stock_cache = TTLCache(maxsize=100, ttl=86400)

PDF_DIR = os.path.join("static", "pdfs")
os.makedirs(PDF_DIR, exist_ok=True)


def save_pdf_from_df(df: pd.DataFrame, filename: str):
    """
    Generates a PDF from a Pandas DataFrame with improved formatting.

    Args:
        df (pd.DataFrame): The DataFrame to convert to PDF.
        filename (str): The name of the PDF file to save.  Do not include path.
    """
    # Fix index formatting to avoid errors with year
    if isinstance(df.index, pd.DatetimeIndex):
        df.index = df.index.strftime("%Y-%m-%d")
    elif isinstance(df.index, pd.PeriodIndex):
        df.index = df.index.astype(str)

    df = df.reset_index()

    # Create a PDF in Landscape ('L') mode
    pdf = FPDF("L", "mm", "A4")  # 'L' for landscape orientation, 'A4' paper size
    pdf.add_page()
    pdf.set_font("Arial", size=10)
    pdf.set_auto_page_break(auto=True, margin=15)  # Add auto page break

    # Page size details
    total_width = 297  # A4 landscape width in mm
    right_padding = 10  # Padding from the right edge of the page
    available_width = total_width - right_padding  # Available space for the table

    num_columns = len(df.columns)

    # If there are columns, spread them across the available page width
    if num_columns > 0:
        col_width = available_width / num_columns
    else:
        col_width = available_width  # if no columns, use full width (although unlikely)

    # Write headers
    x_start = pdf.get_x()  # Get the current X position
    for col in df.columns:
        pdf.cell(col_width, 10, str(col), border=1, align="C")
    pdf.ln()

    # Write rows, handle multi-line text and padding
    for _, row in df.iterrows():
        max_row_height = 10  # Default row height for a single line
        row_heights = []  # List to store the height of each cell in the row

        for col in df.columns:
            cell_text = str(row[col])
            # Check if the text is too long for the column and needs to wrap to the next line
            if (
                len(cell_text) > 30
            ):  # Adjust the threshold to match your data.  Increased to 30.
                text_lines = pdf.get_string_width(cell_text) / col_width
                cell_height = max(10, int(text_lines) * 6)  # Minimum 10, adjust 6
                row_heights.append(cell_height)
            else:
                row_heights.append(10)  # default
        max_row_height = max(row_heights)

        pdf.set_x(x_start)  # Reset X to the start of the table
        for i, col in enumerate(df.columns):
            cell_text = str(row[col])
            if len(cell_text) > 30:
                pdf.multi_cell(
                    col_width, max_row_height, cell_text, border=1, align="C"
                )
                pdf.set_xy(
                    pdf.x + col_width, pdf.y - max_row_height
                )  # Maintain correct X position for next cell.
            else:
                pdf.cell(col_width, max_row_height, cell_text, border=1, align="C")
        pdf.ln()

    # Save the PDF in the designated folder
    path = os.path.join(PDF_DIR, filename)
    pdf.output(path)
    return f"/{path}"


def fetch_stock_data(ticker):
    today = datetime.now().date()

    # Check cache
    if ticker in stock_cache and stock_cache[ticker]["date"] == today:
        return stock_cache[ticker]["data"]

    try:
        stock = yf.Ticker(ticker)
        result = {}

        result["info"] = (
            stock.info if isinstance(stock.info, dict) else "No info available."
        )
        # result["calendar"] = (
        #     stock.calendar.to_dict()
        #     if isinstance(stock.calendar, pd.DataFrame)
        #     else "No calendar available."
        # )

        result["sustainability"] = (
            json.loads(stock.sustainability.to_json())
            if isinstance(stock.sustainability, pd.DataFrame)
            else "No ESG data available."
        )
        result["recommendations"] = (
            json.loads(stock.recommendations.to_json())
            if isinstance(stock.recommendations, pd.DataFrame)
            else "No recommendations available."
        )
        # result["major_holders"] = (
        #     json.loads(stock.major_holders.to_json())
        #     if isinstance(stock.major_holders, pd.DataFrame)
        #     else "No major holders data."
        # )
        # result["institutional_holders"] = (
        #     json.loads(stock.institutional_holders.to_json())
        #     if isinstance(stock.institutional_holders, pd.DataFrame)
        #     else "No institutional holders data."
        # )
        # result["mutualfund_holders"] = (
        #     json.loads(stock.mutualfund_holders.to_json())
        #     if isinstance(stock.mutualfund_holders, pd.DataFrame)
        #     else "No mutual fund holders data."
        # )
        # result["financials"] = (
        #     json.loads(stock.financials.to_json())
        #     if isinstance(stock.financials, pd.DataFrame)
        #     else "No financials data."
        # )
        # result["balance_sheet"] = (
        #     json.loads(stock.balance_sheet.to_json())
        #     if isinstance(stock.balance_sheet, pd.DataFrame)
        #     else "No balance sheet data."
        # )
        # result["cashflow"] = (
        #     json.loads(stock.cashflow.to_json())
        #     if isinstance(stock.cashflow, pd.DataFrame)
        #     else "No cashflow data."
        # )

        # Generate PDF and return links
        pdf_links = {}

        if isinstance(stock.quarterly_financials, pd.DataFrame):
            pdf_links["quarterly_financials_pdf"] = save_pdf_from_df(
                stock.quarterly_financials, f"{ticker}_quarterly_financials.pdf"
            )

        if isinstance(stock.quarterly_balance_sheet, pd.DataFrame):
            pdf_links["quarterly_balance_sheet_pdf"] = save_pdf_from_df(
                stock.quarterly_balance_sheet, f"{ticker}_quarterly_balance_sheet.pdf"
            )

        if isinstance(stock.quarterly_cashflow, pd.DataFrame):
            pdf_links["quarterly_cashflow_pdf"] = save_pdf_from_df(
                stock.quarterly_cashflow, f"{ticker}_quarterly_cashflow.pdf"
            )

        if isinstance(stock.income_stmt, pd.DataFrame):
            pdf_links["income_statement_pdf"] = save_pdf_from_df(
                stock.income_stmt, f"{ticker}_income_statement.pdf"
            )

        result["pdf_reports"] = pdf_links

        # Cache it
        stock_cache[ticker] = {"date": today, "data": result}

        return result

    except Exception as e:
        return {"error": f"Error fetching data: {str(e)}"}
