import * as React from "react";
import PageHeader from "../components/Pageheader";
import { Card, Grid, Stack, Typography } from "@mui/material";
import { CardGrid } from "../components/CardGrid";
import { EtherContext } from "../App";

export function convertBigNumberToEtherString(bigNumber) {
  return Number(bigNumber._hex);
}
export default function SmartReviewHubPage() {
  const { SmartReviewContract } = React.useContext(EtherContext);
  const phaseMapping = {0:"ACTIVE", 1:"PAUSED", 2:"EXPIRED", 3:"PAID"}
  const [isFetching, setIsFetching] = React.useState(true);
  const [data, setData] = React.useState([
    {
      id: 1,
      title: "title1",
      status: "Active",
      description: "here is some description",
    },
    {
      id: 2,
      title: "title1",
      status: "Active",
      description: "here is some description2",
    },
    {
      id: 3,
      title: "title1",
      status: "Active",
      description: "here is some description2",
    },
    {
      id: 4,
      title: "title1",
      status: "Active",
      description: "here is some description2",
    },
  ]); // data from the contract
  React.useEffect(() => { 
    // fetch data from the contract
    async function fetchData() {
      if (!SmartReviewContract) return;
      console.log("fetching data from the contract")
      const response = await SmartReviewContract.getSmartReviewsCount();
      const smartReviewcount = Number(response._hex);
      console.log("total smart reviews count: ", Number(response._hex));
      let allData = [];
      // get all the smart reviews
      for (let i = 0; i < smartReviewcount; i++) {
        let dataObj = {};
        const smartReview = await SmartReviewContract.getSmartReviewById(i.toString());
        dataObj.id = i;
        dataObj.status =phaseMapping[smartReview.phase];
        dataObj.title = smartReview.title || "No title provided";
        dataObj.description = smartReview.description || "No description provided";
        dataObj.bountyAmount = convertBigNumberToEtherString(smartReview.bountyAmount);
        dataObj.deadline = convertBigNumberToEtherString(smartReview.deadline);
        dataObj.issuers = smartReview.issuers;
        dataObj.requirementsHash = smartReview.requirementsHash;
        dataObj.ipHash = smartReview.ipHash;
        dataObj.currentBalance = convertBigNumberToEtherString(smartReview.currentBalance);
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
        subtitle="Central hub for all the IPs in our SmartReview community. Review amazing works and earn rewards!"
      />
      {isFetching ? (<Typography variant="h4">Fetching data from the contract...</Typography>):( <CardGrid
        data_array={data}
      />)}
     
    </Stack>
  );
}
