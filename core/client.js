
const { Telegraf } = require('telegraf');

function createClient(config) {
    if (!config || !config.CORE_SETTINGS || !config.CORE_SETTINGS.BOT_TOKEN) {
        throw new Error("Missing configuration or BOT_TOKEN in config.");
    }

    const bot = new Telegraf(config.CORE_SETTINGS.BOT_TOKEN, {
        username: config.CORE_SETTINGS.BOT_USERNAME, 
        handlerTimeout: 90000 
    });

    bot.config = config; 

    return bot;
}

module.exports = { createClient };
