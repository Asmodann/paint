var DRAW_TOOLS = {
  pen: 0,
  line: 1,
  rect: 2,
  eraser: 3,
  circle: 4,
}

var DRAW_TYPE = {
  fill: 0,
  stroke: 1,
}

var Canvas = function(canvas_id_name, fps)
{
  this.fps = 1000 / (fps === undefined ? 60 : fps);
  this.element = document.getElementById(canvas_id_name);
  this.ctx = this.element.getContext("2d");
  this.current_select = DRAW_TOOLS.pen;
  this.color = document.getElementById('color').value;
  this.shape_style = document.getElementById('type').value;
  this.object = false;
  this.mousePressed = false;
  this.img = new Image();
  this.type = DRAW_TYPE.fill;
  this.tools_size = {
    pen: 2,
    line: 1,
    rect: 1,
    eraser: 6,
    circle: 1,
  }
  this.interval;
  this.init();

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

Canvas.prototype.reDraw = function(img_url)
{
  this.img.src = img_url;
  this.ctx.drawImage(this.img, 0, 0, this.element.width, this.element.height, 0, 0, this.element.width, this.element.height);
}

Canvas.prototype.run = function()
{
  push_state(this.element.toDataURL());
  this.interval = setInterval(function() {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    var curr_state = current_state[0];
    if (curr_state) this.reDraw(curr_state.img);
    if (this.object) this.object.render();
  }.bind(this), this.fps);
}

Canvas.prototype.init = function()
{
  this.element.addEventListener('mousedown', function(evt) {
    if (this.current_select === DRAW_TOOLS.pen) this.newPen('down', evt);
    if (this.current_select === DRAW_TOOLS.line) this.newLine('down', evt);
    if (this.current_select === DRAW_TOOLS.rect) this.newRect('down', evt);
    if (this.current_select === DRAW_TOOLS.circle) this.newCircle('down', evt);
    if (this.current_select === DRAW_TOOLS.eraser) this.newEraser('down', evt);
  }.bind(this));

  this.element.addEventListener('mousemove', function(evt) {
    if (this.current_select === DRAW_TOOLS.pen) this.newPen('press', evt);
    if (this.current_select === DRAW_TOOLS.line) this.newLine('press', evt);
    if (this.current_select === DRAW_TOOLS.rect) this.newRect('press', evt);
    if (this.current_select === DRAW_TOOLS.circle) this.newCircle('press', evt);
    if (this.current_select === DRAW_TOOLS.eraser) this.newEraser('press', evt);
  }.bind(this));

  this.element.addEventListener('mouseup', function(evt) {
    if (this.current_select === DRAW_TOOLS.pen) this.newPen('up', evt);
    if (this.current_select === DRAW_TOOLS.line) this.newLine('up', evt);
    if (this.current_select === DRAW_TOOLS.rect) this.newRect('up', evt);
    if (this.current_select === DRAW_TOOLS.circle) this.newCircle('up', evt);
    if (this.current_select === DRAW_TOOLS.eraser) this.newEraser('up', evt);
  }.bind(this));
}

Canvas.prototype.newPen = function(event_btn, evt)
{
  if (event_btn === 'down')
  {
    if (!this.mousePressed)
    {
      console.log('Start');
      this.object = new Pen(this.ctx, { color: this.color, size: this.tools_size[getKey(DRAW_TOOLS, this.current_select)] });
      this.object.startPoint(evt.offsetX, evt.offsetY);
      this.mousePressed = true;
      this.object.init_render = true;
    }
  }
  else if (event_btn === 'press')
  {
    if (this.object)
    {
      this.object.endPoint(evt.offsetX, evt.offsetY);
      this.object.render();
      this.object.init_render = false;
    }
  }
  else
  {
    if (this.mousePressed)
    {
      push_state(this.element.toDataURL());
      this.object = false;
      this.mousePressed = false;
    }
  }
}

Canvas.prototype.newLine = function(event_btn, evt)
{
  if (event_btn === 'down')
  {
    if (!this.mousePressed)
    {
      console.log('Start');
      console.log(getKey(DRAW_TOOLS, this.current_select));
      this.object = new Line(this.ctx, { color: this.color, size: this.tools_size[getKey(DRAW_TOOLS, this.current_select)] });
      this.object.startPoint(evt.offsetX, evt.offsetY);
      this.mousePressed = true;
    }
  }
  else if (event_btn === 'press')
  {
    if (this.object) this.object.endPoint(evt.offsetX, evt.offsetY);
  }
  else
  {
    if (this.mousePressed)
    {
      push_state(this.element.toDataURL());
      this.object = false;
      this.mousePressed = false;
    }
  }
}

Canvas.prototype.newRect = function(event_btn, evt)
{
  if (event_btn === 'down')
  {
    if (!this.mousePressed)
    {
      console.log('Start');
      console.log(getKey(DRAW_TOOLS, this.current_select));
      this.object = new Rect(this.ctx, {
        color: this.color,
        size: this.tools_size[getKey(DRAW_TOOLS, this.current_select)],
        type: this.shape_style,
      });
      this.object.startPoint(evt.offsetX, evt.offsetY);
      this.mousePressed = true;
    }
  }
  else if (event_btn === 'press')
  {
    if (this.object) this.object.endPoint(evt.offsetX, evt.offsetY);
  }
  else
  {
    if (this.mousePressed)
    {
      push_state(this.element.toDataURL());
      this.object = false;
      this.mousePressed = false;
    }
  }
}

Canvas.prototype.newCircle = function(event_btn, evt)
{
  if (event_btn === 'down')
  {
    if (!this.mousePressed)
    {
      console.log('Start');
      console.log(getKey(DRAW_TOOLS, this.current_select));
      this.object = new Circle(this.ctx, {
        color: this.color,
        size: this.tools_size[getKey(DRAW_TOOLS, this.current_select)],
        type: this.shape_style,
      });
      this.object.startPoint(evt.offsetX, evt.offsetY);
      this.mousePressed = true;
    }
  }
  else if (event_btn === 'press')
  {
    if (this.object) this.object.endPoint(evt.offsetX, evt.offsetY);
  }
  else
  {
    if (this.mousePressed)
    {
      push_state(this.element.toDataURL());
      this.object = false;
      this.mousePressed = false;
    }
  }
}

Canvas.prototype.newEraser = function(event_btn, evt)
{
  if (event_btn === 'down')
  {
    if (!this.mousePressed)
    {
      console.log('Start');
      this.object = new Eraser(this.ctx, { size: this.tools_size[getKey(DRAW_TOOLS, this.current_select)] });
      this.object.startPoint(evt.offsetX, evt.offsetY);
      this.object.render();
      this.mousePressed = true;
    }
  }
  else if (event_btn === 'press')
  {
    if (this.object)
    {
      clearInterval(this.interval);
      console.log('pressed');
      this.object.render();
      this.object.startPoint(evt.offsetX, evt.offsetY);
      this.object.render();
    }
  }
  else
  {
    if (this.mousePressed)
    {
      push_state(this.element.toDataURL());
      this.object = false;
      this.mousePressed = false;
      this.run();
    }
  }
}

Canvas.prototype.changeSize = function(size)
{
  var key = getKey(DRAW_TOOLS, this.current_select);
  this.tools_size[key] = size;
}

Canvas.prototype.changeColor = function(color)
{
  this.color = color;
}

Canvas.prototype.changeType = function(type)
{
  this.shape_style = type;
}

Canvas.prototype.undo = function()
{
  var pop = states.pop();
  if (pop) current_state[0] = pop;
}

Canvas.prototype.clear = function()
{
  clearInterval(this.interval);
}