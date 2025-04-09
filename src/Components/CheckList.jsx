import React, { useEffect, useRef } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import CheckListItems from "./CheckListItem";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoading,
  fetchChecklists,
  addCheckList,
  deleteCheckList,
  setError,
} from "../Utils/checkListSlice.js"; // Import actions from the slice
import StylesCardInList from "./StylesCardInList";
import  * as cardAction from "../Utils/CardSlice";
import { setSelectedCard } from "../Utils/SelectedCardSlice.js";


const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const CheckList = ({}) => {
  const dispatch = useDispatch();
  const checkLists = useSelector((state) => state.checkLists);
  const selectedCard = useSelector((state) => state.selectedCard);

  const inputFieldForCheckListName = useRef();

  const cardId = selectedCard?.id;
  console.log("render checklist ",selectedCard.name);



  useEffect(() => {
    if (cardId) {
      dispatch(setLoading(true));
      
      async function fetch() {
        try {
          const response = await axios.get(
            `https://api.trello.com/1/cards/${cardId}/checklists`,
            {
              params: API_CREDENTIALS,
              headers: { Accept: "application/json" },
            }
          );

          dispatch(fetchChecklists(response.data));
        } catch (err) {
          console.log("Unable to fetch checklists ", err.message);
          dispatch(setError("Unable to fetch checklists " + err.message));
        } finally {
          dispatch(setLoading(false));
        }
      }

      fetch();
    }
  }, []);

function handleClosePopup(){
   dispatch(setSelectedCard(null));
}
  async function handleDeleteCard() {
    let id = selectedCard?.id;
    try {
      let response = await axios.delete(
        `https://api.trello.com/1/cards/${id}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );
      dispatch(cardAction.deleteCard(id));
      dispatch(setSelectedCard(null));
    } catch (err) {
      dispatch(setError("unable to deleted the card " + err.message));
    }
  }


  const handleDeleteCheckList = async (checkListId) => {
    try {
      await axios.delete(
        `https://api.trello.com/1/cards/${cardId}/checklists/${checkListId}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );

      dispatch(deleteCheckList(checkListId));
    } catch (err) {
      console.log("Unable to delete the checklist ", err.message);
      dispatch(setError("Unable to delete the checklist " + err.message));
    }
  };

  const handleAddNewCheckList = async () => {
    const name = inputFieldForCheckListName.current.value;
    if (!name) return;

    try {
      const response = await axios.post(
        `https://api.trello.com/1/checklists`,
        null,
        {
          params: {
            name: name,
            idCard: cardId,
            ...API_CREDENTIALS,
          },
        }
      );

      dispatch(addCheckList(response.data));
      inputFieldForCheckListName.current.value = "";
    } catch (err) {
      console.log("Unable to add the checklist ", err.message);
      dispatch(setError("Unable to add the checklist " + err.message));
    }
  };

  const styles = StylesCardInList();

  return (
    <Box sx={styles.modalStyles}>
      {/* Close Button */}
      <Button sx={styles.Xmark} onClick={handleClosePopup}>
        X
      </Button>

      <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
        {selectedCard?.name}
      </Typography>

      {/* Buttons for Delete and Checklist */}
      <Box display="flex" alignItems="center" gap={1}>
        <Button
          variant="contained"
          color="error"
          sx={{ marginRight: 2 }}
          onClick={handleDeleteCard}
        >
          Delete Card
        </Button>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Add a new CheckList"
            inputRef={inputFieldForCheckListName}
            sx={{
              flexGrow: 1,
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "gray" },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddNewCheckList}
            startIcon={<AddIcon />}
          >
            Add Checklist
          </Button>
        </Box>
      </Box>
      {checkLists.isLoading ? (
        <Typography variant="h5" color="white">
          Loading...
        </Typography>
      ) : (
        <Box>
          {checkLists.checkLists.length > 0 ? (
            checkLists.checkLists.map((ele) => (
              <CheckListItems
                key={ele.id}
                checkList={ele}
                handleDeleteCheckList={handleDeleteCheckList}
              />
            ))
          ) : (
            <Typography variant="body2" color="gray" align="center" p="30px">
              No checklists in the card
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CheckList;
