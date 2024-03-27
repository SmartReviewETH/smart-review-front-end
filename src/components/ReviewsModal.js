import { Modal, Box, Typography, Stack, Button, Alert } from "@mui/material";
import React from "react";
import { Modalstyle } from "./styles/styles";
import CircularIndeterminate from "./LoadingCircle";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";
import MyGrid from "./MyGrid";
import { FileUploader } from "react-drag-drop-files";
import { Ipfsuploader } from "../utils/helper";

export function ReviewsModal({ open, onClose, title, id }) {
  const { provider, SmartReviewContract } = React.useContext(EtherContext);
  const [pending, setPending] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [type, setType] = React.useState("success"); //["success", "error"]
  const [file, setFile] = React.useState(null);
  const handleChangeIpFile = (file) => {
    setFile(file);
  };
  const [allReviews, setAllReviews] = React.useState([]);
  const [submitFailed, setSubmitFailed] = React.useState(false);

  const handleSubmit = async () => {
    if (file === null) {
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
    // upload the files to ipfs server
    const file_result = await Ipfsuploader(
      file,
      "this is a review file for the smart review id " + id
    );
    // get the hash of the files
    const cid = file_result.ipnft;
    // initiate a dao proposal
    console.log("cid", cid);
    // interact with the smart contract to initiate the smart review
    if (contact && ethprovider && cid) {
      contact
        .publishReview(cid, id)
        .then((tx) => {
          //action prior to transaction being mined
          ethprovider.waitForTransaction(tx.hash).then(() => {
            //action after transaction is mined
            console.log("transaction hash", tx.hash);
            // alert
            setMsg(
              `Review Submission Successfully! Transaction Hash: ${tx.hash}`
            );
            setOpenSnackBar(true);
            setType("success");
            //upload finished
            setPending(false);
            onClose();
          });
        })
        .catch(() => {
          //action to perform when user clicks "reject"
          // alert
          setMsg(`Review Submission Failure! User Rejected!`);
          setOpenSnackBar(true);
          setType("error");
          onClose();
          setPending(false);
        });
    }
  };
  //web3 states
  const [contact, setContract] = React.useState();
  const [ethprovider, setEthProvider] = React.useState();
  //useeffect
  React.useEffect(() => {
    setContract(SmartReviewContract);
    setEthProvider(provider);
  }, [SmartReviewContract, provider]);

  React.useEffect(() => {
    const fetch = async (e) => {
      setPending(true);
      if (contact && ethprovider) {
        // fetch all the reviews for the smart review id
        const reviews = await contact.getReviewsBySmartReviewId(id);
        const allReviews = reviews.map((review, index) => {
          return {
            id: index,
            phase: review.phase === 0 ? "Active" : "Accepted",
            issuer: review.issuer,
            reviewFileHash: review.reviewFileHash,
            votingLink: review.votingLink,
          };
        });
        setAllReviews(allReviews);
        setPending(false);
      }
    };
    fetch();
  }, [contact, ethprovider]);

  return (
    <>
      <AutohideSnackbar
        isopen={openSnackBar}
        setOpen={setOpenSnackBar}
        msg={msg}
        type={type}
      />
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Modalstyle}>
          {submitFailed && (
            <Alert severity="error">
              Please upload the Review files before submission!
            </Alert>
          )}
          {pending ? (
            <CircularIndeterminate />
          ) : (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Typography
                id="modal-modal-title"
                variant="h5"
                textAlign="center"
              >
                All the reviews for
              </Typography>

              <Typography
                component="span"
                variant="h5"
                sx={{
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "primary.main"
                      : "primary.light",
                }}
              >
                {title}
              </Typography>
              <MyGrid data={allReviews} />
              <Stack direction="row" alignItems="center" spacing={1}>
                <FileUploader
                  handleChange={handleChangeIpFile}
                  name="ip file"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Add Your Review
                </Button>
              </Stack>
              <Button variant="outlined" color="primary" onClick={onClose}>
                Close
              </Button>
            </Stack>
          )}
        </Box>
      </Modal>
    </>
  );
}
