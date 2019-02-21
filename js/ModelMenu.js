(function($) {
    var self =  $.mobile.ModelMenu = {

       menuSelec: ko.observable(""),        
       menuPagina: ko.observable(""),
       descripuser: ko.observable(""),
       init : function()
			         {	
			         
			            $('#menu').live('pageinit',function()
                        {
		             	    ko.applyBindings(self,document.getElementById('menu'));
			            	ko.applyBindings(self,document.getElementById('menupedidos'));			            	
                        });
			            
			            $('#menu').live('pageshow',function()
			        	{
			            	$.mobile.ModelLogin.PA('MENU');	
			        	   	$.mobile.ModelTotalizar.totalBrutoGeneral(0);			        	   	
			    			$.mobile.ModelTotalizar.totalDescuentoGeneral(0);			
			    			$.mobile.ModelTotalizar.totalNetoGeneral(0);
			    			$.mobile.ModelTotalizar.totalImponibleGeneral(0);
			    			$.mobile.ModelTotalizar.totalExcentoGeneral(0);
			    			$.mobile.ModelTotalizar.totalIVAGeneral(0);
			    			$.mobile.ModelTotalizar.totalItemGeneral(0);
			    			//$.mobile.ModelCxC.documentospagos.removeAll();
			    			//$.mobile.ModelDocumento.items.removeAll();
			        	});
                     },
        
                    clickMenu: function(data1,data2,event) {
        	    	 self.menuSelec(data1);

        	    	 if ((self.menuSelec() == '1') || (self.menuSelec() == '2') || (self.menuSelec() == '10')) 
                        $.mobile.changePage(data2);
        	    	 if ((self.menuSelec() == '3') || (self.menuSelec() == '5') || (self.menuSelec() == '9'))
                         $.mobile.changePage(data2);
        	    	 if (self.menuSelec() == '6')
        	    		 {
        	    		   $.mobile.ModelListaDocumentos.criterio("1");
        	    		   $.mobile.changePage(data2);
        	    		 }
        	    	 if (self.menuSelec() == '7')
	        	    	 {
	      	    		   $.mobile.ModelListaDocumentos.criterio("2");
	      	    		   $.mobile.changePage(data2);
	      	    		 }
        	    	 if (self.menuSelec() == '8')
	        	    	 {
	      	    		   $.mobile.ModelListaDocumentos.criterio("3");
	      	    		   $.mobile.changePage(data2);
	      	    		 }
	      	    	 if (self.menuSelec() == '11')
	        	    	 {
	      	    		   $.mobile.ModelListaDocumentos.criterio("4");
	      	    		   $.mobile.changePage(data2);
	      	    		 }
        	    	 
        	    	 if (self.menuSelec() == '4')
        	    		  navigator.app.exitApp();  
               	 }
    };   
    self.init();     
   })(jQuery);
   
   
                     
   
   
   

	
	    
