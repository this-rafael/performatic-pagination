const range = (start: number, end: number, step: number) => {
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }

  return result;
};

const numberfrom0to1000 = range(0, 1000, 1);

console.time("normal");
for (const n of numberfrom0to1000) {
  console.log(numberfrom0to1000.length);
}

console.timeEnd("normal");

console.time("pre calculate");
const length = numberfrom0to1000.length;
for (const n of numberfrom0to1000) {
  console.log(length);
}
console.timeEnd("pre calculate");
// normal: 13.655ms
// pre calculate: 13.789ms
