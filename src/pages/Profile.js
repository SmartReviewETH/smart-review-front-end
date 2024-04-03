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

const buildSmartReviewObj = (smartReview, id) => {
  const phaseMapping = {
    0: "ACTIVE",
    1: "Fund Raising",
    2: "EXPIRED",
    3: "COMPLETE",
  };

  let dataObj = {};

  dataObj.id = id;
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

  return dataObj;
};

const constructReviewObj = (review, voting_state, smartReview, reviewId, smartReviewId) => {
  const phaseMapping = { 0: "ACTIVE", 1: "ACCEPTED" };

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

  let dataObj = {};
  
  dataObj.smartReviewId = smartReviewId;
  dataObj.reviewId = reviewId;
  dataObj.issuer = review.issuer;
  dataObj.reviewFileHash = review.reviewFileHash;
  dataObj.review_status = phaseMapping[review.phase];
  dataObj.proposal_id = review.proposal_id;
  dataObj.voting_proposal_status = ProposalState[voting_state];
  dataObj.smartReview = buildSmartReviewObj(smartReview, smartReviewId);

  return dataObj;
}

async function updateProposalsList(SmartReviewContract, smartReviewcount, accountAddress, setProposalsList) {
  let allProposals = [];
  for (let i = 0; i < smartReviewcount; i++) {
    try {
      const smartReview = await SmartReviewContract.getSmartReviewById(
        i.toString()
      );

      let issuerFound = false;
      for (let j = 0; j < smartReview.issuers.length && !issuerFound; j++) {
        issuerFound = smartReview.issuers[j] == accountAddress;
      } // ignore proposals not proposed by this message sender
      if (!issuerFound) continue;

      allProposals.push(buildSmartReviewObj(smartReview, i));
    } catch (e) {
      console.error(
        `ERROR when fetching smart review id ${i}, SKIP!,\n the error is : ${e}`
      );
    }
  }
  setProposalsList(allProposals);
}

async function updateReviewsList(SmartReviewContract, smartReviewcount, accountAddress, setReviewsList, governorContract) {
    let allReviews = [];
    for (let i = 0; i < smartReviewcount; i++) {
      try {
        let reviews = await SmartReviewContract.getReviewsBySmartReviewId(
          i.toString()
        );
        let smartReview = await SmartReviewContract.getSmartReviewById(
          i.toString()
        );

        for (let j = 0; j < reviews.length; j++) {
          let review = reviews[j];
          if (review.issuer != accountAddress) continue;
          let voting_state = await governorContract.state(review.proposal_id);
          allReviews.push(constructReviewObj(review, voting_state, smartReview, j, i));
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
  const {
    walletAddress,
    provider,
    SmartReviewContract,
    governorContract,
    tokenContract,
    facetContract,
  } = React.useContext(EtherContext);

  const [proposalsList, setProposalsList] = React.useState([]); // data from the contract
  const [reviewsList, setReviewsList] = React.useState([]);
  const [isFetching, setIsFetching] = React.useState(true);
  const [delegationmsg, setDelegationMsg] = React.useState("");
  const [delegation, setDelegation] = React.useState(null);

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
        setDelegationMsg("You have " + vp + " SMT delegated to yourself ");
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
      const tx = await facetContract.getToken();
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
      updateProposalsList(
        SmartReviewContract,
        smartReviewcount,
        accountAddress,
        setProposalsList
      );
      updateReviewsList(
        SmartReviewContract,
        smartReviewcount,
        accountAddress,
        setReviewsList,
        governorContract
      );
      setIsFetching(false);
    }
    fetchData();
  }, [SmartReviewContract]);

  return (
    <>
      <Stack direction="column" alignItems={"center"} spacing={1}>
        <PageHeader
          title_front={"My"}
          title_back={"Profile"}
          subtitle={"This is your personal space for managing SmartReview."}
        />
        {!provider && (
          <Typography variant="h4" textAlign="center">
            Opps, please connect to your wallet first to view all the contents
            here.
          </Typography>
        )}
        {provider && (
          <Stack direction="row" alignItems={"center"} spacing={2}>
            <Card>
              <CardContent>
                <Typography
                  id="modal-modal-title"
                  textAlign="center"
                  mb={2}
                  fontWeight={600}
                >
                  Smart Token Faucet
                </Typography>

                <Stack sx={{ alignItems: "center" }} spacing={2}>
                  <Button variant="outlined" color="success" onClick={getSMT}>
                    Get SMT
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography
                  id="modal-modal-title"
                  textAlign="center"
                  mb={2}
                  fontWeight={600}
                >
                  My Voting Power(need at least 1 SMT)
                </Typography>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  textAlign="center"
                >
                  {delegationmsg}
                </Typography>

                <Stack sx={{ mt: 2, alignItems: "center" }} spacing={2}>
                  {!delegation && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddDelegation}
                    >
                      Delegate yourself
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Stack>
      <Stack flexDirection={"column"} justifyContent="center">
        {isFetching && provider && (
          <Typography variant="h4" textAlign="center">
            Fetching data from the contract...
          </Typography>
        )}
        {!isFetching && provider && (
          <ScrollableRowOfCards
            title={"My proposals"}
            data={proposalsList}
            cardType={"proposals"}
          />
        )}
        {!isFetching && provider && (
          <ScrollableRowOfCards
            title={"My reviews"}
            data={reviewsList}
            cardType={"reviews"}
          />
        )}
      </Stack>
    </>
  );
}
