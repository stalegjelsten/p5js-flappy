let santa, santa2, santa3
let bg
let bird
let pipes = []
let stars = []
let gameStarted = false
const g = 0.3
const upwardForce = 1.2
const minGap = 120
const framesBetweenPipes = 50
let gameFrames = 0
let spr
let highestScore = 0


function preload() {
  santa2 = loadImage("assets/flappy-santa-2.png")
  santa3 = loadImage("assets/flappy-santa-3.png")
  bg = loadImage("assets/bg_night.png")
  myFont = loadFont("assets/RampartOne-Regular.ttf")
}

class Bird {
  constructor() {
    this.x = 50
    this.y = height / 2
    this.sprite = santa2
    this.v = 0
    this.alive = true
    this.score = 0
    this.r = 17
  }

  checkDead() {
    if (pipes[0].x < this.x + this.r && pipes[0].x + pipes[0].w > this.x - this.r) {
      if (pipes[0].y > this.y - this.r || pipes[0].y + pipes[0].gap < this.y + this.r) {
        this.alive = false
      }
    } else if (this.y + this.r > height - 40) {
      this.alive = false
    }
  }

  display() {
    if (gameFrames % 8 == 0) {
      this.sprite = (this.sprite == santa2) ? santa3 : santa2
    }

    push()
    translate(this.x, this.y)
    if (this.v > 5) {
      rotate(HALF_PI / 1.5)
    } else if (this.v > 0) {
      rotate(HALF_PI / 3)
    } else if (this.v < -0.4) {
      rotate(-HALF_PI / 3)
    }
    image(this.sprite, 0, 0)
    pop()
  }

  update() {
    this.y = this.y + this.v
    if (this.y < 0 + this.r) {
      this.y = this.r
      this.v = 0
    }

    this.v = this.v + g
  }

  displayScore() {
    push()
    textAlign(CENTER, TOP)
    strokeWeight(1)
    textSize(32)
    fill(255)
    stroke(255)
    this.score = max(Math.floor(gameFrames / (framesBetweenPipes + pipes[0].w) - 0.25), 0)
    text(this.score, width / 2, 10)
    pop()
  }
}

class Pipe {
  constructor() {
    this.gap = random(minGap, minGap * 1.5)
    this.y = random(minGap / 2, height - minGap * 2 - 100)
    this.x = width
    this.w = 80
    this.stars = []
  }

  updateCoords() {
  }

  display() {

    // main pipe
    push()
    stroke(0)
    strokeWeight(2)
    fill(115, 190, 46)
    rect(this.x, 0, this.w, this.y)
    rect(this.x, this.y + this.gap, this.w, height - this.y - this.gap - 40)

    // highlights
    push()
    stroke(155, 190, 28)
    strokeWeight(7)

    line(this.x + 8, 0, this.x + 8, this.y - 4)
    line(this.x + 8, this.y + this.gap + 4, this.x + 8, height - 44)

    strokeWeight(4)
    stroke(176, 208, 133)
    line(this.x + 3, 0, this.x + 5, this.y - 4)
    line(this.x + 3, this.y + this.gap + 4, this.x + 5, height - 44)

    stroke(58, 110, 41)
    strokeWeight(5)
    line(this.x + this.w - 4, 0, this.x + this.w - 4, this.y - 4)
    line(this.x + this.w - 4, this.y + this.gap + 4, this.x + this.w - 4, height - 43)
    stroke(99, 161, 50)
    line(this.x + this.w - 8, 0, this.x + this.w - 8, this.y - 4)
    line(this.x + this.w - 8, this.y + this.gap + 4, this.x + this.w - 8, height - 43)
    pop()

    //pipe ends
    rect(this.x - 4, this.y - 50, this.w + 8, 50)
    rect(this.x - 4, this.y + this.gap, this.w + 8, 50)

    // pipe end highlight
    push()
    strokeWeight(4)
    stroke(176, 208, 133)
    noFill()
    line(this.x + 1, this.y - 47, this.x + 1, this.y - 3)
    line(this.x, this.y - 47, this.x + this.w, this.y - 47)

    line(this.x + 1, this.y + this.gap + 47, this.x + 1, this.y + this.gap + 3)
    line(this.x, this.y + this.gap + 3, this.x + this.w, this.y + this.gap + 3)

    stroke(66, 106, 45)
    line(this.x + 3, this.y + this.gap + 53, this.x + this.w - 3, this.y + this.gap + 53)
    strokeWeight(2)
    line(this.x + 3, this.y - 52, this.x + this.w - 3, this.y - 52)

    pop()






    this.x = this.x - 2
  }



}

// every nth frame add new pipe
// in every frame, shift current pipes one pixel to the left
// if any pip has this.x < 0, delete it


function setup() {
  createCanvas(400, 600);
  imageMode(CENTER)
  frameRate(120)
  textFont(myFont)

  bird = new Bird()
  pipes.push(new Pipe())
  spr = santa2
}

function draw() {
  if (bird.alive == true && gameStarted == true) {
    gameLoop()
  } else if (bird.alive == false && gameStarted == true) {

    background(0)
    stroke(255)
    fill(255)
    textSize(38)

    textAlign(CENTER)
    text("GAME OVER", width / 2, height / 2)
    text("POINTS: " + bird.score, width / 2, height / 2 + 50)
    highestScore = max(bird.score, highestScore)
    text("BEST: " + highestScore, width / 2, height / 2 + 100)
  } else {
    background(0)
    stroke(255)
    fill(255)
    textSize(38)

    textAlign(CENTER)
    text("START", width / 2, height / 2)
    if (frameCount % 8 == 0) {
      spr = (spr == santa2) ? santa3 : santa2
    }
    image(spr, width/2, height/2+50)
  }


  if ((keyIsPressed || mouseIsPressed) && gameStarted == false && bird.alive == true) {
    gameFrames = gameFrames + 1
    gameStarted = true
  } else if ((keyIsPressed || mouseIsPressed) && gameStarted == true && bird.alive == false) {
    restartGame()
  }






}

function gameLoop() {
  background(15);
  drawBackground()
  for (let index = 0; index < pipes.length; index++) {
    const element = pipes[index]
    element.display()
  }

  bird.display()
  bird.displayScore()
  bird.checkDead()
  bird.update()

  if (gameFrames % (framesBetweenPipes + pipes[0].w) == 0) {
    pipes.push(new Pipe())
  }

  if (pipes[0].x + pipes[0].w < 0) {
    pipes.shift()
  }



  if (keyIsPressed || mouseIsPressed) {
    bird.v = bird.v - upwardForce
  }
  gameFrames = gameFrames + 1

}

// function keyPressed() {
//   if (gameStarted == false && keyCode == RIGHT_ARROW) {
//     gameStarted = true
//   } else if (gameStarted == true && bird.alive == false) {
//     restartGame()
//   }
// }


function drawBackground() {

  image(bg, width / 2, height / 2 - 100)

  while (stars.length < 20) {
    stars.push({ x: random(width), y: random(height - 180), c: random(190, 255) })
  }
  for (let i = 0; i < stars.length; i++) {
    const x = stars[i].x
    const y = stars[i].y
    const c = stars[i].c
    push()
    noFill()
    strokeWeight(2)
    stroke(c, c, c - 20)
    line(x - 2, y, x + 2, y)
    line(x, y - 2, x, y + 2)

    pop()
  }

  push()
  noStroke()
  fill(72, 123, 123)
  rect(0, height - 40, width, 40)
  strokeWeight(10)
  noFill()

  pop()


  push()
  noStroke()
  const xoff = (gameFrames * 2) % 60
  for (let i = 0; i < 2 * width + 20; i = i + 10) {
    c = (i % 20 == 0) ? color(67, 85, 106) : color(62, 115, 147)
    fill(c)
    quad(i - 10 - xoff, height - 30, i - xoff, height - 40, i + 10 - xoff, height - 40, i + 10 - xoff, height - 30)
  }

  noFill()
  stroke(0)
  strokeWeight(1)
  line(0, height - 40, width, height - 40)
  stroke(49, 79, 85)
  strokeWeight(4)
  line(0, height - 28, width, height - 28)
  pop()



}

function restartGame() {
  pipes = []
  stars = []
  gameFrames = 1
  setup()
}