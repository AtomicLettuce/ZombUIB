if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('fixcamera', {
    enabled: false,
    init: function () {
        if (navigator.userAgent.includes('Chrome') && navigator.userAgent.includes('Windows')) {
            this.enabled = true;
            const sceneEl = this.el.sceneEl;
            this.onEnterVR = AFRAME.utils.bind(this.onEnterVR, this);
            this.onExitVR = AFRAME.utils.bind(this.onExitVR, this);
            sceneEl.addEventListener('enter-vr', this.onEnterVR);
            sceneEl.addEventListener('exit-vr', this.onExitVR);
            if (sceneEl.is('vr-mode')) {
                onEnterVR();
            }
        }
    },
    remove: function () {
        if (this.enabled) {
            const sceneEl = this.el.sceneEl;
            sceneEl.removeEventListener('enter-vr', this.onEnterVR);
            sceneEl.removeEventListener('exit-vr', this.onExitVR);
        }
    },
    onEnterVR: function () {
        this.el.setAttribute('position', '0 -0.875 0');
    },
    onExitVR: function () {
        this.el.setAttribute('position', '0 0 0');
    }
});

AFRAME.registerComponent("overlay", {
    dependencies: ['material'],
    init: function () {
        this.el.sceneEl.renderer.sortObjects = true;
        this.el.object3D.renderOrder = 100;
        this.el.components.material.material.depthTest = false;
    }
});

AFRAME.registerComponent("player", {
    schema: {
        hp: { type: 'int' },
        playerClass: { type: 'string' },
        gun: { type: 'string' },
        ammo: { type: 'int' },
    },
    init: function () {
        this.hp = 100;
    },
    chooseClass: function (chosenClass) {
        this.playerClass = chosenClass;
        let weapon = document.createElement('a-entity');
        weapon.setAttribute('rotation', '90 90 0');
        weapon.setAttribute('id', 'weapon')
        switch (chosenClass) {
            case 'Infantry':
                this.gun = 'ppsh';
                weapon.setAttribute('gltf-model', '#ppsh');
                weapon.setAttribute('position', '0 -0.15 -0.1"');
                break;
            case 'Gunslinger':
                this.gun = '1911';
                weapon.setAttribute('gltf-model', '#1911');
                weapon.setAttribute('position', '0 -0.075 -0.1');
                break;
            case 'AlternateUniverse':
                this.gun = 'raygun';
                weapon.setAttribute('gltf-model', '#raygun');
                weapon.setAttribute('position', '0 0.075 -0.1');
                weapon.setAttribute('rotation', '75 90 0');
                break;
            case 'Veterinarian':
                this.gun = 'cat';
                weapon.setAttribute('gltf-model', '#cat');
                weapon.setAttribute('position', '0 -0.075 -0.1');
                break;
        }
        this.ammo = cfg.gunProperties[this.gun].MAX_AMMO;
        displayAmmo.textContent = this.ammo + "/" + cfg.gunProperties[this.gun].MAX_AMMO;
        VRHUDAmmo.setAttribute('value', this.ammo + "/" + cfg.gunProperties[this.gun].MAX_AMMO);
        if (document.getElementById('weapon') != null) {
            rightHand.removeChild(document.getElementById('weapon'))
        }
        rightHand.appendChild(weapon);
        cfg.alarmSFX.play();
    },
    shoot: function () {
        if (this.ammo <= 0) {
            return false;
        } else {
            this.ammo--;
            displayAmmo.textContent = this.ammo + "/" + cfg.gunProperties[this.gun].MAX_AMMO;
            VRHUDAmmo.setAttribute('value', this.ammo + "/" + cfg.gunProperties[this.gun].MAX_AMMO);
            return true;
        }
    },
    getHit: function () {
        this.hp = this.hp - 35;
        if (this.hp < 0) {
            console.log('game over');
            this.el.emit('game-over');
        }
        displayHP.textContent = this.hp + " HP";
        VRHUDHP.setAttribute('value', this.hp + " HP");
        cfg.ouchSFX.play();
    },
    heal: function () {
        this.hp = 100;
    },
    reload: function () {
        let reloadValue = Math.floor(cfg.gunProperties[this.gun].MAX_AMMO * 0.10);
        this.ammo = Math.min(this.ammo + reloadValue, cfg.gunProperties[this.gun].MAX_AMMO);
        cfg.reloadSFX.play();
        displayAmmo.textContent = this.ammo + "/" + cfg.gunProperties[this.gun].MAX_AMMO;
        VRHUDAmmo.setAttribute('value', this.ammo + "/" + cfg.gunProperties[this.gun].MAX_AMMO);
    }


});

AFRAME.registerComponent('zombie', {
    schema: {
        hp: { type: 'int', default: 100 },
        headbox: { type: 'string' },
        bodybox: { type: 'string' },
        model3D: { type: 'string' },
        walkStyle: { type: 'string' },
        pathfindProcess: { type: 'number' },
    },

    init: function () {
        // Initialize hitpoints
        this.hp = this.data.hp;

        // Add a head sized hitbox
        this.headbox = document.createElement('a-box');
        this.headbox.setAttribute("class", "headbox");
        this.headbox.setAttribute("visible", "false");
        this.headbox.setAttribute('target');
        this.headbox.setAttribute('position', '0 1.8 -0.15');
        this.headbox.setAttribute('depth', '0.60')
        this.headbox.setAttribute('height', '0.45');
        this.headbox.setAttribute('width', '0.50');
        this.headbox.setAttribute('rotation', '0 0 0');
        this.headbox.setAttribute('color', '#ff0000');
        this.headbox.setAttribute('opacity', '0.5');
        this.el.appendChild(this.headbox);

        // Add a body sized hitbox
        this.bodybox = document.createElement('a-box');
        this.bodybox.setAttribute("class", "bodybox");
        this.bodybox.setAttribute("visible", "false");
        this.bodybox.setAttribute('target');
        this.bodybox.setAttribute('position', '0 0.7875 -0.15');
        this.bodybox.setAttribute('depth', '0.60')
        this.bodybox.setAttribute('height', '1.575');
        this.bodybox.setAttribute('width', '0.50');
        this.bodybox.setAttribute('rotation', '0 0 0');
        this.bodybox.setAttribute('color', '#0000ff');
        this.bodybox.setAttribute('opacity', '0.5');
        this.el.appendChild(this.bodybox);

        // Add zombie 3D model
        this.model3D = document.createElement('a-entity');
        this.model3D.setAttribute('class', 'model')
        this.model3D.setAttribute('gltf-model', '#zombie_model');
        this.walkStyle = 'clip:DrunkWalk;';
        this.model3D.setAttribute('animation-mixer', this.walkStyle);
        this.el.appendChild(this.model3D);

        // Zombie Pathfinding
        this.el.setAttribute('nav-agent');
        this.el.addEventListener('navigation-end', () => this.hitPlayer(this.el));
        this.pathfindProcess = setInterval(this.pathfind, cfg.ZOMBIE_PATHFIND_TIME, this.el);
    },



    pathfind: function (element) {
        element.querySelector('.model').setAttribute('animation-mixer', element.components['zombie'].walkStyle + 'loop:repeat;clampWhenFinished:false');
        element.setAttribute('nav-agent', {
            active: false
        });
        element.setAttribute('nav-agent', {
            active: true,
            destination: cameraRig.getAttribute('position')
        });
    },

    // Enemies will be able to attack the player once they have reach their destination
    hitPlayer: function (element) {
        // If the enemy is close to the player, then punch them
        if (element.getAttribute('position').distanceTo(cameraRig.getAttribute('position')) < 1.5) {
            element.querySelector('.model').setAttribute('animation-mixer', 'clip:Punch; timeScale:1.5; loop:once;clampWhenFinished:true;');
            cameraRig.components['player'].getHit();
        }
        // However if the enemy is not close to them, it may have glitched out of the navmesh and will never be able to find them again
        else {
            // Check if the enemy has glitched out of the navmesh
            let zombiePos = element.getAttribute('position').clone()
            zombiePos.add(new THREE.Vector3(0, 1, 0));
            let intersect = new THREE.Raycaster(zombiePos, new THREE.Vector3(0, -1, 0)).intersectObject(floor.object3D);
            // If so, kill it
            if (intersect.length === 0) {
                element.components['zombie'].updateHP(1000000, false);
                console.log('death by suffocation');
            }
        }
    },


    updateHP: function (damage, isHeadshot) {
        this.hp = Math.max(0, this.hp - damage);
        console.log(this.hp);
        cfg.hitmarkerSFX.cloneNode(true).play();

        // Heavily wounded scenario (zombie must be low hp for it to happen + a bit of luck (25%) )
        if (this.hp < 50 && Math.random() < 0.25) {
            this.walkStyle = 'clip:Crawl;'
            // Adjust model animation
            this.model3D.setAttribute('animation-mixer', this.walkStyle);

            // Adjsut hitboxes
            this.bodybox.setAttribute('depth', '1.4');
            this.bodybox.setAttribute('position', '0 0.25 -0.5');
            this.bodybox.setAttribute('height', '0.5');

            this.headbox.setAttribute('position', '0 0.5 0.5');
            this.headbox.setAttribute('height', '0.8')
        }
        // Dead scenario
        if (this.hp === 0) {
            // Alert of its demise
            this.el.emit("dead", { isHeadshot: isHeadshot });
            // Clear pathfinder process
            clearInterval(this.pathfindProcess);
            // Make it move no more
            this.el.removeAttribute('nav-agent');

            // Death animation
            if (Math.random() < 0.9) {
                this.model3D.setAttribute('animation-mixer', 'clip:Death; timeScale:1.25; loop:once; clampWhenFinished:true');
            }
            // 10% to have a different animation
            else {
                this.model3D.setAttribute('animation-mixer', 'clip:Dying; timeScale:1.25; loop:once; clampWhenFinished:true');
            }

            // 5% to give ammo to player
            if (Math.random() < 0.05) {
                cameraRig.components['player'].reload();
            }

            this.el.removeChild(this.headbox);
            this.el.removeChild(this.bodybox);

            // When dead, remove the corpse after 20 seconds
            setTimeout(() => {
                this.delete();
            }, cfg.ZOMBIE_CORPSE_TIME);
        }
    },


    delete: function () {
        this.model3D.removeObject3D("mesh");
        this.model3D.components['gltf-model'].model.traverse(disposeNode);
        this.model3D.components['gltf-model'].model = null;
        THREE.Cache.clear();

        this.model3D.sceneEl.renderer.renderLists.dispose();
        this.model3D.remove();

        this.el.parentElement.removeChild(this.el);


    }
});

AFRAME.registerComponent('irregular-polygon', {
    schema: {
        vertices: { type: 'string', default: '' } // Comma-separated list of vertex coordinates
    },
    init: function () {
        const vertices = this.data.vertices.split(',').map(coord => coord.trim().split(' ').map(parseFloat));
        const shape = new THREE.Shape(vertices.map(v => new THREE.Vector3(v[0], v[2]))); // Use X and Z coordinates
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        this.el.setObject3D('mesh', mesh);
        //this.el.object3D.add(mesh);
    }
});

AFRAME.registerComponent('zombie-game', {
    schema: {
        round: { type: 'int' } // Round the player is currently in
        , zombie_hp: { type: 'int' } // hit points zombies will have
        , remaining_zombies: { type: 'int' } // how many zombies of this round are still alive
        , kills: { type: 'int' } //player kills
        , headashot_kills: { type: 'int' } // player kills which have been headshot kills
        , spawn_cooldown: { type: 'int' } // cooldown time between two zombie spawns
        , playerName: { type: 'string' }
    },
    init: function () {
        this.round = 0;
        this.remaining_zombies = Math.round(this.round * 0.2 * 24);
        this.kills = 0;
        this.headashot_kills = 0;
        if (localStorage.getItem('enterVR') == 'true') {
            localStorage.removeItem('enterVR');
            myScene.enterVR();
            inVR = true;
        }
        cameraRig.addEventListener('game-over', (evt) => this.gameOver(evt));
    },
    replay: function () {
        localStorage.setItem('enterVR', inVR);
        window.location.reload();
    },

    gameOver: function (evt) {
        // 1. Delete all zombies
        let leftOverZombies = document.querySelectorAll('[zombie]');
        leftOverZombies.forEach(zombie => {
            zombie.remove();
        });
        // 2. Delete maze
        mazeEntity.remove();
        // 3. Go to game over lobby
        if (inVR) {
            leftHand.remove();
            let lh = document.createElement('a-entity');
            lh.setAttribute('laser-controls', 'hand: left;');
            lh.setAttribute('id', 'leftHand');
            lh.setAttribute('cursor');
            lh.setAttribute('raycaster', 'far: 5;');
            cameraRig.appendChild(lh);
        }
        gameOverFloor.setAttribute('nav-mesh', '');
        cameraRig.setAttribute('position', '-80 0 -38');
        // 4. send info to server
        let game = {
            round: this.round,
            kills: this.kills,
            headshotkills: this.headashot_kills,
            playerName: this.playerName,
        }
        console.log(game);

        fetch('/gameOver', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(game)
        }).then(response => {
            if (response.ok) {
                console.log('Data sent successfully!');
            } else {
                console.error('Failed to send data:', response.statusText);
            }
        })
            .catch(error => {
                console.error('Error sending data:', error);
            });

        console.log('zombie game over');
    }
    ,
    startRound: function () {
        this.round++;
        this.remaining_zombies = Math.round(this.round * 0.2 * 24);
        this.zombie_hp = this.round * 100;
        cfg.ROUND_SONG.play();
        this.spawn_cooldown = Math.max(0.1, 2 * Math.pow(0.80, (this.round - 1))) * 1000;
        setTimeout(() => {
            displayRound.textContent = this.round;
            VRHUDRound.setAttribute('value', this.round);
            for (let i = 0; i < Math.min(cfg.MAX_ZOMBIES, this.remaining_zombies); i++) {
                // Spawn a zombie (add a little delay so that not all zombies spawn all at once in a cluster)
                setTimeout(() => { this.createZombie() }, i * this.spawn_cooldown);
            }
        }, cfg.ROUND_START_TIME);

    },

    createZombie: function () {
        // Get random coordinates to generate a zombie. (They will spawn in random locations but
        // nearby the player)
        let pos = cameraRig.getAttribute('position');

        // Cell coordinates where the player is
        let l = Math.round(pos.x / cfg.MAZE.MAZE_CELL_SIZE);
        let j = Math.round(pos.z / cfg.MAZE.MAZE_CELL_SIZE);

        // Get random nearby cell
        l = l + Math.floor((Math.random() * 6)) - 3;
        if (l < 0) {
            l = 0
        }
        if (l > MAZE_COLS) {
            l = MAZE_COLS
        }

        j = j + Math.floor((Math.random() * 6)) - 3;
        if (j < 0) {
            j = 0
        }
        if (j > MAZE_COLS) {
            j = MAZE_COLS
        }

        let x = l * cfg.MAZE.MAZE_CELL_SIZE + (Math.random() *
            (cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2));
        let z = j * cfg.MAZE.MAZE_CELL_SIZE + Math.random() *
            (cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) - (cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2;


        var zombie = document.createElement('a-entity');
        zombie.setAttribute('zombie', 'hp:' + this.zombie_hp);
        let position = x + " 0 " + z;
        zombie.setAttribute('position', position);
        // Add event listener of death
        zombie.addEventListener('dead', (evt) => { this.zombieDeathListener(evt) });

        this.el.appendChild(zombie);
    },
    // manage zombie deaths
    zombieDeathListener: function (evt) {
        this.headashot_kills = this.headashot_kills + evt.detail.isHeadshot;
        this.remaining_zombies--;
        this.kills++;
        if (this.remaining_zombies <= 0) {
            this.startRound();

        }
        evt.srcElement.removeEventListener('dead', (evt) => { this.zombieDeathListener(evt) });

        if ((cfg.MAX_ZOMBIES - this.remaining_zombies) <= 0) {
            setTimeout(() => { this.createZombie() }, this.spawn_cooldown);
        }

    }
});