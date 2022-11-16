import * as Jimp from 'jimp';

async function getPixel(path: string, posX: number, posY: number) {
  const image = await Jimp.read(path);

  image.scan(posX, posY, 1, 1, (x, y, idx) => {
    console.log(`[${x}:${y}] - ${path}`);
    console.log(`RED: ${image.bitmap.data[idx + 0]}`);
    console.log(`GREEN: ${image.bitmap.data[idx + 1]}`);
    console.log(`BLUE: ${image.bitmap.data[idx + 2]}`);
    console.log('');
  }); 
}

// getPixel('./images/result-1646563299108.bmp', 1, 0);
getPixel('./images/black-3x3.bmp', 1, 0);