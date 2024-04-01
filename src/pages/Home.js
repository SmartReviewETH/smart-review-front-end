"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Hero from "../components/Hero";
import Highlights from "../components/Highlights";
import AnimatedObject from "../components/animation/Animation";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";

export default function MainPage() {
  return (
    <Box>
      <Hero />
      <Box sx={{ bgcolor: "background.default" }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <AnimatedObject />
        </Box>
        <Divider />
        <Highlights />
        <FAQ />
        <Footer />
      </Box>
    </Box>
  );
}
