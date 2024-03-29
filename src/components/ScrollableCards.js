import React from 'react';
import CardActions from '@mui/material/CardActions';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import moment from "moment";
import { ContributeModal } from './ContributeModal';

const convertUnixTimeToDate = (unixTime) => {
    let date = new Date(unixTime * 1000);
    return date.toLocaleString();
}

function BasicCard({ item, index }) {
    const [open, setOpen] = React.useState(false);
    const current_time = moment().unix();

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    return (
        <div>
        <ContributeModal
            open={open}
            onClose={handleClose}
            key={"modal" + item.id}
            title={item.title}
            id={item.id}
        />

        <Card key={index} sx={{ minWidth: 275, ml: 2, mr: 2 }}>
          <CardContent>
          <Typography variant="caption" color="text.secondary" gutterBottom>
              SmartReview Id: {item.id}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Status: {item.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Bounty: {item.bountyAmount} SMT | Balance: {item.currentBalance}{" "}
              SMT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deadline: {convertUnixTimeToDate(item.deadline)}
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {item.description}
            </Typography>
          </CardContent>

          <CardActions>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={() => {
                  window.open(
                    `https://${item.requirementsHash}.ipfs.dweb.link/`
                  );
                  window.open(`https://${item.ipHash}.ipfs.dweb.link/`);
                }}
              >
                Download Files
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={handleOpen}
              >
                Contribute
              </Button>

              {item.status === "ACTIVE" && item.deadline < current_time && (
                <Button size="small" color="success" variant="contained">
                  Complete
                </Button>
              )}
          </CardActions>
        </Card>
        </div>
    )
}

function ScrollableRowOfCards({ title, proposals }) {
  // Example array of items to display in cards. Replace with your actual data.
  console.log("There are " + proposals.length + " proposals.");

  return (
    <div>
    <Typography variant="h4" component="h2" sx={{ ml: 10, mt: 10, fontWeight: 'bold', fontSize: '30px' }}>
        {title}
    </Typography>

    <Box sx={{ overflowX: 'auto', display: 'flex', p: 1, ml: 10, mr: 10 }}>
      {proposals.map((item, index) => {
        return <BasicCard item={item} index={index} />
        })}
    </Box>
    </div>
  );
}

export default ScrollableRowOfCards;
