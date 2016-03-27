/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private fireball:Phaser.Sprite;
    private brick:Phaser.Sprite;
    private pad:Phaser.Sprite;
    private ball:Phaser.Sprite;

    //var de items
    private bricksRow = 4;
    private bricksCol = 10;

    //var de movimiento
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
        this.physics.arcade.checkCollision.down = false;
    }

    create():void {
        super.create();
        this.createBackground();

        this.createBall();
        this.createFireball();

        this.createBricks(4, 9);

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

         this.ball = this.add.sprite(0.9, 0.1, 'ball');
         this.ball.scale.setTo(0.5, 0.5);
    }

    private createBricks(row, col){
        for (var j = 0; j < row; j++){
            for(var i = 0; i < col; i++){
                this.brick = this.add.sprite(i*50+30, j*20+20, 'brick');
                this.brick.scale.setTo(0.5, 0.5);
                this.physics.arcade.collide(this.brick, this.fireball, true);
                this.physics.enable(this.brick);


            }
        }
    }



    private createFireball(){
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


    update():void {
        super.update();

        this.padMove();
        this.fireballMove();

        this.fireball.rotation = this.physics.arcade.angleToPointer(this.fireball)
    }

    private padMove(){

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

window.onload = () => {
    var game = new SimpleGame();
};
