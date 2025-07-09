require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL || 'https://nfts-telegram-bot.vercel.app/api/webhook';

if (!token) {
  console.error('TELEGRAM_TOKEN environment variable is required!');
  process.exit(1);
}

async function setWebhook() {
    try {
        const bot = new TelegramBot(token);
        
        // First, delete existing webhook
        await bot.deleteWebHook();
        console.log('Previous webhook deleted');
        
        // Set new webhook
        const result = await bot.setWebHook(webhookUrl);
        console.log('New webhook set:', result);
        
        // Check webhook info
        const info = await bot.getWebHookInfo();
        console.log('Webhook info:', info);
        
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

setWebhook(); 