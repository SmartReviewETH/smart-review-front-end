import * as React from "react";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PageHeader from "../components/Pageheader";

export default function Profile() {
  return (
    <>
      <PageHeader
        title_front={"Your"}
        title_back={"Profile"}
        subtitle={"This is your personal space for managing SmartReview."}
      />
    </>
  );
}
