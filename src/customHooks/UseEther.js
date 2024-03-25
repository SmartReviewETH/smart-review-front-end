import React from "react";
import { ethers } from "ethers";
import { smartReviewContractAbi } from "../Abi/SmartReviewContractAbi";

export function useEther() {
  const [provider, setProvider] = React.useState(null);
  const [network, setNetwork] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [smartReviewContract, setSmartReviewContract] = React.useState(null);
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
        "0xDCb2C1F4f07798a9f1e611d0db9091424a81C4F4",
        smartReviewContractAbi,
        signer
      );
      console.log(contract);
      setSmartReviewContract(contract);

      
    }

    getAddress();
    getNetwork();
    getContract();
  }, [provider]);

  return { provider, network, address, smartReviewContract };
}
