const cfg = {
    MAZE: {
        MAZE_CELL_SIZE: 7,
        MAZE_WALL_HEIGHT: 7,
        MAZE_WALL_THICKNESS: "0.75",
    },
    gunProperties: {
        ppsh: { model: '#ppsh', MAX_AMMO: 600, DAMAGE: 40, RPM: 400, sfx: new Audio('../assets/Weapons/Ppsh/sfx.mp3'), originYCorrection: 0.11, bulletColor: '#515151' },
        1911: { model: '#cat', MAX_AMMO: 240, DAMAGE: 40, RPM: 115, sfx: new Audio('../assets/Weapons/1911/sfx.mp3'), originYCorrection: 0.11, bulletColor: '#D3D3D3' },
        raygun: { model: '#raygun', MAX_AMMO: 120, DAMAGE: 150, RPM: 150, sfx: new Audio('../assets/Weapons/Raygun/sfx.mp3'), originYCorrection: 0.11, bulletColor: '#A0FC24' },
        cat: { model: '#cat', MAX_AMMO: 9999, DAMAGE: 15, RPM: 80, sfx: new Audio('../assets/Weapons/Cat/sfx.mp3'), originYCorrection: 0.11, bulletColor: '#FF69B4' }
    },
    zombieModels: {
        warZombie: 'a',
        zombieGirl: 'a'
    },
    reloadSFX: new Audio('../assets/sfx/reload.mp3'),
    hitmarkerSFX: new Audio('../assets/sfx/hitmarker.mp3'),
    ROUND_SONG: new Audio('../assets/sfx/round_music_v3.mp3'),
    alarmSFX: new Audio('../assets/sfx/alarm.mp3'),
    ouchSFX: new Audio('../assets/sfx/ouch.mp3'),
    MAX_ZOMBIES: 20,
    MIN_DAMAGE: 5,
    DEBOUNCE_TIME: 20,
    ZOMBIE_CORPSE_TIME: 5000,
    ZOMBIE_PATHFIND_TIME: 3000,
    ROUND_START_TIME: 15000,
}