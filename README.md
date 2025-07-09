# NFTs Telegram Bot

A powerful Telegram bot that tracks prices and statistics for various NFT collections across multiple blockchains (Ethereum, Solana, Berachain, Celestia).

## Supported Collections

### Eclipse NFTs
- Eclipse ASC
- Eclipse AOFE
- Eclipse Validators

### Modularium NFTs
- Mammoths

### Stargaze NFTs
- Sloth
- OMies
- Whale Sharks

### Magic Eden NFTs
#### Ethereum
- Raccoon
- Vana
- Quills

#### Solana
- Mad Lads
- Pythenians

#### Berachain
- Bullas
- Steady Teddys

## Features

### Price Tracking
- Real-time floor price monitoring in native tokens and USD
- Support for multiple blockchains (ETH, SOL, BERA, TIA)
- Automatic price updates with 30-minute cache
- Price conversion to USD using current market rates

### Collection Statistics
- Number of listed items
- Total owners
- Collection volume
- Average prices
- Total sales (for supported collections)

### Bot Commands
- Individual collection commands (e.g., `/asc`, `/mammoths`, `/validators`)
- View all collections at once with `/all`
- Keep messages visible with `_k` or `-keep` suffix (e.g., `/all_k`, `/asc -keep`)
- Refresh buttons for real-time updates

### User Interface
- Interactive refresh buttons
- Auto-deletion of messages after 15 seconds (optional)
- Thread support for organized conversations
- Formatted messages with clear price information

## Technical Details
- Built with Node.js
- Uses Telegram Bot API
- Integrates with multiple NFT marketplace APIs:
  - Magic Eden (ETH, SOL, BERA)
  - Modularium.art
  - Stargaze
  - Eclipse Marketplace
- Price data from CoinGecko for token conversions

## Environment Variables
- `TELEGRAM_TOKEN`: Your Telegram bot token
- `VERCEL_URL` or `RAILWAY_STATIC_URL`: For production webhook setup

## Deployment
The bot supports both webhook (production) and polling (development) modes and can be deployed on platforms like Vercel or Railway.