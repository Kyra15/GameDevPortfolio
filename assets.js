export default {
    // 'audio': {
    //     score: {
    //         key: 'sound',
    //         args: ['assets/sound.mp3', 'assets/sound.m4a', 'assets/sound.ogg']
    //     },
    // },
    'image': {
        indicator: {
            key: 'indicatorIcon',
            args: ['assets/indicator.png', {
                frameWidth: 18,
                frameHeight: 17
            }]
        }
    },
    'spritesheet': {
        // tiles: {
        //     key: 'tiles',
        //     args: ['assets/tiles.png', {
        //         frameWidth: 32,
        //         frameHeight: 32
        //     }]
        // },
        astroidle: {
            key: 'astroidle',
            args: ['assets/astroidle.png', {
                frameWidth: 49,
                frameHeight: 98
            }],
        },
        astroleft: {
            key: 'astroleft',
            args: ['assets/astroleft.png', {
                frameWidth: 49,
                frameHeight: 98
            }],
        },
        astroright: {
            key: 'astroright',
            args: ['assets/astroright.png', {
                frameWidth: 49,
                frameHeight: 98
            }]
        },
        me: {
            key: 'me',
            args: ['assets/meidle.png', {
                frameWidth: 48,
                frameHeight: 96
            }]
        },
    },
    // 'tilemapTiledJSON': {
    //     map: {
    //         key: 'map',
    //         args: ['assets/tilemap.json']
    //     },
    // }
};