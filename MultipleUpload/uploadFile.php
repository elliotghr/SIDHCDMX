<?php

function eliminar_acentos($cadena)
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


$archivo = (isset($_FILES['archivo'])) ? $_FILES['archivo'] : null;

if ($archivo) {
    $file_name = $archivo['name'];
    $extension = pathinfo($file_name, PATHINFO_EXTENSION);
    $extension = strtolower($extension);
    $extension_correcta = ($extension == 'csv');

    if ($extension_correcta) {
        $ruta_destino_archivo = "{$archivo['name']}";
        $archivo_ok = move_uploaded_file($archivo['tmp_name'], $ruta_destino_archivo);

        $contentCsv = array();
        if (!$fp = fopen($file_name, "r")) echo "El archivo no pudo ser abierto.<br/>";
        while (($data = fgetcsv($fp)) !== FALSE) {
            $contentCsv[] = $data;
        }

        $number = count($contentCsv);
        for ($i = 0; $i < $number; $i++) {
            $clave = $contentCsv[$i][0];
            $url = $contentCsv[$i][1];

            $file_name = basename($url);
            $info = pathinfo($file_name);


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
                        $acentos = eliminar_acentos($header[$w]);
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
                    echo "<p class='failure'>El archivo $file_name no tiene datos, la tabla no fue modificada</p> <br> <hr>";
                } else {
                    $delete = 'DROP TABLE IF EXISTS ' . $tableName . '';
                    $myPDO->query($delete);
                    $create = 'CREATE TABLE IF NOT EXISTS' . $tableName . ' (' . '"';
                    try {
                        for ($j = 0; $j === 0; $j++) {
                            $createQuery = $create . $csv1array[$j] . '"' . ' VARCHAR (255));';
                            $myPDO->query($createQuery);
                            $api = 'grant select on public.' . $tableName . ' to web_anon';
                            $myPDO->query($api);
                        }
                    } catch (\Throwable $th) {
                        // echo " <br> <span class='failure'>Los datos no tienen un formato válido<br>";
                    }

                    $insert = 'INSERT INTO ' . $tableName . ' VALUES ';
                    try {
                        for ($k = 1; $k < count($csv2array); $k++) {
                            $insertQuery = $insert . '(' . "'" . '' . $csv2array[$k] . "'" . ');';
                            $myPDO->query($insertQuery);
                        }
                    } catch (\Throwable $th) {
                        echo 'Los datos no tienen un formato válido';
                    }
                    // # Al finar cerrar el gestor
                    fclose($fp);
                    echo "<p class='success'>Modificación realizada en la tabla</p> <br> <hr>";
                }
            }
        }
    } else echo " <br> <span class='failure'>Solo archivos con terminación .csv<br> <hr>";
}
