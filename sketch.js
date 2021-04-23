var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex,trexImg;
var ground, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart, gameOverImg, restartImg;


function preload(){
  trexImg = loadImage("monster.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("ob1.png");
  obstacle2 = loadImage("ob2.png");
  obstacle3 = loadImage("ob3.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,180,20,50);
  trex.addImage(trexImg);
  trex.scale = 0.2;
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,trex.width, trex.height-115);

  gameOver = createSprite();
  gameOver.addImage(gameOverImg);
  restart = createSprite();
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  ground = createSprite(300,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //ground.velocityX = -(6 + 3*score/100);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(rgb(181, 225, 252));
  
  fill("black");
  textSize(20);
  text("Score: "+ score, camera.position.x+300,camera.position.y-200);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //ground.velocityX = -(6 + 3*score/100);
    camera.position.x = trex.x+250;
    camera.position.y = trex.y;
  
    if(keyDown("space") && trex.y >= 100) {
      trex.velocityY = -15;
    }

    /*if(score > 500){
      background("black");
      fill("white");
      textSize(20);
      text("Score: "+ score, camera.position.x+300,camera.position.y-200);
    }
    
    if(score > 1000){
      background(rgb(181, 225, 252));
      fill("black");
      textSize(20);
      text("Score: "+ score, camera.position.x+300,camera.position.y-200);
    }

    if(score > 1500){
      background("black");
      fill("white");
      textSize(20);
      text("Score: "+ score, camera.position.x+300,camera.position.y-200);
    }

        
    if(score > 2000){
      background(rgb(181, 225, 252));
      fill("black");
      textSize(20);
      text("Score: "+ score, camera.position.x+300,camera.position.y-200);
    }
    

    if(score > 2500){
      background("black");
      fill("white");
      textSize(20);
      text("Score: "+ score, camera.position.x+300,camera.position.y-200);
    }

            
    if(score > 3000){
      background(rgb(181, 225, 252));
      fill("black");
      textSize(20);
      text("Score: "+ score, camera.position.x+300,camera.position.y-200);
    }*/

    trex.velocityX = (6 + 3*score/100);
    trex.velocityY = trex.velocityY + 0.8;
  
    if (trex.x > ground.x){
      ground.x = trex.x + ground.width/2-450;
    }
  
    trex.collide(ground);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex) || score >= 3000){
        gameState = END;
    }
  }
  else if (gameState === END){

    gameOver.x = camera.position.x;
    restart.x = camera.position.x;
    gameOver.y = camera.position.y-100;
    restart.y = camera.position.y-50;

    
    //set velcity of each game object to 0
    trex.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
      /*gameOver.visible = false;
      restart.visible = false;*/
    }
  }
  
  console.log(gameOver);
  console.log(restart);
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x+width,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 700;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x+width,165,10,40);
    //obstacle.debug = true;
    obstacle.setCollider("rectangle", 5,5,200,200);
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.destroy();
  restart.destroy();
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}