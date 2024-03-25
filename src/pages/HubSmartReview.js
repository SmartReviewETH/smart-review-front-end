import * as React from "react";
import PageHeader from "../components/Pageheader";
import { Card, Grid, Stack, Typography } from "@mui/material";
import { CardGrid } from "../components/CardGrid";
import { EtherContext } from "../App";
import { ethers } from "ethers";
import { converWeiToEther } from "../utils/helper";

export function convertBigNumberToEtherString(bigNumber) {
  return Number(bigNumber._hex);
}
export default function SmartReviewHubPage() {
  const { provider,SmartReviewContract } = React.useContext(EtherContext);
  const phaseMapping = {0:"ACTIVE", 1:"PAUSED", 2:"EXPIRED", 3:"PAID"}
  const [isFetching, setIsFetching] = React.useState(true);
  const [data, setData] = React.useState(); // data from the contract
  React.useEffect(() => {
    // fetch data from the contract
    async function fetchData() {
      if (!SmartReviewContract) return;
      console.log("fetching data from the contract");
      const response = await SmartReviewContract.getSmartReviewsCount();
      const smartReviewcount = Number(response._hex);
      console.log("total smart reviews count: ", Number(response._hex));
      let allData = [];
      // get all the smart reviews
      for (let i = 0; i < smartReviewcount; i++) {
        let dataObj = {};
        const smartReview = await SmartReviewContract.getSmartReviewById(
          i.toString()
        );

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
        dataObj.deadline = convertBigNumberToEtherString(smartReview.deadline);
        dataObj.issuers = smartReview.issuers;
        dataObj.requirementsHash = smartReview.requirementsHash;
        dataObj.ipHash = smartReview.ipHash;
        WeiToEther = convertBigNumberToEtherString(smartReview.currentBalance);
        WeiToEther = converWeiToEther(WeiToEther.toString());

        dataObj.currentBalance = WeiToEther;
        dataObj.title = smartReview.info[0];
        dataObj.description = smartReview.info[1];
        allData.push(dataObj);
      }
      console.log("allData: ", allData);
      setIsFetching(false);
      setData(allData);
    }
    fetchData();
  }, [SmartReviewContract]);
  return (
    <Stack flexDirection="column" alignItems="center" justifyContent="center">
      <PageHeader
        title_front={"SmartReview"}
        title_back={"Hub"}
        subtitle="Central hub for the SmartReview community. Review or contribute to all the amazing works and earn rewards!"
      />
      {!provider && <Typography variant="h4" textAlign="center">Opps, please connect to your wallet first to view all the contents here.</Typography>}
      {isFetching && provider && (<Typography variant="h4" textAlign="center">Fetching data from the contract...</Typography>)}
      {!isFetching && provider && (<CardGrid data_array={data}/>)}
     
    </Stack>
  );
}
