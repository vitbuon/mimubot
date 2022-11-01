const { QueryType } = require("discord-player");
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
  name: "pause",
  description: "dùng để tạm dừng phát nhạc!",
  usages: ["~pause"],
  /**
   *
   * @param { Mimu } client
   * @param { Message } message
   * @param { String[] } args
   * 
   */
  execute: async (client, message, args) => {
    const queue = client.player.getQueue(message.member.guild);

    if (!queue || !queue.playing) return message.channel.send(`<@${message.author.id}>, hiện tại không bài hát nào đang phát!`);

    const success = await queue.setPaused(true);

    await message.channel.send({
      embeds: [
        new EmbedBuilder()
        .setDescription(`<@${message.author.id}>, đã tạm dừng phát nhạc!`)
        .setColor("Yellow")
      ]
    }) 
  }
}