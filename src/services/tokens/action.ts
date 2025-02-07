import { RequestFactory } from "api";
import { AxiosError } from "axios";
import { requestController } from "config/request";

const tokenRequest = RequestFactory.getTokenRequest();

export const handleGetDataChart = async (type: string, poolId: string) => {
  try {
    const response = await requestController(async () => {
      return await tokenRequest.getDataChart(type, poolId);
    });
    return response;
  } catch (e: any | AxiosError) {
    throw new Error(e?.message);
  }
};

export const handleGetPools = async () => {
  try {
    const response = await requestController(async () => {
      return await tokenRequest.getPools();
    });
    return response;
  } catch (e: any | AxiosError) {
    throw new Error(e?.message);
  }
};

export const handleGetTokenRefs = async () => {
  try {
    const response = await requestController(async () => {
      return await tokenRequest.getTokenRefs();
    });
    return response;
  } catch (e: any | AxiosError) {
    throw new Error(e?.message);
  }
};

export const handleGetMetadata = async () => {
  try {
    const response = await requestController(async () => {
      return await tokenRequest.getMetadata();
    });
    return response;
  } catch (e: any | AxiosError) {
    throw new Error(e?.message);
  }
};
