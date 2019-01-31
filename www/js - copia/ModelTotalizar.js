(function($) {
    var self =  $.mobile.ModelTotalizar = {

    		totalBrutoGeneral     : ko.observable(0),
    		totalDescuentoGeneral : ko.observable(0), // este es parcial
        totalDescuentoGlobal  : ko.observable(0),// este es global
        totalDescuentoGlobalP : ko.observable(0),// este es global
    		totalNetoGeneral      : ko.observable(0),
    		totalImponibleGeneral : ko.observable(0),
    		totalExcentoGeneral   : ko.observable(0),
    		totalIVAGeneral       : ko.observable(0),
    		totalItemGeneral      : ko.observable(0),
    		desclie               : ko.observable(0),
    		obsPedidos            : ko.observable(""),
    		itemsformaspago       : ko.observableArray([]),
    		credis                : ko.observable(),
    		divefectivo           : ko.observable(false),
    		divcheque             : ko.observable(false),
    		divtransferencia      : ko.observable(false),
    		divdepobancario       : ko.observable(false),
        moneda                : ko.observable(false),
    		
    		//Generales
    		tipoFP: ko.observable(""),

    		//Caso Efectivo...    		
    		monto                 : ko.observable(0),
    		
    		//Caso Cheque...
    		ncheque               : ko.observable(""),
    		banco                 : ko.observable(""),
    		cedula                : ko.observable(""),
    		telefono              : ko.observable(""),
    		remitente             : ko.observable(""),

    		//Caso Transferencia...
    		nrecibo               : ko.observable(""),
    		
    		//Caso Deposito...
    		ndeposito             : ko.observable(""),
    		
    		bancos : ko.observableArray([
    		                                   { name: "Banesco", lastname: "ollarves" },
    		                                   { name: "BOD", lastname: "paredes" },
    		                                   { name: "Mercantil",  lastname: "gonzalez" }
    		                                             ]),
            banco : ko.observable(),
            
       

    		
    		init : function()
	        {
self.moneda(false);
    	       $('#confirmar').live('pageinit',function()
                {
    	    	   self.credis($.mobile.ModelCliente.clientesaldo());
    	    	   self.montocancelado = ko.computed(function() {
        				OSTotal = ko.observable();
        				var total = 0;
        				ko.utils.arrayForEach(self.itemsformaspago(), function(w) {
        					total = total + parseFloat(w.montoFP());
        				});
        				OSTotal(total);				
        				return OSTotal().toFixed(2);
        			}, this);
    	    	   
    	    	   self.montoporcancelar = ko.computed(function() {
       				OSTotal = ko.observable();
       				var total = 0;
       				total = parseFloat(self.totalItemGeneral()) - parseFloat(self.montocancelado());
       				OSTotal(total);				
       				return OSTotal().toFixed(2);
       			}, this);    	    	   
    	    	  ko.applyBindings(self,document.getElementById('confirmar'));
                });

              $('#confirmar').live('pageshow', function() {
                $.mobile.ModelLogin.posicionpage(3);
			   });
    	       
    	       
    	       $('#items_formas_de_pago').live('pageinit',function()
                {
    	    	   ko.applyBindings(self,document.getElementById('items_formas_de_pago')); 
                });
    	       
    	           	       
    	       $('#formapago').live('pageinit',function()
    	                {
    	    	        	   ko.applyBindings(self,document.getElementById('formapago'));
    	    	        });
    	       $('#cantidad_forma_pagos').live('pageinit',function()
   	                {
    	    	   ko.applyBindings(self,document.getElementById('cantidad_forma_pagos')); 
   	                });    	           	    	    	
    	    },


            keyOnEnterDesc: function(data, event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            var total = 0;
             if (keyCode) {
             console.log(keyCode) ;
             total=(parseFloat(self.totalBrutoGeneral())-parseFloat(self.totalDescuentoGeneral()))*parseFloat(self.totalDescuentoGlobalP())/100;
             self.totalDescuentoGlobal(total.toFixed(2));
             $.mobile.ModelDocumento.TotalesGenerales();
             }
             return true;
             },
    	                                                                                                	    
    	    InsertarFP: function (tipoFP, montoFP,nchequeFP,bancoFP,cedulaFP,telefonoFP,remitenteFP,nreciboFP,ndepositoFP)
            {
    	     var tipo = "";
    	     if (tipoFP == 1) tipo = "Efectivo";
    	     if (tipoFP == 2) tipo = "Cheque";
    	     if (tipoFP == 3) tipo = "Transferencia";
    	     if (tipoFP == 4) tipo = "Depo. Bancario";
           	 this.tipoFP            = ko.observable(tipo);
           	 this.montoFP           = ko.observable(montoFP);
   	         this.nchequeFP         = ko.observable(nchequeFP);
   	         this.bancoFP           = ko.observable(bancoFP);
   	         this.cedulaFP          = ko.observable(cedulaFP);            	                   	       
   	         this.telefonoFP        = ko.observable(telefonoFP);
	         this.remitenteFP       = ko.observable(remitenteFP);
	         this.nreciboFP         = ko.observable(nreciboFP);
	         this.ndepositoFP       = ko.observable(ndepositoFP);	         
            }, 
            
            clickguardar: function()
      	     {
            	//console.log(self.tipoFP()+'  '+self.monto()+'  '+self.ncheque()+'  '+self.banco()+'  '+self.cedula()+'  '+self.telefono()+'  '+self.remitente()+'  '+self.nrecibo()+'  '+self.ndeposito());
            	var calculo = parseFloat(self.montocancelado()) + parseFloat(self.monto()); 
            	if (calculo <= self.totalItemGeneral())
            		{
        		       self.itemsformaspago.push(new self.InsertarFP(self.tipoFP(),self.monto(),self.ncheque(),self.banco(),self.cedula(),self.telefono(),self.remitente(),self.nrecibo(),self.ndeposito()));
        		       $.mobile.changePage('#formapago');
            		}
            	else
            		{
            		   alert('Monto Adeudado es Superado...');
            		   $.mobile.changePage('#formapago');
            		}
            	self.limpiarcampos();
        		
      	     },
      	     
      	     limpiarcampos:function(){
      	    	self.tipoFP("");
      	    	self.monto(0);
        		  self.ncheque("");
        		  self.banco("");
        		  self.cedula("");
        		  self.telefono("");
        		  self.remitente("");
        		  self.nrecibo("");
        		  self.ndeposito("");
        		  self.obsPedidos("");
              self.totalDescuentoGeneral(0);
              self.totalDescuentoGlobal(0);
              self.moneda(false);

      	     },

	     	clickconfirmar : function(){	
	     		console.log('entro');
	     		if ($.mobile.ModelMenu.menuSelec() == 1){
    			    $.mobile.ModelDocumento.guardarDispositivo();
   				    self.limpiarcampos();
   				    $.mobile.changePage('#menu');
	     		}
   			    
   			    if ($.mobile.ModelMenu.menuSelec() == 2){
   			    	$.mobile.changePage('#formapago');
   			    }
	     	},
	     	
	     	guardartodo : function(){	     		
	     	    $.mobile.ModelDocumento.guardarDispositivo();
   				self.limpiarcampos();
   			    $.mobile.changePage('#menu');	     			
	     	},
	     	
	     	clickatras : function(){
	     		self.limpiarcampos();
	     		if ($.mobile.ModelMenu.menuSelec() == 1)
     			    $.mobile.changePage('#items');
	     		if ($.mobile.ModelMenu.menuSelec() == 2)
     			    $.mobile.changePage('#infocxc');
	     	},
	     	
	     	pagar: function(tipo){
	     		self.tipoFP(tipo);
	     		if (tipo == '1'){	     			
	     			self.divefectivo(true);
	        		self.divcheque(false);
	        		self.divtransferencia(false);
	        		self.divdepobancario(false);
	     		}
	     		if (tipo == '2'){
	     			self.divefectivo(false);
	        		self.divcheque(true);
	        		self.divtransferencia(false);
	        		self.divdepobancario(false);
	     		}
	     		if (tipo == '3'){
	     			self.divefectivo(false);
	        		self.divcheque(false);
	        		self.divtransferencia(true);
	        		self.divdepobancario(false);
	     		}
	     		if (tipo == '4'){
	     			self.divefectivo(false);
	        		self.divcheque(false);
	        		self.divtransferencia(false);
	        		self.divdepobancario(true);
	     		}
	     		$.mobile.changePage('#cantidad_forma_pagos');
	     		
	     	},
	     	RemoverItem : function() {
				self.itemsformaspago.remove(this);			           
			},

   	        CargaCliente: function(){

               $.mobile.changePage('#infocxc');
            }
	     	
				  
    };   
    self.init();     
   })(jQuery);
