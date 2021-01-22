const crypto = require("crypto");

const algorithm = "sha512";
const shasum = crypto.createHash(algorithm);

const hash = async (keyFile) => {
  const hashPromise = new Promise((resolve, reject) => {
    keyFile.on("data", (data) => {
      shasum.update(data);
      const hash = shasum.digest("hex");
      resolve(hash);
    });
  });
  return await hashPromise;
};

exports.hash = hash;
