$(document).ready(function(){

    $('#consoleLog').append(localStorage.getItem('consoleLog'));

    $('#displayJSON').on('click', function(event) {
        
        event.preventDefault();      


        $.ajax({
            type: "GET",
            url:"/clusterConfigTemplate",
            dataType: "json",
            success: function (data) {

                $("#jsonModal").modal('show');

                jsonToDisplay = data
                
                form = $("#ccpClusterForm").serializeArray();
                formData = {};

                $(form).each(function(i, field){
                    formData[field.name] = field.value;
                });


                jsonToDisplay["provider_client_config_uuid"] = formData["vsphereProviders"]
                jsonToDisplay["name"] = formData["clusterName"]
                jsonToDisplay["datacenter"] = formData["vsphereDatacenters"]
                jsonToDisplay["cluster"] = formData["vsphereClusters"]
                jsonToDisplay["resource_pool"] = formData["vsphereClusters"] + "/" + formData["vsphereResourcePools"]
                jsonToDisplay["datastore"] = formData["vsphereDatastores"] 
                jsonToDisplay["deployer"]["provider"]["vsphere_client_config_uuid"] = formData["vsphereProviders"] 
                jsonToDisplay["deployer"]["provider"]["vsphere_datacenter"] = formData["vsphereDatacenters"] 
                jsonToDisplay["deployer"]["provider"]["vsphere_datastore"] = formData["vsphereDatastores"] 
                jsonToDisplay["deployer"]["provider"]["vsphere_working_dir"] = "/" + formData["vsphereDatacenters"] + "/vm"
                jsonToDisplay["ingress_vip_pool_id"] = formData["vipPools"] 
                jsonToDisplay["master_node_pool"]["template"] = formData["tenantImageTemplate"] 
                jsonToDisplay["worker_node_pool"]["template"] = formData["tenantImageTemplate"] 
                jsonToDisplay["node_ip_pool_uuid"] = formData["vipPools"] 
                jsonToDisplay["ssh_key"] = formData["sshKey"] 
                jsonToDisplay["networks"] = formData["vsphereNetworks"] 

                $('#jsonModal').find('.modal-body').append('<code><pre style="text-align:justify;">'+JSON.stringify(jsonToDisplay, undefined, 2)+'</pre></code>');
            }
        });
        
     
     });


    
    $('#deployCluster').on('click', function(event) {
        
        //Ensure the address provided for the proxy is a valid URL format
        if ( $("#proxySwitch").is(':checked') ) {
            proxyInput = $('#proxyInput').val()
            proxyInput = proxyInput.replace(/^https?\:\/\//i, "");

            if (!validURL(proxyInput))
            {
                event.preventDefault();

                $("#alertBox").html(
                    `
                    <div class="alert alert--danger alert-dismissible fade in ">
                        <div class="alert__icon icon-error-outline"></div>
                        <strong>Invalid proxy URL. Please try again</strong>
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>
                    </div>
                    `
                );

                return 
            }
        } 
        
        // Ensure the clustername provided is valid for CCP - lowercase and hyphen accepted
        if ( !validClusterName($("#clusterName").val())) {

                event.preventDefault();

                $("#alertBox").html(
                    `
                    <div class="alert alert--danger alert-dismissible fade in ">
                        <div class="alert__icon icon-error-outline"></div>
                        <strong>Cluster Name must only contain lowercase alphanumeric characters and -</strong>
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>
                    </div>
                    `
                );

                return 
        } 

        event.preventDefault();

        //Check cluster name does not already exist - on success deploy the cluster
        $.ajax({
            type: "GET",
            url:"/checkClusterAlreadyExists?"+ $.param({ "clusterName":$("#clusterName").val()  }),
            dataType: "json",
            success: function (data) {

                form = $("#ccpClusterForm").serializeArray();
                formData = {};
        
                $(form).each(function(i, field){
                    formData[field.name] = field.value;
                });
        
                $("#ccpClusterForm :input").prop("disabled", true);
        
                
                $.ajax({
                    url: "/stage2",
                    type : "POST",
                    contentType: 'application/json',
                    dataType : 'json',
                    data : JSON.stringify(formData),
                    success: function(response) {
        
                        consoleLog = localStorage.getItem('consoleLog');
                        consoleLog += $('#consoleLog').val()
                        localStorage.setItem('consoleLog', consoleLog);
        
                        $("#ccpClusterForm :input").prop("disabled", false);
                        if (response.redirectURL) {
                            window.location.replace(response.redirectURL);
                        } else {
                            window.location.reload(true);
                        }
                    },
                    error: function(error) {
                        
                        $("#ccpClusterForm :input").prop("disabled", false);
                        
                        errorMessage = JSON.parse(error.responseText)
                    
                        if ("errorMessage" in errorMessage)
                        {
                            $("#alertBox").html(
                                `
                                <div class="alert alert--danger alert-dismissible fade in ">
                                    <div class="alert__icon icon-error-outline"></div>
                                        <strong>` + errorMessage["errorMessage"] +`:<BR><BR> ` +errorMessage["errorMessageExtended"] +`</strong>
                                        
                                    <a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>
                                </div>
                                `
                            );
                        }
                        
                        
                }
                });
            },
            error: function(error) {

                $("#alertBox").html(
                    `
                    <div class="alert alert--danger alert-dismissible fade in ">
                        <div class="alert__icon icon-error-outline"></div>
                        <strong>Cluster with the same name already exists. Please try a new one.</strong>
                        <a href="#" class="close" data-dismiss="alert" aria-label="close">x</a>
                    </div>
                    `
                );

                return 
            }
        });

         
        
         
    });
     

     

        
         


})
