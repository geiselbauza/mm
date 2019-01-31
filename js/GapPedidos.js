(function($)
    {
	   var self = $.mobile.GapPedidos = 
	      {
			init : function()
			         {							
  				        
  				        $(document).bind('pageinit',function()
  				                                       {
                 self.transaction
                 (
                 
                   function(tx)
                     {
				    	tx.executeSql('SELECT * FROM USUARIOSa',[],
				    	function(tx,rs){},
				    	function(tx,err){self.createtables()});
				     }
				  );
								                                         
  				   
  				        				                                      				
				                                       }
				                        );
				
				        $('#login').live('pageshow',function()
				                                       {
										                  $('#loguearse').off('click').on('click',function()
								                                                            {
																								alert('Presiono el Boton');
																								//$.mobile.changePage('#listado');																								
																							}
																						 );					
				                                       }
				                        );		
			          }	,
			          
			       		          
			          
				connection : null,
			    
			    openDatabase : function()
			       {
				     
				       self.connection = window.openDatabase("GapPedidos", "1.0", "Pedidos", 50000);
				     			
			       },
			    
			    transaction : function(fn,err,suc)
			                      {
				                     if(self.connection==null)
				                        {
					                       
					                       self.openDatabase();
				                        }
				                     self.connection.transaction(fn);
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
		  	                        tx.executeSql('DROP TABLE IF EXISTS USUARIOS');
		  	                 		tx.executeSql('CREATE TABLE IF NOT EXISTS USUARIOS (codigo VARCHAR(15), descrip VARCHAR(50), clave VARCHAR(15))');			     
				                    tx.executeSql('INSERT INTO USUARIOS (codigo, descrip, clave) VALUES ("001","Super Usuario","12345")');				           

				                  }
				              );		  	                 
				           }
       };	
	    self.init();
    })(jQuery);