import { NFTStorage } from "nft.storage";

export async function Ipfsuploader(file, description) {
  console.log(process.env.REACT_APP_NFT_STORAGE_TOKEN);
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
