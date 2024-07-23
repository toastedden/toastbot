# ToastBot

ToastBot is a lightweight Discord bot designed exclusively for the [Toasted's Den Discord server](https://discord.gg/vWE9vt5j7B).

This repository contains the streamlined source code for ToastBot, now operating in read-only mode. Commands, experimental features, and unused packages have been removed for simplicity.

New members will receive a unique welcome message in the `#welcome` channel. Joins and leaves are logged in the `#bot-logs` channel and a local log file in `./logs`.

## Development
ToastBot was originally developed by Toasted Den in 2021, with help from sydneyn3308.

Thank you to Belt_Buckle, eitanshaul, walterblack5, Kind Man, jarr012, and many others for helping with beta testing ToastBot.

## Hosting
ToastBot is currently being hosted by our friends at [Nodium Hosting](https://nodiumhosting.com).

## Self-hosting
### Prerequisites
- Node.js (v16.11.0 or higher)
- Discord.js (v13.0.0)

### Getting Started
1. **Clone the repository** (And edit channel IDs, variables, and assets appropriately)
    ```bash
    git clone https://github.com/toastedden/ToastBot.git
    cd ToastBot
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Edit the `.env.example` file** with your bots token from the [Discord Developer Portal](https://discord.com/developers/applications)
    ```
    TOKEN=your_discord_bot_token
    ```

4. **Run the bot**
    ```bash
    node src/toastbot.js
    ```

## Contributing
Pull requests are welcome, although ToastBot is quite bare-bones and may not require many additional features.