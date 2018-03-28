var v = new ViewportTrigger();
var target = document.getElementById('target');
var message = document.getElementById('message');
var container = document.getElementsByClassName('container')[0];

function handleTargetEnter() {
	message.innerText = 'ENTER';
	container.classList.remove('background-red');
	container.classList.add('background-green');
}

function handleTargetLeave() {
	message.innerText = 'OUT';
	container.classList.remove('background-green');
	container.classList.add('background-red');
}

v
	.observe(target)
	.on('enter', target, handleTargetEnter)
	.on('leave', target, handleTargetLeave);
