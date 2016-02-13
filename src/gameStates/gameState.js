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
    var GameState = new phaser.State(),
        goGameOver = function() {
            game.state.start('GameOver', false, false);
        };

    GameState.create = function() {
        entities.createPipes(game, gameEntities, gameState, true);

        gameEntities.bird.alpha = 1;
        gameEntities.bird.reset(game.world.width / 4, game.world.height / 3);

        gameEntities.score.setText(gameState.gameScore);

        gameEntities.bird.body.allowGravity = true;
        gameEntities.bird.body.gravity.y = cfg.gravity;

        game.input.onDown.add(gameEntities.birdFlap);
    };

    GameState.update = function() {
        gameEntities.bird.angle = 90 * (cfg.birdFlap + gameEntities.bird.body.velocity.y) / cfg.birdFlap - 180;

        if (gameEntities.bird.angle < -30) {
            gameEntities.bird.angle = -30;
        } else if (gameEntities.bird.angle > 30) {
            gameEntities.bird.angle = 30;
        }

        game.physics.overlap(gameEntities.bird, gameEntities.pipes, goGameOver);

        if (gameEntities.bird.body.bottom >= game.world.bounds.bottom ||
            gameEntities.bird.body.top <= game.world.bounds.top) {
            goGameOver();
        }

        game.physics.overlap(gameEntities.bird, gameEntities.freeSpacesInPipes, function(_, spaceInPipe) {
            gameEntities.freeSpacesInPipes.remove(spaceInPipe);

            ++gameState.gameScore;

            game.add.tween(gameEntities.score.scale).to({ x: 1.5, y: 1.5 }, 300, phaser.Easing.Linear.None, true, 0);
            game.add.tween(gameEntities.score).to({ alpha: 0.25 }, 300, phaser.Easing.Linear.None, true, 0)
                .onComplete.add(function() {
                    gameEntities.score.setText(gameState.gameScore);
                    gameEntities.score.scale.setTo(1, 1);
                    gameEntities.score.alpha = 0.9;
                });
        });

        gameEntities.town.tilePosition.x -= game.time.physicsElapsed * entities.getModifiedSpeed(gameState) / 5;
    };

    GameState.render = function() {
        if (cfg.debugMode) {
            game.debug.renderCameraInfo(game.camera, 32, 32);
            game.debug.renderSpriteBody(gameEntities.bird);
            game.debug.renderSpriteBounds(gameEntities.bird);
            game.debug.renderSpriteCorners(gameEntities.bird, true, true);

            game.debug.renderQuadTree(game.physics.quadTree);

            gameEntities.pipes.forEachAlive(function(pipe) {
                game.debug.renderSpriteBody(pipe);
                game.debug.renderSpriteCorners(pipe, true, true);
            });

            gameEntities.freeSpacesInPipes.forEachAlive(function(spaceInPipe) {
                game.debug.renderSpriteBody(spaceInPipe);
            });
        }
    };

    return GameState;
};