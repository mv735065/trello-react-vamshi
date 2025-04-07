import React from 'react'
import { Typography, Box, Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
        width:'100vw',
        textAlign: 'center',
        borderRadius: '8px',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h1" color="error" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
          404
        </Typography>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" color="textSecondary">
          Oops! The page you're looking for doesn't exist.
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
  )
}

export default NotFoundPage
