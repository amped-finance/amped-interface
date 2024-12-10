import { RequestFactory } from "api";
import { AxiosError } from "axios";
import { requestController } from "config/request";

const layerZeroRequest = RequestFactory.getLayerZeroRequest();

export const handleGetHistories = async (address: string) => {
  try {
    const response = await requestController(async () => {
      return await layerZeroRequest.getHistories(address);
    });
    return response;
  } catch (e: any | AxiosError) {
    throw new Error(e?.message);
  }
};
