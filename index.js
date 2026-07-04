const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// ====== CẤU HÌNH ======
const prefix = "!";
const ownerID = "1377934416126410875";
const TOKEN = "MTUyMjU4NDM2OTY2MTg3NDIyNg.Go4Kgl.OLozKKc7Q-0Lnle23z37meqT0tC0jJATTBP6Y4";

// ====== TẠO BOT ======
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// ====== DATA ======
let data = {};
if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json"));
}

function saveData() {
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

// ====== READY ======
client.on("ready", () => {
    console.log("✅ Bot đã online!");
});

// ====== COMMAND ======
client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const id = message.author.id;

    if (!data[id]) {
        data[id] = { money: 0 };
    }

    // 🎣 câu cá
    if (cmd === "fish") {
        const earn = Math.floor(Math.random() * 100) + 1;
        data[id].money += earn;
        saveData();

        return message.reply(`🎣 Bạn câu được ${earn}$`);
    }

    // 💰 xem tiền
    if (cmd === "money") {
        return message.reply(`💰 Bạn có ${data[id].money}$`);
    }

    // 👑 add tiền (owner)
    if (cmd === "addmoney") {
        if (message.author.id !== ownerID) {
            return message.reply("❌ Bạn không phải owner");
        }

        const user = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!user || isNaN(amount)) {
            return message.reply("❌ Dùng: !addmoney @user 100");
        }

        if (!data[user.id]) {
            data[user.id] = { money: 0 };
        }

        data[user.id].money += amount;
        saveData();

        return message.reply(`✅ Đã cộng ${amount}$`);
    }
});

// ====== LOGIN ======
client.login(TOKEN);