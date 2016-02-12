/**
 * Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.
 * https://github.com/virtyaluk/flappy-bird-360
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 */

var cfg = require('./config'),
    phaser = require('./phaser'),
    getModifiedSpeed = function(gameState) {
        return cfg.gameSpeed + gameState.gameScore * 5;
    };

module.exports = {
    createBackground: function(game, gameState) {
        var Background = game.add.graphics(0, 0);

        if (gameState.gameMode === 0) {
            Background.beginFill(0x53BECE, 1);
        } else {
            Background.beginFill(0x99ffff, 1);
        }

        Background.drawRect(0, 0, game.world.width, game.world.height);
        Background.endFill();
    },
    createClouds: function(game) {
        var cloudX = 0,
            clouds = game.add.group(),
            cloudsTimer = game.time.create(false),
            makeNewCloud = function(cldX, startTimer) {
                var cloudY = Math.random() * game.world.height / 2,
                    cloud,
                    cloudScale;

                cloudX = typeof cloudX === 'undefined' ? game.world.width : cldX;

                cloud = clouds.create(cloudX, cloudY, 'clouds', Math.floor(21 * Math.random()));
                cloudScale = 1 + Math.floor(4 * Math.random());

                cloud.alpha = 1 / cloudScale * 2;
                cloud.scale.setTo(cloudScale, cloudScale);
                cloud.body.allowGravity = false;
                cloud.body.velocity.x = -cfg.gameSpeed / cloudScale * 0.5;
                cloud.anchor.setTo(0, 0.5);

                cloud.events.onOutOfBounds.add(function(c) {
                    c.kill();
                });

                if (typeof startTimer === 'undefined') {
                    cloudsTimer.add(game.rnd.integerInRange(cfg.cloudSpawnMinTime, cfg.cloudSpawnMaxTime),
                        makeNewCloud, this);
                }
            };

        while (cloudX < game.world.width) {
            makeNewCloud(cloudX, false);

            cloudX += Math.floor(Math.random() * 100);
        }

        cloudsTimer.add(0, makeNewCloud, this);
        cloudsTimer.start();
    },
    createTown: function(game, gameEntities, gameState) {
        gameEntities.town = game.add.tileSprite(0, game.world.height - 128, game.world.width, 128,
            'town' + gameState.gameMode);
    },
    createBird: function(game, gameEntities, gameState) {
        gameEntities.bird = game.add.sprite(0, 0, 'bird' + gameState.gameMode);
        gameEntities.bird.anchor.setTo(0.5, 0.5);

        if (gameState.gameMode === 1) {
            gameEntities.bird.scale.setTo(0.5, 0.5);
        }

        gameEntities.bird.animations.add('flying', [0, 1, 2, 3, 2, 1, 0], 20, true);
        gameEntities.bird.animations.play('flying');
        gameEntities.bird.body.collideWorldBounds = true;
        gameEntities.bird.body.gravity.y = 0;
        gameEntities.bird.body.allowGravity = false;
    },
    createPipes: function(game, gameEntities, gameState, timer) {
        var calcDifficult = function() {
                return cfg.availableSpaceBetweenPipes + Math.floor(Math.random() * cfg.availableSpaceBetweenPipes) *
                ((gameState.gameScore > cfg.maxDifficult ? cfg.maxDifficult : cfg.maxDifficult -
                gameState.gameScore) / (cfg.maxDifficult + 1));
            },
            makeNewPipe = function(pipeY, isFlipped, diffMode, diffPipe) {
                var pipe = gameEntities.pipes.create(game.world.width,
                    pipeY + (isFlipped ? -calcDifficult() : calcDifficult()) / 2, 'pipe' + (diffMode ? '1' : '0') +
                    (diffMode && diffPipe ? '_2' : ''));

                pipe.body.allowGravity = false;
                pipe.scale.setTo(2.2, isFlipped ? -2 : 2); // 2.5 -> 2.2
                pipe.body.offset.y = isFlipped ? -pipe.body.height * 2 : 0;
                pipe.body.velocity.x = -getModifiedSpeed(gameState);

                pipe.events.onOutOfBounds.add(function(p) {
                    p.kill();
                });

                return pipe;
            },
            makePipes = function() {
                var pipeY = (game.world.height - 16 - calcDifficult() / 2) / 2 + (Math.random() > 0.5 ? -1 : 1) *
                    Math.random() * game.world.height / 5,
                    diffMode = gameState.gameMode !== 0,
                    diffPipe = Math.random() >= 0.5,
                    bottomPipe = makeNewPipe(pipeY, false, diffMode, diffPipe),
                    topPipe = makeNewPipe(pipeY, true, diffMode, diffPipe),
                    oldY,
                    spaceInPipe,
                    newTime;

                if (topPipe.y < 10) {
                    oldY = topPipe.y;

                    topPipe.y = 10;
                    bottomPipe.y += 10 - oldY;
                }

                spaceInPipe = gameEntities.freeSpacesInPipes.create(topPipe.x + topPipe.width, 0);

                spaceInPipe.width = 2;
                spaceInPipe.height = game.world.height;
                spaceInPipe.body.allowGravity = false;
                spaceInPipe.body.velocity.x = -getModifiedSpeed(gameState);

                newTime = game.rnd.integerInRange(cfg.pipeSpawnMinInterval, cfg.pipeSpawnMaxInterval) -
                    getModifiedSpeed(gameState) * 2;

                gameEntities.pipesTimer.add(newTime < cfg.pipeSpawnMinInterval ? cfg.pipeSpawnMinInterval :
                    newTime, makePipes, this);
            };

        if (timer) {
            gameEntities.pipesTimer = game.time.create(false);

            gameEntities.pipesTimer.add(0, makePipes, this);
            gameEntities.pipesTimer.start();
        } else {
            gameEntities.pipes = game.add.group();
            gameEntities.freeSpacesInPipes = game.add.group();
        }
    },

    birdFlap: function(gameEntities) {
        gameEntities.bird.body.velocity.y = -cfg.birdFlap;
    },

    createTexts: function(game, gameEntities) {
        gameEntities.grSprite = game.add.sprite(game.world.width / 2, -game.world.height * 0.25, 'gr');
        gameEntities.grSprite.anchor.setTo(0.5, 0);
        gameEntities.grSprite.scale.setTo(0.5, 0.5);

        game.add.tween(gameEntities.grSprite).to({ y: game.world.height * 0.18 }, 500,
            phaser.Easing.Linear.None, true, 0);

        gameEntities.tapImg = game.add.sprite(game.world.width / 2, game.world.height * 1.5, 'tap');
        gameEntities.tapImg.anchor.setTo(0.5, 0.5);
        gameEntities.tapImg.scale.setTo(0.5, 0.5);

        game.add.tween(gameEntities.tapImg).to({ y: game.world.height * 0.58 }, 500,
            phaser.Easing.Linear.None, true, 0);

        gameEntities.handImg = game.add.sprite(game.world.width / 2 + 2, game.world.height * 1.5, 'hand');
        gameEntities.handImg.anchor.setTo(0.5, 0.5);
        gameEntities.handImg.scale.setTo(0.5, 0.5);

        game.add.tween(gameEntities.handImg).to({ y: game.world.height * 0.58 + 30 }, 500,
            phaser.Easing.Linear.None, true, 0).onComplete.add(function() {
                var tween = game.add.tween(gameEntities.handImg.scale).to({ x: 0.35, y: 0.35 }, 500,
                    phaser.Easing.Linear.None, true, 0);

                tween.onComplete.add(function() {
                    gameEntities.handImg.scale.setTo(0.5, 0.5);
                    tween.start();
                });
            });

        gameEntities.score = game.add.text(game.world.width / 2, game.world.height / 6, '', {
            font: '36px "04b_19regular"',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        });
        gameEntities.score.anchor.setTo(0.5, 0.5);

        gameEntities.goSprite = game.add.sprite(game.world.width / 2, -100, 'go');
        gameEntities.goSprite.anchor.setTo(0.5, 0);
        gameEntities.goSprite.alpha = 0;
        gameEntities.goSprite.scale.setTo(0.5, 0.5);

        gameEntities.recordSprite = game.add.sprite(game.world.width / 2,
            game.world.height + game.world.height * 0.55, 'record');
        gameEntities.recordSprite.anchor.setTo(0.5, 0.5);
        gameEntities.recordSprite.scale.setTo(0.5, 0.5);

        gameEntities.playBtnSprite = game.add.sprite(game.world.width / 2,
            game.world.height + game.world.height * 0.85, 'play');
        gameEntities.playBtnSprite.anchor.setTo(0.5, 0.5);
        gameEntities.playBtnSprite.scale.setTo(0.5, 0.5);

        gameEntities.newBestRect = game.add.graphics(0, 0);
        gameEntities.newBestRect.beginFill(0xFF0000, 1);
        gameEntities.newBestRect.drawRect(game.world.width / 2 + 16, game.world.height + game.world.height * 0.55 + 4,
            37, 16);
        gameEntities.newBestRect.endFill();

        gameEntities.cfgRect = game.add.graphics(0, 0);
        gameEntities.cfgRect.beginFill(0xFFFFFF, 10.35);
        gameEntities.cfgRect.drawRect(0, game.world.height * 0.8, game.world.width, game.world.height * 0.2);
        gameEntities.cfgRect.endFill();

        gameEntities.cfgRectTopBorder = game.add.graphics(0, 0);
        gameEntities.cfgRectTopBorder.beginFill(0x000000, 0.25);
        gameEntities.cfgRectTopBorder.drawRect(0, game.world.height * 0.8 - 2, game.world.width, 3);
        gameEntities.cfgRectTopBorder.endFill();

        gameEntities.cfgImg = game.add.sprite(game.world.width / 2, game.world.height * 0.9, 'gear');
        gameEntities.cfgImg.anchor.setTo(0.5, 0.5);
        gameEntities.cfgImg.scale.setTo(0.35, 0.35);

        gameEntities.cfgRect.alpha = gameEntities.cfgRectTopBorder.alpha = gameEntities.cfgImg.alpha = 0;

        ['cfgRect', 'cfgRectTopBorder', 'cfgImg'].forEach(function(name) {
            game.add.tween(gameEntities[name]).to({ alpha: 1 }, 500, phaser.Easing.Linear.None, true, 0);
        });

        gameEntities.newBestText = game.add.text(game.world.width / 2 + 50,
            game.world.height + game.world.height * 0.55 + 4, 'NEW', {
                font: '14px "Arial"',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 0,
                align: 'right'
            });
        gameEntities.newBestText.anchor.setTo(1.0, 0.0);

        gameEntities.scoreText = game.add.text(game.world.width / 2 + 90,
            game.world.height + game.world.height * 0.55 - 52, 'SCORE', {
                font: '14px "Arial"',
                fill: '#FA7959',
                stroke: '#000000',
                strokeThickness: 0,
                align: 'right'
            });
        gameEntities.scoreText.anchor.setTo(1.0, 0.0);

        gameEntities.medalText = game.add.text(game.world.width / 2 - 20,
            game.world.height + game.world.height * 0.55 - 52, 'MEDAL', {
                font: '14px "Arial"',
                fill: '#FA7959',
                stroke: '#000000',
                strokeThickness: 0,
                align: 'left'
            });
        gameEntities.medalText.anchor.setTo(1.0, 0.0);

        gameEntities.scoreValText = game.add.text(game.world.width / 2 + 90,
            game.world.height + game.world.height * 0.55 - 35, '', {
                font: '28px "04b_19regular"',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'right'
            });
        gameEntities.scoreValText.anchor.setTo(1.0, 0.0);

        gameEntities.bestScoreText = game.add.text(game.world.width / 2 + 90,
            game.world.height + game.world.height * 0.55 + 4, 'BEST', {
                font: '14px "Arial"',
                fill: '#FA7959',
                stroke: '#000000',
                strokeThickness: 0,
                align: 'right'
            });
        gameEntities.bestScoreText.anchor.setTo(1.0, 0.0);

        gameEntities.bestScoreValText = game.add.text(game.world.width / 2 + 90,
            game.world.height + game.world.height * 0.55 + 20, '', {
                font: '28px "04b_19regular"',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'right'
            });
        gameEntities.bestScoreValText.anchor.setTo(1.0, 0.0);

        gameEntities.medalImg = game.add.sprite(game.world.width / 2 - 44,
            game.world.height + game.world.height * 0.6 - 8, 'medal');
        gameEntities.medalImg.anchor.setTo(0.5, 0.5);
        gameEntities.medalImg.cropEnabled = true;
    },
    createHoverBg: function(game, gameEntities) {
        gameEntities.hoverBg = game.add.graphics(0, 0);

        gameEntities.hoverBg.beginFill(0x000000, 0.2);
        gameEntities.hoverBg.drawRect(0, 0, game.world.width, game.world.height);
        gameEntities.hoverBg.endFill();
    },
    createSettingsScreen: function(game, gameEntities) {
        gameEntities.land1 = game.add.graphics(0, 0);
        gameEntities.land1.beginFill(0x53BECE, 1);
        gameEntities.land1.drawRect(0, 0, game.world.width * 0.5, game.world.height);
        gameEntities.land1.endFill();

        gameEntities.land1Town = game.add.tileSprite(0, game.world.height - 128, game.world.width * 0.5, 128, 'town0');

        gameEntities.land1PipeBottom = game.add.sprite(0, 0, 'pipe0');
        gameEntities.land1PipeBottom.scale.setTo(2.2, 2);
        gameEntities.land1PipeBottom.anchor.setTo(0.5, 0);
        gameEntities.land1PipeBottom.x = game.world.width * 0.25;
        gameEntities.land1PipeBottom.y = game.world.height * 0.5;

        gameEntities.land1Bird = game.add.sprite(0, 0, 'bird0');
        gameEntities.land1Bird.anchor.setTo(0.5, 0.5);
        gameEntities.land1Bird.x = game.world.width * 0.25;
        gameEntities.land1Bird.y = game.world.height * 0.5 - 65;

        gameEntities.land2 = game.add.graphics(0, 0);
        gameEntities.land2.beginFill(0x99FFFF, 1);
        gameEntities.land2.drawRect(game.world.width * 0.5, 0, game.world.width * 0.5, game.world.height);
        gameEntities.land2.endFill();

        gameEntities.land2Town = game.add.tileSprite(game.world.width * 0.5, game.world.height - 128,
            game.world.width * 0.5, 128, 'town1');

        gameEntities.land2PipeBottom = game.add.sprite(0, 0, 'pipe1');
        gameEntities.land2PipeBottom.scale.setTo(2.2, 2);
        gameEntities.land2PipeBottom.anchor.setTo(0.5, 0);
        gameEntities.land2PipeBottom.x = game.world.width * 0.75;
        gameEntities.land2PipeBottom.y = game.world.height * 0.5;

        gameEntities.land2Bird = game.add.sprite(0, 0, 'bird1');
        gameEntities.land2Bird.scale.setTo(0.5, 0.5);
        gameEntities.land2Bird.anchor.setTo(0.5, 0.5);
        gameEntities.land2Bird.x = game.world.width * 0.75;
        gameEntities.land2Bird.y = game.world.height * 0.5 - 65;

        gameEntities.land1Hover = game.add.graphics(0, 0);
        gameEntities.land1Hover.beginFill(0x000000, 0.5);
        gameEntities.land1Hover.drawRect(0, 0, game.world.width * 0.5, game.world.height);
        gameEntities.land1Hover.endFill();

        gameEntities.land2Hover = game.add.graphics(0, 0);
        gameEntities.land2Hover.beginFill(0x000000, 0.5);
        gameEntities.land2Hover.drawRect(game.world.width * 0.5, 0, game.world.width * 0.5, game.world.height);
        gameEntities.land2Hover.endFill();

        gameEntities.separator = game.add.graphics(0, 0);
        gameEntities.separator.beginFill(0x333333, 1);
        gameEntities.separator.drawRect(game.world.width * 0.5 - 2, 0, 4, game.world.height);
        gameEntities.separator.endFill();
    },
    getModifiedSpeed: getModifiedSpeed
};