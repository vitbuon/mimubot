const { Mimu } = require('../../structures/mimu');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueueRepeatMode } = require("discord-player");
const { button, buttonOption, collector } = require("../../../component/componentPlayer")

module.exports = {
    name: 'ready',

    /**
     * 
     * @param { Mimu } client
     */
    execute: async (client) => {

        // TRACK START

        client.player.on("trackStart", async (queue, track) => {
            const playerInfo = await queue.generateStatistics();
            const timestamp = queue.getPlayerTimestamp();
            const field = [
                { name: "Channel:", value: `|_\`\`${track.author}\`\`` , inline: true, },
                { name: "Views:", value: `|_\`\`${track.views}\`\`` , inline: true, },
                { name: "Add by:", value: `|_<@${track.requestedBy.id}>`, inline: true, },
                { name: "Room:", value: `|_<#${queue.metadata.voice.channel.id}>`, inline: true, },
                { name: "Auto Play:", value: queue.repeatMode === QueueRepeatMode.AUTOPLAY ? `|_<:switch_on:1028700634616168640>` : `|_<:switch_off:1028704122217705602>`, inline: true, },
                { name: "Track:", value: `|_${playerInfo.tracks} bài`, inline: true, },
            ];
            const embed = new EmbedBuilder()
            .setDescription(`Đang phát: **[${track.title}](${track.url})** \n \`\`\`css\n ${timestamp.current} ──────────────────────── ${track.duration}\`\`\``)
            .setFields(field)
            .setImage(track.thumbnail ? track.thumbnail : client.user.displayAvatarURL({ extension: 'png', size: 4096 }))
            .setAuthor({ name: `${track.author}` })
            .setColor("Yellow");

            const msg = await queue.metadata.channel.send({
                embeds: [embed],
                components: [button(true, false, true, false), buttonOption(false)]
            });
            client.playing.set(queue, msg);
            collector(msg, queue)            
        });

        // TRACK END

        client.player.on("trackEnd", async (queue, track) => {
            const message = await client.playing.get(queue);
            if (!message) return;
            await message.delete()
        });

        // QUEUE END

        client.player.on("queueEnd", async (queue, track) => {
            const embed = new EmbedBuilder()
            .setDescription(`Đã phát hết nhạc trong danh sách!\n Dùng skplay để nghe thêm!`)
            .setColor("Yellow");
            queue.metadata.channel.send({
                embeds: [embed]
            });     
        });
    },
};