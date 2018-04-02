<?php
	header('Accept: application/json');
	header('Content-type: application/json');

	$imageFileType = pathinfo($_FILES['file']['name'],PATHINFO_EXTENSION);	
	
    if( 0 < $_FILES['file']['error'] ) {
        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
    }else{
        move_uploaded_file($_FILES['file']['tmp_name'], '../uploads/'.$_POST['id_property'].'.'.$imageFileType);
        echo($_POST['id_property'].'.'.$imageFileType);
    }

	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "mercadodepastec2";

	$conn = new mysqli($servername, $username, $password, $dbname);

	if($conn -> connect_error){
		header("HTTP/1.1 500 Bad Connection to the DataBase");
		die("The server is down, please try again later.");
	}else{
		$path = $_POST['id_property'].'.'.$imageFileType;
		$id_property = $_POST['id_property'];
		$sql = "INSERT INTO photos(id_photo, image, sDescripcion, id_property) VALUES (' ', '$path', ' ', '$id_property')";
		$conn -> query($sql);
	}
?>