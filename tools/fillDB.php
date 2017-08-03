<?

//ALTER TABLE tablename AUTO_INCREMENT = 1

$link = new mysqli(HOST, USER, PASS, DBCURSOR);
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
echo "Conección exitosa <br>";

$cuatrimestre = "2Q2017";

$file = file_get_contents("Horarios_" . $cuatrimestre . ".txt");
$file = iconv('iso-8859-1', 'utf-8', $file);
echo "Horarios_" . $cuatrimestre . ".txt abierto <br>";

$string = "";
$pos = 0;
while($pos2 = strpos($file,"Horarios y Vacantes ",$pos+1)){
	$string = $string . substr($file,$pos,$pos2 - $pos);
	$pos = strpos($file,"Materia: ",$pos2);
	if($pos == false) break;
}

//echo $string;

$pos = strpos($string,"Materia: ");
$inicio = $pos;
$codigoActual = substr($string,$pos + 9,4);
$nombreActual = substr($string,$pos + 14,strpos($string,"Vacantes: ",$pos) - $pos - 14);
echo "Codigo Actual: " . $codigoActual . " | Nombre Actual: " . $nombreActual . "<br>";
while($pos = strpos($string,"Materia: ",$pos+1)){
	$siguienteCodigo = substr($string,$pos + 9,4);
	
	if($codigoActual != $siguienteCodigo){
		$textoMateria = substr($string,$inicio,$pos - $inicio);
		//echo $textoMateria . "<br><br>";
		$inicio = $pos;
		$sql = "INSERT INTO tbCursos (Cuatrimestre, NombreMateria, Codigo, Texto) VALUES ('" . $cuatrimestre . "','" .  $nombreActual . "','" . $codigoActual . "','" . $textoMateria . "')";
		if ($link->query($sql) === TRUE) {
			echo "New record created successfully<br>";
		}else{
			echo "Error: " . $sql . "<br>" . $link->error . "<br><br>";
		}
		$codigoActual = substr($string,$pos + 9,4);
		$nombreActual = substr($string,$pos + 14,strpos($string,"Vacantes: ",$pos) - $pos - 14);
		echo "Codigo Actual: " . $codigoActual . " | Nombre Actual: " . $nombreActual . "<br>";
	}
}

$textoMateria = substr($string,$inicio);
$sql = "INSERT INTO tbCursos (Cuatrimestre, NombreMateria, Codigo, Texto) VALUES ('" . $cuatrimestre . "','" .  $nombreActual . "','" . $codigoActual . "','" . $textoMateria . "')";
if ($link->query($sql) === TRUE) {
	echo "New record created successfully<br>";
}else{
	echo "Error: " . $sql . "<br>" . $link->error . "<br><br>";
}
 
$link->close();



?>
