import * as React from "react";
import PageHeader from "../components/Pageheader";
import { Grid } from "@mui/material";

export default function SmartReviewHubPage() {
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
        subtitle="Central hub for all the IPs in our SmartReview community. Review amazing works and earn rewards!"
      />
    </Grid>
  );
}
