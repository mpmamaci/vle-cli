const fs = require("fs");

class FileEncryption {
  constructor() {
    this.chunkSize = 100;
    this.chunkBuffer = Buffer.alloc(this.chunkSize);
  }

  encode(path, code) {
    let codePosition = 0;
    let offset = 0;
    let currentBytes;
    const fp = fs.openSync(path, "r");
    //const encyrpt = fs.openSync(path + ".enc", "w");
    let bytesRead = fs.readSync(
      fp,
      this.chunkBuffer,
      0,
      this.chunkSize,
      offset
    );
    while (bytesRead != 0) {
      offset += bytesRead;
      currentBytes = this.chunkBuffer.slice(0, bytesRead);

      const modified = [];

      for (let index = 0; index < currentBytes.length; index++) {
        const byte = currentBytes[index];
        const key = code.charCodeAt((index + codePosition) % code.length);
        const x = (byte + key) % 256;
        modified.push(x);
        codePosition++;
      }

      //   for (let index = 0; index < currentBytes.length; index++) {
      //     const byte = currentBytes[index];
      //     const key = code.charCodeAt((index + codePosition) % code.length);
      //     let y = byte - key;
      //     if (y < 0) {
      //       y += 256;
      //     }
      //     y = y % 256;
      //     modified.push(y);
      //     codePosition++;
      //   }

      const modifiedBytes = Buffer.from(modified);
      fs.appendFileSync(path + ".enc", modifiedBytes);
      bytesRead = fs.readSync(fp, this.chunkBuffer, 0, this.chunkSize, offset);
    }
  }

  decode(path, code) {
    let codePosition = 0;
    let offset = 0;
    let currentBytes;
    const fp = fs.openSync(path, "r");
    let bytesRead = fs.readSync(
      fp,
      this.chunkBuffer,
      0,
      this.chunkSize,
      offset
    );
    while (bytesRead != 0) {
      offset += bytesRead;
      currentBytes = this.chunkBuffer.slice(0, bytesRead);

      const modified = [];

      for (let index = 0; index < currentBytes.length; index++) {
        const byte = currentBytes[index];
        const key = code.charCodeAt((index + codePosition) % code.length);
        let y = byte - key;
        if (y < 0) {
          y += 256;
        }
        y = y % 256;
        modified.push(y);
        codePosition++;
      }

      const modifiedBytes = Buffer.from(modified);
      fs.writeFileSync(path.replace(".enc", ""), modifiedBytes);
      bytesRead = fs.readSync(fp, this.chunkBuffer, 0, this.chunkSize, offset);
    }
  }
}

module.exports = FileEncryption;
