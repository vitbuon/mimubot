const { Message } = require('discord.js');
const { Nimu } = require('../../structures/mimu');
const config = require("../../../config")

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param { Message } message
     * @param { Nimu } client
     */
    execute: async (message, client) => {
        if (
            message.author.bot
            || !message.guild
            || (
                !message.content.toLowerCase().startsWith(config.prefix)
                && !message.content.startsWith(`<@${client.user.id}>`)
            )
        ) return;

        const [cmd, ...args] = message.content.slice(
            message.content.toLowerCase().startsWith(config.prefix)
                ? config.prefix.length
                : `<@${client.user.id}>`.length
        ).trim().split(/ +/g);
        const command = client.messageCommands.get(cmd.toLowerCase()) || client.messageCommands.find(x => x.aliases?.includes(cmd.toLowerCase()));

        if (!command) return;

        try {
            command.execute(client, message, args);
        } catch (e) {
            console.log(e);
            message.reply({ content: 'Đã có lỗi xảy ra khi thực hiện lệnh này!' });
        };
    }
};