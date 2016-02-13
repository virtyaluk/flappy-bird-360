/**
 * Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.
 * https://github.com/virtyaluk/flappy-bird-360
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 */

(function() {
    var phaser = require('./phaser'),
        cfg = require('./config'),

        game = new phaser.Game(cfg.canvasWidth, cfg.canvasHeight, phaser.CANVAS, cfg.scene, null, false, false),
        gameEntities = {},
        gameState = {
            gameScore: 0,
            bestScore: 0,
            gameMode: 0,
            load: function() {
                var val;

                if (localStorage) {
                    val = localStorage.getItem('best-score') || null;

                    if (val) {
                        this.bestScore = parseInt(val, 10) || 0;
                    }

                    val = localStorage.getItem('game-mode') || null;

                    if (val) {
                        this.gameMode = parseInt(val, 10) || 0;
                    }
                }
            },
            save: function() {
                if (localStorage) {
                    localStorage.setItem('best-score', this.bestScore);
                    localStorage.setItem('game-mode', this.gameMode || 0);
                }
            }
        },
        gameStates = {
            Boot: require('./gameStates/bootState')(game, gameEntities),
            Preloader: require('./gameStates/preloaderState')(game, gameEntities),
            MainMenu: require('./gameStates/mainMenuState')(game, gameEntities, gameState),
            Game: require('./gameStates/gameState')(game, gameEntities, gameState),
            GameOver: require('./gameStates/gameOverState')(game, gameEntities, gameState),
            Settings: require('./gameStates/settingsState')(game, gameEntities, gameState)
        };

    gameEntities.birdFlap = function() {
        gameEntities.bird.body.velocity.y = -cfg.birdFlap;
    };

    Object.keys(gameStates).forEach(function(name) {
        game.state.add(name, gameStates[name], false);
    });

    gameState.load();
    game.state.start('Boot');
}());