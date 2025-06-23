import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function UrlCard({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body1"><strong>Original:</strong> {data.originalUrl}</Typography>
        {data.error ? (
          <Typography color="error">Error: {data.message}</Typography>
        ) : (
          <>
            <Typography><strong>Short:</strong> <a href={data.shortUrl}>{data.shortUrl}</a></Typography>
            <Typography variant="caption"><strong>Expires:</strong> {new Date(data.expiry).toLocaleString()}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default UrlCard;
