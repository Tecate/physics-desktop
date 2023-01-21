/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;

};




const canvas = document.getElementById('matter-demo');

// module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Composites = Matter.Composites,
Common = Matter.Common,
Bodies = Matter.Bodies,
Svg = Matter.Svg,
Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();

var canvasWidth = 1650,
canvasHeight = 500;

// create a renderer
var render = Render.create({
  element: canvas,
  engine: engine,
  options: {
    wireframes: false,
    showAngleIndicator: true,
    width: canvasWidth,
    height: canvasHeight } });



var ground = Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, 20, { isStatic: true });
var ceiling = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 20, { isStatic: true });
var wallLeft = Bodies.rectangle(0, canvasHeight / 2, 20, canvasHeight, { isStatic: true });
var wallRight = Bodies.rectangle(canvasWidth, canvasHeight / 2, 20, canvasHeight, { isStatic: true });

// add all of the bodies to the world
World.add(engine.world, [ceiling, ground, wallLeft, wallRight]);

var chain = [];

// loop through icons
var badges = document.querySelectorAll('.badge-icon');
for (var badge_i = 0; badge_i < badges.length; badge_i++) {

  var vertexSets = [];
  var icon = badges[badge_i];
  var icon_sprite = icon.dataset.sprite;
  var path = icon.querySelector('path');

  var points = Svg.pathToVertices(path, 10);
  vertexSets.push(Vertices.scale(points, 1, 1));

  World.add(engine.world, Bodies.fromVertices(canvasWidth / 2 + badge_i * 50, 300 - badge_i * 100, vertexSets, {
    render: {
      options: {
        hasBounds: true },

      sprite: {
        texture: icon_sprite } } }),


  true);

}

var timer = 20000;
var gravityDirection = 'left';

setInterval(function () {
  engine.world.gravity.x = gravityDirection == 'left' ? 0.5 : -0.5;
  gravityDirection = gravityDirection == 'left' ? 'right' : 'left';

  engine.world.gravity.y = 0.25;

  setTimeout(function () {
    engine.world.gravity.y = 1;
  }, timer / 4);

  setTimeout(function () {
    engine.world.gravity.x = 0;
  }, timer / 5);

}, timer);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);