$(document).ready(function(){
	CheckSession();
	LoadCookies();
	$("#submitForm1").on("click", validateSignUp); //Funcion de validar datos y crear cuenta.
	$("#submitForm2").on("click", validateLogIn); //Funcion de validar datos e iniciar sesión
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
            $("#LogButtons").hide();
            $("#LoggedInButtons").show();
            $("#LoggedNombre").text(sessionJson.fName + " " + sessionJson.lName);
            $("#bigcontainer").show();
            $("#smallcontainer").hide();
            $("#listaFav").show();
            $("#smallDivFavoritos").hide();
        },
        error : function(errorMessage){
            console.log(errorMessage.responseText);
        }
    });
}

function LoadCookies(){
	// Acción para cargar las cookies previamente guardadas
	var jsonToSend = {
                            "action" : "COOKIESCHECK"
						 };
	$.ajax({
		url : "PHP/applicationLayer.php",
		type : "POST",
		dataType : "json",
		data: jsonToSend,
		contentType: "application/x-www-form-urlencoded",
		success : function(cookieJson){
			$("#emaillogin").val(cookieJson.email);
		},
		error : function(errorMessage){
			console.log(errorMessage.responseText);
		}
	});
}

function validateSignUp(){
		var cont = 0;
		//Nombre
		($("#nombre").val() == "") ? $("#nameError").show() : 
									 ($("#nameError").hide(), cont++);
		//Apellido
		($("#apellido").val() == "") ? $("#lastnameError").show() :
									   ($("#lastnameError").hide(), cont++);
		//Email
    	($("#Email").val() == "") ? $("#EmailError").show() :
        					        ($("#EmailError").hide(), cont++);

        //Telefono
        ($("#telefono").val() == "") ? $("#TelefonoError").show() :
        							  ($("#TelefonoError").hide(), cont++);
    	//Password
		($("#pwd").val() == "") ? $("#passwordError").show() :
        						  ($("#passwordError").hide(), cont++);
        //Password confirmation
        if($("#pwd2").val() == ""){
        	$("#passwordError2").show();
        }else{
        	$("#passwordError2").hide();
        	console.log("Entra al primer else");
        	if($("#pwd").val() == $("#pwd2").val()){
        		$("#wrongpassword").hide();
        		cont++;
        		console.log("Entra al if despues del else");
        	}else{
        		$("#wrongpassword").show();
        		console.log("Entra al else despues del else");
        	}
        }				  
   		//Gender confirmation
  		$GenderInput = $("input[name='gender']:checked").val();
   		($GenderInput != "M" && $GenderInput != "F" ) ? $("#genderError").show() :
   										        		($("#genderError").hide(), cont++);	
   		if(cont == 7) SignUp(); 
}

function validateLogIn(){
		var cont = 0;
		//Correo
		($("#emaillogin").val() == "") ? $("#correologinerror").show() :
									     ($("#correologinerror").hide(), cont++);
		//Password
		($("#pwdlogin").val() == "") ? $("#pwdloginerror").show() :
									   ($("#pwdloginerror").hide(), cont++);
		if(cont == 2) LogIn();
}

function SignUp(){
		var jsonSignUp = {
						 	"uNombre" : $("#nombre").val(),
						 	"uApellidos" : $("#apellido").val(),
						 	"uCorreo" : $("#email").val(),
							"uTelefono" : $("#telefono").val(),
						 	"uPwd" : $("#pwd").val(),
						 	"uGender" : $("input[name='gender']:checked").val(),
                            "minWillingRent" : $("#MinRentToPay").val(),
                            "maxWillingRent" : $("#MaxRentToPay").val(),
                            "action" : "REGISTER"
						 };
		$.ajax({
			url: "PHP/applicationLayer.php",
			type: "POST",
			data : jsonSignUp,
			dataType: "json",
			contentType : "application/x-www-form-urlencoded",
			success: function(jsonSignUp){
                location.reload();
			},
			error : function(err){
				console.log(err);
			}
		})
}

function LogIn(){
		var rememberMe = $("#rememberMe").is(":checked");
		var jsonToSend = {
							"uEmail" : $("#emaillogin").val() ,
							"uPassword" : $("#pwdlogin").val(),
							"remember" : rememberMe,
                            "action" : "LOGIN"
						 };
		$.ajax({
			url: "PHP/applicationLayer.php",
			type: "POST",
			data : jsonToSend,
			dataType: "json",
			contentType : "application/x-www-form-urlencoded",
			success: function(jsonReceived){
				//alert("Bienvenido de vuelta " + jsonReceived.firstName + " " + jsonReceived.lastName);
				location.reload();
			},
			error : function(errorMessage){
				console.log("Algo mal");
				alert(errorMessage.responseText);
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