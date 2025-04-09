import axios from "axios";
import React, { useReducer, useRef, useState, useEffect } from "react";
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
import OpenForm from "./OpenFormToCreate";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCard,
  deleteCard,
  setError,
} from "../Utils/CardSlice";

import { setSelectedCard } from "../Utils/SelectedCardSlice";

const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS = {
  key: apiKey,
  token: apiToken,
};

const CardsInList = ({ list, handleArchiveList }) => {
  const dispatch = useDispatch();
  const cardsData = useSelector((state) => state.card);
  let [form,setForm]=useState(false);
  let selectedCard=useSelector(state=>state.selectedCard);

  const handleCardClick = (card) => {
    dispatch(setSelectedCard(card));
  };

  const handleClosePopup = () => {
    dispatch(setSelectedCard(null));

  };

  let styles = StylesCardInList();
  console.log("Rendered CardsInList");

  const handleAddNewCard = async (cardName) => {

    if (!cardName) return;

    try {
      const responseCard = await axios.post(
        "https://api.trello.com/1/cards",
        null,
        {
          params: { name: cardName, idList: list.id, ...API_CREDENTIALS },
        }
      );

      dispatch(addNewCard(responseCard.data));
      setForm(false);

    } catch (error) {
      dispatch(setError("Error creating card:" + error.message));
    }
  };

  async function handleDeleteCard() {
    let id = selectedCard?.id;
    try {
      let response = await axios.delete(
        `https://api.trello.com/1/cards/${id}`,
        {
          params: { ...API_CREDENTIALS },
        }
      );
      dispatch(deleteCard(id));
    } catch (err) {
      dispatch(setError("unable to deleted the card " + err.message));
    }
  }

  function handleForm(value) {
    setForm(value);
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
            {cardsData.cards?.filter((card) => card.idList === list.id).length >
            0 ? (
              cardsData.cards
                .filter((card) => card.idList === list.id)
                .map((card) => (
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
            {form ? (
              <OpenForm
                handleAddNewList={handleAddNewCard}
                handleForm={handleForm}
                formName={"Enter the card Name"}
              />
            ) : (
             
              <Button
                startIcon={<AddIcon />}
                sx={{
                  ...styles.addButton,
                }}
                onClick={() => handleForm(true)}
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

      {/* {selectedCard &&  <Modal
        open={selectedCard}
        onClose={handleClosePopup}
      >
        <CheckList
          handleClosePopup={handleClosePopup}
          key={selectedCard?.id}
          selectedCard={selectedCard}
          handleDeleteCard={handleDeleteCard}
        />
      </Modal>} */}
    </>
  );
};

export default CardsInList;
