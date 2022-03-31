class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = config.lowerSrc;
    this.upperImage = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(stage, cameraPerson) {
    var map = new createjs.Bitmap(this.lowerImage);
    map.x = utils.withGrid(9) - cameraPerson.x;
    map.y = utils.withGrid(4) - cameraPerson.y;

    stage.addChild(map);
  }

  drawUpperImage(stage, cameraPerson) {
    var map = new createjs.Bitmap(this.upperImage);
    map.x = utils.withGrid(9) - cameraPerson.x;
    map.y = utils.withGrid(4) - cameraPerson.y;
    stage.addChild(map);
  }

  isRunning() {
    const isRunning = this.overworld.directionInput.isRunning;
    var hero = this.gameObjects["hero"];
    if (isRunning) {
      hero.sprite.framerate = 24;
    } else {
      hero.sprite.framerate = 15;
    }
    return isRunning;
  }

  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    // console.log(`${x},${y}`);
    // console.log(this.walls);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects(stage) {
    Object.keys(this.gameObjects).forEach(key => {

      let object = this.gameObjects[key];
      object.id = key;

      //TODO: determine if this object should actually mount
      object.mount(this, stage);

    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
    // Object.values(this.gameObjects).forEach(object => {
    //   // console.log("Bruh");
    //   object.doBehaviorEvent(this);
    //   return;
    // });
    // console.log(this.isCutscenePlaying);
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events );
    }

  }

  addWall(x,y) {
    this.walls[`${x},${y}`] = true;
  }
  removeWall(x,y) {
    delete this.walls[`${x},${y}`]
  }
  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const {x,y} = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x,y);
  }

}
window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/images/maps/main-wippy.png",
    // upperSrc: "/images/maps/DemoUpper.png",
    gameObjects: {
      hero: new Person({
        isPlayerControlled: true,
        x: utils.withGrid(40),
        y: utils.withGrid(40),
        frames: {width:48, height: 48},
      }),
      pink: new Person({
        // isPlayerControlled: true,
        x: utils.withGrid(20),
        y: utils.withGrid(36),
        src: ["/images/objects/characters/pink-sheet.png"],
        frames: {width:48, height: 48},
        talking: [
          {
            events: [
              { type: "textMessage", text: "...", faceHero:"pink", talkingNPC:"pink-n", speed:140 },
              { type: "textMessage", text: "Can I help you? (Please leave...)", faceHero:"pink", talkingNPC:"blue-n", speed:30 },
              { type: "textMessage", text: "Welcome!", faceHero:"pink", talkingNPC:"yellow-n" },
            ]
          }
        ],
        behaviorLoop: [
          { type: "stand",  direction: "Up", time: 800 },
          { type: "stand",  direction: "Right", time: 1200 },
          { type: "stand",  direction: "Up", time: 300 },
        ],
      }),
      yellow: new Person({
        // isPlayerControlled: true,
        x: utils.withGrid(49),
        y: utils.withGrid(6),
        src: ["/images/objects/characters/pink-sheet.png"],
        frames: {width:48, height: 48},
        behaviorLoop: [
          { type: "walk",  direction: "Right"},
          { type: "walk",  direction: "Right"},
          { type: "walk",  direction: "Right"},
          { type: "walk",  direction: "Right"},
          { type: "walk",  direction: "Right"},
          { type: "walk",  direction: "Right"},
          { type: "stand",  direction: "Up", time: 800 },
          { type: "stand",  direction: "Right", time: 1200 },
          { type: "stand",  direction: "Up", time: 300 },
          { type: "walk",  direction: "Left"},
          { type: "walk",  direction: "Left"},
          { type: "walk",  direction: "Left"},
          { type: "walk",  direction: "Left"},
          { type: "walk",  direction: "Left"},
          { type: "walk",  direction: "Left"},
        ],
      }),
    },
    walls: {
      // [utils.asGridCoord(20.5,36)] : true,
      // [utils.asGridCoord(8,6)] : true,
      // [utils.asGridCoord(7,7)] : true,
      // [utils.asGridCoord(8,7)] : true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(40,40)]: [
        {
          events: [
            { who: "hero", type: "walk", direction: "Down"},
            { who: "hero", type: "walk", direction: "Down"},
            { who: "hero", type: "stand", direction: "Left", time: 500}
          ]
        }
      ]
    }
  }
}
