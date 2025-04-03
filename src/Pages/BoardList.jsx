import axios from "axios";
import React, { useEffect, useState, useRef,useReducer } from "react";
import { useParams, useLocation } from "react-router-dom";
import API_CREDENTIALS from "../Credintials";
import { Typography, Box, Grid, Button, TextField } from "@mui/material";
import CardsInList from "../Components/CardsInList";
import AddNewListForm from "../Components/AddNewListForm";
import useBoardNavBarStyles from "../Components/UseBoardNavBarStyles";
import fetchSingleBoard from "../Components/fetchSingleBoard";
import fetchlistsOfSingleBoard from "../Components/fetchlistsOfSingleBoard";
import fetchAllCardsInBoard from "../Components/fetchAllCardsInBoard";
import listsReducer,{initialState} from "../Components/BoardListsReducer";

const BoardList = () => {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [listsOfBoard, dispatch] = useReducer(listsReducer,initialState);
  const [allCardsInBoard, setAllCardsInBoard] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const listNameRef = useRef();

  const styles = useBoardNavBarStyles();
  
  useEffect(() => {
    const fetch = async () => {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const [boardRes, listsRes, cardsRes] = await Promise.all([
          fetchSingleBoard(id),
          fetchlistsOfSingleBoard(id),
          fetchAllCardsInBoard(id),
        ]);

        setBoard(boardRes.data);
        handleLists(listsRes.data);
        setAllCardsInBoard(cardsRes.data);
      } catch (err) {
        console.log("Unable to fetch lists of board", err.message);
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    };

    fetch();
  }, []);

 async function handleLists(lists) {
   try{
      dispatch({
      type: "getAllLists",
      list: lists,
    });
   }
   catch(err){
    console.error("Error getting all lists:", err.message);
    
   }
  }

  async function handleArchiveList(id) {
    try {
      await axios.put(`https://api.trello.com/1/lists/${id}/closed`, null, {
        params: { value: true, ...API_CREDENTIALS },
      });
  
      dispatch({ type: "archive", id });
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  }
  
  async function handleAddNewList(event) {
    event.preventDefault();
    const listName = listNameRef.current.value.trim();
    if (!listName) return;
  
    try {
      const response = await axios.post("https://api.trello.com/1/lists", null, {
        params: { name: listName, idBoard: id, ...API_CREDENTIALS },
      });
  
      dispatch({
        type: "addNewList",
        data: response.data
      });
  
      setShowForm(false);
      listNameRef.current.value = "";
    } catch (error) {
      console.error("Error creating board:", error);
    }
  }
  

  let cardsForEachList = getcardsForEachList(allCardsInBoard || []);

  return listsOfBoard.loading ? (
    <Typography variant="h5">Loading...</Typography>
  ) : (
    <Box
      sx={styles.mainBox}
    >
      {/* Navbar (Fixed at the top) */}
      <Box className="boardNavBar" sx={styles.boardNavBar}>
        <Typography variant="h4" sx={styles.title}>
          {board.name}
        </Typography>
      </Box>

      <Box
        sx={styles.box}
      >
        <Grid container spacing={2} wrap="nowrap" sx={{ height: "auto" }}>
          {listsOfBoard?.lists?.map((ele) => {
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
