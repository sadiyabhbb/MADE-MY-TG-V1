const fs = require('fs');
const path = require('path');

class Loader {
    constructor(bot, config) {
        this.bot = bot;
        this.config = config;
        this.cmdPath = path.join(__dirname, '..', 'src', 'cmds');
        this.eventPath = path.join(__dirname, '..', 'src', 'events');
    }

    loadCommands() {
        if (!fs.existsSync(this.cmdPath)) {
            console.warn(`Command directory not found: ${this.cmdPath}`);
            return;
        }

        const commandFiles = fs.readdirSync(this.cmdPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const command = require(path.join(this.cmdPath, file));
                
                if (command.setConfig) {
                    command.setConfig(this.config); 
                }

                if (command.name && command.execute) {
                    this.bot.command(command.name, command.execute);
                    console.log(`[LOADER] Loaded command: /${command.name}`);
                } else {
                    console.warn(`[LOADER] Command file missing name or execute: ${file}`);
                }
            } catch (error) {
                console.error(`[LOADER] Error loading command ${file}:`, error.message);
            }
        }
    }

    loadEvents() {
        if (!fs.existsSync(this.eventPath)) {
            console.warn(`Event directory not found: ${this.eventPath}`);
            return;
        }

        const eventFiles = fs.readdirSync(this.eventPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            try {
                const eventModule = require(path.join(this.eventPath, file));
                
                if (eventModule.setConfig) {
                    eventModule.setConfig(this.config);
                }

                if (eventModule.name && eventModule.execute) {
                    this.bot.on(eventModule.name, eventModule.execute);
                    console.log(`[LOADER] Loaded event listener: ${eventModule.name}`);
                } else {
                    console.warn(`[LOADER] Event file missing name or execute: ${file}`);
                }
            } catch (error) {
                console.error(`[LOADER] Error loading event ${file}:`, error.message);
            }
        }
    }
}

module.exports = Loader;
