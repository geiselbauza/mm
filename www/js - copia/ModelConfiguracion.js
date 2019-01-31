(function($) {
	var a=null;
	var self = $.mobile.ModelConfiguracion = {
		CountCxC: ko.observable(""),
		CountProductos: ko.observable(""),
		CountClientes: ko.observable(""),
		CountPrecios:ko.observable(""),	
		CountImagen:ko.observable(""),		
		init: function() {

			$('#recibir').live('pageinit', function() {
				ko.applyBindings(self, document.getElementById('recibir'));
			});
			$('#enviar').live('pageinit', function() {
				ko.applyBindings(self, document.getElementById('enviar'));
			});			
			$('#recibir').live('pageshow', function() {
				self.getCounts();
			});
		},
		
       	getCounts : function() {       		
        	   $.mobile.SqLite.transaction(function(tx) {
 				var consulta = "select * from ((select COUNT(*) AS PRODUCTOS from PRODUCTOS),(select COUNT(*) AS CLIENTES from clientes),(select COUNT(*) AS CxC from CxC)) t";
 				tx.executeSql(consulta, [], function(tx, rs) {				
 				self.CountClientes(rs.rows.item(0).CLIENTES);				
 				self.CountCxC(rs.rows.item(0).CxC);
 				self.CountProductos(rs.rows.item(0).PRODUCTOS);
				self.CountImagen(rs.rows.item(0).IMAGEN);
				
 				}, function(tx, err) {
 					$.mobile.SqLite.error(tx, err)
 				});
 			});			
 		},

		
		
		clickTodos: function(tabla) {
			if(tabla == 'TODOS') {				
				self.clickOpcion('CxC','');
				self.clickOpcion('PRODUCTOS','');				 
				self.clickOpcion('PRECIOS','');
				self.clickopcion('IMAGEN','');
				self.clickOpcion('USUARIOS','');
				self.clickOpcion('Clientes','');
				self.clickOpcion('BANCOS','');
				//self.clickOpcion('Configuracion','');
			}
		},
		grabarABD: function(data,tabla){
			N = data.length;
			$.mobile.SqLite.transaction(
			function(tx) {		
				var sql = "";
				if (tabla != 'Configuracion'){					
					sql = "DELETE FROM " + tabla;
					tx.executeSql(sql);
				}
				if (tabla == 'CxC'){					
					sql = "DELETE FROM ItemsCxC";
					tx.executeSql(sql);
				}
				$.each(data, function(i, item) {
				  			var sql = "";				  			
				  			    if (tabla == 'Configuracion'){	
				  				  sql="UPDATE DATOSP SET vendernegativo = '"+item.ventasnegativo+"'";
				  				  tx.executeSql(sql);
				  			    }
				  			    
								if(tabla == 'PRODUCTOS') {
									console.log(item.CodProd+','+item.Descrip+','+item.Precio1+','+item.Precio2+','+item.Precio3+','+item.iva+','+item.existen);
									sql = "INSERT INTO PRODUCTOS (codigo, descrip, precio1, precio2, precio3, iva, existen, costact) VALUES (?,?,?,?,?,?,?,?)";
									tx.executeSql(sql, [item.CodProd, item.Descrip, item.Precio1, item.Precio2, item.Precio3, item.iva, item.existen, item.costact]);
									self.CountProductos(N);
								}

								if(tabla == 'PRECIOS') {
									console.log(item.CodProd);
									sql = "UPDATE PRODUCTOS SET precio1= ?,precio2= ?,precio3= ?,Iva=? where codigo = ?";
									tx.executeSql(sql, [item.Precio1, item.Precio2, item.Precio3, item.Iva,item.CodProd]);
									//sql = "INSERT INTO PRECIOS (codigo,  precio1, precio2, precio3, Iva) VALUES (?,?,?,?,?)";
									//tx.executeSql(sql, [item.CodProd,  item.Precio1, item.Precio2, item.Precio3, item.Iva]);
									self.CountPrecios(N);
								}
								if(tabla == 'IMAGEN') {
									console.log(item.CodProd+', '+item.Imagen64);
									sql = "insert into IMAGEN (codigo,imagen) values (?,?)";
									tx.executeSql(sql, [item.CodProd,item.Imagen64 ]);
									//sql = "INSERT INTO PRECIOS (codigo,  precio1, precio2, precio3, Iva) VALUES (?,?,?,?,?)";
									//tx.executeSql(sql, [item.CodProd,  item.Precio1, item.Precio2, item.Precio3, item.Iva]);
									self.CountPrecios(N);
								}

								
								if(tabla == 'CxC') {									
									sql = "INSERT INTO CxC (codclie, document, tipodoc, numerod, fechae, fechav, monto, saldo) VALUES (?,?,?,?,?,?,?,?)";
									tx.executeSql(sql, [item.CodClie, item.Documento, item.TipoDoc, item.NumeroD, item.FechaE, item.FechaV, item.Monto, item.Saldo]);									
									if (item.itemsCxC != null){
									if (item.itemsCxC.length>0){
										for(var a = 0;a <= item.itemsCxC.length-1;a++)
										{
										  var itemA = item.itemsCxC[a];
										  sql = "INSERT INTO ItemsCxC (numerod, descrip, cantidad, totalitem, coditem, precio, tipodoc) VALUES (?,?,?,?,?,?,?)";
	 								      tx.executeSql(sql, [itemA.numerod, itemA.descrip, itemA.cantidad, itemA.totalitem, itemA.coditem, itemA.precio, itemA.tipodoc]);								      								      
										}
									}
									}									
									self.CountCxC(N);
								}

								if(tabla == 'USUARIOS') {
									sql = "INSERT INTO USUARIOS  (codigo, descrip, clave,codvend,preciovend1,preciovend2,preciovend3,precli,negativo,descuento,nivel,items,autorizacredito) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";								
									tx.executeSql(sql, [item.CodUsua, item.Descrip, item.Clave, item.CodVend, item.PrecioVend1,item.PrecioVend2,item.PrecioVend3,item.Prevalece, item.Negativo, item.Descuento, item.Nivel, item.Items, item.AutorizaCredito]);
								}

								if(tabla == 'CLIENTES') {
									//console.log(item.CodClie+', '+item.Descrip+', '+ item.ID3+', '+item.CodZona+', '+item.CodVend+', '+item.LimiteCred+', '+item.DiasCred+', '+item.Saldo+', '+item.MtoMaxCred+', '+item.Descto+', '+item.TipoPVP);
								   	sql = "INSERT INTO CLIENTES  (CodClie, Descrip, ID3, CodZona, CodVend, LimiteCred, DiasCred, Saldo, MtoMaxCred, Descto, TipoPVP,DiasTole,Represent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
								   	tx.executeSql(sql, [item.CodClie, item.Descrip, item.ID3, item.CodZona, item.CodVend, item.LimiteCred, item.DiasCred, item.Saldo, item.MtoMaxCred, item.Descto, item.TipoPVP,item.DiasTole,item.Represent]);
									self.CountClientes(N);
								}
								if(tabla == 'BANCOS') {
									sql = "INSERT INTO BANCOS (CodBanc, Descripcion) VALUES (?,?)";
									tx.executeSql(sql, [item.CodBanc, item.Descripcion]);
								}							
								$('.ui-loader h1').text('Total: ' + N);								
								//if (j==N)    	$.mobile.loading('hide');
					});// Fin EACH...				
				//alert('Datos de '+tabla+' recibidos');
			});// Fin transaction					

		},
		
		
		clickOpcion: function(tabla,sqlwhere) {			
			var urlajax = '';
                        var coddepo = $.mobile.ModelLogin.coddepo();
                        urlajax = $.mobile.ModelLogin.direccionURL() + 'Obtener' + tabla;
			var N = 0;
			var j = 1;			
			var parametros = '{"parametro": "'+sqlwhere+'","coddepo": "'+coddepo+'"}';
			alert(tabla+' '+sqlwhere);
			a = $.ajax({				
				url: urlajax,
				type: 'POST',
				data: parametros,
				contentType: 'application/json; charset=utf-8',
				dataType: "json",
				success: function(data, status) {				
			    self.grabarABD(data,tabla);	
			    if (tabla=='USUARIOS')
			     $.mobile.changePage('#login');
				},
				error: function(response) {
					console.log(urlajax);
					alert('Error al Conectar al Servidor'+response);
					$.mobile.loading('hide');
				},

				beforeSend: function(XMLHttpRequest) {					
				   $.mobile.loading('show', {text: 'Conectando...',textVisible: true,theme: 'b',html: ""});				
				},				
				complete: function() {
					$.mobile.loading('hide');					
				},
				async: !$.mobile.ModelLogin.ModoWEB(),
				cache: false,
			    xhr: function()
				  {
				    var xhr = new window.XMLHttpRequest();
				    //Download progress
				    xhr.addEventListener("progress", function(evt){
				      if (evt.lengthComputable) {
				        var percentComplete = evt.loaded / evt.total*100;
				        $.mobile.loading('show', {text: 'Descargando: '+percentComplete.toFixed(0)+'%',textVisible: true,theme: 'b',html: ""});				        
				      }
				    }, false);
				    return xhr;
				  },				
			});//Fin Ajax					
		},


		clickEnviar: function(tabla) {
			$.mobile.SqLite.transaction(
			function(tx) {
				var consulta = "SELECT * FROM DOCUMENTOS WHERE STATUS = 1  and codvend = '"+$.mobile.ModelLogin.codvenduser()+"'";
				tx.executeSql(consulta, [], function(tx, rs) {
					if(rs.rows.length > 0) {
						$.mobile.ModelDocumento.items.removeAll();
						var n = rs.rows.length;
						var numd = "";
						var numdact = "";
						var enviar = 0;
						for(var i = 0; i < n; i++) {
							numdact = rs.rows.item(i).numerod;
							$.mobile.ModelDocumento.items.push(new $.mobile.ModelDocumento.InsertarItemDocumento(rs.rows.item(i).coditem, rs.rows.item(i).descrip, rs.rows.item(i).cantidad, rs.rows.item(i).precio, rs.rows.item(i).descuento, 0, 0, 0, 0, 0, 0, 0,rs.rows.item(i).observacion,rs.rows.item(i).codubic,rs.rows.item(i).detalleprd));
							enviar = 0;
							if(i == n - 1) enviar = 1;
							else {
								numdsig = rs.rows.item(i + 1).numerod;
								if(numdact != numdsig) enviar = 1;
							}

							if(enviar == 1) {
								self.EnviarDocumento(numdact);	
													
							} // Fin If Enviar
						} //Fin For
					} // Fin If
					else {
						alert('No Hay Pedidos en el Dispositivo');
					}
				}); // Fin Funcion
			}); //Fin Transaccion
		},
		
		ImprimirDocumento: function(nd) {
			console.log('nd: '+nd);
			$.mobile.loading('show', {
				text: 'Procesando...',
				textVisible: true,
				theme: 'b',
				html: ""
			});
			$.mobile.SqLite.transaction(
			function(tx) {				
				var consulta = "SELECT strftime('%d-%m-%Y %H:%M:%S', D.fechae) as fecha ,U.descrip as descripusua,D.descrip,D.cantidad,C.CodClie,C.Descrip as DescripClie,D.precio+(D.Precio*P.iva/100.00) as precio,D.cantidad*(D.precio+(D.Precio*P.iva/100.00)) as totalitem FROM DOCUMENTOS D JOIN PRODUCTOS P ON (D.CODITEM=P.CODIGO) JOIN CLIENTES C ON (C.CODCLIE=D.CODCLIE) JOIN USUARIOS U ON (U.codvend=D.codvend) WHERE D.numerod = '"+nd+"' and D.codvend = '"+$.mobile.ModelLogin.codvenduser()+"'";
				var producto = "";
				var total = 0.0;
				tx.executeSql(consulta, [], function(tx, rs) {
					if(rs.rows.length > 0) {
						var n = rs.rows.length;


	  	  BTPrinter.connect(function(data){}, function(err){confirm(err);}, "BlueTooth Printer");

	  	  /*IMPRIME EN EL CENTRO*/
          BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 01");
          BTPrinter.printText(function(data){}, function(err){}, "PEDIDO # "+nd+"\n");
          BTPrinter.printText(function(data){}, function(err){}, "-------------------------\n");
         BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 00");

	  	  /*IMPRIME LETRA PEQUEÑA*/
         BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 21 01");

         BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 00");
         BTPrinter.printText(function(data){}, function(err){}, "Fecha:: "+rs.rows.item(0).fecha+"\n");
         BTPrinter.printText(function(data){}, function(err){}, "CLIENTE: "+rs.rows.item(0).CodClie+"\n");

         BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 00");
         BTPrinter.printText(function(data){}, function(err){}, rs.rows.item(0).DescripClie+"\n");

         BTPrinter.printText(function(data){}, function(err){}, "VENDEDOR: "+rs.rows.item(0).descripusua+"\n");
         
         BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 01");
         BTPrinter.printText(function(data){}, function(err){}, "-------------------------\n");
         BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 00");


	  	  for(var i = 0; i < n; i++) 
	  	  {	
          /*IMPRIME EN EL DERECHA*/
           total = total + rs.rows.item(i).totalitem;
           BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 00");
           BTPrinter.printText(function(data){}, function(err){},'* '+rs.rows.item(i).descrip+"\n");

          /*IMPRIME EN EL DERECHA*/
          producto = "Cant: "+rs.rows.item(i).cantidad + " x "+rs.rows.item(i).precio+" = "+rs.rows.item(i).totalitem ;

           BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 00");
           BTPrinter.printText(function(data){}, function(err){}, producto+"\n" );

          }	  	  	
	  	  
         /*IMPRIME A LA IZQUIERDA*/
          BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 61 02");
          BTPrinter.printText(function(data){}, function(err){}, "TOTAL = "+total+"\n");

	  	  /*QUITAR IMPRIME LETRA PEQUEÑA*/
          BTPrinter.printPOSCommand(function(data){}, function(err){}, "1B 21 00");
	  	  
          BTPrinter.disconnect(function(data){}, function(err){confirm(err);}, "BlueTooth Printer");	  	  
          $.mobile.loading('hide');

					} // Fin If
				}); // Fin Funcion
			}); //Fin Transaccion
		},


		EnviarDocumento: function(nd) {
			console.log('nd: '+nd);
			$.mobile.loading('show', {
				text: 'Procesando...',
				textVisible: true,
				theme: 'b',
				html: ""
			});
			$.mobile.SqLite.transaction(
			function(tx) {				
				var consulta = "SELECT * FROM DOCUMENTOS  WHERE numerod = '"+nd+"' and codvend = '"+$.mobile.ModelLogin.codvenduser()+"'";
				tx.executeSql(consulta, [], function(tx, rs) {
					if(rs.rows.length > 0) {
						$.mobile.ModelDocumento.items.removeAll();
						var n = rs.rows.length;
						$.mobile.ModelDocumento.codclie(rs.rows.item(0).codclie);
						$.mobile.ModelDocumento.codvend(rs.rows.item(0).codvend);
						$.mobile.ModelDocumento.observacion(rs.rows.item(0).observacion);
                        $.mobile.ModelDocumento.descuentog(rs.rows.item(0).descuentog);
						for(var i = 0; i < n; i++)
							$.mobile.ModelDocumento.items.push(new $.mobile.ModelDocumento.InsertarItemDocumento(rs.rows.item(i).coditem, rs.rows.item(i).descrip, rs.rows.item(i).cantidad, rs.rows.item(i).precio, rs.rows.item(i).descuento, 0, 0, 0, 0, 0, 0, 0,rs.rows.item(i).observacion,rs.rows.item(i).codubic,rs.rows.item(i).detalleprd));
						var cadena = ko.toJSON($.mobile.ModelDocumento);						
						$.mobile.ModelDocumento.items.removeAll();
						$.ajax({
									url: $.mobile.ModelLogin.direccionURL() + 'EnviarPedidos',
									type: 'POST',
									data: cadena,
									contentType: 'application/json; charset=utf-8',
									dataType: "json",
									success: function(res) {
										if(res == 0) {
											alert('Problemas al Procesar el Pedido en el Servidor');
										}
										
										if(res == 1) {
											self.actualizarRegistro(nd);
											alert('Envio finalizado correctamente');
											$.mobile.changePage('#menu');
										}										
									},
									error: function() {
  									  alert('Error de Conexion');
  									  $.mobile.loading('hide');
									},
									beforeSend: function() {
										$.mobile.loading('show', {
											text: 'Conectando...',
											textVisible: true,
											theme: 'b',
											html: ""
										});
									},	
									complete:function(){
					       	        	$.mobile.loading('hide');
					       	         },
									async: !$.mobile.ModelLogin.ModoWEB(),
									cache: false,
									xhr: function()
									  {
									    var xhr = new window.XMLHttpRequest();
									    //Upload progress
									    xhr.upload.addEventListener("progress", function(evt){
									      if (evt.lengthComputable) {
									        var percentComplete = evt.loaded / evt.total;
									        $.mobile.loading('show', {text: 'Enviando: '+percentComplete.toFixed(0)+'%',textVisible: true,theme: 'b',html: ""});									        
									      }
									    }, false);
									    return xhr;
									  },	
								}); // Fin ajax						
					} // Fin If
				}); // Fin Funcion
			}); //Fin Transaccion
		},




		ObtenerPrecios: function(){},


		ObtenerImagenes: function(){},






        
		ObtenerLista: function(){
			$.mobile.loading('show', {
				text: 'Procesando...',
				textVisible: true,
				theme: 'b',
				html: ""
			});
			var CodVendedor = $.mobile.ModelLogin.codvenduser();
			var Precio = '';
			if ($.mobile.ModelLogin.preciovend1() == 1) Precio = '1';
			    
			if ($.mobile.ModelLogin.preciovend2() == 1) Precio = Precio +'2';				   
				
			if ($.mobile.ModelLogin.preciovend3() == 1) Precio = Precio +'3';
			
			if (($.mobile.ModelLogin.preciovend1() == -1) && 
				($.mobile.ModelLogin.preciovend2() == -1) &&
				($.mobile.ModelLogin.preciovend3() == -1))
				Precio = '0';
			
			console.log('Precio: '+Precio);			
			var urlajax = '';
			urlajax = $.mobile.ModelLogin.direccionURL() + 'ObtenerListaProductos';
			var N = 0;
			var j = 1;			
			var parametros = '{"parametro": "'+CodVendedor+'_'+Precio+'","coddepo":""}';
			$.ajax({				
				url: urlajax,
				type: 'POST',
				data: parametros,
				contentType: 'application/json; charset=utf-8',
				dataType: "json",			
				success: function(res) {
					if (res == 1)
						alert('Dentro de poco recibira por correo su lista de precios');
					else
						alert('No pudo obtenerse la lista de precios');
				},
				error: function() {				  
					  alert('Error de Conexion');
					  $.mobile.loading('hide');
				},
				beforeSend: function() {
					$.mobile.loading('show', {
						text: 'Procesando...',
						textVisible: true,
						theme: 'b',
						html: ""
					});
				},	
				complete:function(){
       	        	$.mobile.loading('hide');
       	         },
				async: true,
				cache: false
			}); // Fin ajax
			
		},
		
		ObtenerAnaVenCli: function(){
			$.mobile.loading('show', {
				text: 'Procesando...',
				textVisible: true,
				theme: 'b',
				html: ""
			});
			var CodVendedor = $.mobile.ModelLogin.codvenduser();
			var urlajax = '';
			urlajax = $.mobile.ModelLogin.direccionURL() + 'ObtenerAnaVenCli';
			var N = 0;
			var j = 1;			
			var parametros = '{"parametro": "'+CodVendedor+'","coddepo":""}';			
			$.ajax({				
				url: urlajax,
				type: 'POST',
				data: parametros,
				contentType: 'application/json; charset=utf-8',
				dataType: "json",			
				success: function(res) {
						alert('Dentro de poco recibira por correo su reporte de analisis de vencimeinto');											
				},
				error: function() {				  
					  alert('Error de Conexion');
					  $.mobile.loading('hide');
				},
				beforeSend: function() {
					$.mobile.loading('show', {
						text: 'Procesando...',
						textVisible: true,
						theme: 'b',
						html: ""
					});
				},	
				complete:function(){
       	        	$.mobile.loading('hide');
       	         },
				async: true,
				cache: false				
			}); // Fin ajax
			
		},
		
		actualizarRegistro: function(numerod) {
			$.mobile.SqLite.transaction(
			function(tx) {
				var consulta = "Update DOCUMENTOS SET STATUS = 2 Where numerod = '" + numerod + "'";
				tx.executeSql(consulta);				
			});
		}

	};
	self.init();
})(jQuery);