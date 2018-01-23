var DRAW_TOOLS = {
  pen: 0,
  line: 1,
  rect: 2,
  eraser: 3,
}

var Canvas = function(canvas_id_name, fps)
{
  this.fps = 1000 / (fps === undefined ? 30 : fps);
  this.element = document.getElementById(canvas_id_name);
  this.ctx = this.element.getContext("2d");
  this.interval;
  this.current_select = DRAW_TOOLS.pen;
  this.object = false;
  this.mouse_pressed = false;
  this.tools_size = {
    pen: 2,
    line: 1,
    rect: 1,
    eraser: 6,
  }
  this.color = document.getElementById('color').value;

  this.setWidth(640);
  this.setHeight(480);
}

Canvas.prototype.setWidth = function(value)
{
  if (value === undefined) return;

  this.element.width = value;
}

Canvas.prototype.setHeight = function(value)
{
  if (value === undefined) return;

  this.element.height = value;
}

Canvas.prototype.run = function()
{
  push_state(this.element.toDataURL());
  this.pen();
  this.line();
  this.rect();
  this.eraser();

  document.getElementById('redo').addEventListener('click', function(evt) {
    evt.preventDefault();
    this.previous_state();
  }.bind(this));
}

Canvas.prototype.pen = function()
{
  this.element.addEventListener('mousedown', function(evt) {
    if (this.current_select !== DRAW_TOOLS.pen) return;
    if (evt.button === 0)
      this.mouse_pressed = true;
  }.bind(this));

  this.element.addEventListener('mouseup', function(evt) {
    if (this.current_select !== DRAW_TOOLS.pen) return;

    if (evt.button === 0)
    {
      push_state(this.element.toDataURL());
      this.mouse_pressed = false;
      this.object = false;
    }
  }.bind(this));

  this.element.addEventListener('mousemove', function(evt) {
    if (this.current_select !== DRAW_TOOLS.pen) return;

    if (this.mouse_pressed)
    {
      if (this.object.constructor.name !== 'Pen')
      {
        this.object = new Pen(this.ctx, { size: this.tools_size.pen, color: this.color });
        this.object.startPoint(evt.offsetX, evt.offsetY);
        this.object.init_render = true;
      }
      else
      {
        this.object.endPoint(evt.offsetX, evt.offsetY);
        this.object.render();
        this.object.init_render = false;
      }
    }
  }.bind(this));
}

Canvas.prototype.line = function()
{
  this.element.addEventListener('click', function(evt) {
    if (this.current_select !== DRAW_TOOLS.line)
      return;

    if (this.object.constructor.name !== 'Line')
    {
      this.object = new Line(this.ctx, { size: this.tools_size.line, color: this.color });
      this.object.startPoint(evt.offsetX, evt.offsetY);
      console.log(this.object.constructor.name);
    }
    else
    {
      this.object.endPoint(evt.offsetX, evt.offsetY);
      this.object.render();
      push_state(this.element.toDataURL());
      this.object = false;
    }
  }.bind(this));
}

Canvas.prototype.rect = function()
{
  this.element.addEventListener('click', function(evt) {
    if (this.current_select !== DRAW_TOOLS.rect)
      return;

    if (this.object.constructor.name !== 'Rect')
    {
      this.object = new Rect(this.ctx, { size: this.tools_size.rect, color: this.color });
      this.object.startPoint(evt.offsetX, evt.offsetY);
    }
    else
    {
      this.object.endPoint(evt.offsetX, evt.offsetY);
      this.object.render();
      push_state(this.element.toDataURL());
      this.object = false;
    }
  }.bind(this));
}

Canvas.prototype.eraser = function()
{
  this.element.addEventListener('mousedown', function(evt) {
    if (this.current_select !== DRAW_TOOLS.eraser) return;
    if (evt.button === 0)
      this.mouse_pressed = true;
  }.bind(this));

  this.element.addEventListener('mouseup', function(evt) {
    if (this.current_select !== DRAW_TOOLS.eraser) return;

    if (evt.button === 0)
    {
      push_state(this.element.toDataURL());
      this.mouse_pressed = false;
      this.object = false;
    }
  }.bind(this));

  this.element.addEventListener('mousemove', function(evt) {
    if (this.current_select !== DRAW_TOOLS.eraser) return;

    if (this.mouse_pressed)
    {
      if (this.object.constructor.name !== 'Eraser')
      {
        this.object = new Eraser(this.ctx, { size: this.tools_size.eraser });
      }
      else
      {
        this.object.startPoint(evt.offsetX, evt.offsetY);
        // this.object.endPoint(evt.offsetX, evt.offsetY);
        this.object.render();
      }
    }
  }.bind(this));
}

Canvas.prototype.changeTool = function()
{
  var me = this;
  document.getElementById('pen').addEventListener('click', function(evt) {
    evt.preventDefault();
    this.current_select = DRAW_TOOLS.pen;
    this.changeSize();
  }.bind(this));

  document.getElementById('line').addEventListener('click', function(evt) {
    evt.preventDefault();
    this.current_select = DRAW_TOOLS.line;
    this.changeSize();
  }.bind(this));

  document.getElementById('rect').addEventListener('click', function(evt) {
    evt.preventDefault();
    this.current_select = DRAW_TOOLS.rect;
    this.changeSize();
  }.bind(this));

  document.getElementById('eraser').addEventListener('click', function(evt) {
    evt.preventDefault();
    this.current_select = DRAW_TOOLS.eraser;
    this.changeSize();
  }.bind(this));

  document.getElementById('size').addEventListener('change', function() {
    var key = getKey(DRAW_TOOLS, me.current_select);
    me.tools_size[key] = this.value;
  });
}

Canvas.prototype.changeColor = function()
{
  var me = this;
  document.getElementById('color').addEventListener('change', function() {
    me.color = this.value;
  });
}

Canvas.prototype.changeSize = function()
{
  var key = getKey(DRAW_TOOLS, this.current_select);
  document.getElementById('select_name').innerHTML = ucfirst(key);
  document.getElementById('size').value = this.tools_size[key];
}

Canvas.prototype.previous_state = function()
{
  var img = new Image();
  states.pop();
  img.src = states.pop().img;
  img.onload = function() {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    this.ctx.drawImage(img, 0, 0, this.element.width, this.element.height, 0, 0, this.element.width, this.element.height);
  }.bind(this);
  push_state(this.element.toDataURL());
}