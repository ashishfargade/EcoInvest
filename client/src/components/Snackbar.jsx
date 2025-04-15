import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { clearError, selectError } from "../features/auth/authSlice.js";

const ErrorSnackbar = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(clearError());
  };

  // Don't show snackbar if error is specifically "Unauthorized request"
  const shouldShow = error && error !== "Unauthorized request";

  return (
    <Snackbar
      open={Boolean(shouldShow)}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
