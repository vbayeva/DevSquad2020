let score = 0;
let scoreTimer = 0;

let scoreboard;
let scoreText;

function CreateScore() {
    scoreboard = mainScene.add.sprite(0,0,'scoreboard');
    scoreboard.setDepth(4);
    scoreboard.setScale(1.5);
    scoreboard.setOrigin(0,0);
    scoreText = mainScene.add.text(400,32,score.toString(),{ fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    scoreText.setDepth(5);
}

function AddScoreOverTime()
{
    scoreTimer += deltaTime;

    if(scoreTimer > scoreIncreaseTime){
        scoreTimer=0;
        score += 1;
    }
}

function UpdateScore(){
    scoreText.text = score.toString();
}