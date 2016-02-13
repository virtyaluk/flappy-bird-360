/**
 * Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.
 * https://github.com/virtyaluk/flappy-bird-360
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 */

var phaser = require('../phaser');

module.exports = function(game, gameEntities) {
    var PreloaderGameState = new phaser.State();

    PreloaderGameState.preload = function() {
        var img = 'assets/img/';

        // mode 0
        game.load.spritesheet('bird0', img + '0/bird.png', 48, 35);
        game.load.image('town0', img + '0/town.png');
        game.load.image('pipe0', img + '0/pipe.png');

        // mode 1
        game.load.spritesheet('bird1', img + '1/bird.png', 96, 84.5);
        game.load.image('town1', img + '1/town.png');
        game.load.image('pipe1', img + '1/pipe.png');
        game.load.image('pipe1_2', img + '1/pipe2.png');

        game.load.spritesheet('clouds', img + 'clouds.png', 64, 34);
        game.load.image('gr', img + 'gr.png');
        game.load.image('go', img + 'go.png');
        game.load.image('play', img + 'play.png');
        game.load.image('record', img + 'record.png');
        game.load.image('tap', img + 'tap.png');
        game.load.image('hand', img + 'hand.png');
        game.load.image('medal', img + 'medals.png');
        game.load.image('gear', img + 'gear.png');
    };

    PreloaderGameState.create = function() {
        game.add.tween(gameEntities.logoBg).to({ fill: 0x53BECE }, 1000, phaser.Easing.Linear.None, true);

        game.add.tween(gameEntities.logo).to({ alpha: 0 }, 1000, phaser.Easing.Linear.None, true)
            .onComplete.add(function() {
                game.state.start('MainMenu', false, false);
            }, this);
    };

    return PreloaderGameState;
};