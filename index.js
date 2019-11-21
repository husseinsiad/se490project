    var express         =require("express"),
        bodyparser      = require("body-parser"),
        methodoverride  = require("method-override"),
        middleware      = require("middleware"),
        firebase = require("firebase");

    var app=express();

// Your web app's Firebase configuration
      var firebaseConfig = {
        apiKey: "AIzaSyBPGDWPtgemPzwDBkvv7CsmMy9AU1xI3ww",
        authDomain: "se490-1b878.firebaseapp.com",
        databaseURL: "https://se490-1b878.firebaseio.com",
        projectId: "se490-1b878",
        storageBucket: "se490-1b878.appspot.com",
        messagingSenderId: "291076266803",
        appId: "1:291076266803:web:50cfcdabad1a9b67e43c46",
        measurementId: "G-902S5QXK98"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      
  //SETUP UTILITIES
 // ================
   
    app.set("view engine","ejs")
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(methodoverride("_method"));
    app.use(express.static(__dirname + "/public"));


      //ROUTE
     //===================
     //Home Page
      app.get("/",function(req,res){
    	res.render("landing");
    });
    
    //Show Login Page
    // --------------
      app.get("/login",function(req,res){
    	res.render("login");
    });
    //Check login 
    // -----------
    app.post("/login",function(req,res){
        var email = req.body.email;
        var password = req.body.password;
      
         firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user){
           // console.log(user)
           	res.render("index");
        }).catch(function(error){
             var errorMessage = error.message;
             res.render("login",{error:errorMessage});
            
        })
    
    });
    //Show Signup Page
    // ---------------
     app.get("/signup",function(req,res){
    	res.render("signup");
    });
    //Signup New Client
    // --------------------
      app.post("/signup",function(req,res){
        var email = req.body.email;
        var firstname = req.body.first_name;
        var lastname = req.body.last_name;
        var password = req.body.password;
        
         firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user){
           // console.log(user)
            // define database
        var refdb=firebase.database().ref().child("Users");
        // get clientid and append cleint information
        var clientId=firebase.auth().currentUser.uid;
       
         var clientRef=refdb.child(clientId);
         // console.log(clientRef);
        var clientData = {firstname:firstname, lastname:lastname};
        console.log(clientData);
        console.log(req.body);
           clientRef.set(clientData,function(error){
            if(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            console.log(errorMessage);
            res.render("signup");
            }
            else{
                	res.render("login");
            }
        })
        
          // 	res.render("login");
        }).catch(function(error){
             var errorMessage = error.message;
             res.render("signup",{error:errorMessage});
            
        })
    });
    
    //Show Index Page 
    // --------------
    app.get("/index",function(req,res){
    	res.render("index");
    });

  
    // PORT LISTENER
    // app.listen(process.env.PORT || 3000, process.env.IP
    app.listen(process.env.PORT, process.env.IP,function(){
    	console.log("Server is running...");
    });