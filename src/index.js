import * as path from 'path';
import * as functions from 'firebase-functions';
import TelegramBot from 'node-telegram-bot-api';
import app from './express-app.js';
import * as epicgames from "epicgames-client";

function checkTgMessage(request) {
    return request.body
        && request.body.message
        && request.body.message.chat
        && request.body.message.chat.id
        && request.body.message.from
        && request.body.message.from.first_name;
}

app.get("/page", async (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, "public/landing_page.html"));
});

//const bot = new TelegramBot(functions.config().tg_bot.token);

async function prepareEGClient(client) {
    await client.init();
    const res = await client.login();
    return true;
}

async function getAllOffers(namespace, pagesize=100) {
    let i = 0;
    let results = [];
    while ((i * pagesize) - results.length === 0) {
        let { elements } = await client.getOffersForNamespace(namespace, pagesize, pagesize * i++);
        results = results.concat(elements);
    }
    return results;
}

const client = new epicgames.Launcher({
    email: "<>",
    password: "<>"
});
const clientReadyPromise = prepareEGClient(client);

app.get('/send', async (req, res) => {
    try {
        await clientReadyPromise;
        console.log(`Logged in as ${client.account.name} (${client.account.id})`);
        let all = await getAllOffers(`epic`);
        console.log(all);
        res.status(200).send(all.slice(0, 10));
    } catch (e) {
        res.status(501);
    }
});
// app.post('/send', async (req, res) => {
//     console.log("start");
//     if (!checkTgMessage(req)) return res.status(200).send({ status: 'not a telegram message' });
//     const chatId = req.body.message.chat.id;
//     const {firstName} = req.body.message.from;
//
//     await bot.sendMessage(chatId, "Hello bomber");
//     console.log("end")
//     return res.status(200).send({});
// });

export const router = functions.https.onRequest(app);