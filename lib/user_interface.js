var initUserInterface = function(RisingTower) {
  var UserInterface = RisingTower.UserInterface = function() {
  }

  UserInterface.preload = function(phaser) {
  };

  UserInterface.create = function(phaser) {
    // Add an object to represent the selection
    this.selectionBox = new Phaser.Rectangle(100, 100, 100, 50);

    this.graphics = phaser.add.graphics(0, 0);

    // Add a mouse event handler
    phaser.input.addMoveCallback(UserInterface.mouseEvent, this);
  };

  UserInterface.mouseEvent = function(pointer, x, y) {
    this.x = x;
    this.y = y;

    this.selectionBox.setTo(x,y,100,50);
  };

  UserInterface.render = function(phaser) {
    //phaser.debug.geom(UserInterface.selectionBox);
    this.graphics.clear()
    this.graphics.lineStyle(2, 0xffff00, 1);
    this.graphics.drawRect(this.selectionBox.x,
                           this.selectionBox.y,
                           this.selectionBox.width,
                           this.selectionBox.height);
  };
}
