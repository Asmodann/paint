var Draw = function(ctx, options)
{
  if (options === undefined)
    options = { };

  this.ctx = ctx;
  this.size = (options.size === undefined ? undefined : options.size);
  this.type = (options.type === undefined ? DRAW_TYPE.fill : options.type);
  this.color;
  this.start = {};
  this.end = {};

  this.render = function() { };

  this.startPoint = function(x ,y)
  {
    this.start.x = x;
    this.start.y = y;
  };

  this.endPoint = function(x, y)
  {
    this.end.x = x;
    this.end.y = y;
  };

  this.setSize = function(size)
  {
    this.size = size;
  }

  this.setColor = function(color)
  {
    this.color = color;
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
  }

  if (options.color !== undefined)
    this.setColor(options.color);
};