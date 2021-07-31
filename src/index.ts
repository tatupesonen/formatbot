require('dotenv').config()
import { client } from "./lib/bot";
client.login(process.env.DISCORD_TOKEN);