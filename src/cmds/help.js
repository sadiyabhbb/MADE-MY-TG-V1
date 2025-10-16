const fs = require('fs');

module.exports = {
    config: {
        name: "help",
        aliases: ["h", "cmd", "commands"],
        version: "1.0",
        author: "LIKHON AHMED",
        countDown: 3,
        role: 0,
        description: "Shows all commands or details for a specific command",
        category: "utility",
        guide: "{pn} – To see all commands. | {pn} <command_name> – To see command details."
    },

    run: function ({ api, event, args, message, allCommands, prefix }) {
        const commandName = args[0] ? args[0].toLowerCase() : null;

        if (!allCommands || allCommands.length === 0) {
            return message.reply("Command list is not loaded yet.");
        }

        // --- 1. নির্দিষ্ট কমান্ডের তথ্য (Specific Command Info) ---
        if (commandName) {
            const command = allCommands.find(
                cmd => 
                    cmd.config.name === commandName || 
                    (cmd.config.aliases && cmd.config.aliases.includes(commandName))
            );

            if (!command) {
                return message.reply(`Command "${commandName}" not found.`);
            }
            
            const config = command.config;
            let response = 
`[ COMMAND DETAILS ]
Name: ${config.name}
Aliases: ${config.aliases ? config.aliases.join(", ") : "None"}
Category: ${config.category || "General"}
Description: ${config.description || "No description provided."}
Author: ${config.author || "Unknown"}
Version: ${config.version || "N/A"}
Cooldown: ${config.countDown ? config.countDown + "s" : "None"}
Required Role: ${config.role === 0 ? "All Users" : (config.role === 1 ? "Admin/Mod" : "Bot Owner")}
Usage Guide: ${config.guide ? config.guide.replace(/{pn}/g, prefix + config.name) : "No usage guide."}`;
            
            return message.reply(response);
        }

        // --- 2. সকল কমান্ডের তালিকা (All Command List) ---
        
        // ক্যাটাগরি অনুযায়ী কমান্ডগুলিকে গ্রুপ করা হচ্ছে
        const categorizedCommands = {};
        allCommands.forEach(cmd => {
            const category = cmd.config.category || "General";
            if (!categorizedCommands[category]) {
                categorizedCommands[category] = [];
            }
            categorizedCommands[category].push(cmd.config.name);
        });

        let response = "[ AVAILABLE COMMANDS ]\n\n";

        // প্রতিটি ক্যাটাগরির জন্য মেসেজ তৈরি করা
        for (const category in categorizedCommands) {
            response += `[ ${category.toUpperCase()} ]\n`;
            response += categorizedCommands[category].join(", ") + "\n\n";
        }
        
        response += `Use "${prefix}help <command_name>" for details on any specific command.`;

        message.reply(response);
    }
};
