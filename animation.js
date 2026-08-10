import ASSETS from './assets.js';

export default {
    astro:
    {
        left: {
            key: 'astro-left',
            texture: ASSETS.spritesheet.astroleft.key,
            frameRate: 4,
            config: { frames: [ 0, 1, 2, 3 ] },
            repeat: 0
        },
        right:
        {
            key: 'astro-right',
            texture: ASSETS.spritesheet.astroright.key,
            frameRate: 4,
            config: { frames: [ 0, 1, 2, 3 ] },
            repeat: 0
        },
        idle :{
            key: 'astro-idle',
            texture: ASSETS.spritesheet.astroidle.key,
            frameRate: 2,
            config: { frames: [0, 1] },
            repeat: -1
        }
    },

    me: {
        idle: {
            key: "me-idle",
            texture: ASSETS.spritesheet.me.key,
            frameRate: 2,
            config: { frames: [0, 1]},
            repeat: -1
        }
    }
};