"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Hero from "../components/Hero";
import Highlights from "../components/Highlights";

export default function MainPage() {
  return (
    <Box>
      <Hero />

      <Box sx={{ bgcolor: "background.default" }}>
        <Divider />
        <Highlights />
      </Box>
    </Box>
  );
}
