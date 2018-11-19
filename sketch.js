//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var ship;
var blocks;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var block1, block, block3, block4, block5, block6, block7, block8, block9, block10, block11;
var shrine1,shrine2,shrine3,shrine4;

function setup() {
  createCanvas(windowWidth, windowHeight);

  bulletImage = loadImage('assets/asteroids_bullet.png');
  shipImage = loadImage('assets/asteroids_ship0001.png');
  particleImage = loadImage('assets/asteroids_particle.png');

  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 600;
  ship.friction = 0.98;
  ship.setCollider('circle', 0, 0, 20);

block1 = createSprite(0, windowHeight/5, 200, 50);
block2 = createSprite(200, 2 * windowHeight/5, 80, 80);
block3 = createSprite(0, 3 * windowHeight/5, 200, 50);
//bottom wall blocks
block4 = createSprite((windowWidth/5), windowHeight - 200, 50, 100);
block5 = createSprite(2*(windowWidth/5), windowHeight - 200, 50, 200);
block6 = createSprite(3*(windowWidth/5), windowHeight - 200, 50, 200);
//right wall blocks
block7 = createSprite(windowWidth-100, 4*(windowHeight)/5, 100, 50);
block8 = createSprite(windowWidth-300, 3*(windowHeight)/5, 100, 90);
block9 = createSprite(windowWidth-200, 2*(windowHeight)/5, 200, 50);
//top wall blocks
block10 = createSprite(windowWidth/3, 80, 250, 50);
block11 = createSprite(windowWidth-300, 0, 50, 100);

//centre shrine
shrine1 = createSprite((windowWidth/2)+100, (windowHeight/2)+50, 120, 20);
shrine2 = createSprite((windowWidth/2)+100, (windowHeight/2)-50, 120, 20);
shrine3 = createSprite((windowWidth/2)+30, (windowHeight/2), 20, 120);
shrine4 = createSprite((windowWidth/2)+150, (windowHeight/2), 20, 120);

  ship.addImage('normal', shipImage);
  ship.addAnimation('thrust', 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');

  asteroids = new Group();
  bullets = new Group();
  blocks = new Group();

  for(var i = 0; i<8; i++) {
    var ang = random(360);
    var px = width/2 + 1000 * cos(radians(ang));
    var py = height/2+ 1000 * sin(radians(ang));
    createAsteroid(3, px, py);
  }
}

function draw() {
  background(0);

  fill(255);
  textAlign(CENTER);
  text('Controls: Arrow Keys + X', width/2, 20);

  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  asteroids.overlap(bullets, asteroidHit);
  ship.bounce(asteroids);
  //ship and block collisions
  ship.collide(block1);
  ship.collide(block2);
  ship.collide(block3);
  ship.collide(block4);
  ship.collide(block5);
  ship.collide(block6);
  ship.collide(block7);
  ship.collide(block8);
  ship.collide(block9);
  ship.collide(block10);
  ship.collide(block11);
  //asteroid and block bouncing
  asteroids.bounce(block1);
  asteroids.bounce(block2);
  asteroids.bounce(block3);
  asteroids.bounce(block4);
  asteroids.bounce(block5);
  asteroids.bounce(block6);
  asteroids.bounce(block7);
  asteroids.bounce(block8);
  asteroids.bounce(block9);
  asteroids.bounce(block10);
  asteroids.bounce(block11);
  //ship and shrine collision
  ship.collide(shrine1);
  ship.collide(shrine2);
  ship.collide(shrine3);
  ship.collide(shrine4);
asteroids.collide(shrine1);
asteroids.collide(shrine2);
asteroids.collide(shrine3);
asteroids.collide(shrine4);


  if(keyDown(LEFT_ARROW))
    ship.rotation -= 4;
  if(keyDown(RIGHT_ARROW))
    ship.rotation += 4;
  if(keyDown(UP_ARROW))
  {
    ship.addSpeed(200, ship.rotation);
    ship.changeAnimation('thrust');
  }
  else
    ship.changeAnimation('normal');

  if(keyWentDown('x'))
  {
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(30, ship.rotation);
    bullet.life = 30;
    bullets.add(bullet);
  }

  drawSprites();

}

function createAsteroid(type, x, y) {
  var a = createSprite(x, y);
  var img = loadImage('assets/asteroid'+floor(random(0, 3))+'.png');
  a.addImage(img);
  a.setSpeed(2.5-(type/2), random(360));
  a.rotationSpeed = 0.5;
  //a.debug = true;
  a.type = type;

  if(type == 2)
    a.scale = 0.6;
  if(type == 1)
    a.scale = 0.3;

  a.mass = 2+a.scale;
  a.setCollider('circle', 0, 0, 50);
  asteroids.add(a);
  return a;
}

function asteroidHit(asteroid, bullet) {
  var newType = asteroid.type-1;

  if(newType>0) {
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
    createAsteroid(newType, asteroid.position.x, asteroid.position.y);
  }

  for(var i=0; i<10; i++) {
    var p = createSprite(bullet.position.x, bullet.position.y);
    p.addImage(particleImage);
    p.setSpeed(random(3, 5), random(360));
    p.friction = 0.95;
    p.life = 15;
  }

  bullet.remove();
  asteroid.remove();
}
