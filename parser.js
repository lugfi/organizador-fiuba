const fs = require('fs');
const path = require('path');

function parse(dir) {
	fs.readdir(dir, function (err, filenames) {
		filenames.forEach(function (fileDatos) {
			fs.readFile(path.resolve(dir, fileDatos), 'utf-8', function (err, result) {
				let stringDatos = result.split("\"\n");
				let aDatos = new Array(stringDatos.length - 1);
				let cuatriDatos = stringDatos[1].split(';')[1];
				while (cuatriDatos.indexOf('"') != -1) {
					cuatriDatos = cuatriDatos.replace('"', '');
				}

				for (let j = 1; j < stringDatos.length; j++) {
					let i = j - 1;
					while (stringDatos[i].indexOf('"') != -1) {
						stringDatos[i] = stringDatos[i].replace('"', '');
					}

					let linea = stringDatos[i].split(';');
					aDatos[i] = new Array(4);
					aDatos[i][0] = linea[0];
					aDatos[i][1] = linea[2].trim();
					aDatos[i][2] = linea[3];
					aDatos[i][3] = parseMateria(linea[4]);
				}
				fs.writeFile(fileDatos.slice(0, -4) + ".json", JSON.stringify(aDatos, null, 4));
			});
		});
	});
}

function parseMateria(texto) {
	var str = texto.replace(/\t/g, " ").replace(/"  "/g, " ");
	var pos = str.indexOf(" ", str.indexOf("Materia:"));
	var cod = str.slice(pos + 1, pos + 5);
	var pos2 = str.indexOf("Vacantes", pos);
	var nom = str.slice(pos + 6, pos2 - 1);

	if (Number(cod) < 5000 || Number(cod) > 9999) {
		console.error("Error al cargar materia: El código no es correcto", 1);
		process.exit(1);
	}
	else if (nom.length < 5) {
		console.error("Error al cargar materia: El nombre no es correcto", 1);
		process.exit(1);
	}

	// for (var i = 0; i < aMaterias.length; i++) {
	// 	if (aMaterias[i].nombre == nom && aMaterias[i].codigo == cod) {
	// 		console.error("Error: Esa materia ya está cargada", 1);
	// 		process.exit(1);
	// 	}
	// }

	var mat = {
		codigo: cod,
		nombre: nom.trim(),
		cursos: [],
		// necesario para el frontend
		sel: 0,
		cursoSel: 0,
		expanded: 1,
		forzar: 0,
		cursoForzado: [],
		color: newColor()
	};

	var cursos = str.split("Materia: ");
	for (i = 1; i < cursos.length; i++) {
		str = cursos[i];

		pos = str.indexOf("Docente:");
		pos = str.indexOf(" ", pos);
		pos2 = str.indexOf("\n", pos + 1);
		var doc = str.slice(pos + 1, pos2);
		pos = str.indexOf("Carreras:", pos2);
		pos = str.indexOf(" ", pos);
		pos2 = str.indexOf("\n", pos + 1);
		var carreras = str.slice(pos + 1, pos2 - 1);
		var cur = {
			carreras: parseCarreras(carreras),
			docentes: doc.trim(),
			clases: []
		};

		pos2 = str.indexOf("Curso: ", pos2 - 1);
		pos2 = str.indexOf("\n", pos2 + 1);
		str = str.slice(pos2 + 1, str.length);

		while (str.indexOf("Aula:") != -1) str = str.replace("Aula:", "");
		while (str.indexOf("-") != -1) str = str.replace("-", " ");
		while (str.indexOf("\r") != -1) str = str.replace("\r", "");
		while (str.indexOf("\n\n") != -1) str = str.replace("\n\n", "\n");
		var clases = str.split("\n");

		for (var k = 0; k < clases.length; k++) {
			if (clases[k].length < 3) {
				clases.splice(k, 1);
				k--;
			}
		}

		for (var j = 0; j < clases.length; j++) {
			str = clases[j];
			while (str.indexOf("  ") != -1) str = str.replace("  ", " ");
			var data = str.split(" ");
			var l = data.length;
			var tipo = "";
			for (var k = 3; k < l - 3; k++) {
				tipo = tipo + " " + data[k];
			}
			cur.clases.push({
				tipo: tipo.trim(),
				dia: numDia(data[0]),
				inicio: numHora(data[1]),
				fin: numHora(data[2]),
				sede: data[l - 3],
				aula: data[l - 2]
			});
		}
		mat.cursos.push(cur);
	}

	return mat;
}

function parseCarreras(texto) {
	const carreras = texto.split(", ");
	if (carreras.length === 1 && carreras[0] === "Todas") {
		return CarrerasFlags.TODAS;
	}

	if (carreras.length === 1 && carreras[0] === "") {
		return CarrerasFlags.NINGUNA;
	}

	let carrera = CarrerasFlags.NINGUNA;
	for (let c of carreras) {
		if (c === "Civil") carrera = carrera | CarrerasFlags.CIVIL;
		else if (c === "Industrial") carrera = carrera | CarrerasFlags.INDUSTRIAL;
		else if (c === "Naval") carrera = carrera | CarrerasFlags.NAVAL;
		else if (c === "Agrim") carrera = carrera | CarrerasFlags.AGRIM;
		else if (c === "Mecánica") carrera = carrera | CarrerasFlags.MECANICA
		else if (c === "Electricista") carrera = carrera | CarrerasFlags.ELECTRICISTA;
		else if (c === "Electrónica") carrera = carrera | CarrerasFlags.ELECTRONICA;
		else if (c === "Química") carrera = carrera | CarrerasFlags.QUIMICA;
		else if (c === "Sistemas") carrera = carrera | CarrerasFlags.SISTEMAS;
		else if (c === "Informática") carrera = carrera | CarrerasFlags.INFORMATICA;
		else if (c === "Alimentos") carrera = carrera | CarrerasFlags.ALIMENTOS;
		else if (c === "Ing. Agrim") carrera = carrera | CarrerasFlags.INGAGRIM;
		else if (c === "Tecnicatura Naval") carrera = carrera | CarrerasFlags.TECNAVAL;
		else if (c === "Petróleo") carrera = carrera | CarrerasFlags.PETROLEO;
		else {
			console.error("Carrera inválida: \"" + c + "\"");
			process.exit(1);
		}
	}

	return carrera;
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

var CarrerasFlags = {
	NINGUNA: 0,
	CIVIL: 1,
	INDUSTRIAL: 2,
	NAVAL: 4,
	AGRIM: 8,
	MECANICA: 16,
	ELECTRICISTA: 32,
	ELECTRONICA: 64,
	QUIMICA: 128,
	SISTEMAS: 256,
	INFORMATICA: 512,
	ALIMENTOS: 1024,
	INGAGRIM: 2048,
	TECNAVAL: 8192,
	PETROLEO: 16384,
	TODAS: 16384 - 1
};

let i = 0;
var colors = ["#FF5E5E", "#FF8F40", "#FFF45E" , "#94FF52" , "#7CD9D4", "#A876F5", "#FFA1F2" , "#BF6E45", "#3ABA7A", "#275BCC", "#82F5B4", "#B1B8C4", "#BA3A7A"];
function newColor() {
	return colors[i++ % colors.length];
}

parse("raw_data");
