(function($) {
    var self =  $.mobile.ModelProducto = {

        productos: ko.observableArray([]),
        productotofind: ko.observable(""),
        esinfo:  ko.observable(false),
        desclie: ko.observable(""),
        codigo:  ko.observable(""),
        descrip: ko.observable(""),
        unidad:  ko.observable(""),
        existen: ko.observable(""),        
        costact: ko.observable(""),
        p1:  ko.observable(""), p2:  ko.observable(""),  p3:  ko.observable(""),
        p1i: ko.observable(""),p2i: ko.observable(""),p3i: ko.observable(""),
        visp1: ko.observable(true),
        visp2: ko.observable(true),
        visp3: ko.observable(true),
        ivaproducto: ko.observable(""),
        cfob:    ko.observable(""),
	    factor:  ko.observable(""),
	    viscosto:  ko.observable(false),

        
        //p1iva:  ko.observable(""), p2iva:  ko.observable(""),  p3iva:  ko.observable(""),        
        visibleatras: ko.observable(false),       
        visibleadelante: ko.observable(false),       
        visiblefooter: ko.observable(false),        
        init : function()
			         {	
				       	 $('#infoproductos').live('pageinit',function(){
 				       		    self.desclie($.mobile.ModelCliente.clientedescrip());
  	                            ko.applyBindings(self,document.getElementById('infoproductos'));
  	                            ko.applyBindings(self,document.getElementById('verproducto'));
  	                        });
        	             $('#infoproductos').live('pageshow',function(){

           	            	   self.InicializarPaginacion();
                               self.desclie($.mobile.ModelCliente.clientedescrip());
                               $.mobile.ModelLogin.posicionpage(1); 

        	            	   if ($.mobile.ModelMenu.menuSelec() == "9")
      				    		 self.esinfo(false);
        	            	   else
        	            		   self.esinfo(true);
       	                    });

				       	 $('#infoproductosmain').live('pageinit',function(){
 				       		    self.desclie($.mobile.ModelCliente.clientedescrip());
                                ko.applyBindings(self,document.getElementById('infoproductosmain'));
  	                            ko.applyBindings(self,document.getElementById('verproducto'));
  	                        });
        	             $('#infoproductosmain').live('pageshow',function(){

           	            	   self.InicializarPaginacion();
                               self.desclie($.mobile.ModelCliente.clientedescrip());

        	            	   if ($.mobile.ModelMenu.menuSelec() == "9")
      				    		 self.esinfo(false);
        	            	   else
        	            		   self.esinfo(true);
       	                    });



        	             $('#busqproducto').live('pageinit',function()
       	                        {
       	                            ko.applyBindings(self,document.getElementById('busqproducto'));                          
       	                        });
  	        		 },


    	   CargaCliente: function(){

             $.mobile.changePage('#infocxc');
  	   },


               
  	   InicializarPaginacion: function(){
  		 self.Top=6;
  	     self.Skip=0;
  	     self.Total=0;  
  	     //self.productos.removeAll();
	     self.productotofind("");
	     self.visibleatras(false);       
	     self.visibleadelante(false);       
	     self.visiblefooter(false);
  	   },
  	   
  		CalcularPrecioconIVA : function() {
  		  self.precio1iva = ko.computed(function() {
 				calculo = ko.observable();
 				var c = self.p1()+(self.p1()*self.ivaproducto()/100);
 				calculo(c);
 				return calculo().toFixed(2);
 			}, this );
		},

       InsertarProducto: function (codigo, descrip, precio1, precio2, precio3, iva, existen, costact)
         {
	       this.codigo = ko.observable(codigo);
	       this.existen = ko.observable(existen);
	       this.descrip = ko.observable(descrip);
	       this.precio1 = ko.observable(precio1);
	       this.precio2 = ko.observable(precio2);
	       this.precio3 = ko.observable(precio3);
	       this.iva = ko.observable(iva);
	       

           if (($.mobile.ModelLogin.preciovend1()==-1) &&
				($.mobile.ModelLogin.preciovend2()==-1) &&
				($.mobile.ModelLogin.preciovend3()==-1))
				{
        	      this.visp1 = ko.observable(true);
        	      this.visp2 = ko.observable(true);
        	      this.visp3 = ko.observable(true);
				 }
			
			if ($.mobile.ModelLogin.preciovend1()==1){  
				this.visp1 = ko.observable(true);
			
				}
			if ($.mobile.ModelLogin.preciovend2()==1){
				this.visp2 = ko.observable(true);
			    }
			if ($.mobile.ModelLogin.preciovend3()==1){  
				this.visp3 = ko.observable(true);
			
			    }

	       this.costact = ko.observable(costact);
	       if (($.mobile.ModelLogin.nivel() == '01') || ($.mobile.ModelLogin.nivel() == '02'))
	           this.viscosto = ko.observable(true);
	       else
	    	   this.viscosto = ko.observable(false);
	    	       
         },
       

       AsignarProducto:  function() 
         {
    	    // Campos para pantalla detalle de productos...	       
				       self.descrip(this.descrip());
				       self.codigo(this.codigo());
				       self.unidad("");
				       self.existen(this.existen());	              
				       self.costact(this.costact());
				       self.p1(this.precio1());self.p2(this.precio2());self.p3(this.precio3());
				       self.ivaproducto(this.iva());
				        ///////
				        calculo = ko.observable();
			 			var c = self.p1()+(self.p1()*self.ivaproducto()/100);
			 			calculo(c);
			 			self.p1i(calculo().toFixed(2));
			 			///////
			 			c = self.p2()+(self.p2()*self.ivaproducto()/100);
			 			calculo(c);
			 			self.p2i(calculo().toFixed(2));
			 		    ///////
			 			c = self.p3()+(self.p3()*self.ivaproducto()/100);
			 			calculo(c);
			 			self.p3i(calculo().toFixed(2));
			 			
			 			
			 			
			 			
			 			
			 		   self.cfob("");
				       self.factor("");
				       
				       
				       self.visp1(false);self.visp2(false);self.visp3(false);

			           if (($.mobile.ModelLogin.preciovend1()==-1) &&
							($.mobile.ModelLogin.preciovend2()==-1) &&
							($.mobile.ModelLogin.preciovend3()==-1))
							{
							  self.visp1(true);self.visp2(true);self.visp3(true);
							 }
						
						if ($.mobile.ModelLogin.preciovend1()==1){  
							self.visp1(true);
						
							}
						if ($.mobile.ModelLogin.preciovend2()==1){
							self.visp2(true);
						    }
						if ($.mobile.ModelLogin.preciovend3()==1){  
							self.visp3(true);
						
						    }

				       if (($.mobile.ModelLogin.nivel() == '01') || ($.mobile.ModelLogin.nivel() == '02'))
				    	   self.viscosto(true);
				       else
				    	   self.viscosto(false);

				       ///////////////////////
    	   
    	   $.mobile.ModelDocumento.codprod(this.codigo());    	   
    	   $.mobile.ModelDocumento.InsertarItemProducto(this.codigo(),this.descrip(),this.precio1(),this.precio2(),this.precio3(),this.iva(),0,this.precio1(),this.existen(),self.p1i(),self.p2i(),self.p3i());    	    
    	   if ($.mobile.ModelMenu.menuSelec()=='9'){
    		   $.mobile.changePage('#verproducto');
    		   return 0;
    	   }
    	   if ($.mobile.ModelLogin.TipoCarga()=='2')
    		   {
    		     $.mobile.changePage('#IngresoManual');
    		     $.mobile.ModelDocumento.mostrarDescripcion();
    		   }
    	   else{
    		   if ($.mobile.ModelLogin.itemspedido() == -1 )
      		     $.mobile.changePage('#cantidad');
    		   else
    		     if ($.mobile.ModelDocumento.items().length < $.mobile.ModelLogin.itemspedido())
    		    	 $.mobile.changePage('#cantidad');
    		     else
    		    	 alert('Alcanzo el limite de items por pedido');
    	   }    	           		
	     },

	   Top:6,
	   Skip:0,
	   Total:0, 
	   
	   mostrar: function(esenter){		   
	    self.productos.removeAll();	
	    var clientetofindstr = "";
	    productotofindstr =  self.productotofind() + "*";
        $.mobile.SqLite.transaction
                 (
                   function(tx)
	                   {
                	   productotofindstr = productotofindstr.replace(/\*/g,"%");
             	   	     self.productotofind(productotofindstr);
                         if (esenter)
                          {                        	                         	
                   	   	     if ($.mobile.ModelLogin.ModoWEB() == true)
                        	 $.mobile.ModelConfiguracion.clickOpcion('PRODUCTOS',self.productotofind()); 
                             var consulta = "SELECT COUNT(CODIGO) AS cantidad FROM PRODUCTOS WHERE CODIGO LIKE '%"+self.productotofind()+"%' OR DESCRIP LIKE '%"+self.productotofind()+"%' ";                	  				        
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
                          }                          	                     	                   
		  				         var consulta = "SELECT * FROM PRODUCTOS WHERE CODIGO LIKE '%"+self.productotofind()+"%' OR DESCRIP LIKE '%"+self.productotofind()+"%' Order By DESCRIP LIMIT "+self.Top+" OFFSET "+self.Skip;
		  				        //console.log(productotofindstr);
		  				        productotofindstr = productotofindstr.replace(/\%/g,"*");
		  				        productotofindstr = productotofindstr.substring(0, productotofindstr.length-1);
		  			    	    self.productotofind(productotofindstr);
		  				         //console.log(consulta);
			                     tx.executeSql(consulta,[],
			    	             				function(tx,rs)
			    	             				  {
			    	             				    if(rs.rows.length >0)
			    	             				    {
			    	             				    	console.log(self.Total);
			    	             				    	for(var i=0; i<rs.rows.length;i++){								                
										                var item = rs.rows.item(i);
		                                                 self.productos.push(new self.InsertarProducto(item.codigo,item.descrip,item.precio1,item.precio2,item.precio3,item.iva,item.existen,item.costact));
										                }
			    	             				    }
			    	             				    else
			    	             				    {
			    	             				      alert("No Existen Datos...");
			    	             				    }
			    	             				  },
			    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
			    	             			  );
                          		                                 
	                   }); // Fin Transaccion 
	   
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
        clicksalir : function() {
	    	 if (confirm("Pedido en curso, desea abandonar"))
	    	 {
	    		 $.mobile.ModelDocumento.items.removeAll();
	    		 $.mobile.changePage('#menu');
	    	 }
        }        
    };   
    self.init();     
   })(jQuery);
   
   
                     
   
   
   

	
	    
