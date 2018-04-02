<?php

	header('Accept: application/json');
	header('Content-type: application/json');
    require_once __DIR__ . '/dataLayer.php';
    
    $action = $_POST["action"];
    
    switch($action){
        case "LOGIN": login();
                      break;
        case "REGISTER": register();
                         break;
        case "LOGOUT": logout();
                       break;
        case "SESSIONCHECK": sessioncheck();
                             break;
        case "COOKIESCHECK": cookiescheck();
                             break;
        case "FILTERPROPERTIES" : filterprops();
                                  break;
        case "FINDROOMIES" : findRoomies();
                             break;
        case "FETCHFAVORITES" : fetchFavorites();
                                break;
        case "FETCHPROPERTIES" : fetchProperties();
                                 break;
        case "REGISTERFAVORITE" : registerFavorite();
                                  break;
        case "IDENTIFYPROPERTIESBYID" : identifyPropertiesByID();
                                        break;
        case "UPLOADPROPERTY" : uploadProperty();
                                break;
        case "IsItFAVORITE" : isItFavorite();
                              break;

        case "GETUSERDATA" : getUserInfo();
                             break;
    }

    function isItFavorite(){
         
        $currentUserEmail = $_POST["currentUserEmail"];
        $currentProperty = $_POST["currentProperty"];
                 
        $response = data_isItFavorite($currentUserEmail, $currentProperty);
        if($response["status"] == "success"){
            echo json_encode($response);
        }
    }

    function getUserInfo(){
        $email = $_POST["email"];

        $response = data_getUserInfo($email);
        echo($email);
        echo json_encode($response);
    }

    function uploadProperty(){
        $direccion = $_POST["direccion"];
        $precio = $_POST["precio"];
        $cuartos = $_POST["cuartos"];
        $banos = $_POST["baños"];
        $contrato = $_POST["contrato"];
        $parking = $_POST["parking"];
        $pets = $_POST["pets"];
        $muebles = $_POST["muebles"];
        $tipo = $_POST["tipo"];
        $latitude = $_POST["latitude"];
        $longitude = $_POST["longitude"];
        $distance = $_POST["distance"];
        $servicios = $_POST["servicios"];
        $descripcion = $_POST["descripcion"];
        $currentUserEmail = $_POST["currentUserEmail"];

        $response = data_uploadProperty($direccion, $precio, $cuartos, $banos, $contrato, $parking, $pets, $muebles, $tipo,
                                        $latitude, $longitude, $distance, $servicios, $descripcion, $currentUserEmail);

        echo json_encode($response);
    }

    function identifyPropertiesByID(){
        $idProperty = $_POST["idProp"];
        $response = data_identifyPropertiesByID($idProperty);

        echo json_encode($response);
    }

    function registerFavorite(){
        $currentProperty = $_POST["currentProperty"];
        $currentUserEmail = $_POST["currentUserEmail"];

        $response = data_registerFavorite($currentProperty, $currentUserEmail);
        echo json_encode($response);
    }

    function fetchProperties(){
        $result = data_fetchProperties();

        echo json_encode($result);
        //falta manejar el status 500 del data layer
    }

    function filterprops(){
        $minPrice = $_POST["minPrice"];
        $maxPrice = $_POST["maxPrice"];
        $maxDistance = $_POST["maxDistance"];
        $numRooms = $_POST["numRooms"];
        $tipo = $_POST["tipo"];
        $parking = $_POST["parking"];
        $amueblado = $_POST["amueblado"];

        $result = data_filterproperties($minPrice, $maxPrice, $maxDistance, $numRooms, $tipo, $parking, $amueblado);

        echo json_encode($result);
    }

    function cookiescheck(){
        if (isset($_COOKIE["email"])){
            echo json_encode(array("email" => $_COOKIE["email"]));
        }else{
            header('HTTP/1.1 406 Cookie has not been set');
            die("There are not saved cookies yet.");
        }
    }

    function sessioncheck(){
        session_start();
        if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["email"])){
            echo json_encode(array("fName" => $_SESSION["firstName"], "lName" => $_SESSION["lastName"], "email" => $_SESSION["email"]));
        }else{
            header('HTTP/1.1 406 Session has expired.');
            die("Your session has expired you will be redirected to the index.");
        }
    }

    function logout(){
        session_start();
        if (isset($_SESSION["firstName"]) && isset($_SESSION["lastName"]) && isset($_SESSION["email"])){
            unset($_SESSION["firstName"]); //Quita las variables firstName y lastName
            unset($_SESSION["lastName"]);
            unset($_SESSION["email"]);
            session_destroy(); //Terminar la sesion
            echo json_encode(array("successMessage" => "Session deleted successfully"));
        }else{
            header('HTTP/1.1 406 Session has expired.');
            die("Your session has expired you will be redirected to the index.");
        }
    }

    function login(){
        
        $uEmail = $_POST["uEmail"];
		$uPassword = $_POST["uPassword"];
        $remember = $_POST["remember"];
        
        $response = attemptLogin($uEmail, $uPassword);
       
        if($response["status"] == "success"){
            // Abrir y guardar datos en la sesion
            session_start();
            $_SESSION["firstName"] = $response["firstName"];
            $_SESSION["lastName"] = $response["lastName"];
            $_SESSION["email"] = $response["email"];
            if($remember){
                setcookie("email", $uEmail, time() + 3600*24);
            }
            echo json_encode($response);
        }else{
            errorHandling($response["status"]);
        }
    }

    function register(){
        
        $uCorreo = $_POST["uCorreo"];
        $uNombre = $_POST["uNombre"];
        $uApellidos = $_POST["uApellidos"];
        $uTelefono = $_POST["uTelefono"];
        $uPwd = $_POST["uPwd"];
        $uGender = $_POST["uGender"];
        $uMinRent = $_POST["minWillingRent"];
        $uMaxRent = $_POST["maxWillingRent"];
        
        $response = attemptRegister($uCorreo, $uNombre, $uApellidos, $uTelefono, $uPwd, $uGender, $uMinRent, $uMaxRent);
                
        if($response["status"] == "success"){
            session_start();
            $_SESSION["firstName"] = $uNombre;
            $_SESSION["lastName"] = $uApellidos;
            $_SESSION["email"] = $uCorreo;
            //startCookie($username);
            echo json_encode($response);
        }else{
            errorHandling($response["status"]);
        }
    }

    function findRoomies(){
        
        $rentToPay = $_POST["rentToPay"];
        $currentUserEmail = $_POST["currentUserEmail"];
        
        $response = attemptFindRoomies($rentToPay, $currentUserEmail);
            
        echo json_encode($response);
        //falta manejar el status 500 del data layer
    }

    function fetchFavorites(){
        
        $currentUserEmail = $_POST["currentUserEmail"];
         
        $response = attemptFetchFavorites($currentUserEmail);
       
        echo json_encode($response);
        //falta manejar el status 500 del data layer
    }

    function startSession($fName, $lName){
        //Abrir y guardar datos en la sesion
        session_start();
        $_SESSION["firstName"] = $fName;
        $_SESSION["lastName"] = $lName;
    }

    function startCookie($uName){
        $remember = $_POST["remember"];
        if($remember == "true"){
            setcookie("username", $uName, time() + 3600*24);
        }
    }

    function errorHandling($status){
        switch($status){
            case "406":
                header('HTTP/1.1 406 User not found');
                die("Wrong credentials provided!");
                break;
            
            case "500":
                header('HTTP/1.1 500 Bad connection to Database');
                die("The server is down, we couldn't establish the DB connection");
                break;
                
            case "409":
                header('HTTP/1.1 409 Conflict, Username already in use please select another one');
                die("Username already in use.");
                break;
        }
    }

?>