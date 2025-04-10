import { useEffect, useReducer, useRef, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import axios from "axios";
import Board from "../Components/Board";
import BoardReducer, { initialState } from "../Reducers/BoardReducer";
import Spinner from "../Components/Spinner";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS={
  key:apiKey,
  token:apiToken
}


function HomePage() {
  const [allBoards, dispatch] = useReducer(BoardReducer, initialState);
  const boardNameRef = useRef();

  console.log("render");

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "Loading", loading: true });
      try {
        const response = await axios.get(
          "https://api.trello.com/1/members/me/boards",
          {
            params: API_CREDENTIALS,
            headers: { Accept: "application/json" },
          }
        );

        dispatch({
          type: "allBoards",
          data: response.data,
        });
      } catch (error) {
        console.error("Unable to fetch boards", error.message);
        dispatch({
          type: "Error",
          message: "Unable to fetch boards " + error.message,
        });
      } finally {
        dispatch({ type: "Loading", loading: false });
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

      dispatch({
        type: "addNewBoard",
        data: response.data,
        showForm: false,
      });
      boardNameRef.current.value = "";
    } catch (error) {
      console.error("Error creating board:", error);
      dispatch({
        type: "Error",
        message: "Error creating board: " + error.message,
      });
    }
  };
  return allBoards.loading ? (
     <Spinner />
  ) : (
      <div style={{backgroundColor:'#f9f7f7',minHeight:'100vh',paddingTop:'40px'}}>
 <Box
      sx={{
        width: "80%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 2,
        
        marginX:'auto',
       
      }}
    >
      {allBoards.boards.map((board) => (
        <Board key={board.id} board={board} />
      ))}

      <Button
        variant="outlined"
        color="primary"
        sx={{
          height:'120px'
        }}
        onClick={() => {
         
          dispatch({
            type: "openForm",
            showForm: true,
          });
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
              onClick={() =>
                dispatch({
                  type: "openForm",
                  showForm: false,
                })
              }
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Box>
      </div>
   
  );
}

export default HomePage;
