import React from "react";
import { EtherContext } from "../App";
import AutohideSnackbar from "./MySnackBar";
import { Modal } from "@mui/material";
import { Box } from "@mui/system";
import { Modalstyle } from "./styles/styles";
import BasicCard from "./CardGrid";

export function SmartReviewModal({ open, onClose, smartReview}) {
    console.log("entering smart review model: ", smartReview);

    const {
        walletAddress,
        provider,
        SmartReviewContract,
        governorContract,
        tokenContract,
        facetContract,
      } = React.useContext(EtherContext);

    const [pending, setPending] = React.useState(false);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [msg, setMsg] = React.useState("");
    const [type, setType] = React.useState("success"); //["success", "error"]

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
                <BasicCard
                    data={smartReview}
                />
            </Box>
        </Modal>
        </>
    );
}