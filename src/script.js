const canvas = document.getElementById('matter');

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Common = Matter.Common,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Svg = Matter.Svg,
    Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();
var world = engine.world;

var canvasWidth = 1650,
    canvasHeight = 500;

// create a renderer
var render = Render.create({
    element: canvas,
    engine: engine,
    options: {
      wireframes: false,
      showAngleIndicator: false,
      width: window.innerWidth,
      height: window.innerHeight
    }
});

// 0,0 is top left
// x, y, w, h
var peek = 5;
var wallThickness = 2000;
var wallLength = 5000;
var floor = Bodies.rectangle(window.innerWidth/2, window.innerHeight+(wallThickness/2), wallLength, wallThickness, { isStatic: true })
var leftWall = Bodies.rectangle(-(wallThickness/2), window.innerHeight/2, wallThickness, wallLength, { isStatic: true })
var rightWall = Bodies.rectangle(window.innerWidth+(wallThickness/2), window.innerHeight/2, wallThickness, wallLength, { isStatic: true })
var ceiling = Bodies.rectangle(window.innerWidth/2, -(wallThickness/2), wallLength, wallThickness, { isStatic: true })

var walls = [floor, leftWall, rightWall, ceiling];
Composite.add(world, walls);

var chain = [];

// loop through icons
var badges = document.querySelectorAll('.icon');
for (var badge_i = 0; badge_i < badges.length; badge_i++) {

  var vertexSets = [];
  var icon = badges[badge_i];
  var icon_sprite = icon.dataset.sprite;
  var path = icon.querySelector('path');

  var points = Svg.pathToVertices(path, 10);
  vertexSets.push(Vertices.scale(points, 1, 1));
  
  World.add(engine.world, Bodies.fromVertices((canvasWidth / 2) + (badge_i * 50), 300 - (badge_i * 100), vertexSets, {
    render: {
      options: {
        hasBounds: false
      }//,
      // sprite: {
      //   texture: icon_sprite
      // }
    }
  }), true);
  
}

// https://github.com/liabru/matter-js/issues/153

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

window.addEventListener('resize', () => { 
  render.bounds.max.x = window.innerWidth;
  render.bounds.max.y = window.innerHeight;
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
  Matter.Render.setPixelRatio(render, window.devicePixelRatio); // added this

  Matter.Body.setPosition(floor,
      Matter.Vector.create(
          window.innerWidth/2,
          window.innerHeight+(wallThickness/2)
      )
  )

  Matter.Body.setPosition(rightWall,
      Matter.Vector.create(
          window.innerWidth+(wallThickness/2),
          window.innerHeight/2
      )
  )
});

