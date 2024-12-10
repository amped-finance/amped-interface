import { ChainSupported } from "config/helper";
import { BaseRequest } from "../BaseRequest";

export class PriceRequest extends BaseRequest {
  protected _route: string = "/price";

  public async getDataChart(type: string) {
    const res = await this.get("/mif/breakdown", {
      filter_chain: ChainSupported.Bsc.toLowerCase(),
      filter_breakdown: type,
    });
    return res;
  }
}
