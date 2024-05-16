import { ARBITRUM, PEGASUS, PHOENIX } from "./chains";

export const XGMT_EXCLUDED_ACCOUNTS = [
  "0x330eef6b9b1ea6edd620c825c9919dc8b611d5d5",
  "0xd9b1c23411adbb984b1c4be515fafc47a12898b2",
  "0xa633158288520807f91ccc98aa58e0ea43acb400",
  "0xffd0a93b4362052a336a7b22494f1b77018dd34b",
];

const CONTRACTS = {
  [ARBITRUM]: {
    // arbitrum mainnet
    Vault: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    Router: "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064",
    VaultReader: "0xfebB9f4CAC4cD523598fE1C5771181440143F24A",
    Reader: "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694",
    AlpManager: "0x321F653eED006AD1C29D174e17d96351BDe22649",
    RewardRouter: "0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1",
    RewardReader: "0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0",
    NATIVE_TOKEN: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    ALP: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
    AMP: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
    ES_AMP: "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
    BN_AMP: "0x35247165119B69A40edD5304969560D0ef486921",
    USDG: "0x45096e7aA921f27590f8F19e457794EB09678141",
    ES_AMP_IOU: "0x6260101218eC4cCfFF1b778936C6f2400f95A954",
    StakedAmpTracker: "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
    BonusAmpTracker: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
    FeeAmpTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    StakedAlpTracker: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    FeeAlpTracker: "0x4e971a87900b931fF39d1Aad67697F49835400b6",

    StakedAmpDistributor: "0x23208B91A98c7C1CD9FE63085BFf68311494F193",
    StakedAlpDistributor: "0x60519b48ec4183a61ca2B8e37869E675FD203b34",

    AmpVester: "0x199070DDfd1CFb69173aa2F7e20906F26B363004",
    AlpVester: "0xA75287d2f8b217273E7FCD7E86eF07D33972042E",

    OrderBook: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
    OrderExecutor: "0x7257ac5D0a0aaC04AA7bA2AC0A6Eb742E332c3fB",
    OrderBookReader: "0xa27C20A7CF0e1C68C0460706bB674f98F362Bc21",

    PositionRouter: "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
    PositionManager: "0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C",

    UniswapAmpEthPool: "0x80A9ae39310abf666A87C743d6ebBD0E8C42158E",
    ReferralStorage: "0xe6fab3f0c7199b0d34d7fbe83394fc0e0d06e99d",
    ReferralReader: "0x8Aa382760BCdCe8644C33e6C2D52f6304A76F5c8",
  },
  [PEGASUS]: {
    Vault: "0x42B866059487c082814474e8c822071ec9A208d6",
    Router: "0x24BBb3a9B0CDFfe87F6F64c96203a36c449Cd3C4",
    VaultReader: "0xC8664e709Eb97bb23AA46b5cf33F29d5E411bd82",
    Reader: "0x93BEf47d010E02eBAA7e6F0F73567d4D725ef0B7",
    AlpManager: "0xC2d20F852c25Fc3E219487500E27A5a4a5f4FE7E",
    RewardRouter: "0x8A2fDCC267cF15B554E14037B664D53566fb1746",
    RewardReader: "0x75864b161177e7d775aE83Dda5862a5aC68D1D5D",
    NATIVE_TOKEN: "0xF42991f02C07AB66cFEa282E7E482382aEB85461",
    ALP: "0x8FDE62036b9b484Cc7F1B0268037F53C81C69B69",
    AMP: "0x744C9C58EFd853C512087152e1C988b3E4B82335",
    ES_AMP: "0xDcD23fC4855c67745070A632e63660aCc1936982", 
    BN_AMP: "0xD88c1392c1513e45D6eD22794b15c4E20329fE2a", 
    USDG: "0xab09EB2f88CD7126ae59b9E611E00633767a0A7c",
    ES_AMP_IOU: "0x88BBC2ddC2F19CEFe9ce7D63159f517e7Ae6861B", 

    StakedAmpTracker: "0xdFF17a9fCa353d47F4948F88a972C22EE1373d71", 
    BonusAmpTracker: "0xaCC840Dc3686e34DD060cA506C0dF1104bd67972", 
    FeeAmpTracker: "0x95F907DEdF9363c677B29791CFe4E47a0D675B0B", 
    StakedAlpTracker: "0x9a3aa1468fFF80dE5255A0E1C43Eb7CC95dca2fd", 
    FeeAlpTracker: "0xb2F5F009913a1775c97fa1E3b85A8f726AB5Cb44", 

    StakedAmpDistributor: "0x9c8CACFD6851894464C2920aa42833Ab4A66259e",
    StakedAlpDistributor: "0xAA6Fa748F46B76e6f4B6de6cDF35651fe8c1C567",

    AmpVester: "0xCC96a7AC410B8Be75DF2763a419B9BfCcCE89520",
    AlpVester: "0x3Ef416d4e2705E955E71179d370aCc00d9461812",

    OrderBook: "0x985d375051630693B6b4Aa2cE810318135e18F88",
    OrderExecutor: "0xA76fB4882bcb66fBe68948B71eBe7f3B80e329Ea", //not used
    OrderBookReader: "0x2011e13Cb8999678918D2FD1cDa3A78cD443CaEf",

    PositionRouter: "0xb59527c9175692872DdC92003289e6b8b462CcE8", 
    PositionManager: "0x84D91f858423040a624eAB4F2b1D5c0B6e3c9204",

    TraderJoeAmpAvaxPool: "0xE80B4F755417FB4baF4dbd23C029db3F62786523", //not used
    ReferralStorage: "0x40288e97B1bA7dD5Ed8d4FB71a26A73C0583C915",
    ReferralReader: "0x0c390fcAea5Fb2005D46265037575CAC0Bed3B9E",
  },
  [PHOENIX]: {
    Vault: "0x976156BE19D35ac616c67737258EEc973202E6D6",
    Router: "0x74c6216F43fff75826fB3e80fb02C812a53d0f96",
    VaultReader: "0xE5066368f62888F185C8F2234A02974F949995Ab",
    Reader: "0x9f30959518fdE8B4d98c1730E5963CeDC3b3F8Af",
    AlpManager: "0xc5f83027451FFeC1F5Fa824b337Dc65283243D43",
    RewardRouter: "0xA841aCb4Ee5767431AD089efbB401a37ab748468",
    RewardReader: "0xC144F414FdC5D7eB8891d39809e0538D1D7beE6b",
    NATIVE_TOKEN: "0x7ebef2a4b1b09381ec5b9df8c5c6f2dbeca59c73",
    ALP: "0x6c6647B3E6AfA27B8Fb9BEDe728A3603eB6c0fC7",
    AMP: "0x24CAE6D1738522551371ca6536F227c727184eD8",
    ES_AMP: "0xdF4a63976759742578DC124337766D52f908Dd39", 
    BN_AMP: "0x2E04745ddF13b19f0f054E005D6e673A61593662", 
    USDG: "0xb60B76555EB98837c2A9E67BD86a49b64bc96778",
    ES_AMP_IOU: "0xdF4a63976759742578DC124337766D52f908Dd39", // placeholder address

    StakedAmpTracker: "0x48f206bED002fae4EcB522Dfe36e5A10F15e9f47",
    BonusAmpTracker: "0xe07a85ca5765429A4EE14E66089ce35F7546AC7c", 
    FeeAmpTracker: "0xe87a6AD46e250D48918dE2a39563FA55d61772Bd",
    StakedAlpTracker: "0xcBF6A0359a8fE2Fa32baD8a0BDD1814c8771016d", 
    FeeAlpTracker: "0xe6Af73BFEfE37dd91eeb89eACC75d5fC67F82C81",

    StakedAmpDistributor: "0x7BbBB0EAb30844D8117E74C55384a2cEE60b34Ea",
    StakedAlpDistributor: "0x44C249aC1C37dc17e9a77398E5E0017BAf8Ae9E9",

    AmpVester: "0x1E62990034E9EAab92a3d7C58FCf1869fBbD7847",
    AlpVester: "0x01a0948397E398d4758A8836eE0fc641dcA6B4a8",

    OrderBook: "0x54808b301CdD7D21E9cF81Cfdd3eea2325Eb3e73",
    OrderExecutor: "0xA76fB4882bcb66fBe68948B71eBe7f3B80e329Ea",//replaced //unused
    OrderBookReader: "0x1E1d5c53d68Eb469489dFC6dff79033203a49e16",

    PositionRouter: "0xAd31110bD734a94D1858d33b2e41eAe5D07baE3e", 
    PositionManager: "0xF6cA8aE8d01A6fab6e16A7D066438b3fdac13290",

    TraderJoeAmpAvaxPool: "0xE80B4F755417FB4baF4dbd23C029db3F62786523",//replaced
    ReferralStorage: "0x00eED30299Be87d53a2611c2137fC2573c737cf3",
    ReferralReader: "0x5831489059F6127503e6e13d0F3EA9AF0Eb8532C",
  },
};

export function getContract(chainId: number, name: string): string {
  if (!CONTRACTS[chainId]) {
    throw new Error(`Unknown chainId ${chainId}`);
  }

  if (!CONTRACTS[chainId][name]) {
    throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
  }

  return CONTRACTS[chainId][name];
}
