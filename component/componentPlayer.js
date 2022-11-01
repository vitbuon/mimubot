const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { QueueRepeatMode } = require("discord-player");

    // function

    function button(last, pause, resume, next) {
        const row = new ActionRowBuilder()
        .setComponents( 
            new ButtonBuilder()
            .setCustomId('setting')
            .setEmoji('<a:setting:1028633651434487838>')
            .setStyle(ButtonStyle.Primary),                    
            new ButtonBuilder()
            .setCustomId('last')
            .setEmoji('⏮')
            .setStyle(ButtonStyle.Success)
            .setDisabled(last),
            new ButtonBuilder()
            .setCustomId('pause')
            .setEmoji('⏸')
            .setStyle(ButtonStyle.Success)
            .setDisabled(pause),
            new ButtonBuilder()
            .setCustomId('resume')
            .setEmoji('◀')
            .setStyle(ButtonStyle.Success)
            .setDisabled(resume),
            new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('⏭')
            .setStyle(ButtonStyle.Success)
            .setDisabled(next),
        );
        return row;
    }
    function buttonOption(disabled) {
        const row = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
            .setCustomId('stop')
            .setEmoji('🛑')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(disabled),
            new ButtonBuilder()
            .setCustomId('loopqueue')
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),
            new ButtonBuilder()
            .setCustomId('random')
            .setEmoji('🔀')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),
            new ButtonBuilder()
            .setCustomId('looptrack')
            .setEmoji('🔂')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),
            new ButtonBuilder()
            .setCustomId('auto')
            .setEmoji('<a:switch:1028700849586847804>')
            .setStyle(ButtonStyle.Success)
            .setDisabled(disabled),
        )
        return row;
    }

    /**
     * 
     * @param { String } text
    */

    function embedFN(text) {
        const embed = new EmbedBuilder()
        .setDescription(text)
        .setColor("Yellow");

        return embed;
    }
	function collector(msg, queue) {
	    const collector = msg.createMessageComponentCollector();

	    collector.on("collect", async (interaction) => {
	        if (interaction.isButton()) {
	            switch (interaction.customId) {
	                case "pause":
	                    queue.setPaused(true)
	                    interaction.update({
	                        components: [button(true, true, false, false), buttonOption(false)]
	                    })
	                break;
	                case "resume":
	                    queue.setPaused(false)
	                    interaction.update({
	                        components: [button(true, false, true, false), buttonOption(false)]
	                    })
	                break;
	                case "next":
	                    queue.skip()
	                    interaction.reply({
	                        embeds: [embedFN(`<@${interaction.user.id}> đã skip bài hát | ${queue.current.title}}`)]
	                        })
	                break;
	                case "auto":
	                    if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
	                        queue.setRepeatMode(QueueRepeatMode.OFF)
	                        interaction.reply({
	                            embeds: [embedFN(`<@${interaction.user.id}> đã tắt auto`)]
	                        }) 
	                    } else {
	                        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
	                        interaction.reply({
	                                embeds: [embedFN(`<@${interaction.user.id}> đã bật auto`)]
	                            })
	                    }
	                break;
	                case "loopqueue":
	                    if (queue.repeatMode === QueueRepeatMode.QUEUE) {
	                        queue.setRepeatMode(QueueRepeatMode.OFF)
	                        interaction.channel.send({
	                            embeds: [embedFN(`<@${interaction.user.id}> đã tắt lặp lại bài hát`)]
	                        })    
	                    } else {
	                    queue.setRepeatMode(QueueRepeatMode.QUEUE)
	                    interaction.reply({
	                            embeds: [embedFN(`<@${interaction.user.id}> đã bật lặp lại bài hát`)]
	                        })
	                    }
	                break;
	                case "looptrack":
	                    if (queue.repeatMode === QueueRepeatMode.TRACK) {
	                        queue.setRepeatMode(QueueRepeatMode.OFF)
	                        interaction.reply({
	                            embeds: [embedFN(`<@${interaction.user.id}> đã tắt lặp lại danh sách phát`)]
	                        })    
	                    } else {
	                    queue.setRepeatMode(QueueRepeatMode.TRACK)
	                    interaction.reply({
	                            embeds: [embedFN(`<@${interaction.user.id}> đã tắt lặp lại danh sách phát`)]
	                        })
	                    }
	                break;
	                case "stop":
	                    queue.stop()
	                break;
	            }
	        }
		})

	}


module.exports = { button, buttonOption, collector }