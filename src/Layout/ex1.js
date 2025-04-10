// File: src/pages/SingleBoardPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLists, createList } from '../redux/slices/listsSlice';
import { fetchCards, createCard } from '../redux/slices/cardsSlice';
import { Typography, Grid, Paper, Button, TextField, Box } from '@mui/material';

function SingleBoardPage() {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.lists);
  const cards = useSelector((state) => state.cards);
  const [newListName, setNewListName] = useState('');
  const [cardInputs, setCardInputs] = useState({});

  useEffect(() => {
    if (boardId) {
      dispatch(fetchLists(boardId));
    }
  }, [dispatch, boardId]);

  useEffect(() => {
    lists.forEach((list) => {
      dispatch(fetchCards(list.id));
    });
  }, [dispatch, lists]);

  const handleCreateList = () => {
    if (newListName.trim()) {
      dispatch(createList({ boardId, name: newListName }));
      setNewListName('');
    }
  };

  const handleCardInputChange = (listId, value) => {
    setCardInputs({ ...cardInputs, [listId]: value });
  };

  const handleCreateCard = (listId) => {
    const cardName = cardInputs[listId];
    if (cardName && cardName.trim()) {
      dispatch(createCard({ name: cardName, listId }));
      setCardInputs({ ...cardInputs, [listId]: '' });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Board ID: {boardId}
      </Typography>
      <Box display="flex" mb={3}>
        <TextField
          label="New List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleCreateList}>
          Add List
        </Button>
      </Box>
      <Grid container spacing={2}>
        {lists.map((list) => (
          <Grid item xs={12} sm={6} md={4} key={list.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{list.name}</Typography>
              {cards
                .filter((card) => card.idList === list.id)
                .map((card) => (
                  <Paper
                    key={card.id}
                    sx={{ mt: 1, p: 1 }}
                    elevation={1}
                  >
                    <Typography>{card.name}</Typography>
                  </Paper>
                ))}
              <TextField
                fullWidth
                placeholder="New card name"
                value={cardInputs[list.id] || ''}
                onChange={(e) => handleCardInputChange(list.id, e.target.value)}
                size="small"
                sx={{ mt: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleCreateCard(list.id)}
                sx={{ mt: 1 }}
              >
                Add Card
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default SingleBoardPage;



