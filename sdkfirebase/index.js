// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB5R_-VZ_Ak58cQBGw7rlN2_oVLz3YV2w0",
    authDomain: "useraccount-d7bf0.firebaseapp.com",
    databaseURL: "https://useraccount-d7bf0.firebaseio.com",
    projectId: "useraccount-d7bf0",
    storageBucket: "useraccount-d7bf0.appspot.com",
    messagingSenderId: "503799514931",
    appId: "1:503799514931:web:aae6447af9648c3705e046",
    measurementId: "G-B6RBSV2LRS"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 firebase.auth.Auth.Persistence.LOCAL;

//   Sigin 
$("#btn-login").click(function()
{

    var email = $("#login-username").val();
    var password = $("#login-password").val();
    if(email != "" && password != ""){
        // validate user information from Firebase
        var result = firebase.auth().signInWithEmailAndPassword(email, password);
        result.catch(function(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            window.alert("Error message: " +errorMessage);
        })
    }
    else
    {
        window.alert("email or password may incorrect!!");
    }
});

//SignOut

$("#btn-logout").click(function()
{
firebase.auth().signOut();
});

//Signup
$("#btn-signup").click(function()
{

    var email = $("#logout-email").val();
    var firstname = $("#logout-firstname").val();
    var lastname = $("#logout-lastname").val();
    var password = $("#logout-password").val();
    if(email != "" && password != ""){
        // validate user information from Firebase
        var result = firebase.auth().createUserWithEmailAndPassword(email, password);
        result.catch(function(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            window.alert("Error message: " +errorMessage);
        })
        //define database
        var refdb=firebase.database().ref().child("Users");
        //get clientid and append cleint information
        var clientId=firebase.auth().currentUser.uid;
        var clientRef=refdb.child(clientId);

        // save client info into Object
        var clientData=
        {
            "firstname":firstname,
            "lastname":lastname,
            
        };
        console.log(clientData);
        // Save client info into database
        clientRef.set(clientData,function(error){
            if(error){
            var errorCode=error.code;
            var errorMessage=error.message;
            window.alert("Error message: " +errorMessage);
            }
            else{
                window.location.href = "home.html";
            }
        })
        // result.catch(function(error){
        //     var errorCode=error.code;
        //     var errorMessage=error.message;
        //     window.alert("Error message: " +errorMessage);
        // })
    }
    else
    {
        window.alert("email or password may incorrect!!");
    }
});


//Reset Password
$("#btn-resetPassword").click(function()
{
 var email=$("#email").val();
 var resetEmail=firebase.auth();
 resetEmail.sendPasswordResetEmail(email).then(function(){
    window.alert("Email has been sent: Check your email and verify ");
 }).catch(function(error){
    var errorCode=error.code;
    var errorMessage=error.message;
    window.alert("Error message: " +errorMessage);

 });
 
});