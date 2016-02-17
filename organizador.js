	function buscarPrecargadas(){
		if(datosCargados == 0){
			escribirMensaje("Primero tenes que agregar los horarios en el menú de opciones",1);
			return;
		}
	
		clearTimeout(tBusqueda);
		tBusqueda = setTimeout(timerBusqueda, 1000);	
	}

	function numDia(str){
		if(str.indexOf("Lunes")!=-1) return 0;
		if(str.indexOf("Martes")!=-1) return 1;
		if(str.indexOf("Miércoles")!=-1) return 2;
		if(str.indexOf("Jueves")!=-1) return 3;
		if(str.indexOf("Viernes")!=-1) return 4;
		if(str.indexOf("Sábado")!=-1) return 5;
		if(str.indexOf("lunes")!=-1) return 0;
		if(str.indexOf("martes")!=-1) return 1;
		if(str.indexOf("miércoles")!=-1) return 2;
		if(str.indexOf("jueves")!=-1) return 3;
		if(str.indexOf("viernes")!=-1) return 4;
		if(str.indexOf("sábado")!=-1) return 5;
		if(str.indexOf("miercoles")!=-1) return 2;
		if(str.indexOf("sabado")!=-1) return 5;		
		return -1;	
	}
	
	function numHora(str){
		var s = str.split(":");
		var x = (Number(s[0]) - 7)*2;
		if(s[1] == "30") x++;
		return x;	
	}

	function Materia(c, n, txt) {
		this.texto = txt;
		this.codigo = c;
		this.nombre = n;
		this.sel = 0;
		this.cursoSel = 0;
		this.expanded = 1;
		this.forzar = 0;
		this.cursos = new Array();
	}
	
	function Curso(d){
		this.docentes = d;
		this.clases = new Array();
	}
	
	function Clase(tex, ti, d, i, f, s, a){
		this.texto = tex;
		this.tipo = ti;
		this.dia = d;
		this.inicio = i;
		this.fin = f;
		this.sede = s;
		this.aula = a;	
	}
	
	function materiaFromFile(path){
		if(allCheckFalse()==1){
			escribirMensaje("Tenes que elegir alguna carrera",1);
			return;
		}
		var xhr;
		
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xhr.onreadystatechange = gotFile;
		xhr.open("GET",path);
		xhr.overrideMimeType('text/xml; charset=iso-8859-1');
		xhr.send();
		
		function gotFile(){
			if (xhr.readyState === 4) {
				var fileString = xhr.responseText.split("<");
				var materia = materiaFromText(fileString[0]);
				
				if(materia==-1){
					return;				
				}
				
				if(materia == 0){
					escribirMensaje("No hay cursos para las carreras elegidas",1);
					return;
				}else{
					indexCombinacion = 0;
					aCombinaciones.length = 0;
					escribirMensaje("Materia agregada",0);
					document.getElementById("combMinMat").value = aMaterias.length +1;
					document.getElementById("subIzquierda").style.visibility = "hidden";	
					document.getElementById("subDerecha").style.visibility = "hidden";
				}
		
				aMaterias.push(materia);
		
				llenarLista();
				
			}
		}
		
	}
	
	function materiaFromText(texto){
		return parsearMateria(texto,1);
	}
	
	function materiaFromId(id){
		if(allCheckFalse()==1){
			escribirMensaje("Tenes que elegir alguna carrera",1);
			return;
		}

		var materia = materiaFromText(aDatos[id][3]);
				
		if(materia==-1){
			return;				
		}
		if(materia == 0){
			escribirMensaje("No hay cursos para las carreras elegidas",1);
			return;
		}else{
			indexCombinacion = 0;
			aCombinaciones.length = 0;
			escribirMensaje("Materia agregada",0);
			document.getElementById("combMinMat").value = aMaterias.length +1;
			document.getElementById("subIzquierda").style.visibility = "hidden";	
			document.getElementById("subDerecha").style.visibility = "hidden";
		}
				
		aMaterias.push(materia);
		
		llenarLista();
	}
	
	function materiaFromTextSinValidar(texto){
		return parsearMateria(texto,0);
	}
	
	function parsearMateria(texto,val){
		var str = texto;
		str = str.replace(/\t/g," ");
		str = str.replace(/"  "/g," ");
		var pos;
		pos = str.indexOf("Materia:");
		pos = str.indexOf(" ",pos);
		
		var cod = str.slice(pos+1,pos+5);
		pos2 = str.indexOf("Vacantes",pos);
		var nom = str.slice(pos+6,pos2-1);
		if(Number(cod) < 5000 || Number(cod)>9999){
			escribirMensaje("Error al cargar materia: El código no es correcto",1);
			return -1;
		}
		if(nom.length < 5){
			escribirMensaje("Error al cargar materia: El nombre no es correcto",1);
			return -1;
		}
		
		if(val == 1){
			for(var i=0;i<aMaterias.length;i++){
				if(aMaterias[i].nombre == nom && aMaterias[i].codigo == cod){
					escribirMensaje("Error: Esa materia ya está cargada",1);
					return -1;
				}		
			}
		}
		
		var mat = new Materia(cod, nom, texto);
		
		var cursos = str.split("Materia: ");
		for(i=1;i<cursos.length;i++){
			str = cursos[i];
			
			pos = str.indexOf("Docente:");
			pos = str.indexOf(" ",pos);
			pos2 = str.indexOf("\n",pos+1);
			var doc = str.slice(pos+1,pos2);
			pos = str.indexOf("Carreras:",pos2);
			pos = str.indexOf(" ",pos);
			pos2 = str.indexOf("\n",pos+1);
			var carreras = str.slice(pos+1,pos2-1);
			if(val==1){
				if(validarCurso(carreras)==0) continue;
			}
			var cur = new Curso(doc);
			
			pos2 = str.indexOf("Curso: ",pos2-1);	
			pos2 = str.indexOf("\n",pos2+1);
			str = str.slice(pos2+1,str.length);
			
			while(str.indexOf("Aula:")!=-1) str = str.replace("Aula:","");
			while(str.indexOf("-")!=-1) str = str.replace("-"," ");
			while(str.indexOf("\r")!=-1) str = str.replace("\r","");
			while(str.indexOf("\n\n")!=-1) str = str.replace("\n\n","\n");
			var clases = str.split("\n");
			
			for(var k=0;k<clases.length;k++){
				if(clases[k].length < 3){
					clases.splice(k,1);
					k--;
				}
			}
			
			for(var j=0;j<clases.length;j++){
				str = clases[j];
				while(str.indexOf("  ")!=-1) str = str.replace("  "," ");
				var data = str.split(" ");
				var l = data.length;
				var tipo = "";
				for(var k=3;k<l-3;k++){
					tipo = tipo + " " + data[k];
				}
				var clase = new Clase(str,tipo,numDia(data[0]),numHora(data[1]),numHora(data[2]),data[l-3],data[l-2]);
				
				cur.clases.push(clase);
				
			}
			
			mat.cursos.push(cur);
			
		}
		if(mat.cursos.length == 0){
			return 0;	
		}else{
			return mat;
		}
	
	}
	
	/* function textoFromMat(index){
		var path = aMaterias[index].codigo + ".html";
		var xhr;
		
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhr.onreadystatechange = gotFile;
		xhr.open("GET",path);
		xhr.overrideMimeType('text/xml; charset=iso-8859-1');
		xhr.send();
	
		function gotFile(){
			if (xhr.readyState === 4) {
				var fileString = xhr.responseText.split("<");
				editarMateria(fileString[0],index);
			}
		}
	
	} */
	
	function checkedIfTrue(b){
		if(b==1){
			return "checked";
		}else{
			return "";
		}	
	}
		
	function llenarLista(){
		document.getElementById("listaInfo").innerHTML = "";
		var totalCursos = 0;
		for(var i=0;i<aMaterias.length;i++){
			document.getElementById("listaInfo").innerHTML += "<input type=\"checkbox\" style=\"background-color:rgb(12,102,144);\" id=\"check" + i + "\" " + checkedIfTrue(aMaterias[i].sel == 1) + " onclick=\"clicked(" + i + ",0,0);\"><che onclick=\"mClicked(" + i + ")\">" + aMaterias[i].codigo + " - " + aMaterias[i].nombre + "</che> - <a style=\"font-color:blue\" onclick=\"editarMateria(" + i + ");\">Editar</a> - <a style=\"font-color:blue\" onclick=\"clicked(" + i + ",0,1);\">Borrar</a><br>";
			if(aMaterias[i].expanded == 0) continue;
			for(var j=0;j<aMaterias[i].cursos.length;j++){
				totalCursos++;
				document.getElementById("listaInfo").innerHTML += "<input  " + checkedIfTrue(aMaterias[i].cursoSel == j+1) + " type=\"radio\" name=\"materia" + i + "\" id=\"rad" + i + (j+1) + "\" onclick=\"clicked(" + i + "," + (j+1) + ",0);\"><rad>" + aMaterias[i].cursos[j].docentes + "</rad><br>";
				
			}
		}	
		
/* 		if(totalCursos*20 + aMaterias.length*30 > 600){
			document.getElementById("lista").style.height = totalCursos*20 + aMaterias.length*30 + "px";
		}else{
			document.getElementById("lista").style.height = "600px";
		} */
	
	}
	
	function editarMateria(i){
		if(aMaterias[i].texto == "No editable"){
			escribirMensaje("Los horarios extracurriculares no se pueden editar",1);
			return;
		}else{
			editMateriaIndex = i;
			document.getElementById("editMatText").value = aMaterias[i].texto;
			document.getElementById('editMatTab').style.visibility = 'visible';
		}
	}
	
	function editMatAceptar(){
		var mat = materiaFromTextSinValidar(document.getElementById("editMatText").value);
		if(mat == -1 || mat == 0){
			escribirMensaje("Error al leer materia",1);
			return;
		}
		mat.nombre += "(editada)";
		mat.texto = document.getElementById("editMatText").value;
		aMaterias[editMateriaIndex] = mat;
		
		document.getElementById('editMatTab').style.visibility = 'hidden';
		escribirMensaje("Materia editada",0);
		
		llenarLista();
	}
	
	function primerDocente(str){
		doc = str.split(" - ");
		str = doc[0].concat(" - " + doc[1]);
		return str;
	
	}
	
	function mClicked(i){
		if(aMaterias[i].expanded==1){
			aMaterias[i].expanded = 0;
		}else{
			aMaterias[i].expanded = 1;
		}
		llenarLista();
	}

	function clicked(x,y,b){
		if(b==1){
			aMaterias.splice(x,1);
			llenarLista();
			dibujarCalendario();
			document.getElementById("combMinMat").value = aMaterias.length +1;
			document.getElementById("subIzquierda").style.visibility = "hidden";	
			document.getElementById("subDerecha").style.visibility = "hidden";
			return;		
		}
		if(y==0){
			if(aMaterias[x].sel==1){
				aMaterias[x].sel = 0;
				aMaterias[x].cursoSel = 0;		
			}else{
				aMaterias[x].sel = 1;
				aMaterias[x].expanded = 1;
			}
		}
		if(y!=0){
			aMaterias[x].sel = 1;
			aMaterias[x].cursoSel = y;		
		}
		llenarLista();
		dibujarCalendario();
	}
	
	function dibujarCalendario(){
		clearSVG();
		for(var i=0;i< aMaterias.length;i++){
			if(aMaterias[i].sel==1){
				if(aMaterias[i].cursoSel == 0) continue;
				var ind = (aMaterias[i].cursoSel) - 1 ;
				var c = aMaterias[i].cursos[ind].clases;
				for(var j=0;j< c.length;j++){
					var posX = 6.3 + (15.625 * c[j].dia);
					var posY = 6.20 + (2.76 * c[j].inicio);
					var altura = 2.76 * (c[j].fin - c[j].inicio);
					var textX = posX + 7.75;
					var textY = posY + 2.76;
					var svgNS = "http://www.w3.org/2000/svg"; 
					var rect = document.createElementNS(svgNS,"rect");
					rect.setAttributeNS(null,"id","rect" + j);
					rect.setAttributeNS(null,"x",posX + "%");
					rect.setAttributeNS(null,"y",posY + "%");
					rect.setAttributeNS(null,"width",15.625 + "%");
					rect.setAttributeNS(null,"height",altura + "%");
					rect.setAttributeNS(null,"fill","rgb(" + color(i) + ")");
					rect.setAttributeNS(null,"stroke","none");
					rect.setAttributeNS(null,"opacity",0.5);
					document.getElementById("canvas").appendChild(rect);
					var lines = aMaterias[i].nombre.split(" ");
					for(var k=0;k < lines.length-1;k++){
						if(lines[k].length + lines[k+1].length < 16){
							lines[k] = lines[k] + " " + lines[k+1];
							lines.splice(k+1,1);
							k--;							
						}
					}
					for(var k=0;k < lines.length;k++){
						var text = document.createElementNS(svgNS,"text");
						text.setAttributeNS(null,"text-anchor","middle");
						text.setAttributeNS(null,"x",textX + "%");
						text.setAttributeNS(null,"y",textY + 2.07 * k  + "%");
						text.setAttributeNS(null,"fill","black");
						text.setAttributeNS(null,"style","font-size:12px");
						text.textContent = lines[k] ;
						document.getElementById("canvas").appendChild(text);
					}
					var lines = c[j].texto.split(" ");
					//lines[0] = lines[0].concat(" - " + lines[1]);
					lines[0] = c[j].tipo;
					lines[1] = c[j].sede + " " + c[j].aula;
					for(var l=0;l < 2;l++){
						var text2 = document.createElementNS(svgNS,"text");
						text2.setAttributeNS(null,"text-anchor","middle");
						text2.setAttributeNS(null,"x",textX   + "%");
						text2.setAttributeNS(null,"y",textY + 2.07*l + 2.07*k + "%");
						text2.setAttributeNS(null,"fill","black");
						text2.setAttributeNS(null,"style","font-size:10px");
						text2.textContent = lines[l] ;
						document.getElementById("canvas").appendChild(text2);
					}
				}
			}
		}	
		
		var disponibilidad = new Array();
		
		for(var i=0;i<204;i++){
			disponibilidad[i] = 2;
			aDescCelda[i] = "";
		}
		
		for(i=0;i<aMaterias.length;i++){
			if(aMaterias[i].cursoSel == 0) continue;
			for(var j=0;j<aMaterias[i].cursos[aMaterias[i].cursoSel-1].clases.length;j++){
				var cInicio = aMaterias[i].cursos[aMaterias[i].cursoSel-1].clases[j].inicio + aMaterias[i].cursos[aMaterias[i].cursoSel-1].clases[j].dia * 34;
				var cFin = aMaterias[i].cursos[aMaterias[i].cursoSel-1].clases[j].fin + aMaterias[i].cursos[aMaterias[i].cursoSel-1].clases[j].dia * 34;
				for(k=cInicio;k<cFin;k++){
					disponibilidad[k]--;
					if(aDescCelda[k] == ""){
						aDescCelda[k] = shortNames(aMaterias[i].nombre) + ": " + aMaterias[i].cursos[aMaterias[i].cursoSel-1].docentes;
					}else{
						aDescCelda[k] = "Superposición: " + aDescCelda[k] + " y " + shortNames(aMaterias[i].nombre) + ": " + aMaterias[i].cursos[aMaterias[i].cursoSel-1].docentes;		
					}
				}
			}
		} 
		
		var ini = 0;
		var flag = 0;
		for(var i=0;i<204;i++){
			 if(i%34 == 0){
				if(flag == 1){
					dibujarSuperposEnColRow(ini,i,"canvas","supRect" + i);
					flag=0;
				}
			}
			if(disponibilidad[i] > 0){
				if(flag == 1){
					dibujarSuperposEnColRow(ini,i,"canvas","supRect" + i);
					flag = 0;
				}
			}else{
				if(flag == 0){
					ini = i;
					flag = 1;
				}

			}

		}
		
	}
	
	function getCellDescription(){
		if(mouseColInCanvas > -1 && mouseColInCanvas < 6 && mouseRowInCanvas > -1 && mouseRowInCanvas < 35){
			document.getElementById('descText').innerHTML = aDescCelda[mouseRowInCanvas + 34 * mouseColInCanvas];
		}
	}
	
	function getCellFromPos(perX,perY){
		var col = Math.floor((perX - 6.25)/15.625);
		var row = Math.floor((perY - 6.2)/2.76);
		mouseColInCanvas = col;
		mouseRowInCanvas = row;
		return "col: " + col + " , row: " + row;
	}
	
	function dibujarRectEnColRow(col,row,parent,id){
		 if(col > -1 && col < 6 && row > -1 && row < 35){
			var svgNS = "http://www.w3.org/2000/svg"; 
			var rect = document.createElementNS(svgNS,"rect");
			rect.setAttributeNS(null,"id",id);
			rect.setAttributeNS(null,"x",(col * 15.625 + 6.3) + "%");
			rect.setAttributeNS(null,"y",(row * 2.76 + 6.2) + "%");
			rect.setAttributeNS(null,"width",15.625 + "%");
			rect.setAttributeNS(null,"height",2.76 + "%");
			rect.setAttributeNS(null,"fill","rgb(134,220,215)");
			rect.setAttributeNS(null,"stroke","rgb(102,172,167)");
			rect.setAttributeNS(null,"stroke-width","2px");
			rect.setAttributeNS(null,"opacity",0.25);
			document.getElementById(parent).appendChild(rect);
		}
	}
	
	function dibujarSuperposEnColRow(inicio,fin,parent,id){
		var posX = (Math.floor(inicio/34) * 15.625 + 6.3);
		var posY = (inicio%34 * 2.76 + 6.2);
		var width = 15.625;
		var height = (fin-inicio) * 2.76;
		var svgNS = "http://www.w3.org/2000/svg"; 
		var rect = document.createElementNS(svgNS,"rect");
		rect.setAttributeNS(null,"id",id);
		rect.setAttributeNS(null,"x",posX + "%");
		rect.setAttributeNS(null,"y",posY + "%");
		rect.setAttributeNS(null,"width",width + "%");
		rect.setAttributeNS(null,"height",height + "%");
		rect.setAttributeNS(null,"fill","rgb(216,61,61)");
		rect.setAttributeNS(null,"stroke","rgb(186,31,31)");
		rect.setAttribute('stroke-width', "2px");
		rect.setAttributeNS(null,"opacity",0.85);
		document.getElementById(parent).appendChild(rect);
		var posX1 = posX + (width/6);
		var posX2 = posX;
		var posY1 = posY;
		var posY2 = posY + 2.76;
		for(var i=1;i<=(5+fin-inicio);i++){
			var aLine = document.createElementNS('http://www.w3.org/2000/svg', "line");
			aLine.setAttributeNS(null,"id","line" + i);
			aLine.setAttribute('x1', posX1 + "%");
			aLine.setAttribute('y1', posY1  + "%");
			aLine.setAttribute('x2', posX2  + "%");
			aLine.setAttribute('y2', posY2  + "%");
			aLine.setAttribute('stroke',"rgb(186,31,31)");
			aLine.setAttribute('stroke-width', "2px");
			document.getElementById(parent).appendChild(aLine);
			if(i<6) posX1 += (width/6);
			if(i>(fin-inicio-1)) posX2 += (width/6);
			if(i>=6) posY1 += 2.76;
			if(i<(fin-inicio)) posY2 += 2.76;		
		}
	}
	
	function shortNames(str){
		str = str.replace("LABORATORIO","LABO");
		str = str.replace("MICROPROCESADORES","MICROS");
		str = str.replace("MICROCONTROLADORES","MICROS");
		str = str.replace("ALGORITMOS Y PROGRAMACIÓN","ALGO");
		str = str.replace("ALGORITMOS Y PROGRAMACION","ALGO");
		str = str.replace("TERMODINÁMICA","TERMO");
		str = str.replace("TERMODINAMICA","TERMO");
		str = str.replace("ANALISIS MATEMATICO","AM");
		str = str.replace("ANALISIS NUMERICO","NUMERICO");
		str = str.replace("ANÁLISIS NUMÉRICO","NUMERICO");
		str = str.replace("SISTEMAS","SIS.");
		str = str.replace("PROBABILIDAD Y ESTADISTICA","PROBA Y EST.");
		str = str.replace("INTRODUCCION","INTR.");
		str = str.replace("INTRODUCCIÓN","INTR.");
		str = str.replace("INGENIERIA","ING.");
		str = str.replace("INGENIERÍA","ING.");
		return str;
	}
	
	function clearSVG(){
		var myNode = document.getElementById("canvas");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
	}
	
	function clearTopCanvas(){
		var myNode = document.getElementById("topCanvas");
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
	}
	
	function color(i){
		return colors[i%colors.length];
	}
	
	function validarCurso(str){
		var valido = 0;
		while(str.indexOf(" ")!=-1) str = str.replace(" ","");
		str = str.replace("\n","");
		var carreras = str.split(",");
		for(var i=0;i<carreras.length;i++){
			//alert("|" + carreras[i] + "|");
			switch(carreras[i]){
				case "Civil":
					if(document.getElementById("car1").checked == true) valido = 1;
				break;
				case "Industrial":
					if(document.getElementById("car2").checked == true) valido = 1;
				break;
				case "Naval":
					if(document.getElementById("car3").checked == true) valido = 1;
				break;
				case "Agrim":
					if(document.getElementById("car4").checked == true) valido = 1;
				break;
				case "Mecánica":
					if(document.getElementById("car5").checked == true) valido = 1;
				break;
				case "Electricista":
					if(document.getElementById("car6").checked == true) valido = 1;
				break;
				case "Electrónica":
					if(document.getElementById("car7").checked == true) valido = 1;
				break;
				case "Química":
					if(document.getElementById("car8").checked == true) valido = 1;
				break;
				case "Sistemas":
					if(document.getElementById("car9").checked == true) valido = 1;
				break;
				case "Informática":
					if(document.getElementById("car10").checked == true) valido = 1;
				break;
				case "Alimentos":
					if(document.getElementById("car11").checked == true) valido = 1;
				break;
				case "Ing.Agrim":
					if(document.getElementById("car12").checked == true) valido = 1;
				break;
				case "Todas":
					valido = 1;
				break;			
			}
		
		}		
		return valido;	
	}
	
	function escribirMensaje(str,alert){
		if(alert==1){
			document.getElementById("msg").innerHTML = "<msgAlert>*" + str + "</msgAlert>";
			document.getElementById("msgBox").style.visibility = "visible";	
		}else{
			document.getElementById("msg").innerHTML = "<msgText>*" + str + "</msgText>";
			document.getElementById("msgBox").style.visibility = "visible";	
		}
		clearTimeout(timerMsj);
		timerMsj=setTimeout(function () {timerMensaje()}, 10000);
		
	}
	
	function clickBuscar(){
		if(document.getElementById("buscar").value = "Ingresá la materia que queres buscar"){
			document.getElementById("buscar").value = "";			
		}	
	}
	
	function checkAll(){
		var i;
		var b = 0;
		for(i=1;i<13;i++){
			if(document.getElementById("car" + i).checked == false) b  = 1;
		}
		if(b == 1){
			document.getElementById("car1").checked = true;
			document.getElementById("car2").checked = true;
			document.getElementById("car3").checked = true;
			document.getElementById("car4").checked = true;
			document.getElementById("car5").checked = true;
			document.getElementById("car6").checked = true;
			document.getElementById("car7").checked = true;
			document.getElementById("car8").checked = true;
			document.getElementById("car9").checked = true;
			document.getElementById("car10").checked = true;
			document.getElementById("car11").checked = true;
			document.getElementById("car12").checked = true;
		}else{
			document.getElementById("car1").checked = false;
			document.getElementById("car2").checked = false;
			document.getElementById("car3").checked = false;
			document.getElementById("car4").checked = false;
			document.getElementById("car5").checked = false;
			document.getElementById("car6").checked = false;
			document.getElementById("car7").checked = false;
			document.getElementById("car8").checked = false;
			document.getElementById("car9").checked = false;
			document.getElementById("car10").checked = false;
			document.getElementById("car11").checked = false;
			document.getElementById("car12").checked = false;
		
		}
	
	}
	
	function allCheckFalse(){
		var b = 1;
		for(var i=1;i<13;i++){
			if(document.getElementById("car" + i).checked == true) b  = 0;
		}
		return b;
	}
	
	function descargarHorarios(){
		var str = "";
		
		//str += "<svg width=\"800\" height=\"600\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";
		
		str += "<svg class=\"ui-widget-content\" id=\"backCalendar\" viewBox=\"0 0 1000 580\" preserveAspectRatio=\"none\" width=\"80%\" height=\"90%\" style=\"position: absolute; left:10%; top:10px;background-color:rgb(245,245,245);background-image:url('logo.png');border-style:solid;border-color:rgb(9,153,201);border-width:1px;background-repeat: no-repeat;background-position: center;border-radius: 25px 0px 0px 0px;z-index:-3;\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" >";
		
		str += document.getElementById("backCalendar").innerHTML;
		
		str += document.getElementById("canvas").innerHTML;
		
		str += "</svg>";
		
		
		if(get_browser_info().name == "IE"){
			escribirMensaje("Esta opción no es soportada en IE",1);
			return;
		}
		
		var a = window.document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([str], {type: 'svg'}));
		a.download = 'horarios.svg';

		
		document.body.appendChild(a)
		a.click();
		document.body.removeChild(a)
	
	}
	
	function calcularCombinaciones(){
			aCombinaciones.length = 0;
			indexCombinacion = 0;
			var nCombinaciones = 1;
			var horariosPosibles = 0;
			
			if(aMaterias.length == 0){
				escribirMensaje("Primero tenes que elegir alguna materia",1);
				return;
			}
			if(document.getElementById("combMinMat").value==""){
				escribirMensaje("Error en mínimo de materias a combinar",1);
				return;
			}
			
			for(var  i=0;i<aMaterias.length;i++){
				nCombinaciones *= (aMaterias[i].cursos.length + 1);
			}
			

			for(var i=0;i<nCombinaciones;i++){
				if(haySuperposicion(i) == 0){
					horariosPosibles ++;				
					aCombinaciones.push(i);
				}
			}
			
			if(horariosPosibles == 1){
				escribirMensaje("Hay " + horariosPosibles + " combinación posible",0);
			}else{
				escribirMensaje("Hay " + horariosPosibles + " combinaciones posibles",0);
			}
			
			if(horariosPosibles == 0){
				document.getElementById("subIzquierda").style.visibility = "hidden";	
				document.getElementById("subDerecha").style.visibility = "hidden";	
			}else{
				document.getElementById("subIzquierda").style.visibility = "visible";	
				document.getElementById("subDerecha").style.visibility = "visible";	
			}
			
	}
	
	function haySuperposicion(nComb){
		var superposicion = 0;
		var disponibilidad = new Array();
		var cursos = new Array();
		var minimoMaterias = Number(document.getElementById("combMinMat").value);
		for(var i=0;i<204;i++){
			disponibilidad[i] = 2;
		}
		
		for(var i=0;i<aMaterias.length;i++){
			cursos[i] = nComb;
			for(var j=0;j<i;j++){
				cursos[i] = Math.floor(cursos[i]/(aMaterias[j].cursos.length+1));			
			}
			cursos[i] = cursos[i] % (aMaterias[i].cursos.length+1);
			if(aMaterias[i].forzar == 1 && cursos[i] == 0)	return 1;
			if(cursos[i]!=0 && aMaterias[i].codigo != "EXTC") minimoMaterias--;
		}
		
		if(minimoMaterias > 0) return 1;
		
		for(var i=0;i<aMaterias.length;i++){
			if(cursos[i] == 0) continue;
			cursos[i]--;
			for(var j=0;j<aMaterias[i].cursos[cursos[i]].clases.length;j++){
				var cInicio = aMaterias[i].cursos[cursos[i]].clases[j].inicio + aMaterias[i].cursos[cursos[i]].clases[j].dia * 34;
				var cFin = aMaterias[i].cursos[cursos[i]].clases[j].fin + aMaterias[i].cursos[cursos[i]].clases[j].dia * 34;
				//alert(cInicio + " => " + cFin);
				for(k=cInicio;k<cFin;k++){
					disponibilidad[k]--;
					if(disponibilidad[k] == 0){
						superposicion = 1;
						break;
					}
				}
			}
		}
		
		return superposicion;
	}
	
	function siguienteComb(way){
		if(aCombinaciones.length == 0) return;
		if(way == 0){
			indexCombinacion--;
			if(indexCombinacion<1){
				indexCombinacion = aCombinaciones.length;
			}
			
		
		}else{
			indexCombinacion++;
			if(indexCombinacion>aCombinaciones.length){
				indexCombinacion = 1;
			}		
		}
		escribirMensaje("Combinación " + indexCombinacion + "/" + aCombinaciones.length,0);
		
		var cursos = new Array();
		
		for(var i=0;i<aMaterias.length;i++){
			cursos[i] = aCombinaciones[indexCombinacion-1];
			for(var j=0;j<i;j++){
				cursos[i] = Math.floor(cursos[i]/(aMaterias[j].cursos.length+1));			
			}
			cursos[i] = cursos[i] % (aMaterias[i].cursos.length+1);
			
			aMaterias[i].sel = 1;
			if(cursos[i]==0) aMaterias[i].sel = 0;
			aMaterias[i].cursoSel = cursos[i];			
		}
		dibujarCalendario();
		llenarLista();
		
	}
	
	function timerMensaje() {
			document.getElementById('msgBox').style.visibility = 'hidden';
			clearTimeout(timerMsj);
	}
	
	function timerBusqueda(){
	
 		str = document.getElementById("buscar").value;
		str = str.toUpperCase();
		
		var encontradas = 0;
		
		var html = "";
		
		for(var i = 0;i<aDatos.length;i++){
			if(aDatos[i][1].indexOf(str) != -1 || aDatos[i][2].indexOf(str) != -1){
				html += "<a onclick=\"materiaFromId('" + i + "');\" >" + aDatos[i][2] + " - " + aDatos[i][1] + "</a><br>";
 				encontradas++;
				if(encontradas > 22) break;
			}
		}
		
		document.getElementById("buscadas").innerHTML = html;
		
	}
	
	function cHCrearHorario(){
		document.getElementById('cHTab').style.visibility = 'visible';
		
		if(cHSize != 0) return;
		document.getElementById('cHClasesDiv').innerHTML = "<cHText>Día:</cHText> <select id=\"cHDia0\">  <option value=\"0\">Lunes</option>  <option value=\"1\">Martes</option>  <option value=\"2\">Miércoles</option>  <option value=\"3\">Jueves</option>  <option value=\"4\">Viernes</option>  <option value=\"5\">Sábado</option>  <option value=\"6\">Lunes a Viernes</option> </select> <cHText>Inicio:</cHText> <select  id=\"cHInicio0\">  <option value=\"0\">7:00</option>  <option value=\"1\">7:30</option>  <option value=\"2\">8:00</option>  <option value=\"3\">8:30</option>  <option value=\"4\">9:00</option>  <option value=\"5\">9:30</option>  <option value=\"6\">10:00</option>  <option value=\"7\">10:30</option>  <option value=\"8\">11:00</option>  <option value=\"9\">11:30</option>  <option value=\"10\">12:00</option>  <option value=\"11\">12:30</option>  <option value=\"12\">13:00</option>  <option value=\"13\">13:30</option>  <option value=\"14\">14:00</option>  <option value=\"15\">14:30</option>  <option value=\"16\">15:00</option>  <option value=\"17\">15:30</option>  <option value=\"18\">16:00</option>  <option value=\"19\">16:30</option>  <option value=\"20\">17:00</option>  <option value=\"21\">17:30</option>  <option value=\"22\">18:00</option>  <option value=\"23\">18:30</option>  <option value=\"24\">19:00</option>  <option value=\"25\">19:30</option>  <option value=\"26\">20:00</option>  <option value=\"27\">20:30</option>  <option value=\"28\">21:00</option>  <option value=\"29\">21:30</option>  <option value=\"30\">22:00</option>  <option value=\"31\">22:30</option>  <option value=\"32\">23:00</option>  <option value=\"33\">23:30</option> </select> <cHText>Fin:</cHText> <select   id=\"cHFin0\">  <option value=\"0\">7:00</option>  <option value=\"1\">7:30</option>  <option value=\"2\">8:00</option>  <option value=\"3\">8:30</option>  <option value=\"4\">9:00</option>  <option value=\"5\">9:30</option>  <option value=\"6\">10:00</option>  <option value=\"7\">10:30</option>  <option value=\"8\">11:00</option>  <option value=\"9\">11:30</option>  <option value=\"10\">12:00</option>  <option value=\"11\">12:30</option>  <option value=\"12\">13:00</option>  <option value=\"13\">13:30</option>  <option value=\"14\">14:00</option>  <option value=\"15\">14:30</option>  <option value=\"16\">15:00</option>  <option value=\"17\">15:30</option>  <option value=\"18\">16:00</option>  <option value=\"19\">16:30</option>  <option value=\"20\">17:00</option>  <option value=\"21\">17:30</option>  <option value=\"22\">18:00</option>  <option value=\"23\">18:30</option>  <option value=\"24\">19:00</option>  <option value=\"25\">19:30</option>  <option value=\"26\">20:00</option>  <option value=\"27\">20:30</option>  <option value=\"28\">21:00</option>  <option value=\"29\">21:30</option>  <option value=\"30\">22:00</option>  <option value=\"31\">22:30</option>  <option value=\"32\">23:00</option>  <option value=\"33\">23:30</option> </select> <input type=\"submit\" value=\"-\" onclick=\"cHBorrarBloque(0);\"></input> <br>";
		
		cHSize = 1;
	}
	
	function cHAgregarBloque(){
		if(cHSize == 13){
			escribirMensaje("Llegaste al máximo de bloques posibles",1);
			return;
		}
		var i = cHSize;
	
		var aDias = new Array();
		var aInicios = new Array();
		var aFines = new Array();
				
		for(var j=0;j<cHSize;j++){
			aDias.push(document.getElementById("cHDia" + j).value);
			aInicios.push(document.getElementById("cHInicio" + j).value);
			aFines.push(document.getElementById("cHFin" + j).value);
		}
	
		document.getElementById('cHClasesDiv').innerHTML += "<cHText>Día:</cHText> <select id=\"cHDia" + i + "\">  <option value=\"0\">Lunes</option>  <option value=\"1\">Martes</option>  <option value=\"2\">Miércoles</option>  <option value=\"3\">Jueves</option>  <option value=\"4\">Viernes</option>  <option value=\"5\">Sábado</option>  <option value=\"6\">Lunes a Viernes</option> </select> <cHText>Inicio:</cHText> <select  id=\"cHInicio" + i + "\">  <option value=\"0\">7:00</option>  <option value=\"1\">7:30</option>  <option value=\"2\">8:00</option>  <option value=\"3\">8:30</option>  <option value=\"4\">9:00</option>  <option value=\"5\">9:30</option>  <option value=\"6\">10:00</option>  <option value=\"7\">10:30</option>  <option value=\"8\">11:00</option>  <option value=\"9\">11:30</option>  <option value=\"10\">12:00</option>  <option value=\"11\">12:30</option>  <option value=\"12\">13:00</option>  <option value=\"13\">13:30</option>  <option value=\"14\">14:00</option>  <option value=\"15\">14:30</option>  <option value=\"16\">15:00</option>  <option value=\"17\">15:30</option>  <option value=\"18\">16:00</option>  <option value=\"19\">16:30</option>  <option value=\"20\">17:00</option>  <option value=\"21\">17:30</option>  <option value=\"22\">18:00</option>  <option value=\"23\">18:30</option>  <option value=\"24\">19:00</option>  <option value=\"25\">19:30</option>  <option value=\"26\">20:00</option>  <option value=\"27\">20:30</option>  <option value=\"28\">21:00</option>  <option value=\"29\">21:30</option>  <option value=\"30\">22:00</option>  <option value=\"31\">22:30</option>  <option value=\"32\">23:00</option>  <option value=\"33\">23:30</option> </select> <cHText>Fin:</cHText> <select   id=\"cHFin" + i + "\">  <option value=\"0\">7:00</option>  <option value=\"1\">7:30</option>  <option value=\"2\">8:00</option>  <option value=\"3\">8:30</option>  <option value=\"4\">9:00</option>  <option value=\"5\">9:30</option>  <option value=\"6\">10:00</option>  <option value=\"7\">10:30</option>  <option value=\"8\">11:00</option>  <option value=\"9\">11:30</option>  <option value=\"10\">12:00</option>  <option value=\"11\">12:30</option>  <option value=\"12\">13:00</option>  <option value=\"13\">13:30</option>  <option value=\"14\">14:00</option>  <option value=\"15\">14:30</option>  <option value=\"16\">15:00</option>  <option value=\"17\">15:30</option>  <option value=\"18\">16:00</option>  <option value=\"19\">16:30</option>  <option value=\"20\">17:00</option>  <option value=\"21\">17:30</option>  <option value=\"22\">18:00</option>  <option value=\"23\">18:30</option>  <option value=\"24\">19:00</option>  <option value=\"25\">19:30</option>  <option value=\"26\">20:00</option>  <option value=\"27\">20:30</option>  <option value=\"28\">21:00</option>  <option value=\"29\">21:30</option>  <option value=\"30\">22:00</option>  <option value=\"31\">22:30</option>  <option value=\"32\">23:00</option>  <option value=\"33\">23:30</option> </select> <input type=\"submit\" value=\"-\" onclick=\"cHBorrarBloque(" + i + ");\"></input> <br>";
		
		
		for(var i=0;i<cHSize;i++){
			document.getElementById("cHDia" + i).selectedIndex = aDias[i];
			document.getElementById("cHInicio" + i).selectedIndex = aInicios[i];
			document.getElementById("cHFin" + i).selectedIndex = aFines[i];		
		}
		
		cHSize++;
	}
	
	function cHBorrarBloque(i){
		
		var aDias = new Array();
		var aInicios = new Array();
		var aFines = new Array();
		
		var a=0;
		for(var j=0;j<cHSize;j++){
			if(j==i) continue;
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
		for(var i=1;i<a;i++){
			cHAgregarBloque();	
		}
		for(var i=1;i<a;i++){
			document.getElementById("cHDia" + i).selectedIndex = aDias[i];
			document.getElementById("cHInicio" + i).selectedIndex = aInicios[i];
			document.getElementById("cHFin" + i).selectedIndex = aFines[i];		
		}

	}
	
	function cHAceptar(){
		if(document.getElementById("cHDesc").value == ""){
			escribirMensaje("Tenes que agregar una descripción",1);
			return;
		}
		
		for(var i=0;i<cHSize;i++){
			if(Number(document.getElementById("cHFin" + i).value) <= Number(document.getElementById("cHInicio" + i).value)){
				escribirMensaje("Error en el bloque " + (i+1),1);
				return;
			}		
		}
		
		var mat = new Materia("EXTC",document.getElementById("cHDesc").value,"No editable");
		mat.forzar = 1;
		var cur = new Curso(document.getElementById("cHDesc").value);
		
		
		
		var inicio;
		var fin;
		var dia;
		
		for(i=0;i<cHSize;i++){
			if(document.getElementById("cHDia" + i).value == "6"){
				inicio = Number(document.getElementById("cHInicio" + i).value);
				fin = Number(document.getElementById("cHFin" + i).value);
				for(var j=0;j<5;j++){
					var clase = new Clase("","Extracurricular",j,inicio,fin,"","");
					cur.clases.push(clase);
				}
				continue;
			}
			dia = Number(document.getElementById("cHDia" + i).value);
			inicio = Number(document.getElementById("cHInicio" + i).value);
			fin = Number(document.getElementById("cHFin" + i).value);
			var clase = new Clase("","Extracurricular",dia,inicio,fin,"","");
			cur.clases.push(clase);
		}
		
		
		mat.cursos.push(cur);
		
		aMaterias.push(mat);
		
		llenarLista();
		
		
		escribirMensaje("Horario agregado",0);
		
		document.getElementById('cHTab').style.visibility = 'hidden';
	}
	
	function guardarEstado(){
		var str = "";
		var mat;
		var cod;
		var cursos;
		var doc;
		var horarios;
		var p1;
		var p2;


		

		for(var i=0;i<aDatos.length;i++){
			
			mat = aDatos[i][1];
			cod = aDatos[i][2];
			

			while(aDatos[i][3].indexOf("  ")!=-1) aDatos[i][3] = aDatos[i][3].replace("  "," ");
			while(aDatos[i][3].indexOf("\n\n")!=-1) aDatos[i][3] = aDatos[i][3].replace("\n\n","\n");

			cursos = aDatos[i][3].split("Materia: ");

			for(var j=1;j<cursos.length;j++){
				p1 = cursos[j].indexOf("Docente: ");
				p2 = cursos[j].indexOf("Carreras: ");
				doc = cursos[j].substr(p1+9,p2-p1-11);
				p1 = cursos[j].indexOf("Curso: ");
				p2 = cursos[j].indexOf("\n",p1);
				horarios = cursos[j].substr(p2+1);
				str = str + "\"" + cod + "\";" + "\"" + mat + "\";" + "\"" + doc + "\";" + "\"" + horarios + "\";" + "\n";
			}
		}

		var a = window.document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([str], {type: 'text'}));
		a.download = 'organizadorFiuba.txt';

		
		document.body.appendChild(a)
		a.click();		
		document.body.removeChild(a)
	}
	
	function cargarEstado(str){
		var data = str.split("<separador>");
		var txt;
		aMaterias.length = 0;
		for(var i=0;i<data.length-1;i++){
			if(data[i].indexOf("EXTC") == 0){
				txt = data[i].split("\n");
				var linea = txt[0].split(",");
				var mat = new Materia(linea[0],linea[1],"No editable");
				
				var cur = new Curso(linea[1]);
				
				for(var j=1;j<txt.length-1;j++){
					linea = txt[j].split(",");
					var clase = new Clase("","Extracurricular",Number(linea[0]),Number(linea[1]),Number(linea[2]),"","");
					cur.clases.push(clase);
				}
				
				mat.cursos.push(cur);
				
				aMaterias.push(mat);
				
			}else{
				aMaterias.push(materiaFromTextSinValidar(data[i]));
			}
		}
		
		txt = data[data.length-1].split("\n");
		for(i=0;i<txt.length-1;i++){
			linea = txt[i].split(",");
			aMaterias[i].sel = linea[0];
			aMaterias[i].cursoSel = linea[1];
		}
		
		llenarLista();
		dibujarCalendario();
	}
	
	var openFile = function(event) {
			var input = event.target;

			var reader = new FileReader();
			reader.onload = function(){
				var text = reader.result;
				cargarEstado(text);
				document.getElementById('fileinp').value = null;
			};
			reader.readAsText(input.files[0] , "charset=iso-8859-1");
	 };
	 
	 var openFileDatos = function(event) {
			var input = event.target;

			var reader = new FileReader();
			reader.onload = function(){
				
				stringDatos = reader.result;
				
				stringDatos =  stringDatos.split("\"\n");
				
				aDatos = new Array(stringDatos.length-1);
				var linea;
				
				linea = stringDatos[1].split(';');
				cuatriDatos = linea[1];
				while(cuatriDatos.indexOf('"')!=-1) cuatriDatos = cuatriDatos.replace('"','');
				
				
				
				if(cuatriDatos == "1Q2015")
					document.getElementById('textCuatri').innerHTML = "(1er Cuatrimestre 2015)";
					
				if(cuatriDatos == "2Q2014")
					document.getElementById('textCuatri').innerHTML = "(2do Cuatrimestre 2014)";
					
				if(cuatriDatos == "2Q2015")
					document.getElementById('textCuatri').innerHTML = "(2do Cuatrimestre 2015)";
					
				if(cuatriDatos == "1Q2016")
					document.getElementById('textCuatri').innerHTML = "(1er Cuatrimestre 2016)";
					
				var i;
				
				for(var j=1;j<stringDatos.length;j++){
					i = j-1;
					while(stringDatos[i].indexOf('"')!=-1) stringDatos[i] = stringDatos[i].replace('"','');
					aDatos[i] = new Array(4);
										
					linea = stringDatos[i].split(';');
					
					aDatos[i][0] = linea[0];
					aDatos[i][1] = linea[2];
					aDatos[i][2] = linea[3];
					aDatos[i][3] = linea[4];
					
					datosCargados = 1;
					
					escribirMensaje("Datos " + cuatriDatos + " cargados",0);
					
	
				}
				
			};
			reader.readAsText(input.files[0] , "charset=iso-8859-1");
	 };
	
	function get_browser_info(){
		var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
		if(/trident/i.test(M[1])){
			tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
			return {name:'IE ',version:(tem[1]||'')};
        }   
		if(M[1]==='Chrome'){
			tem=ua.match(/\bOPR\/(\d+)/)
			if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
		M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
			return {
				name: M[0],
				version: M[1]
			};
	}
	
 	$(document).ready(function() {

      $("#menu").mouseleave(function(){
		$("#menu").stop();
        $("#menu").animate({left: '-122px'});
      });

      $("#menu").mouseenter(function(){
		 $("#menu").stop();
         $("#menu").animate({left: '-10px'});
      });
	  
	   $("#lista").mouseleave(function(){
		$("#lista").stop();
        $("#lista").animate({right: '-488px'});
      });

      $("#lista").mouseenter(function(){
		 $("#box2").stop();
		 $("#box2").animate({right: '-488px'});
		 $("#lista").stop();
         $("#lista").animate({right: '0px'});
		 document.getElementById('lista').style.zIndex = "4";
		 document.getElementById('box2').style.zIndex = "3";
		 
      });
	  
	  $("#box2").mouseleave(function(){
		$("#buscar").prop('disabled', true);
		$("#box2").stop();
        $("#box2").animate({right: '-488px'});
      });

      $("#box2").mouseenter(function(){
		 $("#buscar").prop('disabled', false);
		 $("#lista").stop();
		 $("#lista").animate({right: '-488px'});
		 $("#box2").stop();
         $("#box2").animate({right: '0px'});
		 document.getElementById('box2').style.zIndex = "4";
		 document.getElementById('lista').style.zIndex = "3";
      });
	  
	  $("#resizeDiv").mousedown(function(){
			resizing = 1;
			document.getElementById('resizeDiv').style.background = "rgb(150,150,150)";
	  });
	  
		$( document).mouseup(function() {
			resizing = 0;
			document.getElementById('resizeDiv').style.background = "rgb(120,120,120)";
		});
		
		$(document).mousemove(function(event){
			if(resizing == 1){
				var newDim = (((event.pageX * 100)/windowWidth) - Number(document.getElementById('canvas').style.left.split("%")[0]));
				if(newDim < 50){
					newDim = 50;
				}
				if(newDim > 85){
					newDim = 85;
				}
				document.getElementById('backCalendar').style.width = newDim + "%";
				document.getElementById('canvas').style.width = newDim + "%";
				document.getElementById('topCanvas').style.width = newDim + "%";
				document.getElementById('resizeDiv').style.left = newDim + Number(document.getElementById('canvas').style.left.split("%")[0]) +  "%";
			}
			var rect = document.getElementById('canvas').getBoundingClientRect();
			getCellFromPos((event.pageX - rect.left)*100/(rect.right - rect.left),(event.pageY - rect.top)*100/(rect.bottom - rect.top));
			clearTopCanvas();
			dibujarRectEnColRow(mouseColInCanvas,mouseRowInCanvas,"topCanvas","selRect");
			getCellDescription();			
		});
		
	  $("#but5").click(function(){
			if(document.getElementById('but5_sub').style.visibility == 'visible'){
				document.getElementById('but5_sub').style.visibility = 'hidden';
			}else{
				document.getElementById('but5_sub').style.visibility = 'visible';
			}
	  });
	  
	  $("#but5_1").click(function(){
			escribirMensaje("Cargados horarios 1er Cuatrimestre 2015",0);
			cuatriDatos = "1Q2015";
			document.getElementById('textCuatri').innerHTML = "(1er Cuatrimestre 2015)";
			document.getElementById('but5_sub').style.visibility = 'hidden';
	  });
	  
	  $("#but5_2").click(function(){
			escribirMensaje("Cargados horarios 2do Cuatrimestre 2014",0);
			cuatriDatos = "2Q2014";
			document.getElementById('textCuatri').innerHTML = "(2do Cuatrimestre 2014)";
			document.getElementById('but5_sub').style.visibility = 'hidden';
	  });
	  
      var xhr = new XMLHttpRequest();
        xhr.open('GET', "Horarios_1Q2016.csv", true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
            if (this.status == 200) {
                openFileDatos({target: {files: [this.response]}});
            }
        };
        xhr.send();

   }); 
   
    var resizing = 0;
  
	var expandible = 1;
	
	var timerMsj;
	
	var tBusqueda;
	
	var aMaterias = new Array();
	
	var aCombinaciones = new Array();
	
	var aDescCelda = new Array();
	
	for(var i=0;i<204;i++){
		aDescCelda[i] = "";
	}
	
	var indexCombinacion = 0;
	
	var cHSize = 0;
	
	var editMateriaIndex = 0;
	
	var colors = ["255,0,0", "0,255,0", "0,0,255" , "235,232,79" , "85,221,223", "231,119,21", "186,6,189" , "132,204,9" , "106,74,11"];
	
	var cuatriActual = "1Q2016";
	
	var cuatriDatos = cuatriActual;
	
	var stringDatos;
	
	var aDatos;
	
	var datosCargados = 0;
	
	var mouseColInCanvas;
	
	var mouseRowInCanvas;
	
	var selector;
	
	var windowWidth = window.screen.availWidth;
	var windowHeight = window.screen.availHeight;
