class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      "Up": ["y", -1],
      "Down": ["y", 1],
      "Left": ["x", -1],
      "Right": ["x", 1],
    }
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {

      //More cases for starting to walk will come here
      //
      //

      //Case: We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
      this.updateSprite();
    }
  }

  startBehavior(state, behavior) {
    //Set character direction to whatever behavior has
    this.direction = behavior.direction;
    this.isRunning = state.map.isRunning();

    if (behavior.type === "walk") {
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {

        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 10);

        return;
      }

      //Ready to walk!
      if (this.isRunning) {
        this.movingProgressRemaining = 8;
      } else {
        this.movingProgressRemaining = 16;
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.sprite.gotoAndStop("walk"+this.direction);
      this.updateSprite();
    }

    if (behavior.type === "stand") {
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
      }, behavior.time)
    }

  }

  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];
      if (this.isRunning) {
        this[property] += change * 2;
      } else {
        this[property] += change;
      }
      this.movingProgressRemaining -= 1;

      if (this.movingProgressRemaining === 0) {
        //We finished the walk!
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id
        })

      }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      // this.sprite.currentAnimation = `walk${this.direction}`;
      this.sprite.gotoAndPlay("walk"+this.direction);
      // console.log(this.movingProgressRemaining);
      // this.sprite.advance();
      return;
    }
    this.sprite.gotoAndStop("idle"+this.direction);
  }

}
