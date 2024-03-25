import {  Modal, Button, Box, Typography, Stack, TextField } from '@mui/material';
import React from 'react';
import { Modalstyle2 } from './styles/styles';
import CircularIndeterminate from './LoadingCircle';
import { EtherContext } from '../App';
import AutohideSnackbar from './MySnackBar';
import { convertEthertoWei } from '../utils/helper';

export function ContributeModal({ open, onClose, title, id }){
  const { provider, walletAddress, SmartReviewContract } =
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const EtherToWei = convertEthertoWei(weiamount);
    console.log(EtherToWei.toString());
    // transfer smt tokens to the contract
    setPending(true);
    if (contact && ethprovider) {
      contact
        .addBountyToSmartReview(id, EtherToWei.toString())
        .then((tx) => {
          //action prior to transaction being mined
          ethprovider.waitForTransaction(tx.hash).then(() => {
            //action after transaction is mined
            console.log("transaction hash", tx.hash);
            // alert
            setMsg(
              `Contribution made Successfully! Please refresh to see the update value. Transaction Hash: ${tx.hash}`
            );
            setOpenSnackBar(true);
            setType("success");
            //tx finished
            setPending(false);
            onClose();
          });
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
        <Box sx={Modalstyle2}>
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
};

