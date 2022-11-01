const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ActivityType,
  EmbedBuilder,
} = require("discord.js");
const { connection, model, Schema } = require("mongoose");
const { AsciiTable3 } = require("ascii-table3");
const { readdirSync, lstatSync } = require("fs");
const { join } = require("path");
const chalk = require("chalk");
const { Player } = require("discord-player");
const config = require("../../config");

class Mimu extends Client {
    constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.User,
        Partials.Reaction,
      ],
      allowedMentions: {
        users: [],
        roles: [],
        repliedUser: false,
      },
      failIfNotExists: true,
    });
    this.config;
    this.messageCommands = new Collection();
    this.applicationCommands = new Collection();
    this.playing = new Collection();
    this.player = new Player(this, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        requestOptions: {
          headers: {
            cookie:
              "SIDCC=AEf-XMRDgnloL5npLUnfyKuAzbzl0cYjX0HWQM6bQ5UBV6R1k-p6DmW3BKAYvYKoXOX8g20wrck",
          },
        },
      },
    });
  }
  _loadEvents(folder) {
    let total = 0;
    const path = join(__dirname, `../events/${folder}`);

    readdirSync(path)
      .filter(
        (file) => lstatSync(join(path, file)).isFile() && file.endsWith(".js")
      )
      .forEach((file) => {
        const event = require(`../events/${folder}/${file}`);
          this.on(event.name, (...args) => event.execute(...args, this));
        total++;
      });

    this[`${folder}EventsLoaded`] = total;
  }

  _loadCommands(folder) {
    let total = 0;
    const path = join(__dirname, `../${folder}`);

    readdirSync(path).forEach((dir) => {
      if (lstatSync(join(path, dir)).isDirectory()) {
        readdirSync(join(path, dir))
          .filter(
            (file) =>
              lstatSync(join(path, dir, file)).isFile() && file.endsWith(".js")
          )
          .forEach((file) => {
            const command = require(`../${folder}/${dir}/${file}`);
            command.dir = dir;
            if (command.name) {
              this[folder].set(command.name, command);
              total++;
            }
          });
      } else if (lstatSync(join(path, dir)).isFile() && dir.endsWith(".js")) {
        const command = require(`../${folder}/${dir}`);
        command.dir = "none";
        if (command.name) {
          this[folder].set(command.name, command.toJSON());
          total++;
        }
      }
    });

    this[`${folder}Loaded`] = total;
  }

  build() {
    this._loadEvents("client");
    this._loadCommands("messageCommands");
    this._loadCommands("applicationCommands");
    this.login(config.token);

    const table = new AsciiTable3()
      .setHeading(chalk.green("Loaded"), chalk.green("Number"))
      .setAlignCenter(2)
      .addRowMatrix([
        [chalk.yellowBright("Client events"), this.clientEventsLoaded],
        [chalk.yellowBright("Message Commands"), this.messageCommandsLoaded],
        [
          chalk.yellowBright("Application Commands"),
          this.applicationCommandsLoaded,
        ],
      ]);

    console.log(table.toString());
  }

  /**
   *
   * @param { String } input
   */
  getID(input) {
    if (!input) return;
    let output = input;

    if (output.startsWith("<@")) output = output.slice(2, -1);
    if (output.startsWith("!")) output = output.slice(1);

    return output;
  }
}

module.exports = Mimu;
