javascript
const fetch = require("node-fetch");
async function detecterIntention(text) {
  const resp = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-mnli", {
    method: "POST",
    headers: {
      Authorization: Bearer ${process.env.HF_API_TOKEN},
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text,
      parameters: { candidate_labels: ["edition photo", "conversation", "meteo", "email temp"] }
    })
  });
  const data = await resp.json();
  return data.labels[0]; // retourne l'intention la plus probable
}
module.exports = { detecterIntention };
5️⃣ Module IA Texte (modules/texteAI.js)
javascript
const fetch = require("node-fetch");
const { envoyerMessage } = require("../index");
async function traiterTexte(senderId, text) {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: Bearer ${process.env.HF_API_TOKEN},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text })
    });
    const data = await response.json();
    const reply = data[0]?.generated_text || "Réponse indisponible.";
    await envoyerMessage(senderId, reply);
  } catch (e) {
    console.error(e);
    await envoyerMessage(senderId, "❌ Erreur IA texte.");
  }
}
module.exports = { traiterTexte };
