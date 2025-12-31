javascript
const Replicate = require("replicate");
const { envoyerImage, envoyerMessage } = require("../index");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

async function traiterImage(senderId, imageUrl, prompt) {
  try {
    await envoyerMessage(senderId, "🛠 Transformation de l'image en cours...");

    const output = await replicate.run(
      "tencentarc/photomaker:5f048616b6d73a8d49f94fd0f2aa1370c461e033c10c14aaf6c20c10aa8603b4",
      {
        input: {
          input_image: imageUrl,
          prompt,
          style: "light realistic",
          guidance_scale: 7.5,
        }
      }
    );

    const imageResultUrl = output[0];
    await envoyerImage(senderId, imageResultUrl);

  } catch (error) {
    console.error(error);
    await envoyerMessage(senderId, "❌ Erreur génération image.");
  }
}

module.exports = { traiterImage };
