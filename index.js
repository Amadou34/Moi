javascript
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { detecterIntention } = require("./modules/intentionAI");
const { traiterTexte } = require("./modules/texteAI");
const { traiterImage } = require("./modules/imageAI");
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const app = express();
app.use(bodyParser.json());
// Vérification du webhook Messenger
app.get("/webhook", (req, res) =-> {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});
// Réception des messages
app.post("/webhook", async (req, res) =-> {
  if (req.body.object === "page") {
    for (const entry of req.body.entry) {
      const event = entry.messaging[0];
      const senderId = event.sender.id;
      await routeurAuto(senderId, event.message);
    } res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});
//---ROUTEUR AUTOMATIQUE ---
async function routeurAuto(senderId, message) {
  //1️⃣ Cas : image envoyée
  if (message.attachments && message.attachments[0].type === "image") {
    const imageUrl = message.attachments[0].payload.url;
    const promptUser = message.text || "Créer une image esthétique avec mon visage conservé";
    await traiterImage(senderId, imageUrl, promptUser);
    return;
        }
