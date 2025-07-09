const TelegramBot = require("node-telegram-bot-api");
const config = require("../config");
const NFTService = require("../nftService");
const messageFormatter = require("../messageFormatter");

const token = process.env.TELEGRAM_TOKEN;

if (!token) {
  console.error('TELEGRAM_TOKEN not found in environment variables!');
}

// Initialize bot with webhook mode
const bot = new TelegramBot(token, {
  webHook: {
    port: parseInt(process.env.PORT || "3000", 10)
  }
});

const nftService = new NFTService();

// Webhook handler for Render
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { body } = req;
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Process Telegram update
    await processUpdate(body);
    
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Process Telegram updates
async function processUpdate(update) {
  try {
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
    }
  } catch (error) {
    console.error('Error processing update:', error);
  }
}

// Handle incoming messages
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id;
  const text = msg.text || '';

  console.log('Processing message:', text);

  try {
    // Test command
    if (text.match(/^\/test/)) {
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      const sentMessage = await bot.sendMessage(chatId, "Bot Working on Vercel! 🚀", messageOptions);
      
      setTimeout(async () => {
        try {
          await bot.deleteMessage(chatId, sentMessage.message_id);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      }, 15000);
      return;
    }

    // Start command
    if (text.match(/^\/start/)) {
      const mainMenu = messageFormatter.getMainMenu();
      
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      await bot.sendMessage(chatId, mainMenu, messageOptions);
      return;
    }

    // Help command
    if (text.match(/^\/help/)) {
      const helpMessage = messageFormatter.formatHelpMessage();
      
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      await bot.sendMessage(chatId, helpMessage, messageOptions);
      return;
    }

    // All NFTs command
    if (text.match(/^\/(all(?:_k)?(?:\s*-k|\s*-keep)?)/)) {
      await handleAllNftsCommand(msg);
      return;
    }

    // Individual NFT commands
    const nftCommands = {
      '^/(asc(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'asc',
      '^/(aofe(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'aofe',
      '^/(validators(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'validators',
      '^/(mammoths(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'mammoths',
      '^/(sloth(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'sloth',
      '^/(omies(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'omies',
      '^/(raccoon(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'raccoon',
      '^/(vana(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'vana',
      '^/(quills(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'quills',
      '^/(madlads(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'madlads',
      '^/(pythenians(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'pythenians',
      '^/(whale_sharks(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'whale_sharks',
      '^/(bullas(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'bullas',
      '^/(steady_teddys(?:_k)?(?:\\s*-k|\\s*-keep)?)': 'steady_teddys'
    };

    for (const [pattern, nftType] of Object.entries(nftCommands)) {
      if (text.match(new RegExp(pattern))) {
        await handleNftCommand(msg, nftType);
        return;
      }
    }

  } catch (error) {
    console.error('Error handling message:', error);
    await bot.sendMessage(chatId, 'An error occurred. Please try again.', {
      parse_mode: 'HTML',
      message_thread_id: messageThreadId
    });
  }
}

// Handle callback queries
async function handleCallbackQuery(query) {
  const chatId = query.message.chat.id;
  const messageThreadId = query.message.message_thread_id;
  const data = query.data;

  try {
    // Handle refresh commands
    if (data.startsWith('refresh_')) {
      await bot.deleteMessage(chatId, query.message.message_id);
      
      const nftType = data.replace('refresh_', '');
      await bot.answerCallbackQuery(query.id);
      
      const prices = await nftService.getNFTPrices();
      let message;
      let markup;
      
      if (nftType === 'all') {
        message = messageFormatter.formatNFTMessage(prices, true);
        markup = {
          inline_keyboard: [[
            { text: "🔄 Refresh", callback_data: "refresh_all" }
          ]]
        };
      } else {
        message = messageFormatter.formatSingleNFTMessage(nftType, prices, true);
        markup = {
          inline_keyboard: [[
            { text: "🔄 Refresh", callback_data: `refresh_${nftType}` }
          ]]
        };
      }
      
      await bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId,
        reply_markup: markup
      });
      return;
    }

    await bot.answerCallbackQuery(query.id);

    let message = "";
    let markup = {};

    if (data === "get_all") {
      const prices = await nftService.getNFTPrices();
      message = messageFormatter.formatNFTMessage(prices);
      markup = {
        inline_keyboard: [[
          { text: "🔄 Refresh", callback_data: "refresh_all" }
        ]]
      };
    } else if (data === "get_help") {
      message = messageFormatter.formatHelpMessage();
      markup = {
        inline_keyboard: [[{ text: "🔄 Main Menu", callback_data: "start" }]]
      };
    } else {
      const nftType = data.replace("get_", "");
      const prices = await nftService.getNFTPrices();
      message = messageFormatter.formatSingleNFTMessage(nftType, prices);
      markup = {
        inline_keyboard: [[
          { text: "🔄 Refresh", callback_data: `refresh_${nftType}` }
        ]]
      };
    }

    await bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      message_thread_id: messageThreadId,
      reply_markup: markup
    });

  } catch (error) {
    console.error("Callback processing error:", error);
    await bot.sendMessage(chatId, "❌ An error occurred while fetching data. Please try again.", {
      message_thread_id: messageThreadId
    });
  }
}

// Handle All NFTs command
async function handleAllNftsCommand(msg) {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id;
  const keepMessage = msg.text.includes('_k') || msg.text.includes('-k') || msg.text.includes('-keep');
  
  try {
    const prices = await nftService.getNFTPrices();
    const message = messageFormatter.formatNFTMessage(prices, keepMessage);
    
    const sentMessage = await bot.sendMessage(chatId, message, { 
      parse_mode: 'HTML',
      message_thread_id: messageThreadId,
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Refresh", callback_data: "refresh_all" }
        ]]
      }
    });
    
    if (!keepMessage) {
      setTimeout(async () => {
        try {
          await bot.deleteMessage(chatId, sentMessage.message_id);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      }, 15000);
    }
  } catch (error) {
    console.error("Error fetching prices:", error);
    await bot.sendMessage(chatId, "❌ An error occurred while fetching price information.", { 
      message_thread_id: messageThreadId 
    });
  }
}

// Handle individual NFT commands
async function handleNftCommand(msg, nftType) {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id;
  const keepMessage = msg.text.includes('_k') || msg.text.includes('-k') || msg.text.includes('-keep');
  
  try {
    const prices = await nftService.getNFTPrices();
    const message = messageFormatter.formatSingleNFTMessage(nftType, prices, keepMessage);
    
    const sentMessage = await bot.sendMessage(chatId, message, { 
      parse_mode: 'HTML',
      message_thread_id: messageThreadId,
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Refresh", callback_data: `refresh_${nftType}` }
        ]]
      }
    });
    
    if (!keepMessage) {
      setTimeout(async () => {
        try {
          await bot.deleteMessage(chatId, sentMessage.message_id);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      }, 15000);
    }
  } catch (error) {
    console.error(`${nftType} price fetching error:`, error);
    await bot.sendMessage(chatId, "❌ Error fetching price information.", { 
      message_thread_id: messageThreadId 
    });
  }
} 