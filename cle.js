var canvas,ctx,lvldata={objects: [], spawn: {x:200, y:150}, lvlname: "no-name"},oldX,oldY,curX,curY,rcurX,rcurY,curTool="none",mdwn=false,tempdata={},hfNames={},colors=[];

colors[0] = colobj(0,0,0,0);
colors[1] = colobj(255,0,0,0);
colors[2] = colobj(0,0,255,0);
colors[3] = colobj(0,255,255,0);

function init() {
	hfNames["text"]="Text";
	hfNames["wall"]="Wall";
	hfNames["exit"]="Exit";
	hfNames["pressureplate"]="Trigger";
	hfNames["button"]="Button";
	canvas=document.getElementById("canv");
	ctx=canvas.getContext("2d");
	requestAnimationFrame(onframereq);
	updateLvlName();
	//canvas.addEventListener("onmousedown",md);
	//canvas.addEventListener("onmouseup",mu);
	}

function onframereq() {
	prerender();
	requestAnimationFrame(onframereq);
	}

function prerender() {
	ctx.clearRect(0,0,800,600);
	render();
	}

function render() {
	ctx.strokeStyle="#000000";
	ctx.strokeRect(0,0,800,600);
	render_objs();
	render_spawn();
	render_preview();
	}

function render_objs() {
	ctx.save();
	ctx.fillStyle = "#FF0000";
	ctx.strokeStyle = "#FF0000";
	ctx.lineWidth = 1;
	ctx.globalAlpha = .09;
	ctx.beginPath();
	for (var b = 0; 400 > b; b += 10) ctx.moveTo((b << 1) + .5, 0), ctx.lineTo((b << 1) + .5, 600);
	for (var c = 0; 300 > c; c += 10) ctx.moveTo(0, (c << 1) + .5), ctx.lineTo(800, (c << 1) + .5);
	ctx.stroke();
	ctx.restore();
	for (var i=0;i<lvldata.objects.length;i++) {
		if (lvldata.objects[i].type=="text") updateObj(i);
		render_object(i);
		}
	}

function render_object(i) {
	var o = lvldata.objects[i];
	var c;
	
	switch(o.type) {
		case "text":
			fixTextBox(o);
			ctx.save();
			ctx.font = o.textHeight+"px NovaSquare";
			c = o.x;
			o.isCentered && (c -= ctx.measureText(o.text).width / 4);
			ctx.fillStyle="#000";
			ctx.fillText(o.text,c*2,o.y*2);
			ctx.restore();
			ctx.save();
			ctx.strokeStyle="#000";
			ctx.strokeRect(o.bb.x1*2,o.bb.y1*2,((o.bb.x2*2)-(o.bb.x1*2)),((o.bb.y2*2)-(o.bb.y1*2)));
			ctx.restore();
			ctx.save();
			ctx.restore();
			break;
		case "wall":
			ctx.save();
			ctx.fillStyle=col2bc(o.color);
			ctx.fillRect(o.x*2,o.y*2,o.width*2,o.height*2);
			ctx.restore();
			break;
		case "exit":
			ctx.save();
			ctx.fillStyle="#0f0";
			ctx.fillRect(o.x*2,o.y*2,o.width*2,o.height*2);
			ctx.restore();
			break;
		case "pressureplate":
			ctx.save();
			ctx.globalAlpha=0.5;
			ctx.fillStyle=col2bc(o.color);
			ctx.fillRect(o.x*2,o.y*2,o.width*2,o.height*2);
			ctx.restore();
			ctx.save();
			ctx.font = "20px NovaSquare";
			ctx.fillStyle = "#000";
			ctx.fillText("T"+o.count,o.x*2,(o.y+10)*2);
			ctx.restore();
			break;
		case "button":
			ctx.save();
			ctx.fillStyle=col2bc(o.color);
			ctx.fillRect(o.x*2,o.y*2,o.width*2,o.height*2);
			ctx.restore();
			ctx.save();
			ctx.strokeStyle="#000";
			ctx.strokeRect(o.x*2,o.y*2,o.width*2,o.height*2);
			ctx.restore();
			ctx.save();
			ctx.font = "20px NovaSquare";
			ctx.fillStyle = "#000";
			ctx.fillText("B"+o.count,o.x*2,(o.y+10)*2);
			ctx.restore();
			break;
		}
	}

function rename() {
	si("lvlname",'<input type="text" id="ln" value="'+lvldata.lvlname+'"><button class="btn btn-success" onclick="rn();">'+glyphicon('ok')+'</button>');
	}

function si(id,c) {
	ge(id).innerHTML = c;
	}

function glyphicon(id) {
	return '<span class="glyphicon glyphicon-'+id+'"></span>';
	}

function rn() {
	lvldata.lvlname = gv("ln");
	updateLvlName();
	}

function updateLvlName() {
	si("lvlname","<h4 onclick=\"rename();\">"+lvldata.lvlname+"</h4>");
	}

function tool(id) {
	clearTool(curTool);
	if (id!=curTool) {
		activateTool(id);
		curTool = id;
		} else {
		curTool = "none";
		}
	}

function mm(e) {
	oldX = curX;
	oldY = curY;
	getMousePos(e);
	si("cpos","("+(curX)+","+(curY)+")");
	}

function getMousePos(evt) {
	var rect = ge("canv").getBoundingClientRect();
	curX = Math.floor(Math.max(0,evt.clientX - rect.left)/20)*10;
	curY = Math.floor(Math.max(0,evt.clientY - rect.top)/20)*10;
	rcurX = Math.max(0,evt.clientX - rect.left)/2;
	rcurY = Math.max(0,evt.clientY - rect.top)/2;
	}

function clearTool(id) {
	if (id=="none") return;
	si("t"+id,savedToolName);
	}

function activateTool(id) {
	if (id=="none") return;
	var tn = ge("t"+id).innerHTML;
	savedToolName = tn;
	si("t"+id,tn.bold());
	}

function md(e) {
	mm(e);
	mdwn = true;
	switch(curTool) {
		case 'wall':
		case 'exit':
		case 'plate':
		case 'button':
			tempdata.x1 = curX;
			tempdata.y1 = curY;
			break;
		}
	}

function mu(e) {
	mm(e);
	mdwn = false;
	switch(curTool) {
		case 'spawn':
			lvldata.spawn.x = rcurX;
			lvldata.spawn.y = rcurY;
			break;
		case 'wall':
			tempdata.x2 = Math.ceil(rcurX/10)*10;
			tempdata.y2 = Math.ceil(rcurY/10)*10;
			createWall();
			break;
		case 'none':
			inspectX = rcurX;
			inspectY = rcurY;
			inspectItems();
			break;
		case 'exit':
			tempdata.x2 = Math.ceil(rcurX/10)*10;
			tempdata.y2 = Math.ceil(rcurY/10)*10;
			createExit();
			break;
		case 'plate':
			tempdata.x2 = Math.ceil(rcurX/10)*10;
			tempdata.y2 = Math.ceil(rcurY/10)*10;
			createPlate();
			break;
		case 'button':
			tempdata.x2 = Math.ceil(rcurX/10)*10;
			tempdata.y2 = Math.ceil(rcurY/10)*10;
			createButtonObj();
			break;
		case 'text':
			createTextObj(rcurX,rcurY);
			break;
		}
	}

function createWall() {
	var obj={};

	obj.type = "wall";
	obj.x = Math.min(tempdata.x1,tempdata.x2);
	obj.y = Math.min(tempdata.y1,tempdata.y2);
	obj.width = Math.max(tempdata.x1,tempdata.x2)-obj.x;
	obj.height = Math.max(tempdata.y1,tempdata.y2)-obj.y;
	obj.color = {r: 0, g: 0, b: 0, a: 0};
	addObject(obj);
	tempdata = {};
	}

function addObject(o) {
	lvldata.objects.push(o);
	}

function render_spawn() {
	var scx,scy;

	scx = lvldata.spawn.x*2;
	scy = lvldata.spawn.y*2;
	ctx.save();
	ctx.strokeStyle="#0000FF";
	ctx.beginPath();
	ctx.moveTo(scx,scy-5);
	ctx.lineTo(scx,scy+5);
	ctx.moveTo(scx-5,scy);
	ctx.lineTo(scx+5,scy);
	ctx.moveTo(scx-5,scy-5);
	ctx.lineTo(scx+5,scy+5);
	ctx.moveTo(scx-5,scy+5);
	ctx.lineTo(scx+5,scy-5);
	ctx.stroke();
	ctx.restore();
	}

function col2bc(col) {
	return "rgb("+col.r+","+col.g+","+col.b+")";
	}

function clog(m) {
	console.log(m);
	}

function checkBB(obj,x,y) {
	var rect1 = {x: obj.x, y: obj.y, width: obj.width, height: obj.height};
	var rect2 = {x: x, y: y, width: 1, height: 1};

	if (obj.bb!= undefined) {
		rect1 = {x: obj.bb.x1, y: obj.bb.y1, width: obj.bb.x2-obj.bb.x1, height: obj.bb.y2-obj.bb.y1};
		}
	if (rect1.x < rect2.x + rect2.width &&
	rect1.x + rect1.width > rect2.x &&
	rect1.y < rect2.y + rect2.height &&
	rect1.height + rect1.y > rect2.y) {
		return true;
		} else return false;
	}

function resetMap() {
	lvldata.objects=[];
	}

function createExit() {
	var obj={};

	obj.type = "exit";
	obj.x = Math.min(tempdata.x1,tempdata.x2);
	obj.y = Math.min(tempdata.y1,tempdata.y2);
	obj.width = Math.max(tempdata.x1,tempdata.x2)-obj.x;
	obj.height = Math.max(tempdata.y1,tempdata.y2)-obj.y;
	obj.dst = lvldata.lvlname;
	addObject(obj);
	tempdata = {};
	}

function createPlate() {
	var obj={};

	obj.type = "pressureplate";
	obj.x = Math.min(tempdata.x1,tempdata.x2);
	obj.y = Math.min(tempdata.y1,tempdata.y2);
	obj.width = Math.max(tempdata.x1,tempdata.x2)-obj.x;
	obj.height = Math.max(tempdata.y1,tempdata.y2)-obj.y;
	obj.color = {r: 255, g: 0, b: 0, a: 0};
	obj.count = 10;
	addObject(obj);
	tempdata = {};
	}

function inspectItems() {
	var a = [];
	var c = "";

	for (var i=0;i<lvldata.objects.length;i++) {
		if (checkBB(lvldata.objects[i],inspectX,inspectY)) {
			a.push(i);
			}
		}
	clog(a);
	for (var i=0;i<a.length;i++) {
		c+=createPanel(hfNames[lvldata.objects[a[i]].type]+" <a href=\"#\" onclick=\"di("+a[i]+")\">Delete</a>",getPropertiesPanel(a[i]),"obj"+i+"pan",{nbm: true});
		c+="<br>";
		}
	si("objinfo",createPanel("Objects at ("+inspectX+","+inspectY+")",c,"objpan",{nbm: true}));
	}

function getPropertiesPanel(i) {
	var o = lvldata.objects[i],s="";
	switch(o.type) {
		case "text":
			s+="X: "+createPropNumberBox(i,'x')+"<br>";
			s+="Y: "+createPropNumberBox(i,'y',true)+"<br>";
			s+="Text Height: "+createPropNumberBox(i,'textHeight')+"<br>";
			s+="Text: "+createPropTextBox(i,'text')+"<br>";
			s+="Centered: "+createPropCheckbox(i,'isCentered');+"<br>";
			break;
		case "wall":
			s+="X: "+createPropNumberBox(i,'x')+"<br>";
			s+="Y: "+createPropNumberBox(i,'y')+"<br>";
			s+="Width: "+createPropNumberBox(i,'width')+"<br>";
			s+="Height: "+createPropNumberBox(i,'height')+"<br>";
			s+="Color: "+createPropColor(i,'color')+"<br>";
			break;
		case "exit":
			s+="X: "+createPropNumberBox(i,'x')+"<br>";
			s+="Y: "+createPropNumberBox(i,'y')+"<br>";
			s+="Width: "+createPropNumberBox(i,'width')+"<br>";
			s+="Height: "+createPropNumberBox(i,'height')+"<br>";
			s+="Destination Map: "+createPropTextBox(i,'dst')+"<br>";
			break;
		case "pressureplate":
			s+="X: "+createPropNumberBox(i,'x')+"<br>";
			s+="Y: "+createPropNumberBox(i,'y')+"<br>";
			s+="Width: "+createPropNumberBox(i,'width')+"<br>";
			s+="Height: "+createPropNumberBox(i,'height')+"<br>";
			s+="Color: "+createPropColor(i,'color')+"<br>";
			s+="Count: "+createPropNumberBox(i,'count')+"<br>";
			break;
		case "button":
			s+="X: "+createPropNumberBox(i,'x')+"<br>";
			s+="Y: "+createPropNumberBox(i,'y')+"<br>";
			s+="Width: "+createPropNumberBox(i,'width')+"<br>";
			s+="Height: "+createPropNumberBox(i,'height')+"<br>";
			s+="Color: "+createPropColor(i,'color')+"<br>";
			s+="Count: "+createPropNumberBox(i,'count');
			break;
		}
	return s;
	}

function createPropNumberBox(i,f) {
	return "<input type=\"number\" id=\"obj"+i+"prop"+f+"\" value=\""+lvldata.objects[i][f]+"\" onchange=\"pnc("+i+",'"+f+"')\">";
	}

function createPropColor(i,f) {
	var s = "";

	s=colorPreview(lvldata.objects[i][f]);
	for (var j=0;j<colors.length;j++) {
		s+=colorSelBtn(i,f,j);
		}
	return s;
	}

function colorPreview(c) {
	return "<div style=\"width: 20px; height: 20px; background-color: "+col2bc(c)+"\"></div>"
	}

function colobj(r,g,b,a) {
	return {r: r, g: g, b: b, a: a};
	}

function colorSelBtn(i,f,c) {
	return "<button class=\"btn btn-default\" onclick=\"pcc("+i+",\'"+f+"\',"+c+")\">"+colorPreview(colors[c])+"</button>";
	}

function pnc(i,f) {
	var v = gi("obj"+i+"prop"+f);

	lvldata.objects[i][f] = v;
	}

function pcc(i,f,c) {
	var o = colors[c];
	lvldata.objects[i][f] = colobj(o.r,o.g,o.b,o.a);
	}

function createPropTextBox(i,f) {
	return "<input type=\"text\" id=\"obj"+i+"prop"+f+"\" value=\""+lvldata.objects[i][f]+"\" onchange=\"ptc("+i+",'"+f+"')\">";
	}

function ptc(i,f) {
	var v = gv("obj"+i+"prop"+f);

	lvldata.objects[i][f] = v;
	}

function di(i) {
	lvldata.objects.splice(i,1);
	inspectItems();
	}

function createButtonObj() {
	var obj={};

	obj.type = "button";
	obj.x = Math.min(tempdata.x1,tempdata.x2);
	obj.y = Math.min(tempdata.y1,tempdata.y2);
	obj.width = Math.max(tempdata.x1,tempdata.x2)-obj.x;
	obj.height = Math.max(tempdata.y1,tempdata.y2)-obj.y;
	obj.color = {r: 255, g: 0, b: 0, a: 0};
	obj.count = 10;
	addObject(obj);
	tempdata = {};
	}

function createTextObj(x,y) {
	var obj={};

	obj.type = "text";
	obj.text = "Sample Text";
	obj.textHeight = 20;
	obj.width = getTxtWidth(obj.textHeight,obj.text);
	obj.x = x;
	obj.y = y;
	obj.bb = {x1: obj.x, y1: obj.y-obj.textHeight, x2: obj.x+obj.width, y2: obj.y};
	obj.isCentered = false;
	addObject(obj);
	}

function getTxtWidth(h,t) {
	var w = 0;
	ctx.save();
	ctx.font = h+"px NovaSquare";
	w = ctx.measureText(t).width/2;
	ctx.restore();
	return w;
	}

function updateObj(i) {
	var o = lvldata.objects[i];

	o.width = getTxtWidth(o.textHeight,o.text);
	}

function render_preview() {
	var o = {};

	o.x = Math.min(tempdata.x1,rcurX);
	o.y = Math.min(tempdata.y1,rcurY);
	o.width = Math.max(tempdata.x1,rcurX)-o.x;
	o.height = Math.max(tempdata.y1,rcurY)-o.y;
	switch(curTool) {
		case 'wall':
		case 'exit':
		case 'plate':
		case 'button':
			ctx.save();
			ctx.strokeStyle="#000";
			ctx.strokeRect(o.x*2,o.y*2,o.width*2,o.height*2);
			ctx.restore();
			break;
		}
	}

function expMap() {
	var s = "";

	s+=createButton("kc9zda Format","em('kc9zda');",false,"default")+"<br>";
	s+=createButton("eldit Format","em('eldit');",false,"default")+"<br>";
	s=createPanel("Export Map",s,"exportpan",{nbm: true});
	si("objinfo",s);
	}

function em(f) {
	var o = {};
	var readyForExport = false;
	switch(f) {
		case 'kc9zda':
			o.spawn = {};
			o.spawn.x = lvldata.spawn.x;
			o.spawn.y = lvldata.spawn.y;
			o.objects = [];
			for (var i=0;i<lvldata.objects.length;i++) {
				switch(lvldata.objects[i].type) {
					case "text":
						o.objects[i]={};
						o.objects[i].type = 0;
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].textHeight = lvldata.objects[i].textHeight;
						o.objects[i].isCentered = lvldata.objects[i].isCentered;
						o.objects[i].text = lvldata.objects[i].text;
						break;
					case "wall":
						o.objects[i]={};
						o.objects[i].type = 1;
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].width = lvldata.objects[i].width;
						o.objects[i].height = lvldata.objects[i].height;
						o.objects[i].color = {};
						o.objects[i].color.r = lvldata.objects[i].color.r;
						o.objects[i].color.g = lvldata.objects[i].color.g;
						o.objects[i].color.b = lvldata.objects[i].color.b;
						o.objects[i].color.a = lvldata.objects[i].color.a;
						break;
					case "exit":
						o.objects[i]={};
						o.objects[i].type = 2;
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].width = lvldata.objects[i].width;
						o.objects[i].height = lvldata.objects[i].height;
						o.objects[i].dst = lvldata.objects[i].dst;
						break;
					case "pressureplate":
						o.objects[i]={};
						o.objects[i].type = 3;
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].width = lvldata.objects[i].width;
						o.objects[i].height = lvldata.objects[i].height;
						o.objects[i].color = {};
						o.objects[i].color.r = lvldata.objects[i].color.r;
						o.objects[i].color.g = lvldata.objects[i].color.g;
						o.objects[i].color.b = lvldata.objects[i].color.b;
						o.objects[i].color.a = lvldata.objects[i].color.a;
						o.objects[i].count = lvldata.objects[i].count;
						break;
					case "button":
						o.objects[i]={};
						o.objects[i].type = 4;
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].width = lvldata.objects[i].width;
						o.objects[i].height = lvldata.objects[i].height;
						o.objects[i].color = {};
						o.objects[i].color.r = lvldata.objects[i].color.r;
						o.objects[i].color.g = lvldata.objects[i].color.g;
						o.objects[i].color.b = lvldata.objects[i].color.b;
						o.objects[i].color.a = lvldata.objects[i].color.a;
						o.objects[i].count = lvldata.objects[i].count;
						break;
					}
				}
			o.lvlname = lvldata.lvlname;
			readyForExport = true;
			break;
		case 'eldit':
			o.startpos = {};
			o.startpos.x = lvldata.spawn.x;
			o.startpos.y = lvldata.spawn.y;
			o.objects = [];
			for (var i=0;i<lvldata.objects.length;i++) {
				switch(lvldata.objects[i].type) {
					case "text": // n/a atm for eldit format
						o.objects[i]={};
						//o.objects[i].type = "text";
						//o.objects[i].x = lvldata.objects[i].x;
						//o.objects[i].y = lvldata.objects[i].y;
						//o.objects[i].textSize = lvldata.objects[i].textHeight;
						//o.objects[i].isCentered = lvldata.objects[i].isCentered;
						//o.objects[i].text = lvldata.objects[i].text;
						break;
					case "wall":
						o.objects[i]={};
						o.objects[i].type = "wall";
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].w = lvldata.objects[i].width;
						o.objects[i].h = lvldata.objects[i].height;
						o.objects[i].color = eldit_color(lvldata.objects[i].color);
						break;
					case "exit":
						o.objects[i]={};
						o.objects[i].type = "exit";
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].w = lvldata.objects[i].width;
						o.objects[i].h = lvldata.objects[i].height;
						break;
					case "pressureplate": //n/a atm for eldit format
						o.objects[i]={};
						//o.objects[i].type = 3;
						//o.objects[i].x = lvldata.objects[i].x;
						//o.objects[i].y = lvldata.objects[i].y;
						//o.objects[i].width = lvldata.objects[i].width;
						//o.objects[i].height = lvldata.objects[i].height;
						//o.objects[i].color = {};
						//o.objects[i].color.r = lvldata.objects[i].color.r;
						//o.objects[i].color.g = lvldata.objects[i].color.g;
						//o.objects[i].color.b = lvldata.objects[i].color.b;
						//o.objects[i].color.a = lvldata.objects[i].color.a;
						//o.objects[i].count = lvldata.objects[i].count;
						break;
					case "button":
						o.objects[i]={};
						o.objects[i].type = "button";
						o.objects[i].x = lvldata.objects[i].x;
						o.objects[i].y = lvldata.objects[i].y;
						o.objects[i].w = lvldata.objects[i].width;
						o.objects[i].h = lvldata.objects[i].height;
						o.objects[i].color = eldit_color(lvldata.objects[i].color);
						o.objects[i].count = lvldata.objects[i].count;
						break;
					}
				}
			readyForExport = true;
			break;
		}
	if (readyForExport) {
		var msg = "";
		var md = JSON.stringify(o);
		switch (f) {
			case 'kc9zda':
				msg="Add this to a new, empty text file, and save as a .zda file";
				break;
			case 'eldit':
				msg="Add this to the JSON array in maps.json";
				break;
			}
		si("exportpancont",msg+"<br><code>"+md+"</code>");
		}
	}

var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];

function byteToHex(b) {
  return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
}

function eldit_color(c) {
	var s = byteToHex(c.r)+byteToHex(c.g)+byteToHex(c.b)+byteToHex(c.a);

	return s;
	}

function createPropCheckbox(i,f) {
	return "<input type=\"checkbox\" id=\"obj"+i+"prop"+f+"\" "+(lvldata.objects[i][f]?"checked":"")+" onchange=\"pcbc("+i+",'"+f+"')\">";
	}

function pcbc(i,f) {
	var v = ge("obj"+i+"prop"+f).checked;

	lvldata.objects[i][f] = v;
	}

function fixTextBox(obj) {
	obj.width = getTxtWidth(obj.textHeight,obj.text);
	obj.bb = {x1: obj.x, y1: obj.y-obj.textHeight, x2: obj.x+obj.width, y2: obj.y};
	}
