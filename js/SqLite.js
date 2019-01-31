(function($)
    {
	   var self = $.mobile.SqLite = 
	      {
	      
				connection : null,
			    
			    openDatabase : function()
			    {
				     
				       self.connection = window.openDatabase("GapPedidos", "1.0", "Pedidos", 5000000);
				     			
			    },
			    
			    transaction : function(fn,err,suc)
			                      {								    
				                     if(self.connection==null)
				                        {
					                        self.openDatabase();					                        
				                        }
				                     self.connection.transaction(fn,self.errorCB,self.successCB);				                     
			                      },
			                      
               errorCB: function (err) 
                 {
                    //$.mobile.loading( 'hide');
                    console.log('Error!!!: '+err);                      
                 },
               successCB: function () 
                 {
                    //$.mobile.loading( 'hide');
                 },		                      

			
				error : function(tx,err)
				           {
						        console.error('Error!!!',err);						        
						    	alert('Se ha producido un error: ' + err.message)
						   },
						   
						   
				createtables : function()
				           {
                             self.transaction
                              (
                                function(tx)
                                  {
                                	
		  	                        tx.executeSql("DROP TABLE IF EXISTS USUARIOS");
		  	                 		tx.executeSql("CREATE TABLE IF NOT EXISTS USUARIOS (codigo VARCHAR(15), descrip VARCHAR(50), clave VARCHAR(15), codvend VARCHAR(15), preciovend1 INTEGER, preciovend2 INTEGER, preciovend3 INTEGER, precli INTEGER, negativo INTEGER, descuento INTEGER, nivel VARCHAR(4), items INTEGER, autorizacredito INTEGER)");			     
				                    tx.executeSql("INSERT INTO USUARIOS (codigo, descrip, clave,codvend,preciovend1,preciovend2,preciovend3,precli,negativo,descuento,nivel,items,autorizacredito) VALUES ('001','Super Usuario','12345','001',1,1,1,1,1,0,'01',1000,1)");				           
				                    
				                    tx.executeSql('DROP TABLE IF EXISTS CLIENTES');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS CLIENTES (CodClie VARCHAR(15), Descrip VARCHAR(70), ID3 VARCHAR(50), CodZona VARCHAR(15), CodVend VARCHAR(15), LimiteCred NUMERIC(28,3), DiasCred INTEGER, Saldo NUMERIC(28,3), MtoMaxCred NUMERIC(28,3), Descto NUMERIC(28,3), TipoPVP INTEGER, DiasTole INTEGER,Represent VARCHAR(40))');
				                    
				                    tx.executeSql('DROP TABLE IF EXISTS PRODUCTOS');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS PRODUCTOS (codigo VARCHAR(15), descrip VARCHAR(50), precio1 NUMERIC(10,3), precio2 NUMERIC(10,3), precio3 NUMERIC(10,3), iva NUMERIC(10,3), existen NUMERIC(10,3), costact NUMERIC(10,3))');
				                    
						    		tx.executeSql('DROP TABLE IF EXISTS PRECIOS');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS PRECIOS (codigo VARCHAR(15), precio1 NUMERIC(10,3), precio2 NUMERIC(10,3), precio3 NUMERIC(10,3), Iva NUMERIC(10,3))');
				                    
						    		tx.executeSql('DROP TABLE IF EXISTS IMAGEN');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS IMAGEN (codigo VARCHAR(15), imagen text)');


				                    tx.executeSql('DROP TABLE IF EXISTS CxC');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS CxC (codclie VARCHAR(15), document VARCHAR(40), tipodoc VARCHAR(40), numerod VARCHAR(40), fechae VARCHAR(40), fechav VARCHAR(40), monto NUMERIC(10,3), saldo NUMERIC(10,3))');

				                    tx.executeSql('DROP TABLE IF EXISTS ItemsCxC');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS ItemsCxC (numerod VARCHAR(40),descrip VARCHAR(100), cantidad NUMERIC(10,3), totalitem NUMERIC(10,3), coditem VARCHAR(15), precio NUMERIC(10,3), tipodoc VARCHAR(40))');

		  	                        tx.executeSql('DROP TABLE IF EXISTS BANCOS');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS BANCOS (CodBanc VARCHAR(30), Descripcion VARCHAR(60))');
		  	                 		
		  	                 		tx.executeSql('DROP TABLE IF EXISTS DOCUMENTOS');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS DOCUMENTOS (tipodoc VARCHAR(1), numerod VARCHAR(50), fechae VARCHAR(50), linea INTEGER, coditem VARCHAR(15), descrip VARCHAR(150), status INTEGER, cantidad NUMERIC(10,3), codvend VARCHAR(15), codclie VARCHAR(15), precio NUMERIC(10,3), descuento NUMERIC(10,3), totalitem NUMERIC(10,3), estaproc INTEGER, observacion VARCHAR(500),codubic VARCHAR(10),detalleprd VARCHAR(360),descuentog NUMERIC(10,3),esCC INTEGER)');

		  	                 	    tx.executeSql('DROP TABLE IF EXISTS DATOSP');
		  	                 		tx.executeSql('CREATE TABLE DATOSP (direccion VARCHAR(70), puerto INTEGER, tipocarga INTEGER, tipocon INTEGER,vendernegativo VARCHAR(2),coddepo VARCHAR(10), tieneimpreso INTEGER, verimagen INTEGER)');
		  	                 	    tx.executeSql('INSERT INTO DATOSP (direccion,puerto,tipocarga,tipocon,vendernegativo,coddepo,tieneimpreso, verimagen) VALUES ("localhost","8085",1,0,"no","",0,0)');
				                  }
				              );		  	                 
				           }
       };
    })(jQuery);