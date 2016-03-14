/// <reference path="phaser/phaser.d.ts"/>

class mainState extends Phaser.State {
    game: Phaser.Game;
    private flame:Phaser.Sprite;
    private cursor:Phaser.CursorKeys;


    preload():void {
        super.preload();
        this.load.spritesheet('fireball', 'assets/flameShotSet',)
        //this.load.image('ufo', 'assets/UFO.png');
    }

    create():void {
        super.create();
        var background;

        background = this.add.sprite(0, 0, 'background');
        var scale = this.world.height / background.height;
        background.scale.setTo(scale, scale);

        this.ufo = this.add.sprite(this.world.centerX, this.world.centerY, 'ufo');
        this.ufo.scale.setTo(scale - 0.05, scale - 0.05);
        this.ufo.anchor.setTo(0.5, 0.5);
    }

    update():void {
        super.update();
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
