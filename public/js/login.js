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
   init();
function init(){
  firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	  	console.log(user)
	    console.log("ya logeado");
	    window.location.href = "/dashboard";
	  } else {
	    if($("#entrar")){
	    	$("#entrar").on("click", function(){
	    		var email = document.getElementById("email").value;
				var pass = document.getElementById("password").value;
				firebase.auth().signInWithEmailAndPassword(email, pass).then(function(){
					window.location.href = "/dashboard";
				}).catch(function(error) {
					var  errorCode = error.code;
					var errorMessage = error.message;
					alert(errorMessage);
				});
	    	})
	    }

	    if($("#registrar")){
	    	$("#registrar").on("click", function(){
	    		 var email = document.getElementById("email").value;
			      var pass = document.getElementById("password").value;
			      console.log("registro")
			      	var successRegistro= "Se ha registrado correctamente";
			      	alert(successRegistro);
			      firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(){
			        window.location.href = "/";
			        }).catch(function(error) {
			        var errorCode = error.code;
			        var errorMessage = error.message;
			        alert(errorMessage);
			      });
	    	})
	    }
	  }
	});
  
  // var user = firebase.auth().currentUser;
  // if (user) {
  //   console.log("ya logeado")
  // } else {

    
  // }
}

  var registrar = $("#registrar");
  var usertext = $("#user");
  var email = $("#email");
  var password = $("#password")

  var database = firebase.database();

  registrar.on("click", function(){
  	// $(this).preventDefault();

  	var usuarios= database.ref("data/usuarios");
  	var fotos=database.ref("data/fotos");

  	var fts= fotos.push();

  	fts.set({
  		email: email.val(),
  		albums: [""]
  	});

  	console.log(usuarios)
  	var usr= usuarios.push();

  	usr.set({
  		user: usertext.val(),
  		email: email.val(),
  		password: password.val()
  	});


  })