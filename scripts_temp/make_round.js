const Jimp = require('jimp');

async function processImage() {
  try {
    const imagePath = '../assets/images/Tg.png';
    const outputPath = '../assets/images/Tg_round.png';
    
    console.log('Reading image...', imagePath);
    const image = await Jimp.read(imagePath);
    
    //La imagen tiene un fondo blanco. Usaremos el método del círculo de Jimp para recortarla.

    console.log('Cropping to circle...');
    image.circle();
    
    console.log('Saving to...', outputPath);
    await image.writeAsync(outputPath);
    console.log('Done!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
