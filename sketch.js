// server variables  *********

var dataServer;
var pubKey = 'pub-c-74eac257-c02f-445c-8878-1855324ab89f';
var subKey = 'sub-c-1a87f2fc-eb7f-11e8-ab71-96aca38ebf32';

//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot

var bullets;
var asteroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var block1;
var block2;
var block3;
var block4;
var block5;
var block6;
var block7;
var block8;
var block9;
var block10;
var block11;

//name used to sort your messages. used like a radio station. can be called anything *********
var channelName = "shooting";

function setup() {
  createCanvas(windowWidth, windowHeight);

    // initialize pubnub  *********
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
    
    //attach callbacks to the pubnub object to handle messages and connections *********
  dataServer.addListener({ message: readIncoming, presence: whoisconnected })
  dataServer.subscribe({channels: [channelName]});
    
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

  for(var i=0; i<allSprites.length; i++) {
    var s = allSprites[i];
    if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
    if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
    if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
    if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  }

  asteroids.overlap(bullets, asteroidHit);
  ship.bounce(asteroids);
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
  asteroids.collide(block1);
  asteroids.collide(block2);
  asteroids.collide(block3);
  asteroids.collide(block4);
  asteroids.collide(block5);
  asteroids.collide(block6);
  asteroids.collide(block7);
  asteroids.collide(block8);
  asteroids.collide(block9);
  asteroids.collide(block10);
  asteroids.collide(block11);


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

function sendTheMessage() {
 

// Send Data to the server to draw it in all other canvases *********
dataServer.publish(
    {
      channel: channelName,
      message: 
      {
       who: ship.value(), //get the value from the ships and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {
    text(inMessage.message.who);
  }
}

function whoisconnected(connectionInfo)
{

}
