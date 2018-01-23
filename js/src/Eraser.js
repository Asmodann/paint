var Eraser = function(ctx, options)
{
  Draw.call(this, ctx, options);

  this.render = function()
  {
    var startX = this.start.x - (this.size / 2);
    var startY = this.start.y - (this.size / 2);
    
    this.ctx.clearRect(startX, startY, this.size, this.size);
  };
};