/// <reference path="phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var mainState = (function (_super) {
    __extends(mainState, _super);
    function mainState() {
        _super.apply(this, arguments);

        //var de movimiento
        this.FB_MAX_SPEED = 200;
        this.FB_FRICTION = 150;
        this.FB_ACCELERATION = 180;

        //var de items
        this.ball;
        this.pad;
        this.bricks;
        this.brick;
        this.filasBricks;
        this.columnBricks;

        //Var animacion
        this.fireballFrameWitdh = 3072 / 6;
    }

    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        //this.load.spritesheet('fireball', 'assets/flameShotSet.png', this.fireballFrameWitdh, 512, 6);

        //Precarga de sprites
        this.load.image('brick', 'assets/png/element_blue_rectangle.png');
        this.load.image('pad', 'assets/png/paddleBlu.png');
        this.load.image('ball', 'assets/png/ballBlue.png');
        this.load.image('bg', 'assets/bgSpace.png');

        //Precarga de fisicas
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.checkCollision.down = false;
    };

    mainState.prototype.create = function () {
        _super.prototype.create.call(this);

        //crear elementos de pantalla
        this.createBackground();
        this.createBricks(4,2);
        this.createPad();
        //this.createFireball();

        //Crear fisicas y control
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.bricks = this.game.add.group();
        this.physics.arcade.checkCollision.down = false; //Sin colision inferior del mapa

        this.cursor = this.input.keyboard.createCursorKeys();
    };

    mainState.prototype.createBackground = function () {
        var bg;
        bg = this.add.sprite(0, 0, 'bg');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };

    mainState.prototype.createBricks = function (filas, columnas) {

        var bricks;
        bricks = this.game.add.group();
        bricks.enableNody = true;
        bricks.physicsBodyType = Phaser.Physics.ARCADE;

        var brick;

        for (var y = 0 ; y < filas ; y++){
            for (var x = 0 ; x < columnas ; x++);{
                brick = bricks.create(x*5+5, y*20+20, 'brick');
                brick.scale.setTo(0.5, 0.5);
                brick.body.immovable = true;

            }
        }
        var brick;


    }





    mainState.prototype.createPad = function () {

    }


    mainState.prototype.createFireball = function () {
        var anim;
        this.fireball = this.add.sprite(this.world.centerX, this.world.centerY, 'fireball');
        this.fireball.scale.setTo(0.15, 0.15);
        this.fireball.anchor.setTo(0.5, 0.5);
        //variables Animacion
        anim = this.fireball.animations.add('run');
        anim.play(15, true);
        //variables de movimiento
        this.physics.enable(this.fireball);
        this.fireball.body.collideWorldBounds = true; //Colision
        this.fireball.body.bounce.setTo(0.8); //Rebote
        this.fireball.body.maxVelocity.setTo(this.FB_MAX_SPEED, this.FB_MAX_SPEED);
        this.fireball.body.drag.setTo(this.FB_FRICTION, this.FB_FRICTION);
    };

    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        //this.fireballMove();


    };
    /*mainState.prototype.fireballMove = function () {
        if (this.cursor.left.isDown) {
            this.fireball.body.acceleration.x = -this.FB_ACCELERATION;
        }
        else if (this.cursor.right.isDown) {
            this.fireball.body.acceleration.x = this.FB_ACCELERATION;
        }
        else if (this.cursor.up.isDown) {
            this.fireball.body.acceleration.y = -this.FB_ACCELERATION;
        }
        else if (this.cursor.down.isDown) {
            this.fireball.body.acceleration.y = this.FB_ACCELERATION;
        }
        else {
            this.fireball.body.acceleration.y = 0;
            this.fireball.body.acceleration.x = 0;
        }
        this.fireball.rotation = this.game.physics.arcade.angleToPointer(this.fireball);
    };*/
    ;
    return mainState;
})(Phaser.State);
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(500, 500, Phaser.AUTO, 'gameDiv');
        this.game.state.add('main', mainState);
        this.game.state.start('main');
    }
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map