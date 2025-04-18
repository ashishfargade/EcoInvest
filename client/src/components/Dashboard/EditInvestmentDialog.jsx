import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

export const EditInvestmentDialog = ({
  open,
  onClose,
  form,
  setForm,
  onSubmit,
  mode = "add",
}) => {
  const isRemove = mode === "remove";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isRemove ? "Remove Shares" : "Add New Investment"}
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Ticker"
            name="ticker"
            value={form.ticker}
            onChange={handleChange}
            required
          />
          <TextField
            label="Price ($)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            required
          />
          <DialogActions sx={{ px: 0 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: isRemove ? "#dc2626" : "#3f72af",
                "&:hover": {
                  backgroundColor: isRemove ? "#b91c1c" : "#345e90",
                },
              }}
            >
              {isRemove ? "Remove" : "Add"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
