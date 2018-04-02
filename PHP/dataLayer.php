<?php

    function connectionToDatabase(){
        $servername = "localhost";
        $username = "root";
        $password = "root";
        $dbname = "mercadodepastec2";
        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error){
            return null;
        }else{
            return $conn;
        }
    }

    function data_getUserInfo($email){
        $connection = connectionToDatabase();

        if($connection != null){
            $sql = "SELECT *
                    FROM users
                    WHERE id_user = '$email'";

            $result = $connection->query($sql);

            //Convierte los datos en un arreglo
            while($row = $result->fetch_array()){
                $rows[] = $row;
            }
            $connection->close();
            return $rows;
        }
    }

    function data_identifyPropertiesByID($idProperty){
        $connection = connectionToDatabase();

        if($connection != null){
            $sql = "SELECT  *
                    FROM properties
                    WHERE id_property = $idProperty ";
            
            $result = $connection ->query($sql);
            
            //convierte datos en un arreglo
            while($row = $result->fetch_array()){
              $rows[] = $row;
            }
            $connection -> close();
            return $rows;
        }
    }

    function data_uploadProperty($direccion, $precio, $cuartos, $banos, $contrato, $parking, $pets, $muebles, $tipo, $latitude, $longitude, $distance, $servicios, $descripcion, $currentUserEmail){
        $connection = connectionToDatabase();

        if($connection != null){
            $sql = "INSERT INTO properties(id_property, iPrice, iRooms, iBathrooms, id_owner, sDescripcion, chType, iContractTime, sServices, iDistance, bFurniture, iParking, bPets, location, latitude, longitude)
                VALUES ('', '$precio', '$cuartos', '$banos', '$currentUserEmail', '$descripcion', '$tipo', '$contrato', '$servicios', '$distance', '$muebles', '$parking', '$pets', '$direccion', '$latitude', '$longitude' )";
            $connection -> query($sql); 
            return ($connection->insert_id);     
        }      
    }

    function data_filterproperties($minPrice, $maxPrice, $maxDistance, $numRooms, $tipo, $parking, $amueblado){
        $connection = connectionToDatabase();
        if($connection != null){
            $sqlTipo = " ";
            if($tipo != "T"){
                $sqlTipo = " AND chType = '$tipo'";
            }

            $sqlParking = " ";
            if($parking != "T"){
                $sqlParking = " AND iParking > 0";
            }

            $sqlAmueblado = " ";
            if($amueblado != "T"){
                $sqlAmueblado = " AND bFurniture = '$amueblado'";
            }

            $sql = "SELECT *
                    FROM properties
                    WHERE iPrice >= $minPrice AND iPrice <= $maxPrice AND iDistance <= $maxDistance AND iRooms = $numRooms" . $sqlTipo . $sqlParking . $sqlAmueblado;
            $result = $connection ->query($sql);
            //convierte datos en un arreglo
            while($row = $result->fetch_array()){
              $rows[] = $row;
            }
            $connection -> close();
            return $rows;
        }
    }

    function attemptLogin($uEmail, $uPassword){
        
        $connection = connectionToDatabase();
        
        if($connection != null){
            $sql = "SELECT fName, lName, email
                    FROM users 
                    WHERE email = '$uEmail' AND passwrd = '$uPassword'";

            $result = $connection -> query($sql);
            
            if($result -> num_rows > 0){
                while($row = $result -> fetch_assoc()){
				    $response = array("status" => "success", "firstName"=>$row["fName"], "lastName"=>$row["lName"], "email" =>$row["email"]);
                }
                return $response;
            }else{
                $connection -> close();
                return array("status" => "406");
            }
        }else{
            return array("status" => "500");   
        }   
    }

    function attemptRegister($uCorreo, $uNombre, $uApellidos, $uTelefono, $uPwd, $uGender, $uMinRent, $uMaxRent){
       
        $connection = connectionToDatabase();
        
        if($connection != null){
            
            $sql = "SELECT email 
                    FROM users 
                    WHERE email = '$uCorreo'";

            $result = $connection -> query($sql);

            if($result -> num_rows > 0){
                return array("status" => "409");
            }else{
                $sql = "INSERT INTO users (email, fName, lName, phone, passwrd, image, gender, minWillingToPay, maxWillingToPay) VALUES ('$uCorreo', '$uNombre', '$uApellidos', '$uTelefono', '$uPwd', '', '$uGender', '$uMinRent', '$uMaxRent')";
                
                if (mysqli_query($connection, $sql)){
                    
                    $response = array("status" => "success", "firstName"=>$uNombre, "lastName"=>$uApellidos);
                    
                    $connection -> close();
                    return $response;
                }else{
                    $connection -> close();
                    return array("status" => "500");
                }
            }
        }else{
            return array("status" => "500");
        }   
    }

    function attemptFindRoomies($rentToPay, $currentUserEmail){
        
        $connection = connectionToDatabase();
        
        if($connection != null){
            
            $sql = "SELECT  *
				FROM users
                WHERE $rentToPay >= minWillingToPay AND $rentToPay <= maxWillingToPay AND email != '$currentUserEmail' ";
            
            $result = $connection ->query($sql);

            //convierte datos en un arreglo
            while($row = $result->fetch_array()){
              $rows[] = $row;
            }
            $connection -> close();
            return $rows;
            
        }else{
           return array("status" => "500"); 
        } 
    }

    function attemptFetchFavorites($currentUserEmail){
        
        $connection = connectionToDatabase();
        
        if($connection != null){
            
            $sql = "SELECT id_property
                    FROM is_favorite_of
                    WHERE id_user = '$currentUserEmail'";
        
            $result = $connection -> query($sql);

            while($row = $result->fetch_array()){
                
              $rows[] = $row;
            }
            $connection -> close();
            return $rows;  
        }else{
           return array("status" => "500");  
        }
    }

    function data_fetchProperties(){
        $connection = connectionToDatabase();

        if($connection != null){
            $sql = "SELECT  *
                    FROM properties";
        
            $result = $connection ->query($sql);
            
            //convierte datos en un arreglo
            while($row = $result->fetch_array()){
              $rows[] = $row;
            }
            $connection -> close();
            return $rows;
        }
    }

    function data_registerFavorite($currentProperty, $currentUserEmail){
        $connection = connectionToDatabase();

        if($connection != null){
            $sql = "INSERT INTO is_favorite_of(id_user ,id_property)
                    VALUES ('$currentUserEmail' , '$currentProperty')";
            if (mysqli_query($connection, $sql)){
                $connection -> close();
                return array("status" => "SUCCESS");
            }else{
                $connection -> close();
                return array("status" => "FAILURE");
            }
        }else{
            return array("status" => "500");
        }
    }

    function data_isItFavorite($currentUserEmail, $currentProperty){  
        $connection = connectionToDatabase();
        
        if($connection != null){
            $sql = "SELECT id_property
                    FROM is_favorite_of
                    WHERE id_user = '$currentUserEmail' && id_property = '$currentProperty'";   
            $result = $connection -> query($sql);
            if($result -> num_rows > 0){
                return array("status" => "success");
            }else{
                return array("status" => "failure");
            } 
        }else{
            return array("status" => "500");
        }  
    }

?>