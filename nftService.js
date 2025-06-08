const axios = require("axios");
const config = require("./config");

class NFTService {
  constructor() {
    this.config = config;
    this.MAMMOTHS_API = config.API_URLS.MAMMOTHS;
    this.STARGAZE_API = config.API_URLS.SLOTH;
    this.MAGICEDEN_ETH_API = config.API_URLS.MAGICEDEN_ETHEREUM;
    this.MAGICEDEN_SOL_API = config.API_URLS.MAGICEDEN_SOLANA;
    this.MAGICEDEN_BERA_API = config.API_URLS.MAGICEDEN_BERACHAIN;
    this.SLOTH_CONTRACT =
      "stars10n0m58ztlr9wvwkgjuek2m2k0dn5pgrhfw9eahg9p8e5qtvn964suc995j";
    this.OMIES_CONTRACT = "stars1j5fhf04q6sycz72mz5uzrwvv2e05jy3npsdzppxyl2eww0x5hy4s0wuftp";
    this.WHALE_SHARKS_CONTRACT = "stars15mtxukmppwf2st8aeyjyl0hmyqu2pa3p8522wkptltek2hmypvhqhh07e0";
    this.RACCOON_CONTRACT = "0x5765a0ca7d8b98b04b80323d327e611beeeb2092";
    this.VANA_CONTRACT = "0x87d25e5e755b69943572a58936843ffa894afd66";
    this.QUILLS_CONTRACT = "0xd887090fc6f9af10abe6cf287ac8011a3cb55a65";
    this.MAD_LADS_CONTRACT = "mad_lads";
    this.PYTHENIANS_CONTRACT = "pythenians";
    this.BULLAS_CONTRACT = "0x333814f5e16eee61d0c0b03a5b6abbd424b381c2";
    this.STEADY_TEDDYS_CONTRACT = "0x88888888a9361f15aadbaca355a6b2938c6a674e";

    // Cache variables
    this.tiaPrice = null;
    this.ethPrice = null;
    this.solPrice = null;
    this.mantraPrice = null;
    this.lastTiaPriceUpdate = null;
    this.lastEthPriceUpdate = null;
    this.lastSolPriceUpdate = null;
    this.lastMantraPriceUpdate = null;
    this.CACHE_DURATION = 1 * 60 * 30000; // 30 minutes (in milliseconds)
    this.beraPrice = null;
    this.lastBeraPriceUpdate = null;

    this.axiosInstance = axios.create({
      timeout: config.FETCH_TIMEOUT,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }

  async fetchEclipseData(url) {
    try {
      const response = await this.axiosInstance.get(url);
      console.log("Eclipse raw data:", response.data);

      // Get data directly from API response
      return {
        nativeVolume: {
          floorPrice: response.data?.nativeVolume?.floorPrice || 0,
          volume: response.data?.nativeVolume?.volume || 0,
          highestSale: response.data?.nativeVolume?.highestSale || 0,
          marketCap: response.data?.nativeVolume?.marketCap || 0,
          totalListed: response.data?.items || 0,
        },
        usdVolume: {
          floorPrice: response.data?.usdVolume?.floorPrice || 0,
          volume: response.data?.usdVolume?.volume || 0,
          highestSale: response.data?.usdVolume?.highestSale || 0,
          marketCap: response.data?.usdVolume?.marketCap || 0,
        },
        stats: {
          items: response.data?.items || 0,
          owners: response.data?.owners || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching Eclipse data:", error);
      return {
        nativeVolume: {
          floorPrice: 0,
          volume: 0,
          highestSale: 0,
          marketCap: 0,
          totalListed: 0,
        },
        usdVolume: { floorPrice: 0, volume: 0, highestSale: 0, marketCap: 0 },
        stats: { items: 0, owners: 0 },
      };
    }
  }

  async fetchMamutData() {
    try {
      const response = await this.axiosInstance.get(this.MAMMOTHS_API);
      
      // Get floor price from first listing
      const floorPrice = response.data[0]?.floorPrice || 0;
      
      return {
        nativeVolume: {
          floorPrice: floorPrice,
          volume: 0, // These data are no longer in API
          highestSale: 0,
          totalListed: 0
        },
        stats: {
          items: 0,
          owners: 0,
          avgPrice: 0,
          totalSales: 0
        }
      };
    } catch (error) {
      console.error("Error fetching Mammoth data:", error);
      return null;
    }
  }

  async fetchStargazeData(contractAddress) {
    try {
      const query = `query CollectionHeaderStats($collectionAddr: String!) {
        collection(address: $collectionAddr) {
          floor {
            amount
            amountUsd
            denom
            symbol
            rate
          }
          tokenCounts {
            listed
            active
          }
          stats {
            numOwners
            uniqueOwnerPercent
          }
        }
      }`;

      // OMies special handling
      if (contractAddress === this.OMIES_CONTRACT) {
        const [response, mantraPrice] = await Promise.all([
          this.axiosInstance.post(this.STARGAZE_API, {
            query,
            variables: {
              collectionAddr: contractAddress,
            },
            operationName: "CollectionHeaderStats",
          }),
          this.getMantraPrice()
        ]);

        const floorPrice = response.data?.data?.collection?.floor?.amount || 0;
        const listed = response.data?.data?.collection?.tokenCounts?.listed || 0;
        const owners = response.data?.data?.collection?.stats?.numOwners || 0;

        // Floor price directly in OM
        const omFloor = parseFloat(floorPrice) / 1000000;
        // USD value for floor price multiply by Mantra price
        const usdPrice = omFloor * mantraPrice;

        return {
          price: omFloor, // OM floor
          usdPrice: usdPrice, // USD value
          listed,
          owners
        };
      }

      // Normal handling for other NFTs
      const response = await this.axiosInstance.post(this.STARGAZE_API, {
        query,
        variables: {
          collectionAddr: contractAddress,
        },
        operationName: "CollectionHeaderStats",
      });

      const floorPrice = response.data?.data?.collection?.floor?.amount || 0;
      const listed = response.data?.data?.collection?.tokenCounts?.listed || 0;
      const owners = response.data?.data?.collection?.stats?.numOwners || 0;

      return {
        price: parseFloat(floorPrice) / 1000000,
        listed,
        owners
      };
    } catch (error) {
      console.error("Error fetching Stargaze data:", error);
      return null;
    }
  }

  async getMantraPrice() {
    try {
      // Cache check
      const now = Date.now();
      if (this.mantraPrice && this.lastMantraPriceUpdate && (now - this.lastMantraPriceUpdate) < this.CACHE_DURATION) {
        console.log("Mantra price retrieved from cache");
        return this.mantraPrice;
      }

      // No cache or expired, fetch new data
      const response = await this.axiosInstance.get(this.config.OMIES_PRICE.COINGECKO);
      this.mantraPrice = response.data?.['mantra-dao']?.usd || 0;
      this.lastMantraPriceUpdate = now;
      console.log("Mantra price fetched from API");
      return this.mantraPrice;
    } catch (error) {
      console.error("Error fetching Mantra price:", error);
      if (this.mantraPrice !== null) {
        console.log("Using cached Mantra price due to error");
        return this.mantraPrice;
      }
      return 0;
    }
  }

  async getTiaPrice() {
    try {
      // Cache check
      const now = Date.now();
      if (this.tiaPrice && this.lastTiaPriceUpdate && (now - this.lastTiaPriceUpdate) < this.CACHE_DURATION) {
        console.log("TIA price retrieved from cache");
        return this.tiaPrice;
      }

      // No cache or expired, fetch new data
      const response = await this.axiosInstance.get(this.config.TIA_PRICE_APIS.COINGECKO);
      this.tiaPrice = response.data?.celestia?.usd || 0;
      this.lastTiaPriceUpdate = now;
      console.log("TIA price fetched from API");
      return this.tiaPrice;
    } catch (error) {
      console.error("Error fetching TIA price:", error);
      if (this.tiaPrice !== null) {
        console.log("Using cached TIA price due to error");
        return this.tiaPrice;
      }
      return 0;
    }
  }

  async getEthPrice() {
    try {
      // Cache check
      const now = Date.now();
      if (this.ethPrice && this.lastEthPriceUpdate && (now - this.lastEthPriceUpdate) < this.CACHE_DURATION) {
        console.log("ETH price retrieved from cache");
        return this.ethPrice;
      }

      // No cache or expired, fetch new data
      const response = await this.axiosInstance.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      this.ethPrice = response.data?.ethereum?.usd || 0;
      this.lastEthPriceUpdate = now;
      console.log("ETH price fetched from API");
      return this.ethPrice;
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      if (this.ethPrice !== null) {
        console.log("Using cached ETH price due to error");
        return this.ethPrice;
      }
      return 0;
    }
  }

  async getSolPrice() {
    try {
      // Cache check
      const now = Date.now();
      if (this.solPrice && this.lastSolPriceUpdate && (now - this.lastSolPriceUpdate) < this.CACHE_DURATION) {
        console.log("SOL price retrieved from cache");
        return this.solPrice;
      }

      // No cache or expired, fetch new data
      const response = await this.axiosInstance.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
      );
      this.solPrice = response.data?.solana?.usd || 0;
      this.lastSolPriceUpdate = now;
      console.log("SOL price fetched from API");
      return this.solPrice;
    } catch (error) {
      console.error("Error fetching SOL price:", error);
      if (this.solPrice !== null) {
        console.log("Using cached SOL price due to error");
        return this.solPrice;
      }
      return 0;
    }
  }

  async fetchMagicEdenData(contractAddress) {
    try {
      // Solana NFTs
      if (contractAddress === this.MAD_LADS_CONTRACT || contractAddress === this.PYTHENIANS_CONTRACT) {
        const response = await this.axiosInstance.get(`${this.MAGICEDEN_SOL_API}${contractAddress}`);
        const solPrice = response.data?.floorPrice?.native || 0;
        console.log(`Solana NFT price: ${solPrice} SOL`);
        return {
          price: solPrice,
          currency: 'SOL',
          listedCount: response.data?.listedCount || 0,
          ownerCount: response.data?.ownerCount || 0,
          tokenCount: response.data?.tokenCount || "0"
        };
      }
      
      // Berachain NFTs
      if (contractAddress === this.BULLAS_CONTRACT || contractAddress === this.STEADY_TEDDYS_CONTRACT) {
        console.log(`Fetching data for contract: ${contractAddress}`);
        const response = await this.axiosInstance.get(`${this.MAGICEDEN_BERA_API}${contractAddress}`);
        console.log(`API Response for ${contractAddress}:`, response.data);
        
        if (!response.data || Object.keys(response.data).length === 0) {
          console.error(`No data received for ${contractAddress}`);
          return {
            price: 0,
            currency: 'BERA',
            listedCount: 0,
            ownerCount: 0,
            tokenCount: "0"
          };
        }

        const beraPrice = response.data?.floorPrice?.native || 0;
        console.log(`${contractAddress} price: ${beraPrice} BERA`);
        return {
          price: beraPrice,
          currency: 'BERA',
          listedCount: response.data?.listedCount || 0,
          ownerCount: response.data?.ownerCount || 0,
          tokenCount: response.data?.tokenCount || "0"
        };
      }

      // Ethereum NFTs
      const response = await this.axiosInstance.get(`${this.MAGICEDEN_ETH_API}${contractAddress}`);
      
      // Extract additional data for all Magic Eden NFTs
      return {
        price: response.data?.floorPrice?.amount || 0,
        currency: 'ETH',
        listedCount: response.data?.listedCount || 0,
        ownerCount: response.data?.ownerCount || 0,
        tokenCount: response.data?.tokenCount || "0"
      };
    } catch (error) {
      console.error("Error fetching Magic Eden data:", error);
      return null;
    }
  }

  async getBeraPrice() {
    try {
      // Cache check
      const now = Date.now();
      if (this.beraPrice && this.lastBeraPriceUpdate && (now - this.lastBeraPriceUpdate) < this.CACHE_DURATION) {
        console.log("BERA price retrieved from cache");
        return this.beraPrice;
      }

      // No cache or expired, fetch new data
      const response = await this.axiosInstance.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=berachain-bera&vs_currencies=usd"
      );
      this.beraPrice = response.data?.['berachain-bera']?.usd || 0;
      this.lastBeraPriceUpdate = now;
      console.log("BERA price fetched from API");
      return this.beraPrice;
    } catch (error) {
      console.error("Error fetching BERA price:", error);
      if (this.beraPrice !== null) {
        console.log("Using cached BERA price due to error");
        return this.beraPrice;
      }
      return 0;
    }
  }

  async getNFTPrices() {
    try {
      const [
        eclipseAscData,
        eclipseAofeData,
        eclipseValidatorsData,
        mammothsData,
        slothData,
        omiesData,
        whaleSharkData,
        raccoonData,
        vanaData,
        quillsData,
        madLadsData,
        pytheniansData,
        bullasData,
        steadyTeddysData,
        tiaPrice,
        ethPrice,
        solPrice,
        beraPrice
        
      ] = await Promise.all([
        this.fetchEclipseData(this.config.API_URLS.ECLIPSE_ASC),
        this.fetchEclipseData(this.config.API_URLS.ECLIPSE_AOFE),
        this.fetchEclipseData(this.config.API_URLS.ECLIPSE_VALIDATORS),
        this.fetchMamutData(),
        this.fetchStargazeData(this.SLOTH_CONTRACT),
        this.fetchStargazeData(this.OMIES_CONTRACT),
        this.fetchStargazeData(this.WHALE_SHARKS_CONTRACT),
        this.fetchMagicEdenData(this.RACCOON_CONTRACT),
        this.fetchMagicEdenData(this.VANA_CONTRACT),
        this.fetchMagicEdenData(this.QUILLS_CONTRACT),
        this.fetchMagicEdenData(this.MAD_LADS_CONTRACT),
        this.fetchMagicEdenData(this.PYTHENIANS_CONTRACT),
        this.fetchMagicEdenData(this.BULLAS_CONTRACT),
        this.fetchMagicEdenData(this.STEADY_TEDDYS_CONTRACT),
        this.getTiaPrice(),
        this.getEthPrice(),
        this.getSolPrice(),
        this.getBeraPrice()
      ]);

      return {
        eclipse: {
          eth: {
            asc: eclipseAscData?.nativeVolume?.floorPrice || 0,
            aofe: eclipseAofeData?.nativeVolume?.floorPrice || 0,
            validators: eclipseValidatorsData?.nativeVolume?.floorPrice || 0,
          },
          usd: {
            asc: eclipseAscData?.usdVolume?.floorPrice || 0,
            aofe: eclipseAofeData?.usdVolume?.floorPrice || 0,
            validators: eclipseValidatorsData?.usdVolume?.floorPrice || 0,
          },
        },
        modularium: {
          tia: {
            mammoths: mammothsData?.nativeVolume?.floorPrice || 0,
          },
          usd: {
            mammoths: (mammothsData?.nativeVolume?.floorPrice || 0) * tiaPrice,
          },
          stats: {
            listed: mammothsData?.nativeVolume?.totalListed || 0,
            owners: mammothsData?.stats?.owners || 0,
            volume: mammothsData?.nativeVolume?.volume || 0,
            avgPrice: mammothsData?.stats?.avgPrice || 0,
            totalSales: mammothsData?.stats?.totalSales || 0,
            items: mammothsData?.stats?.items || 0
          }
        },
        stargaze: {
          tia: {
            sloth: slothData?.price || 0,
            omies: omiesData?.price || 0, // OM floor
            whale_sharks: whaleSharkData?.price || 0
          },
          usd: {
            sloth: (slothData?.price || 0) * tiaPrice,
            omies: omiesData?.usdPrice || 0, // USD value
            whale_sharks: (whaleSharkData?.price || 0) * tiaPrice
          },
          stats: {
            sloth: {
              listed: slothData?.listed || 0,
              owners: slothData?.owners || 0
            },
            omies: {
              listed: omiesData?.listed || 0,
              owners: omiesData?.owners || 0
            },
            whale_sharks: {
              listed: whaleSharkData?.listed || 0,
              owners: whaleSharkData?.owners || 0
            }
          }
        },
        magiceden: {
          eth: {
            raccoon: raccoonData?.price || 0,
            vana: vanaData?.price || 0,
            quills: quillsData?.price || 0,
          },
          sol: {
            madlads: madLadsData?.price || 0,
            pythenians: pytheniansData?.price || 0
          },
          bera: {
            bullas: bullasData?.price || 0,
            steady_teddys: steadyTeddysData?.price || 0
          },
          usd: {
            raccoon: (raccoonData?.price || 0) * ethPrice,
            vana: (vanaData?.price || 0) * ethPrice,
            quills: (quillsData?.price || 0) * ethPrice,
            madlads: (madLadsData?.price || 0) * solPrice,
            pythenians: (pytheniansData?.price || 0) * solPrice,
            bullas: (bullasData?.price || 0) * beraPrice,
            steady_teddys: (steadyTeddysData?.price || 0) * beraPrice
          },
          stats: {
            raccoon: {
              listed: raccoonData?.listedCount || 0,
              owners: raccoonData?.ownerCount || 0,
              items: raccoonData?.tokenCount || "0"
            },
            vana: {
              listed: vanaData?.listedCount || 0,
              owners: vanaData?.ownerCount || 0,
              items: vanaData?.tokenCount || "0"
            },
            quills: {
              listed: quillsData?.listedCount || 0,
              owners: quillsData?.ownerCount || 0,
              items: quillsData?.tokenCount || "0"
            },
            madlads: {
              listed: madLadsData?.listedCount || 0,
              owners: madLadsData?.ownerCount || 0,
              items: madLadsData?.tokenCount || "0"
            },
            pythenians: {
              listed: pytheniansData?.listedCount || 0,
              owners: pytheniansData?.ownerCount || 0,
              items: pytheniansData?.tokenCount || "0"
            },
            bullas: {
              listed: bullasData?.listedCount || 0,
              owners: bullasData?.ownerCount || 0,
              items: bullasData?.tokenCount || "0"
            },
            steady_teddys: {
              listed: steadyTeddysData?.listedCount || 0,
              owners: steadyTeddysData?.ownerCount || 0,
              items: steadyTeddysData?.tokenCount || "0"
            }
          }
        }
      };
    } catch (error) {
      console.error("Error fetching NFT prices:", error);
      throw error;
    }
  }
}

module.exports = NFTService;
