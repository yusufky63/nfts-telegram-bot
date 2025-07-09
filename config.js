require("dotenv").config();

module.exports = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,

  // NFT API Endpoints
  API_URLS: {
    ECLIPSE_ASC:
      "https://market-api.wlbl.xyz/marketplace/api/v4/statistics/collections/ECLIPSE-6ffVbxEZVWtksbXtQbt8xzudyain8MdsVdkkXxvaxznC/stats",
    ECLIPSE_AOFE:
      "https://market-api.wlbl.xyz/marketplace/api/v4/statistics/collections/ECLIPSE-hY3cyDvr14ohe5XUXFm2GgmFiL4JEeFUtTQZn772qmA/stats",
    ECLIPSE_VALIDATORS:
      "https://market-api.wlbl.xyz/marketplace/api/v4/statistics/collections/ECLIPSE-5EvQZqoRybG2Ri9fZFE5cpV8pR8jwVdSf3x6h8qmHJkR/stats",

    SLOTH: "https://graphql.mainnet.stargaze-apis.com/graphql",
    MAMMOTHS:
      "https://api.modularium.art/collection/0xbE25A97896b9CE164a314C70520A4df55979a0c6/floor-listings",
    MAGICEDEN_ETHEREUM:
      "https://stats-mainnet.magiceden.io/collection_stats/stats?chain=ethereum&collectionId=",
    MAGICEDEN_SOLANA:
      "https://stats-mainnet.magiceden.io/collection_stats/stats?chain=solana&collectionId=",
    MAGICEDEN_BERACHAIN:
      "https://stats-mainnet.magiceden.us/collection_stats/stats?chain=berachain&collectionId=",
  },

  // Market Links
  MARKET_LINKS: {
    ECLIPSE: {
      ASC: "https://scopenft.xyz/explore/ECLIPSE:6ffVbxEZVWtksbXtQbt8xzudyain8MdsVdkkXxvaxznC?sort=cheapest",
      AOFE: "https://scopenft.xyz/explore/ECLIPSE:hY3cyDvr14ohe5XUXFm2GgmFiL4JEeFUtTQZn772qmA?sort=cheapest",
      VALIDATORS:
        "https://scopenft.xyz/explore/ECLIPSE:5EvQZqoRybG2Ri9fZFE5cpV8pR8jwVdSf3x6h8qmHJkR?sort=cheapest",
    },
    STARGAZE: {
      SLOTH:
        "https://www.stargaze.zone/m/stars10n0m58ztlr9wvwkgjuek2m2k0dn5pgrhfw9eahg9p8e5qtvn964suc995j/tokens",
      OMIES: "https://www.stargaze.zone/m/onchain-omies/tokens",
      WHALE_SHARKS: "https://www.stargaze.zone/m/stars15mtxukmppwf2st8aeyjyl0hmyqu2pa3p8522wkptltek2hmypvhqhh07e0/tokens"
    },
    MODULARIUM: {
      MAMMOTHS: "https://modularium.art/collection/mammoths",
    },
    MAGICEDEN_ETHEREUM: {
      RACCOON:
        "https://magiceden.io/collections/ethereum/raccoons-genesis-pass",
      VANA: "https://magiceden.io/collections/ethereum/0x87d25e5e755b69943572a58936843ffa894afd66",
      QUILLS: "https://magiceden.io/collections/ethereum/0xd887090fc6f9af10abe6cf287ac8011a3cb55a65",
    },
    MAGICEDEN_SOLANA: {
      MAD_LADS: "https://magiceden.io/en/marketplace/mad_lads",
      PYTHENIANS: "https://magiceden.io/en/marketplace/pythenians",
    },
    MAGICEDEN_BERACHAIN: {
      BULLAS: "https://magiceden.us/collections/berachain/0x333814f5e16eee61d0c0b03a5b6abbd424b381c2",
      STEADY_TEDDYS: "https://magiceden.us/collections/berachain/0x88888888A9361f15AAdBAca355A6B2938C6A674e",
    },
  },

  OMIES_PRICE: {
    COINGECKO:
      "https://api.coingecko.com/api/v3/simple/price?ids=mantra-dao&vs_currencies=usd",
  },

  // TIA Price API Endpoints
  TIA_PRICE_APIS: {
    COINGECKO:
      "https://api.coingecko.com/api/v3/simple/price?ids=celestia&vs_currencies=usd",
    BINANCE: "https://api.binance.com/api/v3/ticker/price?symbol=TIAUSDT",
    KRAKEN: "https://api.kraken.com/0/public/Ticker?pair=TIAUSD",
    GATE: "https://api.gateio.ws/api/v4/spot/tickers?currency_pair=TIA_USDT",
  },

  // Timeout Setting
  FETCH_TIMEOUT: 30000, // 30 seconds
};
