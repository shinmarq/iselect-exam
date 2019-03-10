class Robot {
  constructor() {
    this.units = [];
    this.table = [];
    this.currentFacing = "";
    this.posX = 0;
    this.posY = 0;
  }

  processCommand(cmd) {
    this.buildTable();

    let command = this.normaliseCommand(cmd);
    let cmdSequence = command.split("|");

    let { posX, posY, initFacing } = this.setPosition(cmdSequence[0]);
    this.posX = posX;
    this.posY = posY;

    let moves = this.moveChecker(cmdSequence);
    let face = this.handleFacing(cmdSequence, initFacing);

    if (moves !== 0) {
      //Check the first move since initial positioning
      for (let i = 1; i <= cmdSequence.length - 1; i++) {
        if (cmdSequence[i] === "LEFT" || cmdSequence[i] === "RIGHT") {
          //direction
          if (cmdSequence[i].includes("LEFT")) {
            face = this.handleFacing(cmdSequence, this.currentFacing, "LEFT");
          } else {
            face = this.handleFacing(cmdSequence, this.currentFacing, "RIGHT");
          }
          this.currentFacing = !face ? this.currentFacing : face;
        } else if (cmdSequence[i] === "MOVE") {
          //movement
          if (this.currentFacing.includes("NORTH")) {
            if (this.posY < 4) {
              this.posY++;
            }
          } else if (this.currentFacing.includes("SOUTH")) {
            if (this.posY > 0) {
              this.posY--;
            }
          } else if (this.currentFacing.includes("EAST")) {
            if (this.posX < 4) {
              this.posX++;
            }
          } else if (this.currentFacing.includes("WEST")) {
            if (this.posX > 0) {
              this.posX--;
            }
          }
        } else {
          console.log("reporting...");
          console.log(
            `OUTPUT: ${this.posX}, ${this.posY}, ${this.currentFacing}`
          );
        }
      }
    } else {
      console.log("reporting...");
      !face
        ? console.log(`OUTPUT: ${posX},${posY},${this.currentFacing}`)
        : console.log(`OUTPUT: ${posX},${posY},${face}`);
    }
  }

  moveChecker(sequence) {
    let moves = 0;
    for (let i in sequence) {
      sequence[i] === "MOVE" ? moves++ : moves;
    }

    return moves;
  }

  handleFacing(sequence, initFacing, moving) {
    this.currentFacing = initFacing;

    if (!moving) {
      for (let i = 1; i <= sequence.length - 1; i++) {
        if (sequence[i] === "LEFT") {
          if (this.currentFacing === "NORTH") return "WEST";
          if (this.currentFacing === "EAST") return "NORTH";
          if (this.currentFacing === "WEST") return "SOUTH";
          if (this.currentFacing === "SOUTH") return "EAST";
        } else if (sequence[i] === "RIGHT") {
          if (this.currentFacing === "NORTH") return "EAST";
          if (this.currentFacing === "EAST") return "SOUTH";
          if (this.currentFacing === "WEST") return "NORTH";
          if (this.currentFacing === "SOUTH") return "WEST";
        } else {
          return false;
        }
      }
    } else {
      //moving
      if (moving === "LEFT") {
        if (this.currentFacing === "NORTH") return "WEST";
        if (this.currentFacing === "EAST") return "NORTH";
        if (this.currentFacing === "WEST") return "SOUTH";
        if (this.currentFacing === "SOUTH") return "EAST";
      } else if (moving === "RIGHT") {
        if (this.currentFacing === "NORTH") return "EAST";
        if (this.currentFacing === "EAST") return "SOUTH";
        if (this.currentFacing === "WEST") return "NORTH";
        if (this.currentFacing === "SOUTH") return "WEST";
      } else {
        return false;
      }
    }
  }

  //Initial positioning
  setPosition(currentPos) {
    let direction = ["NORTH", "EAST", "WEST", "SOUTH"];
    let [place, coordinates] = currentPos.split(" ");
    let [posX, posY, initFacing] = coordinates.split(",");

    if (posX > 4 || posX < 0)
      throw new Error("Invalid input X, please put between 0-4");
    if (posY > 4 || posY < 0)
      throw new Error("Invalid input Y, please put between 0-4");
    if (!direction.includes(initFacing)) throw new Error("Invalid facing.");

    return { posX, posY, initFacing };
  }
  //Virtual Table platform
  buildTable() {
    let ctr = 0;
    for (let x = 0; x <= 24; x++) {
      this.units.push(ctr++);
      if (this.units.length === 5) {
        this.table.push(this.units);
        this.units = [];
        ctr = 0;
      }
    }
    return this.table;
  }

  normaliseCommand(cmd) {
    let command = cmd.toUpperCase(); //Normalise Input

    let separator = command.includes("|");
    let initialized = command.includes("PLACE", 0);
    let reported = command.includes("REPORT");

    if (!initialized)
      throw new Error(
        "The bot is not initialized, Type PLACE X,Y,F to initialized"
      );
    if (!separator) throw new Error(`Command separator is required "|"`);
    if (!reported)
      throw new Error("The bot not yet reporting, please type REPORT");

    return command;
  }
}

exports.Robot = Robot;
