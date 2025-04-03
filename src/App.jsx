import { useState } from 'react';
import { Typography } from '@mui/material';
import MainLayout from './Layout/MainLayout';
import  HomePage  from './Pages/HomePage';
import BoardList from './Pages/BoardList';

import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/boards/:id" element={<BoardList />}/>

      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
