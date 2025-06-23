import { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import axios from 'axios';

export default function UrlInputForm({ onSubmit }) {
  const [inputs, setInputs] = useState([
    { originalUrl: '', validity: '', shortCode: '' }
  ]);

  const handleChange = (i, field, val) => {
    const newInputs = [...inputs];
    newInputs[i][field] = val;
    setInputs(newInputs);
  };

  const addRow = () => {
    if (inputs.length < 5) setInputs([...inputs, { originalUrl: '', validity: '', shortCode: '' }]);
  };

  const handleSubmit = async () => {
    const results = [];
    for (const input of inputs) {
      try {
        const res = await axios.post('http://localhost:5000/shorten', input);
        results.push({ ...res.data, originalUrl: input.originalUrl });
      } catch (err) {
        results.push({ originalUrl: input.originalUrl, error: true, message: err.response?.data?.error });
      }
    }
    onSubmit(results);
  };

  return (
    <>
      {inputs.map((entry, i) => (
        <Grid container spacing={2} key={i} mt={1}>
          <Grid item xs={5}><TextField fullWidth label="Original URL" value={entry.originalUrl} onChange={e => handleChange(i, 'originalUrl', e.target.value)} /></Grid>
          <Grid item xs={3}><TextField fullWidth label="Validity (min)" value={entry.validity} onChange={e => handleChange(i, 'validity', e.target.value)} /></Grid>
          <Grid item xs={4}><TextField fullWidth label="Custom Code" value={entry.shortCode} onChange={e => handleChange(i, 'shortCode', e.target.value)} /></Grid>
        </Grid>
      ))}
      <Button onClick={addRow} sx={{ mt: 2 }}>+ Add</Button>
      <Button onClick={handleSubmit} sx={{ mt: 2, ml: 2 }} variant="contained">Shorten</Button>
    </>
  );
}
