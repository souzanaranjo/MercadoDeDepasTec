$(document).ready(function(){
    $email = "none";
    getCurrentUser();
    menuFunctionality();
	initMap();
    $("#closeModal").on("click", CerrarModal);
    $("#SearchhButton").on("click", validateFilter);
    $("#submitRent").on("click", findRoomies);
    $("#BotonFavoritos").on("click", listFavorites);
});

//Funcion para que funcione el submenu de opciones
function menuFunctionality(){
    $("#subnav > li").on("click",function(){
        $(".selected").removeClass("selected");
        var $currentSelection = $(".currentSelection");
        $currentSelection.removeClass("currentSelection");
        $currentSelection.addClass("hiddenSection");

        var currentSection = $(this).attr("class");
        if(currentSection == "Mapa" || currentSection =="Lista"){
            $("#filtros").show();
        }else{
            $("#filtros").hide();
        }
        $("#" + currentSection).addClass("currentSelection").removeClass("hiddenSection");
        $(this).addClass("selected");
    });
}

//Obtiene el email del usuario loggeado.
function getCurrentUser(){
    var jsonToSend = {
        "action" : "SESSIONCHECK"
    };
    $.ajax({
        url : "PHP/applicationLayer.php",
        type : "POST",
        dataType : "json",
        data: jsonToSend,
        async : false,
        contentType: "application/x-www-form-urlencoded",
        success : function(userEmail){
            $email = userEmail.email;
        },
        error: function(errorMessage) {
            console.log(errorMessage.responseText);
        }
    });
}

//Funcion para encontrar todos los usuarios que cumplen el rango de precio deseado a pagar.
function findRoomies(){
    var jsonSend = {
        "rentToPay": $("#willingRent").val(),
        "currentUserEmail": $email,
        "action" : "FINDROOMIES"
    };
        
    $.ajax({
        url : "PHP/applicationLayer.php",
        type : "POST",
        data: jsonSend, 
        dataType : "json",
        contentType : "application/x-www-form-urlencoded",
        success : function(roomies){
            
            console.log("si entrooooo");
            var listaRoomies = "";
            if(roomies != null) {
                
                for(var i = 0; i<roomies.length; i++){
                    listaRoomies += "<div class="+"roomie"+">" +
                                    '<p><i class="ion-person"></i>Nombre: ' + roomies[i][1] + " " + roomies[i][2] + "</p>" +  
                                    '<p><i class="ion-email"></i> Correo: ' + roomies[i][0] + "</p>" + 
                                    '<p><i class="ion-android-call"></i> Teléfono: ' + roomies[i][3] + "</p>" + 
                                    "</div>";
                }
                $("#listRoomies").append(listaRoomies);  
            }else{
                listaRoomies = " "; 
                $("#listRoomies").text(listaRoomies); 
            }          
        },
        error : function(errorMessage){
            console.log("no entrooooo");
            console.log(errorMessage.responseText);
        }
    });
}


/*FUNCIONES PARA FILTRAR LAS PROPIEDADES*/
//Funcion para validar los campos del menu de filtros al dar click a filtrar.
function validateFilter(){
    $minPrice = $("#minprecio").val();
    $maxPrice = $("#maxprecio").val();
    $cont = 0;
    if($minPrice == "") $("#minprecioError").show();
    else{$("#minprecioError").hide(); $cont++;}

    if($maxPrice == "") $("#maxprecioError").show();
    else{$("#maxprecioError").hide(); $cont++;}

    if($("#distance").val() == "") $("#distanceError").show();
    else{ $("#distanceError").hide(); $cont++;}

    if($("#rooms").val() == "") $("#roomsError").show();
    else{ $("#roomsError").hide(); $cont++;}

    if($cont == 4){
        if(parseInt($minPrice) > parseInt($maxPrice)){
            alert("Por favor ingrese un precio máximo mayor o igual al precio mínimo");
        }else{
            ReloadMap($("#distance").val());
        }
    }
}

//Funcion para recargar el mapa ya despues de pasar por validateFilter()
function ReloadMap(radioDistance){
                var ITESM = {lat: 25.651565, lng: -100.28954};
                var map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 16,
                  center: ITESM     
                });
                var marker = new google.maps.Marker({
                  position: ITESM,
                  map: map,
                  icon: pinSymbol("#FFF")
                });
                var cityCircle = new google.maps.Circle({
                strokeColor: '#61bd6c',
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: '#61bd6c',
                fillOpacity: 0.30,
                map: map,
                center: ITESM,
                radius: parseInt(radioDistance) * 1.1
                });
                filterProperties(map);
}

//Funcion para cargar las propiedades en el mapa y lista despues de ejecutar ReloadMap(radioDistance)
function filterProperties(map){
    var marker = [];
    var jsonToSend = {
                        "minPrice" : parseInt($("#minprecio").val()),
                        "maxPrice" : parseInt($("#maxprecio").val()),
                        "maxDistance" : parseInt($("#distance").val()),
                        "numRooms" : parseInt($("#rooms").val()),
                        "tipo" : $("input[name='Tipo']:checked").val(),
                        "parking" : $("input[name='Parking']:checked").val(),
                        "amueblado" : $("input[name='chFurniture']:checked").val(),
            "action" : "FILTERPROPERTIES"
                    };

        $.ajax({
                url: "PHP/applicationLayer.php",
                type: "POST",
                data: jsonToSend,
                dataType: "json",
                contentType: "application/x-www-form-urlencoded",
                success: function(HayPropiedades){
                    var properties = HayPropiedades;
                    var property;
                    var listaProperties = '<div class="row row3">'
                                       + '<div class="col-xs-2"></div>'
                                       + '<div class="col-xs-8"><b>' + properties.length + '</b> propiedades encontradas.</div>'
                                       + '<div class="col-xs-2"></div>'
                                       + '</div>';
                for (var i = 0; i < properties.length; i++){
                    marker[i] = new google.maps.Marker({
                    position : new google.maps.LatLng(properties[i][14], properties[i][15]),
                    map: map
                    });
                    google.maps.event.addListener(marker[i], 'click', (function(marker, i) {
                return function(){
                    property = properties[i];
                    listaProperties = getPropertyInfo(property,i);
                
                  $("#modalText").empty().append(listaProperties);
                  $(".likeButt").on("click", addFavorite);
                  var modal = document.getElementById('myModal');
                  // Get the <span> element that closes the modal
                  var span = document.getElementsByClassName("close")[0];
                  modal.style.display = "block";
                  span.onclick = function(){
                        modal.style.display = "none";
                    }
                    // When the user clicks anywhere outside of the modal, close it
                    window.onclick = function(event) {
                        if (event.target == modal) {
                            modal.style.display = "none";
                        }
                    }
              
                }
              })(marker[i], i));
                    property = properties[i];
                    listaProperties += getPropertyInfo(property,i); 
                }
                alert("Propiedades encontradas: " + properties.length);

            $("#lista").empty().append(listaProperties);
            $(".likeButt").on("click", addFavorite);
                },
                error: function(NoHayPropiedades){
                    alert("NO HAY NADA");
                }
            });
}
/*TERMINAN FUNCIONES PARA FILTRAR LAS PROPIEDADES*/

function CerrarModal(){
    var span = document.getElementsByClassName("close")[0];               
    var modal = document.getElementById('myModal');
    modal.style.display = "none";               
}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}

//Funcion para inicializar el mapa al cargar la pagina de Encuentra.html
function initMap(){

    var ITESM = {lat: 25.651565, lng: -100.28954};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: ITESM		
    });
    var marker = new google.maps.Marker({
        position: ITESM,
        map: map,
        icon: pinSymbol("#FFF") 
    });
    loadproperties(map);              
}
//Funcion para cargar todas las propiedades en el mapa y la lista despues de ejecutar initMap()    
function loadproperties(map){

    var jsonToSend = {
                     "action" : "FETCHPROPERTIES"
                     }
	var marker = [];
    $.ajax({
        url: "PHP/applicationLayer.php",
        type: "POST",
        data : jsonToSend,
        dataType: "json",
        async: false,
        contentType : "application/x-www-form-urlencoded",
        success: function(jsonProperties){
            var infowindow = new google.maps.InfoWindow();
            var properties = jsonProperties;
            var listaProperties = '<div id ="numProp" class="row row3">'
                                 + '<div class="col-xs-2"></div>'
                                 + '<div class="col-xs-8"><b>' + properties.length + '</b>      propiedades encontradas.</div>'
                                 + '<div class="col-xs-2"></div>'
                                 + '</div>';
            var MarkerContent = [];
            var property;
            for (var i = 0; i < properties.length; i++){
                
            	marker[i] = new google.maps.Marker({
            		position : new google.maps.LatLng(properties[i][14], properties[i][15]),
            		map: map
            	});
                

                google.maps.event.addListener(marker[i], 'click', (function(marker, i) {
                    return function(){
                        property = properties[i];
                        var listaProperties = getPropertyInfo(property,i);
                        
                        $("#modalText").empty().append(listaProperties);
                        $(".likeButt").on("click", addFavorite);
                        var modal = document.getElementById('myModal');
                        // Get the <span> element that closes the modal
                        var span = document.getElementsByClassName("close")[0];
                        modal.style.display = "block";
                        span.onclick = function(){
                            modal.style.display = "none";
                        }
                        // When the user clicks anywhere outside of the modal, close it
                        window.onclick = function(event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        }
                    }
                })(marker[i], i));
                
                property = properties[i];
                listaProperties += getPropertyInfo(property,i);
            
            }
            $("#lista").append(listaProperties);
            $(".likeButt").on("click", addFavorite);
            
        }, 
        error : function(errorMessage){
            alert(errorMessage.responseText);
        }
    });
}

function addFavorite(){
    if($email != "none"){
        $(this).addClass("redheart");
        var jsonSend = {
            "currentProperty" : this.id,
            "currentUserEmail" : $email,
            "action" : "REGISTERFAVORITE"
        };
        
         $.ajax({
            url : "PHP/applicationLayer.php",
            type : "POST",
            data : jsonSend,
            dataType : "json",
            contentType : "application/x-www-form-urlencoded",
            success : function(jsonReceived){
            },
            error : function(errorMessage){
                console.log(errorMessage);
            }
        });
    }else{
        alert("Por favor inicia sesión para agregar favoritos");
    }
}

function listFavorites(){
    
    var jsonSend = {
        "currentUserEmail" : $email,
        "action" : "FETCHFAVORITES"
    };
    
    $.ajax({
        url : "PHP/applicationLayer.php",
        type : "POST",
        data : jsonSend,
        dataType : "json",
        contentType : "application/x-www-form-urlencoded",
        success : function(jsonProperties){
            identifyProperties(jsonProperties);  
        },
        error : function(errorMessage){
            console.log(errorMessage);
        }
    });  
}

function identifyProperties(jsonProperties){
    $("#listaFav").empty();
    var listaProperties  = '<div class="row row3">'
                         + '<div class="col-xs-2"></div>'
                         + '<div class="col-xs-8">Tienes <b>' + jsonProperties.length + '</b> favoritos.</div>'
                         + '<div class="col-xs-2"></div></div>';
    
    $("#listaFav").append(listaProperties);
        
    for(var i = 0; i<jsonProperties.length; i++){
        var jsonToSend = {
            "idProp" : jsonProperties[i][0],
            "action" : "IDENTIFYPROPERTIESBYID"
        };

        $.ajax({
        url : "PHP/applicationLayer.php",
        type : "POST",
        data : jsonToSend,
        dataType : "json",
        contentType : "application/x-www-form-urlencoded",
        success : function(jsonProperties){
            var properties = jsonProperties;
            var property = jsonProperties[0];
            var listaProperties = "";
            
            for (var i = 0; i < properties.length; i++){
                property = properties[i];
                listaProperties += getPropertyInfo(property, i);   
            }
            $("#listaFav").append(listaProperties);
            
        },
        error : function(errorMsg){
            
        }
        });
    }
}
        
function getPropertyInfo(property, i){
    //Revisa si la propiedad ha sido marcada como favorita por el usuario loggeado
    var jsonToSend = {
        "action" : "IsItFAVORITE",
        "currentUserEmail" : $email,
        "currentProperty" : property[0]
    }
    var redheart = "";

    $.ajax({
        url : "PHP/applicationLayer.php",
        type : "POST",
        data : jsonToSend,
        dataType : "json",
        async : false,
        contentType : "application/x-www-form-urlencoded",
        success : function(favorite){
            redheart = "redheart";
        },
        error : function(errorMessage){
            console.log(errorMessage);
        }
    }); 
     
    var listaProperties = "";
                        var tipoP;
                        (property[6] == 'C') ? tipoP = "Casa" : tipoP = "Departamento";
                        var mascotasP;
                        (property[12] == '0') ? mascotasP = "No" : mascotasP = "Si";
                        var contratoP;
                        (property[7] == '0') ? contratoP = "Sin plazo forzoso" : contratoP = property[7] + " meses";
                        var amuebladoP;
                        if(property[10] == "N") amuebladoP = "No"; else if(property[10] == "Y") amuebladoP = "Si"; else amuebladoP = "Semi amueblado";
                        var serviciosP = "";
                        servicios = property[8];
                        if (servicios[0] == '1')  serviciosP += "-Agua"; if (servicios[1] == '1')  serviciosP += "  -Luz"; if (servicios[2] == '1')  serviciosP += "  -Gas";
                        if (servicios[3] == '1')  serviciosP += "  -Internet"; if (servicios[4] == '1')  serviciosP += "  -Televisión"; if (servicios[5] == '1')  serviciosP += "  -Teléfono"; 
                        if (servicios[6] == '1')  serviciosP += "  -Limpieza";
                        listaProperties += '<div class="row row3">'
                                         + '<div class="col-xs-2"></div>'
                                         + '<div class="detail col-xs-8">'
                                         + '<img class="j3" src="uploads/' + property[0] + '.jpg"  />'
                        
                                         +  '<ul class="favFechaDir">' +
                                            '<li><i id="' + property[0] + '" class="ion-ios-heart heart ' + redheart + ' likeButt"></i></li>' +
                                            '<li class="ulInfo">Precio: $' + '<span id="pPrecio'+ [i] + '"' + '>' + property[1] + ' MXN</span>' + '</li>' +
                                            '<li class="ulInfo">Dirección: ' + '<span id="pDireccion'+ [i] + '"' + '>' + property[13] + '</span>' + '</li></ul>'
                     
                                         +  '<ul class="caracteristicas">' +
                                            '<li>Cuartos: ' + '<span id="pCuartos'+ [i] + '"' + '>' + property[2] + '</span>' + '</li>' +
                                            '<li>Baños: ' + '<span id="pBanos'+ [i] + '"' + '>' + property[3] + '</span>' + '</li>' +
                                            '<li>Tipo: ' + '<span id="pTipo'+ [i] + '"' + '>' + tipoP + '</span>' + '</li></ul>'
                       
                                         +  '<ul class="caracteristicas">' +
                                            '<li>Contrato: ' + '<span id="pContrato'+ [i] + '"' + '>' + contratoP + '</span>' + '</li>' +
                                            '<li>Distancia: ' + '<span id="pDistancia'+ [i] + '"' + '>' + property[9] + ' metros</span>' + '</li>' +
                                            '<li>Mascotas: ' + '<span id="pMascotas'+ [i] + '"' + '>' + mascotasP + '</span>' + '</li></ul>'
                                            
                      
                                         +  '<ul class="caracteristicas">' +
                                            '<li>Amueblado: ' + '<span id="pAmueblado'+ [i] + '"' + '>' + amuebladoP + '</span>' + '</li>' +
                                            '<li>Estacionamiento: ' + '<span id="pEstacionamiento'+ [i] + '"' + '>' + property[11] + ' lugares</span>' + '</li>' +
                                            '<li><i class="ion-email"></i> ' + '<span id="pContacto'+ [i] + '"' + '>' + property[4] + '</span>' + '</li></ul>'

                                         +  '<ul class="caracteristicas caracteristicas2">' +
                                            '<li>Servicios incluidos: ' + '<span id="pServicios'+ [i] + '"' + '>' + serviciosP + '</span>' + '</li></ul>'
                        
                                         +  '<ul class="caracteristicas caracteristicas2">' +
                                            '<li>Descripción: ' + '<span id="pDescripcion'+ [i] + '"' + '>' + property[5] + '</span>' + '</li></ul>'

                                        
                        
                                         + '</div><div class="col-xs-2"></div></div>';
        return listaProperties;
}

