//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var ship;
var blocks;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);

  bulletImage = loadImage('assets/asteroids_bullet.png');
  shipImage = loadImage('assets/asteroids_ship0001.png');
  particleImage = loadImage('assets/asteroids_particle.png');

  ship = createSprite(width/2, height/2);
  ship.maxSpeed = 600;
  ship.friction = 0.98;
  ship.setCollider('circle', 0, 0, 20);
  
  blocks = createSprite(0, windowHeight/5, 200, 50);

  ship.addImage('normal', shipImage);
  ship.addAnimation('thrust', 'assets/asteroids_ship0002.png', 'assets/asteroids_ship0007.png');

  asteroids = new Group();
  bullets = new Group();

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


//left wall blocks
rect(0, windowHeight/5, 200, 50);
rect(200, 2 * windowHeight/5, 80, 80);
rect(0, 3 * windowHeight/5, 200, 50);
//bottom wall blocks
rect((windowWidth/5), windowHeight - 200, 50, 100);
rect(2*(windowWidth/5), windowHeight - 200, 50, 200);
rect(3*(windowWidth/5), windowHeight - 200, 50, 200);
//right wall blocks
rect(windowWidth-100, 4*(windowHeight)/5, 100, 50);
rect(windowWidth-300, 3*(windowHeight)/5, 100, 90);
rect(windowWidth-200, 2*(windowHeight)/5, 200, 50);
//top wall blocks
rect(windowWidth/3, 80, 250, 50);
rect(windowWidth-300, 0, 50, 100);
//centre shrine



  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  asteroids.overlap(bullets, asteroidHit);

  ship.bounce(asteroids);
  ship.collide(blocks);
  asteroids.collide(blocks);

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
