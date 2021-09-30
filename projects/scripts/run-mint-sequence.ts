import { createBase } from "./create-base";
import { mintChunky } from "./mint-chunky";
import { addBaseResource } from "./mint-chunky";
import { mintItems } from "./mint-chunky-items";

export const runMintSequence = async () => {
  try {
    const baseBlock = await createBase();
    const chunkiesBlock = await mintChunky();
    await addBaseResource(chunkiesBlock, baseBlock);
    await mintItems(chunkiesBlock, baseBlock);
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runMintSequence();
