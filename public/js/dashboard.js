// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCbraNG7o2dJ3hnWZT9x0voQzDbUi8PCFM",
    authDomain: "wanderlust-3c1f8.firebaseapp.com",
    databaseURL: "https://wanderlust-3c1f8.firebaseio.com",
    projectId: "wanderlust-3c1f8",
    storageBucket: "wanderlust-3c1f8.appspot.com",
    messagingSenderId: "848836560900"
  };
   firebase.initializeApp(config);

   var useremail = "";
   var currentLocation = window.location.href;
	var currentPath = currentLocation.split(":3000/")[1].split("/")[0];

   firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		  	useremail = user.email;
		  	
		  	if(!currentPath.includes("user")){
		  		miPerfil();
		  		localizaFoto();
		  	}
		}
	});

// Initialize Google Maps
	var map = new google.maps.Map (document.getElementById('map'),{
			zoom:2, 
			center: new google.maps.LatLng(21.815316,-6.633916),
			mapTypeId: google.maps.MapTypeId.ROADMAP
			});

	var marker, i;

	

	if(currentPath.includes("user")){
		var username = currentLocation.split(":3000/")[1].split("/")[1];
		localizaFotoPorUsuario(username);
	}
	
	function localizaFotoPorUsuario (userprofile){
    $.ajax({
        url: 'https://wanderlust-3c1f8.firebaseio.com/data.json',
        dataType: "json",
        success: function(data){
        	for(var usuario in data.usuarios){
        		if(data.usuarios[usuario].user == userprofile){
        			
        			var emailUsuario = data.usuarios[usuario].email;
        			var nameProfile= $('#nameProfile');
					var nameUser= data.usuarios[usuario].user;
					nameProfile.text(nameUser);
					$('.fotoPerfil').attr('src', data.usuarios[usuario].profile);

        			console.log("EMAIL: " + emailUsuario)
        			for(var foto in data.fotos){
		                if (data.fotos[foto].email == emailUsuario){	
		                    for(var album in data.fotos[foto].albums){
		                        var latitude = data.fotos[foto].albums[album].location[0].latitude;
		                        var longitude = data.fotos[foto].albums[album].location[0].longitude;

		                        console.log(latitude);
		                        console.log(longitude);

		                        var icono = '../images/MapMarker_Flag5_Pink.png';
		                        marker = new google.maps.Marker({
		                            position: new google.maps.LatLng(latitude, longitude),
		                            map: map,
		                 			icon: icono
		                            });

		                        google.maps.event.addListener (marker, 'click', (function (marker,i){
		                            return function(){
		                                galeria(marker.getPosition().lat(), marker.getPosition().lng())
		                            }
		                        }) (marker, i))
		                    }
		                }
		            }
        		}
        	}

            
            //miPerfil();
        }
    })
};   
	
	function localizaFoto (){
    $.ajax({
        url: 'https://wanderlust-3c1f8.firebaseio.com/data.json',
        dataType: "json",
        success: function(data){
            for(var foto in data.fotos){
                if (data.fotos[foto].email == useremail){
                	console.log(useremail)
            		
                    for(var album in data.fotos[foto].albums){
                        var latitude = data.fotos[foto].albums[album].location[0].latitude;
                        var longitude = data.fotos[foto].albums[album].location[0].longitude;

                        console.log(latitude);
                        console.log(longitude);

                        var icono = 'images/MapMarker_Flag5_Pink.png';
                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(latitude, longitude),
                            map: map,
                            icon: icono
                            });

                        google.maps.event.addListener (marker, 'click', (function (marker,i){
                            return function(){
                                galeria(marker.getPosition().lat(), marker.getPosition().lng())
                            }
                        }) (marker, i))
                    }
                }
            }
        }
    })
};   


function galeria (lat, long){
    $('#fotografia').empty();
    $.ajax({
        url:'https://wanderlust-3c1f8.firebaseio.com/data.json',
        dataType: 'json',
        success: function (data){
            for(var foto in data.fotos){
                if (data.fotos[foto].email == useremail){
                    for(var album in data.fotos[foto].albums){
                        if(parseInt(data.fotos[foto].albums[album].location[0].latitude) == parseInt(lat) && parseInt(data.fotos[foto].albums[album].location[0].longitude) == parseInt(long)){
                            var imagenes= data.fotos[foto].albums[album].url;
                            console.log(imagenes);
                            var marco= $('#fotografia');
                            var recuadro= '<div class="recuadro-foto"><a class="imgGrande" data-toggle="modal" data-target="#myModal"><img class="recuadro-foto" src="'+imagenes+'" alt=""></a></div>'
                            marco.append(recuadro);
                        }
                    }
                }
            }


            $('.imgGrande').on("click", function(){
                var imgOriginal= $(this).find('img').attr('src');
                $('#myModal .modal-body img').attr('src', imgOriginal)
            })
        }
    })
}


function miPerfil (){
	$.ajax({
		url:'https://wanderlust-3c1f8.firebaseio.com/data.json',
		dataType: 'json',
		success: function (data){
			console.log(data)
				for(var item in data.usuarios){
   				if(data.usuarios[item].email == useremail){
   					var nameProfile= $('#nameProfile');
					var nameUser= data.usuarios[item].user;
					nameProfile.text(nameUser);
					$('.fotoPerfil').attr('src', data.usuarios[item].profile);
   				}
   			}
   			
   		}
   	})
  }

  $('#logout').on("click", function(){
  	firebase.auth().signOut()
  	window.location.href = "/";
  })


  var file= $('#file');
  var storageRef;
  imagenesRef= firebase.database().ref().child("data/fotos").orderByChild("email").equalTo(useremail);
  console.log(useremail)

  $('#subirFoto').on("click", function(){
  	// alert("sube foto");
  	var imagenSubir=$("#file")[0].files[0];
  	storageRef= firebase.storage().ref();
  	storageRef.child('albums/' + imagenSubir.name).put(imagenSubir).then(function(snapshot){
  		$.ajax({
	        url: 'https://wanderlust-3c1f8.firebaseio.com/data.json',
	        dataType: "json",
	        success: function(data){

	            for(var foto in data.fotos){
	  	                if (data.fotos[foto].email == useremail){
		                	var key = foto;
		                	imagenesRef = firebase.database().ref().child("data/fotos/" + key + "/albums")
		                	var downloadURL = snapshot.downloadURL;
		                	var location = [];
		                	var locationObj = {};

		                	$.get("http://maps.google.com/maps/api/geocode/json?address="+$("#nombreFoto").val(), function(data){
		                		locationObj.latitude = data.results[0].geometry.location.lat;
  								locationObj.longitude = data.results[0].geometry.location.lng;
  								location.push(locationObj);
  								console.log(location)
  								crearNodoUrl(downloadURL, location);
		                	})	
	                }
	            }
	        }
	    })
  	});
  });




function crearNodoUrl (downloadURL, location){
	var nombreFoto= $('#nombreFoto');
	var img= imagenesRef.push();
	img.set({
		url: downloadURL,
		description: nombreFoto.val(),
		location: location
	});
 };


var profileFile= $('#profileFile');
var storageRef;
perfilRef= firebase.database().ref().child("data/usuarios").orderByChild("email").equalTo(useremail);

$('#saveProfile').on("click", function(){
  	// alert("sube foto");
  	var perfilSubir=$("#profileFile")[0].files[0];
  	storageRef= firebase.storage().ref();
  	storageRef.child('usuarios/' + perfilSubir.name).put(perfilSubir).then(function(snapshot){
  		$.ajax({
	        url: 'https://wanderlust-3c1f8.firebaseio.com/data.json',
	        dataType: "json",
	        success: function(data){

	            for(var profile in data.usuarios){

	  	                if (data.usuarios[profile].email == useremail){
	  	                	console.log("entra")
		                	var key = profile;
		                	perfilRef = firebase.database().ref().child("data/usuarios/" + key)
		                	var downloadURL = snapshot.downloadURL;
		                	crearNodoProfile(downloadURL);

		                	$('.fotoPerfil').attr('src',downloadURL);
	                }
	            }
	        }
	    })
  	});
  });

function crearNodoProfile (downloadURL){
	var prf= perfilRef;
	prf.update({
		profile: downloadURL
	});
 };

busquedaUser();

function busquedaUser(){
	console.log("eeeeeeeeeeeeee")
	
		$('#buscador').on("keydown",function(event){

			if(event.keyCode == 13){
				var busqueda= $('#buscador').val();
				console.log("aaaaaaa")
				$.get('https://wanderlust-3c1f8.firebaseio.com/data.json',function(data){
					for(var perfil in data.usuarios){
						if(data.usuarios[perfil].user.toLowerCase().includes(busqueda.toLowerCase())){
							$("#resultado-busqueda").removeAttr("hidden");
							var nombre = data.usuarios[perfil].user;
							var foto = data.usuarios[perfil].profile;
							// var cajaBusqueda = $("#caja-busquedas-oculta").clone();
							// cajaBusqueda.removeAttr("hidden");
							// cajaBusqueda.removeAttr("id");

							// cajaBusqueda.find(".foto-usuario-buscado img").attr("src", foto);
							// cajaBusqueda.find(".nombre-usuario-buscado").text(nombre);
							// $("#resultado-busqueda").append(cajaBusqueda);

					        var cajaBusqueda=  '<div class="row caja-busquedas" id="caja-busquedas-oculta">\
											  		<div class="foto-usuario-buscado"><a href="/user/'+nombre+'"><img class="foto-usuario-buscado" src="'+foto+'" alt=""></a></div>\
											  		<div class="nombre\-usuario-buscado">'+nombre+'</div>\
									  		    </div>'

							$("#resultado-busqueda").append(cajaBusqueda);
						}
					}
				})
			}
			
		})
}