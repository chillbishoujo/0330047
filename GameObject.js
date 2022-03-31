class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "Down";
    this.spriteSheet = new createjs.SpriteSheet({
      images: config.src || ["/images/objects/characters/main.png"],
      frames: config.frames || {width:32, height:32},
      animations: config.animations || {
        idleDown : [0],
        idleLeft : [4],
        idleRight: [8],
        idleUp   : [12],
        // walkDownc: [2,3],
        // walkLeftc: [6,7],
        // walkRightc:[10,11],
        // walkUpc: [14,15],
        // walkDown : [0,1, "walkDownc"],
        // walkLeft : [4,5, "walkLeftc"],
        // walkRight: [8,9, "walkRightc"],
        // walkUp   : [12,13, "walkUpc"],
        // walkDown : [0,3],
        walkDown : [0,3],
        walkLeft : [4,7],
        walkRight: [8,11],
        walkUp   : [12,15],
      },
      framerate: 24,
    });
    this.sprite = new createjs.Sprite(this.spriteSheet);
    this.sprite.gotoAndStop("idleDown");

    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;

    this.talking = config.talking || [];
  }

  mount(map, stage) {
    // stage.addChild(this.sprite);
    this.isMounted = true;
    map.addWall(this.x, this.y);
    console.log(this);

    //If we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10)
  }

  updateObject(stage, cameraPerson) {
    const x = this.x + utils.withGrid(9) - cameraPerson.x;
    const y = this.y + 3 + utils.withGrid(4) - cameraPerson.y;
    this.sprite.x = x;
    this.sprite.y = y;
    stage.addChild(this.sprite);
  }

  async doBehaviorEvent(map) {

    //Don't do anything if there is a more important cutscene or I don't have config to do anything
    //anyway.
    console.log(map.isCutscenePlaying);
    // console.log(this.behaviorLoop.length);
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      console.log("Exit loop.");
      return;
    }

    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;

    //Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    //Setting the next event to fire
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    //Do it again!
    this.doBehaviorEvent(map);
  }

}
