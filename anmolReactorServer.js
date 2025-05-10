const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/react', async (req, res) => {
    const { tokens, postLink, reactionType } = req.body;

    if (!tokens || !postLink || !reactionType) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    let success = 0;
    let failed = 0;

    for (let token of tokens) {
        try {
            const postId = postLink.split('/').pop().split('?')[0];

            await axios.post(
                `https://graph.facebook.com/v19.0/${postId}/reactions`,
                {
                    type: reactionType.toUpperCase(),
                    access_token: token
                }
            );
            success++;
        } catch (error) {
            failed++;
        }
    }

    res.json({ message: `Reacted: ${success} success, ${failed} failed.` });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Anmol Reactor Server Running...');
});
