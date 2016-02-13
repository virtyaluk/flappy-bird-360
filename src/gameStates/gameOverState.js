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

module.exports = function(game, gameEntities, gameState) {
    var GameOverState = new phaser.State(),
        highScoreStateClick = function() {
            gameState.save();
            this.input.onDown.remove(highScoreStateClick);

            ['recordSprite', 'playBtnSprite', 'newBestRect', 'newBestText', 'scoreText', 'scoreValText',
            'bestScoreText', 'bestScoreValText', 'medalText', 'medalImg'].forEach(function(name) {
                game.add.tween(gameEntities[name]).to({ y: gameEntities[name].y + game.world.height }, 500,
                    phaser.Easing.Linear.None, true, 0);
            });

            game.add.tween(gameEntities.goSprite).to({ y: -100 }, 500, phaser.Easing.Linear.None, true, 0)
                .onComplete.add(function() {
                    game.state.start('MainMenu', true, false);
                });
        };

    GameOverState.create = function() {
        var medal = gameState.gameScore > gameState.bestScore ? 0 : gameState.gameScore === gameState.bestScore ?
            1 : gameState.gameScore !== 0 ? 2 : 3;

        gameEntities.score.y = -100;

        if (gameState.gameScore > gameState.bestScore) {
            gameState.bestScore = gameState.gameScore;
        } else {
            gameEntities.newBestText.alpha = 0;
            gameEntities.newBestRect.alpha = 0;
        }

        gameEntities.scoreValText.setText(gameState.gameScore || '0');
        gameEntities.bestScoreValText.setText(gameState.bestScore || '0');
        gameEntities.medalImg.crop.setTo(0, medal * 65, 65, 65);

        game.add.tween(gameEntities.hoverBg).to({ alpha: 1 }, 500,
            phaser.Easing.Linear.None, true, 0);
        game.add.tween(gameEntities.goSprite).to({
            alpha: 1,
            y: game.world.height * 0.15
        }, 500, phaser.Easing.Linear.None, true, 0);

        ['recordSprite', 'playBtnSprite', 'newBestRect', 'newBestText', 'scoreText', 'scoreValText', 'bestScoreText',
        'bestScoreValText', 'medalText', 'medalImg'].forEach(function(name) {
            game.add.tween(gameEntities[name]).to({ y: gameEntities[name].y - game.world.height }, 500,
                phaser.Easing.Linear.None, true, 0);
        });

        game.input.onDown.remove(gameEntities.birdFlap);

        setTimeout(function() {
            game.input.onDown.add(highScoreStateClick.bind(game));
        }, 1000);

        gameEntities.pipes.forEachAlive(function(pipe) {
            pipe.body.velocity.x = 0;
        });

        gameEntities.freeSpacesInPipes.forEachAlive(function(spaceInPipe) {
            spaceInPipe.body.velocity.x = 0;
        });

        gameEntities.pipesTimer.stop();

        gameEntities.score.setText('');

        gameEntities.bird.angle = 180;
        gameEntities.bird.animations.stop();
        gameEntities.bird.frame = 3;
    };

    return GameOverState;
};
