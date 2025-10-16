
const fs = require('fs');
const config = require('../../config.json'); 

module.exports = {
  config: {
    name: "prefix",
    aliases: ["setprefix", "p"],
    version: "1.0",
    author: "LIKHON AHMED",
    countDown: 5,
    role: 1,
    description: "Change the bot's command prefix",
    category: "admin",
    guide: "{pn} <new_prefix> – Change the command prefix. Example: {pn} $"
  },

  run: function ({ api, event, args, message }) {
    if (this.config.role > 0) { 
        
    }

    if (args.length === 0) {
      const currentPrefix = config.prefix || "!";
      return message.reply(`Current prefix is: "${currentPrefix}". Please provide a new prefix to set. Use: ${this.config.guide.replace("{pn}", this.config.name)}`);
    }

    const newPrefix = args[0];

    try {
      config.prefix = newPrefix;

      fs.writeFileSync(
        './config.json',
        JSON.stringify(config, null, 2)
      );

      message.reply(`✅ Command prefix has been successfully updated to: \`${newPrefix}\``);
      
    } catch (error) {
      console.error("Error writing to config file:", error);
      message.reply("❌ An error occurred while saving the new prefix. Please check the bot logs.");
    }
  }
};
