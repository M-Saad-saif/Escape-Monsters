let canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

let scoreBrd = document.querySelector("#score");
let presentationUI = document.querySelector("#presentationUI");
let newGameBTN = document.querySelector("#startBTN");
let UIcontainer = document.querySelector(".container");
let input = document.querySelector(".difficulty");
let inputMobile = document.querySelector("#inputmobile");
let validation = document.querySelector("#validation");
let highscoredisplay = document.querySelector("#highscore");

presentationUI.addEventListener("click", () => {
  presentationUI.style.display = "none";
});

canvas.width = innerWidth;
canvas.height = innerHeight;
let scoreInterval;
let gameoverTimeout;
let score = 0;
let highscore = [];

let mouse = {
  x: innerWidth,
  y: innerHeight,
};

addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

//   addEventListener("touchmove", (e) => {
//   e.preventDefault();
//   if (e.touches.length > 0) {
//     mouse.x = e.touches[0].clientX;
//     mouse.y = e.touches[0].clientY-45;
//   }
// }, { passive: false });

addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY - 45;
    }
  },
  { passive: false }
);

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

let enemyimg = new Image();
enemyimg.src = "image2.png";

let enemyimg1 = new Image();
enemyimg1.src = "image3.png";

// creating enemies
class Enemy {
  constructor(x, y, velocityX, velocityY, radius, image) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.radius = radius;

    this.image = image;
  }

  draw() {
    c.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }

  update() {
    // staying balls in the screen
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.velocityX = -this.velocityX;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.velocityY = -this.velocityY;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
    this.draw();
  }
}

// creating player
class Player {
  constructor() {
    this.radius = 20;
    let playerimg = new Image();
    playerimg.src = "player1.png";
    this.image = playerimg;
  }

  draw() {
    c.beginPath();
    c.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    c.fillStyle = "black";
    c.fill();
    c.stroke();
  }
  update() {
    this.draw();
    this.x = mouse.x + 2;
    this.y = mouse.y + 5;
  }
}

// calling player
let player = new Player();

let enemies = [];
// making random enemies
function init(userinput, mobileUSeer) {
  enemies = [];

  if (window.innerWidth <= 600 && window.innerWidth >= 315) {
    // for mobiles
    for (let i = 0; i < mobileUSeer; i++) {
      let radius = Math.floor(Math.random() * 19 + 20);
      let x = Math.random() * (canvas.width - radius * 2) + radius;
      let y = Math.random() * (canvas.height - radius * 2) + radius;

      let velocityX = (Math.random() - 0.7) * 7;
      let velocityY = (Math.random() - 0.7) * 7;
      let image = Math.random() < 0.5 ? enemyimg1 : enemyimg;

      enemies.push(new Enemy(x, y, velocityX, velocityY, radius, image));
    }
  } else {
    // for pcs laptops
    for (let i = 0; i < userinput; i++) {
      let radius = Math.floor(Math.random() * 30 + 15);
      let x = Math.random() * (canvas.width - radius * 2) + radius;
      let y = Math.random() * (canvas.height - radius * 2) + radius;

      let velocityX = (Math.random() - 0.7) * 10;
      let velocityY = (Math.random() - 0.7) * 10;
      let image = Math.random() < 0.5 ? enemyimg1 : enemyimg;

      enemies.push(new Enemy(x, y, velocityX, velocityY, radius, image));
    }
  }
}

let bg = new Image();
bg.src =
  "https://static.vecteezy.com/system/resources/thumbnails/053/627/212/small_2x/a-creepy-monster-with-glowing-eyes-in-the-water-photo.jpg";

let animationId;
function animation() {
  animationId = requestAnimationFrame(animation);
  c.save();
  c.globalAlpha = 0.25;
  c.clearRect(0, 0, innerWidth, innerHeight);
  c.drawImage(bg, 0, 0, canvas.width, canvas.height);
  c.restore();

  //   rendering mouse
  player.update();

  //   rendering enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();

    // checking collision detection
    setTimeout(() => {
      let dx = player.x - enemies[i].x;
      let dy = player.y - enemies[i].y;

      let distance = Math.hypot(dx, dy);

      let bloodimg = new Image();
      bloodimg.src = "blood1.png";

      if (distance < player.radius + enemies[i].radius) {
        cancelAnimationFrame(animationId);
        clearInterval(scoreInterval);

        if(highscore.length === 0 || score > highscore[0]){
          highscore[0]= score
          highscoredisplay.innerHTML = highscore[0]
        }

        c.drawImage(bloodimg, player.x - 56, player.y - 46, 120, 120);
        gameoverTimeout = setTimeout(() => {
          UIcontainer.style.display = "flex";
        }, 900 / 2);
      }
    }, 1500);
  }
}

// start new game
newGameBTN.addEventListener("click", () => {
  let userinput = input.value;
  let mobileUSeer = inputMobile.value;

  // setting validation
  if (window.innerWidth <= 600 && window.innerWidth >= 315) {
    // for mobile
    if (mobileUSeer == "") {
      mobileUSeer = 15;
    }

    if (isNaN(mobileUSeer)) {
      validation.innerHTML = "This is not a number ";

      setTimeout(() => {
        inputMobile.value = "";
      }, 1000);

      return;
    } else if (mobileUSeer <= 0 || mobileUSeer > 25) {
      validation.innerHTML = "Number should between 1-25";
      setTimeout(() => {
        input.value = "";
      }, 1000);
      return;
    }
  } else {
    // for laptops
    if (userinput == "") {
      userinput = 27;
    }

    if (isNaN(userinput)) {
      validation.innerHTML = "This is not a number ";

      setTimeout(() => {
        input.value = "";
      }, 1000);

      return;
    } else if (userinput <= 0 || userinput > 50) {
      validation.innerHTML = "Number should between 1-50";
      setTimeout(() => {
        input.value = "";
      }, 1000);
      return;
    }
  }

  input.value = "";
  inputMobile.value = "";

  UIcontainer.style.display = "none";

  cancelAnimationFrame(animationId);
  clearInterval(scoreInterval);
  clearInterval(gameoverTimeout);

  scoreInterval = setInterval(() => {
    score++;
    scoreBrd.innerHTML = score;
  }, 1000);

  score = 0;
  validation.innerHTML = "";
  init(userinput, mobileUSeer);
  animation();
});

let preferencepara = document.querySelector("#preference");

if (window.innerWidth <= 600 && window.innerWidth >= 315) {
  input.placeholder = "Default 15";
  preferencepara.innerHTML = "Prefered 15";
} else {
  input.placeholder = "Default 27";
  preferencepara.innerHTML = "Prefered 27";
}
