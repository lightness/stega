import * as Jimp from 'jimp';
import isInteger from 'lodash/isInteger';
import { BitStuffing } from './bit-stuffing';
import { convertBufferToBits } from './buffer-to-bit-coverter';

export class Encryptor {
  private bitStuffing: BitStuffing;

  public constructor() {
    this.bitStuffing = new BitStuffing();
  }

  public encrypt(originalImage: Jimp, secret: string, depth: number) {
    const image = originalImage.clone();

    const secretBuffer = Buffer.from(secret, 'utf-8');
    const escapedSecret = Buffer.from([...this.bitStuffing.escape(secretBuffer)]);
    const secretBits = convertBufferToBits(escapedSecret);

    const capacityBits = (image.bitmap.width * image.bitmap.height - 1) * 3 * depth;

    if (capacityBits < secretBits.length) {
      throw new Error(`Image too small. Capacity (with depth=${depth}) is ${capacityBits} bits. Secret requires ${secretBits.length} bits`);
    }

    const scanIterator = image.scanIterator(0, 0, image.bitmap.width, image.bitmap.height);

    for (const { x, y, idx } of scanIterator) {
      if (x === 0 && y === 0) {
        this.setDepth(image, idx, depth);
        continue;
      }

      const redBits = secretBits.splice(0, depth).join('').padEnd(depth, '0');
      const redNumber = parseInt(redBits, 2);
      image.bitmap.data[idx + 0] = this.applyRightMostBits(image.bitmap.data[idx + 0], depth, redNumber);

      const greenBits = secretBits.splice(0, depth).join('').padEnd(depth, '0');
      const greenNumber = parseInt(greenBits, 2);
      image.bitmap.data[idx + 1] = this.applyRightMostBits(image.bitmap.data[idx + 1], depth, greenNumber);

      const blueBits = secretBits.splice(0, depth).join('').padEnd(depth, '0');
      const blueNumber = parseInt(blueBits, 2);
      image.bitmap.data[idx + 2] = this.applyRightMostBits(image.bitmap.data[idx + 2], depth, blueNumber);

      if (secretBits.length === 0) {
        break;
      }
    }


    return image;
  }

  public decrypt(image: Jimp): string {
    const scanIterator = image.scanIterator(0, 0, image.bitmap.width, image.bitmap.height);

    let temp: string = '';
    let buffer = Buffer.from([]);
    let frameEndReceived = false;
    let depth;

    for (const { x, y, idx } of scanIterator) {
      if (x === 0 && y === 0) {
        depth = this.getDepth(image, idx);
        continue;
      }

      const redBits = image.bitmap.data[idx + 0].toString(2).padStart(8, '0').slice(-depth);
      temp += redBits;

      const greenBits = image.bitmap.data[idx + 1].toString(2).padStart(8, '0').slice(-depth);
      temp += greenBits;

      const blueBits = image.bitmap.data[idx + 2].toString(2).padStart(8, '0').slice(-depth);
      temp += blueBits;

      while (temp.length >= 8) {
        const bits = temp.split('');
        const first8bits = bits.splice(0, 8);
        temp = bits.join('');

        const firstByte = parseInt(first8bits.join(''), 2);
        buffer = Buffer.concat([buffer, Buffer.from([firstByte])]);

        if (firstByte === BitStuffing.FE) {
          frameEndReceived = true;
          break;
        }
      }

      if (frameEndReceived) {
        break;
      }
      
    }

    const unescapedSecret = Buffer.from([...this.bitStuffing.unescape(buffer)]);
    const secret = unescapedSecret.toString('utf-8');

    return secret;
  }

  /**
   * Set depth to pixel at [0;0]
   * @param image - image to be mutated
   * @param depth - mow many bits used to store message info
   * 
   * Examples:
   *  depth == 1 => R := XXXXXXX0 G := XXXXXXX0 B := XXXXXXX1
   *  depth == 2 => R := XXXXXXX0 G := XXXXXXX1 B := XXXXXXX0
   *  depth == 3 => R := XXXXXXX0 G := XXXXXXX1 B := XXXXXXX1
   *  depth == 4 => R := XXXXXXX1 G := XXXXXXX0 B := XXXXXXX0
   *  depth == 5 => R := XXXXXXX1 G := XXXXXXX0 B := XXXXXXX1
   *  depth == 6 => R := XXXXXXX1 G := XXXXXXX1 B := XXXXXXX0
   *  depth == 7 => R := XXXXXXX1 G := XXXXXXX1 B := XXXXXXX1
   */
  private async setDepth(image: Jimp, idx: number = 0, depth: number): Promise<void> {
    if (!isInteger(depth) || depth < 1 || depth > 7) {
      throw new Error('Depth should be an integer from 1 to 7');
    }

    const redRightMost = (depth >> 2) % 2;
    const greenRightMost = (depth >> 1) % 2;
    const blueRightMost = (depth >> 0) % 2;

    image.bitmap.data[idx + 0] = this.applyRightMostBits(image.bitmap.data[idx + 0], 1, redRightMost);
    image.bitmap.data[idx + 1] = this.applyRightMostBits(image.bitmap.data[idx + 1], 1, greenRightMost);
    image.bitmap.data[idx + 2] = this.applyRightMostBits(image.bitmap.data[idx + 2], 1, blueRightMost);
  }

  private applyRightMostBits(value: number, depth: number, bits: number) {
    const result = value - value % Math.pow(2, depth) + bits % Math.pow(2, depth);

    return result;
  }

  private getDepth(image: Jimp, idx: number): number {
    const red = image.bitmap.data[idx + 0];
    const green = image.bitmap.data[idx + 1];
    const blue = image.bitmap.data[idx + 2];

    return parseInt(`${red % 2}${green % 2}${blue % 2}`, 2)
  }
}