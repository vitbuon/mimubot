const { Message, EmbedBuilder } = require('discord.js');
const { Mimu } = require('../../structures/mimu');

module.exports = {
    name: 'kick',
    description: 'dùng để kick member',
    usages: ['~kick @member'],
    /**
     * 
     * @param { Mimu } client
     * @param { Message } message
     * @param { String[] } args
     */
    execute: async (client, message, args) => {
    /**
     * 
     * @param { String } text 
     *  
     */
        function embed(text) {
            return new EmbedBuilder()
                .setAuthor({ name: `${message.member.displayName}`, iconURL: message.member.displayAvatarURL() })
                .setColor('Yellow')
                .setTitle(`${message.member.displayName}!`)
                .setDescription(text)
        }

        if (!message.member.permissions.has("Administrator")) return message.reply({
            embeds: [
                embed(`bạn không có quyền này!`)
            ]
        });

        const kickMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!kickMember) return message.reply({
            embeds: [
                embed(`bạn không chỉ rõ ai thì làm sao mà mình kick được!`)
            ]
        });

        if (kickMember.permissions.has("Administrator")) return message.reply({
            embeds: [
                embed(`mình không thể kick được ${kickMember.displayName} vì người này đang có quyền administrator!`)
            ]
        });

        try {
            await message.guild.members.kick(kickMember.id);
        } catch (error) {
            console.log(error);
            message.reply({
                embeds: [
                    embed(`đã có lỗi khi kick người này!`)
                ]
            });
            return
        };

        await message.reply({
            embeds: [
                embed(`đã kick ${kickMember.displayName} ra khỏi server!`)
            ]
        });

    },
};