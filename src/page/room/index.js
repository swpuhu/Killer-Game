import waitingRoomGen from './waitingRoom.js';

let waitingRoom = waitingRoomGen();
waitingRoom.addEventListener('startGame', function () {
  console.log('startGame!');
});
waitingRoom.run();
