<?php
$rutaDeArchivo = "archivos";

function eliminar_acentoss($cadena)
{
    $cadena = utf8_encode($cadena);
    //Reemplazamos la A y a
    $cadena = str_replace(
        array('Á', 'À', 'Â', 'Ä', 'á', 'à', 'ä', 'â', 'ª'),
        array('A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a'),
        $cadena
    );

    //Reemplazamos la E y e
    $cadena = str_replace(
        array('É', 'È', 'Ê', 'Ë', 'é', 'è', 'ë', 'ê'),
        array('E', 'E', 'E', 'E', 'e', 'e', 'e', 'e'),
        $cadena
    );

    //Reemplazamos la I y i
    $cadena = str_replace(
        array('Í', 'Ì', 'Ï', 'Î', 'í', 'ì', 'ï', 'î'),
        array('I', 'I', 'I', 'I', 'i', 'i', 'i', 'i'),
        $cadena
    );

    //Reemplazamos la O y o
    $cadena = str_replace(
        array('Ó', 'Ò', 'Ö', 'Ô', 'ó', 'ò', 'ö', 'ô'),
        array('O', 'O', 'O', 'O', 'o', 'o', 'o', 'o'),
        $cadena
    );

    //Reemplazamos la U y u
    $cadena = str_replace(
        array('Ú', 'Ù', 'Û', 'Ü', 'ú', 'ù', 'ü', 'û'),
        array('U', 'U', 'U', 'U', 'u', 'u', 'u', 'u'),
        $cadena
    );

    //Reemplazamos la N, n, C y c
    $cadena = str_replace(
        array('Ñ', 'ñ', 'Ç', 'ç'),
        array('N', 'n', 'C', 'c'),
        $cadena
    );

    return $cadena;
}

function move_file($file, $to)
{
    $path_parts = pathinfo($file);
    $newplace   = "$to/{$path_parts['basename']}";
    if (rename($file, $newplace))
        return $newplace;
    return null;
}

if (isset($_REQUEST['guardar'])) {
    $url = $_REQUEST['url'];
    $clave = $_REQUEST['clave'];
    // basename() function Obtiene el nombre del archivo y su extensión
    $file_name = basename($url);

    //movemos el archivo a la ruta especificada
    move_file($file_name, $rutaDeArchivo);

    // pathinfo Devuelve información acerca de la ruta de un fichero
    $info = pathinfo($file_name);

    if ($info["extension"] === "csv") {

        /* file_get_contents() function Transmite un fichero completo a una cadena
                    file_put_contents() function Escribir datos en un fichero */

        if (file_put_contents(
            $file_name,
            @file_get_contents($url)
        ) === false) {
            echo "Error";
        } else {
            echo "<p class='success'>El archivo $file_name fue cargado correctamente</p>";
            echo "<p class='success'>Clave: $clave</p>";
            $tableName = '"' . $clave . '"'; //Nombre de la tabla con comillas

            $csv1array = array(); //Array para encabezados
            $csv2array = array(); //Array para datos
            if (!$fp = fopen($file_name, "r")) echo "El archivo no pudo ser abierto.<br/>";
            while (($data = fgetcsv($fp)) !== FALSE) {
                $newData = array();
                $header = $data; //Se crea una variable para los encabezados
                for ($w = 0; $w < count($header); $w++) {
                    $acentos = eliminar_acentoss($header[$w]);
                    $minusculas = strtolower($acentos);
                    $guiones = strtr($minusculas, "_", "-");
                    $espacios = strtr($guiones, " ", "-");
                    array_push($newData, $espacios);
                }
                $header = $newData;
                $header = implode('"  VARCHAR (255), "', $header);
                $csv1array[] = $header;

                $data = implode("','", $data);
                $csv2array[] = $data;
            }
            $tamaño = count($csv1array);
            if ($tamaño === 0) {
                echo "<p class='failure'>El archivo $file_name no tiene datos, la tabla no fue modificada</p>";
            } else {
                $delete = 'DROP TABLE IF EXISTS ' . $tableName . '';
                $myPDO->query($delete);
                $create = 'CREATE TABLE IF NOT EXISTS' . $tableName . ' (' . '"';
                for ($j = 0; $j === 0; $j++) {
                    $createQuery = $create . $csv1array[$j] . '"' . ' VARCHAR (255));';
                    $myPDO->query($createQuery);
                    $api = 'grant select on public.' . $tableName . ' to web_anon';
                    $myPDO->query($api);
                }

                $insert = 'INSERT INTO ' . $tableName . ' VALUES ';

                for ($k = 1; $k < count($csv2array); $k++) {
                    $insertQuery = $insert . '(' . "'" . '' . $csv2array[$k] . "'" . ');';
                    $myPDO->query($insertQuery);
                }
                // # Al finar cerrar el gestor
                fclose($fp);
                echo "<p class='success'>Modificación realizada en la tabla</p>";
            }
        }
    } else echo " <br> <span class='failure'>Solo links con terminación .csv<br>";
}
