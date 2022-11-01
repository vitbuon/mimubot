const { QueryType, QueueRepeatMode } = require("discord-player");
const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require("discord.js");
const config = require("../../../config");
const { Mimu } = require("../../structures/mimu");

module.exports = {
  name: "play",
  description: "dùng để nghe nhạc!",
  usages: ["~play [tên nhạc]", "~play [link nhạc]"],
  aliases: ["p"],
  /**
   *
   * @param { Mimu } client
   * @param { Message } message
   * @param { String[] } args
   * 
   */
  execute: async (client, message, args) => {
    if (!args[0]) return message.reply(`<@${message.author.id}>, bạn chưa nhập tên hoặc link nhạc!`);
    if (!message.member.voice.channel) return message.reply(`<@${message.author.id}>, bạn hiện tại không có trong kênh thoại`);

    const queue = await client.player.createQueue(message.member.guild, {
        metadata: {
          channel: message.channel,
          voice: message.member.voice
        },
        leaveOnEnd: false,
        leaveOnStop: true,
        leaveOnEmpty: true,
        initialVolume: 70,
        bufferingTimeout: 200,
        leaveOnEmptyCooldown: 60 * 1000,
    });

    const embed = new EmbedBuilder()

    if (!queue.connection) await queue.connect(message.member.voice.channel);

    const msg = await message.channel.send(`chờ xíu nha...!`);

    const url = args.join(' ');

    const result = await client.player.search(url, {
      requestedBy: message.member,
      searchEngine: QueryType.AUTO,
    });

    if (result.tracks.length === 0) return msg.edit(`<@${message.author.id}>, không tìm thấy bài hát `);

    const song = result.tracks[0];

    embed.setColor("Yellow")
    .setDescription(`Thêm **[${song.title}](${song.url})** vào danh sách phát`)
    .setThumbnail(song.thumbnail ? song.thumbnail : client.user.displayAvatarURL({ extension: 'png', size: 4096 }));

    await queue.addTrack(song);

    await msg.edit({
    content: '',
    embeds: [embed]
    })

    if (!queue.playing) await queue.play();
    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
    
  }

}