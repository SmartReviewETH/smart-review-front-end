
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
export function CardGrid({ data_array }) {
    return (
      <Grid container direction="row" spacing={3} alignItems="center" width={{ xs:"100%",sm: "80%"}} >
          {data_array.map((data) => {
              return <BasicCard data={data} />
          })}
        </Grid>
       
    );
}
export default function BasicCard({data}) {
  return (
    <Grid minWidth={380} item xs={12} sm={4} md={4} padding={1}>
      <Card>
        <CardContent>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            SmartReview Id: {data.id}
          </Typography>
          <Typography variant="h5" component="div">
            {data.title}
          </Typography>
          <Typography variant="body2">Status: {data.status}</Typography>
          <Typography variant="body2">
            Issuers: {data.issuers.map((issuer) => issuer + "\n")}
          </Typography>
          <Typography variant="body2">
            Bounty: {data.bountyAmount} SMT
          </Typography>
          <Typography sx={{ mb: 2 }} variant="body2">
            Balance: {data.currentBalance} SMT
          </Typography>
          <Typography variant="body2">{data.description}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="info" variant="contained">
            More Details
          </Button>
          <Button size="small" color="success" variant="contained">
            Contribute
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
  
}