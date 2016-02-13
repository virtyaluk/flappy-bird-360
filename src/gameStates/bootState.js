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
    var bootGameState = new phaser.State();

    bootGameState.preload = function() {
        game.load.image('logo', 'assets/img/logo.png');
    };

    bootGameState.create = function() {
        gameEntities.logoBg = game.add.graphics(0, 0);

        gameEntities.logoBg.beginFill(0xEEEEEE, 1);
        gameEntities.logoBg.drawRect(0, 0, game.world.width, game.world.height);
        gameEntities.logoBg.endFill();

        gameEntities.logo = game.add.sprite(game.world.width / 2, game.world.height * 0.5, 'logo');

        gameEntities.logo.anchor.setTo(0.5, 0.5);
        gameEntities.logo.scale.setTo(0.5, 0.5);

        game.state.start('Preloader', false, false);
    };

    return bootGameState;
};