# Pre-requisites
- You'll need to run a Polkadot dev node.  Specifically, you'll run `./target/release/polkadot --dev --tmp` in a separate terminal window.  If you can't do this, check out [these instructions](https://wiki.polkadot.network/docs/maintain-sync).  Get Polkadot compiled and runnable before proceeding (or you'll just get frustrated when you can't proceed in a bit).

# Scaffolding and initial setup
Demo begins at [5:30](https://www.youtube.com/watch?v=-NuoXCT5Hm4&t=330s) 

1. Create a few directories and open in VSCode.
```bash
mkdir demo-rmrk-project-2
cd demo-rmrk-project-2
mkdir -p projects/scripts
mkdir projects/demo
cd projectsyarn
code .
```

2. Initialize yarn project
```bash
yarn init
# yarn init v1.22.10
# question name (scripts): rmrk2-demo-scripts
# question version (1.0.0): 
# question description: RMRK2 demo scripts
# question entry point (index.js): 
# question repository url: 
# question author: 
# question license (MIT): 
# question private: 
# success Saved package.json
```

3. Add dependencies to scripts/package.json (replace with these contents).
```json
{
  "name": "rmrk2-demo-scripts",
  "version": "1.0.0",
  "description": "RMRK2 demo scripts",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "fetch": "rmrk-tools-fetch",
    "consolidate": "rmrk-tools-consolidate"
  },
  "dependencies": {
    "@pinata/sdk": "^1.1.23",
    "@polkadot/api": "^6.0.4",
    "@polkadot/keyring": "^7.4.1",
    "@polkadot/util-crypto": "^7.4.1",
    "@types/node": "^16.9.6",
    "dotenv": "^10.0.0",
    "nanoid": "^3.1.25",
    "p-limit": "^3.1.0",
    "prettier": "^2.3.2",
    "rmrk-tools": "2.0.11",
    "ts-node": "^10.1.0",
    "typescript": "^4.3.5"
  }
}
```

4. Create scripts/tsconfig.json
```typescript
{
  "compilerOptions": {
    "outDir": "./dist",
    "lib": ["es2019"],
    "target": "ES2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "paths": {
      "*": [
        "node_modules/*"
      ]
    }
  },
  "files": [
    "scripts/*.ts",
    "scripts/**/*.ts"
  ]
}
```

5. Get API keys from https://pinata.cloud.

6. Create scripts/.env file using Pinata credentials:
```
MNEMONIC_PHRASE="//Alice"
PINATA_KEY="XXX"
PINATA_SECRET="XXX"
```

7. Copy scripts/.gitignore.
```
.idea
.env
consolidated-from-dumps-unconsolidated.json
node_modules
dumps-unconsolidated.json
```

8. Copy all Chunky assets from [GitHub](https://github.com/rmrk-team/rmrk2-examples/tree/master/projects/scripts/assets/chunky) to projects/scripts/assets.  *Get the CID when complete*. 
```bash
wget https://github.com/rmrk-team/rmrk2-examples/archive/refs/heads/master.zip && unzip master.zip "rmrk2-examples-master/projects/scripts/assets/chunky/*" && mv rmrk2-examples-master/projects/scripts/assets scripts/assets && rm -rf rmrk2-examples-master/ && rm master.zip
```

9. Create projects/scripts/constants.ts.
```typescript
const isProd = false;

export const WS_URL = isProd ? 'wss://kusama-rpc.polkadot.io' : 'ws://127.0.0.1:9944';

export const ASSETS_CID = 'Qmax4X3v382ZsWY6msE7vcnRw351BKMo5uZ8G8oBBQBDKT';
```

10. Install dependencies.
```
cd scripts
yarn
```

# Create Base
Demo begins at [17:09](https://www.youtube.com/watch?v=-NuoXCT5Hm4&t=1029s) 

1. Create scripts/create-base.ts initial function.
```typescript
export const createBase = async () => {
  try {
    // Base creation here
  } catch (error: any) {
    console.error(error);
  }
};
```

2. Add fixed parts to scripts-create-base.ts (above createBase).

```typescript
import ASSETS_CID from "./constants";

export const fixedParts: IBasePart[] = [
  {
    type: "fixed",
    id: "chunky_body_1",
    src: `ipfs://ipfs/${ASSETS_CID}/v1/Chunky_body_v1.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_body_2",
    src: `ipfs://ipfs/${ASSETS_CID}/v2/Chunky_body_v2.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_body_3",
    src: `ipfs://ipfs/${ASSETS_CID}/v3/Chunky_body_v3.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_body_4",
    src: `ipfs://ipfs/${ASSETS_CID}/v4/Chunky_body_v4.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_head_1",
    src: `ipfs://ipfs/${ASSETS_CID}/v1/Chunky_head_v1.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_head_2",
    src: `ipfs://ipfs/${ASSETS_CID}/v2/Chunky_head_v2.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_head_3",
    src: `ipfs://ipfs/${ASSETS_CID}/v3/Chunky_head_v3.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_head_4",
    src: `ipfs://ipfs/${ASSETS_CID}/v4/Chunky_head_v4.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_hand_1",
    src: `ipfs://ipfs/${ASSETS_CID}/v1/Chunky_hand_v1.svg`,
    z: 3,
  },
  {
    type: "fixed",
    id: "chunky_hand_2",
    src: `ipfs://ipfs/${ASSETS_CID}/v2/Chunky_hand_v2.svg`,
    z: 3,
  },
  {
    type: "fixed",
    id: "chunky_hand_3",
    src: `ipfs://ipfs/${ASSETS_CID}/v3/Chunky_hand_v3.svg`,
    z: 3,
  },
  {
    type: "fixed",
    id: "chunky_hand_4",
    src: `ipfs://ipfs/${ASSETS_CID}/v4/Chunky_hand_v4.svg`,
    z: 3,
  },
];
```

3. Add slot parts to scripts/create-base.ts (below fixedParts).
```typescript
const getSlotKanariaParts = (equippable: string[] | "*" = []): IBasePart[] => {
  return [
    {
      type: "slot",
      id: "chunky_objectLeft",
      equippable,
      z: 1,
    },
    {
      type: "slot",
      id: "chunky_objectRight",
      equippable,
      z: 2,
    },
  ];
};
```

4. Update createBase function in scripts/create-base.ts.
```typescript
export const createBase = async () => {
    try {
        console.log("CREATE CHUNKY BASE START -------");
        await cryptoWaitReady();
        const accounts = getKeys();
        const ws = WS_URL;
        const phrase = process.env.MNEMONIC_PHRASE;
        const api = await getApi(ws);
        const kp = getKeyringFromUri(phrase);
    } catch (error: any) {
        console.error(error);
    }
};
```

5. Create scripts/utils.ts
```typescript
import { WS_URL } from "./constants";

require("dotenv").config();
import { KeyringPair } from "@polkadot/keyring/types";
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { CodecHash } from "@polkadot/types/interfaces";

export const getKeys = (): KeyringPair[] => {
  const k = [];
  const keyring = new Keyring({ type: "sr25519" });
  k.push(keyring.addFromUri(process.env.MNEMONIC_PHRASE));
  return k;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

export const getKeyringFromUri = (phrase: string): KeyringPair => {
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri(phrase);
};

export const getApi = async (wsEndpoint: string): Promise<ApiPromise> => {
  const wsProvider = new WsProvider(wsEndpoint);
  const api = ApiPromise.create({ provider: wsProvider });
  return api;
};

export const chunkArray = (array: any[], size: number) => {
  let result = [];
  for (let i = 0; i < array.length; i += size) {
    let chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
};

/*
 Thanks to Martin for this util example
 */
export const sendAndFinalize = async (
  tx: SubmittableExtrinsic<"promise", ISubmittableResult>,
  account: KeyringPair
): Promise<{
  block: number;
  success: boolean;
  hash: CodecHash;
  included: any[];
  finalized: any[];
}> => {
  return new Promise(async (resolve) => {
    let success = false;
    let included = [];
    let finalized = [];
    let block = 0;
    let unsubscribe = await tx.signAndSend(
      account,
      async ({ events = [], status, dispatchError }) => {
        if (status.isInBlock) {
          success = dispatchError ? false : true;
          console.log(
            `📀 Transaction ${tx.meta.name} included at blockHash ${status.asInBlock} [success = ${success}]`
          );
          const api = await getApi(WS_URL);
          const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
          block = signedBlock.block.header.number.toNumber();
          included = [...events];
        } else if (status.isBroadcast) {
          console.log(`🚀 Transaction broadcasted.`);
        } else if (status.isFinalized) {
          console.log(
            `💯 Transaction ${tx.meta.name}(..) Finalized at blockHash ${status.asFinalized}`
          );
          finalized = [...events];
          let hash = status.hash;
          unsubscribe();
          resolve({ success, hash, included, finalized, block });
        } else if (status.isReady) {
          // let's not be too noisy..
        } else {
          console.log(`🤷 Other status ${status}`);
        }
      }
    );
  });
};
```
6. Add chunk-related constants to scripts/constants.ts.
```typescript
export const CHUNKY_ITEMS_COLLECTION_SYMBOL = 'CHNKITMS';
export const CHUNKY_COLLECTION_SYMBOL = 'CHNK';
export const CHUNKY_BASE_SYMBOL = 'CHNKBS';
```

7. Update imports for projects/scripts/create-base.ts
```typescript
import { IBasePart } from "rmrk-tools/dist/classes/base";
import {
  ASSETS_CID,
  CHUNKY_BASE_SYMBOL,
  CHUNKY_ITEMS_COLLECTION_SYMBOL,
  WS_URL,
} from "./constants";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import { Collection, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
```

8. Create collectionId, baseParts and baseEntity in createBase function of **scripts/create-base.ts**
```typescript
export const createBase = async () => {
  try {
    // <...snip>
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);
    // Add the below
    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_ITEMS_COLLECTION_SYMBOL
    );
    console.log("collectionId", collectionId);

    const baseParts = [...fixedParts, ...getSlotKanariaParts([collectionId])];

    const baseEntity = new Base(
      0,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg",
      baseParts
    );
    // Add the above  
    } catch (error: any) {
      console.error(error);
    }
    // <snip...>
```

9. Add *sendAndFinalize* minting of base to projects/scripts/create-base.ts
```typescript
    // <...snip>
    const baseEntity = new Base(
      0,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg",
      baseParts
    );
    // Add below
    const { block } = await sendAndFinalize(
      api.tx.system.remark(baseEntity.base()),
      kp
    );
    console.log("Chunky Base created at block: ", block);
    return block;
```

10. Create scripts/run-create-base.ts.
```typescript
import { createBase } from "./create-base"

createBase();
```

11. Run Polkadot local tmp node running.  In a separate terminal window, run `./target/release/polkadot --dev --tmp` to run the node, unless you're running it some other way.

12. Run npx rs-node command to send remark to the chain.  You can CTRL-C after "Chunky Base created at block:".  You might want to take note of the block number identified here, though we'll see different ways of finding it later.  This is the BASE block number.
```
npx ts-node ./run-create-base.ts 
```

13. Run yarn fetch command to fetch unconsolidated remarks using rmrk-tools. 
```bash
yarn fetch --prefixes=0x726d726b,0x524d524b --append=dumps-unconsolidated.json
```

14. Run yarn consolidate command to consolidate unconsolidated remarks using rmrk-tools.
```bash
yarn consolidate --json=dumps-unconsolidated.json
```

15. View consolidated file created.  Notice there are no NFTs or Collections, but there is one base created, with a bunch of parts.
```bash
cat ../consolidated-from-dumps-unconsolidated.json | jq
```

# Mint Chunkies
Demo begins at [42:11](https://www.youtube.com/watch?v=-NuoXCT5Hm4&t=2531s) 

1. Create scripts/mint-chunky.ts with imports and boilerplate (**more than in video, keep?**).
```typescript
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import {
  ASSETS_CID,
  CHUNKY_BASE_SYMBOL,
  CHUNKY_COLLECTION_SYMBOL,
  WS_URL,
} from "./constants";
import { Base, Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "./pinata-utils";
import { createBase } from "./create-base";
import { nanoid } from "nanoid";
```

2. Add createChunkyCollection function.
```typescript
export const createChunkyCollection = async () => {
  try {
    console.log("CREATE CHUNKY COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.MNEMONIC_PHRASE;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets/chunky",
      "Chunky Preview.png",
      "RMRK2 demo chunky collection",
      {
        description: "This is Chunky! RMRK2 demo nested NFT",
        external_url: "https://rmrk.app",
        properties: {},
      }
    );

    const ItemsCollection = new Collection(
      0,
      10000,
      encodeAddress(accounts[0].address, 2),
      CHUNKY_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.create()),
      kp
    );
    console.log("COLLECTION CREATION REMARK: ", ItemsCollection.create());
    console.log("Chunky collection created at block: ", block);

    return block;
  } catch (error: any) {
    console.error(error);
  }
};
```

3. Create scripts/pinata-utils.ts
```typescript
require('dotenv').config();
import { NFTMetadata } from 'rmrk-tools/dist/classes/nft';
import pLimit from 'p-limit';
import { Readable } from 'stream';
import fs from 'fs';
// @ts-ignore
import pinataSDK, { PinataOptions, PinataPinOptions } from '@pinata/sdk';
import { sleep } from './utils';

const defaultOptions: Partial<PinataPinOptions> = {
  pinataOptions: {
    cidVersion: 1,
  },
};

export const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);

const fsPromises = fs.promises;
export type StreamPinata = Readable & {
  path?: string;
};
const limit = pLimit(1);

const pinFileStreamToIpfs = async (file: StreamPinata, name?: string) => {
  const options = { ...defaultOptions, pinataMetadata: { name } };
  const result = await pinata.pinFileToIPFS(file, options);
  return result.IpfsHash;
};

export const uploadAndPinIpfsMetadata = async (metadataFields: NFTMetadata): Promise<string> => {
  const options = {
    ...defaultOptions,
    pinataMetadata: { name: metadataFields.name },
  };
  try {
    const metadata = { ...metadataFields };
    const metadataHashResult = await pinata.pinJSONToIPFS(metadata, options);
    return `ipfs://ipfs/${metadataHashResult.IpfsHash}`;
  } catch (error) {
    return '';
  }
};

export const pinSingleMetadataFromDir = async (
  dir: string,
  path: string,
  name: string,
  metadataBase: Partial<NFTMetadata>,
) => {
  try {
    const imageFile = await fsPromises.readFile(`${process.cwd()}${dir}/${path}`);
    if (!imageFile) {
      throw new Error('No image file');
    }

    const stream: StreamPinata = Readable.from(imageFile);
    stream.path = path;

    const imageCid = await pinFileStreamToIpfs(stream, name);
    console.log(`NFT ${path} IMAGE CID: `, imageCid);
    const metadata: NFTMetadata = { ...metadataBase, name, image: `ipfs://ipfs/${imageCid}` };
    const metadataCid = await uploadAndPinIpfsMetadata(metadata);
    await sleep(500);
    console.log(`NFT ${name} METADATA: `, metadataCid);
    return metadataCid;
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error));
    return '';
  }
};
```

4. Back in scripts/mint-chunky.ts, create mintChunky boilerplate.
```typescript
export const mintChunky = async () => {
  try {
    console.log("CREATE CHUNKY NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.MNEMONIC_PHRASE;
    const kp = getKeyringFromUri(phrase);

    // Next few steps will add code here.

  } catch (error: any) {
    console.error(error);
  }
};
```

5. Create collectionId for Chunkies in scripts/mint-chunky.ts
```typescript
    const collectionId = Collection.generateId(
        u8aToHex(accounts[0].publicKey),
        CHUNKY_COLLECTION_SYMBOL
        );
```

6. Create Chunky collection
```typescript
    await createChunkyCollection();
```

7. Instantiate the API.
```typescript
    const api = await getApi(ws);
```

8. Create serialNumbers array.
```typescript
    const serialNumbers = [1, 2, 3, 4];
```

9. Iterate through serialNumbers to create metadataCid.
```typescript
    const promises = serialNumbers.map(async (sn) => {
      const metadataCid = await pinSingleMetadataFromDir(
        "/assets/chunky",
        "Chunky Preview.png",
        `RMRK2 demo chunky NFT #${sn}`,
        {
          description: `This is Chunky #${sn}! RMRK2 demo nested NFT`,
          external_url: "https://rmrk.app",
          properties: {
            rarity: {
              type: "string",
              value: sn === 4 ? "epic" : "common",
            },
          },
        }
      );
```

10. Instantiate NFT object (inside serialNumbers.map loop)
```typescript
      const nft = new NFT({
        block: 0,
        collection: collectionId,
        symbol: `chunky_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: metadataCid,
      });
```

11. Return the minted nft to the promises object.
```typescript
      return nft.mint();
    });
```

12. Await the four (all) promises.
```typescript
    const remarks = await Promise.all(promises);
```

13. Prepare and send transactions.
```typescript
    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batchAll(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Chunky NFT minted at block: ", block);
    return block;
```



14. Create scripts/run-mint-chunky.ts script
```typescript
import { mintChunky } from "./mint-chunky";

mintChunky();
```

15. Run the run-mint-chunky.ts script.  You can CTRL-C after "Chunky NFT minted at block".  Take note of the block number.  This is the Chunky block number, which we'll use later.
```bash
npx ts-node ./run-mint-chunky
```

16. Re-run yarn fetch command to fetch unconsolidated remarks using rmrk-tools. 
```bash
yarn fetch --prefixes=0x726d726b,0x524d524b --append=dumps-unconsolidated.json
```

17. Re-run yarn consolidate command to consolidate unconsolidated remarks using rmrk-tools.
```bash
yarn consolidate --json=dumps-unconsolidated.json
```

18. View consolidated file created.  Notice we now have NFTs with a block, collection, symbol and other properties, but also notice there are no children, resources and no priorities.
```bash
cat ../consolidated-from-dumps-unconsolidated.json | jq
```

19. Add addBaseResource utility to scripts/mint-chunky.ts (below imports, above createChunkyCollection).
```typescript
export const addBaseResource = async (
  chunkyBlock: number,
  baseBlock: number
) => {
  try {
    console.log("ADD BASE RESOURCE TO CHUNKY NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.MNEMONIC_PHRASE;
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    const api = await getApi(ws);
    const serialNumbers = [1, 2, 3, 4];

    const baseEntity = new Base(
      baseBlock,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    const BASE_ID = baseEntity.getId();

    const resourceRemarks = [];

    serialNumbers.forEach((sn) => {
      const nft = new NFT({
        block: chunkyBlock,
        collection: collectionId,
        symbol: `chunky_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      const baseResId = nanoid(8);

      resourceRemarks.push(
        nft.resadd({
          base: BASE_ID,
          id: baseResId,
          parts: [
            `chunky_body_${sn}`,
            `chunky_head_${sn}`,
            `chunky_hand_${sn}`,
            "chunky_objectLeft",
            "chunky_objectRight",
          ],
          thumb: `ipfs://ipfs/${ASSETS_CID}/Chunky%20Preview.png`,
        })
      );

      if (sn === 4) {
        const secondaryArtResId = nanoid(8);
        resourceRemarks.push(
          nft.resadd({
            src: `ipfs://ipfs/${ASSETS_CID}/chunky_altresource.jpg`,
            thumb: `ipfs://ipfs/${ASSETS_CID}/chunky_altresource.jpg`,
            id: secondaryArtResId,
          })
        );

        resourceRemarks.push(nft.setpriority([secondaryArtResId, baseResId]));
      }
    });

    const txs = resourceRemarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Chunky NFT minted at block: ", block);
  } catch (error: any) {
    console.error(error);
  }
};
```

20.  Get Base block number (will be "BASE_ID_FROM_ABOVE" variable below) to pass to addBaseResource (or manually look in the consolidated JSON file).  We got this earlier, but you can still find it if you didn't record it.
```bash
cat ../consolidated-from-dumps-unconsolidated.json | jq ".bases | keys[0]" | cut -d'-' -f2
```

21. Get NFTs block number (will be "NFT_ID_FROM_ABOVE" variable below) to pass to addBaseResource (or manually look in the consolidated JSON file).
```bash
cat ../consolidated-from-dumps-unconsolidated.json | jq -r '.nfts | keys[0]' | cut -d'-' -f1
```

22. Create scripts/run-chunky-resource-add.ts, replacing NFT_ID_FROM_ABOVE and BASE_ID_FROM_ABOVE with the values we found.
```typescript
import { addBaseResource } from './mint-chunky';

addBaseResource(NFT_ID_FROM_ABOVE, BASE_ID_FROM_ABOVE);
```

23. Run run-chunky-resource-add.ts.  You can CTRL-C at "Chunky NFT minted at block".
```bash
npx ts-node ./run-chunky-resource-add.ts
```

24. Re-run yarn fetch command to fetch unconsolidated remarks using rmrk-tools. 
```bash
yarn fetch --prefixes=0x726d726b,0x524d524b --append=dumps-unconsolidated.json
```

25. Re-run yarn consolidate command to consolidate unconsolidated remarks using rmrk-tools.
```bash
yarn consolidate --json=dumps-unconsolidated.json
```

26. View consolidated file created.  Notice our resources are now associated with the correct resource.  Also notice the fourth Chunky has a secondary resource, and the secondary resource has been given first priority.
```bash
cat ../consolidated-from-dumps-unconsolidated.json | jq
```

# Chunky items
Demo begins at [1:14:28](https://www.youtube.com/watch?v=-NuoXCT5Hm4&t=4468s) 

1. Create scripts/mint-chunky-items.ts
```typescript
import {
  ASSETS_CID,
  CHUNKY_COLLECTION_SYMBOL,
  CHUNKY_ITEMS_COLLECTION_SYMBOL,
  WS_URL,
  CHUNKY_BASE_SYMBOL
} from "./constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import { Collection, NFT, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import { nanoid } from "nanoid";
import {pinSingleMetadataFromDir} from "./pinata-utils";

const chunkyItems = [
  {
    symbol: "chunky_bone",
    thumb: "Chunky_bone_thumb.png",
    resources: ["Chunky_bone_left.svg", "Chunky_bone_right.svg"],
    name: "The Bone",
    description: "Chunky likes his bone!",
  },
  {
    symbol: "chunky_flag",
    thumb: "Chunky_flag_thumb.png",
    resources: ["Chunky_flag_left.svg", "Chunky_flag_right.svg"],
    name: "The Flag",
    description: "Chunky likes his flag!",
  },
  {
    symbol: "chunky_pencil",
    thumb: "Chunky_pencil_thumb.png",
    resources: ["Chunky_pencil_left.svg", "Chunky_pencil_right.svg"],
    name: "The Pencil",
    description: "Chunky likes his pencil!",
  },
  {
    symbol: "chunky_spear",
    thumb: "Chunky_spear_thumb.png",
    resources: ["Chunky_spear_left.svg", "Chunky_spear_right.svg"],
    name: "The Spear",
    description: "Chunky likes his spear!",
  },
];

export const mintItems = async (chunkyBlock: number, baseBlock: number) => {
  try {
    console.log("CREATE CHUNKY ITEMS START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.MNEMONIC_PHRASE;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_ITEMS_COLLECTION_SYMBOL
    );

    const chunkyCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    const baseEntity = new Base(
      baseBlock,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    await createItemsCollection();

    const promises = chunkyItems.map(async (item, index) => {
      const sn = index + 1;

      const metadataCid = await pinSingleMetadataFromDir(
        "/assets/chunky/Chunky Items",
        item.thumb,
        item.name,
        {
          description: item.description,
          external_url: "https://rmrk.app",
        }
      );

      const nft = new NFT({
        block: 0,
        sn: sn.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: metadataCid,
        collection: collectionId,
        symbol: item.symbol,
      });

      return nft.mint();
    });

    const remarks = await Promise.all(promises);

    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const batch = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(batch, kp);
    console.log("CHUNKY ITEMS MINTED AT BLOCK: ", block);

    const resaddSendRemarks = [];

    chunkyItems.forEach((item, index) => {
      const sn = index + 1;
      const nft = new NFT({
        block,
        sn: sn.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: `ipfs://ipfs/trololo`,
        collection: collectionId,
        symbol: item.symbol,
      });

      item.resources.forEach((resource) => {
        resaddSendRemarks.push(
          nft.resadd({
            src: `ipfs://ipfs/${ASSETS_CID}/Chunky Items/${resource}`,
            thumb: `ipfs://ipfs/${ASSETS_CID}/Chunky Items/${item.thumb}`,
            id: nanoid(8),
            slot: resource.includes("left")
              ? `${baseEntity.getId()}.chunky_objectLeft`
              : `${baseEntity.getId()}.chunky_objectRight`,
          })
        );
      });

      const chunkyNft = new NFT({
        block: chunkyBlock,
        collection: chunkyCollectionId,
        symbol: `chunky_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      resaddSendRemarks.push(nft.send(chunkyNft.getId()));
      resaddSendRemarks.push(
        nft.equip(
          `${baseEntity.getId()}.${
            index % 2 ? "chunky_objectLeft" : "chunky_objectRight"
          }`
        )
      );
    });

    const restxs = resaddSendRemarks.map((remark) =>
      api.tx.system.remark(remark)
    );
    const resbatch = api.tx.utility.batch(restxs);
    const { block: resaddSendBlock } = await sendAndFinalize(resbatch, kp);
    console.log("CHUNKY ITEMS RESOURCE ADDED AND SENT: ", resaddSendBlock);
    return true;
  } catch (error: any) {
    console.error(error);
  }
};

export const createItemsCollection = async () => {
  try {
    console.log("CREATE CHUNKY ITEMS COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.MNEMONIC_PHRASE;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_ITEMS_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets/chunky",
      "Chunky Preview.png",
      "RMRK2 demo chunky items collection",
      {
        description: "This is Chunky items! RMRK2 demo nested NFTs",
        external_url: "https://rmrk.app",
        properties: {},
      }
    );

    const ItemsCollection = new Collection(
      0,
      0,
      encodeAddress(accounts[0].address, 2),
      CHUNKY_ITEMS_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.create()),
      kp
    );
    console.log("Chunky items collection created at block: ", block);

    return block;
  } catch (error: any) {
    console.error(error);
  }
};

```

2. Create scripts/run-mint-items.ts.  Replace CHUNKY_BLOCK_NUMBER and BASE_BLOCK_NUMBER with the same values from scripts/run-chunky-resource-add.ts
```typescript
import { mintItems } from './mint-chunky-items'

mintItems(CHUNKY_BLOCK_NUMBER, BASE_BLOCK_NUMBER);
```

3. Run scripts/run-mint-items.ts.  You can CTRL-C at "CHUNKY ITEMS RESOURCE ADDED AND SENT:". 
```bash
npx ts-node ./run-mint-items.ts
```

4. Re-run yarn fetch command to fetch unconsolidated remarks using rmrk-tools.
```bash
yarn fetch --prefixes=0x726d726b,0x524d524b --append=dumps-unconsolidated.json
```

5. Re-run yarn consolidate command to consolidate unconsolidated remarks using rmrk-tools.
```bash
yarn consolidate --json=dumps-unconsolidated.json
```

6. View consolidated file created.  Notice our Chunkies now have items (children).
```bash
cat ../consolidated-from-dumps-unconsolidated.json | jq
```

# RMRK UI
Demo begins at [1:31:08](https://www.youtube.com/watch?v=-NuoXCT5Hm4&t=5468s) 

1. Copy the React/NextJS demo from [GitHub](https://github.com/rmrk-team/rmrk2-examples/tree/master/projects/react-demo) to react-demo. 
```bash
wget https://github.com/rmrk-team/rmrk2-examples/archive/refs/heads/master.zip && unzip master.zip "rmrk2-examples-master/projects/react-demo/*" && mv rmrk2-examples-master/projects/react-demo ../react-demo && rm -rf rmrk2-examples-master/ && rm master.zip
```

2. Copy the contents of the consolidated dump into the React demo.
```bash
cp ../consolidated-from-dumps-unconsolidated.json ../react-demo/public/chunky-dump.json
```

3. Initialize the NextJS demo app.
```bash
cd ../react-demo
yarn
```

4. Examine react-demo/pages/index.tsx to understand the functionality of the app, including the fetchData function and the returned component.
```typescript
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import {Badge, Box, SimpleGrid, Spinner} from '@chakra-ui/react';
import {
  ConsolidatorReturnType,
  NFTConsolidated,
} from 'rmrk-tools/dist/tools/consolidator/consolidator';
import SvgResourceComposer from '../components/rmrk-svg-composer';

export const fetchData = async (setNfts: (nfts: NFTConsolidated[]) => void) => {
  try {
    const payload = await fetch('/chunky-dump.json');
    const data: ConsolidatorReturnType = await payload.json();
    if (data?.nfts) {
      setNfts(Object.values(data.nfts));
    }
    console.log(data);
  } catch (error: any) {
    console.log(error);
  }
};

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<NFTConsolidated[]>([]);
  useEffect(() => {
    fetchData(setNfts);
  }, []);

  if (!nfts) {
    return <Spinner size="xl" />;
  }

  console.log(nfts)

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={6}>
        <SimpleGrid columns={[2, 4]} spacing={4}>
          {nfts.filter(nft => nft.collection === 'd43593c715a56da27d-CHNK').map((nft, index) => (
            <Box key={nft.id} minW={400} borderWidth={1} borderColor={'white'} borderStyle={'solid'} borderRadius={10} backgroundColor={index % 2 ? 'blue.500' : 'yellow.500'} position={'relative'}>
              <Badge position={'absolute'} top={4} right={4} colorScheme={'gray.600'}>{nft.sn.slice(nft.sn.length - 4)}</Badge>
              <SvgResourceComposer nft={nft} />
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default Home;
```

5. Run the app.
```bash
yarn dev
```

6. In a browser, go to http://localhost:3000 to see your Chunkies.
