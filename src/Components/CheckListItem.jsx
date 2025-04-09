import React, { useEffect, useRef } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setLoading,
  setItems,
  addItem,
  deleteItem,
  toggleItem,
  setError,
} from "../Utils/checkListItemsSlice.js";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const CheckListItems = ({ checkList, handleDeleteCheckList }) => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.checkListItems);
  const newItemRef = useRef();
  const cardId = checkList.idCard;
  const id = checkList.id;

  useEffect(() => {
    async function fetchCheckListItems() {
      dispatch(setLoading(true));

      try {
        const response = await axios.get(
          `https://api.trello.com/1/checklists/${id}/checkItems`,
          {
            params: API_CREDENTIALS,
          }
        );
        dispatch(setItems(response.data));
      } catch (err) {
        dispatch(setError("Unable to fetch check list items"));
      } finally {
        dispatch(setLoading(false));
      }
    }

    fetchCheckListItems();
  }, [dispatch, id]);

  const handleToggle = async (item) => {
    try {
      let response = await axios.put(
        `https://api.trello.com/1/cards/${cardId}/checkItem/${item.id}`,
        null,
        {
          params: {
            ...item,
            state: item.state === "complete" ? "incomplete" : "complete",
            ...API_CREDENTIALS,
          },
        }
      );

      dispatch(toggleItem(response.data.id)); // Toggle item state
    } catch (err) {
      console.log("Unable to update the item", err.message);
    }
  };

  const handleAddCheckListItem = async () => {
    if (!newItemRef.current.value) return;

    try {
      let name = newItemRef.current.value;
      let response = await axios.post(
        `https://api.trello.com/1/checklists/${id}/checkItems`,
        null,
        {
          params: {
            name: name,
            ...API_CREDENTIALS,
          },
        }
      );

      dispatch(addItem(response.data));
      newItemRef.current.value = "";
    } catch (err) {
      console.log("Unable to add the item", err.message);
      dispatch(setError("Unable to add the item"));
    }
  };

  const handleDeleteCheckListItem = async (itemId) => {
    try {
      await axios.delete(
        `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );

      dispatch(deleteItem(itemId));
    } catch (err) {
      console.log("Unable to delete the item", err.message);
      dispatch(setError("Unable to delete the item"));
    }
  };

  const checkedItems = items.reduce((acc, item) => {
    return item.state === "complete" ? acc + 1 : acc;
  }, 0);

  const progress = items.length ? (checkedItems / items.length) * 100 : 0;

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: "#2b2d30",
        color: "white",
        width: "90%",
        marginTop: "20px",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{checkList.name}</Typography>
        <IconButton
          onClick={() => handleDeleteCheckList(id)}
          sx={{ color: "white" }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ my: 1, backgroundColor: "gray" }}
      />
      <Typography variant="caption">{Math.round(progress)}%</Typography>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <List>
          {items.map((item, index) => (
            <ListItem key={index} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={item.state === "complete"}
                  tabIndex={-1}
                  disableRipple
                  onChange={() => handleToggle(item)}
                  icon={
                    <CheckBoxOutlineBlankOutlinedIcon sx={{ color: "white" }} />
                  }
                  checkedIcon={<CheckBoxOutlinedIcon sx={{ color: "white" }} />}
                />
              </ListItemIcon>
              <ListItemText primary={item.name} sx={{ color: "white" }} />
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteCheckListItem(item.id)}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Add an item"
          inputRef={newItemRef}
          sx={{
            flexGrow: 1,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "white" },
              "&:hover fieldset": { borderColor: "gray" },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddCheckListItem}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
};

export default CheckListItems;
