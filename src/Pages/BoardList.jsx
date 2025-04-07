import axios from "axios";
import React, { useEffect, useState, useRef,useReducer } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Grid, Button, TextField } from "@mui/material";
import CardsInList from "../Components/CardsInList";
import AddNewListForm from "../Components/AddNewListForm";
import useBoardNavBarStyles from "../Components/UseBoardNavBarStyles";
import fetchSingleBoard from "../Components/fetchSingleBoard";
import fetchlistsOfSingleBoard from "../Components/fetchlistsOfSingleBoard";
import fetchAllCardsInBoard from "../Components/fetchAllCardsInBoard";
import listsReducer,{initialState} from "../Reducers/BoardListsReducer";
import ErrorPage from "./ErrorPage";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS={
  key:apiKey,
  token:apiToken
}


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

        dispatch({
          type: "getAllLists",
          list: listsRes.data,
        })
        setAllCardsInBoard(cardsRes.data);
        setBoard(boardRes.data);

      } catch (err) {
        console.log("Unable to fetch lists of board", err.message);
        dispatch({type:'Error',error:"Unable to fetch lists of board "+ err.message})
      } finally {
        dispatch({ type: "SET_LOADING", loading: false });
      }
    };

    fetch();
  }, []);



  async function handleArchiveList(id) {
    try {
      await axios.put(`https://api.trello.com/1/lists/${id}/closed`, null, {
        params: { value: true, ...API_CREDENTIALS },
      });
  
      dispatch({ type: "archive", id });
    } catch (error) {
      console.error("Error deleting list:", error.message);
      dispatch({type:'Error',error:"Error deleting list: "+ err.message})
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
      dispatch({type:'Error',error:"Error creating board: "+ err.message})

    }
  }
  

  let cardsForEachList = getcardsForEachList(allCardsInBoard || []);

  return listsOfBoard.loading ? (
    <Typography variant="h5">Loading...</Typography>
  ) : listsOfBoard.error ? (<ErrorPage errorMessage={listsOfBoard.error} />): (
    <Box
      sx={{...styles.mainBox, bgcolor:  board?.prefs.backgroundImage
        ? "none"
        : `${ board.prefs.backgroundColor}`,
      backgroundImage:  board.prefs.backgroundImage
        ? `url(${ board.prefs.backgroundImage})`
        : "none", 
        backgroundSize: "cover", // Ensure the image covers the entire area
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Avoid repeating the image
      } }
    >
      {/* Navbar (Fixed at the top) */}
      <Box className="boardNavBar" sx={styles.boardNavBar}>
        <Typography variant="h4" sx={styles.title}>
          {board.name}
        </Typography>
      </Box>

      <Box
        sx={{...styles.box,}}
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
