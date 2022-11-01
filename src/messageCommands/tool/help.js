const { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const { readdirSync, lstatSync } = require('fs');
const config = require('../../../config');
const Mimu = require('../../structures/mimu');

module.exports = {
    name: 'help',
    description: 'dùng để xem lệnh của bot',
    usages: ['~help', '~help <tên lệnh>'],

    /**
     * 
     * @param { Mimu } client
     * @param { Message } message
     * @param { String[] } args
     */
    execute: async (client, message, args) => {
        const IDs = [];
        config.botDevIDs.forEach(id => IDs.push(`<@${id}>`));
        const command = args[0]
            ? client.messageCommands.get(args[0].toLowerCase()) || client.messageCommands.find(x => x.aliases?.includes(args[0].toLowerCase()))
            : null;
        const menuoptions = [];
        function menu(disable) {
            return new ActionRowBuilder().setComponents(
                new SelectMenuBuilder()
                    .setCustomId("help-menu")
                    .setOptions(menuoptions)
                    .setDisabled(disable)
            );
        }
        if (command) {
            const fields = [];
            if (command.description) fields.push({ name: 'Mô tả lệnh', value: command.description });
            if (command.usages) fields.push({ name: 'Các cách dùng', value: command.usages.join('\n') });
            if (command.cooldown) fields.push({ name: 'Thời gian chờ', value: command.cooldown });

            const embed = new EmbedBuilder()
                .setTitle(`Trợ giúp về lệnh \`${command.name}\``)
                .setFields(fields)
                .setColor('Yellow')
                .setTimestamp();

            return message.reply({ embeds: [embed] });
        } else {
            
            readdirSync('src/messageCommands').filter((dir) => lstatSync(`src/messageCommands/${dir}`).isDirectory()).forEach(dir => {
                if (dir === 'devonly') return;
                const fields = []
                
                readdirSync(`src/messageCommands/${dir}`).filter((file) => lstatSync(`src/messageCommands/${dir}/${file}`).isFile() &&
                file.endsWith(".js")).forEach((file) => {
                        const command = require(`../../messageCommands/${dir}/${file}`);
                        fields.push(command.name)
                    });
                    const embed = new EmbedBuilder()
                        .setTitle(`Danh sách lệnh ${dir.charAt(0).toUpperCase()}${dir.slice(1)} của Senko-san`)
                        .setColor('Yellow')
                        .setFooter({ text: 'Dùng ~help [tên lệnh] để xem thông tin cụ thể hơn!' })
                        .setDescription(fields.join(', '));
                    menuoptions.push({
                        label: `${dir.charAt(0).toUpperCase()}${dir.slice(1)}`,
                        description: `Xem lệnh về ${dir.charAt(0).toUpperCase()}${dir.slice(1)}`,
                        value: `${dir.charAt(0).toUpperCase()}${dir.slice(1)}`,
                        embed,
                    });
            });

            const msg = await message.reply({ 
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Senko-san help message commands`)
                    .setDescription(`Prefix của mình: ${config.prefix}\nDev: ${IDs.join(', ')}\n Server: ${(await client.guilds.fetch(config.guildID)).name}`)
                    .setColor('Yellow')
                ],
                components: [menu(false)] 
            });
            const collector = msg.createMessageComponentCollector({
                filter: interaction => interaction.user.id === message.author.id,
                idle: 60_000,
            });

            collector.on("collect", async (interaction) => {
                if (interaction.isSelectMenu()) {
                    const option = menuoptions.find(
                        (x) => x.value === interaction.values[0]
                    );
                    return interaction.update({ embeds: [option.embed] });
                }
            });

            collector.on("end", (collected, reason) => {
                if (reason === "delete") msg.delete();
                else msg.edit({ components: [menu(true)] });
            });
        };
    }
};