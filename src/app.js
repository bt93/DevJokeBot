// Configure environment variables
require('dotenv').config();
// import bolt
const { App } = require('@slack/bolt');
// import axios
const axios = require('axios');

// initialize app
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

console.log(app.logger);

// Listens to incoming messages that contain "hello"
app.message('Tell me a joke', ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    try {
        axios.get('https://official-joke-api.appspot.com/jokes/programming/random')
            .then(res => {
                tellJoke(res.data[0].setup, res.data[0].punchline, message, say)
            })
            .catch(err => {
                if (err) {
                    say('Sorry something went wrong');
                }
            });
    } catch (err) {
        console.log(err);
    }
  });

(async () => {
    const port = process.env.PORT || 3000;

    // Start app
    await app.start(port);

    console.log(`⚡️ Bolt app is running at port ${port}!`)
})()

async function tellJoke(setup, punchline, message, say) {
    await say(setup);
    setTimeout( async () => {  
        await say(punchline);

        say(`Try me again, <@${message.user}>!`)
    }, 5000);
}