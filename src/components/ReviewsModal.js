import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
  Alert,
  Link,
} from "@mui/material";
import React from "react";
import { Modalstyle } from "./styles/styles";
import CircularIndeterminate from "./LoadingCircle";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";
import MyGrid from "./MyGrid";
import { FileUploader } from "react-drag-drop-files";
import { Ipfsuploader } from "../utils/helper";
import { utils } from "ethers";

export function ReviewsModal({ open, onClose, title, id, status, data }) {
  const {
    walletAddress,
    provider,
    SmartReviewContract,
    governorContract,
    tokenContract,
  } = React.useContext(EtherContext);
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
  //web3 states
  const [contact, setContract] = React.useState();
  const [ethprovider, setEthProvider] = React.useState();
  const [govContract, setGovernorContract] = React.useState();
  //useeffect
  React.useEffect(() => {
    setContract(SmartReviewContract);
    setEthProvider(provider);
    setGovernorContract(governorContract);
  }, [SmartReviewContract, provider, governorContract]);
  const fetch = async () => {
    const ProposalState = [
      "Pending",
      "Active",
      "Canceled",
      "Defeated",
      "Succeeded",
      "Queued",
      "Expired",
      "Executed",
      "Not Found",
    ];
    setPending(true);
    if (contact && ethprovider && govContract) {
      // fetch all the reviews for the smart review id
      const reviews = await contact.getReviewsBySmartReviewId(id);
      const allReviews = [];
      for (let index = 0; index < reviews.length; index++) {
        let state = 8;
        try {
          state = await govContract.state(reviews[index].proposal_id);
        } catch (e) {
          // console.log("ignore this error", e);
        }

        allReviews.push({
          id: index,
          phase: reviews[index].phase === 0 ? "Active" : "Accepted",
          issuer: reviews[index].issuer,
          reviewFileHash: reviews[index].reviewFileHash,
          proposalId: reviews[index].proposal_id,
          state: ProposalState[state],
        });
      }
      setAllReviews(allReviews);
      setPending(false);
    }
  };
  React.useEffect(() => {
    fetch();
  }, [contact, ethprovider, govContract]);
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
    if (govContract && contact && ethprovider && cid && allReviews) {
      //open proposal on tally
      const encodedFn = contact.interface.encodeFunctionData("completeReview", [
        allReviews.length,
        id,
      ]);
      // console.log("contact address", contact.address);
      const proposal_id = await govContract.hashProposal(
        [contact.address],
        [0],
        [encodedFn],
        utils.keccak256(
          utils.toUtf8Bytes("Review Proposal for Smart Review ID " + id)
        )
      );
      const proposalId = proposal_id.toString();
      // initiate a dao proposal first
      let proposal_tx;
      try {
        proposal_tx = await govContract.propose(
          [contact.address],
          [0],
          [encodedFn],
          "Review Proposal for Smart Review ID " + id
        );
      } catch (e) {
        console.log("error", e);
        setMsg(
          `Review Submission Failure! This is likely caused by Delgation error! please go to Profile to delegate yourself first!`
        );
        setOpenSnackBar(true);
        setType("error");
        onClose();
        setPending(false);
        return;
      }
      //publish revew
      contact
        .publishReview(cid, id, proposalId)
        .then((tx) => {
          //action prior to transaction being mined
          //action after transaction is mined
          console.log("transaction hash", tx.hash);
          const reviewtxLink = `https://sepolia.etherscan.io/tx/${tx.hash}`;
          const proposaltxLink = `https://sepolia.etherscan.io/tx/${proposal_tx.hash}`;
          // alert
          setMsg(
            <div>
              Review Submitted Successfully! View Review tx on EtherScan:{" "}
              <Link href={reviewtxLink} target="_blank" rel="noreferrer">
                Link
              </Link>
              || View Proposal tx on EtherScan:{" "}
              <Link href={proposaltxLink} target="_blank" rel="noreferrer">
                Link
              </Link>
            </div>
          );
          setOpenSnackBar(true);
          setType("success");
          //upload finished
          setPending(false);
          onClose();
        })
        .catch(() => {
          //action to perform when user clicks "reject"
          // alert
          setMsg(`Review Submission Failure!User rejected`);
          setOpenSnackBar(true);
          setType("error");
          onClose();
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
                {status !== "COMPLETE"
                  ? "All Reviews for"
                  : "Archived Reviews for"}
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
              {status !== "COMPLETE" && walletAddress !== data.issuers[0] && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  flexWrap="wrap"
                  justifyContent={"center"}
                  useFlexGap
                >
                  <FileUploader
                    handleChange={handleChangeIpFile}
                    types={["JPG", "PNG", "JPEG"]}
                    name="ip file"
                  />

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSubmit}
                  >
                    Add Your Review
                  </Button>
                </Stack>
              )}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="contained" color="success" onClick={fetch}>
                  Refresh List
                </Button>
                <Button variant="contained" color="primary" onClick={onClose}>
                  Close
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Modal>
    </>
  );
}
