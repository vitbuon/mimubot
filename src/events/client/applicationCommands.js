const { CommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const { Mimu } = require('../../structures/mimu');

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param { CommandInteraction } interaction
     * @param { Mimu } client
     */
    execute: async (interaction, client) => {
        if (interaction.isChatInputCommand()) {
            const command = client.applicationCommands.get(interaction.commandName);
            if (!command) return interaction.reply({ content: 'Đã có lỗi xảy ra!' });

            const args = [];

            for (option of interaction.options.data) {
                if ([
                    ApplicationCommandOptionType.SubcommandGroup,
                    ApplicationCommandOptionType.Subcommand
                ].includes(option.type)) {
                    args.push(option.name);

                    option.options.forEach(data => args.push(data.value));
                } else args.push(option.value);
            };

            try {
                command.execute(client, interaction, args);
            } catch (e) {
                console.log(e);
                interaction.reply({ content: 'Đã có lỗi xảy ra khi thực hiện lệnh này!', ephemeral: true });
            };
        };
    }
};