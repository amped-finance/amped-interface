import { RequestFactory } from "api";
import { AxiosError } from "axios";
import { requestController } from "config/request";

const priceRequest = RequestFactory.getPriceRequest();

export const handleGetDataChart = async (type: string) => {
  try {
    const response = await requestController(async () => {
      return await priceRequest.getDataChart(type);
    });
    return response;
  } catch (e: any | AxiosError) {
    throw new Error(e?.message);
  }
};
