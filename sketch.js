var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var ammo;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var zombieGroup;

var hearts = 5;
var bullets = 70;
var score = 0;
var highScore = 0;

var gameState = "fight"


function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  ammo = loadImage("assets/ammo.jpg")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   //player.debug = true
   player.setCollider("rectangle",0,0,300,300)


   //creating sprites to depict lives remaining
   /*heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4*/
   

    //creating groups for zombies and bullets
    bulletGroup = new Group()
    zombieGroup = new Group()
    ammoGroup = new Group()
    heartsGroup = new Group()


}

function draw() {
  background(0); 

 if(gameState === "fight"){

  //moving the player up and down and making the game mobile compatible using touches
 if(keyDown("UP_ARROW")||touches.length>0){
  if(player.y > 130){
    player.y = player.y-30
  }
 }
 if(keyDown("DOWN_ARROW")||touches.length>0){
  if(player.y < 490){
    player.y = player.y+30
  }
 }
 



//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20
  
  bulletGroup.add(bullet)
  player.depth = bullet.depth
  player.depth = player.depth+2
  player.addImage(shooter_shooting)
  bullets = bullets-1
 }

 //player goes back to original standing image once we stop pressing the space bar
 else if(keyWentUp("space")){
  player.addImage(shooterImg)
 }

 //go to gameState "bullet" when player runs out of bullets
 if(bullets==0){
  gameState = "bullet"    
 }

 if(hearts === 0){
   gameState = "lost"
 }

 if(ammoGroup.isTouching(player)){
   bullets = Math.round(random(50, 70));
   ammoGroup.destroyEach();
 }
 

 //destroy the zombie when bullet touches it
 if(zombieGroup.isTouching(bulletGroup)){
   for(var i=0;i<zombieGroup.length;i++){      
     if(zombieGroup[i].isTouching(bulletGroup)){
        zombieGroup[i].destroy()
        bullet.destroy()
        score = score + 1 ;
      } 
  
    }
  }

  if (highScore < score || highScore === score) {
    highScore = score;
  }
 //destroy zombie when player touches it
 if(zombieGroup.isTouching(player)){

   for(var i=0;i<zombieGroup.length;i++){           
   if(zombieGroup[i].isTouching(player)){
     hearts = hearts - 1; 
     zombieGroup[i].destroy(); 
      } 
 
  }
 }

 //calling the function to spawn zombie
 enemy();
 ammunition()

}

drawSprites();

//destroy zombie and player and display a message in gameState "lost"
if(gameState == "lost"){
  
  textSize(50)
  fill("red")
  text("You ran out of lives! You killed " + score + " zombies!" ,200,410)
  text("Press 'R' to slay more zombies!", 270, 480);
  zombieGroup.destroyEach();
  player.visible = false;
  if(keyDown("r")){
    reset()
  }

}

//destroy zombie and player and display a message in gameState "won"
else if(gameState == "won"){
 
  textSize(100)
  fill("yellow")
  text("You Won ",400,400)
  zombieGroup.destroyEach();
  player.destroy();

}

//destroy zombie, player and bullets and display a message in gameState "bullet"
else if(gameState == "bullet"){
 
  textSize(50)
  fill("yellow")
  text("You ran out of bullets!!! You killed " + score + " zombies!",250,410)
  text("Press 'R' to slay more zombies!", 270, 480);
  zombieGroup.destroyEach();
  //player.destroy();
  player.visible = false;
  bulletGroup.destroyEach();
  if(keyDown("r")){
    reset()
  }

}

textSize(40)
  fill("white")
  text("Kills:" + score, displayWidth - 550, 40);

  textSize(40)
  fill("white")
  text("Hearts:" + hearts, displayWidth - 400, 40);

  textSize(40)
  fill("white")
  text("Bullets:" + bullets, displayWidth - 200, 40);

  textSize(40)
  fill("white")
  text("High Score:" + highScore, displayWidth - 850, 40);



}


//creating function to spawn zombies
function enemy(){
  if(frameCount%50===0){

    //giving random x and y positions for zombie to appear
    zombie = createSprite(random(650,1200),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -(3 + score/10)
    //zombie.debug= true
    zombie.setCollider("rectangle",0,0,400,1000);
    
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }

}

function ammunition(){
  if(frameCount%2500===0){

    //giving random x and y positions for zombie to appear
    ammoRefil = createSprite(random(650,1200),random(100,500),40,40)

    ammoRefil.addImage(ammo)
    ammoRefil.scale = 0.085
    ammoRefil.velocityX = -(3 + score/10)
    //ammoRefil.debug= true
    ammoRefil.setCollider("rectangle",0,0,800,800);
    
   
    ammoRefil.lifetime = 400
    ammoGroup.add(ammoRefil)
  }

}

function reset(){
  gameState = "fight";
  //restart.visible = false ;
  //gameOver.visible = false;
  zombieGroup.destroyEach();
  ammoGroup.destroyEach();
  bulletGroup.destroyEach();
  score = 0;
  hearts = 5;
  bullets = 70;
  player.visible = true;

}

