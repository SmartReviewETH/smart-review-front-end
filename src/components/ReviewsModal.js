import { Modal, Box, Typography, Stack, Button } from "@mui/material";
import React from "react";
import { Modalstyle } from "./styles/styles";
import CircularIndeterminate from "./LoadingCircle";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";
import MyGrid from "./MyGrid";

export function ReviewsModal({ open, onClose, title, id }) {
  const { provider, SmartReviewContract } = React.useContext(EtherContext);
  const [pending, setPending] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [type, setType] = React.useState("success"); //["success", "error"]

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
        // console.log(reviews);
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
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Typography id="modal-modal-title" variant="h5" textAlign="center">
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
            {pending ? <CircularIndeterminate /> : <MyGrid />}

            <Button variant="outlined" color="primary" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
