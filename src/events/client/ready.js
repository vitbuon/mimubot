const { Mimu } = require('../../structures/mimu');
const { connect } = require('mongoose');
const { REST } = require("@discordjs/rest");
const chalk = require("chalk");
const { Routes } = require("discord-api-types/v9");
const config = require("../../../config");

module.exports = {
    name: 'ready',

    /**
     * 
     * @param { Mimu } client
     */
    execute: async (client) => {
        console.log(`${client.user.tag} is ready!`);

        const applicationCommands = [];
        client.applicationCommands.forEach(element => {
            applicationCommands.push(element)
        });
        
        console.log(applicationCommands);

        // const guild = await client.guilds.fetch(config.guildID);
        // guild.commands.set(applicationCommands);
        
        // const slashCommands = applicationCommands;

        const rest = new REST({ version: "9" }).setToken(config.token);
        try {
            console.log(chalk.cyan(`Started refreshing ${applicationCommands.length} application (/) commands.`))

            const data = await rest.put(
                Routes.applicationGuildCommands(config.clientID, config.guildID),
                {
                    body: applicationCommands,
                }
            );

            console.log(chalk.green(`Successfully reloaded ${data.length} application (/) commands.`))
        } catch (error) {
            console.log(chalk.red(`applicationCommandsErr: ${error}`));
        }
    }
};