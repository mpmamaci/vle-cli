#! /usr/bin/env node

const fs = require("fs");

const FileEncryption = require("./fileEncryption");
const shaSupport = require("./support/shaSupport");
const arrSupport = require("./support/arraySupport");

const argv = process.argv;

const hashFilePath =
  arrSupport.findValue(argv, "-s") || arrSupport.findValue(argv, "--sha");

const encodeFilePath =
  arrSupport.findValue(argv, "-e") || arrSupport.findValue(argv, "--encode");

const decodeFilePath =
  arrSupport.findValue(argv, "-d") || arrSupport.findValue(argv, "--decode");

if (hashFilePath) {
  const keyFile = fs.ReadStream(hashFilePath);
  shaSupport.hash(keyFile).then((hash) => {
    /*TODO: Use hash as code*/
  });
} else if (encodeFilePath) {
  const fe = new FileEncryption();
  fe.encode(encodeFilePath, "test");
} else if (decodeFilePath) {
  if (decodeFilePath.includes(".enc")) {
    const fe = new FileEncryption();
    fe.decode(decodeFilePath, "test");
  } else {
    console.log(`Invalid File: ${encodeFilePath}`);
    console.log(`Only custom .enc-Files can be decoded`);
  }
} else {
  console.log(`
  vle - Vigenere Like Encryption for Files

  You can encode and decode your files with a code (-c | --code) or with a different file.
  If you want to encrypt your file with a different file use the --sha or -s flag followed by the path.
  By using the -s or --sha flag the sha512 of your selected file is used as the code

  You can use both a code an a file to create a multi factor encryption

  --encode | -e   <PATH TO FILE>
  --decode | -d   <PATH TO FILE>
  --code   | -c   <PASSWORD | CODE>
  --sha    | -s   <PATH TO FILE>

  `);
}
