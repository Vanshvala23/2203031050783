import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
} from '@mui/material';
import axios from 'axios';

export default function StatsPage() {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/stats')
      .then(res => setStats(res.data))
      .catch(err => {
        setError(err.response?.data?.error || 'Could not fetch stats.');
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Statistics</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {stats.length === 0 && !error ? (
        <Typography>No shortened URLs yet.</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Original URL</b></TableCell>
              <TableCell><b>Short Code</b></TableCell>
              <TableCell><b>Clicks</b></TableCell>
              <TableCell><b>Created At</b></TableCell>
              <TableCell><b>Expires At</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.originalUrl}</TableCell>
                <TableCell>{row.shortCode}</TableCell>
                <TableCell>{row.clickCount}</TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell>{new Date(row.expiryTime).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
