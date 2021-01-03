
let collectiblePreviousX;
let obstaclePreviousX;
//offset
let collectibleDx = 80;
let collectibleAmount = 0;

let obstacleAmount = 0;

let isEnemy = false;

//#TODO
let widthOffset = 110; //3 * player width
let collectibleHeight = 91;
let collectibleWidth = 50;
let obstacleHeight = 100;
let obstacleWidth = 115;

//timer to spawn obstacles
let spawnTimer = 0;
let spawnEnemyTimer = 0;


function HandleSpawning() {

    if (portalSpawned) return;

    if (cont && obstacleAmount >= 4) {
        cont = false;
        obstacleAmount -= 4;
    }


    spawnTimer += deltaTime;
    if (!isEnemy) spawnEnemyTimer += deltaTime;

    //if it's first call
    if (collectibleAmount === 0) {
        collectiblePreviousX = Phaser.Math.Between(collectibleWidth, windowWidth - collectibleWidth);
        SpawnCollectible();
    }
    else {
        //#TODO: collectible * x?
        if (getLastCollectible().objectSprite.y >= collectibleHeight * 1.4) {
            SpawnCollectible();
        }
    }

    //so amount of obstacles won't be greater than maximum
    //and they won't be spawned all by one time
    if ((obstacleAmount < currentMaxObstacleAmount && spawnTimer >= spawnTimerIncrease)
        || (obstacleAmount < minObstacleAmount && spawnTimer >= minSpawnTimer)) {
        SpawnObstacle();
    }

    if (spawnEnemyTimer >= spawnEnemyTimerIncrease && isEnemy == false) {
        SpawnEnemy();
        spawnEnemyTimer = 0;
    }
}

function SpawnEnemy() {
    let x = SelectX();
    addQueue(x, 'enemy');
    isEnemy = true;
    obstaclePreviousX = x;
}

function SpawnObstacle() {

    //to make sure than new obstacle won't collide with
    //other objects
    let x = SelectX();
    if (x == -1) return;

    addQueue(x, 'obstacle');
    obstaclePreviousX = x;
    obstacleAmount++;

   // console.log(obstacleAmount + " " + queueObstacle.length);
}

function SelectX() {
    let x;
    let counter = 0;
    do {
        x = Phaser.Math.Between(obstacleWidth, windowWidth - obstacleWidth);
        counter++;
        if (counter >= 20) return -1;
    }
    while ((obstacleAmount > 0 && isTooClose(x, getLastObstacle().objectSprite.x) &&
        getLastObstacle().objectSprite.y <= obstacleHeight) ||
    (collectibleAmount > 0 && isTooClose(x, getLastCollectible().objectSprite.x)
        && getLastCollectible().objectSprite.y <= collectibleHeight / 2));
    spawnTimer = 0;
    return x;
}

function isTooClose(x1, x2) {
    return Math.abs(x1 - x2) < (widthOffset);
}

function SpawnCollectible() {
    //generate the new index: right, the same, left
    let x;

    let counter = 0;
    //if new index is suitable
    do {
        counter++;
        x =  Phaser.Math.Between(-3, 2) * collectibleDx + collectiblePreviousX;
        x = Math.max(Math.min(x, windowWidth - widthOffset), widthOffset);
        if (counter >= 20) return;
    }
    while (/*x >= windowWidth - widthOffset || x < widthOffset / 2 ||*/
        (obstacleAmount > 0 && isTooClose(x, getLastObstacle().objectSprite.x)
            && getLastObstacle().objectSprite.y < obstacleHeight / 2));

    //update x position
    collectiblePreviousX = x;

    //make gameobject and add it to queue
    collectibleAmount++;
    addQueue(collectiblePreviousX, 'collectible');
}