import React, { useRef, useState } from "react";
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
import axios from "axios";
import API_CREDENTIALS from "../Credintials";

const CheckListItems = ({ checkList, handleDeleteCheckList }) => {
  let id = checkList.id;
  let name = checkList.name;
  let [items, setItems] = useState(checkList.checkItems || []);
  let cardId = checkList.idCard;

  const [checked, setChecked] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let newItemRef = useRef();

  console.log("render items");

  const handleToggle = async (item) => {
    try {
      // setIsLoading(true)
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

      setItems((prev) => {
        return prev.map((ele) => {
          if (ele.id === item.id) return response.data;
          return ele;
        });
      });
    } catch (err) {
      console.log("Unable to update the item", err.message);
    } finally {
      // setIsLoading(false);
    }
  };

  const handleAddCheckListItem = async () => {
    if (!newItemRef.current.value) return;
    let name = newItemRef.current.value;
    try {
      // setIsLoading(true)
      let response = await axios.post(
        ` https://api.trello.com/1/checklists/${id}/checkItems`,
        null,
        {
          params: {
            name: name,
            ...API_CREDENTIALS,
          },
        }
      );
      setItems((prev) => {
        return [...prev, response.data];
      });
      newItemRef.current.value = "";
    } catch (err) {
      console.log("unable to added the Item ", err.message);
    } finally {
      // setIsLoading(false);
    }
  };

  async function handleDeleteCheckListItem(itemId) {
    try {
      // setIsLoading(true);
      let response = await axios.delete(
        `https://api.trello.com/1/cards/${cardId}/checkItem/${itemId}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );
      setItems((prev) => {
        return prev.filter((ele) => ele.id != itemId);
      });
    } catch (err) {
      console.log("unable to deleted the checkLIstItem ", err.message);
    } finally {
      // setIsLoading(false);
    }
  }
  let checkedItems = items?.reduce((acc, ele) => {
    return ele.state === "complete" ? acc + 1 : acc; 
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
        <Typography variant="h6">{name}</Typography>
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
      <List>
        {items.map((item, index) => (
          <ListItem key={index} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={item.state == "complete"}
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
