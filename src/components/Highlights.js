import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import HubIcon from "@mui/icons-material/Hub";
const items = [
  {
    icon: <HubIcon />,
    title: "Decentralized and Anonymous",
    description:
      "Experience true decentralization with on-chain governance, with no central authority. Reviews are anonymous and censorship-resistant.",
  },
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Superb Review Quality",
    description:
      "Our platform is designed to deliver exceptional review with our token-based voting system, get a unbiased review that is backed by our community!",
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: "Great user experience",
    description:
      "We provide a user-friendly interface that is easy to navigate. Enjoy a smooth and intuitive experience.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Innovative functionality",
    description:
      "Discover innovative features that are designed to enhance your review process.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "community support",
    description:
      "Join a community of like-minded individuals who are passionate about decentralization.",
  },
  {
    icon: <CurrencyBitcoinIcon />,
    title: "Incentivized participation",
    description:
      "Get rewarded for participating in the review process, and earn SmartToken(SMT) for your contributions.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "black",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Explore why our SmartReview platform stands out: adaptability,
            decentralization, reliability, user-friendly design, and innovation.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: "100%",
                  border: "1px solid",
                  borderColor: "grey.800",
                  background: "transparent",
                  backgroundColor: "grey.900",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
