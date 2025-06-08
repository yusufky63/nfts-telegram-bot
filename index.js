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

// Bot başlatma
let bot;
let server;

// NFTService instance'ını oluştur
const nftService = new NFTService();

// Bot başlatma fonksiyonu
async function initBot() {
  try {
    // Eğer önceki server varsa kapat
    if (server) {
      server.close();
    }

    if (process.env.NODE_ENV === "production") {
      // Production'da webhook kullan
      const port = process.env.PORT || 3000;

      bot = new TelegramBot(token, {
        webHook: { port },
      });

      const domain = process.env.RAILWAY_STATIC_URL;
      if (domain) {
        const webhookUrl = `https://${domain}/bot${token}`;
        try {
          // Önce mevcut webhook'u temizle
          await bot.deleteWebHook();
          // Sonra yeni webhook'u ayarla
          await bot.setWebHook(webhookUrl);
          console.log("Webhook ayarlandı:", webhookUrl);
        } catch (error) {
          console.error("Webhook ayarlanırken hata:", error);
          console.log("Polling mode aktif ediliyor...");
          bot = new TelegramBot(token, {
            polling: true,
            filepath: false,
          });
        }
      } else {
        console.log("Railway URL bulunamadı, polling mode aktif ediliyor...");
        bot = new TelegramBot(token, {
          polling: true,
          filepath: false,
        });
      }

      // Express server'ı başlat
      server = app.listen(port, () => {
        console.log(`Server ${port} portunda çalışıyor`);
      });
    } else {
      // Development'da polling kullan
      // Önce mevcut webhook'u temizle
      const tempBot = new TelegramBot(token, { polling: false });
      await tempBot.deleteWebHook();

      bot = new TelegramBot(token, {
        polling: true,
        filepath: false,
      });
      console.log("Development mode - Polling aktif");

      server = app.listen(3001, () => {
        console.log("Development server 3001 portunda çalışıyor");
      });
    }

    // Event handlers'ı ayarla
    setupEventHandlers();

    // Webhook endpoint
    app.post(`/bot${token}`, (req, res) => {
      bot.handleUpdate(req.body);
      res.sendStatus(200);
    });

    return bot;
  } catch (error) {
    console.error("Bot başlatılırken hata:", error);
    throw error;
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

// Event handler'ları ayarla
function setupEventHandlers() {
  bot.on("error", (error) => {
    console.error("Bot hatası:", error);
  });

  bot.on("polling_error", (error) => {
    console.error("Polling hatası:", error);
  });

  // Test komutu
  bot.onText(/\/test/, async (msg) => {
    const chatId = msg.chat.id;
    const messageThreadId = msg.message_thread_id; // Konu ID'sini al
    
    const messageOptions = {
      parse_mode: 'HTML',
      message_thread_id: messageThreadId
    };
    
    // Test mesajını gönder
    const sentMessage = await bot.sendMessage(chatId, "Bot Working! 🤖", messageOptions);
    
    // 15 saniye sonra mesajı sil
    setTimeout(async () => {
      try {
        await bot.deleteMessage(chatId, sentMessage.message_id);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }, 15000);
    
    console.log("Test command received:", msg);
  });

  // Start komutu
  bot.onText(/\/start/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const messageThreadId = msg.message_thread_id; // Konu ID'sini al
      const mainMenu = messageFormatter.getMainMenu();
      
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      // Ana menüyü gönder
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

  // Help komutu
  bot.onText(/\/help/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const messageThreadId = msg.message_thread_id; // Konu ID'sini al
      const helpMessage = messageFormatter.formatHelpMessage();
      
      const messageOptions = {
        parse_mode: 'HTML',
        message_thread_id: messageThreadId
      };
      
      // Yardım mesajını gönder
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

  // Debug için mesaj dinleyici
  bot.on("message", (msg) => {
      console.log("New message received:", msg);
  });
}

// Bot'u başlat
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

// Handler function for NFT commands
async function handleNftCommand(msg, nftType) {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id; // Konu (topic) ID'sini al
  const keepMessage = msg.text.includes('_k') || msg.text.includes('-k') || msg.text.includes('-keep');
  
  try {
    // Loading mesajını kaldırıyoruz
    // const messageOptions = messageThreadId ? { message_thread_id: messageThreadId } : {};
    // const loadingMessage = await bot.sendMessage(chatId, 'Loading data...', messageOptions);
    
    const prices = await nftService.getNFTPrices();
    const message = messageFormatter.formatSingleNFTMessage(nftType, prices, keepMessage);
    
    // Yanıtı gönderirken konu ID'sini ekle ve refresh butonu ekle
    const sentMessage = await bot.sendMessage(chatId, message, { 
      parse_mode: 'HTML',
      message_thread_id: messageThreadId,
      reply_markup: {
        inline_keyboard: [[
          { text: "🔄 Refresh", callback_data: `refresh_${nftType}` }
        ]]
      }
    });
    
    // Loading mesajını silmeye gerek yok
    // await bot.deleteMessage(chatId, loadingMessage.message_id);
    
    // Eğer keepMessage false ise 15 saniye sonra mesajı sil
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
  const messageThreadId = query.message.message_thread_id; // Konu ID'sini al
  const data = query.data;
  
  // Refresh komutlarını işlemek için
  if (data.startsWith('refresh_')) {
    // Yanıtı sil
    await bot.deleteMessage(chatId, query.message.message_id);
    
    const nftType = data.replace('refresh_', '');
    await bot.answerCallbackQuery(query.id); // Sessiz yanıt
    
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
    // Loading mesajını kaldırıyoruz
    // await bot.answerCallbackQuery(query.id, { text: "Loading data..." });
    await bot.answerCallbackQuery(query.id); // Sessiz yanıt

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

// Tüm NFT'ler
bot.onText(/\/(all(?:_k)?(?:\s*-k|\s*-keep)?)/, async (msg) => {
  const chatId = msg.chat.id;
  const messageThreadId = msg.message_thread_id; // Konu ID'sini al
  const keepMessage = msg.text.includes('_k') || msg.text.includes('-k') || msg.text.includes('-keep');
  
  try {
    // Loading mesajını kaldırıyoruz
    // const messageOptions = messageThreadId ? { message_thread_id: messageThreadId } : {};
    // const loadingMessage = await bot.sendMessage(chatId, 'Loading data...', messageOptions);
    
    const prices = await nftService.getNFTPrices();
    const message = messageFormatter.formatNFTMessage(prices, keepMessage);
    
    // Mesajı gönder
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
    
    // Loading mesajını silmeye gerek yok
    // await bot.deleteMessage(chatId, loadingMessage.message_id);
    
    // Eğer keepMessage false ise 15 saniye sonra mesajı sil
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

// Hata yakalama
bot.on("polling_error", (error) => {
  console.error("Bot polling error:", error);
});

// Bot başlatıldı mesajı
console.log("Bot started! 🚀");
