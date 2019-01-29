function LoginViewModel() {
    var self = this; 
    self.usuarioclaveMsg = ko.observable(false);
    self.usuarioMsg = ko.observable(false);
    self.claveMsg = ko.observable(false);
    self.codigo = ko.observable("");
    self.clave = ko.observable("");
    
    
   self.clickverificar = function() {
        self.usuarioMsg(false);
        self.claveMsg(false);
        self.usuarioclaveMsg(false);
   
        if (self.codigo()=="")
        {
            self.usuarioMsg(true);
        
        }

        if (self.clave()=="")
        {
            self.claveMsg(true);
        }
       
        if ((self.codigo()!="") && (self.clave()!=""))
        {  
          // Instruccion SQL
           $.mobile.SqLite.transaction
              (
                   function(tx)
	                   {
	                     var consulta = "SELECT * FROM USUARIOS Where codigo = '"+self.codigo() +
	                                    "' And clave = '"+ self.clave()+"'";	                     
	                     //alert(consulta);        
	    	             tx.executeSql(consulta,[],
	    	             				function(tx,rs)
	    	             				  {
	    	             				    if(rs.rows.length >0)
	    	             				    {
	    	             				     	           
	    	             				       $.mobile.changePage('infoclientes.html');
	    	             				    }
	    	             				    else
	    	             				    {
	    	             				    
	    	             				       self.usuarioclaveMsg(true);
	    	             				    }
	    	             				  },
	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	    	             			  );
	                   }
              );
        
           
         }
	};
	
   self.limpiar = function() {
            self.codigo("");
            self.clave("");
            self.usuarioclaveMsg(false);
            self.usuarioMsg(false);
            self.claveMsg(false);
	};
	
	
};



$('#login').live('pageinit',function()
 {
   //alert("pageinit")
   ko.applyBindings(new LoginViewModel());
 });	
 
 
 $('#login').live('pageshow',function()
 {
   document.addEventListener("deviceready", onDeviceReady, false);
 });
 
   function onDeviceReady() {
     //   alert(device.uuid); 
    }
 	
 
 
	
 
