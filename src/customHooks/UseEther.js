import React from "react";
import { ethers } from "ethers";
import { smartReviewContractAbi } from "../Abi/SmartReviewContractAbi";
import { GovernorContractAbi } from "../Abi/GovernorContractAbi";
import { TokenContractAbi } from "../Abi/TokenContractAbi";

export function useEther() {
  const [provider, setProvider] = React.useState(null);
  const [network, setNetwork] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [smartReviewContract, setSmartReviewContract] = React.useState(null);
  const [governorContract, setGovernorContract] = React.useState(null);
  const [tokenContract, setTokenContract] = React.useState(null);
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
    async function getAddress() {
      if (!provider) return;
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);
      return address;
    }
    async function getContract() {
      if (!provider) return;
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xd645F81279EA413e50c00DF7102B32b4E0640A41",
        smartReviewContractAbi,
        signer
      );
      console.log(contract);

      setSmartReviewContract(contract);
    }
    async function getGovernanceContract() {
      if (!provider) return;
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0x8939843484975DD23b30951FEac7317335969ec3",
        GovernorContractAbi,
        signer
      );

      console.log(contract);

      setGovernorContract(contract);
    }
    async function getTokenContract() {
      if (!provider) return;
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        "0xFb3901F9Fc06045f9cE03EeEB21485559A858784",
        TokenContractAbi,
        signer
      );
      console.log(contract);
      setTokenContract(contract);
    }

    getAddress();
    getNetwork();
    getContract();
    getGovernanceContract();
    getTokenContract();
  }, [provider]);

  return {
    provider,
    network,
    address,
    smartReviewContract,
    governorContract,
    tokenContract,
  };
}
