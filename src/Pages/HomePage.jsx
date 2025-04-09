import { useEffect, useReducer, useRef, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import axios from "axios";
import Board from "../Components/BoardContainer";
import BoardReducer, { initialState } from "../Reducers/BoardReducer";
import { useDispatch, useSelector } from "react-redux";
import { addBoard, fetchBoards } from "../Utils/boardSlice";


function HomePage() {
  const dispatch = useDispatch();

  const { boards, status, error } = useSelector((state) => state.board);
  const [showForm, setShowForm] = useState(false);
  const boardNameRef = useRef();

  console.log("render");

  useEffect(() => {
    if (status == "idle") {
      dispatch(fetchBoards());
    }
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    const boardName = boardNameRef.current.value.trim();
    if (!boardName) {
      setShowForm(false);
      return;
    }
    dispatch(addBoard(boardName));
    boardNameRef.current.value = "";
    setShowForm(false);
  };
  return status === "loading" ? (
    <Typography variant="h4">Loading...</Typography>
  ) : (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 2,
        marginTop: "10px",
      }}
    >
      <Board />
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setShowForm(true);
        }}
      >
        Create New Board
      </Button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <TextField
            inputRef={boardNameRef}
            label="Enter board name"
            variant="outlined"
            size="small"
          />
          <div style={{ display: "flex", gap: "1px" }}>
            <Button type="submit" variant="contained" color="primary">
              Add Board
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Box>
  );
}

export default HomePage;
