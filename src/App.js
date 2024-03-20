import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import getLPTheme from "./Theme/getLPTheme";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
import AppAppBar from "./components/AppAppBar";
import SmartReviewHubPage from "./pages/HubSmartReview";
import ReviewHubPage from "./pages/HubReview";
import { ethers } from "ethers";
export const EtherContext = React.createContext(null);

export default function App() {
  const [provider, setProvider] = React.useState(null);
  const [network, setNetwork] = React.useState("");
  React.useEffect(() => {
    const initializeProvider = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    };

    initializeProvider();
  }, []);
  React.useEffect(() => {
    const getNetwork = async () => {
      if (provider) {
        const network = await provider.getNetwork();
        setNetwork(network.name);
      }
    };

    getNetwork();
  }, [provider]);

  const [mode, setMode] = React.useState("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <EtherContext.Provider value={{ provider: provider, network: network }}>
      <BrowserRouter>
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
          <CssBaseline />
          <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="smartReviewHub" element={<SmartReviewHubPage />} />
            <Route path="reviewHub" element={<ReviewHubPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </EtherContext.Provider>
  );
}
