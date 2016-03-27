/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private fireball:Phaser.Sprite;
    private bricks:Phaser.Group;
    //private brick:Phaser.Sprite;
    private pad:Phaser.Sprite;
    private ball:Phaser.Sprite;

    //var de items
    private bricksRow = 5;
    private bricksCol = 10;

    //var de movimiento
    private BALL_MAX_SPEED = 200;

    private FB_MAX_SPEED = 200;
    private FB_FRICTION = 150;
    private FB_ACCELERATION = 180;

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

        this.load.image('brick', 'assets/png/element_blue_rectangle.png');
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

        this.ball.body.maxVelocity.setTo(this.BALL_MAX_SPEED);
        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.setTo(1);
    }

    private createPad(){

        this.pad = this.add.sprite(this.world.centerX,440, 'pad');

        this.pad.scale.setTo(0.5, 0.5);
        this.physics.enable(this.pad);

        this.pad.body.collideWorldBounds = true;
        this.pad.body.immovable = true;

    }

    private createBricks(row, col){
        this.bricks = this.add.group();
        this.bricks.enableBody = true;
        this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

        for (var j = 0; j < row; j++){
            for(var i = 0; i < col; i++){
                var brick = new Brick (this.game, i*50+30, j*20+30, 'brick');
                brick.scale.setTo(0.5, 0.5);
                this.bricks.add(brick);

                //this.brick = this.add.sprite(i*50+30, j*20+20, 'brick');
                //
            }
        }
    }

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
        //this.fireballMove();

        //this.fireball.rotation = this.physics.arcade.angleToPointer(this.pad)
    }

    private padMove(){
        if (this.cursor.left.isDown) {
            this.pad.body.velocity.x = -this.FB_ACCELERATION;
        }else if (this.cursor.right.isDown) {
            this.pad.body.velocity.x =this.FB_ACCELERATION;
        } else {
            this.pad.body.velocity.x = 0;
        }

        //variables de movimiento
        this.physics.enable(this.pad);
        this.fireball.body.collideWorldBounds = true;       //Colision

    }

    private ballMove(){

    }

    private fireballMove(){

        if (this.cursor.left.isDown) {
            this.fireball.body.acceleration.x =-this.FB_ACCELERATION;

        } else if (this.cursor.right.isDown) {
            this.fireball.body.acceleration.x =this.FB_ACCELERATION;

        } else if (this.cursor.up.isDown) {
            this.fireball.body.acceleration.y =-this.FB_ACCELERATION;

        } else if (this.cursor.down.isDown) {
            this.fireball.body.acceleration.y =this.FB_ACCELERATION;
        } else {
            this.fireball.body.acceleration.y =0;
            this.fireball.body.acceleration.x =0;
        }
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
