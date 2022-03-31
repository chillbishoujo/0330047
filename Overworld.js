class Overworld {
  constructor(config) {
    this.stage = new createjs.StageGL("gameCanvas");

    this.map = null;
  }

  updateStage(event) {

    this.stage.removeAllChildren();

    const cameraPerson = this.map.gameObjects.hero;

    Object.values(this.map.gameObjects).forEach(object => {
      object.update({
        arrow: this.directionInput.direction,
        running: this.directionInput.running,
        map: this.map,
      });
    })

    this.map.drawLowerImage(this.stage, cameraPerson);

    Object.values(this.map.gameObjects).sort((a,b) => {
      return a.y - b.y;
    }).forEach(object => {
      object.updateObject(this.stage, cameraPerson);
    })

    this.map.drawUpperImage(this.stage, cameraPerson);

    this.stage.update(event);
    // console.log(this.stage);
  }

  bindActionInput() {
    new KeyPressListener("KeyZ", () => {
      console.log("Z");
      this.map.checkForActionCutscene();
    })
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        this.map.checkForFootstepCutscene();
      }
    })
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    // console.log(this);
    this.map.mountObjects(this.stage);
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    // createjs.Ticker.addEventListener("tick", this.stage);
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.on("tick", this.updateStage, this);
    createjs.Ticker.framerate = 60;

    this.map.startCutscene([
      {type: "changeMap", map: "DemoRoom"},
      // {type: "textMessage", text: "This is a cool sample message! POGGIES!"},
    ])
  }
}
