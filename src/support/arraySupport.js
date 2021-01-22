const findValue = (arr, arg) => {
  const value = arr.find((v) => v === arg);
  const pos = arr.indexOf(value) + 1;
  if (pos < arr.length && pos > 0) {
    return arr[pos];
  }
  return false;
};

exports.findValue = findValue;
