const { formatNumber, formatUSD } = require("./utils");
const config = require("./config");

class MessageFormatter {
  constructor() {
    this.config = config;
  }

  formatNFTMessage(prices, keepMessage = false) {
    try {
      let message = "📊 NFT Floor Prices\n\n";

      if (prices.magiceden) {
        if (prices.magiceden.eth.quills) {
          message += `Quills Adventure\n`;
          message += `• Floor: ${formatNumber(
            prices.magiceden.eth.quills
          )} ETH (${formatUSD(prices.magiceden.usd.quills)})\n`;

          // Add additional stats if available
          if (prices.magiceden.stats && prices.magiceden.stats.quills) {
            message += `• Listed: ${prices.magiceden.stats.quills.listed}\n`;
            message += `• Owners: ${prices.magiceden.stats.quills.owners}\n`;
            message += `• Total Supply: ${prices.magiceden.stats.quills.items}\n`;
          }

          message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_ETHEREUM.QUILLS}">Magic Eden</a> | <a href="https://opensea.io/collection/quills-adventure">OpenSea</a>\n\n`;
        }
        // if (prices.magiceden.eth.raccoon) {
        //   message += `Raccoon\n`;
        //   message += `• Floor: ${formatNumber(
        //     prices.magiceden.eth.raccoon
        //   )} ETH (${formatUSD(prices.magiceden.usd.raccoon)})\n`;
        //   if (prices.magiceden.stats && prices.magiceden.stats.raccoon) {
        //     message += `• Listed: ${prices.magiceden.stats.raccoon.listed}\n`;
        //     message += `• Owners: ${prices.magiceden.stats.raccoon.owners}\n`;
        //     message += `• Total Supply: ${prices.magiceden.stats.raccoon.items}\n`;
        //   }
        //   message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_ETHEREUM.RACCOON}">Market</a>\n\n`;
        // }
        if (prices.magiceden.eth.vana) {
          message += `Vana\n`;
          message += `• Floor: ${formatNumber(
            prices.magiceden.eth.vana
          )} ETH (${formatUSD(prices.magiceden.usd.vana)})\n`;
          if (prices.magiceden.stats && prices.magiceden.stats.vana) {
            message += `• Listed: ${prices.magiceden.stats.vana.listed}\n`;
            message += `• Owners: ${prices.magiceden.stats.vana.owners}\n`;
            message += `• Total Supply: ${prices.magiceden.stats.vana.items}\n`;
          }
          message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_ETHEREUM.VANA}">Market</a>\n\n`;
        }

        if (prices.magiceden.sol.madlads) {
          message += `Mad Lads\n`;
          message += `• Floor: ${formatNumber(
            prices.magiceden.sol.madlads
          )} SOL (${formatUSD(prices.magiceden.usd.madlads)})\n`;
          if (prices.magiceden.stats && prices.magiceden.stats.madlads) {
            message += `• Listed: ${prices.magiceden.stats.madlads.listed}\n`;
            message += `• Owners: ${prices.magiceden.stats.madlads.owners}\n`;
            message += `• Total Supply: ${prices.magiceden.stats.madlads.items}\n`;
          }
          message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_SOLANA.MAD_LADS}">Market</a>\n\n`;
        }
        if (prices.magiceden.sol.pythenians) {
          message += `Pythenians\n`;
          message += `• Floor: ${formatNumber(
            prices.magiceden.sol.pythenians
          )} SOL (${formatUSD(prices.magiceden.usd.pythenians)})\n`;
          if (prices.magiceden.stats && prices.magiceden.stats.pythenians) {
            message += `• Listed: ${prices.magiceden.stats.pythenians.listed}\n`;
            message += `• Owners: ${prices.magiceden.stats.pythenians.owners}\n`;
            message += `• Total Supply: ${prices.magiceden.stats.pythenians.items}\n`;
          }
          message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_SOLANA.PYTHENIANS}">Market</a>\n\n`;
        }
        if (prices.magiceden.bera.bullas) {
          message += `Bullas\n`;
          message += `• Floor: ${formatNumber(
            prices.magiceden.bera.bullas
          )} BERA (${formatUSD(prices.magiceden.usd.bullas)})\n`;
          if (prices.magiceden.stats && prices.magiceden.stats.bullas) {
            message += `• Listed: ${prices.magiceden.stats.bullas.listed}\n`;
            message += `• Owners: ${prices.magiceden.stats.bullas.owners}\n`;
            message += `• Total Supply: ${prices.magiceden.stats.bullas.items}\n`;
          }
          message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_BERACHAIN.BULLAS}">Market</a>\n\n`;
        }
        if (prices.magiceden.bera.steady_teddys) {
          message += `Steady Teddys\n`;
          message += `• Floor: ${formatNumber(
            prices.magiceden.bera.steady_teddys
          )} BERA (${formatUSD(prices.magiceden.usd.steady_teddys)})\n`;
          if (prices.magiceden.stats && prices.magiceden.stats.steady_teddys) {
            message += `• Listed: ${prices.magiceden.stats.steady_teddys.listed}\n`;
            message += `• Owners: ${prices.magiceden.stats.steady_teddys.owners}\n`;
            message += `• Total Supply: ${prices.magiceden.stats.steady_teddys.items}\n`;
          }
          message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_BERACHAIN.STEADY_TEDDYS}">Market</a>\n\n`;
        }
        // Eclipse NFTs
        if (prices.eclipse && prices.eclipse.eth && prices.eclipse.usd) {
          message += `ECLIPSE ASC\n`;
          message += `• Floor: ${formatNumber(
            prices.eclipse.eth.asc
          )} ETH (${formatUSD(prices.eclipse.usd.asc)})\n`;
          message += `• <a href="${this.config.MARKET_LINKS.ECLIPSE.ASC}">Market</a>\n\n`;

          // message += `ECLIPSE AOFE\n`;
          // message += `• Floor: ${formatNumber(
          //   prices.eclipse.eth.aofe
          // )} ETH (${formatUSD(prices.eclipse.usd.aofe)})\n`;
          // message += `• <a href="${this.config.MARKET_LINKS.ECLIPSE.AOFE}">Market</a>\n\n`;

          message += `ECLIPSE Validators\n`;
          message += `• Floor: ${formatNumber(
            prices.eclipse.eth.validators
          )} ETH (${formatUSD(prices.eclipse.usd.validators)})\n`;
          message += `• <a href="${this.config.MARKET_LINKS.ECLIPSE.VALIDATORS}">Market</a>\n\n`;
        }

        // Modularium NFTs
        if (prices.modularium && prices.modularium.tia.mammoths) {
          message += `Mammoths\n`;
          message += `• Floor: ${formatNumber(
            prices.modularium.tia.mammoths
          )} TIA (${formatUSD(prices.modularium.usd.mammoths)})\n`;
          message += `• <a href="${this.config.MARKET_LINKS.MODULARIUM.MAMMOTHS}">Market</a>\n\n`;
        }

        // Stargaze NFTs
        if (prices.stargaze && prices.stargaze.tia) {
          if (prices.stargaze.tia.sloth) {
            message += `Celestine Sloth\n`;
            message += `• Floor: ${formatNumber(
              prices.stargaze.tia.sloth
            )} TIA (${formatUSD(prices.stargaze.usd.sloth)})\n`;
            message += `• <a href="${this.config.MARKET_LINKS.STARGAZE.SLOTH}">Market</a>\n\n`;
          }

          if (prices.stargaze.tia.omies) {
            message += `OMies\n`;
            message += `• Floor: ${formatNumber(
              prices.stargaze.tia.omies
            )} OM (${formatUSD(prices.stargaze.usd.omies)})\n`;
            message += `• <a href="${this.config.MARKET_LINKS.STARGAZE.OMIES}">Market</a>\n\n`;
          }

          if (prices.stargaze.tia.whale_sharks) {
            message += `Wandering Whale Sharks\n`;
            message += `• Floor: ${formatNumber(
              prices.stargaze.tia.whale_sharks
            )} TIA (${formatUSD(prices.stargaze.usd.whale_sharks)})\n`;
            message += `• <a href="${this.config.MARKET_LINKS.STARGAZE.WHALE_SHARKS}">Market</a>\n\n`;
          }
        }

        // Magic Eden NFTs
      }

      const now = new Date();
      message += `🔄 Last Update: ${now.toLocaleString("en-US", {
        timeZone: "Europe/Istanbul",
      })} (UTC+3)`;

      if (!keepMessage) {
        message += "\n\n⚠️ This message will be deleted in 15 seconds.";
      }

      return message;
    } catch (error) {
      console.error("Format error:", error);
      return "An error occurred while formatting NFT price information.";
    }
  }

  formatSingleNFTMessage(nftType, prices, keepMessage = false) {
    try {
      // Eclipse NFTs
      if (nftType === "asc") {
        if (!prices.eclipse || !prices.eclipse.eth) {
          return "Eclipse NFT data not found.";
        }

        let message = "ECLIPSE ASC\n\n";
        message += `• Floor: ${formatNumber(
          prices.eclipse.eth.asc
        )} ETH (${formatUSD(prices.eclipse.usd.asc)})\n`;
        message += `• <a href="${this.config.MARKET_LINKS.ECLIPSE.ASC}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "aofe") {
        if (!prices.eclipse || !prices.eclipse.eth) {
          return "Eclipse NFT data not found.";
        }

        let message = "ECLIPSE AOFE\n\n";
        message += `• Floor: ${formatNumber(
          prices.eclipse.eth.aofe
        )} ETH (${formatUSD(prices.eclipse.usd.aofe)})\n`;
        message += `• <a href="${this.config.MARKET_LINKS.ECLIPSE.AOFE}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "validators") {
        if (!prices.eclipse || !prices.eclipse.eth) {
          return "Eclipse NFT data not found.";
        }

        let message = "ECLIPSE Validators\n\n";
        message += `• Floor: ${formatNumber(
          prices.eclipse.eth.validators
        )} ETH (${formatUSD(prices.eclipse.usd.validators)})\n`;
        message += `• <a href="${this.config.MARKET_LINKS.ECLIPSE.VALIDATORS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      // Modularium NFTs
      if (nftType === "mammoths") {
        if (!prices.modularium || !prices.modularium.tia) {
          return "Modularium NFT data not found.";
        }

        let message = "Mammoths\n\n";
        message += `• Floor: ${formatNumber(
          prices.modularium.tia.mammoths
        )} TIA (${formatUSD(prices.modularium.usd.mammoths)})\n`;
        message += `• <a href="${this.config.MARKET_LINKS.MODULARIUM.MAMMOTHS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      // Stargaze NFTs
      if (nftType === "sloth") {
        if (!prices.stargaze || !prices.stargaze.tia) {
          return "Stargaze NFT data not found.";
        }

        let message = "Celestine Sloth\n\n";
        message += `• Floor: ${formatNumber(
          prices.stargaze.tia.sloth
        )} TIA (${formatUSD(prices.stargaze.usd.sloth)})\n`;
        message += `• <a href="${this.config.MARKET_LINKS.STARGAZE.SLOTH}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "omies") {
        if (!prices.stargaze || !prices.stargaze.tia) {
          return "Stargaze NFT data not found.";
        }

        let message = "OMies\n\n";
        message += `• Floor: ${formatNumber(
          prices.stargaze.tia.omies
        )} OM (${formatUSD(prices.stargaze.usd.omies)})\n`;
        message += `• <a href="${this.config.MARKET_LINKS.STARGAZE.OMIES}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "whale_sharks") {
        if (!prices.stargaze || !prices.stargaze.tia) {
          return "Stargaze NFT data not found.";
        }

        let message = "Wandering Whale Sharks\n\n";
        message += `• Floor: ${formatNumber(
          prices.stargaze.tia.whale_sharks
        )} TIA (${formatUSD(prices.stargaze.usd.whale_sharks)})\n`;
        message += `• Listed: ${prices.stargaze.stats.whale_sharks.listed}\n`;
        message += `• Owners: ${prices.stargaze.stats.whale_sharks.owners}\n`;
        message += `• <a href="${this.config.MARKET_LINKS.STARGAZE.WHALE_SHARKS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      // Magic Eden NFTs
      if (nftType === "raccoon") {
        if (!prices.magiceden || !prices.magiceden.eth) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Raccoon\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.eth.raccoon
        )} ETH (${formatUSD(prices.magiceden.usd.raccoon)})\n`;
        if (prices.magiceden.stats && prices.magiceden.stats.raccoon) {
          message += `• Listed: ${prices.magiceden.stats.raccoon.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.raccoon.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.raccoon.items}\n`;
        }
        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_ETHEREUM.RACCOON}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "vana") {
        if (!prices.magiceden || !prices.magiceden.eth) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Vana\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.eth.vana
        )} ETH (${formatUSD(prices.magiceden.usd.vana)})\n`;
        if (prices.magiceden.stats && prices.magiceden.stats.vana) {
          message += `• Listed: ${prices.magiceden.stats.vana.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.vana.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.vana.items}\n`;
        }
        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_ETHEREUM.VANA}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "quills") {
        if (!prices.magiceden || !prices.magiceden.eth) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Quills Adventure\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.eth.quills
        )} ETH (${formatUSD(prices.magiceden.usd.quills)})\n`;

        // Add additional stats if available
        if (prices.magiceden.stats && prices.magiceden.stats.quills) {
          message += `• Listed: ${prices.magiceden.stats.quills.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.quills.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.quills.items}\n`;
        }

        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_ETHEREUM.QUILLS}">Magic Eden</a> | <a href="https://opensea.io/collection/quills-adventure">OpenSea</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "madlads") {
        if (!prices.magiceden || !prices.magiceden.sol) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Mad Lads\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.sol.madlads
        )} SOL (${formatUSD(prices.magiceden.usd.madlads)})\n`;
        if (prices.magiceden.stats && prices.magiceden.stats.madlads) {
          message += `• Listed: ${prices.magiceden.stats.madlads.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.madlads.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.madlads.items}\n`;
        }
        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_SOLANA.MAD_LADS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "pythenians") {
        if (!prices.magiceden || !prices.magiceden.sol) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Pythenians\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.sol.pythenians
        )} SOL (${formatUSD(prices.magiceden.usd.pythenians)})\n`;
        if (prices.magiceden.stats && prices.magiceden.stats.pythenians) {
          message += `• Listed: ${prices.magiceden.stats.pythenians.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.pythenians.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.pythenians.items}\n`;
        }
        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_SOLANA.PYTHENIANS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "bullas") {
        if (!prices.magiceden || !prices.magiceden.bera) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Bullas\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.bera.bullas
        )} BERA (${formatUSD(prices.magiceden.usd.bullas)})\n`;
        if (prices.magiceden.stats && prices.magiceden.stats.bullas) {
          message += `• Listed: ${prices.magiceden.stats.bullas.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.bullas.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.bullas.items}\n`;
        }
        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_BERACHAIN.BULLAS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      if (nftType === "steady_teddys") {
        if (!prices.magiceden || !prices.magiceden.bera) {
          return "Magic Eden NFT data not found.";
        }

        let message = "Steady Teddys\n\n";
        message += `• Floor: ${formatNumber(
          prices.magiceden.bera.steady_teddys
        )} BERA (${formatUSD(prices.magiceden.usd.steady_teddys)})\n`;
        if (prices.magiceden.stats && prices.magiceden.stats.steady_teddys) {
          message += `• Listed: ${prices.magiceden.stats.steady_teddys.listed}\n`;
          message += `• Owners: ${prices.magiceden.stats.steady_teddys.owners}\n`;
          message += `• Total Supply: ${prices.magiceden.stats.steady_teddys.items}\n`;
        }
        message += `• <a href="${this.config.MARKET_LINKS.MAGICEDEN_BERACHAIN.STEADY_TEDDYS}">Market</a>\n\n`;
        const now = new Date();
        message += `🔄 Last Update: ${now.toLocaleString("en-US", {
          timeZone: "Europe/Istanbul",
        })} (UTC+3)`;

        if (!keepMessage) {
          message += "\n\n⚠️ This message will be deleted in 15 seconds.";
        }

        return message;
      }

      return "Invalid NFT type";
    } catch (error) {
      console.error("Format error:", error);
      return "An error occurred while formatting NFT price information.";
    }
  }

  getMainMenu() {
    return (
      "🤖 Welcome to NFT Floor Tracking Bot!\n\n" +
      "Type /help for commands.\n\n" +
      "📊 Supported NFTs:\n" +
      "• ASC - /asc\n " +
      "• AOFE - /aofe\n" +
      "• Validators - /validators\n" +
      "• Mammoths - /mammoths\n" +
      "• Sloth - /sloth\n" +
      "• OMies - /omies\n" +
      "• Raccoon - /raccoon\n" +
      "• Vana - /vana\n" +
      "• Quills Adventure - /quills\n" +
      "• Mad Lads - /madlads\n" +
      "• Pythenians - /pythenians\n" +
      "• Whale Sharks - /whale_sharks\n" +
      "• Bullas - /bullas\n" +
      "• Steady Teddys - /steady_teddys\n\n" +
      "💡 Command Usage:\n" +
      "• Normal usage: /command (deletes after 15s)\n" +
      "• For permanent message:\n" +
      "  1. /command -k\n" +
      "  2. /command -keep\n" +
      "  3. /command_k\n\n" +
      "⚠️ This message will be deleted in 15 seconds."
    );
  }

  formatHelpMessage() {
    let message = "🤖 Available Commands\n\n";

    message += "📊 NFT Commands:\n";
    message += "• /all - Show floor prices for all NFTs\n";
    message += "• /asc - ASC floor price info\n";
    message += "• /aofe - AOFE floor price info\n";
    message += "• /validators - Validators floor price info\n";
    message += "• /mammoths - Mammoths floor price info\n";
    message += "• /sloth - Sloth floor price info\n";
    message += "• /omies - OMies floor price info\n";
    message += "• /raccoon - Raccoon floor price info\n";
    message += "• /vana - Vana floor price info\n";
    message += "• /quills - Quills Adventure floor price info\n";
    message += "• /madlads - Mad Lads floor price info\n";
    message += "• /pythenians - Pythenians floor price info\n";
    message += "• /whale_sharks - Whale Sharks floor price info\n";
    message += "• /bullas - Bullas floor price info\n";
    message += "• /steady_teddys - Steady Teddys floor price info\n\n";

    message += "❓ Other Commands:\n";
    message += "• /help - Shows this help message\n\n";

    message += "💡 Message Delete Feature:\n";
    message += "By default, all messages are deleted after 15 seconds.\n";
    message +=
      "If you don't want the message to be deleted, you have three options:\n";
    message += "1. /command -k (short version)\n";
    message += "2. /command -keep (long version)\n";
    message += "3. /command_k (alternative version)\n\n";
    message += "Example Usage:\n";
    message += "• /all -k → Show all prices and keep message\n";
    message += "• /all -keep → Show all prices and keep message\n";
    message += "• /all_k → Show all prices and keep message\n";
    message += "• /asc -k → Show ASC price and keep message\n\n";

    message += "⚠️ This message will be deleted in 15 seconds.";

    return message;
  }
}

module.exports = new MessageFormatter();
