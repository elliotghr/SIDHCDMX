<?php
try {
    $host = "localhost";
    $dbname = 'apiPrueba';
    $pass = 'mysecretpassword';
    $myPDO = new PDO("pgsql:host=$host;dbname=$dbname", "postgres", $pass);
} catch (PDOException $e) {
    echo $e->getMessage();
}