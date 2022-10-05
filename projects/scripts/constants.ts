export const isProd = false;

export const WS_URL = isProd ? 'wss://kusama-rpc.polkadot.io' : 'wss://staging.node.rmrk.app';
const backupWsEndpoint = isProd ? 'wss://kusama.api.onfinality.io/public-ws' : 'wss://staging.node.rmrk.app'

export const RPC_ENDPOINTS = [WS_URL, backupWsEndpoint]

export const ASSETS_CID = 'Qmax4X3v382ZsWY6msE7vcnRw351BKMo5uZ8G8oBBQBDKT';
export const CHUNKY_ITEMS_COLLECTION_SYMBOL = 'CHNKITMS';
export const CHUNKY_COLLECTION_SYMBOL = 'CHNK';
export const CHUNKY_BASE_SYMBOL = 'CHNKBS';

export const CHUNK_SIZE = 70;
