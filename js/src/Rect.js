var Rect = function(ctx, options)
{
  Draw.call(this, ctx, options);

  this.render = function()
  {
    if (this.start === undefined || this.end === undefined || typeof this.start !== "object" || typeof this.end !== "object")
      return;

    var sizeX = this.end.x - this.start.x;
    var sizeY = this.end.y - this.start.y;

    this.ctx.beginPath();
    this.ctx.rect(this.start.x, this.start.y, sizeX, sizeY);
    if (this.type == DRAW_TYPE.fill)
    {
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
    else if (this.type == DRAW_TYPE.stroke)
    {
      this.ctx.lineWidth = this.size;
      this.ctx.strokeStyle = this.color;
      this.ctx.stroke();
    }
  };
};