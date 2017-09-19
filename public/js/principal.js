// Initialize Google Maps
	var map = new google.maps.Map (document.getElementById('map'),{
			zoom:2, 
			center: new google.maps.LatLng(21.815316,-6.633916),
			mapTypeId: google.maps.MapTypeId.ROADMAP
			});

	var marker, i;
	

	localizaFoto();
	function localizaFoto (){

		$.ajax({
			url: 'http://localhost:3000/datos',
			dataType: "json",
			success: function(data){
				for (i=0; i<data.fotos.length; i++){
					if (data.fotos[i].idUser == "1") {
						var latitude = data.fotos[i].location[0].latitude;
						var longitude = data.fotos[i].location[0].longitude;

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
		})
	};
			


	// AIzaSyAn2leYgcss5sDRJLYzUyIgtE5BVOM41jE

	function galeria (lat, long){
		$('#fotografia').empty();
	$.ajax({
		url:'http://localhost:3000/datos',
		dataType: 'json',
		success: function (data){
			for (var i = 0; i < data.fotos.length; i++){
				if (data.fotos[i].idUser == "1"){
					if(parseInt(data.fotos[i].location[0].latitude) == parseInt(lat) && parseInt(data.fotos[i].location[0].longitude) == parseInt(long)){
						var imagenes= data.fotos[i].url;
						console.log(imagenes);
						var marco= $('#fotografia');
						var recuadro= '<div class="recuadro-foto"><a class="imgGrande" data-toggle="modal" data-target="#myModal"><img class="recuadro-foto" src="'+data.fotos[i].url+'" alt=""></a></div>'
						marco.append(recuadro);
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