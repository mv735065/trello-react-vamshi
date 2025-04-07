import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const ErrorPage = ({ errorMessage }) => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
        textAlign: 'center',
        borderRadius: '8px',
        padding: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" color="error" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          Oops!
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" color="textSecondary">
          {errorMessage || 'Something went wrong. Please try again later.'}
        </Typography>
      </Box>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '4px',
          textTransform: 'none',
        }}
      >
        Go Back to Home
      </Button>
    </Container>
  );
};

export default ErrorPage;
