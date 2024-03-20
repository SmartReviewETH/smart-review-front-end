import * as React from "react";
import PageHeader from "../components/Pageheader";
import { Grid } from "@mui/material";

export default function ReviewHubPage() {
  return (
    <Grid
      container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <PageHeader
        title_front={"Review"}
        title_back={"Hub"}
        subtitle="Central hub for all the Reviews in the SmartReview community, vote and evaluate them!"
      />
    </Grid>
  );
}
