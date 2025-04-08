import axios from "axios";
import React, { useReducer, useRef, useState } from "react";
import {
  Card,
  Box,
  Typography,
  CardContent,
  List,
  ListItem,
  Button,
  TextField,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StylesCardInList from "./StylesCardInList";
import CheckList from "./CheckList";
import CardReducer, { initialState } from "../Reducers/CardReducer";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const CardsInList = ({ list, cards, handleArchiveList }) => {
  const [cardsInList, dispatch] = useReducer(CardReducer, {
    ...initialState,
    cards: cards || [],
  });
  const [status, setStatus] = useState({
    isAddingCard: false,
    selectedCard: null,
  });
  const inputFieldForNewCardName = useRef();

  const handleCardClick = (card) => {
    setStatus({
      ...status,
      selectedCard: card,
    });
  };

  const handleClosePopup = () => {
    setStatus({
      ...status,
      selectedCard: null,
    });
  };

  let styles = StylesCardInList();
  console.log("Rendered CardsInList");

  const handleAddNewCard = async () => {
    const cardName = inputFieldForNewCardName.current?.value.trim();
    if (!cardName) return;

    try {
      const responseCard = await axios.post(
        "https://api.trello.com/1/cards",
        null,
        {
          params: { name: cardName, idList: list.id, ...API_CREDENTIALS },
        }
      );

      dispatch({
        type: "addNewCard",
        data: responseCard.data,
      });

      setStatus({
        ...status,
        isAddingCard: false,
      });
      inputFieldForNewCardName.current.value = "";
    } catch (error) {
      console.error("Error creating card:", error);
    }
  };

  async function handleDeleteCard() {
    let id = status.selectedCard.id;
    try {
      let response = await axios.delete(
        `https://api.trello.com/1/cards/${id}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );
      dispatch({
        type: "deleteCard",
        id: id,
      });
      setStatus({
        ...status,
        selectedCard: null,
      });
    } catch (err) {
      console.log("unable to deleted the card ", err.message);
    }
  }

  return (
    <>
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
            {cardsInList.cards.length > 0 ? (
              cardsInList.cards.map((card) => (
                <ListItem
                  key={card.id}
                  sx={styles.listItem}
                  onClick={() => handleCardClick(card)}
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
            {status.isAddingCard ? (
              <ListItem sx={styles.listItem}>
                <TextField
                  fullWidth
                  inputRef={inputFieldForNewCardName}
                  variant="outlined"
                  size="small"
                  autoFocus
                  placeholder="Enter card name"
                  sx={styles.textField}
                />
                <Button
                  sx={{ color: "white", marginLeft: 0.5 }}
                  onClick={handleAddNewCard}
                >
                  Add
                </Button>
                <Button
                  sx={{ color: "white", marginLeft: 0.5 }}
                  onClick={() =>
                    setStatus({
                      ...status,
                      isAddingCard: false,
                    })
                  }
                >
                  Cancel
                </Button>
              </ListItem>
            ) : (
              <Button
                startIcon={<AddIcon />}
                sx={{
                  ...styles.addButton,
                }}
                onClick={() =>
                  setStatus({
                    ...status,
                    isAddingCard: true,
                  })
                }
              >
                Add a card
              </Button>
            )}
          </List>
        </CardContent>
        {/* Delete Button */}
        <Button
          sx={{
            ...styles.deleteButton,
          }}
          onClick={() => handleArchiveList(list.id)}
        >
          Archive List
        </Button>
      </Card>

      <Modal
        open={status.selectedCard}
        onClose={handleClosePopup}
        // key={status.selectedCard}
      >
        <CheckList
          handleClosePopup={handleClosePopup}
          key={status.selectedCard}
          status={status}
          handleDeleteCard={handleDeleteCard}
        />
      </Modal>
    </>
  );
};

export default CardsInList;
