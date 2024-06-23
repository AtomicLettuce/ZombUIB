const MIN_DAMAGE = 5;
var playerName = '';
var inVR = false;
var shootingId = null;
var debounceTimer = null;

function disposeNode(node) {
	if (node instanceof THREE.Mesh) {
		const geometry = node.geometry;
		if (geometry) {
			geometry.dispose();
		}

		const material = node.material;
		if (material) {
			if (Array.isArray(material)) {
				for (let i = 0, l = material.length; i < l; i++) {
					const m = material[i];
					disposeTextures(m);
					m.dispose();
				}
			} else {
				disposeTextures(material);
				material.dispose(); // disposes any programs associated with the material
			}
		}
	}
}

function disposeTextures(material) {
	// Explicitly dispose any textures assigned to this material
	for (const propertyName in material) {
		const texture = material[propertyName];
		if (texture instanceof THREE.Texture) {
			const image = texture.source.data;
			if (image instanceof ImageBitmap) {
				image.close && image.close();
			}
			texture.dispose();
		}
	}
}





function draw3DMaze() {
	if(document.getElementById('mazeEntity')){
		console.log(document.getElementById('mazeEntity'))
		mazeEntity.delete();
	}
	var mazeEntity = document.createElement('a-entity');
	mazeEntity.setAttribute('id', 'mazeEntity');
	for (let x = 0; x < MAZE_ROWS; x++) {
		for (let z = 0; z < MAZE_COLS; z++) {
			// Eastern wall for each cell
			if (MAZE_MATRIX[x][z].east) {
				let wall = document.createElement("a-box");
				wall.setAttribute("material", "src: #wall_texture");
				wall.setAttribute("width", cfg.MAZE.MAZE_CELL_SIZE.toString());
				wall.setAttribute("depth", (cfg.MAZE.MAZE_WALL_THICKNESS - 0.05).toString());
				wall.setAttribute("height", cfg.MAZE.MAZE_WALL_HEIGHT);
				let pos = ((z * cfg.MAZE.MAZE_CELL_SIZE) + (0.5 * cfg.MAZE.MAZE_CELL_SIZE)).toString() + " " + (cfg.MAZE.MAZE_WALL_HEIGHT / 2).toString() + " " + (x * cfg.MAZE.MAZE_CELL_SIZE).toString();
				wall.setAttribute("position", pos);
				wall.setAttribute("rotation", "0 90 0");
				mazeEntity.appendChild(wall);
			}
			// Southern walls for each cell
			if (MAZE_MATRIX[x][z].south) {
				let wall = document.createElement("a-box");
				wall.setAttribute("material", "src: #wall_texture");
				wall.setAttribute("width", cfg.MAZE.MAZE_CELL_SIZE.toString());
				wall.setAttribute("depth", (cfg.MAZE.MAZE_WALL_THICKNESS - 0.05).toString());
				wall.setAttribute("height", cfg.MAZE.MAZE_WALL_HEIGHT);
				let pos = (z * cfg.MAZE.MAZE_CELL_SIZE).toString() + " " + (cfg.MAZE.MAZE_WALL_HEIGHT / 2).toString() + " " + ((x * cfg.MAZE.MAZE_CELL_SIZE) + 0.5 * cfg.MAZE.MAZE_CELL_SIZE).toString();
				wall.setAttribute("position", pos);
				mazeEntity.appendChild(wall);
			}
			// North-est walls (maze-wise)
			if (x === 0) {
				let wall = document.createElement("a-box");
				wall.setAttribute("material", "src: #wall_texture");
				wall.setAttribute("width", cfg.MAZE.MAZE_CELL_SIZE.toString());
				wall.setAttribute("depth", (cfg.MAZE.MAZE_WALL_THICKNESS - 0.05).toString());
				wall.setAttribute("height", cfg.MAZE.MAZE_WALL_HEIGHT);
				let pos = (z * cfg.MAZE.MAZE_CELL_SIZE).toString() + " " + (cfg.MAZE.MAZE_WALL_HEIGHT / 2).toString() + " " + ((x * cfg.MAZE.MAZE_CELL_SIZE) - 0.5 * cfg.MAZE.MAZE_CELL_SIZE).toString();
				wall.setAttribute("position", pos);
				mazeEntity.appendChild(wall);
			}
			// West-est walls (maze-wise)
			if (z === 0) {
				let wall = document.createElement("a-box");
				wall.setAttribute("material", "src: #wall_texture");
				wall.setAttribute("width", cfg.MAZE.MAZE_CELL_SIZE.toString());
				wall.setAttribute("depth", (cfg.MAZE.MAZE_WALL_THICKNESS - 0.05).toString());
				wall.setAttribute("height", cfg.MAZE.MAZE_WALL_HEIGHT);
				let pos = ((z * cfg.MAZE.MAZE_CELL_SIZE) - 0.5 * cfg.MAZE.MAZE_CELL_SIZE).toString() + " " + (cfg.MAZE.MAZE_WALL_HEIGHT / 2).toString() + " " + (x * cfg.MAZE.MAZE_CELL_SIZE).toString();
				wall.setAttribute("position", pos);
				wall.setAttribute("rotation", "0 90 0");
				mazeEntity.appendChild(wall);
			}
		}
	}
	myScene.appendChild(mazeEntity);
}


function createFloor() {
	var floor = document.createElement('a-entity');
	floor.setAttribute('id', 'floor');
	floor.setAttribute('irregular-polygon', "vertices: 0 0 0, 1 0 4, 3 0 5, 3 0 3, 4 0 3, 4 0 0;");
	floor.setAttribute('position', '0 0 0');
	floor.setAttribute('rotation', '90 0 0');

	var vertices = [];
	// Save first vertex
	var first_vertex = (-(cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2).toString() + " 0 " + (-(cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2).toString();
	vertices.push(first_vertex);

	var current_vertex = '';
	var direction = 'east'
	var current_cell = [0, 0];
	while (!(current_vertex === first_vertex)) {
		switch (direction) {
			case 'north':
				while (!MAZE_MATRIX[current_cell[0]][current_cell[1]].north && MAZE_MATRIX[current_cell[0]][current_cell[1]].west) {
					current_cell[0]--;
				}
				// SCENARIOS where we don't continue going south because we no longer have a wall to follow
				if (!MAZE_MATRIX[current_cell[0]][current_cell[1]].west) {
					current_cell[0]++;


					/*
						SCENARIO
		  
						  |      |
						  | _    |
						  |__|___|          
					  */
					if (MAZE_MATRIX[current_cell[0] - 1][current_cell[1] - 1].south) {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[0]--;
						current_cell[1]--;

						z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE) / 2);
						x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'west';
					}
					/*
					 SCENARIO
					   
					   |      |
					   |      |
					   |___|__|          
				   */
					else {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[1]--;
						x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'south'
					}
				}
				// SCENARIO where we no longer go north because we found an obstace
				/*
				  SCENARIO
		
					  |      |
					  |    _ |
					  |___|__|
			    
				*/
				else {
					var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
					z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
					var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
					x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

					current_vertex = x.toString() + " 0 " + z.toString();
					vertices.push(current_vertex);

					direction = 'east';
				}
				break;
			case 'east':
				while (!MAZE_MATRIX[current_cell[0]][current_cell[1]].east && MAZE_MATRIX[current_cell[0]][current_cell[1]].north) {
					current_cell[1]++;
				}
				// SCENARIOS where we don't continue going east because we no longer have a wall to follow
				if (!MAZE_MATRIX[current_cell[0]][current_cell[1]].north) {
					current_cell[1]--;
					/*
					  SCENARIO
						_______
						|      |
						|___|  |
						|      |          
					*/
					if (MAZE_MATRIX[current_cell[0] - 1][current_cell[1] + 1].west) {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[0]--;
						current_cell[1]++;

						z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'north';
					}

					/*
					  SCENARIO
						_______
						|      |
						|___   |
						|      |          
					*/
					else {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[0]--;
						z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'west'

					}


				}
				// SCENARIO where we no longer go east because we found an obstace
				/*
				  SCENARIO
					  _______
					  |__    |
					  |  |   |
					  |      |
			    
				*/
				else {
					var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
					z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
					var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
					x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

					current_vertex = x.toString() + " 0 " + z.toString();
					vertices.push(current_vertex);

					direction = 'south';
				}


				break;
			case 'south':
				while (!MAZE_MATRIX[current_cell[0]][current_cell[1]].south && MAZE_MATRIX[current_cell[0]][current_cell[1]].east) {
					current_cell[0]++;
				}

				// SCENARIOS where we don't continue going south because we no longer have a wall to follow
				if (!MAZE_MATRIX[current_cell[0]][current_cell[1]].east) {
					current_cell[0]--;
					/*
					  SCENARIO
						_______
						| |_   |
						|      |
						|      |          
					*/
					if (MAZE_MATRIX[current_cell[0] + 1][current_cell[1] + 1].north) {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[0]++;
						current_cell[1]++;

						z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'east';
					}
					/*
					  SCENARIO
						_______
						| |    |
						|      |
						|      |          
					*/
					else {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[1]++;
						x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'north'
					}
				}
				// SCENARIO where we no longer go south because we found an obstace
				/*
				  SCENARIO
					  _______
					  | _|   |
					  |      |
					  |      |
			    
				*/
				else {
					var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
					z = z + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
					var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
					x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

					current_vertex = x.toString() + " 0 " + z.toString();
					vertices.push(current_vertex);

					direction = 'west';
				}
				break;


			case 'west':
				while (!MAZE_MATRIX[current_cell[0]][current_cell[1]].west && MAZE_MATRIX[current_cell[0]][current_cell[1]].south) {
					current_cell[1]--;
				}

				// SCENARIOS where we don't continue going west because we no longer have a wall to follow
				if (!MAZE_MATRIX[current_cell[0]][current_cell[1]].south) {
					current_cell[1]++;

					/*
					  SCENARIO
						_______
						|   ___|
						|   |  |
						|      |          
					*/
					if (MAZE_MATRIX[current_cell[0] + 1][current_cell[1] - 1].east) {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[0]++;
						current_cell[1]--;

						z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'south';
					}
					/*
					  SCENARIO
						_______
						|   ___|
						|      |
						|      |          
					*/
					else {
						var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
						var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
						x = x - ((cfg.MAZE.MAZE_CELL_SIZE) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						current_cell[0]++;
						z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
						z = z - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

						current_vertex = x.toString() + " 0 " + z.toString();
						vertices.push(current_vertex);

						direction = 'east'
					}
				}
				// SCENARIO where we no longer go west because we found an obstace
				/*
				  SCENARIO
					  _______
					  |  |__ |
					  |      |
					  |      |
			    
				*/
				else {
					var z = current_cell[0] * cfg.MAZE.MAZE_CELL_SIZE;
					z = z + ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);
					var x = current_cell[1] * cfg.MAZE.MAZE_CELL_SIZE;
					x = x - ((cfg.MAZE.MAZE_CELL_SIZE - cfg.MAZE.MAZE_WALL_THICKNESS) / 2);

					current_vertex = x.toString() + " 0 " + z.toString();
					vertices.push(current_vertex);

					direction = 'north';
				}
				break;
		}
	}

	// Delete last vertex for good measure (last vertex is equal to first vertex)
	vertices.pop();

	floor.setAttribute('irregular-polygon', "vertices: " + vertices.toString());
	floor.setAttribute('nav-mesh', '');
	floor.setAttribute('visible', 'false');
	floor.setAttribute('class', 'navmesh');

	return floor;
}

function startGame() {
	// Cannot Start game without class and name
	if (myScene.components['zombie-game'].playerName == null || cameraRig.components['player'].playerClass == null) {
		return;
	}
	if (inVR) {

		// Shoot Listeners
		rightHand.addEventListener('triggerdown', () => {
			if (debounceTimer) {
				return;
			}
			clearInterval(shootingId)
			// Rate of fire in milliseconds
			let rof = 1000 / (cfg.gunProperties[cameraRig.components['player'].gun].RPM / 60);
			shootRay();
			shootingId = setInterval(shootRay, rof);
			
			debounceTimer = setTimeout(() => {
				debounceTimer = null;
			}, cfg.DEBOUNCE_TIME);
		});
		rightHand.addEventListener('triggerup', () => {
			clearInterval(shootingId);
		});

		leftHand.remove();
		let lh = document.createElement('a-entity');
		lh.setAttribute('hand-controls','hand: left;');
		lh.setAttribute('id','leftHand')
		cameraRig.appendChild(lh);

	} else {
		document.addEventListener('mousedown', () => {
			if (debounceTimer) {
				console.log('debounced')
				return;
			}
			clearInterval(shootingId)
			// Rate of fire in milliseconds
			let rof = 1000 / (cfg.gunProperties[cameraRig.components['player'].gun].RPM / 60);
			shootRay();
			shootingId = setInterval(shootRay, rof);
			
			debounceTimer = setTimeout(() => {
				debounceTimer = null;
			}, cfg.DEBOUNCE_TIME);
		});

		document.addEventListener('mouseup', () => {
			console.log('mouseup', shootingId);
			clearInterval(shootingId);
		});
	}

	draw3DMaze();
	let floor = createFloor();
	gameLobby.remove();
	mazeEntity.appendChild(floor);

	cameraRig.setAttribute('position', '0 0 0');

	myScene.components['zombie-game'].startRound();
}



function registrationInput(e) {
	var code = parseInt(e.detail.code);

	switch (code) {
		// Case delete
		case 8:
			playerName = playerName.substring(0, playerName.length - 1);
			break;
		// Case enter
		case 13:
			if (playerName.length > 0) {
				myScene.components['zombie-game'].playerName = playerName;
				document.removeEventListener('a-keyboard-update', registrationInput);
				document.getElementById('registrationMenu').remove();
				cameraRig.setAttribute('movement-controls', 'controls: keyboard, gamepad; constrainToNavmesh: true;');
			}
			return;
		// Case submit
		case 6:
			if (playerName.length > 0) {
				myScene.components['zombie-game'].playerName = playerName;
				document.removeEventListener('a-keyboard-update', registrationInput);
				document.getElementById('registrationMenu').remove();
				cameraRig.setAttribute('movement-controls', 'controls: keyboard, gamepad; constrainToNavmesh: true;');
			}
			return;
		// " Case
		case 34:
			break;
		// ' case
		case 219:
			break;
		default:
			//console.log(e);
			playerName = playerName + e.detail.value
			break;
	}
	document.querySelector('#input').setAttribute('value', playerName);
}

function createLeadeboards() {
	fetch('/leaderboards')
		.then(response => response.json())
		.then(data => {

			for (let i = 0; i < 10; i++) {
				document.querySelector('#leaderboard' + (i + 1) + 'name').setAttribute('value', data[i].playerName);
				document.querySelector('#leaderboard' + (i + 1) + 'rounds').setAttribute('value', data[i].round);
				document.querySelector('#leaderboard' + (i + 1) + 'kills').setAttribute('value', data[i].kills);
				document.querySelector('#leaderboard' + (i + 1) + 'hskills').setAttribute('value', data[i].headshotKills);
			}
		});
}

function shootRay() {
	// 1. check if can shoot 
		// (timing) (event listener takes care of that)
	if(!cameraRig.components['player'].shoot()){
		return;
	}
	// 2. shoot
	if (!inVR) {
		// Shoot out a single ray
		var origin = new THREE.Vector3().setFromMatrixPosition(myCamera.object3D.matrixWorld);
		var direction = new THREE.Vector3();
		myCamera.object3D.getWorldDirection(direction);
		direction.multiplyScalar(-1.0);
		var raycaster = new THREE.Raycaster(origin, direction);
		// Has it impacted any target?
		var targets = Array.from(document.querySelectorAll('[target]')).map(obj => obj.object3D);
		var impacts = raycaster.intersectObjects(targets);

		// To facilitate the drawing process
		origin.y=origin.y-0.1;
		
	} else {
		var origin = new THREE.Vector3().setFromMatrixPosition(rightHand.object3D.matrixWorld);
		origin.y=origin.y+cfg.gunProperties[cameraRig.components['player'].gun].originYCorrection;
		var direction = new THREE.Vector3();
		var rightHandQuaternion = new THREE.Quaternion();
		rightHand.object3D.getWorldQuaternion(rightHandQuaternion);
		direction.set(0, -1, 0).applyQuaternion(rightHandQuaternion);

		var raycaster = new THREE.Raycaster(origin, direction);

		// Has it impacted any target?
		var targets = Array.from(document.querySelectorAll('[target]')).map(obj => obj.object3D);
		var impacts = raycaster.intersectObjects(targets);
	}
	// 3. Draw shot
	direction.multiplyScalar(50);
	direction.add(origin);
	let shot = document.createElement('a-entity');
	lineAttr = 'start: ' + origin.x + ' ' + origin.y + ' ' + origin.z + '; end: ' + direction.x + ' ' + direction.y + ' ' + direction.z + '; color: '+cfg.gunProperties[cameraRig.components['player'].gun].bulletColor;
	shot.setAttribute('line', lineAttr);
	myScene.append(shot)
	setTimeout(() => myScene.removeChild(shot), 250)

	// 4. play sound
	cfg.gunProperties[cameraRig.components['player'].gun].sfx.cloneNode(true).play();
	// 5. check impacts
	if (impacts.length > 0) {
		checkImpacts(impacts);
	}
}
function checkImpacts(impacts) {
	for (let i = 0; i < impacts.length; i++) {
		// Penetrating bullets have less damage
		let damage_given = Math.max((cfg.gunProperties[cameraRig.components['player'].gun].DAMAGE - (10 * i)), cfg.MIN_DAMAGE);
		if (impacts[i].object.el.classList.contains("headbox")) {
			damage_given = damage_given * 1.5;
			// Apply damage to every zombie hit
			impacts[i].object.el.parentElement.components['zombie'].updateHP(damage_given, true);
		} else {
			// Apply damage to every zombie hit
			impacts[i].object.el.parentElement.components['zombie'].updateHP(damage_given, false);
		}
	}
}


createLeadeboards();
document.addEventListener('a-keyboard-update', registrationInput);
myScene.addEventListener('enter-vr', () => {
	//  <a-entity id="leftHand" cursor raycaster="far:5" laser-controls="hand: left; max-distance: 20;"></a-entity>
	// <a-entity id="rightHand" hand-controls="hand: right;"></a-entity>
	inVR = true;

	cursorSights.remove();

	var leftHand = document.createElement('a-entity');
	leftHand.setAttribute('id', 'leftHand');
	leftHand.setAttribute('cursor');
	leftHand.setAttribute('raycaster', 'far: 5;');
	leftHand.setAttribute('laser-controls', 'hand: left;');
	cameraRig.appendChild(leftHand);

	myCamera.removeChild(rightHand);
	var rh = document.createElement('a-entity');
	rh.setAttribute('hand-controls', 'hand: right;');
	rh.setAttribute('id', 'rightHand');
	cameraRig.appendChild(rh);
});