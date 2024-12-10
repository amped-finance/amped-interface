import { providers } from "ethers";
import { useMemo } from "react";

export function clientToProvider(client) {
  const { chain, transport } = client;
  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  return providers.JsonRpcProvider
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      transport.transports.map(({ value }) => new providers.JsonRpcProvider(value?.url, network))
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

/** Action to convert a Viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId } = {}) {
  const client = useClien({ chainId });
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client]);
}
