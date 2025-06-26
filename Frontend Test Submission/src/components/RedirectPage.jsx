import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Alert } from '@mui/material';

const RedirectPage = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const stored = localStorage.getItem('shortened');
    if (stored) {
      const urls = JSON.parse(stored);
      const found = urls.find(u => u.shortCode === shortCode);
      if (found) {
        window.location.href = found.longUrl;
      }
    }
  }, [shortCode]);

  return (
    <Container>
      <Alert severity="error" sx={{ mt: 4 }}>
        Invalid or expired short URL.
      </Alert>
    </Container>
  );
};

export default RedirectPage;
