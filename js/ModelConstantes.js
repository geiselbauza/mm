(function($) {
    var self =  $.mobile.ModelConstantes = {
    		
  
     PA:ko.observable(""),
     
     /*
        Jesus:    url: 'http://204.93.174.100:8080/Service1.svc/Obtener'+tabla,
    	direccionURL:ko.observable("http://localhost:2987/Service1.svc/"),
    	direccionURL:ko.observable("http://disahuca.dyndns.info:8085/Service1.svc/"),     
    	direccionURL:ko.observable("http://192.168.1.101:8085/Service1.svc/"),//Engels Demo
      */ 
     init : function()
	        {
     	        
     	       //self.IP("disahuca.dyndns.info");self.Puerto("8085");
     	       //self.IP("204.93.174.100");self.Puerto("8085");
     	       //self.IP("localhost"); self.Puerto("2987");     	       
     	       //self.IP("localhost"); self.Puerto("8085");
     	       //self.IP("192.168.1.101"); self.Puerto("8085");
     	         //self.IP("jmomparts.no-ip.org"); self.Puerto("8085");
    	       
    	       $('#login').live('pageinit',function()
                {
                    ko.applyBindings(self,document.getElementById('login'));                          
                });
	     	}
	     	
				  
    };   
    self.init();     
   })(jQuery);