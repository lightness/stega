export function convertBufferToBits(buffer: Buffer): string[] {
  const result = [];

  for (const byte of buffer) {
    const bits = byte.toString(2).padStart(8, '0');

    for (const bit of bits) {
      result.push(bit);
    }
  }

  return result;
}