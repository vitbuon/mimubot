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
  name: "volume",
  description: "dùng để chỉnh âm lượng!",
  usages: ["~volume <một con số từ 1 đén 100>"],
  aliases: ["vol"],
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

    let vol = args[0];

    
    /**
     * 
     * @param { String } content 
     */
    
    function embed(content) {
      return new EmbedBuilder()
      .setDescription(content)
      .setColor("Yellow")
    }

    const msg = await client.playing.get(queue);

    if (!vol || vol > 100) return msg.reply({
      embeds: [embed(`<@${message.author.id}>, volume ${queue.volume} | 🔊`)]
    })
    
    const success = await queue.setVolume(vol);

    await msg.reply({
      embeds: [
        embed(`<@${message.author.id}>, set volume ${vol} | 🔊`)
      ]
    })
  }
}
