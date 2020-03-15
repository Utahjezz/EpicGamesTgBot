import * as functions from 'firebase-functions';
import TelegramBot from 'node-telegram-bot-api';
import app from './express-app.js';

function checkTgMessage(request) {
    return request.body
        && request.body.message
        && request.body.message.chat
        && request.body.message.chat.id
        && request.body.message.from
        && request.body.message.from.first_name;
}

const bot = new TelegramBot("");


app.post('/helloworld', async (req, res) => {
    console.log("start");
    if (checkTgMessage(req)) {
        const chatId = req.body.message.chat.id;
        const {firstName} = req.body.message.from;

        await bot.sendMessage(chatId, "Hello bomber");
        console.log("end")
        return res.status(200).send({});
    }
    return res.status(200).send({ status: 'not a telegram message' });
});

export const router = functions.https.onRequest(app);