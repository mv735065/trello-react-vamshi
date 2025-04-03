import React from 'react'
import axios from "axios";
import API_CREDENTIALS from "../Credintials";


const fetchSingleBoard = (id) => {
  return axios.get(`https://api.trello.com/1/boards/${id}`, {
    params: {
      ...API_CREDENTIALS,
    },
    headers: {
      Accept: "application/json",
    },
  });
}

export default fetchSingleBoard