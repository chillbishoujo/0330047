class TextMessage {
  constructor({ text, talkingNPC, speed, onComplete }) {
    this.text = text;
    this.talkingNPC = talkingNPC;
    this.onComplete = onComplete;
    this.speed = speed;
    this.element = null;
    this.talkingSprite = null;
    this.mc = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("TextMessage");

    this.element.innerHTML = (`
      <p class="TextMessage_p"></p>
      `);

    this.mc = document.createElement("div");
    this.mc.classList.add("talkingMC");
    this.mc.innerHTML = (`
      <img src="/images/talking/p-6.png"></img>
      `);

    if (this.talkingNPC) {
      this.talkingSprite = document.createElement("div");
      this.talkingSprite.classList.add("talkingNPC");
      this.talkingSprite.innerHTML = (`
        <img src="/images/talking/${this.talkingNPC}.png"></img>
        `);
    }

    this.revealingText = new RevealingText({
      element: this.element.querySelector(".TextMessage_p"),
      text: this.text,
      speed: this.speed,
    })

    // this.element.querySelector("button").addEventListener("click", () => {
    //   this.done();
    // });

    this.actionListener = new KeyPressListener("KeyZ", () => {
      this.done();
    });
  }

  done() {
    if (this.revealingText.isDone) {
      this.element.remove();
      this.talkingSprite.remove();
      this.mc.remove();
      this.actionListener.unbind();
      this.onComplete();
    } else {
      this.revealingText.warpToDone();
    }
  }

  init(container, wrapper) {
    this.createElement();
    container.appendChild(this.element);
    wrapper.appendChild(this.mc);
    if(this.talkingSprite) {wrapper.appendChild(this.talkingSprite)}
    this.revealingText.init();
  }

}
