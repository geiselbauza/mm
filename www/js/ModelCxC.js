(function($) {
    var self =  $.mobile.ModelCxC = {
    	
		visibleatras    : ko.observable(false),       
        visibleadelante : ko.observable(false),       
        visiblefooter   : ko.observable(false),
        documentos      : ko.observableArray([]),
        saldo           : ko.observable(0),
        fechav          : ko.observable(0),
        diasv           : ko.observable(0),
        tipodoc         : ko.observable(""),
        numerod         : ko.observable(""),
        cancel          : ko.observable(0),
        desclie         : ko.observable(),
        desccxc         : ko.observable(0),
        documentospagos : ko.observableArray([]),        
        
       init : function()
			         {	
    	   
    	                $('#cantidadcxc').live('pageinit',function()
		                        { 
			            	      self.iniciar();
		                          self.TotalesGenerales();
		                          ko.applyBindings(self, document.getElementById('cantidadcxc'));			                      
	                        });			            
			            
			            $('#descuentocxc').live('pageinit',function()
		                        {
	            	        self.iniciar();
                            self.TotalesGenerales();
			            	        ko.applyBindings(self, document.getElementById('descuentocxc'));		            	        
		                        });
			            
			            $('#totalescxc').live('pageinit',function()
		                        {			          
	            	        self.iniciar();
                            self.TotalesGenerales();
			            	ko.applyBindings(self, document.getElementById('totalescxc'));		            	        
		                        });		            
			            
			            $('#itemspagos').live('pageinit',function()
 		                        {
			            	
			            	        self.iniciar();
			            	
	                                self.TotalesGenerales();	                                	                        
  		            	            ko.applyBindings(self, document.getElementById('itemspagos'));
  		            	          console.log('4444');
		                        });
			            
			          
			            
			            $('#itemspagos').live('pageshow',function()
 		                        {
			            	        //self.iniciar();
			            	
	                                self.TotalesGenerales();
	                        
		                        });
			            
			            
			            $('#montocancelar').live('change',function()
		                        {
			            	       if (self.cancel() > self.saldo())
		            	    	      self.cancel(self.saldo());
		                        });
			            
			            $('#descuento').live('change',function()
		                        {
			            	       if (self.desccxc() > 100)
			            	    	   self.desccxc(0);
		                        });
	                
	                 },

                      
	               iniciar: function(){
	            	   
	            	      self.desclie($.mobile.ModelCliente.clientedescrip());			                      
	                      self.tipodoc($.mobile.ModelInfoCxC.tipodoc());
                          self.numerod($.mobile.ModelInfoCxC.numerod());		                                
                          self.totaldesccxc = ko.computed(function() {
 			    				OSTotal = ko.observable();
 			    				var total = 0;		    				
  	    					    total = (parseFloat(self.cancel()) * parseFloat(self.desccxc())) / 100;			    				
 			    				OSTotal(total);
 			    				return OSTotal().toFixed(2);
 			    			  }, this);
                                       
                          self.subtotalcxc = ko.computed(function() {
 			    				OSTotal = ko.observable();
 			    				var total = 0;		    				
  	    					    total = parseFloat(self.cancel()) - parseFloat(self.totaldesccxc());			    				
 			    				OSTotal(total);
 			    				return OSTotal().toFixed(2);
 			    			  }, this);                       
                      
	               },
	                 
	         		TotalesGenerales : function() {
	         			// TotalBrutoGeneral
	         			self.totalBrutoGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;
	         				ko.utils.arrayForEach(self.documentospagos(), function(w) {
	         					total = total + parseFloat(w.montop());
	         				});
	         				OSTotal(total);
	         				return OSTotal().toFixed(2);
	         			}, this);
	         			
	         			// TotalDescuentoGeneral individual + descuento del cliente
	         			self.totalDescuentoGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;
	         				ko.utils.arrayForEach(self.documentospagos(), function(w) {
	         					total = total + parseFloat(w.deduc1p());
	         				});
	         				OSTotal(total);				
	         				return OSTotal().toFixed(2);
	         			}, this);
	         			
	         			// Total Neto General
	         			self.totalNetoGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;	         				
	         				total =  parseFloat(self.totalBrutoGeneral()) + parseFloat(self.totalDescuentoGeneral());	         				
	         				OSTotal(total);
	         				return OSTotal().toFixed(2);
	         			}, this);
	         			
	         			// TotalImponiblegeneral
	         			self.totalImponibleGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;
	         				total = parseFloat(self.totalNetoGeneral());				
	         				OSTotal(total);
	         				return OSTotal().toFixed(2);
	         			}, this);

	         			
	         			// TotalExcentogeneral
	         			self.totalExcentoGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;
	         				total = 0;	         				
	         				OSTotal(total);
	         				return OSTotal().toFixed(2);
	         			}, this);
	         			
	         			// TotalIVAGeneral 
	         			self.totalIVAGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;
	         				/*ko.utils.arrayForEach(self.items(), function(w) {
	         					total = total + parseFloat(w.ivaParcial());
	         				});*/
	         				OSTotal(total);
	         				return OSTotal().toFixed(2);
	         			}, this);
	         			
	         			// TotalItemGeneral 
	         			self.totalItemGeneral = ko.computed(function() {
	         				OSTotal = ko.observable();
	         				var total = 0;
	         				/*total = parseFloat(self.totalImponibleGeneral()) + parseFloat(self.totalExcentoGeneral()) + parseFloat(self.totalIVAGeneral()) 
	         				/*ko.utils.arrayForEach(self.items(), function(w) {
	         					total = total + parseFloat(w.totalParcial());
	         				});*/
	         			    total = parseFloat(self.totalImponibleGeneral());	         				
	         				OSTotal(total);
	         				return OSTotal().toFixed(2);
	         			}, this);
	         			
	         			$.mobile.ModelTotalizar.totalBrutoGeneral(self.totalBrutoGeneral());
	        			$.mobile.ModelTotalizar.totalDescuentoGeneral(self.totalDescuentoGeneral());			
	        			$.mobile.ModelTotalizar.totalNetoGeneral(self.totalNetoGeneral());
	        			$.mobile.ModelTotalizar.totalImponibleGeneral(self.totalImponibleGeneral());
	        			$.mobile.ModelTotalizar.totalExcentoGeneral(self.totalExcentoGeneral());
	        			$.mobile.ModelTotalizar.totalIVAGeneral(self.totalIVAGeneral());
	        			$.mobile.ModelTotalizar.totalItemGeneral(self.totalItemGeneral());
	        			
	         		},

	                 
                     InsertarDocumento: function (codclie,document,tipodoc,numerod,fechae,fechav,monto,saldo,estatus,dias,cancel)
                     {
            	       this.document = ko.observable(document);
            	       this.tipodoc  = ko.observable(tipodoc);
            	       this.numerod  = ko.observable(numerod);
            	       this.fechae   = ko.observable(fechae);
            	       this.fechav   = ko.observable(fechav);
            	       this.monto    = ko.observable(monto);
            	       this.saldo    = ko.observable(saldo);
            	       this.estatus  = ko.observable(estatus);
            	       this.diasVenc = ko.observable(dias);            	       
            	       this.cancel   = ko.observable(cancel);            	       
                     },
                                              
                     InsertarPagos: function (tipodoc, ndocumentop,montop,deduc1p,totalp)
                     {
                    	 this.tipodoc     = ko.observable(tipodoc);
                    	 this.ndocumentop = ko.observable(ndocumentop);
            	         this.montop      = ko.observable(montop);
            	         this.deduc1p     = ko.observable(deduc1p);
            	         this.totalp      = ko.observable(totalp);            	                   	       
                     }, 
                 	 
                 	clickguardar: function()
	           	     {
                 		//console.log('Tipo Doc: '+self.tipodoc()+', NumeroD: '+self.numerod()+', Cancel: '+self.cancel()+', Descuento: '+self.desccxc()+', SubTotal: '+self.subtotalcxc());
                 		self.documentospagos.push(new self.InsertarPagos(self.tipodoc(),self.numerod(),self.cancel(), self.desccxc(),self.subtotalcxc()));
                 		$.mobile.changePage('#infocxc');
	           	     },
                 	 
                 	PagarCxC:  function() 
                    {
                   	   if (parseFloat(self.totalcancel())>0)                   		
                 		  $.mobile.changePage('#cantidad_pagos');
                	},
                	
                	clickconfirmar : function() {
                		if ($.mobile.ModelTotalizar.totalItemGeneral() > 0 )
                			$.mobile.changePage('#confirmar');

/*            			var numerod = 0;
            			$.mobile.SqLite
            					.transaction(function(tx) {
            						var consulta = 'Select Count(*) + 1 as cantidad From Documentos';
            						tx.executeSql(consulta, [], function(tx, rs) {
            							numerod = rs.rows.item(0).cantidad;
            						}, function(tx, err) {
            							$.mobile.SqLite.error(tx, err)
            						});
            					});
            			
            			$.mobile.SqLite
            					.transaction(function(tx) {
            						var j = 0;

            						ko.utils
            								.arrayForEach(
            										self.items(),
            										function(w) {
            											var sql = 'INSERT INTO DOCUMENTOS(numerod,fechae,linea,coditem,descrip,status,cantidad,codvend,codclie,precio,descuento,totalitem,estaproc) VALUES("'
            													+ numerod
            													+ '",datetime("now","localtime"),?,?,?,?,?,?,?,?,?,?,0)';
            												tx.executeSql(sql, [ j,
            													w.coditem(), w.descrip(),
            													1, w.cantidad(),
            													self.codvend(),
            													self.codclie(), w.precio(),
            													w.descuentoParcial(),
            													w.totalParcial() ]);
            											var sql2 = 'UPDATE PRODUCTOS SET existen = existen - '+w.cantidad() + ' WHERE codigo = "'+w.coditem()+'"';											
            											tx.executeSql(sql2);											    
            											if (j == (self.items().length) - 1) 
            											{
            												alert('Pedido Almacenado en Dispositivo Mobil');
            												self.items.removeAll();											
            												self.codclie("");
            												$.mobile.changePage('#menu');												
            											}
            											j = j + 1;
            										});
            					});*/

            		},

	     
	   
	   Top:10,
	   Skip:0,
	   Total:0, 
	   
	   
	   mostrar: function(){
		   //console.log('Mostrar');
	    self.documentos.removeAll();
        $.mobile.SqLite.transaction
                 (
                   function(tx)
	                   {
	                      var consulta = "SELECT COUNT(codclie) AS cantidad FROM CXC WHERE codclie = '"+$.mobile.ModelDocumento.codclie()+"'";
	                      console.log(consulta);
		                     tx.executeSql(consulta,[],
		    	             				function(tx,rs)
		    	             				  {
		    	             				    self.Total = rs.rows.item(0).cantidad;		    	             				    
		    	             				    if (self.Total> self.Top)
		    	             				    {
		    	             				      self.visiblefooter(true);
		    	             				      self.visibleadelante(true);
		    	             				      self.visibleatras(false);
		    	             				    }
		    	             				    else
		    	             				    {
		    	             				      self.visiblefooter(false);
		    	             				      self.visibleadelante(false);
		    	             				      self.visibleatras(false);
		    	             				    }
		    	             				  },
		    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
		    	             			  );
	                     
		                     
  				         var consulta = "SELECT *, (select Round(julianday('now') - julianday(fechav))) as diasV FROM CxC WHERE codclie = '"+$.mobile.ModelDocumento.codclie()+"' Order By document LIMIT "+self.Top+" OFFSET "+self.Skip;
  				         //console.log(consulta);
	                     tx.executeSql(consulta,[],
	    	             				function(tx,rs)
	    	             				  {
	    	             				    if(rs.rows.length >0)
	    	             				    {
	    	             				     	for(var i=0; i<rs.rows.length;i++)
	    	             				     	{								                
								                  var item = rs.rows.item(i);
				                                  self.documentos.push(new self.InsertarDocumento(item.codclie,item.document, item.tipodoc,item.numerod,item.fechae,item.fechav,item.monto,item.saldo,false,item.diasV,0));
								                }
	    	             				    }
	    	             				    else
	    	             				    {
	    	             				      alert("No Existen Datos...");
	    	             				    }
	    	             				  },
	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	    	             			  );
	                     
	                     var consulta = "SELECT Sum(monto) as TotalCxC FROM CxC WHERE codclie = '"+$.mobile.ModelDocumento.codclie()+"'";  				         
	                     tx.executeSql(consulta,[],
	    	             				function(tx,rs)
	    	             				  {
	    	             				    if(rs.rows.length >0)
	    	             				    {
	    	             				    	 var item = rs.rows.item(0);
	    	             				    	 self.TotalCxC(item.TotalCxC);
	    	             				    }
	    	             				  },
	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	    	             			  );
	                   }
                 ); 
	   
	   },
	     
	    
     
        keyOnEnter: function(data, event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode == 13) {
                        
                self.Skip = 0;
                self.Total = 0;
                self.mostrar(true);              
            }
            return true;
        },
        clickadelante: function(data, event) {
	        if (self.Skip < self.Total)
	         {
	    	   self.visibleatras(true);
	           self.Skip = self.Skip + self.Top;
               if (self.Skip < self.Total-1)
               {
    	           if (self.visibleadelante()==false) 
    	             self.visibleadelante(true)
    	       }
    	       else
    	           self.visibleadelante(false)
	           self.mostrar(false);
	         }
        },
        clickatras: function(data, event) {
            if (self.visibleadelante()==false)
              self.visibleadelante(true);
            if (self.Skip != 0)
              {
	             self.Skip = self.Skip - self.Top;
	               if (self.Skip == 0)
	               {
	                 self.visibleatras(false);
	               }
	                    
	             self.mostrar(false);
	          }
       
        },
        RemoverItem : function() {
			self.documentos.remove(this);			           
		}
    };   
    self.init();     
   })(jQuery);
   
   
                     
   
   
   

	
	    
