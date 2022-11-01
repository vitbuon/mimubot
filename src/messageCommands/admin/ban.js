const { Message, EmbedBuilder } = require('discord.js');
const { Mimu } = require('../../structures/mimu');

module.exports = {
    name: 'ban',
    description: 'dùng để ban member',
    usages: ['~ban @member'],
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
                embed(`bạn không có quyền dùng lệnh này!`)
            ]
        })

        const banMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!banMember) return message.reply({
            embeds: [
                embed(`bạn không chỉ rõ ai thì làm sao mà mình ban được!`)
            ]
        });

        if (banMember.permissions.has("Administrator")) return message.reply({
            embeds: [
                embed(`mình không thể kick được ${banMember.displayName} vì người này đang có quyền administrator!`)
            ]
        })

        try {
            await message.guild.members.ban(banMember.id);
        } catch (error) {
            console.log(error);
            message.reply({
                embeds: [
                    embed(`đã có lỗi khi ban người này!`)       
                ]
            });
            return;
        };

        await message.reply({
            embeds: [
                embed(`đã ban ${banMember.displayName} ra khỏi server!`)
            ]
        });

    },
};