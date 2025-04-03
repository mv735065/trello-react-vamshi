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
import CardInListStyles from "./CardInListStyles";

const CardsInList = ({ list, cards, handleArchiveList }) => {
  const [cardsInList, setCardsInList] = useState(cards || []);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const newCardTextRef = useRef();

  let styles = CardInListStyles();

  console.log("Rendered CardsInList");

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

  return (
    <Card sx={styles.card}>
      {/* List Header */}
      <Box sx={styles.box}>
        <Typography variant="subtitle1" fontWeight="bold">
          {list.name}
        </Typography>
        <MoreHorizIcon sx={{ fontSize: 18, cursor: "pointer" }} />
      </Box>

      {/* Cards List */}
      <CardContent sx={styles.cardContent}>
        <List sx={{ padding: 0 }}>
          {cardsInList.length > 0 ? (
            cardsInList.map((card) => (
              <ListItem key={card.id} sx={styles.listItem}>
                {card.name}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="gray">
              No cards in this list
            </Typography>
          )}

          {/* Input field for new card */}
          {isAddingCard ? (
            <ListItem sx={styles.listItem}>
              <TextField
                fullWidth
                inputRef={newCardTextRef}
                variant="outlined"
                size="small"
                autoFocus
                placeholder="Enter card name"
                sx={styles.textField}
              />
              <Button
                sx={{ color: "white", marginLeft: 1 }}
                onClick={handleCardSubmit}
              >
                Add
              </Button>
              <Button
                sx={{ color: "white", marginLeft: 1 }}
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </Button>
            </ListItem>
          ) : (
            <Button
              startIcon={<AddIcon />}
              sx={{
                ...styles.button,
                "&:hover": { bgcolor: "#1a1a1a" },
              }}
              onClick={() => setIsAddingCard(true)}
            >
              Add a card
            </Button>
          )}
        </List>
      </CardContent>
      {/* Delete Button */}
      <Button
        sx={{
          ...styles.button,
          bgcolor: "red",
          "&:hover": { bgcolor: "#ff4d4d" },
          marginTop: 2,
        }}
        onClick={() => handleArchiveList(list.id)}
      >
        Archive List
      </Button>
    </Card>
  );
};

export default CardsInList;
