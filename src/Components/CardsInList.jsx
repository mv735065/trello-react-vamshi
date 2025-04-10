import React, { useRef, useState, useMemo } from "react";
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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";

import StylesCardInList from "./StylesCardInList";
import CheckList from "./CheckList";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCard,
  deleteCard,
  // setSelectedCard
} from "../Utils/cardSlice";
import { archiveList } from "../Utils/boardListSlice";

const CardsInList = ({ list }) => {
  const dispatch = useDispatch();
  const { cards } = useSelector((state) => state.card);

  const listId = list.id;
  const styles = StylesCardInList();

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const inputRef = useRef();

  const cardsInList = useMemo(() => cards?.filter(card => card.idList === listId), [cards, listId]);

  const handleAddNewCard = () => {
    const name = inputRef.current?.value.trim();
    if (!name) return;

    dispatch(addNewCard({ name, listId }));
    setIsAddingCard(false);
    inputRef.current.value = "";
  };

  const handleDeleteCard = (id) => {
    dispatch(deleteCard(id));
    setHoveredCard(null);
  };

  const handleCardClick = (card) => setSelectedCard(card);
  const handleClosePopup = () => setSelectedCard(null);
  // const handleClosePopup = () => dispatch(setSelectedCard(null));
  // const handleCardClick = (card) => dispatch(setSelectedCard(card));




  const handleArchive = () => dispatch(archiveList(listId));

  return (
    <>
      <Card sx={styles.card}>
        <Box sx={styles.box}>
          <Typography variant="subtitle1" fontWeight="bold">{list.name}</Typography>
          <MoreHorizIcon sx={{ fontSize: 18, cursor: "pointer" }} />
        </Box>

        <CardContent sx={styles.cardContent}>
          <List sx={{ padding: 0 }}>
            {cardsInList?.length ? (
              cardsInList.map((card) => (
                <ListItem
                  key={card.id}
                  sx={styles.listItem}
                  onClick={() => handleCardClick(card)}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {card.name}
                  {hoveredCard?.id === card.id && (
                    <IconButton
                      sx={{ position: "absolute", right: 0, color: "white" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="gray">
                No cards in this list
              </Typography>
            )}

            {isAddingCard ? (
              <ListItem sx={styles.listItem}>
                <TextField
                  fullWidth
                  inputRef={inputRef}
                  variant="outlined"
                  size="small"
                  autoFocus
                  placeholder="Enter card name"
                  sx={styles.textField}
                />
                <Button sx={{ color: "white", ml: 0.5 }} onClick={handleAddNewCard}>Add</Button>
                <Button sx={{ color: "white", ml: 0.5 }} onClick={() => setIsAddingCard(false)}>Cancel</Button>
              </ListItem>
            ) : (
              <Button
                startIcon={<AddIcon />}
                sx={styles.addButton}
                onClick={() => setIsAddingCard(true)}
              >
                Add a card
              </Button>
            )}
          </List>
        </CardContent>

        <Button sx={styles.deleteButton} onClick={handleArchive}>
          Archive List
        </Button>
      </Card>

      {selectedCard && (
        <Modal open={!!selectedCard} onClose={handleClosePopup}>
          <CheckList
            key={selectedCard.id}
            handleClosePopup={handleClosePopup}
            status={{ selectedCard }}
            handleDeleteCard={handleDeleteCard}
          />
        </Modal>
      )}
    </>
  );
};

export default CardsInList;
