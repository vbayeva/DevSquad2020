
let mainScene;
let amountOfLanes = 4;
let startingLane = 2;
let laneOffset;
let windowWidth;
let windowHeight;
let deltaTime;

class GameScene extends Phaser.Scene {
    constructor() {
        super({key:"GameScene"});
    }

    preload() {
        this.load.audio('hit','Assets/Sounds/hit.mp3');
        this.load.audio('drink','Assets/Sounds/drink.mp3');
        this.load.audio('gameover','Assets/Sounds/gameover.mp3');
        this.load.audio('attack','Assets/Sounds/attack.mp3');
        this.load.audio('enemyDeath','Assets/Sounds/enemyDeath.mp3');
        this.load.audio('teleport','Assets/Sounds/teleport.mp3');

        //attack
        this.load.atlas('attack', 'Assets/attack.png', 'Assets/attack.json');

        this.load.atlas('collectible', 'Assets/collectible.png', 'Assets/collectible.json');
        this.load.atlas('transition', 'Assets/General/transition.png', 'Assets/General/transition.json');
        this.load.image('ground', 'Assets/General/ground.png');
        this.load.atlas('energy', 'Assets/General/tmp.png', 'Assets/General/tmp.json');
        this.playerImg = this.load.image('player', 'Assets/player.png');
        this.load.image('portal', 'Assets/portal.png');

        //winter
        this.load.image('1_background', 'Assets/Winter/background.png');
        this.load.image('1_obstacle1', 'Assets/Winter/obstacle1.png');
        this.load.image('1_obstacle2', 'Assets/Winter/obstacle2.png');
        this.load.image('1_obstacle3', 'Assets/Winter/obstacle3.png');
        this.load.image('1_enemy', 'Assets/Winter/enemy.png');

        //grass
        this.load.image('2_background', 'Assets/Grass/background.png');
        this.load.image('2_obstacle1', 'Assets/Grass/obstacle1.png');
        this.load.image('2_obstacle2', 'Assets/Grass/obstacle2.png');
        this.load.image('2_obstacle3', 'Assets/Grass/obstacle3.png');
        this.load.image('2_enemy', 'Assets/Grass/enemy.png');

        //lava
        this.load.image('3_background', 'Assets/Lava/background.png');
        this.load.image('3_obstacle1', 'Assets/Lava/obstacle1.png');
        this.load.image('3_obstacle2', 'Assets/Lava/obstacle2.png');
        this.load.image('3_obstacle3', 'Assets/Lava/obstacle3.png');
        this.load.image('3_enemy', 'Assets/Lava/enemy.png');

        //space
        this.load.image('4_background', 'Assets/Space/background.png');
        this.load.image('4_obstacle1', 'Assets/Space/obstacle1.png');
        this.load.image('4_obstacle2', 'Assets/Space/obstacle2.png');
        this.load.image('4_obstacle3', 'Assets/Space/obstacle3.png');
        this.load.image('4_enemy', 'Assets/Space/enemy.png');

        //scoreboard
        this.load.image('scoreboard','Assets/General/scoreboard.png');

    }
    create(){
        this.playEntryAnimation = true;
        mainScene = this;
        this.lastTime = 0;

        windowHeight = this.sys.game.config.height;
        windowWidth= this.sys.game.config.width;
        laneOffset = windowWidth/amountOfLanes;

        this.ground = this.physics.add.sprite(0, windowHeight+200, 'ground');
        this.ground.setOrigin(0, 0);
        this.ground.setBounce(0);
        this.ground.setDepth(10);

        CreatePlayer();

        //attackanimation
        this.attack = this.add.sprite(0,0,'attack');
        this.attack.setOrigin(0,0);
        this.attack.setDepth(player.depth-1);
        this.attack.visible = false;

        this.anims.create({
            key: 'attackAnimation',
            frames: this.anims.generateFrameNames('attack', {
                start: 0,
                end: 14,
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true
        });

        CreateBackground();
        this.inputManager();
        CreateScore();
        CreateEnergy();

        //sounds
        this.hit = this.sound.add('hit');
        this.drink = this.sound.add('drink');
        this.gameover = this.sound.add('gameover');
        this.attackSound = this.sound.add('attack');
        this.enemyDeath = this.sound.add('enemyDeath');
        this.enemyDeath.volume = 2;
        this.teleport = this.sound.add('teleport');
    }

    update(time) {
        //place attack sprite in front of the player;
        this.attack.x = player.x - this.attack.width/2;
        this.attack.y = player.y - this.attack.height;

        if(this.playEntryAnimation){
            this.playEntryAnimation=false;
            this.transition = this.add.sprite(windowWidth/2,windowHeight/2,'transition');
            this.transition.setDepth(20);
            this.transition.playReverse('transitionAnimation');
        }

        //calculate DeltaTime
        deltaTime = (time-this.lastTime)/1000;
        this.lastTime = time;

        //MovePlayer();
        MoveBackgroundOverTime();
        IncreaseDifficultyOverTime();
        AddScoreOverTime();
        DecreaseEnergyOverTime();
        HandleSpawning();
        UpdateScore();
        moveQueueForward();

        energySprite.setFrame(GetCurrentFrame());

        if(startNextLevel && !transition.visible){
            startNextLevel = false;
            this.scene.restart();
        }

        if(startGameOver && !transition.visible){
            startGameOver = false;
            this.scene.start("MainMenu")
            this.scene.stop();
        }
    }


    inputManager()
    {
        //while key is pressed
        this.input.keyboard.on('keydown',function(event){
            if(event.key === "p" || event.key == "Escape"){
                GameOver();
            }
            if (event.key == "d" || event.key == "D") {
                MoveRight();

            }

            if(event.key === "a" || event.key == "A"){
                MoveLeft();
            }

            if (event.key == "k" || event.key == "K") {
                if(!this.attack.visible){
                    HitEnemy();
                    this.attackSound.play();
                    this.attack.visible = true;
                    this.attack.play('attackAnimation');
                }
            }

        }, this);

        //when key is unpressed
        this.input.keyboard.on('keyup', function(event) {
            //to make smoother transition check if "a" doesn't pressed
            if ((event.key == "d" || event.key == "D") && playerMoveRight) {
                StopPlayer();
            }

            if ((event.key === "a" || event.key == "A") && !playerMoveRight){
                StopPlayer();
            }
        }, this);
    }
}

