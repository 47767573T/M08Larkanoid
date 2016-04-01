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
        //var de items
        this.bricksRow = 5;
        this.bricksCol = 10;
        //var de movimiento
        this.BALL_MAX_SPEED = 400;
        this.BALL_MIN_SPEED = 200;
        this.BALL_ACCELERATION = 20;
        this.PAD_MAX_SPEED = 500;
        this.PAD_LIVES = 3;
        this.BRICK_LIVES = 3;
        this.FB_MAX_SPEED = 200;
        this.FB_FRICTION = 150;
        this.FB_ACCELERATION = 180;
        //Var de Scores
        this.score_lives = this.PAD_LIVES;
        this.SCORE_MARGIN = 10;
        //Var animacion
        this.fireballFrameWitdh = 3072 / 6;
        this.fireballFrameRate = 200;
    }
    mainState.prototype.preload = function () {
        _super.prototype.preload.call(this);
        this.load.spritesheet('fireball', 'assets/flameShotSet.png', this.fireballFrameWitdh, 512, 6);
        this.load.image('brick1', 'assets/png/element_blue_rectangle.png');
        this.load.image('brick2', 'assets/png/element_green_rectangle.png');
        this.load.image('brick3', 'assets/png/element_red_rectangle.png');
        this.load.image('pad', 'assets/png/paddleBlu.png');
        this.load.image('ball', 'assets/png/ballBlue.png');
        this.load.image('bg', 'assets/bgSpace.png');
        this.physics.startSystem(Phaser.Physics.ARCADE);
    };
    mainState.prototype.create = function () {
        _super.prototype.create.call(this);
        this.createBackground();
        this.createBall();
        this.createPad();
        //this.createFireball();
        this.createBricks(this.bricksRow, this.bricksCol);
        this.createScores();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.physics.arcade.checkCollision.down = false;
    };
    mainState.prototype.createBackground = function () {
        var bg;
        bg = this.add.sprite(0, 0, 'bg');
        var scale = this.world.height / bg.height;
        bg.scale.setTo(scale, scale);
    };
    mainState.prototype.createBall = function () {
        this.ball = this.add.sprite(this.world.centerX, this.world.centerY, 'ball');
        this.ball.scale.setTo(0.5, 0.5);
        this.physics.enable(this.ball);
        this.ball.body.bounce.setTo(1.2);
        this.ball.body.maxVelocity.setTo(this.BALL_MAX_SPEED, this.BALL_MAX_SPEED);
        this.ball.body.collideWorldBounds = true;
        this.ball.checkWorldBounds = true;
        this.ball.events.onOutOfBounds.add(this.ballOut, this);
        //this.ball.body.velocity.x= this.BALL_MIN_SPEED;
        this.ball.body.velocity.y = this.BALL_MIN_SPEED;
    };
    mainState.prototype.createPad = function () {
        this.pad = this.add.sprite(this.world.centerX, 440, 'pad');
        this.pad.scale.setTo(0.6, 0.6);
        this.physics.enable(this.pad);
        this.pad.body.bounce.set(1.2);
        this.pad.body.collideWorldBounds = true;
        this.pad.body.immovable = true;
        this.pad.health = this.PAD_LIVES;
    };
    mainState.prototype.createBricks = function (row, col) {
        this.bricks = this.add.group();
        this.bricks.enableBody = true;
        this.bricks.physicsBodyType = Phaser.Physics.ARCADE;
        for (var j = 0; j < row; j++) {
            for (var i = 0; i < col; i++) {
                var brick = new Brick(this.game, i * 50 + 30, j * 20 + 30, 'brick1');
                brick.scale.setTo(0.5, 0.5);
                brick.health = this.BRICK_LIVES;
                this.bricks.add(brick);
            }
        }
    };
    mainState.prototype.createScores = function () {
        var width = this.scale.bounds.width;
        var height = this.scale.bounds.height;
        this.scoreLives = this.add.text(this.pad.x, this.pad.y, "-" + this.pad.health + "-", { font: "10px Arial", fill: "#ffffff" });
        this.scoreLives.anchor.setTo(0.5, 0.5);
    };
    ;
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
    mainState.prototype.update = function () {
        _super.prototype.update.call(this);
        this.padMove();
        this.ballMove();
        this.updateScore();
        this.physics.arcade.collide(this.ball, this.pad, this.ballHitPad, null, this);
        this.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);
        //this.fireballMove();
        //this.fireball.rotation = this.physics.arcade.angleToPointer(this.pad)
    };
    mainState.prototype.padMove = function () {
        if (this.cursor.left.isDown) {
            this.pad.body.velocity.x = -this.PAD_MAX_SPEED;
        }
        else if (this.cursor.right.isDown) {
            this.pad.body.velocity.x = this.PAD_MAX_SPEED;
        }
        else {
            this.pad.body.velocity.x = 0;
        }
    };
    mainState.prototype.ballMove = function () {
        this.physics.enable(this.ball);
        this.ball.body.collideWorldBounds = true;
    };
    /*  private fireballMove(){
    
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
    */
    mainState.prototype.ballHitPad = function (ball, pad) {
        if (ball.body.velocity.x != this.BALL_MIN_SPEED) {
            this.ball.body.velocity.y = this.BALL_MIN_SPEED;
            if (this.ball.body.velocity.x <= 0) {
                this.ball.body.velocity.x = this.BALL_MIN_SPEED;
            }
            else if (this.ball.body.velocity.x > 0) {
                this.ball.body.velocity.x = -this.BALL_MIN_SPEED;
            }
        }
    };
    mainState.prototype.ballHitBrick = function (ball, brick) {
        brick.damage(1);
        if (brick.health == 2)
            brick.loadTexture('brick2');
        else if (brick.health == 1)
            brick.loadTexture('brick3');
        if (ball.body.velocity.x != this.BALL_MAX_SPEED) {
            this.ball.body.velocity.y += this.BALL_ACCELERATION;
            this.ball.body.velocity.x += this.BALL_ACCELERATION;
        }
    };
    mainState.prototype.updateScore = function () {
        this.scoreLives.x = this.pad.x;
        this.scoreLives.y = this.pad.y;
    };
    mainState.prototype.ballOut = function () {
    };
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
var Brick = (function (_super) {
    __extends(Brick, _super);
    function Brick(game, x, y, key) {
        _super.call(this, game, x, y, key);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.anchor.setTo(0.5, 0.5);
        this.body.bounce.setTo(1);
        this.body.immovable = true;
    }
    Brick.prototype.update = function () {
        _super.prototype.update.call(this);
    };
    return Brick;
})(Phaser.Sprite);
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=main.js.map