import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import API_CREDENTIALS from "../Credintials";
import { Typography, Box, Grid, typographyClasses } from "@mui/material";
import CardsInList from "../Components/CardsInList";

const useBoardNavBarStyles = () => ({
  boardNavBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px",
    backgroundColor: "#f5f5f5",
    borderBottom: "2px solid #e0e0e0",
    width: "50vw", // Set navbar width to 50% of the viewport
    borderTopRightRadius: "50%", // Right side top rounded with 50% radius
    borderBottomRightRadius: "50%",
  },
  title: {
    fontWeight: 600,
    fontSize: "1.5rem",
    color: "black",
  },
});

const BoardList = () => {
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [listsOfBoard, setListsOfBoard] = useState([]);
  const [allCardsInBoard, setAllCardsInBoard] = useState([]);
  const styles = useBoardNavBarStyles();
  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const board = await axios.get(`https://api.trello.com/1/boards/${id}`, {
          params: {
            ...API_CREDENTIALS,
          },
          headers: {
            Accept: "application/json",
          },
        });

        const response1 = await axios.get(
          `https://api.trello.com/1/boards/${id}/lists`,
          {
            params: {
              ...API_CREDENTIALS,
            },
            headers: {
              Accept: "application/json",
            },
          }
        );
        const response2 = await axios.get(
          `https://api.trello.com/1/boards/${id}/cards`,
          {
            params: {
              ...API_CREDENTIALS,
            },
            headers: {
              Accept: "application/json",
            },
          }
        );
        setBoard(board.data);
        let lists=response1.data;
        setListsOfBoard(lists.filter((ele)=>!ele.closed));
        setAllCardsInBoard(response2.data);
      } catch (err) {
        console.log("Unable to fetch lists of board", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  const handleDeleteList = async (id) => {
    console.log(id);
    let value=true;
    try {
     let responsde= await axios.put(`https://api.trello.com/1/lists/${id}/closed`,
      null,
       {
      
        params: {value: true,...API_CREDENTIALS},
      });
      setListsOfBoard((prev)=>{
        return prev.filter((ele)=>{
          return ele.id!=id;
        })
      })
      console.log("List deleted successfully");

      // You can also notify the parent component that the list is deleted
    } catch (error) {
      console.error("Error deleting list:", error.message);
    }
  };

  let cardsForEachList = getcardsForEachList(allCardsInBoard);

  return isLoading ? (
    <Typography variant="h5">Loading...</Typography>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "90vh",
      }}
    >
      {/* Navbar (Fixed at the top) */}
      <Box className="boardNavBar" sx={styles.boardNavBar}>
        <Typography variant="h4" sx={styles.title}>
          {board.name}
        </Typography>
      </Box>

      {/* Scrollable Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowX: "auto",
          padding: 2,
          whiteSpace: "nowrap",
        }}
      >
        <Grid container spacing={2} wrap="nowrap" sx={{ height: "auto" }}>
          {listsOfBoard.map((ele) => {
            let id = ele.id;
            let cards = cardsForEachList[id];
            return (
              <Grid
                
                key={ele.id}
                sx={{ display: "inline-block", flexShrink: 0 }}
              >
                <CardsInList list={ele} cards={cards} handleDeleteList={handleDeleteList}/>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default BoardList;

function getcardsForEachList(allCardsInBoard) {
  return allCardsInBoard.reduce((acc, ele) => {
    let idList = ele.idList;
    if (!acc.hasOwnProperty(idList)) {
      acc[idList] = [];
    }
    acc[idList].push(ele);

    return acc;
  }, {});
}
