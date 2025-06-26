import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Alert, IconButton, Snackbar, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { logEvent } from './LoggerMiddleware';
import { isValidUrl, isAlphanumeric, generateCode } from '../utils';

const MAX_URLS = 5;

const URLShortenerPage = () => {
  const [urls, setUrls] = useState([
    { longUrl: '', validity: '', customCode: '' },
  ]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState('');

  // Handle input changes for each URL row
  const handleInputChange = (index, field, value) => {
    const updated = [...urls];
    updated[index][field] = value;
    setUrls(updated);
  };

  // Add a new URL input row
  const addUrlField = () => {
    if (urls.length < MAX_URLS) {
      setUrls([...urls, { longUrl: '', validity: '', customCode: '' }]);
    }
  };

  // Remove a URL input row
  const removeUrlField = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  // Handle the Shorten URLs action
  const handleShorten = async () => {
    setError('');
    setSuccess('');
    let usedCodes = new Set();
    let stored = localStorage.getItem('shortened');
    if (stored) {
      JSON.parse(stored).forEach((item) => usedCodes.add(item.shortCode));
    }

    // Validate all inputs
    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, customCode } = urls[i];
      if (!isValidUrl(longUrl)) {
        setError(`Row ${i + 1}: Invalid URL format.`);
        await logEvent('frontend', 'error', 'component', `Invalid URL format: ${longUrl}`);
        return;
      }
      if (validity && (!Number.isInteger(Number(validity)) || Number(validity) <= 0)) {
        setError(`Row ${i + 1}: Validity must be a positive integer.`);
        await logEvent('frontend', 'error', 'component', `Invalid validity: ${validity}`);
        return;
      }
      if (customCode) {
        if (!isAlphanumeric(customCode) || customCode.length > 16) {
          setError(`Row ${i + 1}: Custom code must be alphanumeric and <= 16 chars.`);
          await logEvent('frontend', 'error', 'component', `Invalid custom code: ${customCode}`);
          return;
        }
        if (usedCodes.has(customCode)) {
          setError(`Row ${i + 1}: Custom code already used.`);
          await logEvent('frontend', 'error', 'component', `Custom code collision: ${customCode}`);
          return;
        }
        usedCodes.add(customCode);
      }
    }

    // All valid, proceed
    const shortened = urls.map((item) => {
      let code = item.customCode || generateCode();
      while (usedCodes.has(code)) {
        code = generateCode();
      }
      usedCodes.add(code);
      return {
        ...item,
        shortCode: code,
        createdAt: new Date(),
        validity: item.validity || 30,
        clicks: 0,
      };
    });
    setResults(shortened);
    localStorage.setItem('shortened', JSON.stringify(shortened));
    setSuccess('Shortened successfully!');
    setUrls([{ longUrl: '', validity: '', customCode: '' }]);
    await logEvent('frontend', 'info', 'component', 'Shorten URL(s) triggered');
  };

  // Copy short URL to clipboard
  const handleCopy = (shortCode) => {
    const url = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(url);
    setCopied(shortCode);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {urls.map((url, index) => (
        <Box key={index} sx={{ mb: 2, border: '1px solid #eee', p: 2, borderRadius: 2 }}>
          <TextField label="Long URL" fullWidth margin="normal" value={url.longUrl} onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)} />
          <TextField label="Validity (mins)" type="number" fullWidth margin="normal" value={url.validity} onChange={(e) => handleInputChange(index, 'validity', e.target.value)} />
          <TextField label="Custom Code (optional)" fullWidth margin="normal" value={url.customCode} onChange={(e) => handleInputChange(index, 'customCode', e.target.value)} />
          {urls.length > 1 && (
            <Button color="error" onClick={() => removeUrlField(index)} sx={{ mt: 1 }}>Remove</Button>
          )}
        </Box>
      ))}
      <Button onClick={addUrlField} variant="outlined" sx={{ mr: 2 }} disabled={urls.length >= MAX_URLS}>Add URL</Button>
      <Button onClick={handleShorten} variant="contained" sx={{ mt: 2 }}>Shorten URLs</Button>

      <Typography variant="h6" sx={{ mt: 4 }}>Results:</Typography>
      {results.map((r, i) => (
        <Box key={i} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ flexGrow: 1 }}>
            <b>{window.location.origin}/{r.shortCode}</b> → {r.longUrl} (Expires in {r.validity} mins)
          </Typography>
          <Tooltip title={copied === r.shortCode ? 'Copied!' : 'Copy'}>
            <IconButton onClick={() => handleCopy(r.shortCode)}>
              <ContentCopyIcon color={copied === r.shortCode ? 'success' : 'action'} />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
      <Snackbar
        open={!!copied}
        autoHideDuration={1500}
        onClose={() => setCopied('')}
        message="Short URL copied!"
      />
    </Container>
  );
};

export default URLShortenerPage;
