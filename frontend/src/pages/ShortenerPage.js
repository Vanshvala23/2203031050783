import React, { useState } from 'react';
import UrlInput from '../components/UrlInput';
import UrlCard from '../components/UrlCard';
import { Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ShortenerPage() {
  const [urls, setUrls] = useState([]);
  const navigate = useNavigate();

  const handleShorten = (data) => {
    setUrls([...urls, ...data]);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <UrlInput onSubmit={handleShorten} />

      <Stack spacing={2} mt={3}>
        {urls.map((item, idx) => (
          <UrlCard key={idx} data={item} />
        ))}
      </Stack>

      <Button variant="outlined" sx={{ mt: 4 }} onClick={() => navigate('/stats')}>
        View Statistics
      </Button>
    </Container>
  );
}

export default ShortenerPage;
