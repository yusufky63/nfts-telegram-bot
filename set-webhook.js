require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;

// Get domain from environment variables
const domain = process.env.RENDER_EXTERNAL_URL || process.env.VERCEL_URL || process.env.RAILWAY_STATIC_URL;
const webhookPath = `/api/webhook`;

if (!token) {
  console.error('TELEGRAM_TOKEN environment variable is required!');
  process.exit(1);
}

async function setWebhook() {
    try {
        const bot = new TelegramBot(token);
        
        if (!domain) {
            throw new Error('No domain found in environment variables (RENDER_EXTERNAL_URL, VERCEL_URL, or RAILWAY_STATIC_URL)');
        }

        // Construct webhook URL
        const webhookUrl = `${domain}${webhookPath}`;
        
        // First, delete existing webhook
        await bot.deleteWebHook();
        console.log('Previous webhook deleted');
        
        // Set new webhook with the correct URL
        const result = await bot.setWebHook(webhookUrl);
        console.log('New webhook set:', webhookUrl);
        
        // Check webhook info
        const info = await bot.getWebHookInfo();
        console.log('Webhook info:', info);
        
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
}

setWebhook(); 