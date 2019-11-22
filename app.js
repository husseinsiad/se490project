    var express         =require("express"),
        bodyparser      = require("body-parser"),
        methodoverride  = require("method-override"),
        admin           = require("firebase-admin"),
        flash           = require('connect-flash'),
        cookieParser    = require('cookie-parser'),
        session         = require('express-session'),
        firebase        = require("firebase");
        
 var  serviceAccount  = require('./se490-1b878-firebase-adminsdk-r9vht-96968a906a');
           admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://se490-1b878.firebaseio.com"
        });
        // admin.initializeApp();
       var db=admin.database();
          
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
    //   firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    //   firebase.auth.Auth.Persistence.LOCAL;
      
  //SETUP UTILITIES
 // ================
   
    app.set("view engine","ejs")
    app.engine('html', require('ejs').renderFile);
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(methodoverride("_method"));
    app.use("/static", express.static('./static/'));
    app.use(express.static(__dirname + "/public"));
    app.use(cookieParser());
    app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));
    
    app.use(flash());
    app.use(function(req, res, next){
        // res.locals.currentUser=firebase.auth().currentUser;
        res.locals.currentUser = req.flash('currentUser');
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    });


//Authentication Middleware 
    function isAuthenticated(req,res,next){
        var user = firebase.auth().currentUser;
          if (user !== null) {
            req.user = user;
            next();
          } else {
          req.flash('error',"Please Login First!!");
          res.redirect('/login');
          }
        }
     
     //Show Home Page 
    // --------------
   app.get("/",function(req,res){
          	res.render("login");
    });
    
    app.get("/home",isAuthenticated,function(req,res){
          	res.render("home");
    });
    
    //Blank Page
     app.get("/blank",isAuthenticated,function(req,res){
         //Get Current UserID
          var userid = firebase.auth().currentUser.uid;
          var userRef=db.ref("/Users/"+userid+"/DTC/DTC Code");
          userRef.on("value",function(snapshot){
        var data=JSON.stringify(snapshot.val)
        var testData = snapshot.val()
        testData = testData.substr(2,testData.length - 4)
        testData = testData.split('), (')
        var testDTC = testData[0].split(', ')
      	res.render("black",{ code_num:testDTC[0], data:testDTC[1] });
          	
             })
    });
    
    
     // Show CarMD page
       app.get("/carmd",isAuthenticated,function(req,res){
      
            res.render("carmd");
    });
    
    //AUTHENTICATION ROUTE
    //Show Login Page
    // --------------
      app.get("/login", function(req,res){
    	res.render("login");
         });
    //Check login 
    // -----------
    app.post("/login",function(req,res){
        var email = req.body.email;
        var password = req.body.password;
         firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(user){
              //Get Current UserID
          var userid = firebase.auth().currentUser.uid;
          // Get User Information
        //   console.log(userid);
            var userRef=db.ref("/Users/"+userid);
            userRef.on("value",function(snapshot){
            var userData=snapshot.val();
           
             req.flash('currentUser',userData.firstname)
            //  req.flash('currentUser',"HUSSEIN");
           	res.redirect("/home");
      })
      
        }).catch(function(error){
             var errorMessage = error.message;
             req.flash('error', errorMessage);
             //console.log(errorMessage);
             res.redirect("/login");
        })
    
    });
    
    
     //Show Logout Page
    // ---------------
     app.get("/logout",function(req,res){
         
         req.flash("success","You Logged Out!!");
    	res.redirect("/login");
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
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var password = req.body.password;
      
         firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function(user){
           // console.log(user)
            // define database
        var refdb=db.ref().child("Users");
        // get clientid and append cleint information
        var clientId=firebase.auth().currentUser.uid;
       
         var clientRef=refdb.child(clientId);
         // console.log(clientRef);
        var clientData = {firstname:req.body.firstname, lastname:req.body.lastname};
       
           clientRef.set(clientData,function(error,user){
            if(error){
                 var errorMessage = error.message;
                req.flash("error",errorMessage);
            	res.redirect("signup");
                
            }
            else{
                req.flash("currentUser",req.body.firstname)
                 res.redirect("/home");
                
            }
        })
        
          // 	res.render("login");
        }).catch(function(error){
             var errorMessage = error.message;
             req.flash("error",errorMessage);
             res.redirect("/signup");
            
        })
      
    });
    
    //Forget Password
    
      app.post("/forgetpassword",function(req,res){
        var email = req.body.email;
       
         firebase.auth().sendPasswordResetEmail(email)
        .then(function(user){
          // alert("Email has been sent: Check your email and verify ");
           // console.log(user)
           	res.render("login");
        }).catch(function(error){
             var errorMessage = error.message;
         //  alert("Error message: " +errorMessage);
            
        })
    
    });
    
    
    // PORT LISTENER
    // app.listen(process.env.PORT || 3000, process.env.IP
    app.listen(process.env.PORT, process.env.IP,function(){
    	console.log("Server is running...");
    });