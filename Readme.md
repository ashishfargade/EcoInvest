# EcoInvest
A full-stack web application that helps users track their stock investments over time with insightful visualizations. Features include portfolio management, historical performance charts using real-time stock data, ESG focused stock insights and News analysis.

## Environment:

This project was developed and tested with the following environment:

* **node:** v22.13.0
* **npm:** 11.0.0
* **python:** 3.10.12
* **pip:** 22.0.2


### Frontend dependencies:
* axios
* mui
* tailwind css
* chartjs

### Backend (Node) dependencies:
* axios
* bcryptjs
* cookie-parser
* cors
* dayjs
* gravatar
* jsonwebtoken
* mongoose
* winston

### Backend (Flask) dependencies:
* yfinance

## APIs Used

**Stock Time Series Data / Ticker Prices:**
- [Alpha Vantage](https://www.alphavantage.co/)
- [Polygon](https://polygon.io/)

**News Sources:**
- [GNews](https://gnews.io/)
- [NewsAPI](https://newsapi.org/)

**Web Scraping & Financial Data:**
- [Yahoo Finance (via yfinance)](https://pypi.org/project/yfinance/)

## Run locally
* Clone the project and open the folder
* Create a .env file (in server folder) and populate it with env variables, you can find variables required in config.js
* Similarly populate the frontend (Vite) env file with backend urls:
```bash
VITE_MAIN_SERVER_URL = http://localhost:8000
VITE_FLASK_SERVER_URL = http://localhost:5000
```

Node Server:
```bash
  cd server
  npm i
  npm start
```

Python Server:
```bash
  cd server2
  python3 app.py
```

Client:
```
  cd client
  npm run dev
```

