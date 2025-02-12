import { ChainSupported } from "config/helper";
import { BaseRequest } from "../BaseRequest";

export class TokenRequest extends BaseRequest {
  protected _route: string = "";

  public async getDataChart(type: string, poolId) {
    const res = await this.get(`/price/${poolId}/breakdown`, {
      filter_chain: ChainSupported.Bsc.toLowerCase(),
      filter_breakdown: type
    });
    return res;
  }

  public async getPools() {
    const res = await this.get("/pools", {
      page_size: 1000,
    });
    return res;
  }

  public async getTokenRefs() {
    const res = await this.get("/token-references", {
      page_size: 1000,
    });
    return res;
  }

  public async getMetadata() {
    const res = await this.get("/system/metadata", {
      page_size: 1000,
    });
    return res;
  }
}
