import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import URLShortenerPage from './components/URLShortenerPage';
import URLStatsPage from './components/URLStatsPage';
import RedirectPage from './components/RedirectPage';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AffordMed URL Shortener
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">Shortener</Button>
            <Button color="inherit" component={Link} to="/stats">Stats</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<URLShortenerPage />} />
        <Route path="/stats" element={<URLStatsPage />} />
        <Route path="/:shortCode" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
