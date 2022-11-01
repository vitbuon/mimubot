const { Message, EmbedBuilder } = require('discord.js');
const { Mimu } = require('../../structures/mimu');

module.exports = {
    name: 'avatar',
    description: 'dùng để xem avatar của mình hoặc một ai đó',
    usages: ['~avatar', '~avatar @Someone#1234', '~avatar 123456789012345678', '~avatar @Someone#1234 -nitro'],
    /**
     * 
     * @param { Mimu } client
     * @param { Message } message
     * @param { String[] } args
     */
    execute: async (client, message, args) => {
        const member = message.mentions.members.first() || message.member;
        client.getID(args[0]);

        let nitro;
        for (const a of args) {
            if (['-n', '-nitro'].includes(a.toLowerCase())) nitro = true;
        };

        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle(`Avatar của ${member.displayName}!`)
            .setImage(
                nitro && member.avatar
                    ? member.displayAvatarURL({ extension: 'png', size: 4096 })
                    : member.user.displayAvatarURL({ extension: 'png', size: 4096 })
            );

        return message.reply({ embeds: [embed] });
    }
};