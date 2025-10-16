
module.exports = {
    name: 'message',
    execute: function (client, event, api, allCommands, prefix, cooldowns) {

        if (event.author && event.author.bot) return;
        if (!event.body || !event.body.startsWith(prefix)) return;

        const args = event.body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = allCommands.find(
            cmd => 
                cmd.config.name === commandName || 
                (cmd.config.aliases && cmd.config.aliases.includes(commandName))
        );

        if (!command) return;

        const config = command.config;

        if (config.role > 0) {
            // Role/Permission Check logic goes here
        }

        try {
            command.run({ 
                api, 
                event, 
                args, 
                message: { 
                    reply: (msg) => api.sendMessage(msg, event.threadID || event.channelId) 
                },
                allCommands,
                prefix
            });
        } catch (error) {
            console.error('Command Execution Error:', error);
            const errorMsg = `An error occurred while running the command "${config.name}". Please report this to the bot developer.`;
            api.sendMessage(errorMsg, event.threadID || event.channelId);
        }
    }
};
