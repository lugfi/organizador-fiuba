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
					aDatos[i][1] = linea[2];
					aDatos[i][2] = linea[3];
					aDatos[i][3] = linea[4];
				}
				fs.writeFile(fileDatos.slice(0, -4) + ".json", JSON.stringify(aDatos, null, 4));
			});
		});
	});
}

parse("raw_data");
