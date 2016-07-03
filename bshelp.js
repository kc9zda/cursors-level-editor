function show_overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = "visible";
}

function hide_overlay() {
	el = document.getElementById("overlay");
	el.style.visibility = "hidden";
}

function createPanel(head,cont,idb,opts) {
	var hid=idb+"head";
	var cid=idb+"cont";
	var pid=idb;
	var rv;
	var de = '</div>';

	rv='<div class="panel panel-default '+(opts.vcenter?'vcenter':'')+' '+(opts.aligtop?'aligtop':'')+'" id="'+pid+'">';
	rv+='<div class="panel-heading" id="'+hid+'" style="display: block;">';
	rv+=head;
	rv+=de
	rv+='<div class="panel-body" id="'+cid+'">';
	rv+=cont;
	rv+=de;
	rv+=de;
	return rv;
	}

function setOverlay(d) {
	var overlay = document.getElementById("overlay");
	overlay.innerHTML = d;
	}

function createButton(text,click,id,theme) {
	var ida = (id?" id=\""+id+"\"":"");
	var cs = (theme?" class=\"btn btn-"+theme+"\"":"btn");

	return "<button "+ida+" onclick=\""+click+"\" "+cs+">"+text+"</button>";
	}

function createTextBox(id) {
	return "<input type=\"text\" id=\""+id+"\">";
	}

function createUnorderedList(items) {
	var rv = "<ul class=\"list-group\">";

	$.each(items,function (i,v){rv+="<li class=\"list-group-item\">"+items[i]+"</li>"});
	rv+="</ul>";
	return rv;
	}

function createTableBody(table) {
	var rv ="";

	$.each(table,function(i,v) {
		rv+="<tr>";
		$.each(v,function(i2,v2){
			rv+="<td>";
			rv+=v2;
			rv+="</td>";
			});
		rv+="</tr>";
		});
	return rv;
	}

function createDropdown(txt,items) {
	var rv = "<div class=\"btn-group\">";
	var itms = cdd_convertItems(items);
	rv+='<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+txt+' <span class="caret"></span></button>';
	rv+=cdd_createDropDownList(itms);
	rv+="</div>";
	return rv;
	}

function cdd_convertItems(items) {
	var a =[];

	$.each(items,function(i,v){
		a.push('<a href="'+(v.href||'#')+'" onclick="'+(v.onclick||'return;')+'">'+v.text+'</a>');
		});
	return a;
	}

function cdd_createDropDownList(items) {
	var rv = "<ul class=\"dropdown-menu\">";

	$.each(items,function (i,v){rv+="<li>"+items[i]+"</li>"});
	rv+="</ul>";
	return rv;
	}

function createHidden(id) {
	return '<input type="hidden" id="'+id+'">';
	}

function createAlert(lvl,cont) {
	return '<div class="alert alert-'+lvl+'">'+cont+'</div>';
	}

function ge(i) {
	return document.getElementById(i);
	}

function gv(i) {
	return ge(i).value;
	}

function gi(i) {
	return parseInt(gv(i));
	}
