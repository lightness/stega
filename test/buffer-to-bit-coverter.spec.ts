import { BufferToBitConverter } from "../src/buffer-to-bit-coverter";

const bufferToBitConverter = new BufferToBitConverter();

const buffer = Buffer.from([0, 255]);

const result = [...bufferToBitConverter.toBit(buffer)];

console.log('result', result);