import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import API_CREDENTIALS from "../Credintials";
import { Typography, Box, Grid, Button, TextField } from "@mui/material";
import CardsInList from "../Components/CardsInList";
import AddNewListForm from "../Components/AddNewListForm";
import useBoardNavBarStyles from "../Components/UseBoardNavBarStyles";
import fetchSingleBoard from "../Components/fetchSingleBoard";
import fetchlistsOfSingleBoard from "../Components/fetchlistsOfSingleBoard";
import fetchAllCardsInBoard from "../Components/fetchAllCardsInBoard";

const BoardList = () => {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [listsOfBoard, setListsOfBoard] = useState([]);
  const [allCardsInBoard, setAllCardsInBoard] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const listNameRef = useRef();

  const styles = useBoardNavBarStyles();

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const board = await fetchSingleBoard(id);
        const response1 = await fetchlistsOfSingleBoard(id);
        const response2 = await fetchAllCardsInBoard(id);

        setBoard(board.data);
        let lists = response1.data;
        setListsOfBoard(lists.filter((ele) => !ele.closed));
        setAllCardsInBoard(response2.data);
      } catch (err) {
        console.log("Unable to fetch lists of board", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  const handleArchiveList = async (id) => {
    try {
      let responsde = await axios.put(
        `https://api.trello.com/1/lists/${id}/closed`,
        null,
        {
          params: { value: true, ...API_CREDENTIALS },
        }
      );
      setListsOfBoard((prev) => {
        return prev.filter((ele) => {
          return ele.id != id;
        });
      });
      console.log("List deleted successfully");
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  async function handleAddNewList(event) {
    event.preventDefault();
    const listName = listNameRef.current.value.trim();
    if (!listName) return;

    try {
      const response = await axios.post(
        "https://api.trello.com/1/lists",
        null,
        {
          params: { name: listName, idBoard: id, ...API_CREDENTIALS },
        }
      );

      setListsOfBoard((prev) => [...prev, response.data]);
      setShowForm(false);
      listNameRef.current.value = "";
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }

  let cardsForEachList = getcardsForEachList(allCardsInBoard);

  return isLoading ? (
    <Typography variant="h5">Loading...</Typography>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
      }}
    >
      {/* Navbar (Fixed at the top) */}
      <Box className="boardNavBar" sx={styles.boardNavBar}>
        <Typography variant="h4" sx={styles.title}>
          {board.name}
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          padding: 2,
          whiteSpace: "nowrap",
        }}
      >
        <Grid container spacing={2} wrap="nowrap" sx={{ height: "auto" }}>
          {listsOfBoard.map((ele) => {
            return (
              <Grid
                key={ele.id}
                sx={{ display: "inline-block", flexShrink: 0 }}
              >
                <CardsInList
                  list={ele}
                  cards={cardsForEachList[ele.id]}
                  handleArchiveList={handleArchiveList}
                />
              </Grid>
            );
          })}
          <Grid
            key="create_list"
            sx={{ display: "inline-block", flexShrink: 0 }}
          >
            {showForm ? (
              <AddNewListForm
                listNameRef={listNameRef}
                setShowForm={setShowForm}
                handleAddNewList={handleAddNewList}
              />
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  setShowForm(true);
                }}
              >
                + Add List
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BoardList;

function getcardsForEachList(allCardsInBoard) {
  return allCardsInBoard.reduce((acc, ele) => {
    let idList = ele.idList;
    if (!acc.hasOwnProperty(idList)) {
      acc[idList] = [];
    }
    acc[idList].push(ele);

    return acc;
  }, {});
}
