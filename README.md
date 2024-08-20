# ToastBot

ToastBot is a lightweight Discord bot designed exclusively for the [Toasted's Den Discord server](https://discord.gg/vWE9vt5j7B).

This repository contains the streamlined source code for ToastBot, now operating in read-only mode. Commands, experimental features, and unused packages have been removed for simplicity.

New members will receive a unique welcome message in the specified welcome channel. Join and leave events are logged in the designated logs channel and a local log file located in `./logs`. Both the welcome channel and log settings are configured in the `.env` file.

## Development

ToastBot was originally developed by *Toasted Den* in 2021, with significant contributions from *sydneyn3308*. Special thanks to *Belt_Buckle*, *eitanshaul*, *walterblack5*, *kindman_*, *jarr012*, and others for their help with beta testing.

## Hosting

ToastBot is currently being hosted by our friends at [Nodium Hosting](https://nodiumhosting.com).

## Self-hosting

### Prerequisites

- "Presence Update events" and "GUILD_MEMBERS events" **must** be enabled for your bot through the [Discord Developer Portal](https://discord.com/developers/applications).

### Getting Started

#### Running ToastBot with `npm`

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/package-manager/current) (v16.11.0 or higher)
- Discord.js (v13.17.1)

1. **Clone the repository:**
    ```bash
    git clone https://github.com/toastedden/ToastBot.git
    cd ToastBot
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Edit the `.env.example` file** with your guild's channel info, logging details, and bot token from the [Discord Developer Portal](https://discord.com/developers/applications). For detailed descriptions of each environment variable, refer to the comments within the `.env.example` file.
    ```
    TOKEN=your_discord_bot_token
    ```

4. **Run the bot:**
    ```bash
    node src/toastbot.js
    ```

#### Running ToastBot with `Docker Compose`

Ensure `Docker Engine` and `Docker Compose` are [installed on your system](https://docs.docker.com/compose/install/).

1. **Clone the repository:**
    ```bash
    git clone https://github.com/toastedden/ToastBot.git
    cd ToastBot
    ```

2. **Edit the `.env.example` file** with your guild's channel info, logging details, and bot token from the [Discord Developer Portal](https://discord.com/developers/applications). For detailed descriptions of each environment variable, refer to the comments within the `.env.example` file.
    ```
    TOKEN=your_discord_bot_token
    ```

3. **Run the bot with Docker Compose:**
    ```bash
    docker compose up --build -d
    ```

This will build the Docker image, install dependencies, and run the bot inside a Docker container named `ToastBot`.


## Contributing

Pull requests are welcome, though ToastBot is currently quite minimal and may not need many additional features.