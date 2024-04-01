import React from 'react';
import CardActions from '@mui/material/CardActions';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import moment from "moment";
import { ContributeModal } from "./ContributeModal";
import { ReviewsModal } from './ReviewsModal';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const convertUnixTimeToDate = (unixTime) => {
  let date = new Date(unixTime * 1000);
  return date.toLocaleString();
};

function BasicProposalCard({ item, index }) {
  const [open, setOpen] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const current_time = moment().unix();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenReview = () => {
    setOpenReview(true);
  }
  const handleCloseReview = () => {
    setOpenReview(false);
  };

  return (
    <div>
      <ContributeModal
        open={open}
        onClose={handleClose}
        key={"modal" + item.id}
        title={item.title}
        id={item.id}
      />

      <ReviewsModal
        key={"Reviewmodal" + item.id}
        open={openReview}
        onClose={handleCloseReview}
        title={item.title}
        id={item.id}
        status={item.status}
        data={item}
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
            Bounty: {item.bountyAmount} SMT | Balance: {item.currentBalance} SMT
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deadline: {convertUnixTimeToDate(item.deadline)}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {item.description}
          </Typography>
        </CardContent>

        <CardActions>
          {(item.status === "ACTIVE" || item.status === "COMPLETE") && (
            <Button
              size="small"
              color="info"
              variant="contained"
              onClick={handleOpenReview}
            >
              Reviews
            </Button>
          )}

          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={() => {
              window.open(`https://${item.requirementsHash}.ipfs.dweb.link/`);
              window.open(`https://${item.ipHash}.ipfs.dweb.link/`);
            }}
          >
            Download Files
          </Button>
          {item.status !== "COMPLETE" && item.deadline > current_time && (
            <Button size="small" variant="contained" onClick={handleOpen}>
              Contribute
            </Button>
          )}

          {item.status === "ACTIVE" && item.deadline < current_time && (
            <Button size="small" color="success" variant="contained">
              Complete
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
}

function BasicReviewCard({ item, index }) {
  const handleClick = () => {
    console.log("Clicked on proposal_id: " + item.proposal_id);
    window.location.href = `https://www.tally.xyz/gov/test-78/proposal/${item.proposal_id}`;
  };

  return (
    <Card key={index} sx={{ minWidth: 275, ml: 2, mr: 2 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            SmartReview Id {item.smartReviewId}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            Review Id {item.reviewId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review status: {item.review_status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Voting proposal status: {item.voting_proposal_status}
          </Typography>

        </CardContent>
      
        <CardActions>
          <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => {
                window.open(`https://${item.reviewFileHash}.ipfs.dweb.link/`);
              }}
            >
              Download Review
            </Button>
            <IconButton aria-label="link" onClick={handleClick}>
              <OpenInNewIcon />
          </IconButton>
        </CardActions>
    </Card>
  )
}

function ScrollableRowOfCards({ title, data, cardType }) {
  // Example array of items to display in cards. Replace with your actual data.
  console.log("There are " + data.length + " " + cardType + "(s).");

  return (
    <div>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mt: 4, mb: 2 }}
        textAlign="center"
      >
        {title}
      </Typography>

      <Box
        sx={{
          overflowX: "auto",
          display: "flex",
          width: "100%",
        }}
      >
        
      {(() => {
        if (cardType == "proposals") {
          return data.map((item, index) => {
            return <BasicProposalCard item={item} index={index} />;
          });
        } else if (cardType == "reviews") {
            return data.map((item, index) => {
              return <BasicReviewCard item={item} index={index} />;
            });
        } else {
          return <p>Wrong type.</p>;
        }
      })()}
        
      </Box>
    </div>
  );
}

export default ScrollableRowOfCards;
