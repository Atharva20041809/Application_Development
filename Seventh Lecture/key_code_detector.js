// process.stdin.setRawMode(true);

// process.stdin.on("data", (data) => {
//   console.log(
//      data, `${data}`
//   );
//   if (data[0] == 0x71) {
//     process.exit(0);
//   }
// });



const readline = require("readline");

// Tell Node.js to start parsing character streams into keypress objects
readline.emitKeypressEvents(process.stdin);

// Configure the terminal to pass keys immediately instead of waiting for 'Enter'
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

process.stdin.on("keypress", (str, key) => {
  // Exit cleanly on Ctrl+C
  if (key.ctrl && key.name === "c") {
    process.exit();
  }

  console.log(`Mapped Button Name: "${key.name}"`);
  console.log(`Raw ANSI Code Sequence: "${key.sequence}"`);
  console.log(key);
});
