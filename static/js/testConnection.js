$(document).ready(function(){

        $('#ccpLoginForm').on('submit', function(event) {
            
            ipAddress = $('#ipAddress').val()
            ipAddress = ipAddress.replace(/^https?\:\/\//i, "");

            if (!validURL(ipAddress))
            {
                event.preventDefault();

                $("#alertBox").html(
                    `
                    <div class="alert alert--danger alert-dismissible fade in ">
                        <div class="alert__icon icon-error-outline"></div>
                        <strong>Invalid URL. Please try again</strong>
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>
                    </div>
                    `
                );

                return 
            }
            else{
                var data = {"ipAddress":ipAddress,"username":$('#username').val(),"password":$('#password').val()};

                $.ajax({
                    url: "/testConnection",
                    type : "POST",
                    contentType: 'application/json',
                    dataType : 'json',
                    data : JSON.stringify(data),
                    success: function(response) {
                        console.log("test")
                        localStorage.setItem('consoleLog', $('#consoleLog').val());
                        
                        if (response.redirectURL) {
                            window.location.replace(response.redirectURL);
                        }  else {
                            window.location.reload(true);
                        }
                    },
                    error: function(error) {
                        console.log("error")
                        $("#alertBox").html(
                            `
                            <div class="alert alert--danger alert-dismissible fade in ">
                                <div class="alert__icon icon-error-outline"></div>
                                <strong>Login unsuccessful. Please try again. </strong>
                                <a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>
                            </div>
                            `
                        );
                }
                });

                event.preventDefault();
                
            }
            
            
         
         });
         


})
