let engine;
let world;
let ball;
let bounceSound;

function preload() {
  bounceSound = loadSound('misc/audio/kick_01.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  engine = Matter.Engine.create();
  world = engine.world;

  let wallOptions = {
    isStatic: true,
    friction: 0.8 // Increase friction to make ball bounce more
  };
  // Create boundaries around the canvas
  let ground = Matter.Bodies.rectangle(width/2, height + 50, width, 100, wallOptions);
  let ceiling = Matter.Bodies.rectangle(width/2, -50, width, 100, wallOptions);
  let leftWall = Matter.Bodies.rectangle(-50, height/2, 100, height, wallOptions);
  let rightWall = Matter.Bodies.rectangle(width + 50, height/2, 100, height, wallOptions);
  // Add boundaries to the world
  Matter.World.add(world, [ground, ceiling, leftWall, rightWall]);

  Matter.Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      if (pair.bodyA === ball || pair.bodyB === ball) {
        bounceSound.play();
        let force = Matter.Vector.create(random(-0.05, 0.05), random(-0.05, 0.05));
        Matter.Body.applyForce(ball, ball.position, force);
      }
    }
  });

  Matter.Runner.run(engine);
}

function draw() {
  background(255);
  fill(0);
  noStroke();
  if (ball) {
    ellipse(ball.position.x, ball.position.y, 40);
  }
}

function mousePressed() {
  let ballOptions = {
    restitution: 1.0,
    friction: 10,
    density: 0.1 // Decrease density to make ball bounce more
  };
  ball = Matter.Bodies.circle(mouseX, mouseY, 20, ballOptions);
  Matter.World.add(world, ball);
  let force = Matter.Vector.create(random(-0.05, 0.05), random(-0.05, 0.05));
  Matter.Body.applyForce(ball, ball.position, force);
}
