/**
 * Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.
 * https://github.com/virtyaluk/flappy-bird-360
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 */

var phaser = require('../phaser'),
    entities = require('../create-entities'),
    cfg = require('../config');

module.exports = function(game, gameEntities, gameState) {
    var MainMenuState = new phaser.State();

    MainMenuState.create = function() {
        var click = function() {
            game.input.onDown.remove(click);
            game.add.tween(gameEntities.hoverBg).to({ alpha: 0 }, 500, phaser.Easing.Linear.None, true, 0);
            ['cfgRect', 'cfgRectTopBorder', 'cfgImg', 'tapImg', 'handImg'].forEach(function(name) {
                game.add.tween(gameEntities[name]).to({ y: game.world.height * 1.5 }, 500,
                    phaser.Easing.Linear.None, true, 0);
            });
            game.add.tween(gameEntities.grSprite).to({ y: -100, alpha: 0 }, 500, phaser.Easing.Back.InOut, true, 0)
                .onComplete.add(function() {
                    if (phaser.Rectangle.contains(new phaser.Rectangle(0, game.world.height * 0.8, game.world.width,
                        game.world.height * 0.2), game.input.x, game.input.y)) {
                        game.state.start('Settings', false, false);
                    } else {
                        entities.birdFlap(gameEntities);
                        game.state.start('Game', false, false);
                    }
                });
        };

        entities.createBackground(game, gameState);
        entities.createClouds(game);
        entities.createTown(game, gameEntities, gameState);
        entities.createPipes(game, gameEntities, gameState, false);
        entities.createHoverBg(game, gameEntities);
        entities.createBird(game, gameEntities, gameState);
        entities.createTexts(game, gameEntities);

        gameState.gameScore = 0;
        gameEntities.bird.alpha = 0;
        gameEntities.bird.angle = 0;
        gameEntities.bird.body.allowGravity = false;
        gameEntities.bird.body.gravity.y = 0;
        gameEntities.bird.animations.play('flying');

        gameEntities.score.setText('');

        game.input.onDown.add(click);
    };

    MainMenuState.update = function() {
        gameEntities.cfgImg.angle++;
        gameEntities.town.tilePosition.x -= game.time.physicsElapsed * cfg.gameSpeed / 5;
    };

    return MainMenuState;
};