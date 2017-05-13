function buscarPrecargadas() {
	if (datosCargados == 0) {
		escribirMensaje("Primero tenes que agregar los horarios en el menú de opciones", 1);
		return;
	}

	clearTimeout(tBusqueda);
	tBusqueda = setTimeout(timerBusqueda, 1000);
}


function materiaFromId(id) {
	var materia = globalDatosMaterias[id];
	indexCombinacion = 0;
	aCombinaciones.length = 0;
	escribirMensaje("Materia agregada", 0);
	document.getElementById("combMinMat").value = aMaterias.length + 1;
	document.getElementById("subIzquierda").style.visibility = "hidden";
	document.getElementById("subDerecha").style.visibility = "hidden";

	aMaterias.push(materia);

	llenarLista();

	var str = document.getElementById("buscadas").innerHTML;
	var pos = str.indexOf(materia.nombre + "</a>");
	var pos2 = str.indexOf("</a>", pos);
	str = str.substring(0, pos2 + 4) + " - <font color=darkgreen><b>Ya agregada</b></font>" + str.substring(pos2 + 4);
	document.getElementById("buscadas").innerHTML = str;
}

function checkedIfTrue(b) {
	if (b == 1) {
		return "checked";
	} else {
		return "";
	}
}

function noIfTrue(b) {
	//alert(b);
	if (b) {
		return "No";
	} else {
		return "";
	}
}

function changeMatColor(i) {
	aMaterias[i].color = document.getElementById("matColor" + i).value;
	dibujarCalendario();
}

function textIfTrue(b, text) {
	if (b) {
		return text;
	} else {
		return "";
	}
}

function forzarMateria(i) {
	if (aMaterias[i].forzar == 0) {
		aMaterias[i].forzar = 1;
	} else {
		aMaterias[i].forzar = 0;
	}
	llenarLista();
}

function forzarCursoMateria(i, j) {
	var posJ = aMaterias[i].cursoForzado.indexOf(j);
	if (posJ != -1) {
		aMaterias[i].cursoForzado.splice(posJ, 1);
	} else {
		aMaterias[i].cursoForzado.push(j);
	}
	llenarLista();
}

function llenarLista() {
	document.getElementById("listaInfo").innerHTML = "";
	var idCurso = 0;
	for (var i = 0; i < aMaterias.length; i++) {
		document.getElementById("listaInfo").innerHTML += "<input type=\"checkbox\" style=\"background-color:rgb(12,102,144);\" id=\"check" + i + "\" " + checkedIfTrue(aMaterias[i].sel == 1) + " onclick=\"clicked(" + i + ",0,0);\"><che onclick=\"mClicked(" + i + ")\">" + aMaterias[i].codigo + " - " + aMaterias[i].nombre.substr(0, 55) + "</che> <input onchange=\"changeMatColor(" + i + ")\" value=\"" + aMaterias[i].color + "\" id=\"matColor" + i + "\" type=\"color\" /> <br> <b><a style=\"font-color:blue\" onclick=\"clicked(" + i + ",0,1);\">Borrar</a> - <a style=\"font-color:blue\" onclick=\"forzarMateria(" + i + ");\">" + textIfTrue(aMaterias[i].forzar, "<font color=red>") + noIfTrue(aMaterias[i].forzar) + " Forzar Materia" + textIfTrue(aMaterias[i].forzar, "</font>") + "</a></b> <br>";
		if (aMaterias[i].expanded == 0) continue;
		for (var j = 0; j < aMaterias[i].cursos.length; j++) {
			document.getElementById("listaInfo").innerHTML += "<input  " + checkedIfTrue(aMaterias[i].cursoSel == j + 1) + " type=\"radio\" name=\"materia" + i + "\" id=\"rad" + idCurso + "\" onclick=\"clicked(" + i + "," + (j + 1) + ",0);\"><label for=\"rad" + idCurso + "\">" + aMaterias[i].cursos[j].docentes + "</label> - <a style=\"font-color:blue\" onclick=\"forzarCursoMateria(" + i + "," + (j + 1) + ");\"><b>" + textIfTrue(aMaterias[i].cursoForzado.indexOf(j + 1) != -1, "<font color=red>") + noIfTrue(aMaterias[i].cursoForzado.indexOf(j + 1) != -1) + " Forzar Curso" + textIfTrue(aMaterias[i].cursoForzado.indexOf(j + 1) != -1, "</font>") + "</b></a><br>";
			idCurso++;
		}
	}

}

function mClicked(i) {
	if (aMaterias[i].expanded == 1) {
		aMaterias[i].expanded = 0;
	} else {
		aMaterias[i].expanded = 1;
	}
	llenarLista();
}

function clicked(x, y, b) {
	if (b == 1) {
		aMaterias.splice(x, 1);
		llenarLista();
		dibujarCalendario();
		document.getElementById("combMinMat").value = aMaterias.length + 1;
		document.getElementById("subIzquierda").style.visibility = "hidden";
		document.getElementById("subDerecha").style.visibility = "hidden";
		return;
	}
	if (y == 0) {
		if (aMaterias[x].sel == 1) {
			aMaterias[x].sel = 0;
			aMaterias[x].cursoSel = 0;
		} else {
			aMaterias[x].sel = 1;
			aMaterias[x].expanded = 1;
		}
	}
	if (y != 0) {
		aMaterias[x].sel = 1;
		aMaterias[x].cursoSel = y;
	}
	llenarLista();
	dibujarCalendario();
}

function dibujarCalendario() {
	clearSVG();
	for (var i = 0; i < aMaterias.length; i++) {
		var materia = aMaterias[i];
		if (materia.sel == 1) {
			if (materia.cursoSel == 0) {
				continue;
			}

			var ind = (materia.cursoSel) - 1;
			var c = materia.cursos[ind].clases;
			for (var j = 0; j < c.length; j++) {
				var posX = 6.3 + (15.625 * c[j].dia);
				var posY = 6.20 + (2.76 * c[j].inicio);
				var altura = 2.76 * (c[j].fin - c[j].inicio);
				var textX = posX + 7.75;
				var textY = posY + 2.76;
				var svgNS = "http://www.w3.org/2000/svg";
				var rect = document.createElementNS(svgNS, "rect");
				rect.setAttributeNS(null, "id", "rect" + j);
				rect.setAttributeNS(null, "x", posX + "%");
				rect.setAttributeNS(null, "y", posY + "%");
				rect.setAttributeNS(null, "width", 15.625 + "%");
				rect.setAttributeNS(null, "height", altura + "%");
				rect.setAttributeNS(null, "fill", materia.color);
				rect.setAttributeNS(null, "stroke", "none");
				rect.setAttributeNS(null, "opacity", 0.5);
				document.getElementById("canvas").appendChild(rect);
				var lines = materia.nombre.split(" ");
				for (var k = 0; k < lines.length - 1; k++) {
					if (lines[k].length + lines[k + 1].length < 16) {
						lines[k] = lines[k] + " " + lines[k + 1];
						lines.splice(k + 1, 1);
						k--;
					}
				}
				for (var k = 0; k < lines.length; k++) {
					var text = document.createElementNS(svgNS, "text");
					text.setAttributeNS(null, "text-anchor", "middle");
					text.setAttributeNS(null, "x", textX + "%");
					text.setAttributeNS(null, "y", textY + 2.07 * k + "%");
					text.setAttributeNS(null, "fill", "black");
					text.setAttributeNS(null, "style", "font-size:12px");
					text.textContent = lines[k];
					document.getElementById("canvas").appendChild(text);
				}

				lines = [c[j].tipo, c[j].sede + " " + c[j].aula];
				for (var l = 0; l < lines.length; l++) {
					var text2 = document.createElementNS(svgNS, "text");
					text2.setAttributeNS(null, "text-anchor", "middle");
					text2.setAttributeNS(null, "x", textX + "%");
					text2.setAttributeNS(null, "y", textY + 2.07 * l + 2.07 * k + "%");
					text2.setAttributeNS(null, "fill", "black");
					text2.setAttributeNS(null, "style", "font-size:10px");
					text2.textContent = lines[l];
					document.getElementById("canvas").appendChild(text2);
				}
			}
		}
	}

	var disponibilidad = new Array();

	for (var i = 0; i < 204; i++) {
		disponibilidad[i] = 2;
		aDescCelda[i] = "";
	}

	for (i = 0; i < aMaterias.length; i++) {
		if (aMaterias[i].cursoSel == 0) {
			continue;
		}

		for (var j = 0; j < aMaterias[i].cursos[aMaterias[i].cursoSel - 1].clases.length; j++) {
			var clase = aMaterias[i].cursos[aMaterias[i].cursoSel - 1].clases[j];
			var cInicio = clase.inicio + clase.dia * 34;
			var cFin = clase.fin + clase.dia * 34;
			for (k = cInicio; k < cFin; k++) {
				disponibilidad[k]--;
				if (aDescCelda[k] == "") {
					aDescCelda[k] = shortNames(aMaterias[i].nombre) + ": " + aMaterias[i].cursos[aMaterias[i].cursoSel - 1].docentes;
				} else {
					aDescCelda[k] = "Superposición: " + aDescCelda[k] + " y " + shortNames(aMaterias[i].nombre) + ": " + aMaterias[i].cursos[aMaterias[i].cursoSel - 1].docentes;
				}
			}
		}
	}

	var ini = 0;
	var flag = 0;
	for (var i = 0; i < 204; i++) {
		if (i % 34 == 0) {
			if (flag == 1) {
				dibujarSuperposEnColRow(ini, i, "canvas", "supRect" + i);
				flag = 0;
			}
		}
		if (disponibilidad[i] > 0) {
			if (flag == 1) {
				dibujarSuperposEnColRow(ini, i, "canvas", "supRect" + i);
				flag = 0;
			}
		} else {
			if (flag == 0) {
				ini = i;
				flag = 1;
			}

		}

	}

}

function getCellDescription() {
	if (mouseColInCanvas > -1 && mouseColInCanvas < 6 && mouseRowInCanvas > -1 && mouseRowInCanvas < 34) {
		document.getElementById('descText').innerHTML = aDescCelda[mouseRowInCanvas + 34 * mouseColInCanvas];
	}
}

function getCellFromPos(perX, perY) {
	var col = Math.floor((perX - 6.25) / 15.625);
	var row = Math.floor((perY - 6.2) / 2.76);
	mouseColInCanvas = col;
	mouseRowInCanvas = row;
	return "col: " + col + " , row: " + row;
}

function dibujarRectEnColRow(col, row, parent, id) {
	if (col > -1 && col < 6 && row > -1 && row < 35) {
		var svgNS = "http://www.w3.org/2000/svg";
		var rect = document.createElementNS(svgNS, "rect");
		rect.setAttributeNS(null, "id", id);
		rect.setAttributeNS(null, "x", (col * 15.625 + 6.3) + "%");
		rect.setAttributeNS(null, "y", (row * 2.76 + 6.2) + "%");
		rect.setAttributeNS(null, "width", 15.625 + "%");
		rect.setAttributeNS(null, "height", 2.76 + "%");
		rect.setAttributeNS(null, "fill", "rgb(134,220,215)");
		rect.setAttributeNS(null, "stroke", "rgb(102,172,167)");
		rect.setAttributeNS(null, "stroke-width", "2px");
		rect.setAttributeNS(null, "opacity", 0.25);
		document.getElementById(parent).appendChild(rect);
	}
}

function dibujarSuperposEnColRow(inicio, fin, parent, id) {
	var posX = (Math.floor(inicio / 34) * 15.625 + 6.3);
	var posY = (inicio % 34 * 2.76 + 6.2);
	var width = 15.625;
	var height = (fin - inicio) * 2.76;
	var svgNS = "http://www.w3.org/2000/svg";
	var rect = document.createElementNS(svgNS, "rect");
	rect.setAttributeNS(null, "id", id);
	rect.setAttributeNS(null, "x", posX + "%");
	rect.setAttributeNS(null, "y", posY + "%");
	rect.setAttributeNS(null, "width", width + "%");
	rect.setAttributeNS(null, "height", height + "%");
	rect.setAttributeNS(null, "fill", "rgb(216,61,61)");
	rect.setAttributeNS(null, "stroke", "rgb(186,31,31)");
	rect.setAttribute('stroke-width', "2px");
	rect.setAttributeNS(null, "opacity", 0.85);
	document.getElementById(parent).appendChild(rect);
	var posX1 = posX + (width / 6);
	var posX2 = posX;
	var posY1 = posY;
	var posY2 = posY + 2.76;
	for (var i = 1; i <= (5 + fin - inicio); i++) {
		var aLine = document.createElementNS('http://www.w3.org/2000/svg', "line");
		aLine.setAttributeNS(null, "id", "line" + i);
		aLine.setAttribute('x1', posX1 + "%");
		aLine.setAttribute('y1', posY1 + "%");
		aLine.setAttribute('x2', posX2 + "%");
		aLine.setAttribute('y2', posY2 + "%");
		aLine.setAttribute('stroke', "rgb(186,31,31)");
		aLine.setAttribute('stroke-width', "2px");
		document.getElementById(parent).appendChild(aLine);
		if (i < 6) posX1 += (width / 6);
		if (i > (fin - inicio - 1)) posX2 += (width / 6);
		if (i >= 6) posY1 += 2.76;
		if (i < (fin - inicio)) posY2 += 2.76;
	}
}

function shortNames(str) {
	str = str.replace("LABORATORIO", "LABO");
	str = str.replace("MICROPROCESADORES", "MICROS");
	str = str.replace("MICROCONTROLADORES", "MICROS");
	str = str.replace("ALGORITMOS Y PROGRAMACIÓN", "ALGO");
	str = str.replace("ALGORITMOS Y PROGRAMACION", "ALGO");
	str = str.replace("TERMODINÁMICA", "TERMO");
	str = str.replace("TERMODINAMICA", "TERMO");
	str = str.replace("ANALISIS MATEMATICO", "AM");
	str = str.replace("ANALISIS NUMERICO", "NUMERICO");
	str = str.replace("ANÁLISIS NUMÉRICO", "NUMERICO");
	str = str.replace("SISTEMAS", "SIS.");
	str = str.replace("PROBABILIDAD Y ESTADISTICA", "PROBA Y EST.");
	str = str.replace("INTRODUCCION", "INTR.");
	str = str.replace("INTRODUCCIÓN", "INTR.");
	str = str.replace("INGENIERIA", "ING.");
	str = str.replace("INGENIERÍA", "ING.");
	return str;
}

function clearSVG() {
	var myNode = document.getElementById("canvas");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function clearTopCanvas() {
	var myNode = document.getElementById("topCanvas");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
}

function escribirMensaje(str, alert) {
	if (alert == 1) {
		document.getElementById("msg").innerHTML = "<msgAlert>*" + str + "</msgAlert>";
		document.getElementById("msgBox").style.visibility = "visible";
	} else {
		document.getElementById("msg").innerHTML = "<msgText>*" + str + "</msgText>";
		document.getElementById("msgBox").style.visibility = "visible";
	}
	clearTimeout(timerMsj);
	timerMsj = setTimeout(function () { timerMensaje() }, 10000);

}

function clickBuscar() {
	if (document.getElementById("buscar").value === "Ingresá la materia que queres buscar") {
		document.getElementById("buscar").value = "";
	}
}

function ningunaCarreraSeleccionada() {
	return $("#buscar-materia-content input[type=checkbox]:checked").length === 0;
}

function descargarHorarios() {
	var str = "";

	//str += "<svg width=\"800\" height=\"600\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";

	str += "<svg class=\"ui-widget-content\" id=\"backCalendar\" viewBox=\"0 0 1000 580\" preserveAspectRatio=\"none\" width=\"80%\" height=\"90%\" style=\"position: absolute; left:10%; top:10px;background-color:rgb(245,245,245);background-image:url('logo.png');border-style:solid;border-color:rgb(9,153,201);border-width:1px;background-repeat: no-repeat;background-position: center;border-radius: 25px 0px 0px 0px;z-index:-3;\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" >";

	str += document.getElementById("backCalendar").innerHTML;

	str += document.getElementById("canvas").innerHTML;

	str += "</svg>";


	if (get_browser_info().name == "IE") {
		escribirMensaje("Esta opción no es soportada en IE", 1);
		return;
	}

	var a = window.document.createElement('a');
	a.href = window.URL.createObjectURL(new Blob([str], { type: 'svg' }));
	a.download = 'horarios.svg';


	document.body.appendChild(a)
	a.click();
	document.body.removeChild(a)

}

function calcularCombinaciones() {
	aCombinaciones.length = 0;
	indexCombinacion = 0;
	var nCombinaciones = 1;
	var horariosPosibles = 0;

	if (aMaterias.length == 0) {
		escribirMensaje("Primero tenes que elegir alguna materia", 1);
		return;
	}
	if (document.getElementById("combMinMat").value == "") {
		escribirMensaje("Error en mínimo de materias a combinar", 1);
		return;
	}

	for (var i = 0; i < aMaterias.length; i++) {
		nCombinaciones *= (aMaterias[i].cursos.length + 1);
	}

	var maxSup = Number(document.getElementById("combMaxSup").value) * 2;
	for (var i = 0; i < nCombinaciones; i++) {
		var numeroSuperposicion = haySuperposicion(i);
		if (numeroSuperposicion != -1 && maxSup >= numeroSuperposicion) {
			horariosPosibles++;
			aCombinaciones.push(i);
		}
	}

	if (horariosPosibles == 1) {
		escribirMensaje("Hay " + horariosPosibles + " combinación posible", 0);
	} else {
		escribirMensaje("Hay " + horariosPosibles + " combinaciones posibles", 0);
	}

	if (horariosPosibles == 0) {
		document.getElementById("subIzquierda").style.visibility = "hidden";
		document.getElementById("subDerecha").style.visibility = "hidden";
	} else {
		document.getElementById("subIzquierda").style.visibility = "visible";
		document.getElementById("subDerecha").style.visibility = "visible";
	}

}

function haySuperposicion(nComb) {	//devuelve la cantidad de bloques de media hora con superposición. En caso de no cumplir las condiciones de materias forzadas y de mínimo de materias, devuelve -1
	var superposicion = 0;
	var disponibilidad = new Array();
	var cursos = new Array();
	var minimoMaterias = Number(document.getElementById("combMinMat").value);
	for (var i = 0; i < 204; i++) {
		disponibilidad[i] = 2;
	}

	for (var i = 0; i < aMaterias.length; i++) {
		cursos[i] = nComb;
		for (var j = 0; j < i; j++) {
			cursos[i] = Math.floor(cursos[i] / (aMaterias[j].cursos.length + 1));
		}
		cursos[i] = cursos[i] % (aMaterias[i].cursos.length + 1);
		if (aMaterias[i].forzar == 1 && cursos[i] == 0) return -1;
		if (aMaterias[i].cursoForzado.length != 0 && aMaterias[i].cursoForzado.indexOf(cursos[i]) == -1 && cursos[i] != 0) return -1;
		if (cursos[i] != 0 && aMaterias[i].codigo != "EXTC") minimoMaterias--;
	}

	if (minimoMaterias > 0) return -1;

	for (var i = 0; i < aMaterias.length; i++) {
		if (cursos[i] == 0) continue;
		cursos[i]--;
		for (var j = 0; j < aMaterias[i].cursos[cursos[i]].clases.length; j++) {
			var cInicio = aMaterias[i].cursos[cursos[i]].clases[j].inicio + aMaterias[i].cursos[cursos[i]].clases[j].dia * 34;
			var cFin = aMaterias[i].cursos[cursos[i]].clases[j].fin + aMaterias[i].cursos[cursos[i]].clases[j].dia * 34;
			//alert(cInicio + " => " + cFin);
			for (k = cInicio; k < cFin; k++) {
				disponibilidad[k]--;
				if (disponibilidad[k] == 0) {
					superposicion++;
					//break;
				}
			}
		}
	}

	return superposicion;
}

function siguienteComb(way) {
	if (aCombinaciones.length == 0) return;
	if (way == 0) {
		indexCombinacion--;
		if (indexCombinacion < 1) {
			indexCombinacion = aCombinaciones.length;
		}


	} else {
		indexCombinacion++;
		if (indexCombinacion > aCombinaciones.length) {
			indexCombinacion = 1;
		}
	}
	escribirMensaje("Combinación " + indexCombinacion + "/" + aCombinaciones.length, 0);

	var cursos = new Array();

	for (var i = 0; i < aMaterias.length; i++) {
		cursos[i] = aCombinaciones[indexCombinacion - 1];
		for (var j = 0; j < i; j++) {
			cursos[i] = Math.floor(cursos[i] / (aMaterias[j].cursos.length + 1));
		}
		cursos[i] = cursos[i] % (aMaterias[i].cursos.length + 1);

		aMaterias[i].sel = 1;
		if (cursos[i] == 0) aMaterias[i].sel = 0;
		aMaterias[i].cursoSel = cursos[i];
	}
	dibujarCalendario();
	llenarLista();

}

function guardarEstado() {
	var str = JSON.stringify(aMaterias);
	var a = window.document.createElement('a');
	a.href = window.URL.createObjectURL(new Blob([str], { type: 'text' }));
	a.download = 'organizadorfiuba.json';
	document.body.appendChild(a)
	a.click();
	document.body.removeChild(a)
}

function cargarEstado(event) {
	var reader = new FileReader();
	reader.onload = function (e) {
		aMaterias = JSON.parse(e.target.result);
		llenarLista();
		dibujarCalendario();
	}
	reader.readAsText(event.target.files[0]);
}

function timerMensaje() {
	document.getElementById('msgBox').style.visibility = 'hidden';
	clearTimeout(timerMsj);
}

function toUpperSinTilde(str) {
	str = str.toUpperCase();
	str = str.replace("Á", "A");
	str = str.replace("É", "E");
	str = str.replace("Í", "I");
	str = str.replace("Ó", "O");
	str = str.replace("Ú", "U");
	str = str.replace("ñ", "Ñ");
	return str;
}

function timerBusqueda() {
	var str = document.getElementById("buscar").value;
	str = toUpperSinTilde(str);

	var mats = [];
	if (ningunaCarreraSeleccionada()) {
		for (var i = 0; i < globalDatosMaterias.length; i++) {
			mats.push(i);
		}
	}
	else {
		// Podría haber algún docente con una carrera distinta? Eso parecen indicar los datos.
		for (var i = 0; i < globalDatosMaterias.length; i++) {
			for (var j = 0; j < globalDatosCarreras.length; j++) {
				if (document.getElementById("car" + (j + 1)).checked && globalDatosCarreras[j].materias.indexOf(i) > -1) {
					mats.push(i);
				}
			}
		}
		mats = uniqueArray(mats);
	}

	var html = "";
	var encontradas = 0;
	for (var i = 0; i < mats.length; i++) {
		var ix = mats[i];
		var materia = globalDatosMaterias[ix];
		if (toUpperSinTilde(materia.nombre).indexOf(str) > -1 || toUpperSinTilde(materia.codigo).indexOf(str) > -1) {
			html += "<a onclick=\"materiaFromId('" + ix + "');\" >" + materia.codigo + " - " + materia.nombre + "</a>";
			for (var j = 0; j < aMaterias.length; j++) {
				if (materia.codigo == aMaterias[j].codigo) {
					html += " - <font color=darkgreen><b>Ya agregada</b></font>";
				}
			}
			html += "<br>";
			if (++encontradas > 20) {
				break;
			}
		}
	}

	document.getElementById("buscadas").innerHTML = html;
}

function cHAceptar() {
	var desc = document.getElementById("cHDesc").value;

	if (desc == "") {
		escribirMensaje("Tenes que agregar una descripción", 1);
		return;
	}

	for (var i = 0; i < cHSize; i++) {
		var inicio = Number(document.getElementById("cHInicio" + i).value);
		var fin = Number(document.getElementById("cHFin" + i).value);
		if (fin <= inicio) {
			escribirMensaje("Error en el bloque " + (i + 1), 1);
			return;
		}
	}

	var mat = {
		codigo: "EXTC",
		nombre: desc,
		cursos: [],
		// necesario para el frontend
		sel: 1,
		cursoSel: 1,
		expanded: 1,
		forzar: 1,
		cursoForzado: [],
		color: "#BA3A7A"
	};
	var cur = {
		docentes: desc,
		clases: []
	};

	for (var i = 0; i < cHSize; i++) {
		var dia = Number(document.getElementById("cHDia" + i).value);
		var inicio = Number(document.getElementById("cHInicio" + i).value);
		var fin = Number(document.getElementById("cHFin" + i).value);
		if (dia === 6) {
			for (var j = 0; j < 5; j++) {
				cur.clases.push({
					tipo: "Extracurricular",
					dia: j,
					inicio: inicio,
					fin: fin,
					sede: "",
					aula: ""
				});
			}

			continue;
		}
		cur.clases.push({
			tipo: "Extracurricular",
			dia: dia,
			inicio: inicio,
			fin: fin,
			sede: "",
			aula: ""
		});
	}

	mat.cursos.push(cur);
	aMaterias.push(mat);
	llenarLista();
	dibujarCalendario();
	escribirMensaje("Horario agregado", 0);
	document.getElementById('cHTab').style.visibility = 'hidden';
}

function cHCrearHorario() {
	document.getElementById('cHTab').style.visibility = 'visible';

	if (cHSize != 0) return;
	document.getElementById('cHClasesDiv').innerHTML = "Día: <select id=\"cHDia0\"> <option value=\"0\">Lunes</option> <option value=\"1\">Martes</option> <option value=\"2\">Miércoles</option> <option value=\"3\">Jueves</option> <option value=\"4\">Viernes</option> <option value=\"5\">Sábado</option> <option value=\"6\">Lunes a Viernes</option> </select> Inicio: <select id=\"cHInicio0\"> <option value=\"0\">7:00</option> <option value=\"1\">7:30</option> <option value=\"2\">8:00</option> <option value=\"3\">8:30</option> <option value=\"4\">9:00</option> <option value=\"5\">9:30</option> <option value=\"6\">10:00</option> <option value=\"7\">10:30</option> <option value=\"8\">11:00</option> <option value=\"9\">11:30</option> <option value=\"10\">12:00</option> <option value=\"11\">12:30</option> <option value=\"12\">13:00</option> <option value=\"13\">13:30</option> <option value=\"14\">14:00</option> <option value=\"15\">14:30</option> <option value=\"16\">15:00</option> <option value=\"17\">15:30</option> <option value=\"18\">16:00</option> <option value=\"19\">16:30</option> <option value=\"20\">17:00</option> <option value=\"21\">17:30</option> <option value=\"22\">18:00</option> <option value=\"23\">18:30</option> <option value=\"24\">19:00</option> <option value=\"25\">19:30</option> <option value=\"26\">20:00</option> <option value=\"27\">20:30</option> <option value=\"28\">21:00</option> <option value=\"29\">21:30</option> <option value=\"30\">22:00</option> <option value=\"31\">22:30</option> <option value=\"32\">23:00</option> <option value=\"33\">23:30</option> </select> Fin: <select id=\"cHFin0\"> <option value=\"0\">7:00</option> <option value=\"1\">7:30</option> <option value=\"2\">8:00</option> <option value=\"3\">8:30</option> <option value=\"4\">9:00</option> <option value=\"5\">9:30</option> <option value=\"6\">10:00</option> <option value=\"7\">10:30</option> <option value=\"8\">11:00</option> <option value=\"9\">11:30</option> <option value=\"10\">12:00</option> <option value=\"11\">12:30</option> <option value=\"12\">13:00</option> <option value=\"13\">13:30</option> <option value=\"14\">14:00</option> <option value=\"15\">14:30</option> <option value=\"16\">15:00</option> <option value=\"17\">15:30</option> <option value=\"18\">16:00</option> <option value=\"19\">16:30</option> <option value=\"20\">17:00</option> <option value=\"21\">17:30</option> <option value=\"22\">18:00</option> <option value=\"23\">18:30</option> <option value=\"24\">19:00</option> <option value=\"25\">19:30</option> <option value=\"26\">20:00</option> <option value=\"27\">20:30</option> <option value=\"28\">21:00</option> <option value=\"29\">21:30</option> <option value=\"30\">22:00</option> <option value=\"31\">22:30</option> <option value=\"32\">23:00</option> <option value=\"33\">23:30</option> </select> <input type=\"submit\" value=\"-\" onclick=\"cHBorrarBloque(0);\"></input> <br>";

	cHSize = 1;
}

function cHAgregarBloque() {
	if (cHSize == 13) {
		escribirMensaje("Llegaste al máximo de bloques posibles", 1);
		return;
	}
	var i = cHSize;

	var aDias = new Array();
	var aInicios = new Array();
	var aFines = new Array();

	for (var j = 0; j < cHSize; j++) {
		aDias.push(document.getElementById("cHDia" + j).value);
		aInicios.push(document.getElementById("cHInicio" + j).value);
		aFines.push(document.getElementById("cHFin" + j).value);
	}

	document.getElementById('cHClasesDiv').innerHTML += "<cHText>Día:</cHText> <select id=\"cHDia" + i + "\">  <option value=\"0\">Lunes</option>  <option value=\"1\">Martes</option>  <option value=\"2\">Miércoles</option>  <option value=\"3\">Jueves</option>  <option value=\"4\">Viernes</option>  <option value=\"5\">Sábado</option>  <option value=\"6\">Lunes a Viernes</option> </select> <cHText>Inicio:</cHText> <select  id=\"cHInicio" + i + "\">  <option value=\"0\">7:00</option>  <option value=\"1\">7:30</option>  <option value=\"2\">8:00</option>  <option value=\"3\">8:30</option>  <option value=\"4\">9:00</option>  <option value=\"5\">9:30</option>  <option value=\"6\">10:00</option>  <option value=\"7\">10:30</option>  <option value=\"8\">11:00</option>  <option value=\"9\">11:30</option>  <option value=\"10\">12:00</option>  <option value=\"11\">12:30</option>  <option value=\"12\">13:00</option>  <option value=\"13\">13:30</option>  <option value=\"14\">14:00</option>  <option value=\"15\">14:30</option>  <option value=\"16\">15:00</option>  <option value=\"17\">15:30</option>  <option value=\"18\">16:00</option>  <option value=\"19\">16:30</option>  <option value=\"20\">17:00</option>  <option value=\"21\">17:30</option>  <option value=\"22\">18:00</option>  <option value=\"23\">18:30</option>  <option value=\"24\">19:00</option>  <option value=\"25\">19:30</option>  <option value=\"26\">20:00</option>  <option value=\"27\">20:30</option>  <option value=\"28\">21:00</option>  <option value=\"29\">21:30</option>  <option value=\"30\">22:00</option>  <option value=\"31\">22:30</option>  <option value=\"32\">23:00</option>  <option value=\"33\">23:30</option> </select> <cHText>Fin:</cHText> <select   id=\"cHFin" + i + "\">  <option value=\"0\">7:00</option>  <option value=\"1\">7:30</option>  <option value=\"2\">8:00</option>  <option value=\"3\">8:30</option>  <option value=\"4\">9:00</option>  <option value=\"5\">9:30</option>  <option value=\"6\">10:00</option>  <option value=\"7\">10:30</option>  <option value=\"8\">11:00</option>  <option value=\"9\">11:30</option>  <option value=\"10\">12:00</option>  <option value=\"11\">12:30</option>  <option value=\"12\">13:00</option>  <option value=\"13\">13:30</option>  <option value=\"14\">14:00</option>  <option value=\"15\">14:30</option>  <option value=\"16\">15:00</option>  <option value=\"17\">15:30</option>  <option value=\"18\">16:00</option>  <option value=\"19\">16:30</option>  <option value=\"20\">17:00</option>  <option value=\"21\">17:30</option>  <option value=\"22\">18:00</option>  <option value=\"23\">18:30</option>  <option value=\"24\">19:00</option>  <option value=\"25\">19:30</option>  <option value=\"26\">20:00</option>  <option value=\"27\">20:30</option>  <option value=\"28\">21:00</option>  <option value=\"29\">21:30</option>  <option value=\"30\">22:00</option>  <option value=\"31\">22:30</option>  <option value=\"32\">23:00</option>  <option value=\"33\">23:30</option> </select> <input type=\"submit\" value=\"-\" onclick=\"cHBorrarBloque(" + i + ");\"></input> <br>";


	for (var i = 0; i < cHSize; i++) {
		document.getElementById("cHDia" + i).selectedIndex = aDias[i];
		document.getElementById("cHInicio" + i).selectedIndex = aInicios[i];
		document.getElementById("cHFin" + i).selectedIndex = aFines[i];
	}

	cHSize++;
}

function cHBorrarBloque(i) {

	var aDias = new Array();
	var aInicios = new Array();
	var aFines = new Array();

	var a = 0;
	for (var j = 0; j < cHSize; j++) {
		if (j == i) continue;
		aDias.push(document.getElementById("cHDia" + j).value);
		aInicios.push(document.getElementById("cHInicio" + j).value);
		aFines.push(document.getElementById("cHFin" + j).value);
		a++;
	}
	cHSize = 0;
	cHCrearHorario();
	document.getElementById("cHDia0").selectedIndex = aDias[0];
	document.getElementById("cHInicio0").selectedIndex = aInicios[0];
	document.getElementById("cHFin0").selectedIndex = aFines[0];
	for (var i = 1; i < a; i++) {
		cHAgregarBloque();
	}
	for (var i = 1; i < a; i++) {
		document.getElementById("cHDia" + i).selectedIndex = aDias[i];
		document.getElementById("cHInicio" + i).selectedIndex = aInicios[i];
		document.getElementById("cHFin" + i).selectedIndex = aFines[i];
	}

}

function get_browser_info() {
	var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return { name: 'IE ', version: (tem[1] || '') };
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/)
		if (tem != null) { return { name: 'Opera', version: tem[1] }; }
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
	return {
		name: M[0],
		version: M[1]
	};
}

function cargarHorarios(cuatriDatos, cuatriDesc) {
	$.getJSON("Horarios_" + cuatriDatos + ".json", function (data) {
		// global
		globalDatosMaterias = data.materias;
		globalDatosCarreras = data.carreras;
		datosCargados = 1;
		// global

		escribirMensaje("Cargados horarios " + cuatriDatos, 0);
		document.getElementById('textCuatri').innerHTML = cuatriDesc;
		document.getElementById('but5_sub').style.visibility = 'hidden';
	});
}

function uniqueArray(ar) {
	var j = {};

	ar.forEach(function (v) {
		j[v + '::' + typeof v] = v;
	});

	return Object.keys(j).map(function (v) {
		return j[v];
	});
}

$(document).ready(function () {

	$("#menu").mouseleave(function () {
		$("#menu").stop();
		$("#menu").animate({ left: '-122px' });
	});

	$("#menu").mouseenter(function () {
		$("#menu").stop();
		$("#menu").animate({ left: '-10px' });
	});

	$("#lista").mouseleave(function () {
		$("#lista").stop();
		$("#lista").animate({ right: '-488px' });
	});

	$("#lista").mouseenter(function () {
		$("#box2").stop();
		$("#box2").animate({ right: '-488px' });
		$("#lista").stop();
		$("#lista").animate({ right: '0px' });
		document.getElementById('lista').style.zIndex = "4";
		document.getElementById('box2').style.zIndex = "3";

	});

	$("#box2").mouseleave(function () {
		$("#buscar").prop('disabled', true);
		$("#box2").stop();
		$("#box2").animate({ right: '-488px' });
	});

	$("#box2").mouseenter(function () {
		$("#buscar").prop('disabled', false);
		$("#lista").stop();
		$("#lista").animate({ right: '-488px' });
		$("#box2").stop();
		$("#box2").animate({ right: '0px' });
		document.getElementById('box2').style.zIndex = "4";
		document.getElementById('lista').style.zIndex = "3";
	});

	$("#resizeDiv").mousedown(function () {
		resizing = 1;
		document.getElementById('resizeDiv').style.background = "rgb(150,150,150)";
	});

	$(document).mouseup(function () {
		resizing = 0;
		document.getElementById('resizeDiv').style.background = "rgb(120,120,120)";
	});

	$(document).mousemove(function (event) {
		if (resizing == 1) {
			var newDim = (((event.pageX * 100) / windowWidth) - Number(document.getElementById('canvas').style.left.split("%")[0]));
			if (newDim < 50) {
				newDim = 50;
			}
			if (newDim > 85) {
				newDim = 85;
			}
			document.getElementById('backCalendar').style.width = newDim + "%";
			document.getElementById('canvas').style.width = newDim + "%";
			document.getElementById('topCanvas').style.width = newDim + "%";
			document.getElementById('resizeDiv').style.left = newDim + Number(document.getElementById('canvas').style.left.split("%")[0]) + "%";
		}
		var rect = document.getElementById('canvas').getBoundingClientRect();
		getCellFromPos((event.pageX - rect.left) * 100 / (rect.right - rect.left), (event.pageY - rect.top) * 100 / (rect.bottom - rect.top));
		clearTopCanvas();
		dibujarRectEnColRow(mouseColInCanvas, mouseRowInCanvas, "topCanvas", "selRect");
		getCellDescription();
	});

	$("#buscar-materia-content input[type=checkbox]").change(function () {
		buscarPrecargadas();
	});

	$("#but5").click(function () {
		if (document.getElementById('but5_sub').style.visibility == 'visible') {
			document.getElementById('but5_sub').style.visibility = 'hidden';
		} else {
			document.getElementById('but5_sub').style.visibility = 'visible';
		}
	});

	$("#but5_1").click(function () {
		cargarHorarios("1Q2015", "(1er Cuatrimestre 2015)");
	});

	$("#but5_2").click(function () {
		cargarHorarios("2Q2014", "(2do Cuatrimestre 2014)");
	});

	$("#but5_3").click(function () {
		cargarHorarios("2Q2015", "(2do Cuatrimestre 2015)");
	});

	$("#but5_4").click(function () {
		cargarHorarios("1Q2016", "(1er Cuatrimestre 2016)");
	});

	$("#but5_5").click(function () {
		cargarHorarios("2Q2016", "(2do Cuatrimestre 2016)");
	});

	$("#but5_6").click(function () {
		cargarHorarios("1Q2017", "(1er Cuatrimestre 2017)");
	}).click();
});

var resizing = 0;

var timerMsj;

var tBusqueda;

var aMaterias = new Array();

var aCombinaciones = new Array();

var aDescCelda = new Array();

for (var i = 0; i < 204; i++) {
	aDescCelda[i] = "";
}

var indexCombinacion = 0;

var cHSize = 0;

var globalDatosMaterias;

var globalDatosCarreras;

var datosCargados = 0;

var mouseColInCanvas;

var mouseRowInCanvas;

var windowWidth = window.screen.availWidth;
