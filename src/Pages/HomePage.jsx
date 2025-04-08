import { useEffect, useRef } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Board from "../Components/Board";
import ErrorPage from "./ErrorPage";
import { setLoading, setAllBoards, setError, addNewBoard, setShowForm } from '../Utils/BoardSlice';// Import the actions from boardSlice

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken
};

function HomePage() {
  const dispatch = useDispatch();
  const allBoards = useSelector((state) => state.board); 
  const boardNameRef = useRef();

  console.log("render homePage");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.trello.com/1/members/me/boards",
          {
            params: API_CREDENTIALS,
            headers: { Accept: "application/json" },
          }
        );

        dispatch(setAllBoards(response.data)); // Dispatch all boards data
      } catch (error) {
        console.error("Unable to fetch boards", error.message);
        dispatch(setError("Unable to fetch boards " + error.message)); // Dispatch error action
      } 
    };

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const boardName = boardNameRef.current.value.trim();
    if (!boardName) return;

    try {
      const response = await axios.post(
        "https://api.trello.com/1/boards/",
        null,
        {
          params: { name: boardName, ...API_CREDENTIALS },
        }
      );

      dispatch(addNewBoard(response.data)); 
    } catch (error) {
      console.error("Error creating board:", error);
      dispatch(setError("Error creating board: " + error.message)); 
    }
  };

  return allBoards.loading ?  (
    <Typography variant="h4">Loading...</Typography>
  )  :  allBoards.error ? <ErrorPage errorMessage={allBoards.error} /> : (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 2,
        marginTop: "10px",
      }}
    >
      {allBoards.boards.map((board) => (
        <Board key={board.id} board={board} />
      ))}

      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          dispatch(setShowForm(true));
        }}
      >
        Create New Board
      </Button>

      {allBoards.showForm && (
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
              onClick={() => dispatch(setShowForm(false))} 
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
