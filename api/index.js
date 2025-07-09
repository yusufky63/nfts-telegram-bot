// Homepage for Vercel deployment
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
            code { 
                background: rgba(0,0,0,0.3); 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-family: monospace;
            }
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