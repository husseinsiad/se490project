$(document).ready(function () {
    // hide carmdresultpage when the page is loaded
    $('#carmdresultpage').hide();
    // Add Button onclick handler
    $('#btn-carmd').click(function (event) {
        //Get Value from textbox
        var mileage=document.getElementById("mileage").value;
        var vin=document.getElementById("vin").value;
        var dtc=document.getElementById("dtc").value;
       
        // if we made it here, there are no errors so make the ajax call
        $.ajax({
            
            type: 'GET',
            
            url: 'https://api.carmd.com/v3.0/diag?vin='+vin+'&mileage='+ mileage +'&dtc='+dtc,
            data: JSON.stringify({
         
            }),
            headers: {
                'Accept': 'application/json',
                // 'content-type':'application/json',
                'authorization':'Basic MjVjNTVjMjQtZjk3ZS00MGUzLTkzNzktYmY2ZmQxN2FhM2Nl',
                'partner-token':'1d1f546d13404bf6b4ec83e166a237d2'
            },
            'dataType': 'json',
            success: function(result, status) {
              console.log(result.data.code);
              console.log(result.data.urgency_desc);
              
            //   display carmdresultpage when CarMD Api successfuly
             document.getElementById("code").innerHTML=result.data.code;
             document.getElementById("urgency_desc").innerHTML=result.data.urgency_desc;
             document.getElementById("effect_on_vehicle").innerHTML=result.data.effect_on_vehicle;
             document.getElementById("responsible_system").innerHTML=result.data.responsible_system;
             document.getElementById("tech_definition").innerHTML=result.data.tech_definition;
                 
             //Display Result
              $('#carmdresultpage').show();
            
            },
            error: function() {
                $('#errorMessages')
                   .append($('<li>')
                   .attr({class: 'list-group-item list-group-item-danger'})
                   .text('Error calling web service.  Please try again later.'));
            }
        });
    });

    // $('#btn-test').click(function (event) {
    //     var mileage=document.getElementById("mileage").value;
    //     var vin=document.getElementById("vin").value;
    //     var dtc=document.getElementById("dtc").value;
    //     alert(mileage);
    //     alert(vin);
    //     alert(dtc);
    // });
 
});
 