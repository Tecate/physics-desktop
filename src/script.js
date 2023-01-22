// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Svg = Matter.Svg,
    Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();
var world = engine.world;

// create a renderer
var render = Render.create({
    element: document.getElementById('matter'),
    engine: engine,
    options: {
      background: 'transparent',
      wireframes: false,
      showAngleIndicator: false,
      width: window.innerWidth,
      height: window.innerHeight
    }
});

// 0,0 is top left
// x, y, w, h
var wallThickness = 2000;
var wallLength = 8000;
var floor = Bodies.rectangle(window.innerWidth/2, window.innerHeight+(wallThickness/2), wallLength, wallThickness, { isStatic: true })
var leftWall = Bodies.rectangle(-(wallThickness/2), window.innerHeight/2, wallThickness, wallLength, { isStatic: true })
var rightWall = Bodies.rectangle(window.innerWidth+(wallThickness/2), window.innerHeight/2, wallThickness, wallLength, { isStatic: true })
var ceiling = Bodies.rectangle(window.innerWidth/2, -(wallThickness/2), wallLength, wallThickness, { isStatic: true })

var walls = [floor, leftWall, rightWall, ceiling];
Composite.add(world, walls);

var svg = document.getElementById("folder")
var vertexSets = [];
var path = svg.querySelector('path');

var points = Svg.pathToVertices(path, 10);
vertexSets.push(Vertices.scale(points, 1, 1));
  
for (var i = 0; i < 20; i++) {
  var folder = Bodies.fromVertices(Math.random() * window.innerWidth, Math.random() * window.innerHeight, vertexSets, {
    render: {
      fillStyle: 'rgba(0, 0, 0, 0)',
      strokeStyle: 'rgba(0, 0, 0, 0)',
      lineWidth: 0,
      options: {
        hasBounds: false
      }
    }
  });

  var spriteHolder = Bodies.rectangle(
    folder.bounds.min.x,
    folder.bounds.min.y,
    (folder.bounds.max.x - folder.bounds.min.x),
    (folder.bounds.max.y - folder.bounds.min.y),
    {
      collisionFilter: {
        mask: 0,
      },
      render: {
        fillStyle: 'none',
        strokeStyle: 'none',
        sprite: {
          texture: './foldercrop.png',
          xOffset: 0,
          yOffset: 0.02,
          xScale: 0.21,
          yScale: 0.195
        }
      }
    }
  );

  let constraint = Constraint.create({
    bodyA: folder,
    pointA: {x: 0, y: 10},
    bodyB: spriteHolder,
    pointB: {x: 0, y: 10},
    length: 0,
    render: {lineWidth: 0}
  });

  let constraint2 = Constraint.create({
    bodyA: folder,
    pointA: {x: 0, y: -10},
    bodyB: spriteHolder,
    pointB: {x: 0, y: -10},
    length: 0,
    render: {lineWidth: 0}
  });

  let group = Composite.create({label: `group`});
  Composite.add(group, [folder, spriteHolder, constraint, constraint2])
  Composite.add(world, group)
}

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

