import { useEffect, useRef, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import axios from "axios";
import Board from "../Components/Board";
import API_CREDENTIALS from "../Credintials";
// API_CREDENTIALS=process.env.REACT_APP_API_KEY_API_CREDENTIALS;

function HomePage() {
  const [allBoards, setAllBoards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const boardNameRef = useRef();

  console.log("render");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.trello.com/1/members/me/boards",
          {
            params: API_CREDENTIALS,
            headers: { Accept: "application/json" },
          }
        );

        setAllBoards(response.data);
        console.log(response.data.length);
      } catch (error) {
        console.error("Unable to fetch boards", error);
      } finally {
        setLoading(false);
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

      setAllBoards((prevBoards) => [...prevBoards, response.data]);

      setShowForm(false);
      boardNameRef.current.value = "";
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };
  return loading ? (
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
      {allBoards.map((board) => (
        <Board key={board.id} board={board} />
      ))}

      <Button
        variant="outlined"
        color="primary"
        onClick={() => setShowForm(true)}
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
