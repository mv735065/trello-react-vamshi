import React, { useEffect, useRef, useState } from "react";
import StylesCardInList from "./StylesCardInList";
import { Box, Typography, Button, TextField } from "@mui/material";
import CheckListItems from "./CheckListItem";
import AddIcon from "@mui/icons-material/Add";
import {
  fetchCheckLists,
  deleteCheckList,
  addNewCheckList,
} from "../Utils/checkListSlice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./LoadingSpiiner";

const CheckList = ({ handleClosePopup, selectedCard }) => {
  const dispatch = useDispatch();
  const { checklists, isLoading } = useSelector((state) => state.checkList);
  let inputFieldForCheckListName = useRef();
  let cardId = selectedCard?.id;
  console.log("render checklist");

  useEffect(() => {
    dispatch(fetchCheckLists(cardId));
  }, [cardId]);

  async function handleDeleteCheckList(checkListId) {
    dispatch(deleteCheckList({ cardId, checkListId }));
  }
  async function handleAddNewCheckList() {
    let name = inputFieldForCheckListName.current.value;
    if (!name) return;
    dispatch(addNewCheckList({ name, cardId }));

    inputFieldForCheckListName.current.value = "";
  }

  let styles = StylesCardInList();
  console.log(checklists, cardId);

  return (
    <>
      <Box sx={styles.modalStyles}>
        <Button sx={styles.Xmark} onClick={handleClosePopup}>
          X
        </Button>

        <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
          {status.selectedCard?.name}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
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
        {isLoading == "loading" ? (
          <Spinner />
        ) : (
          <Box>
            {checklists?.length > 0 ? (
              checklists?.map((ele) => (
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
