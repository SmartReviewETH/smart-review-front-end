import * as React from "react";
import { Button, Card, CardContent } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/Pageheader";
import ScrollableRowOfCards from "../components/ScrollableCards";
import { converWeiToEther } from "../utils/helper";

import { EtherContext } from "../App";

export function convertBigNumberToEtherString(bigNumber) {
  return Number(bigNumber._hex);
}

async function updateProposalsList(SmartReviewContract, smartReviewcount, accountAddress, setProposalsList) {
  const phaseMapping = {
    0: "ACTIVE",
    1: "Fund Raising",
    2: "EXPIRED",
    3: "COMPLETE",
  };
  let allProposals = [];
  for (let i = 0; i < smartReviewcount; i++) {
    let dataObj = {};
    try {
      const smartReview = await SmartReviewContract.getSmartReviewById(
        i.toString()
      );

      let issuerFound = false;
      for (let j = 0; j < smartReview.issuers.length && !issuerFound; j++) {
        issuerFound = smartReview.issuers[j] == accountAddress;
      } // ignore proposals not proposed by this message sender
      if (!issuerFound) continue;

      dataObj.id = i;
      dataObj.status = phaseMapping[smartReview.phase];
      dataObj.title = smartReview.title || "No title provided";
      dataObj.description =
        smartReview.description || "No description provided";
      let WeiToEther = convertBigNumberToEtherString(
        smartReview.bountyAmount
      );
      WeiToEther = converWeiToEther(WeiToEther.toString());
      dataObj.bountyAmount = WeiToEther;
      dataObj.deadline = convertBigNumberToEtherString(
        smartReview.deadline
      );
      dataObj.issuers = smartReview.issuers;
      dataObj.requirementsHash = smartReview.requirementsHash;
      dataObj.ipHash = smartReview.ipHash;
      WeiToEther = convertBigNumberToEtherString(
        smartReview.currentBalance
      );
      WeiToEther = converWeiToEther(WeiToEther.toString());

      dataObj.currentBalance = WeiToEther;
      dataObj.title = smartReview.info[0];
      dataObj.description = smartReview.info[1];
      allProposals.push(dataObj);
    } catch (e) {
      console.error(
        `ERROR when fetching smart review id ${i}, SKIP!,\n the error is : ${e}`
      );
    }
  }
  setProposalsList(allProposals);
}

async function updateReviewsList(SmartReviewContract, smartReviewcount, accountAddress, setReviewsList) {
  const phaseMapping = { 0: "ACTIVE", 1: "ACCEPTED" };

  let allReviews = [];
  for (let i = 0; i < smartReviewcount; i++) {
    try {
      let reviews = await SmartReviewContract.getReviewsBySmartReviewId(
        i.toString()
      );
      for (let j = 0; j < reviews.length; j++) {
        let review = reviews[j];
        if (review.issuer != accountAddress) continue;
        let dataObj = {};
        
        dataObj.smartReviewId = i;
        dataObj.reviewId = j;
        dataObj.issuer = review.issuer;
        dataObj.reviewFileHash = review.reviewFileHash;
        dataObj.status = phaseMapping[review.phase];

        allReviews.push(dataObj);
      }
    } catch (e) {
      console.error(
        `ERROR when fetching reviews at smart review id ${i}, SKIP!,\n the error is : ${e}`
      );
    }
  }

  setReviewsList(allReviews);
  console.log(allReviews);
}

export default function Profile() {
  const { walletAddress, provider, SmartReviewContract, tokenContract } =
    React.useContext(EtherContext);
  const [proposalsList, setProposalsList] = React.useState([]); // data from the contract
  const [reviewsList, setReviewsList] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);
  const [delegationmsg, setDelegationMsg] = React.useState("");
  const [delegation, setDelegation] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      if (!tokenContract || !walletAddress) return;
      const tx = await tokenContract.delegates(walletAddress);
      const tx2 = await tokenContract.getVotes(walletAddress);
      const vp = converWeiToEther(tx2);
      if (tx == 0x0000000000000000000000000000000000000000) {
        setDelegation(false);
        setDelegationMsg("You have not delegated your voting power");
      } else {
        setDelegation(true);
        setDelegationMsg(
          "You have " +
            vp +
            " SMT(need at least 1 SMT to vote and review) delegated to yourself "
        );
      }
    }
    fetchData();
  }, [tokenContract, walletAddress]);
  const handleAddDelegation = async () => {
    try {
      const tx = await tokenContract.delegate(walletAddress);
    } catch (e) {
      console.error(e);
    }
  };
  const getSMT = async () => {
    try {
      // const tx = await tokenContract.transferFrom(walletAddress);
    } catch (e) {
      console.error(e);
    }
  };
  React.useEffect(() => {
    async function fetchData() {
      if (!SmartReviewContract) return;
      console.log("fetching data from the contract");

      const response = await SmartReviewContract.getSmartReviewsCount();
      const smartReviewcount = Number(response._hex);
      console.log("total smart reviews count: ", Number(response._hex));

      const signer = await provider.getSigner();
      const accountAddress = await signer.getAddress();
      // get the wallet address
      console.log("wallet address: " + accountAddress);
      // get all the smart reviews
      updateProposalsList(SmartReviewContract, smartReviewcount, accountAddress, setProposalsList);
      updateReviewsList(SmartReviewContract, smartReviewcount, accountAddress, setReviewsList);
      setIsFetching(false);
    }
    fetchData();
  }, [SmartReviewContract]);

  return (
    <>
      <Stack direction="column" alignItems={"center"}>
        <PageHeader
          title_front={"Your"}
          title_back={"Profile"}
          subtitle={"This is your personal space for managing SmartReview."}
        />
        <Card>
          <CardContent>
            <Typography
              id="modal-modal-title"
              textAlign="center"
              mb={2}
              fontWeight={600}
            >
              Your voting Power
            </Typography>
            <Typography id="modal-modal-title" variant="h6" textAlign="center">
              {delegationmsg}
            </Typography>

            <Stack sx={{ mt: 2, alignItems: "center" }}>
              {!delegation && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddDelegation}
                >
                  Delegate yourself
                </Button>
              )}
              {/* <Button variant="contained" color="primary" onClick={getSMT}>
                Get SMT
              </Button> */}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
      {!provider && (
        <Typography variant="h4" textAlign="center">
          Opps, please connect to your wallet first to view all the contents
          here.
        </Typography>
      )}
      {isFetching && provider && (
        <Typography variant="h4" textAlign="center">
          Fetching data from the contract...
        </Typography>
      )}
      {!isFetching && provider && (
        <ScrollableRowOfCards title={"My proposals"} data={proposalsList} cardType={"proposals"} />
      )}
      {!isFetching && provider && (
        <ScrollableRowOfCards title={"My reviews"} data={reviewsList} cardType={"reviews"} />
      )}
    </>
  );
}
