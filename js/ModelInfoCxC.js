(function($) {
    var self =  $.mobile.ModelInfoCxC = {

        cxc             : ko.observableArray([]),
        cxctofind       : ko.observable(""),
        cliente         : ko.observable(""),
        represent       : ko.observable(""),
        TotalCxC        : ko.observable(""),
        descrip         : ko.observable(0),		
		detdoc          : ko.observable(""),
		fecdoc          : ko.observable(""),
		efectivo        : ko.observable(0),
		cheque          : ko.observable(0),
		ncheque         : ko.observable(""),		
		vendedor        : ko.observable(""),        
		diasv		    : ko.observable(""),
		tipodoc		    : ko.observable(""),
		numerod		    : ko.observable(""),
        limitecred      : ko.observable(""),
    	saldo           : ko.observable(0),
        diascred        : ko.observable(0),
		items           : ko.observableArray([]),
        visibleatras: ko.observable(false),
        visibleadelante: ko.observable(false),
        visiblefooter: ko.observable(false),
        init : function()
			         {	 
        	             $('#infocxc').live('pageinit',function()  {


                             self.TotalCxCF = ko.computed(function() {
 			    				OSTotal = ko.observable();
 			    				var total = 0;		    				
  	    					    total = parseFloat(self.TotalCxC());			    				
 			    				OSTotal(total);
 			    				return OSTotal().toFixed(2);
 			    			  }, this);
 			            	
 			            	self.totalcancel = ko.computed(function() {
 			    				OSTotal = ko.observable();
 			    				var total = 0;
 			    				ko.utils.arrayForEach(self.cxc(), function(w) {
 			    				if (w.estatus() == true) 
 			    					w.cancel(w.saldo())
 			    				
 			    				if (w.cancel() > w.saldo())
 			            	       {
 			            	         total = total + 0;
 			            	         w.cancel(0);
 			            	       }
 			            	    else
 			    					total = total + parseFloat(w.cancel());
 			    				});
 			    				OSTotal(total);
 			    				return OSTotal().toFixed(2);
 			    			}, this); 			              	
 			            	ko.applyBindings(self,document.getElementById('infocxc')); 			            	 			            	
  	                        });
        	             
        	             $('#lista_items_CxC').live('pageinit',function()
                                 {                    	   
                           	      ko.applyBindings(self,document.getElementById('lista_items_CxC'));                    	   
                                 });
        	             
        	             $('#infocxc').live('pageshow',function(){
        	            	 self.mostrar();
        	             });        	             
  	        		 },

                      
		Insertarcxc: function (codclie,document,tipodoc,numerod,fechae,fechav,monto,saldo,estatus,dias,cancel)
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
       
         
       AsignarCxC:  function()
         {    	   
           self.tipodoc(this.tipodoc());
    	   self.numerod(this.numerod());
    	   self.saldo(this.saldo());    	   
    	   $.mobile.ModelCxC.numerod(this.numerod());
    	   $.mobile.ModelCxC.saldo(self.saldo());
    	   $.mobile.ModelCxC.cancel(self.saldo());
    	   $.mobile.ModelCxC.fechav(this.fechav());
    	   $.mobile.ModelCxC.diasv(this.diasVenc());
    	   $.mobile.changePage('#cantidadcxc');    	   
	     },
	     
	     DetallarCxC:  function() 
         {
    	   self.numerod(this.numerod());
    	   self.LlenarItemCxC(self.numerod());
    	   $.mobile.changePage('#lista_items_CxC');    	   
	     },
	     
	     clickguardar: function()
	     {
	    	 
	     },

	   Top:3,
	   Skip:0,
	   Total:0, 

	   mostrar: function(){
            self.cliente($.mobile.ModelCliente.clientedescrip());
            self.represent($.mobile.ModelCliente.clienterepresent());
            self.limitecred($.mobile.ModelCliente.clientelimitecred());
            self.diascred($.mobile.ModelCliente.diascred());
		    self.cxc.removeAll();
	        $.mobile.SqLite.transaction
	                 (
	                   function(tx)
		                   {
		                      var consulta = "SELECT COUNT(codclie) AS cantidad FROM CXC WHERE codclie = '"+$.mobile.ModelCliente.clientecodigo()+"'";	                	        
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
		                     
			                     
	  				         var consulta = "SELECT *, strftime('%d-%m-%Y',fechae) as fe, strftime('%d-%m-%Y',fechav) as fv, (select Round(julianday('now') - julianday(fechav))-1) as diasV FROM CxC WHERE codclie = '"+$.mobile.ModelCliente.clientecodigo()+"' Order By document LIMIT "+self.Top+" OFFSET "+self.Skip;				         
	  				         tx.executeSql(consulta,[],
		    	             				function(tx,rs)
		    	             				  {
		    	             				    if(rs.rows.length >0)
		    	             				    {
		    	             				     	for(var i=0; i<rs.rows.length;i++)
		    	             				     	{								                
									                  var item = rs.rows.item(i);
					                                  self.cxc.push(new self.Insertarcxc(item.codclie,item.document, item.tipodoc,item.numerod,item.fe,item.fv,item.monto,item.saldo,false,item.diasV,0));
									                }
		    	             				    }
		    	             				    else
		    	             				    {
		    	             				      alert("No Existen Datos...");
		    	             				    }
		    	             				  },
		    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
		    	             			  );
		                     
		                     var consulta = "SELECT Sum(saldo) as TotalCxC FROM CxC WHERE codclie = '"+$.mobile.ModelCliente.clientecodigo()+"'";	  				         
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
        
        AgregarDetalle: function (descrip,cantidad,precio,totalitem)
        {
   	       this.descrip    = ko.observable(descrip);	       
   	       this.cantidad   = ko.observable(cantidad);
   	       this.precio     = ko.observable(precio);
   	       this.totalitem  = ko.observable(totalitem);
        },


        clicksalir : function() {

                if ($.mobile.ModelMenu.menuSelec() == '1')
                {
                  if ($.mobile.ModelLogin.posicionpage() == '1')
	    		    $.mobile.changePage('#infoproductos');
                  if ($.mobile.ModelLogin.posicionpage() == '2')
	    		    $.mobile.changePage('#items');
                  if ($.mobile.ModelLogin.posicionpage() == '3')
	    		    $.mobile.changePage('#confirmar');
                }
                else
                     $.mobile.changePage('#infoclientes');

        },

		LlenarItemCxC : function(numerod) {
			self.items.removeAll();
			$.mobile.SqLite.transaction
            (
              function(tx)
                  {
    				var consulta = "select * from itemsCxC  where numerod = '"+numerod+"'";			                                                         
					console.log(consulta);
				         tx.executeSql(consulta,[],
		            				function(tx,rs)
		            				  {
		            				    if(rs.rows.length >0)
		            				    {
		            				     	for(var i=0; i<rs.rows.length;i++)
		            				     	{								                
							                  var item = rs.rows.item(i);							                  
							                  self.items.push(new self.AgregarDetalle(item.descrip,item.cantidad,item.precio,item.totalitem));
							                }
		            				    }
		            				    else
		            				    {
		            				      alert("Este documento no tiene detalles...");
		            				    }
		            				  },
		            				function(tx,err){$.mobile.SqLite.error(tx,err)}
		            			  );
                  }
              );
		}    
    };   
    self.init();     
   })(jQuery);
   
   
                     
   
   
   

	
	    
