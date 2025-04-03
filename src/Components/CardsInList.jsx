import axios from "axios";
import API_CREDENTIALS from "../Credintials";
import React, { useRef, useState } from "react";
import {
  Card,
  Box,
  Typography,
  CardContent,
  List,
  ListItem,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const CardsInList = ({ list, cards,handleDeleteList }) => {
  const [cardsInList, setCardsInList] = useState(cards || []);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const newCardTextRef = useRef();

  console.log("Rendered CardsInList");

  // Handle click on "Add Card"
  const handleAddCardClick = () => {
    setIsAddingCard(true);
  };

  // Handle submitting a new card
  const handleCardSubmit = async () => {
    const cardName = newCardTextRef.current?.value.trim();
    if (!cardName) return;

    try {
      const response = await axios.post(
        "https://api.trello.com/1/cards",
        null,
        {
          params: { name: cardName, idList: list.id, ...API_CREDENTIALS },
        }
      );

      setCardsInList((prev) => [...prev, response.data]);
      newCardTextRef.current.value = "";
      setIsAddingCard(false);
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  // Handle canceling the add card action
  const handleCancel = () => {
    setIsAddingCard(false);
  };

  // Handle deleting a list


  return (
    <Card
      sx={{
        bgcolor: "#0f0f0f",
        color: "white",
        minWidth: 280,
        maxWidth: 300,
        borderRadius: "12px",
        padding: "10px",
        boxShadow: 3,
      }}
    >
      {/* List Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {list.name}
        </Typography>
        <MoreHorizIcon sx={{ fontSize: 18, cursor: "pointer" }} />
      </Box>

      {/* Cards List */}
      <CardContent
        sx={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <List sx={{ padding: 0 }}>
          {cardsInList.length > 0 ? (
            cardsInList.map((card) => (
              <ListItem
                key={card.id}
                sx={{
                  bgcolor: "#2c2c2c",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  marginBottom: "6px",
                  color: "white",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#3a3a3a" },
                }}
              >
                {card.name}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="gray">
              No cards in this list
            </Typography>
          )}

          {/* Input field for new card */}
          {isAddingCard && (
            <ListItem
              sx={{
                bgcolor: "#2c2c2c",
                padding: "8px 12px",
                borderRadius: "8px",
                marginBottom: "6px",
              }}
            >
              <TextField
                fullWidth
                inputRef={newCardTextRef}
                variant="outlined"
                size="small"
                autoFocus
                placeholder="Enter card name"
                sx={{
                  bgcolor: "white",
                  color: "#DCDFE4",
                  borderRadius: "10px",
                }}
              />
              <Button sx={{ color: "white", marginLeft: 1 }} onClick={handleCardSubmit}>
                Add
              </Button>
              <Button sx={{ color: "white", marginLeft: 1 }} onClick={handleCancel}>
                Cancel
              </Button>
            </ListItem>
          )}
        </List>
      </CardContent>

      {/* Add a Card Button */}
      <Button
        startIcon={<AddIcon />}
        sx={{
          color: "white",
          textTransform: "none",
          fontSize: "0.9rem",
          padding: "5px 10px",
          width: "100%",
          justifyContent: "start",
          "&:hover": { bgcolor: "#1a1a1a" },
        }}
        onClick={handleAddCardClick}
      >
        Add a card
      </Button>
      <p></p>
      {/* Delete Button */}
      <Button
        sx={{
          color: "white",
          textTransform: "none",
          fontSize: "0.9rem",
          padding: "5px auto",
          width: "100%",
          bgcolor:'red',
          justifyContent: "center",
          "&:hover": { bgcolor: "#ff4d4d" }, // Red color when hovering
          marginTop: 2,
        }}
        onClick={()=>handleDeleteList(list.id)}
      >
        Archive List
      </Button>
    </Card>
  );
};

export default CardsInList;
