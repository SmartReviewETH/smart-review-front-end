import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Modalstyle } from "./styles/styles";
import { Alert, Stack, TextField } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import moment from "moment";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";

export default function InitiationModal() {
  const date = new Date();
  const { provider, walletAddress, SmartReviewContract } =
    React.useContext(EtherContext);
  const currentDate = moment(date);
  const [contact, setContract] = React.useState();
  const [type, setType] = React.useState("success"); //["success", "error"]
  const [ethprovider, setEthProvider] = React.useState();
  //form state
  const [open, setOpen] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [issuer, setIssuer] = React.useState("");
  const [bounty, setBounty] = React.useState(0);
  const [deadline, setDeadline] = React.useState(
    currentDate.format("YYYY-MM-DD")
  );
  const [iPfile, setIPFile] = React.useState(null);
  const [rqfile, setRqFile] = React.useState(null);

  const [submitFailed, setSubmitFailed] = React.useState(false);
  React.useEffect(() => {
    setIssuer(walletAddress);
    setContract(SmartReviewContract);
    setEthProvider(provider);
  }, [walletAddress, SmartReviewContract, provider]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChangeIpFile = (file) => {
    setIPFile(file);
  };
  const handleChangeRqFile = (file) => {
    setRqFile(file);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (iPfile === null || rqfile === null) {
      setSubmitFailed(true);
      return;
    }
    setSubmitFailed(false);
    const deadline_unix = moment(deadline).unix();

    console.log(deadline_unix, issuer, bounty, iPfile, rqfile);
    // submit the form
    // upload the files to ipfs server
    // get the hash of the files
    // interact with the smart contract to initiate the smart review
    if (contact && ethprovider) {
      contact
        .publishSmartReview([issuer], "234", "23423", deadline_unix, bounty)
        .then((tx) => {
          //action prior to transaction being mined
          ethprovider.waitForTransaction(tx.hash).then(() => {
            //action after transaction is mined
            console.log("transaction hash", tx.hash);
            setMsg(
              `Smart Review Initiated Successfully! Transaction Hash: ${tx.hash}`
            );
            setOpenSnackBar(true);
            setType("success");
          });
        })
        .catch(() => {
          //action to perform when user clicks "reject"
          setMsg(`Smart Review Initiated Failure! User Rejected!`);
          setOpenSnackBar(true);
          setType("error");
        });
    } else {
      setMsg(`Smart Review Initiated Failure! No wallet connected!`);
      setOpenSnackBar(true);
      setType("error");
    }
    setOpen(false);
  };
  return (
    <>
      <AutohideSnackbar
        isopen={openSnackBar}
        setOpen={setOpenSnackBar}
        msg={msg}
        type={type}
      />
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Start A SmartReview Now
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Modalstyle}>
          {submitFailed && (
            <Alert severity="error">Please upload both files!</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              sx={{ mb: 4 }}
              textAlign="center"
            >
              Initiate Your SmartReview
            </Typography>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="h6">Upload your IP file*</Typography>
                <FileUploader
                  handleChange={handleChangeIpFile}
                  name="ip file"
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" textAlign="center">
                  Upload Requirements file*
                </Typography>
                <FileUploader
                  handleChange={handleChangeRqFile}
                  name="requirement file"
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" textAlign="center">
                  Add Issuers' Addresses*
                </Typography>
                <TextField
                  onChange={(e) => setIssuer(e.target.value)}
                  required
                  variant="outlined"
                  color="secondary"
                  type="string"
                  fullWidth
                  value={issuer}
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" textAlign="center">
                  Set Bounty Amount(Smart Tokens)*
                </Typography>
                <TextField
                  onChange={(e) => setBounty(e.target.value)}
                  required
                  variant="outlined"
                  color="secondary"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  value={bounty}
                  fullWidth
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle1" textAlign="center">
                  Set Expire Date*
                </Typography>
                <TextField
                  InputProps={{
                    inputProps: { min: currentDate.format("YYYY-MM-DD") },
                  }}
                  type="date"
                  variant="outlined"
                  color="secondary"
                  onChange={(e) => setDeadline(e.target.value)}
                  value={deadline}
                  fullWidth
                  required
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={5}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
}
