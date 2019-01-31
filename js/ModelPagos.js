(function($) {
	var self = $.mobile.ModelPagos = {
			descrip  : ko.observable(""),
			saldo    : ko.observable(0),
			detdoc   : ko.observable(""),
			fecdoc   : ko.observable(""),
			efectivo : ko.observable(0),
			cheque   : ko.observable(0),
			ncheque  : ko.observable(""),		
			vendedor :ko.observable(""),
			itemsPagos    : ko.observableArray([]),		
		
		init : function() {
		    $('#cantidad_pagos').live('pageinit', function() {
		    	console.log('Entro en cantidad pagos');
		    	self.llenarBancos();
		    	self.totalpagos = ko.computed(function() {
    				OSTotal = ko.observable();
    				var total = 0;
    				ko.utils.arrayForEach(self.itemsPagos(), function(w) {
    					total = total +  parseFloat(w.subtotal());    					
    				});
    				OSTotal(total);
    				return OSTotal();
    			}, this);		    	
			});
		    

		    
		    
		    $('#itemspagos').live('pageshow', function() {
		    	console.log('Entro itemspagos pageshow');
		    	console.log('self.itemsPagos()'+self.itemsPagos().length);
		    	    ko.utils.arrayForEach(self.itemsPagos(), function(w) {
    					console.log('Datos: '+w.codclie()+','+w.descrip()+','+w.saldo()+','+w.detdoc()+','+w.efectivo()+','+
    							    w.cheque()+','+w.ncheque()+','+w.subtotal());
    				});
    				
    		});				
								    
		},
		
		llenarBancos: function(){
			$.mobile.SqLite.transaction(function(tx) {
				var consulta = "SELECT CodBanc, Descripcion FROM BANCOS";
				tx.executeSql(consulta, [], function(tx, rs) {
					if (rs.rows.length > 0) {
						for (var i=0; i<rs.rows.length; i++){
						      $('#combobancos').append('<option value="'+rs.rows.item(i).CodBanc+
						        '" class="dropDownBlk">'+rs.rows.item(i).Descripcion+'</option>');
						    }		
					}
				}, function(tx, err) {
					$.mobile.SqLite.error(tx, err)
				});
			});			
		},
		
		
		InsertarPago: function (codclie,descrip,saldo,detdoc,efectivo,cheque,ncheque)
        {
		   this.codclie   = ko.observable($.mobile.ModelDocumento.codclie());
		   this.descrip   = ko.observable(descrip);
	       this.saldo     = ko.observable(saldo);
	       this.detdoc    = ko.observable(detdoc);
	       this.efectivo  = ko.observable(efectivo);
	       this.cheque    = ko.observable(cheque);
	       this.ncheque   = ko.observable(ncheque);
	       this.subtotal  = ko.computed(function() {
		                      calculo = ko.observable();
		                      var c = parseFloat(this.efectivo()) + parseFloat(this.cheque());		         
		                      calculo(c);
		                      return calculo();
	                        }, this); 
        },
        
        clickguardar : function() {
        	self.itemsPagos.push(new self.InsertarPago("orlando",self.descrip(), self.saldo(), self.detdoc(), self.efectivo(),self.cheque(),self.ncheque()));
		   $.mobile.changePage('#items_pagos');
		},
		
		RemoverItem : function() {
			self.itemsPagos.remove(this);
		}	
	};
	self.init();
})(jQuery);