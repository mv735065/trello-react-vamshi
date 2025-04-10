import React from 'react'
import { useParams } from "react-router-dom";
import BoardList from '../Pages/BoardList';

const BoardListWrapper = () => {
    const { id } = useParams();
    return <BoardList key={id}  id={id}/>;
  };

export default BoardListWrapper