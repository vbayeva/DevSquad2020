let player;

function CreatePlayer(){
    //create player
    player = mainScene.physics.add.sprite(windowWidth/2, windowHeight,'player');
    player.x += player.height + 50;
    //make sure the player is on top
    player.setDepth(3);

    player.setBounce(0.05);
    //player won't go out from the borders
    player.setCollideWorldBounds(true);
}

let velocityIncrease = 4;
let playerMoveRight = false;
let velocity = 300;

function MoveRight(){
    player.angle = 45;
    player.setVelocityX(velocity);
    playerMoveRight = true;
}

function MoveLeft(){
    player.angle = -45;
    player.setVelocityX(-velocity);
    playerMoveRight = false;
}

function StopPlayer() {
    player.angle = 0;
    player.setVelocity(0);
    playerMoveRight = false;
}