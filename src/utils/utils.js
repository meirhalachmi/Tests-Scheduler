export function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function fillArray(value, len) {
    const arr = [];
    for (let i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}
