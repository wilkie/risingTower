/* Creates an instance of the game which initializes the Phaser.io library.
 */
var RisingTower = window.RisingTower = function() {
  var self = this;

  // Initialize variables
  self.loadsPending = 0;
  self.preloads = [];
  self.creates  = [];
  self.updates  = [];
  self.renders  = [];
  self.modules  = [];

  // Initialize all modules
  self.load('Room');
  self.load('Floor');
  self.load('World');
  self.load('Person');
  self.load('Viewport');
  self.load('Elevator');
  self.load('Environment');
  self.load('UserInterface');

  self.load('Window', 'UI');

  self.load('Office', 'Rooms');

  self.load('Normal', 'Elevators');

  self.onload(function() {
    self.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.WEBGL, '', {
      preload: function() {
        self.preload();
      },
      create: function() {
        self.create();
      },
      update: function() {
        self.update();
      },
      render: function() {
        self.render();
      }
    })
  });
};

/* This function calls the given callback when the modules are loaded.
 */
RisingTower.prototype.onload = function(callback) {
  this._onload = callback;

  if (this.loadsPending == 0) {
    if (this._onload !== undefined) {
      this._onload();
    }
  }
};

/* This loads a javascript file given by url.
 */
RisingTower.prototype.loadScript = function(url, onload) {
  var self = this;
  this.loadsPending++;

  // Create a <script> tag that points to the file indicated by script.
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');

  // We want to wait until the script is loaded until we call initBlah()
  script.onload = function() {
    onload();
    self.loadsPending--;
    self.onload(self._onload);
  };

  // We insert the <script> to the <head> to actually load the script.
  var head = document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
};

/* Helper function to turn strings like "UserInterface" into "user_interface"
 * which is used by our module loader.
 */
RisingTower.underscore = function(name) {
  return name.replace(/[a-z][A-Z]/g, function(m){
    return m[0] + "_" + m[1].toLowerCase();}).toLowerCase();
};

/* This loads a module.
 */
RisingTower.prototype.load = function(name, root) {
  var self = this;

  var path = "";
  var rootModule = RisingTower;
  var type = "";

  if (root === undefined) {
    root = "";
  }
  else {
    path = RisingTower.underscore(root);
    type = path;
    if (rootModule[root] === undefined) {
      rootModule[root] = {};
    }
    rootModule = rootModule[root];
  }
  if (path.length != 0) {
    path = path + "/";
  }

  // Create the path to the javascript file that implements the object.
  // First we turn the name ("UserInterface") into a filename ("user_interface")
  var filename = RisingTower.underscore(name);
  var url = 'lib/' + path + filename + ".js";

  // We will run initBlah and pass the RisingTower object. (where Blah is name)
  var initFunction = 'init' + root + name;

  // Load the script.
  this.loadScript(url, function() {
    var initModule = window[initFunction];
    if (initModule !== undefined) {
      initModule(rootModule);

      var module = rootModule[name];

      if (module !== undefined) {
        module.type = type;

        var moduleInfo = {
          'name': name,
          'object': module,
        };

        if ((root !== undefined) && (root.length > 0)) {
          moduleInfo.root = root;
        }

        // Append preloads, etc
        if (module.preload !== undefined) {
          self.preloads.push({'module': moduleInfo, callback: module.preload});
        }
        if (module.create !== undefined) {
          self.creates.push({'module': moduleInfo, callback: module.create});
        }
        if (module.update !== undefined) {
          self.updates.push({'module': moduleInfo, callback: module.update});
        }
        if (module.render !== undefined) {
          self.renders.push({'module': moduleInfo, callback: module.render});
        }

        // Append to our list of modules
        self.modules.push(moduleInfo);
      }
    }
  });
};

/* This loads a mod. Currently unimplemented.
 */
RisingTower.prototype.loadMod = function(name) {
};

/* This is called by Phaser to tell us to load resources.
 */
RisingTower.prototype.preload = function() {
  var game = this.game;

  // Disable right mouse click menu
  game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

  this.preloads.forEach(function(module) {
    var moduleInfo = module.module;
    console.log("Preloading " + (moduleInfo.root !== undefined ? moduleInfo.root + ": " : "") + moduleInfo.name);
    module.callback.call(moduleInfo.object, game);
  });
};

/* This is called by Phaser to create the game data and initialize the state
 * of our game.
 */
RisingTower.prototype.create = function() {
  var game = this.game;

  // Initialize game
  RisingTower.world = new RisingTower.World(game);
  RisingTower.viewport = new RisingTower.Viewport(
    game, 0, 0, game.width, game.height, RisingTower.world);
  RisingTower.viewport.bottomAt(64);
  RisingTower.UserInterface.addViewport(RisingTower.viewport);

  this._window = new RisingTower.UI.Window(game, 100, 100, 300, 300);
  var windowVP = new RisingTower.Viewport(game, 100, 120, 300, 280, RisingTower.world);
  this._window.add(windowVP);
  windowVP.bottomAt(64);
  game.world.add(RisingTower.viewport.group());
  game.world.add(this._window.group());

  //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
  //logo.anchor.setTo(0.5, 0.5);

  this.creates.forEach(function(module) {
    var moduleInfo = module.module;
    console.log("Creating " + (moduleInfo.root !== undefined ? moduleInfo.root + ": " : "") + moduleInfo.name);
    module.callback.call(moduleInfo.object, game);
  });
};

/* This is called by Phaser whenever the game should be updated.
 */
RisingTower.prototype.update = function() {
  var game = this.game;

  this.updates.forEach(function(module) {
    var moduleInfo = module.module;
    module.callback.call(moduleInfo.object, game);
  });
};

/* This is called by Phaser every frame to draw the graphics of the
 * game.
 */
RisingTower.prototype.render = function() {
  var game = this.game;

  this.renders.forEach(function(module) {
    var moduleInfo = module.module;
    module.callback.call(moduleInfo.object, game);
  });
};
