import axios from "axios";
import React, { useEffect, useState, useRef, useReducer } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Grid, Button, TextField } from "@mui/material";
import CardsInList from "../Components/CardsInList";
import AddNewListForm from "../Components/AddNewListForm";
import useBoardNavBarStyles from "../Components/UseBoardNavBarStyles";
import listsReducer, { initialState } from "../Reducers/BoardListsReducer";
import ErrorPage from "./ErrorPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleBoard, clearBoard } from "../Utils/boardSlice";
import {
  fetchlistsOfSingleBoard,
  clearLists,
  archiveList,
  addNewList,
} from "../Utils/boardListSlice";
import { fetchAllCardsInBoard, clearCard } from "../Utils/cardSlice";

const BoardList = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { error: boardError, currentBoard: board } = useSelector(
    (state) => state.board
  );
  const {
    lists,
    error: listError,
    status,
  } = useSelector((state) => state.list);
  const {
    cards: allCardsInBoard,
    error: cardError,
    status: cardStatus,
  } = useSelector((state) => state.card);
  const [showForm, setShowForm] = useState(false);
  const listNameRef = useRef();

  const styles = useBoardNavBarStyles();
  console.log(id);

  useEffect(() => {
    dispatch(clearBoard());
    dispatch(clearLists());
    dispatch(clearCard());

    dispatch(fetchSingleBoard(id));
    dispatch(fetchlistsOfSingleBoard(id));
    dispatch(fetchAllCardsInBoard(id));
  }, [id, dispatch]);

  async function handleArchiveList(id) {
    dispatch(archiveList(id));
  }

  const handleAddNewList = (event) => {
    event.preventDefault();
    const listName = listNameRef.current.value.trim();
    if (!listName) return;
    console.log(listName);

    dispatch(addNewList({ boardId: id, listName: listName }));

    setShowForm(false);
    listNameRef.current.value = "";
  };

  let cardsForEachList = getcardsForEachList(allCardsInBoard || []);

  return status === "loading" ? (
    <Typography variant="h5">Loading...</Typography>
  ) : listError || boardError ? (
    <ErrorPage errorMessage={listError || boardError} />
  ) : (
    <Box
      sx={{
        ...styles.mainBox,
        bgcolor: board?.prefs.backgroundImage ? "none" : `#dedce5`,
        backgroundImage: board?.prefs.backgroundImage
          ? `url(${board?.prefs.backgroundImage})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box className="boardNavBar" sx={styles.boardNavBar}>
        <Typography variant="h4" sx={styles.title}>
          {board?.name}
        </Typography>
      </Box>

      <Box sx={{ ...styles.box }}>
        <Grid container spacing={2} wrap="nowrap" sx={{ height: "auto" }}>
          {lists?.map((ele) => {
            return (
              <Grid
                key={ele.id}
                sx={{ display: "inline-block", flexShrink: 0 }}
              >
                <h1>{cardsForEachList?.[ele.id]?.length}</h1>
                <CardsInList
                  list={ele}
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
