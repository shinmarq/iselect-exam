const readline = require("readline");
const { Robot } = require("./src/Robot-Simulator");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("INPUT: ", input => {
  try {
    let robot = new Robot();
    robot.processCommand(input);
  } catch (e) {
    console.log({ errorMsg: e.message });
  }
});
