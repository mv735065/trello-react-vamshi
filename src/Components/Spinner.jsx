import React from 'react'
import {
  Typography,
  Box,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const Spinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <CircularProgress size={80} thickness={4} color="primary" />
    </Box>
  )
}

export default Spinner