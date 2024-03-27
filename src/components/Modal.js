import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Modalstyle } from "./styles/styles";
import { Alert, FormControl, Stack, TextField } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import moment from "moment";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";
import { Ipfsuploader, convertEthertoWei } from "../utils/helper";
import CircularIndeterminate from "./LoadingCircle";

export default function InitiationModal() {
  const date = new Date();
  const { provider, walletAddress, SmartReviewContract } =
    React.useContext(EtherContext);
  const currentDate = moment(date);
  //web3 states
  const [contact, setContract] = React.useState();
  const [issuer, setIssuer] = React.useState("");
  const [ethprovider, setEthProvider] = React.useState();

  const [type, setType] = React.useState("success"); //["success", "error"]
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const [bounty, setBounty] = React.useState("1");
  const [title, setTitle] = React.useState("");
  const [description, setDiscription] = React.useState("");
  const [deadline, setDeadline] = React.useState(
    currentDate.format("YYYY-MM-DD")
  );
  const [iPfile, setIPFile] = React.useState(null);
  const [rqfile, setRqFile] = React.useState(null);
  const [submitFailed, setSubmitFailed] = React.useState(false);
  //useeffect
  React.useEffect(() => {
    setIssuer(walletAddress);
    setContract(SmartReviewContract);
    setEthProvider(provider);
  }, [walletAddress, SmartReviewContract, provider]);
  //handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChangeIpFile = (file) => {
    setIPFile(file);
  };
  const handleChangeRqFile = (file) => {
    setRqFile(file);
  };
  const handleSubmit = async (event) => {
    // submit the form
    event.preventDefault();
    if (iPfile === null || rqfile === null) {
      // must upload both files
      setSubmitFailed(true);
      return;
    }
    setSubmitFailed(false);
    if (!ethprovider) {
      setMsg(`Smart Review Initiation Failure! No wallet connected!`);
      setOpenSnackBar(true);
      setType("error");
      return;
    }

    setPending(true);
    const deadline_unix = moment(deadline).unix();
    // upload the files to ipfs server
    const ipfile_result = await Ipfsuploader(iPfile, "this is a IP file");
    const rqfile_result = await Ipfsuploader(
      rqfile,
      "this is a requirement file"
    );
    // get the hash of the files
    const ipCid = ipfile_result.ipnft;
    const rqCid = rqfile_result.ipnft;
    console.log([issuer], ipCid, rqCid, deadline_unix, bounty);
    let bount_in_wei = convertEthertoWei(bounty).toString();
    // interact with the smart contract to initiate the smart review
    if (contact && ethprovider && ipCid && rqCid) {
      contact
        .publishSmartReview([issuer], ipCid, rqCid, deadline_unix, bount_in_wei, [
          title,
          description,
        ])
        .then((tx) => {
          //action prior to transaction being mined
          ethprovider.waitForTransaction(tx.hash).then(() => {
            //action after transaction is mined
            console.log("transaction hash", tx.hash);
            // alert
            setMsg(
              `Smart Review Initiated Successfully! Transaction Hash: ${tx.hash}`
            );
            setOpenSnackBar(true);
            setType("success");
            //upload finished
            setPending(false);
            setOpen(false);
          });
        })
        .catch(() => {
          //action to perform when user clicks "reject"
          // alert
          setMsg(`Smart Review Initiation Failure! User Rejected!`);
          setOpenSnackBar(true);
          setType("error");
          setOpen(false);
          setPending(false);
        });
    }
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
                <Typography variant="subtitle2" textAlign="center">
                  Title*
                </Typography>
                <TextField
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  variant="outlined"
                  color="secondary"
                  type="string"
                  fullWidth
                  value={title}
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" textAlign="center">
                  Description*
                </Typography>
                <TextField
                  onChange={(e) => setDiscription(e.target.value)}
                  required
                  variant="outlined"
                  color="secondary"
                  type="string"
                  fullWidth
                  value={description}
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">
                  Upload your IP file*
                </Typography>
                <FileUploader
                  handleChange={handleChangeIpFile}
                  name="ip file"
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" textAlign="center">
                  Upload Requirements file*
                </Typography>
                <FileUploader
                  handleChange={handleChangeRqFile}
                  name="requirement file"
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" textAlign="center">
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
                <Typography variant="subtitle2" textAlign="center">
                  Set Bounty Amount(Smart Tokens)*
                </Typography>
                <TextField
                  onChange={(e) => setBounty(e.target.value)}
                  required
                  variant="outlined"
                  color="secondary"
                  type="number"
                  InputProps={{
                    inputProps: { min: "1" },
                  }}
                  value={bounty}
                  fullWidth
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1} mb={2}>
                <Typography variant="subtitle2" textAlign="center">
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
              {pending ? (
                <CircularIndeterminate />
              ) : (
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
              )}
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
}
