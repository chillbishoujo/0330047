class DirectionInput {
  constructor() {
    this.heldDirections = [];
    this.isRunning = false;

    this.map = {
      "ArrowUp": "Up",
      "KeyW": "Up",
      "ArrowDown": "Down",
      "KeyS": "Down",
      "ArrowLeft": "Left",
      "KeyA": "Left",
      "ArrowRight": "Right",
      "KeyD": "Right",
    }
  }

  get direction() {
    return this.heldDirections[0];
  }

  init() {
    document.addEventListener("keydown", e => {
      const dir = this.map[e.code];
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        this.isRunning = true;
      }
      if (dir && this.heldDirections.indexOf(dir) === -1) {
        // console.log(dir);
        this.heldDirections.unshift(dir);
      }
    });
    document.addEventListener("keyup", e => {
      const dir = this.map[e.code];
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        this.isRunning = false;
      }
      const index = this.heldDirections.indexOf(dir);
      if (index > -1) {
        this.heldDirections.splice(index, 1);
      }
    })

  }

}
