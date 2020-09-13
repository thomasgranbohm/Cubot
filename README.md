# CuBot  
A Discord bot that's easy so set up and self host!

## 🏃 Quick Setup
1. Install and start [Lavalink](https://github.com/Frederikam/Lavalink)
2. Run `npm install` or `yarn install`
3. Rename `.env.default` to `.env` and add your Discord token 
4. Start the bot by running `npm start` or `yarn start`

Alternatively, get the docker image from the [Docker hub](https://hub.docker.com/r/thomasgranbohm/cubot).  
Then run `yarn docker`.

### Example `.env` file
```.properties
DISCORD_TOKEN=<your Discord bot token>
```

## ✨ Features
 - [x] YouTube, SoundCloud, audio file playback.
 - [x] Equalizers
 - [x] Playlist support 
 - [ ] Server customizable prefix

## 📌 Dependencies
 - Node.js <= v13.14
 - Discord.js <= v12.2.0
 - [Lavalink](https://github.com/Frederikam/Lavalink) <= v3.3.1.1
