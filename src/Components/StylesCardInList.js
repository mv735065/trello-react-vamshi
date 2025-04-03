import { textFieldClasses } from '@mui/material';
import React from 'react'

const StylesCardInList = () => {
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
      addButton:{
        color: "white",
        textTransform: "none",
        fontSize: "0.9rem",
        padding: "5px 10px",
        width: "100%",
        justifyContent: "start",
        "&:hover": { bgcolor: "#1a1a1a" },
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
      deleteButton:{
        color: "white",
        textTransform: "none",
        fontSize: "0.9rem",
        padding: "5px 10px",
        width: "100%",
        justifyContent: "start",
        bgcolor: "red",
        "&:hover": { bgcolor: "#ff4d4d" },
        marginTop: 2,
      },
      modalStyles : {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50vw",
        height: "90vh",
        bgcolor: "#45505A",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      },
      Xmark:{
        position: "absolute",
        top: 10,
        right: 10,
        fontSize: 20,
        minWidth: "auto",
        padding: "0 5px",
        color:'white'
      },
  }
}

export default StylesCardInList;