import { textFieldClasses } from '@mui/material';
import React from 'react'

const CardInListStyles = () => {
  return {
    card:{
        bgcolor: "#0f0f0f",
        color: "white",
        minWidth: 280,
        maxWidth: 300,
        borderRadius: "12px",
        padding: "10px",
        boxShadow: 3,
    },
    box:{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 10px",
      },
      listItem:{
        bgcolor: "#2c2c2c",
        padding: "8px 12px",
        borderRadius: "8px",
        marginBottom: "6px",
        color: "white",
        fontSize: "0.9rem",
        cursor: "pointer",
        "&:hover": { bgcolor: "#3a3a3a" },
      },
      button:{
        color: "white",
        textTransform: "none",
        fontSize: "0.9rem",
        padding: "5px 10px",
        width: "100%",
        justifyContent: "start",
      },
      cardContent:{
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      },
      textField:{
        bgcolor: "white",
        color: "#DCDFE4",
        borderRadius: "10px",
      },
  }
}

export default CardInListStyles;