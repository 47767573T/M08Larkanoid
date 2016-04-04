/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private fireball:Phaser.Sprite;
    private bricks:Phaser.Group;
    //private brick:Phaser.Sprite;
    private pad:Phaser.Sprite;
    private ball:Phaser.Sprite;
    private scoreLives:Phaser.Text;
    private endText:Phaser.Text;

    //var de items
    private bricksRow = 5;
    private bricksCol = 10;

    //var de movimiento
    private BALL_MAX_SPEED = 400;
    private BALL_MIN_SPEED = 200;
    private BALL_ACCELERATION = 20;
    private PAD_MAX_SPEED = 500;
    private PAD_LIVES = 3;
    private BRICK_LIVES = 3;

    private FB_MAX_SPEED = 200;
    private FB_FRICTION = 150;
    private FB_ACCELERATION = 180;

    //Var de Texts
    private FINAL_TEXT = "GAME OVER\n -click to restart-";


    //Var animacion
    private fireballFrameWitdh = 3072/6;
    private fireballFrameRate = 200;


    private cursor:Phaser.CursorKeys;

    preload():void {
        super.preload();
        this.load.spritesheet('fireball'
            ,'assets/flameShotSet.png'
            ,this.fireballFrameWitdh
            ,512
            ,6);

        this.load.image('brick1', 'assets/png/element_blue_rectangle.png');
        this.load.image('brick2', 'assets/png/element_green_rectangle.png');
        this.load.image('brick3', 'assets/png/element_red_rectangle.png');
        this.load.image('pad', 'assets/png/paddleBlu.png');
        this.load.image('ball', 'assets/png/ballBlue.png');
        this.load.image('bg', 'assets/bgSpace.png');

        this.physics.startSystem(Phaser.Physics.ARCADE);
    }

    create():void {
        super.create();
        this.createBackground();

        this.createBall();
        this.createPad();
        //this.createFireball();

        this.createBricks(this.bricksRow, this.bricksCol);
        this.createTexts();

        this.cursor = this.input.keyboard.createCursorKeys();
        this.physics.arcade.checkCollision.down = false;
    }

    private createBackground(){
        var bg;
        bg = this.add.sprite(0, 0, 'bg');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    }

    private createBall(){

        this.ball = this.add.sprite(this.world.centerX, this.world.centerY, 'ball');
        this.ball.scale.setTo(0.5, 0.5);
        this.physics.enable(this.ball);

        this.ball.body.bounce.setTo(1.2);
        this.ball.body.maxVelocity.setTo(this.BALL_MAX_SPEED, this.BALL_MAX_SPEED);
        this.ball.body.collideWorldBounds = true;

        this.ball.checkWorldBounds = true;
        this.ball.events.onOutOfBounds.add(this.ballOut, this);

        this.ball.body.velocity.x= this.rnd.sign() * 50;
        this.ball.body.velocity.y= this.BALL_MIN_SPEED;

    }

    private createPad(){

        this.pad = this.add.sprite(this.world.centerX,440, 'pad');

        this.pad.scale.setTo(0.9, 0.6);
        this.pad.anchor.setTo(0.5, 0.5);
        this.physics.enable(this.pad);

        this.pad.body.bounce.set(1.2);
        this.pad.body.collideWorldBounds = true;
        this.pad.body.immovable = true;
        this.pad.health = this.PAD_LIVES;
    }

    private createBricks(row, col){
        this.bricks = this.add.group();
        this.bricks.enableBody = true;
        this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

        for (var j = 0; j < row; j++){
            for(var i = 0; i < col; i++){
                var brick = new Brick (this.game, i*50+30, j*20+30, 'brick1');
                //this.game.add.tween(brick).to({y: 240}, 2400, Phaser.Easing.Bounce.Out, true, 1000 + 400 * i, false);
                brick.scale.setTo(0.5, 0.5);
                brick.health = this.BRICK_LIVES;
                this.bricks.add(brick);
            }
        }
    }

    private createTexts() {

        this.scoreLives = this.add.text(this.pad.x, this.pad.y
            , "- "+this.pad.health+" -"
            , {font: "10px Arial", fill: "#086A87"}
        );

        this.scoreLives.anchor.setTo(0.5, 0.4);


        //Crea el titulo final que se mostrará cuando perdamos el juego
        this.endText = this.add.text(this.world.centerX, this.world.centerY
            , this.FINAL_TEXT
            , {font: "45px Arial", fill: "#81F781", align: "center"}
        );
        this.endText.anchor.setTo(0.5, 0.4);
        this.endText.visible = false;
    };

/*    private createFireball(){
        var anim;

        this.fireball = this.add.sprite(this.world.centerX, this.world.centerY, 'fireball');
        this.fireball.scale.setTo(0.15, 0.15);
        this.fireball.anchor.setTo(0.5, 0.5);

        //variables Animacion
        anim = this.fireball.animations.add('run');
        anim.play(15, true);

        //variables de movimiento
        this.physics.enable(this.fireball);
        this.fireball.body.collideWorldBounds = true;       //Colision
        this.fireball.body.bounce.setTo(0.8);               //Rebote
        this.fireball.body.maxVelocity.setTo(this.FB_MAX_SPEED, this.FB_MAX_SPEED);
        this.fireball.body.drag.setTo(this.FB_FRICTION, this.FB_FRICTION);

        this.fireball.rotation = this.physics.arcade.angleToPointer(this.fireball)

    }
*/

    update():void {
        super.update();

        this.padMove();
        this.ballMove();
        this.updateTexts();

        this.physics.arcade.collide(this.ball, this.pad, this.ballHitPad, null, this);
        this.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);

        //this.fireballMove();
        //this.fireball.rotation = this.physics.arcade.angleToPointer(this.pad)
    }

    private padMove(){
        if (this.cursor.left.isDown) {
            this.pad.body.velocity.x = -this.PAD_MAX_SPEED;
        }else if (this.cursor.right.isDown) {
            this.pad.body.velocity.x =this.PAD_MAX_SPEED;
        } else {
            this.pad.body.velocity.x = 0;
        }


    }

    private ballMove(){
        this.physics.enable(this.ball);
        this.ball.body.collideWorldBounds = true;


    }

/*  private fireballMove(){

        if (this.cursor.left.isDown) {
            this.fireball.body.acceleration.x =-this.FB_ACCELERATION;

        } else if (this.cursor.right.isDown) {
            this.fireball.body.acceleration.x =this.FB_ACCELERATION;

        } else if (this.cursor.up.isDown) {
            this.fireball.body.acceleration.y =-this.FB_ACCELERATION;

        } else if (this.cursor.down.isDown) {
            this.fireball.body.acceleration.y =this.FB_ACCELERATION;
        } else {if (this.pad.health = 1)
            this.fireball.body.acceleration.y =0;
            this.fireball.body.acceleration.x =0;
        }
    }
*/
    private ballHitPad(ball:Phaser.Sprite, pad:Phaser.Sprite){

        if (ball.body.velocity.y != this.BALL_MIN_SPEED){
            this.ball.body.velocity.y = -this.BALL_MIN_SPEED;

            var hitValue = this.ball.x - this.pad.x;

            if (hitValue >= 0){
                this.ball.body.velocity.x = this.BALL_MIN_SPEED;
            } else {
                this.ball.body.velocity.x = -this.BALL_MIN_SPEED;
            }
            /*if (this.ball.body.velocity.x < 0) {
                this.ball.body.velocity.x = this.BALL_MIN_SPEED;
            }
            else if (this.ball.body.velocity.x > 0) {
                this.ball.body.velocity.x = -this.BALL_MIN_SPEED;
            }*/


        }
    }

    private ballHitBrick (ball:Phaser.Sprite, brick:Phaser.Sprite){

        brick.damage(1);
        if (brick.health == 2) brick.loadTexture('brick2');
        else if (brick.health == 1) brick.loadTexture('brick3');

        if (ball.body.velocity.x != this.BALL_MAX_SPEED){
            this.ball.body.velocity.y += this.BALL_ACCELERATION;
            this.ball.body.velocity.x += this.BALL_ACCELERATION;
        }
    }

    private updateTexts(){
        this.scoreLives.x = this.pad.x;
        this.scoreLives.y = this.pad.y;

        this.scoreLives.text = "- "+this.pad.health+" -";
    }

    /**
     * Definir comportamiento cuando la bola sale fuera
     */
    private ballOut(){
        if (this.pad.health <= 1){
            this.endText.visible = true;
            this.scoreLives.visible = false;

            //the "click to restart" handler
            this.input.onTap.addOnce(this.restart, this);


        } else {
            this.ball.x = this.world.centerX;
            this.ball.y = this.world.centerY;

            this.ball.body.velocity.x= this.rnd.sign() * 50;
            this.ball.body.velocity.y= this.BALL_MIN_SPEED;
        }

        this.pad.damage(1);
    }

    private restart(){
        this.game.state.restart()
    }
}

class SimpleGame {
    game:Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(500, 500, Phaser.AUTO, 'gameDiv');

        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
}

class Brick extends Phaser.Sprite {

    constructor(game:Phaser.Game, x:number, y:number, key:string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture) {
        super(game, x, y, key);

        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);

        this.body.bounce.setTo(1);
        this.body.immovable = true;


    }
    update():void {
        super.update();
    }

}


window.onload = () => {
    var game = new SimpleGame();
};
