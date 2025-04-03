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
    <Card key={board.id} sx={{ height: "200px" }}>
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
