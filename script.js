// Request animation frame
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
// Canvas
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
// Set full-screen
c.width = window.innerWidth;
c.height = window.innerHeight;
// Options
var background = '#333'; // Background color
var particlesPerExplosion = 20;
var particlesMinSpeed = 3;
var particlesMaxSpeed = 6;
var particlesMinSize = 1;
var particlesMaxSize = 3;
var explosions = [];
var fps = 60;
var now, delta;
var then = Date.now();
var interval = 1000 / fps;
// Optimization for mobile devices
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    fps = 29;
}
// Draw
function draw() {
    // Loop
    requestAnimationFrame(draw);
    // Set NOW and DELTA
    now = Date.now();
    delta = now - then;
    // New frame
    if (delta > interval) {
        // Update THEN
        then = now - (delta % interval);
        // Our animation
        drawBackground();
        drawExplosion();
    }
}
// Draw explosion(s)
function drawExplosion() {
    if (explosions.length == 0) {
        return;
    }
    for (var i = 0; i < explosions.length; i++) {
        var explosion = explosions[i];
        var particles = explosion.particles;
        if (particles.length == 0) {
            explosions.splice(i, 1);
            return;
        }
        for (var ii = 0; ii < particles.length; ii++) {
            var particle = particles[ii];
            // Check particle size
            // If 0, remove
            if (particle.size < 0) {
                particles.splice(ii, 1);
                return;
            }
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
            ctx.closePath();
            ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
            ctx.fill();
            // Update
            particle.x += particle.xv;
            particle.y += particle.yv;
            particle.size -= .1;
        }
    }
}
// Draw the background
function drawBackground() {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, c.width, c.height);
}
// Clicked
function clicked(e) {
    var xPos, yPos;
    if (e.offsetX) {
        xPos = e.offsetX;
        yPos = e.offsetY;
    } else if (e.layerX) {
        xPos = e.layerX;
        yPos = e.layerY;
    }
    explosions.push(new explosion(xPos, yPos));
}
// Explosion
function explosion(x, y) {
    this.particles = [];
    for (var i = 0; i < particlesPerExplosion; i++) {
        this.particles.push(new particle(x, y));
    }
}
// Particle
function particle(x, y) {
    this.x = x;
    this.y = y;
    this.xv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.yv = randInt(particlesMinSpeed, particlesMaxSpeed, false);
    this.size = randInt(particlesMinSize, particlesMaxSize, true);
    this.r = randInt(113, 222);
    this.g = '00';
    this.b = randInt(105, 255);
}
// Returns an random integer, positive or negative
// between the given value
function randInt(min, max, positive) {
    if (positive == false) {
        var num = Math.floor(Math.random() * max) - min;
        num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    } else {
        var num = Math.floor(Math.random() * max) + min;
    }
    return num;
}
// On-click
$('canvas').on('click', function(e) {
    clicked(e);
});
draw();