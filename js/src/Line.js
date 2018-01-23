var Line = function(ctx, options)
{
  Draw.call(this, ctx, options);

  this.render = function()
  {
    if (this.start === undefined || this.end === undefined || typeof this.start !== "object" || typeof this.end !== "object")
      return;

    
    this.ctx.beginPath();
    this.ctx.moveTo(this.start.x, this.start.y);
    this.ctx.lineTo(this.end.x, this.end.y);
    this.ctx.lineWidth = this.size;
    this.ctx.stroke();
  };
};