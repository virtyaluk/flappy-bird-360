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
    entities = require('../create-entities');

module.exports = function(game, gameEntities, gameState) {
    var SettingsState = new phaser.State(),
        ents = {
            left: ['land1', 'land1Town', 'land1PipeBottom', 'land1Bird', 'land1Hover'],
            right: ['land2', 'land2Town', 'land2PipeBottom', 'land2Bird', 'land2Hover', 'separator']
        },
        goMainMenu = function() {
            ents.left.forEach(function(name) {
                game.add.tween(gameEntities[name]).to({ x: gameEntities[name].x - game.world.width }, 500,
                    phaser.Easing.Linear.None, true, 0);
            });
            ents.right.forEach(function(name) {
                game.add.tween(gameEntities[name]).to({ x: gameEntities[name].x + game.world.width }, 500,
                    phaser.Easing.Linear.None, true, 0).onComplete.add(function() {
                        if (name === 'separator') {
                            game.state.start('MainMenu');
                        }
                    });
            });
        },
        modeChanged = function() {
            var newState = game.input.x >= game.world.width * 0.5 ? 1 : 0;

            game.input.onDown.remove(modeChanged);

            if (gameState.gameMode !== newState) {
                gameState.gameMode = newState;
                gameState.save();

                game.add.tween(gameEntities['land' + (gameState.gameMode === 0 ? '1' : '2') + 'Hover'])
					.to({ alpha: 0 }, 500, phaser.Easing.Linear.None, true, 0);
                game.add.tween(gameEntities['land' + (gameState.gameMode === 0 ? '2' : '1') + 'Hover'])
					.to({ alpha: 1 }, 500, phaser.Easing.Linear.None, true, 0).onComplete
                    .add(function() { goMainMenu(); });

                return;
            }

            goMainMenu();
        };

    SettingsState.create = function() {
        entities.createSettingsScreen(game, gameEntities);

        gameEntities.land1Hover.alpha = gameState.gameMode !== 0;
        gameEntities.land2Hover.alpha = gameState.gameMode !== 1;

        ents.left.forEach(function(name) {
            gameEntities[name].x -= game.world.width;

            game.add.tween(gameEntities[name]).to({ x: gameEntities[name].x + game.world.width }, 500,
				phaser.Easing.Linear.None, true, 0);
        });

        ents.right.forEach(function(name) {
            gameEntities[name].x += game.world.width;

            game.add.tween(gameEntities[name]).to({ x: gameEntities[name].x - game.world.width }, 500,
				phaser.Easing.Linear.None, true, 0);
        });

        game.input.onDown.add(modeChanged);
    };

    return SettingsState;
};