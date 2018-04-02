$(document).ready(function(){
	CheckSession();
	$("#LogOutButton").on("click", logOut); //Funcion para cerrar la sesión		
});

function CheckSession(){
	// Acción para verificar que la sesión sigue activa
	var jsonToSend = {
                      "action" : "SESSIONCHECK"
				     };
    $.ajax({
        url : "PHP/applicationLayer.php",
        type : "POST",
        dataType : "json",
        data: jsonToSend,
        contentType: "application/x-www-form-urlencoded",
        success : function(sessionJson){
        	GetUserData(sessionJson.email);
            $("#LoggedNombre").text(sessionJson.fName + " " + sessionJson.lName);
        },
        error : function(errorMessage){
            console.log(errorMessage.responseText);
        }
    });
}

function GetUserData($UserEmail){
	var jsonToSend = {
		"action" : "GETUSERDATA",
		"email" : $UserEmail
	};

	$.ajax({
		url : "PHP/applicationLayer.php",
			type : "POST",
			dataType : "json",
			data: jsonToSend,
			contentType: "application/x-www-form-urlencoded",
			success : function(sessionJson){
				$("#input-nombre").val(sessionJson[1]);
	            $("#input-apellido").val(sessionJson[2]);
	            $("#input-correo").val($UserEmail);
			},
			error : function(errorMessage){
				alert("Something went wrong");
				window.location.replace("index.html");
			}
	})
}

function logOut(){
	// Acción para el botón de logout
		var jsonToSend = {
                            "action" : "LOGOUT"
						 };
		$.ajax({
			url : "PHP/applicationLayer.php",
			type : "POST",
			dataType : "json",
			data: jsonToSend,
			contentType: "application/x-www-form-urlencoded",
			success : function(sessionJson){
				window.location.replace("index.html");
			},
			error : function(errorMessage){
				window.location.replace("index.html");
			}
		});
}