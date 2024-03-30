
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Link, Stack } from "@mui/material";
import { ContributeModal } from "./ContributeModal";
import moment from "moment";
import { ReviewsModal } from "./ReviewsModal";
import AutohideSnackbar from "./MySnackBar";
import { EtherContext } from "../App";
export function CardGrid({ data_array }) {
  return (
    <Grid
      container
      direction="row"
      spacing={3}
      alignItems="center"
      width={{ xs: "100%", sm: "80%" }}
    >
      {data_array.map((data) => {
        return <BasicCard data={data} />;
      })}
    </Grid>
  );
}
export default function BasicCard({ data }) {
  const { provider, SmartReviewContract } = React.useContext(EtherContext);
  const current_time = moment().unix();
  const [open, setOpen] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [msg, setMsg] = React.useState();
  const [type, setType] = React.useState("success"); //["success", "error"
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const handleComplete = async () => {
    try {
      const tx = await SmartReviewContract.completeSmartReview(data.id);
      const txlink = `https://sepolia.etherscan.io/tx/${tx.hash}`;
      // alert
      setMsg(
        <div>
          Smart Review Completed Successfully! View tx on EtherScan:{" "}
          <Link href={txlink} target="_blank" rel="noreferrer">
            Link
          </Link>
        </div>
      );
      setType("success");
      setOpenSnackBar(true);
    } catch (e) {
      console.log(e);
      setOpenSnackBar(true);
      setMsg(`Smart Review Completion Failure!`);
      setType("error");
    }
  };
  return (
    <>
      <AutohideSnackbar
        isopen={openSnackBar}
        msg={msg}
        type={type}
        setOpen={setOpenSnackBar}
      />
      <ContributeModal
        key={"modal" + data.id}
        open={open}
        onClose={() => setOpen(false)}
        title={data.title}
        id={data.id}
      />
      <ReviewsModal
        key={"Reviewmodal" + data.id}
        open={openReview}
        onClose={() => setOpenReview(false)}
        title={data.title}
        id={data.id}
        status={data.status}
        data={data}
      />

      <Grid key={data.id} minWidth={380} item xs={12} sm={4} md={4} padding={1}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              SmartReview Id: {data.id}
            </Typography>
            <Typography variant="h5" component="div" sx={{ mb: 1 }}>
              {data.title}
            </Typography>
            <Typography variant="body2">Status: {data.status}</Typography>
            <Typography variant="body2">
              Issuers: {data.issuers?.map((issuer) => issuer + "\n")}
            </Typography>

            <Typography variant="body2">
              Bounty: {data.bountyAmount} SMT | Balance: {data.currentBalance}{" "}
              SMT
            </Typography>
            <Typography variant="body2">
              Deadline: {moment.unix(data.deadline).format("MM/DD/YYYY")}
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {data.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
              {(data.status === "ACTIVE" || data.status === "COMPLETE") && (
                <Button
                  size="small"
                  color="info"
                  variant="contained"
                  onClick={() => setOpenReview(true)}
                >
                  Reviews
                </Button>
              )}
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={() => {
                  window.open(
                    `https://${data.requirementsHash}.ipfs.dweb.link/`
                  );
                  window.open(`https://${data.ipHash}.ipfs.dweb.link/`);
                }}
              >
                Download Files
              </Button>
              {data.status !== "COMPLETE" && data.deadline > current_time && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setOpen(true)}
                >
                  Contribute
                </Button>
              )}
              {data.status === "ACTIVE" && data.deadline < current_time && (
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  onClick={handleComplete}
                >
                  Complete
                </Button>
              )}
            </Stack>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}