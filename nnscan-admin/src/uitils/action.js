import { getRequest, PatchRequest, postRequest, postRequestUrl } from "./helper";
import config from './config';
const serverPath = config.API_URL;


export const adminLogin = async (data) => {
  const res = await postRequest("admin/login", data);
  return res.data;
};


export const ledgerlogin = async (data) => {
  const res = await postRequest("auth/ledger-nonce", data);
  return res.data;
};


export const ledgerloginverify = async (data) => {
  const res = await postRequest("auth/ledger-verify", data);
  return res.data;
};

export const GetNftList = async () => {
  const res = await getRequest("nft/get-all");
  return res.data;
};



export const GetAllvalidatorlist = async (params = {}) => {
  try {
    const res = await getRequest("validators", params);
    return res.data;
  } catch (error) {
    console.error("Error in GetAllvalidatorlist:", error);
    return { success: false, message: error.message };
  }
};



export const MintNft = async (data) => {
  const res = await PatchRequest("nft/mint", data);
  return res.data;
};

export const MintNftCurl = async (data) => {
  const res = await postRequest("nft/mintCurl", data);
  return res.data;
};

export const GetNftInfo = async (id) => {
  const res = await getRequest(`nft/${id}`);
  return res.data;
};

export const TransferNftCurl = async (data) => {
  const res = await postRequest("nft/transferCurl", data);
  return res.data;
};

export const GetNftInfofromdatabase = async (id) => {
    const res = await getRequest(`nft/get/${id}`);
    return res.data;
};


export const GetgenisesData = async () => {
    const res = await getRequest(`genesis`);
    return res.data;
};


export const checktrxfortransfer = async (trx) => {
    const res = await getRequest(`nft/${trx}`);
    return res.data;
};


export const changestatusofTRX = async (trx) => {
    const res = await postRequest(`nft/check-transaction/${trx}`);
    return res.data
};

export const GetNftMetainfofromdatabase = async (id) => {
    const res = await getRequest(`nft/metadata/${id}`);
    return res.data;
};