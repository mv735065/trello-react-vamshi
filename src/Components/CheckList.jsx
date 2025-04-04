import React, { useEffect, useRef, useState } from "react";
import StylesCardInList from "./StylesCardInList";
import API_CREDENTIALS from "../Credintials";
import { Box, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import CheckListItems from "./CheckListItem";
import { useReducer } from "react";
import AddIcon from "@mui/icons-material/Add";
// const apiKey = process.env.REACT_APP_API_KEY;
// const apiToken = process.env.REACT_APP_API_TOKEN;

// let API_CREDENTIALS={
//   key:apiKey,
//   token:apiToken
// }

const CheckList = ({ handleClosePopup, status, handleDeleteCard }) => {
  let [checkLists, setCheckList] = useState([]);
  let [isLoading, setIsLoading] = useState(true);
  let inputFieldForCheckListName = useRef(); 
  let cardId = status.selectedCard.id;
  useEffect(() => {
    setIsLoading(true);

    async function fetch() {
      try {
        let response1 = await axios.get(
          `https://api.trello.com/1/cards/${cardId}/checklists`,
          {
            params: API_CREDENTIALS,
            headers: { Accept: "application/json" },
          }
        );

        setCheckList(response1.data);
      } catch (err) {
        console.log("Unable to fetch checklists ", err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  async function handleDeleteCheckList(checkListId) {
    console.log("clicked checklist dele");
    try {
      let response = await axios.delete(
        `https://api.trello.com/1/cards/${cardId}/checklists/${checkListId}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );
      setCheckList((prev) => {
        return prev.filter((ele) => ele.id != checkListId);
      });
    } catch (err) {
      console.log("unable to deleted the checkLIst ", err.message);
    }
  }

  async function handleAddNewCheckList() {
    console.log(cardId);

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
      setCheckList((prev) => {
        return [...prev, response.data];
      });
      inputFieldForCheckListName.current.value = "";
    } catch (err) {
      console.log("unable to add the checkLIst ", err.message);
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
              onClick={() => {
                console.log("Checklist clicked", status.selectedCard?.id);
                handleAddNewCheckList();
              }}
              startIcon={<AddIcon />}
            >
              Add Checklist
            </Button>
          </Box>
        </Box>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Box>
            {checkLists?.length > 0 ? (
              checkLists?.map((ele) => (
                <CheckListItems
                  key={ele.id}
                  checkList={ele}
                  handleDeleteCheckList={handleDeleteCheckList}
                />
              ))
            ) : (
              <Typography variant="body2" color="gray" align="center" p='30px'>
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
