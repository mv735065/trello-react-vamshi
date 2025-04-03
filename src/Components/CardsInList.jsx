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
  TextField,Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StylesCardInList from "./StylesCardInList";

// const modalStyles 

const CardsInList = ({ list, cards, handleArchiveList }) => {
  const [cardsInList, setCardsInList] = useState(cards || []);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const newCardTextRef = useRef();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsPopupOpen(true);
  };

  // Function to close the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCard(null);
  };

  let styles = StylesCardInList();

  console.log("Rendered CardsInList");

  // Handle submitting a new card
  const handleAddNewCard = async () => {
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

 async function handleDeleteCard(){
     let id=selectedCard.id;
      try{
         let response=await axios.delete(`https://api.trello.com/1/cards/${id}`,
          {
            params: { ...API_CREDENTIALS },
          }
         )
         setIsPopupOpen(false);
         setSelectedCard(null);
         setCardsInList((prev)=>{
          return prev.filter((ele)=>ele.id!=id)
         });
         

      }
      catch(err){
        console.log('unable to deleted the card ',err.message);
        
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
          {cardsInList.length > 0 ? (
            cardsInList.map((card) => (
              <ListItem key={card.id} sx={styles.listItem} onClick={() => handleCardClick(card)}>
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
                onClick={handleAddNewCard}
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
                ...styles.addButton,
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
          ...styles.deleteButton,
        }}
        onClick={() => handleArchiveList(list.id)}
      >
        Archive List
      </Button>
    </Card>
    <Modal open={isPopupOpen} onClose={handleClosePopup}>
        <Box sx={styles.modalStyles}>
          {/* Close Button */}
          <Button
            sx={styles.Xmark}
            onClick={handleClosePopup}
          >
            X
          </Button>

          <Typography variant="h5" gutterBottom  sx={{color:'white'}}>
            {selectedCard?.name}
          </Typography>

          {/* Buttons for Delete and Checklist */}
          <Box>
            <Button
              variant="contained"
              color="error"
              sx={{ marginRight: 2 }}
              onClick={handleDeleteCard}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => console.log("Checklist clicked", selectedCard?.id)}
            >
              Checklist
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default CardsInList;
