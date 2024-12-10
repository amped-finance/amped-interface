import { LayerZeroRequest } from "./layerzero/LayerZeroRequest"
import { PriceRequest } from "./price/PriceRequest"

const RequestMap: { [key: string]: any } = {
  PriceRequest: PriceRequest,
  LayerZeroRequest: LayerZeroRequest,
}

// override this object to store instances of requests
const instances: { [key: string]: any } = {}

export class RequestFactory {
  static getRequest<T>(className: string): T {
    const RequestClass = RequestMap[className]
    if (!RequestClass) {
      throw new Error(`Invalid request class name: ${className}`)
    }

    let requestInstance = instances[className]
    if (!requestInstance) {
      requestInstance = new RequestClass()
      instances[className] = requestInstance
    }
    return requestInstance as T
  }

  static getPriceRequest() {
    return RequestFactory.getRequest<PriceRequest>("PriceRequest")
  }

  static getLayerZeroRequest() {
    return RequestFactory.getRequest<LayerZeroRequest>("LayerZeroRequest")
  }
}
