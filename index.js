const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
// .env loading is removed as requested
// require('dotenv').config(); 

// ----------------------------------------------------
// --- Configuration and Command Loading ---

const configPath = path.join(__dirname, 'config.json');

// config.json ফাইলটি লোড করা হচ্ছে।
const config = require(configPath);

// config.json এর CORE_SETTINGS থেকে টোকেন এবং প্রিফিক্স লোড করা হচ্ছে
const TOKEN = config.CORE_SETTINGS.BOT_TOKEN; // টোকেন লোডিং আপডেট করা হয়েছে
const prefix = config.CORE_SETTINGS.PREFIX || '/'; // প্রিফিক্স লোডিং আপডেট করা হয়েছে

const commandFiles = fs.readdirSync(path.join(__dirname, 'src', 'cmds')).filter(file => file.endsWith('.js'));
const allCommands = [];

for (const file of commandFiles) {
    try {
        const command = require(path.join(__dirname, 'src', 'cmds', file));
        if (command.config && command.run) {
            allCommands.push(command);
        }
    } catch (error) {
        console.error(`[ERROR] Failed to load command ${file}:`, error);
    }
}

const messageEventPath = path.join(__dirname, 'src', 'events', 'message.js');
const messageEventHandler = require(messageEventPath);

// ----------------------------------------------------
// --- Bot Initialization ---

if (!TOKEN) {
    console.error("FATAL: 'BOT_TOKEN' is not set under CORE_SETTINGS in config.json! Please check your configuration.");
    process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

// ----------------------------------------------------
// --- Event Listeners ---

bot.on('polling_error', (error) => {
    console.error("Polling Error:", error.code, error.message);
});

bot.on('message', (msg) => {
    // message utility অবজেক্ট
    const messageUtil = {
        reply: (text) => bot.sendMessage(msg.chat.id, text, { reply_to_message_id: msg.message_id })
    };

    try {
        messageEventHandler.execute(
            bot, 
            { 
                author: { id: msg.from.id, bot: msg.from.is_bot }, 
                body: msg.text, 
                threadID: msg.chat.id, 
                channelId: msg.chat.id,
                ...msg 
            },
            bot,
            allCommands,
            prefix,
            {} // Cooldowns object
        );
    } catch (error) {
        console.error("Error in Message Handler:", error);
    }
});
