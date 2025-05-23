import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Board = ({ board }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={board.id}
      sx={{
        height: "120px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardActionArea
        onClick={() => {
          navigate(`/boards/${board.id}`, { state: { board } });
        }}
        sx={{
          height: "100%",
          "&:hover": {
            backgroundColor: "action.hover", // Adds hover effect
          },
        }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            bgcolor: board.prefs.backgroundImage ? "none" : "white",
            backgroundImage: board.prefs.backgroundImage
              ? `url(${board.prefs.backgroundImage})`
              : "none",
            backgroundSize: "cover", // Ensure the image covers the entire area
            backgroundPosition: "center", // Center the image
            backgroundRepeat: "no-repeat", // Avoid repeating the image

            borderRadius: 2, // Optional: round corners
          }}
        >
          <Typography variant="h5" component="div">
            {board.name}
          </Typography>
          <Typography variant="h5" align="right">
            {board.starred && "⭐"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Board;
