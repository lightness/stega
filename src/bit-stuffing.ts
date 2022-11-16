

export class BitStuffing {
  public static FS = 0x02;
  public static FE = 0x17;
  public static ESC = 0x1B;
  public static XM = 0x0E;

  public *escape(buffer: Buffer) {
    const { FS, FE, ESC, XM } = BitStuffing;

    yield FS;

    for (const byte of buffer) {
      if ([FS, FE, ESC].includes(byte)) {
        yield ESC;
        yield byte ^ XM;
      } else {
        yield byte;
      }
    }

    yield FE;
  }

  public *unescape(buffer: Buffer) {
    const { ESC, XM, FS, FE } = BitStuffing;
    let needXor = false;

    if (buffer[0] !== FS) {
      throw new Error(`First byte should be FS (${FS})`);
    }

    if (buffer[buffer.length -1] !== FE) {
      throw new Error(`Last byte should be FE (${FE})`);
    }

    const payload = buffer.slice(1, -1);

    for (const byte of payload) {
      if (byte === ESC) {
        needXor = true;
        continue;
      }

      if (needXor) {
        yield byte ^ XM;
        needXor = false;
      } else {
        yield byte;
      }
    }
  }
}
