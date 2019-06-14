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

export function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}
