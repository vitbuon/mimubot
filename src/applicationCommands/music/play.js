const { ApplicationCommandOptionType, ChatInputCommandInteraction, ApplicationCommandOptionBase, ChannelType, ApplicationCommandOptionChannelTypesMixin, EmbedBuilder } = require("discord.js");
const { QueryType, QueueRepeatMode } = require("discord-player")
const { Mimu } = require("../../structures/mimu");

module.exports = {
    name: "play",
    description: "dùng để nghe nhạc",
    options: [
        {
            name: "song",
            description: "link nhạc hoặc tên bài nhạc",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    /**
     * 
     * @param { Mimu } client
     * @param { ChatInputCommandInteraction } interaction
     * @param { any[] } args
     */

    execute: async (client, interaction, args) => {
        const [songPlay] = args;

        const queue = await client.player.createQueue(interaction.member.guild, {
            metadata: {
              channel: interaction.channel,
              voice: interaction.member.voice
            },
            leaveOnEnd: false,
            leaveOnStop: true,
            leaveOnEmpty: true,
            initialVolume: 70,
            bufferingTimeout: 200,
            leaveOnEmptyCooldown: 60 * 1000,
        });
    
        const embed = new EmbedBuilder()
    
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    
        const msg = await interaction.reply(`chờ xíu nha...!`);
    
        const url = songPlay;
    
        const result = await client.player.search(url, {
          requestedBy: interaction.member,
          searchEngine: QueryType.AUTO,
        });
    
        if (result.tracks.length === 0) return interaction.editReply(`<@${interaction.author.id}>, không tìm thấy bài hát `);
    
        const song = result.tracks[0];
    
        embed.setColor("Yellow")
        .setDescription(`Thêm **[${song.title}](${song.url})** vào danh sách phát`)
        .setThumbnail(song.thumbnail ? song.thumbnail : client.user.displayAvatarURL({ extension: 'png', size: 4096 }));
    
        await queue.addTrack(song);
    
        await interaction.editReply({
            content: '\u200b',
            embeds: [embed]
        })
    
        if (!queue.playing) await queue.play();
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
    }
}