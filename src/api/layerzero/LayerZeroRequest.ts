import { BaseLayerZeroRequest } from "../BaseLayerZeroRequest"

export class LayerZeroRequest extends BaseLayerZeroRequest {
  protected _route: string = ""

  public async getHistories(address: string) {
    return await this.get(`/v1/messages/wallet/${address}`)
  }
}
