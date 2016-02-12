/**
 * Flappy Bird 360 - a small clone of Flappy Bird for web using PhaserJS.
 * https://github.com/virtyaluk/flappy-bird-360
 *
 * Copyright (c) 2016 Bohdan Shtepan
 * http://modern-dev.com/
 *
 * Licensed under the MIT license.
 */

module.exports = {
    canvasWidth: document.getElementById('game').clientWidth || 480,
    canvasHeight: document.getElementById('game').clientHeight || 480,
    scene: 'game',

    gameSpeed: 180,
    gravity: 1800,
    birdFlap: 550,

    pipeSpawnMinInterval: 1000,
    pipeSpawnMaxInterval: 2000,
    availableSpaceBetweenPipes: 130,

    cloudSpawnMinTime: 3000,
    cloudSpawnMaxTime: 10000,

    maxDifficult: 100,

    loadingText: 'Loading...',
    titleText: 'Get Ready!',
    instructionsText: 'TOUCH\nTo\nFly',
    highScoreTitleText: 'HIGH SCORE:',

    debugMode: false
};