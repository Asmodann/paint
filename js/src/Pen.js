var Pen = function(ctx, options)
{
  Draw.call(this, ctx, options);
  this.init_render = false;

  this.render = function(x, y)
  {
    if (this.start === undefined || this.end === undefined || typeof this.start !== "object" || typeof this.end !== "object")
      return;
    
    if (this.init_render)
    {
      this.ctx.lineJoin = "round";
      this.ctx.lineWidth = this.size;
      this.ctx.beginPath();
      this.ctx.moveTo(this.start.x, this.start.y);
    }
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.stroke();
  };
};