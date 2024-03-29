import {
  Modal,
  Button,
  Box,
  Typography,
  Stack,
  TextField,
  Link,
} from "@mui/material";
import React from "react";
import { Modalstyle } from "./styles/styles";
import CircularIndeterminate from "./LoadingCircle";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";
import { convertEthertoWei } from "../utils/helper";

export function ContributeModal({ open, onClose, title, id }) {
  const { provider, walletAddress, SmartReviewContract, tokenContract } =
    React.useContext(EtherContext);
  const [pending, setPending] = React.useState(false);
  const [weiamount, setAmount] = React.useState("1");
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [type, setType] = React.useState("success"); //["success", "error"]

  //web3 states
  const [contact, setContract] = React.useState();
  const [issuer, setIssuer] = React.useState("");
  const [ethprovider, setEthProvider] = React.useState();
  //useeffect
  React.useEffect(() => {
    setIssuer(walletAddress);
    setContract(SmartReviewContract);
    setEthProvider(provider);
  }, [walletAddress, SmartReviewContract, provider]);
  const handleApprove = async () => {
    try {
      const tx = await tokenContract.approve(
        SmartReviewContract.address,
        convertEthertoWei("100").toString()
      );
      const txlink = `https://sepolia.etherscan.io/tx/${tx.hash}`;
      // alert
      setMsg(
        <div>
          Approve Successfully! View tx on EtherScan:{" "}
          <Link href={txlink} target="_blank" rel="noreferrer">
            Link
          </Link>
        </div>
      );
      setOpenSnackBar(true);
      setType("success");
      setPending(false);
    } catch (e) {
      console.log(e);
      setMsg(`approval Failure! User Rejected!`);
      setOpenSnackBar(true);
      setType("error");
      setPending(false);
      return;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const EtherToWei = convertEthertoWei(weiamount).toString();
    console.log(EtherToWei);
    // transfer smt tokens to the contract
    setPending(true);
    if (tokenContract) {
    }
    if (contact && ethprovider) {
      contact
        .addBountyToSmartReview(id, EtherToWei)
        .then((tx) => {
          //action prior to transaction being mined
          //action after transaction is mined
          console.log("transaction hash", tx.hash);
          // alert
          setType("success");
          const txlink = `https://sepolia.etherscan.io/tx/${tx.hash}`;
          // alert
          setMsg(
            <div>
              Contribution made Successfully! View tx on EtherScan:{" "}
              <Link href={txlink} target="_blank" rel="noreferrer">
                Link
              </Link>
            </div>
          );

          setOpenSnackBar(true);
          //tx finished
          setPending(false);
          onClose();
        })
        .catch((e) => {
          //action to perform when user clicks "reject"
          // alert
          console.log(e);
          setMsg(`Contribution Failure! User Rejected!`);
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
          <form onSubmit={handleSubmit}>
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
                Make Contribution to
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
              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" textAlign="center">
                  Approve first to transfer SMT for contribution*
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </Stack>

              <Stack direction="column" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" textAlign="center">
                  Type in the number of SMT tokens for Contribution (min of 1)*
                </Typography>
                <TextField
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  variant="outlined"
                  color="secondary"
                  type="number"
                  fullWidth
                  InputProps={{
                    inputProps: { min: "1" },
                  }}
                  value={weiamount}
                />
              </Stack>

              {pending ? (
                <CircularIndeterminate />
              ) : (
                <Stack direction="row" alignItems="center" spacing={5}>
                  <Button variant="contained" color="primary" type="submit">
                    Confirm
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onClose}
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
