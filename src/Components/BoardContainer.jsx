import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteBoard } from "../Utils/boardSlice";

const Board = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const { boards } = useSelector((state) => state.board);
  const [hoveredBoardId, setHoveredBoardId] = useState(null);

  const handleDeleteClick = (boardId) => {
    // console.log("Delete board with ID:", boardId);
    dispatch(deleteBoard(boardId)); // optional redux action
  };

  return (
    <>
      {boards.map((board) => (
        <Card
          key={board.id}
          onMouseEnter={() => setHoveredBoardId(board.id)}
          onMouseLeave={() => setHoveredBoardId(null)}
          sx={{
            height: "120px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {/* Delete Icon (now outside CardActionArea) */}
          {hoveredBoardId === board.id && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(board.id);
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 2,
               
                "&:hover": {
                  backgroundColor: "#eee",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}

          <CardActionArea
            onClick={() => {
              navigate(`/boards/${board.id}`, { state: { board } });
            }}
            sx={{
              height: "100%",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <CardContent
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                bgcolor: board.prefs.backgroundImage ? "none" : "white",
                backgroundImage: board.prefs.backgroundImage
                  ? `url(${board.prefs.backgroundImage})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5">{board.name}</Typography>
            
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  );
};

export default Board;
