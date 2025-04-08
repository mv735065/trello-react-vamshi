import axios from "axios";
import React, { useEffect, useState, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Grid, Button, TextField } from "@mui/material";
import CardsInList from "../Components/CardsInList";
import OpenForm from "../Components/OpenFormToCreate";
import useBoardNavBarStyles from "../Components/UseBoardNavBarStyles";
import fetchSingleBoard from "../Components/fetchSingleBoard";
import fetchlistsOfSingleBoard from "../Components/fetchlistsOfSingleBoard";
import fetchAllCardsInBoard from "../Components/fetchAllCardsInBoard";
import listsReducer, { initialState } from "../Reducers/BoardListsReducer";
import ErrorPage from "./ErrorPage";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllData,
  addNewList,
  setError,
  showForm,
  archiveList,
  clearAllPrevData,
} from "../Utils/boardListSlice";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const BoardList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const allData = useSelector((state) => state.lists);

  const styles = useBoardNavBarStyles();

  useEffect(() => {
    const fetch = async () => {
      dispatch(clearAllPrevData());
      try {
        const [boardRes, listsRes, cardsRes] = await Promise.all([
          fetchSingleBoard(id),
          fetchlistsOfSingleBoard(id),
          fetchAllCardsInBoard(id),
        ]);

        dispatch(
          getAllData({
            board: boardRes.data,
            lists: listsRes.data,
            cards: cardsRes.data,
          })
        );
      } catch (error) {
        dispatch(
          setError("Unable to fetch lists or cards of board " + error.message)
        );
      }
    };

    fetch();
  }, [id]);

  async function handleArchiveList(id) {
    try {
      await axios.put(`https://api.trello.com/1/lists/${id}/closed`, null, {
        params: { value: true, ...API_CREDENTIALS },
      });

      dispatch(archiveList(id));
    } catch (error) {
      dispatch(setError("Error deleting list: " + error.message));
    }
  }

  async function handleAddNewList(listName) {
    if (!listName) return;

    try {
      const response = await axios.post(
        "https://api.trello.com/1/lists",
        null,
        {
          params: { name: listName, idBoard: id, ...API_CREDENTIALS },
        }
      );

      dispatch(addNewList(response.data));
      dispatch(showForm(false));
    } catch (error) {
      dispatch(setError("Error creating board: " + error.message));
    }
  }

  function handleForm(value) {
    dispatch(showForm(value));
  }

  let cardsForEachList = getcardsForEachList(allData.allCardsInBoard || []);

  return allData.loading ? (
    <Typography variant="h5">Loading...</Typography>
  ) : allData.error ? (
    <ErrorPage errorMessage={allData.error} />
  ) : (
    <Box
      sx={{
        ...styles.mainBox,
        bgcolor: allData.board?.prefs.backgroundImage ? "none" : `white`,
        backgroundImage: allData.board.prefs.backgroundImage
          ? `url(${allData.board.prefs.backgroundImage})`
          : "none",
        backgroundSize: "cover", // Ensure the image covers the entire area
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Avoid repeating the image
      }}
    >
      {/* Navbar (Fixed at the top) */}
      <Box className="boardNavBar" sx={styles.boardNavBar}>
        <Typography variant="h4" sx={styles.title}>
          {allData.board.name}
        </Typography>
      </Box>

      <Box sx={{ ...styles.box }}>
        <Grid container spacing={2} wrap="nowrap" sx={{ height: "auto" }}>
          {allData.listsOfBoard?.map((ele) => {
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
            {allData.showForm ? (
              <OpenForm
                handleForm={handleForm}
                handleAddNewList={handleAddNewList}
              />
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  dispatch(showForm(true));
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
