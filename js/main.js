var states = [];
var current_state = [];
var canvas;

window.addEventListener('load', function() {
  newCanvas();
  var btn = document.getElementsByClassName('btn-shape');
  var close = document.getElementsByClassName('close');

  document.getElementById('size').addEventListener('change', function() {
    canvas.changeSize(this.value);
  });

  document.getElementById('color').addEventListener('change', function() {
    canvas.changeColor(this.value);
  });

  document.getElementById('undo').addEventListener('click', function(evt) {
    evt.preventDefault();
    canvas.undo();
  });

  document.getElementById('type').addEventListener('change', function() {
    canvas.changeType(this.value);
  });

  for (var i = 0; i < btn.length; i++)
  {
    btn[i].addEventListener('click', function(evt) {
      evt.preventDefault();
      canvas.current_select = DRAW_TOOLS[this.getAttribute('data-name')];
      document.getElementById('select_name').innerHTML = ucfirst(this.getAttribute('data-name'));
      document.getElementById('size').value = canvas.tools_size[this.getAttribute('data-name')];
      changeCurrentButton(this);
    });
  }

  document.getElementById('new').addEventListener('click', function(evt) {
    evt.preventDefault();
    document.getElementById('content_new').style.display = 'block';
  });
  document.getElementById('save').addEventListener('click', function(evt) {
    evt.preventDefault();
    document.getElementById('content_register_file').style.display = 'block';
  });
  document.getElementById('load').addEventListener('click', function(evt) {
    evt.preventDefault();
    document.getElementById('content_load_file').style.display = 'block';
  });


  document.getElementById('new_form').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var data = serialize(this);
    newCanvas(data.new_width, data.new_height);
    document.getElementById('content_new').style.display = "none";
  });
  document.getElementById('save_form').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var data = serialize(this);
    var tmp = data.file_name.split('.');
    var ext = tmp.pop();
    var file_name = tmp.join('.');
    if (!ext.match(/^jpg$|^png$/))
      console.log("Seuls les formats jpg et png sont autorisés");
    else
    {
      var a = document.createElement('a');
      a.href = canvas.element.toDataURL('image/'+ext);
      a.download = file_name+"."+ext;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
      }, 0); 
      document.getElementById('content_register_file').style.display = "none";
    }
  });

  for (var i = 0; i < close.length; i++)
  {
    close[i].addEventListener('click', function(evt) {
      evt.preventDefault();
      this.parentElement.style.display = "none";
    });
  }
});

function getKey(object, value)
{
  return Object.keys(object).find(function(key) { return object[key] === value });
}

function ucfirst(value)
{
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function push_state(data)
{
  if (this.s === undefined)
  {
    states.push({ img: data });
    this.s = true;
  }
  if (states.length > 10) states.shift();
  states.push(current_state.pop());
  if (current_state.length === 0) current_state.push({ img: data });
}

function newCanvas(width, height)
{
  states = new Array();
  current_state = new Array();

  canvas = new Canvas('my_canvas');
  canvas.clear();

  if (width !== undefined && height !== undefined)
  {
    canvas.setWidth(width);
    canvas.setHeight(height);
  }
  canvas.run();

  var name = getKey(DRAW_TOOLS, canvas.current_select);
  document.getElementById('select_name').innerHTML = ucfirst(name);
  document.getElementById('size').value = canvas.tools_size[getKey(DRAW_TOOLS, canvas.current_select)];
}

function changeCurrentButton(dom_obj)
{
  var btn = document.getElementsByClassName('btn-shape');
  for (var i = 0; i < btn.length; i++)
  {
    if (btn[i] === dom_obj) btn[i].classList.add('selected');
    else btn[i].classList.remove('selected');
  }
}

function serialize(form)
{
  var data = {}
  for (var k in form.elements)
  {
    var element = form.elements[k]
    if (element.name === "")
      continue

    switch(element.nodeName)
    {
      case "INPUT":
      case "TEXTAREA":
        data[element.name] = element.value
      break
    }
  }
  
  return data
}