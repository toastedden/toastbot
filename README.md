# ToastBot

**ToastBot** is a lightweight Discord bot designed exclusively for the [Toasted's Den Discord server](https://discord.gg/vWE9vt5j7B).

This repository contains the streamlined source code for **ToastBot**, now operating in read-only mode. Commands, experimental features, and unused packages have been removed for simplicity.

New members will receive a unique welcome message in the specified welcome channel. Join, Leave, and Message Delete events are logged in the designated logs channel and a local log file located in `./logs`. Both the welcome channel and log settings are configured in the `.env` file.

Docker Compose users can also spin up a web server for viewing, downlaoding, and sharing log files. See Web Server for details

## Development

**ToastBot** was originally developed by [*Toasted Den*](https://github.com/toastedden) in 2021, with significant contributions from [*sydneyn3308*](https://github.com/Sydney3308). Special thanks to *Belt_Buckle*, [*eitanshaul*](https://github.com/TheSlicingSword), *walterblack5*, *kindman_*, *jarr012*, and others for their help with beta testing.

## Self-hosting

### Prerequisites

- "Presence Update Events", "GUILD_MEMBERS", and "Message Contents" **must** be enabled for your bot through the [Discord Developer Portal](https://discord.com/developers/applications).

### Getting Started

#### Running ToastBot with **Node.js**

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/package-manager/current) (v16.11.0 or higher, we use v22 LTS)

1. **Clone the repository:**
    ```bash
    git clone https://github.com/toastedden/toastbot.git
    cd toastbot
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Edit the** `.env.example` **file** with your guild's channel info, logging details, and bot token from the [Discord Developer Portal](https://discord.com/developers/applications). For detailed descriptions of each environment variable, refer to the comments within the `.env.example` file.
    ```
    TOKEN=your_discord_bot_token
    ```

4. **Run the bot:**
    ```bash
    node src/toastbot.js
    ```

#### Running ToastBot with **Docker Compose**

Ensure **Docker Engine** and **Docker Compose** are [installed on your system](https://docs.docker.com/compose/install/).

1. **Clone the repository:**
    ```bash
    git clone https://github.com/toastedden/toastbot.git
    cd toastbot
    ```

2. **Edit the** `.env.example` **file** with your guild's channel info, logging details, and bot token from the [Discord Developer Portal](https://discord.com/developers/applications). For detailed descriptions of each environment variable, refer to the comments within the `.env.example` file.
    ```
    TOKEN=your_discord_bot_token
    ```

3. **Run the bot with Docker Compose in detached mode:**
    ```bash
    docker compose up --build -d
    ```

This will build the `toastbot` and `toastbot-web-server` Docker image(s), install dependencies, and run the bot alongside the web server.

You can disable the web server by simply commenting out the service in the `docker-compose.yaml` file.

By default, the web server will be availible at [localhost:3001](http://localhost:3001). Your login information can be found in the `.env` file.

#### Securing the web server

Before exposing the web server to the internet, we strongly recommend running `passwd_gen.py` to generate a strong password for the web server.

You can increase strength of the generated password by adding your own passphrases to `passphrases.txt`.

By default, we use `100000` password iterations. You can run `passwd_gen_benchmark.py` to benchmark your hosts efficiency. Aim for whichever value is closest to ~1s of compute time.

## ToastBot Configuration

Most configuration is done in the `.env.example` file. See it's comments for more information.

You can also edit the following files in `./data`.
- `passphrases.txt` - Allows you to edit the input passphrases for `passwd_gen.py` to use when creating the web server password.
- `set-rich-presence.json` - Can be used to edit **ToastBot's** rich presence on-the-fly. It will refresh every 60 seconds.
- `welcome-messages.json` - Is used for laying out the welcome messages for **ToastBot** to use.


## Logging and Archives

#### Logs

By default, **ToastBot** logs are created in `./logs`. This can be edited in the `env` file but is highly discouraged.

The web server also creates it's own log files in `./web_server/logs`.

#### Archiving

We have a convenient python script that will add all your log files for the previous month(s) into a `.tar.gz` file.

Run it using
```bash
python3 logs_to_tar.py
```

The script will then create `./logs/archives` and add all previous months `.log` files into `{MONTH}-{YEAR} Log Files.tar.gz` for archiving.

If `/mnt/toastbot-backups` directory exists, a copy will also be made there.

## TODO:

- [x] Streamline and optimize ToastBot source code

- [x] Use asyncronus funtcions

- [x] Create logging system

- [x] Dockerize ToastBot for easy deplyment

- [x] Make ToastBot universal with editable .env

- [ ] Re-organize directory layout

- [x] Acccess `./logs` outside of discord on a static HTTP site with basic auth

- [x] Dockerize HTTP site alongside ToastBot

- [x] Allow rich presence to be updated dynamically with JSON

- [x] Allow welcome messages to be updated dynamically with JSON

- [x] Add log files to a tarball to clean directory and save on disk space

- [ ] Add log files to a zip file to clean directory and save on disk space

- [ ] Combine zip and tar archiver script into one

- [ ] Automate archiver script in the container

- [ ] Edit JSON data over HTTP server

- [ ] Refresh HTTP server password weekly/ monthly and send it to #bot-logs

- [ ] Log aditional events in the server

- [ ] Create giveaway system

- [ ] Add/ remove role(s) with message reactions

- [ ] Move event listeners to dedicated JS files to clean up entrypoint file

## Contributing

Pull requests are welcome, though **ToastBot** is currently quite minimal and may not need many additional features.
