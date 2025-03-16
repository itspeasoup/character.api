require('dotenv').config();

const express = require('express');
const CharacterAI = require('node_characterai');

const {access_token} = process.env
const app = express();
const characterAI = new CharacterAI();
characterAI.authenticateWithToken(access_token);

app.use(express.json());

app.post("/", async (req, res) => {
    if (req.body.characterID !== undefined && req.body.message !== undefined) {
        console.log(req.ip)
        try {
            if (req.body.userdname !== undefined && req.body.username !== undefined) {
                console.log(req.body.userdname+' ['+req.body.username+']: "'+req.body.message+'"');
            }
            let chat = await characterAI.createOrContinueChat(req.body.characterID);
            if (chat === undefined) {
                chat = await characterAI.createOrContinue(req.body.characterID);
            }
            const response = await chat.sendAndAwaitResponse(req.body.message, true);
            if (response && response.text !== undefined) {
                console.log('ai: "'+response.text+'"');
                res.json({ response: response.text });
            }
        } catch (error) {}
    }
});

app.listen(3008, "0.0.0.0", () => {
    console.log('Server is running on port 3008');
});