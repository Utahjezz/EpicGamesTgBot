import * as functions from 'firebase-functions';

const message = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('from compiled JavaScript via Babel on Cloud Functions!');
        }, 3000);
    });
};

export const babel = functions.https.onRequest(async (req, res) => {
    const world = await message();
    res.status(200).send(`Hello ${world}`);
});