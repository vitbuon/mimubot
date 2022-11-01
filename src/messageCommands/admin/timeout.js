const { Message, EmbedBuilder } = require('discord.js');
const { Mimu } = require('../../structures/mimu');
const ms = require('ms');
const config = require('../../../config');

module.exports = {
    name: 'timeout',
    description: 'dùng để timeout member',
    usages: ['~timeout @member 1d'],
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
                embed(`bạn không có quyền sử dụng lệnh này!`)
            ]
        })
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!args[1]) return message.reply({
            embeds: [
                embed(`bạn không chỉ rỏ thời gian thì làm sao mà mình timeout được!`)
            ]
        })
        const time = ms(args[1])
        if (!Member) return message.reply({
            embeds: [
                embed(`bạn không chỉ rỏ ai thì làm sao mình timeout được!`)
                ]
        });

        if (Member.permissions.has("Administrator")) return message.reply({
            embeds: [
                embed(`mình không thể timeout được ${Member.displayName} vì người này đang có quyền administrator!`)
            ]
        })

        try {
            Member.timeout(time);
        } catch (error) {
            console.log(error);
            message.reply({
                embeds: [
                    embed(`đã có lỗi khi timeout người này!`)
                    ]
            });
            return;
        };

        await message.reply({
            embeds: [
                embed(`Đã timeout thành công ${Member.displayName} trong vòng ${ms(time, { long: true })}!`)
                ]
        });

    },
};