import * as React from "react";
import PageHeader from "../components/Pageheader";
import { Grid } from "@mui/material";

export default function ReviewHub() {
  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <PageHeader
        title_front={"SmartReview"}
        title_back={"Hub"}
        subtitle="Central hub for all the IPs and Reviews in the SmartReview community"
      />
    </Grid>
  );
}
