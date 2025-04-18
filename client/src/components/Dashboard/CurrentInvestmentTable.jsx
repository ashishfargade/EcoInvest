import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Box,
  TableSortLabel,
  Link,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CircularProgress } from "@mui/material";

import { EditInvestmentDialog } from "./EditInvestmentDialog"; // renamed import
import axiosInstance from "../../app/api/axiosInstance";

export const CurrentInvestmentTable = ({ portfolio, loading, history }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [form, setForm] = useState({ ticker: "", price: "", quantity: "" });

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("ticker");

  const latestEntry = history?.[history.length - 1];
  const latestStocks = latestEntry?.stocks || [];

  const valuationMap = latestStocks.reduce((acc, stock) => {
    acc[stock.ticker] = stock.value;
    return acc;
  }, {});

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSubmit = (e) => {
    const { ticker, price, quantity } = form;

    if (mode === "add") {
      axiosInstance.put("/portfolio/addToPortfolio", {
        ticker,
        quantity,
        price,
      });
    } else {
      axiosInstance.put("/portfolio/removeFromPortfolio", {
        ticker,
        quantity,
        price,
      });
    }

    setOpen(false);
    setForm({ ticker: "", price: "", quantity: "" });
  };

  const sortData = (array) => {
    return array.sort((a, b) => {
      if (orderBy === "ticker") {
        return order === "asc"
          ? a.ticker.localeCompare(b.ticker)
          : b.ticker.localeCompare(a.ticker);
      } else if (orderBy === "shares") {
        return order === "asc" ? a.shares - b.shares : b.shares - a.shares;
      } else if (orderBy === "investment") {
        const investmentA = a.averageBuyPrice * a.shares;
        const investmentB = b.averageBuyPrice * b.shares;
        return order === "asc"
          ? investmentA - investmentB
          : investmentB - investmentA;
      } else if (orderBy === "valuation") {
        const valuationA = valuationMap[a.ticker] ?? 0;
        const valuationB = valuationMap[b.ticker] ?? 0;
        return order === "asc"
          ? valuationA - valuationB
          : valuationB - valuationA;
      }
      return 0;
    });
  };

  const sortedPortfolio = sortData([...portfolio]);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1e293b" }}>
          Current Investment Overview
        </Typography>
        <Box>
          <IconButton
            onClick={() => {
              setMode("add");
              setOpen(true);
            }}
            sx={{
              backgroundColor: "#3f72af",
              color: "white",
              mr: 1,
              "&:hover": { backgroundColor: "#345e90" },
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setMode("remove");
              setOpen(true);
            }}
            sx={{
              backgroundColor: "#dc2626",
              color: "white",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              {["ticker", "shares", "investment", "valuation"].map((column) => (
                <TableCell key={column}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPortfolio.map((stock) => {
              const investment = stock.averageBuyPrice * stock.shares;
              const valuation = valuationMap[stock.ticker] ?? 0;
              const isLoss = valuation < investment;

              return (
                <TableRow key={stock.ticker}>
                  <TableCell>
                    <Link
                      component="button"
                      underline="hover"
                      sx={{ cursor: "pointer", fontWeight: 600 }}
                      onClick={() =>
                        navigate(`/analytics?ticker=${stock.ticker}`)
                      }
                    >
                      {stock.ticker}
                    </Link>
                  </TableCell>
                  <TableCell>{stock.shares}</TableCell>
                  <TableCell>${investment.toFixed(2)}</TableCell>
                  <TableCell
                    sx={{
                      color: isLoss ? "#ef4444" : "#22c55e",
                      fontWeight: 600,
                    }}
                  >
                    ${valuation.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <EditInvestmentDialog
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        mode={mode}
      />
    </>
  );
};
