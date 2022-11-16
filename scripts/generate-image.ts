import * as Jimp from 'jimp';

const WIDTH = 100;
const HEIGHT = 100;
// const COLOR = 0xFF0000FF; // red
const COLOR = 0x00FF00FF;    // green
const DEST_PATH = `./images/generated-${Date.now()}.png`;

Jimp.create(WIDTH, HEIGHT, COLOR)
  .then((image) => image.write(DEST_PATH))
  .then(() => { console.log(`Saved to: ${DEST_PATH}`) });

