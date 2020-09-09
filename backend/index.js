const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 4000;
app.get("/", (req, res) => res.send("Hello World!"));
const dummyDb = { subscription: null }; //dummy in memory store
const saveToDatabase = async (subscription) => {
    // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
    // Here you should be writing your db logic to save it.
    dummyDb.subscription = subscription;
};
// The new /save-subscription endpoint
app.post("/save-subscription", async (req, res) => {
    const subscription = req.body;
    await saveToDatabase(subscription); //Method to save the subscription to Database
    res.json({ message: "success" });
});
const vapidKeys = {
    publicKey:
        "BON4u5RkRIHQ42ZRujsCYTeiFUkf87JgdH8l1i7qagdCGl0UYnacOUO6GRw2z7Q9YDK1oxkIHCSxGhxjs94OfPQ",
    privateKey: "_TOOdMg-GPqpDMcE7S9876yYv8DWhQr3Iqmc6s3bOrw",
};
//setting our previously generated VAPID keys
webpush.setVapidDetails(
    "mailto:myuserid@email.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
    webpush.sendNotification(subscription, dataToSend);
};
//route to test send notification
app.get("/send-notification", (req, res) => {
    const subscription = dummyDb.subscription; //get subscription from your databse here.
    const message = "Novo <b>arquivo</b> disponível!";
    sendNotification(subscription, message);
    res.json({ message: "message sent!!!" });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
