var THREE = THREE || {};

(function () {

    var PointerLockControls = function (camera, domElement) {

        this.camera = camera;
        this.domElement = domElement || document.body;

        this.isLocked = false;

        this.moveX = 0;
        this.moveY = 0;

        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;

        var scope = this;

        function onMouseMove(event) {
            if (scope.isLocked === false) return;

            scope.moveX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            scope.moveY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        }

        function onPointerlockChange() {
            if (document.pointerLockElement === scope.domElement) {
                scope.dispatchEvent({ type: 'lock' });
                scope.isLocked = true;
            } else {
                scope.dispatchEvent({ type: 'unlock' });
                scope.isLocked = false;
            }
        }

        function onPointerlockError() {
            console.error('THREE.PointerLockControls: Unable to use Pointer Lock API');
        }

        this.connect = function () {
            document.addEventListener('mousemove', onMouseMove, false);
            document.addEventListener('pointerlockchange', onPointerlockChange, false);
            document.addEventListener('pointerlockerror', onPointerlockError, false);
        };

        this.disconnect = function () {
            document.removeEventListener('mousemove', onMouseMove, false);
            document.removeEventListener('pointerlockchange', onPointerlockChange, false);
            document.removeEventListener('pointerlockerror', onPointerlockError, false);
        };

        this.dispose = function () {
            this.disconnect();
        };

        this.getObject = function () {
            return scope.camera;
        };

        this.getMoveX = function () {
            return scope.moveX || 0;
        };

        this.getMoveY = function () {
            return scope.moveY || 0;
        };

        this.getDirection = function (v) {
            var quaternion = new THREE.Quaternion();
            return function (v) {
                return v.copy(scope.camera.getWorldDirection()).applyQuaternion(quaternion.copy(scope.camera.quaternion).inverse());
            };
        }();

        this.moveForward = function (distance) {
            var direction = new THREE.Vector3();
            return function (distance) {
                direction.set(0, 0, 1).applyQuaternion(scope.camera.quaternion);
                scope.camera.position.add(direction.multiplyScalar(distance));
            };
        }();

        this.moveRight = function (distance) {
            var direction = new THREE.Vector3();
            return function (distance) {
                direction.set(1, 0, 0).applyQuaternion(scope.camera.quaternion);
                scope.camera.position.add(direction.multiplyScalar(distance));
            };
        }();

        this.lock = function () {
            this.domElement.requestPointerLock();
        };

        this.unlock = function () {
            document.exitPointerLock();
        };

        this.connect();
    };

    PointerLockControls.prototype = Object.create(THREE.EventDispatcher.prototype);
    PointerLockControls.prototype.constructor = PointerLockControls;

    THREE.PointerLockControls = PointerLockControls;

})();
