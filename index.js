#! /usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

const algorithm = 'sha256';
const shasum = crypto.createHash(algorithm);

const hashPromise = new Promise((resolve, reject) => {
  var keyFile = fs.ReadStream('key.mck');
  keyFile.on('data', (data) => {
    shasum.update(data);
    const hash = shasum.digest('hex');
    console.log('sha256: ' + hash);
    resolve(hash);
  });
});

hashPromise.then((hash) => {
  var offset = 0;
  var chunkSize = 100;
  var chunkBuffer = new Buffer(chunkSize);
  var fp = fs.openSync('d_encr', 'r');
  var encyrpt = fs.openSync('d', 'w');
  var bytesRead = 0;
  var currentBytes;

  const code = hash;
  let codePosition = 0;

  bytesRead = fs.readSync(fp, chunkBuffer, 0, chunkSize, offset);
  while (bytesRead != 0) {
    offset += bytesRead;
    currentBytes = chunkBuffer.slice(0, bytesRead);

    const modified = [];

    // for (let index = 0; index < currentBytes.length; index++) {
    //   const byte = currentBytes[index];
    //   const key = code.charCodeAt((index + codePosition) % code.length);
    //   const x = (byte + key) % 256;
    //   modified.push(x);
    //   codePosition++;
    // }

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

    modifiedBytes = new Buffer(modified);
    fs.appendFileSync('d', modifiedBytes);
    bytesRead = fs.readSync(fp, chunkBuffer, 0, chunkSize, offset);
  }
});
