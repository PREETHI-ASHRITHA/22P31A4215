import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Divider, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const URLStatsPage = () => {
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('shortened');
    if (stored) {
      setStats(JSON.parse(stored));
    }
  }, []);

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>URL Statistics</Typography>
        <Button variant="outlined" onClick={() => navigate('/')}>Back to Shortener</Button>
      </Box>
      {stats.length === 0 && <Alert severity="info">No shortened URLs found.</Alert>}
      {stats.map((entry, index) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
          <Typography><b>Short URL:</b> {window.location.origin}/{entry.shortCode}</Typography>
          <Typography><b>Long URL:</b> {entry.longUrl}</Typography>
          <Typography><b>Created:</b> {new Date(entry.createdAt).toLocaleString()}</Typography>
          <Typography><b>Expires in:</b> {entry.validity || 30} mins</Typography>
          <Typography><b>Clicks:</b> {entry.clicks}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2">Click Details (placeholder):</Typography>
          <Typography>- Timestamp: (not tracked)</Typography>
          <Typography>- Source: (not tracked)</Typography>
          <Typography>- Geo: (not tracked)</Typography>
        </Box>
      ))}
    </Container>
  );
};

export default URLStatsPage;
