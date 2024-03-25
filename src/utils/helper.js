import { ethers } from "ethers";
import { NFTStorage } from "nft.storage";

export async function Ipfsuploader(file, description) {
  const client = new NFTStorage({
    token: process.env.REACT_APP_NFT_STORAGE_TOKEN,
  });
  const metadata = await client.store({
    name: file.name,
    description: description,
    image: file,
  });
  return metadata;
}

export function convertEthertoWei(ether) {
  return ethers.utils.parseUnits(ether, "ether");
}

export function converWeiToEther(WeiToEther) {
  return ethers.utils.formatEther(WeiToEther);
}
