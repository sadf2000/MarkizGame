// FirstPersonControls.js - Simple Implementation


class FirstPersonControls {

    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = (domElement !== undefined) ? domElement : document;

        // Параметры управления
        this.movementSpeed = 5.0;   // Скорость движения
        this.lookSpeed = 0.005;      // Скорость поворота
        this.mouseSensitivity = 0.002;
        this.lookVertical = true;    // Разрешить смотреть вверх/вниз
        this.constrainVertical = true; // Ограничить угол обзора по вертикали
        this.verticalMin = 1.0;      // Минимальный угол обзора по вертикали (радианы)
        this.verticalMax = 2.0;      // Максимальный угол обзора по вертикали (радианы)

        // Внутренние переменные
        this.isLocked = false;   // Состояние "запертого" курсора (для mouse-lock)
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveQ = false;
        this.moveE = false;

        this.pitchObject = new THREE.Object3D();
        this.pitchObject.add(camera);
        this.yawObject = new THREE.Object3D();
        this.yawObject.position.y = 10; // Начальная позиция
        this.yawObject.add(this.pitchObject);

        // Обработчики событий
        this.onMouseMove = this.onMouseMove.bind(this);  // Привязка контекста
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onPointerLockChange = this.onPointerLockChange.bind(this);
        this.onPointerLockError = this.onPointerLockError.bind(this);

        this.domElement.addEventListener('mousemove', this.onMouseMove, false);
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);

        // Pointer Lock API (mouse-lock)
        document.addEventListener('pointerlockchange', this.onPointerLockChange, false);
        document.addEventListener('pointerlockerror', this.onPointerLockError, false);
        this.domElement.addEventListener('click', () => {
            if (!this.isLocked) {
                this.domElement.requestPointerLock();
            }
        });
    }

    // Методы для управления мышью
    onMouseMove(event) {
         // Проверяем, заперт ли курсор
            const movementX = event.movementX || 0;
            const movementY = event.movementY || 0;

            this.yawObject.rotation.y -= movementX * this.mouseSensitivity * 4*2;
            this.pitchObject.rotation.x -= movementY * this.mouseSensitivity *4*2;

            this.pitchObject.rotation.x = Math.max(- Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));  // Ограничиваем вертикальный угол
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW': this.moveForward = true; break;
            case 'KeyS': this.moveBackward = true; break;
            case 'KeyA': this.moveLeft = true; break;
            case 'KeyD': this.moveRight = true; break;
            case 'KeyQ': this.moveQ = true; break;
            case 'KeyE': this.moveE = true; break;
            case 'KeyC': this.moveT = true; break;
        }
    }

    onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.moveForward = false; break;
            case 'KeyS': this.moveBackward = false; break;
            case 'KeyA': this.moveLeft = false; break;
            case 'KeyD': this.moveRight = false; break;
            case 'KeyQ': this.moveQ = false; break;
            case 'KeyE': this.moveE = false; break;
            case 'KeyC': this.moveT = false; break;
        }
    }

    // Pointer Lock API callbacks
    onPointerLockChange() {
        if (document.pointerLockElement === this.domElement) {
            this.isLocked = true;
        } else {
            this.isLocked = false;
        }
    }

    onPointerLockError() {
        console.error('PointerLock API error');
    }

    // Метод для обновления (вызывается в animate())
    update(delta) {
        const actualMoveSpeed = this.movementSpeed * delta;

        if (this.moveForward) {
            this.yawObject.translateZ(-actualMoveSpeed);
        }
        if (this.moveBackward) {
            this.yawObject.translateZ(actualMoveSpeed);
        }
        if (this.moveLeft) {
            this.yawObject.translateX(-actualMoveSpeed);
        }
        if (this.moveRight) {
            this.yawObject.translateX(actualMoveSpeed);
        }
        if (this.moveQ) {
            this.yawObject.translateY(-actualMoveSpeed);
        }
        if (this.moveE) {
            this.yawObject.translateY(actualMoveSpeed);
        }
        if (this.moveT) {
            this.movementSpeed = 100.0;
        }else{
            this.movementSpeed = 5.0
        }
    }

    getDirection(targetVector) {
        targetVector.set(0, 0, -1);
        targetVector.applyQuaternion(this.pitchObject.quaternion);
        return targetVector;
    }

    getObject() {
        return this.yawObject;
    }
}