let queueCollectible = [];
let queueObstacle = [];
let length;

//FIFI: first in, first out

function deleteObstacle() {
    queueObstacle.shift();
}

function deleteCollectible() {

    queueCollectible.shift();
}

function getLastObstacle() {
    return queueObstacle[queueObstacle.length - 1];
}

function getLastCollectible() {
    return queueCollectible[queueCollectible.length - 1];
}

//add object at the end of the queue
function addQueue(x, type) {
    let element = new gameObject(type, x);
    if (type == 'collectible')
        queueCollectible.push(element);
    else {
        queueObstacle.push(element);
        console.log(queueObstacle[queueObstacle.length - 1].objectType);
    }
}

//move all objects down
function moveQueueForward() {
    for (let i of queueCollectible) {
        i.objectSprite.y += difficulty;
    }
    for (let i of queueObstacle) {
        i.objectSprite.y += difficulty;
    }
}
