const { Telegraf } = require('telegraf');

class Logger {
    constructor(config) {
        this.config = config;
        this.logLevel = this.config.LOGGING.LEVEL || 'info';
        this.logLevels = {
            'error': 0,
            'warn': 1,
            'info': 2,
            'debug': 3
        };

        this.tgLogEnabled = this.config.LOGGING.ERROR_LOG_TO_TG;
        this.tgChatId = this.config.LOGGING.CHAT_ID;
        this.bot = null; 

        if (this.tgLogEnabled) {
            // Telegraf ক্লায়েন্ট ইনস্ট্যান্সকে ইনজেক্ট করার জন্য এই পদ্ধতি ব্যবহার করা হয়েছে
            console.log('[LOGGER] Telegram logging is enabled but client not yet set.');
        }
    }

    setBotClient(botInstance) {
        if (this.tgLogEnabled && botInstance instanceof Telegraf) {
            this.bot = botInstance;
            console.log('[LOGGER] Telegram bot client set.');
        }
    }

    _log(level, prefix, message) {
        if (this.logLevels[level] <= this.logLevels[this.logLevel]) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${prefix}] ${message}`;
            
            console[level === 'warn' ? 'warn' : level === 'error' ? 'error' : 'log'](logMessage);

            if (level === 'error' && this.tgLogEnabled && this.bot && this.tgChatId) {
                this._sendToTelegram(logMessage);
            }
        }
    }

    _sendToTelegram(message) {
        try {
            const formattedMessage = `🚨 *ERROR ALERT* 🚨\n\`\`\`\n${message}\n\`\`\``;
            this.bot.telegram.sendMessage(this.tgChatId, formattedMessage, { parse_mode: 'Markdown' });
        } catch (e) {
            console.error('[LOGGER ERROR] Failed to send error to Telegram:', e.message);
        }
    }

    error(prefix, message) {
        this._log('error', prefix, message);
    }

    warn(prefix, message) {
        this._log('warn', prefix, message);
    }

    info(prefix, message) {
        this._log('info', prefix, message);
    }

    debug(prefix, message) {
        this._log('debug', prefix, message);
    }
}

module.exports = Logger;
