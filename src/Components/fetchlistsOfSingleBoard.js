import React from 'react'
import axios from "axios";
const apiKey = import.meta.env.VITE_API_KEY;
const apiToken = import.meta.env.VITE_API_TOKEN;

let API_CREDENTIALS={
  key:apiKey,
  token:apiToken
}



const fetchlistsOfSingleBoard = (id) => {
  return  axios.get(
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
}

export default fetchlistsOfSingleBoard;