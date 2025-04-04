import React from 'react'
import axios from "axios";
import API_CREDENTIALS from "../Credintials";

// const apiKey = process.env.REACT_APP_API_KEY;
// const apiToken = process.env.REACT_APP_API_TOKEN;

// let API_CREDENTIALS={
//   key:apiKey,
//   token:apiToken
// }
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