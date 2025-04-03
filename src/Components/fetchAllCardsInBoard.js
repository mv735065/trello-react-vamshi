import React from 'react'
import axios from "axios";
import API_CREDENTIALS from "../Credintials";


const fetchAllCardsInBoard = (id) => {
  return axios.get(
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
}

export default fetchAllCardsInBoard