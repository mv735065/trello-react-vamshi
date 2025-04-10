import React, { useEffect, useRef, useState } from "react";
import StylesCardInList from "../Styles/StylesCardInList";

import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import CheckListItems from "./CheckListItem";
import { useReducer } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckListReducer, { initialState } from "../Reducers/CheckListReducer";
const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS={
  key:apiKey,
  token:apiToken
}


const CheckList = ({ handleClosePopup, status, handleDeleteCard }) => {
  let [checkLists, dispatch] = useReducer(CheckListReducer, initialState);
  let inputFieldForCheckListName = useRef();
  let cardId = status.selectedCard.id;
  console.log("render checklist");

  useEffect(() => {
    dispatch({ type: "SET_LOADING", isLoading: true });

    async function fetch() {
      try {
        let response1 = await axios.get(
          `https://api.trello.com/1/cards/${cardId}/checklists`,
          {
            params: API_CREDENTIALS,
            headers: { Accept: "application/json" },
          }
        );

        dispatch({
          type: "fetchAllCheckLists",
          data: response1.data,
        });
      } catch (err) {
        console.log("Unable to fetch checklists ", err.message);
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    }
    fetch();
  }, []);

  async function handleDeleteCheckList(checkListId) {
    try {
      let response = await axios.delete(
        `https://api.trello.com/1/cards/${cardId}/checklists/${checkListId}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );

      dispatch({
        type: "deleteCheckList",
        id: checkListId,
      });
    } catch (err) {
      console.log("unable to deleted the checkLIst ", err.message);
    }
  }

  async function handleAddNewCheckList() {
    let name = inputFieldForCheckListName.current.value;
    if (!name) return;
    try {
      let response = await axios.post(
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

      dispatch({
        type: "addNewCheckList",
        data: response.data,
      });

      inputFieldForCheckListName.current.value = "";
    } catch (err) {
      console.log("unable to add the checkLIst ", err.message);
      dispatch({
        type: "Error",
        error: "unable to add the checkLIst " + err.message,
      });
    }
  }

  let styles = StylesCardInList();
  return (
    <>
      <Box sx={styles.modalStyles}>
        {/* Close Button */}
        <Button sx={styles.Xmark} onClick={handleClosePopup}>
          X
        </Button>

        <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
          {status.selectedCard?.name}
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
              placeholder="Add a new CheckLIst"
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
        {checkLists?.isLoading ? (
          <Typography variant="h5" color="white">
            Loading...
          </Typography>
        ) : (
          <Box>
            {checkLists.checkLists?.length > 0 ? (
              checkLists.checkLists?.map((ele) => (
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
    </>
  );
};

export default CheckList;
