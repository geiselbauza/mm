(function($) {
    var self =  $.mobile.ModelListaDocumentos = {

        documentos     : ko.observableArray([]),
        items          : ko.observableArray([]),
        documentotofind: ko.observable(""),
        criterio       : ko.observable(""),
        numd           : ko.observable(""),
        enviarimprimir       : ko.observable(""),
                
        init : function()
			         {	
                       $('#listadocumentos').live('pageinit',function()
                          {
            	              ko.applyBindings(self,document.getElementById('listadocumentos'));                       	      
                          });

                       $('#listadocumentos').live('pageshow',function()
                          {                    	   
                	          self.mostrar();                         	   
                          });                       

                       $('#lista_items').live('pageinit',function()
                          {                    	   
                    	      ko.applyBindings(self,document.getElementById('lista_items'));                    	   
                          }); 
                       
                       $('#lista_items').live('pageshow',function()
                          {    
                              self.asignaritems(self.numd());                         	   
                          });             	
        			 },

                      
       InsertarDocumento: function (numerod, cliente, lineas, total)
         {
    	   this.numerod = ko.observable(numerod);
	       this.cliente = ko.observable(cliente);
	       this.lineas  = ko.observable(lineas);
	       this.total   = ko.observable(total);	       
         },
         
         AgregarDetalle: function (numerod,coditem,descrip,precio,cantidad,descuento, totalitem, detalleprd)
         {
    	   this.numerod = ko.observable(numerod);
	       this.coditem = ko.observable(coditem);
	       this.descrip  = ko.observable(descrip);
	       this.precio   = ko.observable(precio);
	       this.cantidad   = ko.observable(cantidad);
	       this.descuento   = ko.observable(descuento);
	       this.totalitem   = ko.observable(totalitem);
	       this.detalleprd   = ko.observable(detalleprd);
         },

         
       mostrardetalle:  function() 
         {
    	   self.numd(this.numerod());    	      	   
    	   $.mobile.changePage('#lista_items');
	     },
	     
	     borrarpedidodevice : function() {	    	 
	    	 if (confirm("Esta seguro de borrarlo?"))
	    	 {
	    		    self.numd(this.numerod());   
				    self.documentos.remove(this);
				    $.mobile.SqLite.transaction
                 (
                   function(tx)
                     {
                 	    var consulta = "DELETE FROM DOCUMENTOS WHERE NUMEROD = '"+self.numd()+"'";                    	    
	                    tx.executeSql(consulta);
	 	             }
	                  );				    
	    	 }	    	 
			},

	     asignaritems: function(numd){	    	 
	 	    self.items.removeAll();
	         $.mobile.SqLite.transaction
	                  (
	                    function(tx)
	 	                   {
	   				         var consulta = "SELECT * FROM DOCUMENTOS WHERE CODVEND = '"+$.mobile.ModelDocumento.codvend()+"' AND NUMEROD = '"+numd+"'";	   				         
	   				         tx.executeSql(consulta,[],
	 	    	             				function(tx,rs)
	 	    	             				  {
	 	    	             				    if(rs.rows.length >0)
	 	    	             				    {
	 	    	             				    	for(var i=0; i<rs.rows.length;i++){
	 								                   var item = rs.rows.item(i);								                
	                                                   self.items.push(new self.AgregarDetalle(numd,item.coditem,item.descrip,item.precio,item.cantidad,item.descuento,item.totalitem,item.detalleprd));	                                                  
	 								                }
	 	    	             				    }
	 	    	             				  },
	 	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	 	    	             			  );
	 	                   }
	                  ); 
	 	   
	 	   },
	     
	   mostrar: function(){
	    self.documentos.removeAll();	    
        $.mobile.SqLite.transaction
                 (
                   function(tx)
	                   {
  				         var consulta = "";
  				         if (self.criterio()== "4")
                         {  
                            self.enviarimprimir("Imprimir Pedido");				         	
  				            consulta = "SELECT D.NumeroD AS NumeroD, C.CODCLIE AS CODCLIE, C.DESCRIP AS DESCRIP, COUNT(LINEA) AS PRODUCTOS, SUM(TOTALITEM) AS TOTAL FROM DOCUMENTOS D INNER JOIN CLIENTES C ON (D.CODCLIE = C.CODCLIE) WHERE D.CODVEND = '"+$.mobile.ModelDocumento.codvend()+"' GROUP BY NUMEROD";
                         }  				            
  				        else
                         {  				         	
                            self.enviarimprimir("Enviar Pedido");				         	
  				        	consulta = "SELECT D.NumeroD AS NumeroD, C.CODCLIE AS CODCLIE, C.DESCRIP AS DESCRIP, COUNT(LINEA) AS PRODUCTOS, SUM(TOTALITEM) AS TOTAL FROM DOCUMENTOS D INNER JOIN CLIENTES C ON (D.CODCLIE = C.CODCLIE) WHERE D.CODVEND = '"+$.mobile.ModelDocumento.codvend()+"' AND STATUS = '"+self.criterio()+"' GROUP BY NUMEROD"; 
                         }  				            
  				         console.log(consulta);
  				         tx.executeSql(consulta,[],
	    	             				function(tx,rs)
	    	             				  {
	    	             				    if(rs.rows.length >0)
	    	             				    {
	    	             				    	for(var i=0; i<rs.rows.length;i++){
								                var item = rs.rows.item(i); 
								                self.documentos.push(new self.InsertarDocumento(item.NumeroD,item.DESCRIP,item.PRODUCTOS,item.TOTAL));
								                }
	    	             				    }
	    	             				  },
	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	    	             			  );
	                   }
                 ); 
	   
	   },
        
	   EnviarPedido: function(){	
          if (self.criterio()== "4")
	       $.mobile.ModelConfiguracion.ImprimirDocumento(this.numd());
	      else
          {  	   	

		   if ($.mobile.ModelListaDocumentos.criterio() == 1)
		       $.mobile.ModelConfiguracion.EnviarDocumento(this.numd());
		   else
			if (confirm("Pedido enviado previamente, Esta seguro de reenviarlo?"))
				 $.mobile.ModelConfiguracion.EnviarDocumento(this.numd());		      
     	   }
     	    
	   }
	   
    };   
    self.init();     
   })(jQuery);
   
   
                     
   
   
   

	
	    
