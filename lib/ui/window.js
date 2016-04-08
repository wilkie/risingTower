/* This module implements a window.
 */

/*

   Window -> Screen
   Viewport -> (borderless) Window -> Screen

   Add a Window to a Window?

   Button -> Window
   Checkbox -> Window

   Button = function() {
   }

   Button.reposition()
   Button.events.onClick
   Checkbox.events etc

   */
var initUIWindow = function(UI) {
  var Window = UI.Window = function(phaser, x, y, width, height) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    this._barLeft  = phaser.make.sprite(this._x, this._y, 'ui/bar/left');
    this._barRight = phaser.make.sprite(this._x+width, this._y, 'ui/bar/right');
    this._barRight.x -= this._barRight.width;
    this._bar      = phaser.make.tileSprite(
                       this._x + this._barLeft.width,
                       this._y,
                       width - this._barLeft.width - this._barRight.width,
                       this._barLeft.height,
                       'ui/bar');

    this._inner = phaser.make.tileSprite(this._x, this._y + this._bar.height, width, height - this._bar.height, 'ui/bg')

    this._group = phaser.make.group(null);

    this._group.add(this._barLeft);
    this._group.add(this._barRight);
    this._group.add(this._bar);
    this._group.add(this._inner);

    this._bar.inputEnabled = true;
    this._bar.input.enableDrag();
    this._bar.events.onDragStart.add(this.dragStart, this);
    this._bar.events.onDragUpdate.add(this.dragUpdate, this);
    this._bar.events.onDragStop.add(this.dragStop, this);

    this._barLeft.inputEnabled = true;
    this._barLeft.input.enableDrag();
    this._barLeft.events.onDragStart.add(this.dragStart, this);
    this._barLeft.events.onDragUpdate.add(this.dragUpdate, this);
    this._barLeft.events.onDragStop.add(this.dragStop, this);

    this._barRight.inputEnabled = true;
    this._barRight.input.enableDrag();
    this._barRight.events.onDragStart.add(this.dragStart, this);
    this._barRight.events.onDragUpdate.add(this.dragUpdate, this);
    this._barRight.events.onDragStop.add(this.dragStop, this);

    this._children = [];
  };

  Window.prototype.add = function(child) {
    this._children.push(child);
    this._group.add(child.group());
  };

  Window.prototype.dragStart = function() {
  };

  Window.prototype.dragUpdate = function(sprite, pointer, x, y, snapPoint) {
    var self = this;
    var windowLeft = x;

    if (sprite === this._bar) {
      windowLeft -= this._barLeft.width;
    }
    else if (sprite === this._barLeft) {
    }
    else if (sprite === this._barRight) {
      windowLeft -= this._bar.width + this._barLeft.width;
    }

    this._x = windowLeft;
    this._y = y;

    this._barLeft.x = windowLeft;
    this._barLeft.y = y;

    this._barRight.x = windowLeft + this._width - this._barRight.width;
    this._barRight.y = y;

    this._bar.x = windowLeft + this._barLeft.width;
    this._bar.y = y;

    this._inner.x = windowLeft;
    this._inner.y = y + this._bar.height;

    this._children.forEach(function(child) {
      child.reposition(self._x, self._y + self._bar.height);
    });
  };

  Window.prototype.dragStop = function(sprite, pointer, x, y, snapPoint) {
  };

  Window.prototype.group = function() {
    return this._group;
  };

  Window.preload = function(phaser) {
    phaser.load.image('ui/bg',         'resources/ui/bg.png');
    phaser.load.image('ui/bar',        'resources/ui/bar.png');
    phaser.load.image('ui/bar/left',   'resources/ui/bar_left.png');
    phaser.load.image('ui/bar/right',  'resources/ui/bar_right.png');
    phaser.load.image('ui/bar/button', 'resources/ui/bar_button.png');
  };
};
