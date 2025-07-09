require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const config = require("./config");
const NFTService = require("./nftService");
const messageFormatter = require("./messageFormatter");

// Bot token'ı direkt env'den al
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_TOKEN not found!");
}

// Global error handler
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Express app kurulumu
const app = express();
app.use(express.json());

// Bot initialization
let bot;
let server;

// Create NFTService instance
const nftService = new NFTService();

// Bot initialization function
async function initBot() {
  try {
    // Close previous server if exists
    if (server) {
      server.close();
    }

    if (process.env.NODE_ENV === "production") {
      // Use webhook in production
      const port = process.env.PORT || 3000;

      bot = new TelegramBot(token, {
        webHook: { port },
      });

      // Domain settings for Vercel
      const domain = process.env.VERCEL_URL || process.env.RAILWAY_STATIC_URL;
      if (domain) {
        const webhookUrl = `https://${domain}/bot${token}`;
        try {
          // First clear existing webhook
          await bot.deleteWebHook();
          // Then set new webhook
          await bot.setWebHook(webhookUrl);
          console.log("Webhook set:", webhookUrl);
        } catch (error) {
          console.error("Error setting webhook:", error);
          console.log("Activating polling mode...");
          bot = new TelegramBot(token, {
            polling: true,
            filepath: false,
          });
        }
      } else {
        console.log("Vercel/Railway URL not found, activating polling mode...");
        bot = new TelegramBot(token, {
          polling: true,
          filepath: false,
        });
      }

      // Start Express server
      server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } else {
      // Use polling in development
      bot = new TelegramBot(token, {
        polling: true,
        filepath: false,
      });
      console.log("Development mode - Polling active");

      server = app.listen(3001, () => {
        console.log("Development server running on port 3001");
      });
    }

    // Set up event handlers
    setupEventHandlers();
  } catch (error) {
    console.error("Bot initialization error:", error);
  }
}

// Uygulama kapatılırken temizlik yap
process.on("SIGTERM", async () => {
  if (server) {
    server.close();
  }
  if (bot) {
    await bot.deleteWebHook();
    bot.stopPolling();
  }
  process.exit(0);
});

// Event handlers setup
function setupEventHandlers() {
  bot.on("error", (error) => {
    console.error("Bot error:", error);
  });

  bot.on("polling_error", (error) => {
    console.error("Polling error:", error);
  });

  // Test command
  bot.onText(/\/test/, async (msg) => {
    const chatId = msg.chat.id;
    const messageThreadId = msg.message_thread_id; // Get topic ID
    
    const messageOptions = {
      parse_mode: 'HTML',
      message_thread_id: messageThreadId
    };
    
    // Send test message
    const sentMessage = await bot.sendMessage(chatId, "Bot Working! 🤖", messageOptions);
    
    // Delete message after 15 seconds
    setTimeout(async () => {
      try {
        await bot.deleteMessage(chatId, sentMessage.message_id);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }, 15000);
    
    console.log("Test command received:", msg);
  });

  // Start command
  bot.onText(/\/start/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const messageThreadId = msg.message_thread_id; // Get topic ID
      const mainMenu = messageFormatter.getMainMenu();
      
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      // Send main menu
      await bot.sendMessage(chatId, mainMenu, messageOptions);
      
    } catch (error) {
      console.error('Start command error:', error);
      await bot.sendMessage(
        msg.chat.id, 
        'An error occurred. Please try again.', 
        { 
          parse_mode: 'HTML',
          message_thread_id: msg.message_thread_id 
        }
      );
    }
  });

  // Help command
  bot.onText(/\/help/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const messageThreadId = msg.message_thread_id; // Get topic ID
      const helpMessage = messageFormatter.formatHelpMessage();
      
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      // Send help message
      await bot.sendMessage(chatId, helpMessage, messageOptions);
      
    } catch (error) {
      console.error('Help command error:', error);
      await bot.sendMessage(
        msg.chat.id, 
        'An error occurred. Please try again.', 
        { 
          parse_mode: 'HTML',
          message_thread_id: msg.message_thread_id 
        }
      );
    }
  });

  // Debug message listener
  bot.on("message", (msg) => {
      console.log("New message received:", msg);
  });
}

// Start the bot
initBot()
  .then(() => {
    console.log("🤖 Bot service started!");
  })
  .catch((error) => {
    console.error("Bot could not be started:", error);
    process.exit(1);
  });

// Token doğrulama middleware'i
app.use(`/webhook/${token}`, (req, res, next) => {
  console.log("Webhook request received");
  if (req.method === "POST") {
    next();
  } else {
    res.sendStatus(403);
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Bot is active!");
});

// Health check endpoint for Vercel
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>NFT Telegram Bot</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 40px;
                background: rgba(255,255,255,0.1);
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            h1 { font-size: 2.5em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin: 10px 0; }
            .status { 
                padding: 15px; 
                background: rgba(34, 197, 94, 0.2); 
                border-radius: 10px; 
                margin: 20px 0;
                border: 1px solid rgba(34, 197, 94, 0.5);
            }
            .bot-info {
                margin-top: 30px;
                padding: 20px;
                background: rgba(255,255,255,0.05);
                border-radius: 10px;
            }
            a { color: #60a5fa; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 NFT Telegram Bot</h1>
            
            <div class="status">
                <h2>✅ Bot Status: Active</h2>
                <p>Webhook is configured and ready to receive updates</p>
            </div>
            
            <div class="bot-info">
                <h3>📊 Supported NFT Collections:</h3>
                <p>• Eclipse (ASC, AOFE, Validators)</p>
                <p>• Stargaze (Sloth, OMies, Whale Sharks)</p>
                <p>• Magic Eden (Raccoon, Vana, Quills, Mad Lads, Pythenians)</p>
                <p>• Berachain (Bullas, Steady Teddys)</p>
                <p>• Modularium (Mammoths)</p>
            </div>
            
            <div class="bot-info">
                <h3>🚀 Commands:</h3>
                <p><code>/start</code> - Main menu</p>
                <p><code>/test</code> - Test bot functionality</p>
                <p><code>/all</code> - Get all NFT prices</p>
                <p><code>/help</code> - Show help menu</p>
            </div>
            
            <p style="margin-top: 30px; opacity: 0.8;">
                Powered by Vercel • Last updated: ${new Date().toLocaleString()}
            </p>
        </div>
    </body>
    </html>
  `);
};

// Handler function for NFT commands
async function handleNftCommand(msg, nftType) {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id; // Get topic (topic) ID
  const keepMessage = msg.text.includes('_k') || msg.text.includes('-k') || msg.text.includes('-keep');
  
  try {
    // Remove loading message
    // const messageOptions = messageThreadId ? { message_thread_id: messageThreadId } : {};
    // const loadingMessage = await bot.sendMessage(chatId, 'Loading data...', messageOptions);
    
    const prices = await nftService.getNFTPrices();
    const message = messageFormatter.formatSingleNFTMessage(nftType, prices, keepMessage);
    
    // Send response with topic ID and refresh button
    const sentMessage = await bot.sendMessage(chatId, message, { 
      parse_mode: 'HTML',
      message_thread_id: messageThreadId,
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Refresh", callback_data: `refresh_${nftType}` }
        ]]
      }
    });
    
    // No need to delete loading message
    // await bot.deleteMessage(chatId, loadingMessage.message_id);
    
    // If keepMessage is false, delete message after 15 seconds
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

// Callback query handler
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const messageThreadId = query.message.message_thread_id; // Get topic ID
  const data = query.data;
  
  // Process refresh commands
  if (data.startsWith('refresh_')) {
    // Delete response
    await bot.deleteMessage(chatId, query.message.message_id);
    
    const nftType = data.replace('refresh_', '');
    await bot.answerCallbackQuery(query.id); // Silent response
    
    try {
      const prices = await nftService.getNFTPrices();
      let message;
      let markup;
      
      if (nftType === 'all') {
        message = messageFormatter.formatNFTMessage(prices, true); // keep true to prevent auto deletion
        markup = {
          inline_keyboard: [[
            { text: "🔄 Refresh", callback_data: "refresh_all" }
          ]]
        };
      } else {
        message = messageFormatter.formatSingleNFTMessage(nftType, prices, true); // keep true to prevent auto deletion
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
    } catch (error) {
      console.error("Refresh error:", error);
      await bot.sendMessage(
        chatId,
        "❌ An error occurred while refreshing data. Please try again.",
        { message_thread_id: messageThreadId }
      );
    }
    return;
  }

  console.log("Callback data:", data); // For debugging

  try {
    // Remove loading message
    // await bot.answerCallbackQuery(query.id, { text: "Loading data..." });
    await bot.answerCallbackQuery(query.id); // Silent response

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

    // Send new message with message_thread_id
    await bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      message_thread_id: messageThreadId,
      reply_markup: markup
    });
  } catch (error) {
    console.error("Callback processing error:", error);
    await bot.sendMessage(
      chatId,
      "❌ An error occurred while fetching data. Please try again.",
      { message_thread_id: messageThreadId }
    );
  }
});

// All NFTs
bot.onText(/\/(all(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id; // Get topic ID
  const keepMessage = msg.text.includes('_k') || msg.text.includes('-k') || msg.text.includes('-keep');
  
  try {
    // Remove loading message
    // const messageOptions = messageThreadId ? { message_thread_id: messageThreadId } : {};
    // const loadingMessage = await bot.sendMessage(chatId, 'Loading data...', messageOptions);
    
    const prices = await nftService.getNFTPrices();
    const message = messageFormatter.formatNFTMessage(prices, keepMessage);
    
    // Send message
    const sentMessage = await bot.sendMessage(
      chatId, 
      message, 
      { 
        parse_mode: 'HTML',
        message_thread_id: messageThreadId,
        reply_markup: {
          inline_keyboard: [[
            { text: "🔄 Refresh", callback_data: "refresh_all" }
          ]]
        }
      }
    );
    
    // No need to delete loading message
    // await bot.deleteMessage(chatId, loadingMessage.message_id);
    
    // If keepMessage is false, delete message after 15 seconds
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
    await bot.sendMessage(
      chatId, 
      "❌ An error occurred while fetching price information.", 
      { message_thread_id: messageThreadId }
    );
  }
});

// Eclipse ASC
bot.onText(/\/(asc(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "asc");
});

// Eclipse AOFE
bot.onText(/\/(aofe(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "aofe");
});

// Eclipse Validators
bot.onText(/\/(validators(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "validators");
});

// Mammoths
bot.onText(/\/(mammoths(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "mammoths");
});

// Sloth
bot.onText(/\/(sloth(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "sloth");
});

// OMies
bot.onText(/\/(omies(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "omies");
});

// Raccoon
bot.onText(/\/(raccoon(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "raccoon");
});

// Vana
bot.onText(/\/(vana(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "vana");
});

// Quills Adventure
bot.onText(/\/(quills(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "quills");
});

// Mad Lads
bot.onText(/\/(madlads(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "madlads");
});

// Pythenians
bot.onText(/\/(pythenians(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "pythenians");
});

// Whale Sharks
bot.onText(/\/(whale_sharks(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "whale_sharks");
});

// Bullas
bot.onText(/\/(bullas(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "bullas");
});

// Steady Teddys
bot.onText(/\/(steady_teddys(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  await handleNftCommand(msg, "steady_teddys");
});

// Error handling
bot.on("polling_error", (error) => {
  console.error("Bot polling error:", error);
});

// Bot started message
console.log("Bot started! 🚀");
