(function($) {
	var self = $.mobile.ModelDocumento = {
		codclie : ko.observable(""),
		desclie : ko.observable(""),
		observacion: ko.observable(""),
		pvpclie : ko.observable(""),
		desctocliente : ko.observable("0"),
        descuentog: ko.observable("0"),
        totalDescuentoGeneral: ko.observable("0"),
        codubic : ko.observable(""),
		codvend : ko.observable(""),
		items : ko.observableArray([]),
		codprod : ko.observable(""),
		existen : ko.observable("0"),
		descrip : ko.observable(""),
		precio1 : ko.observable("0"),
		precio1i : ko.observable("0"),		
		precio2 : ko.observable("0"),
		precio2i : ko.observable("0"),		
		precio3 : ko.observable("0"),
		precio3i : ko.observable("0"),		
		precio : ko.observable("0"),
		DescPorc : ko.observable("0"),
		detalleprd : ko.observable(""),
		iva : ko.observable("0"),
		cantidad : ko.observable("0"),
        VerPrecio0: ko.observable(false),
        VerPrecioS: ko.observable(true),
        tipprecio       : ko.observable("0"),
		p1v: ko.observable(true),
		p2v: ko.observable(true),
		p3v: ko.observable(true),
	//	moneda: ko.observable("0"),
		
		init : function() {
			$('#IngresoManual').live(
					'pageinit',
					function() {
						self.TotalesParciales();
						self.TotalesGenerales();
						ko.applyBindings(self, document
								.getElementById('IngresoManual'));
			 });

			$('#items').live('pageinit', function() {
				self.TotalesParciales();
				self.TotalesGenerales();
				ko.applyBindings(self, document.getElementById('items'));
			});

			$('#items').live('pageshow', function() {
                $.mobile.ModelLogin.posicionpage(2);
				self.TotalesParciales();
				self.TotalesGenerales();
			});

			$('#cantidad').live('pageinit', function() {
				self.TotalesParciales();
				self.TotalesGenerales();
				ko.applyBindings(self, document.getElementById('cantidad'));
			});

			$('#cantidad').live('pageshow', function() {
				self.determinarPrecio();
				self.TotalesParciales();
                self.TotalesGenerales();
			});

			$('#descuento').live('pageinit', function() {
				ko.applyBindings(self, document.getElementById('descuento'));
			});


			$('#detalle').live('pageinit', function() {
				ko.applyBindings(self, document.getElementById('detalle'));
			});


			$('#totales').live('pageinit', function() {
				ko.applyBindings(self, document.getElementById('totales'));
			});

			/*$('#idcodprod').live('keypress', function(e) {
				if (e.keyCode == 13) {
					self.mostrarDescripcion();
				}
			});
			$('#idcodprod').live('blur', function() {
				if (self.codprod() != '') {
					self.mostrarDescripcion();
				}
			});*/
			$('#cantidad').live('blur', function() {
				if (self.cantidad() == '0') {
					console.log("cantidad: "+self.cantidad());
					self.cantidad("");
				}
			});			
			$('#descuento').live('blur', function(e) {
				   if (self.DescPorc()==''){
					   self.DescPorc(0);
				   }
					self.verificarDescuento();
			});
            $('#descuentog').live('blur', function(e) {
				   if (self.DescPorc()==''){
					   self.DescPorc(0);
				   }
					self.verificarDescuento();
			});
						
			
		},


       clickprecio: function(){

		  self.VerPrecio0(false);
		  self.VerPrecios(false);

		  if (self.tipprecio()=="0")
			 self.VerPrecios(true);
          else
			 self.VerPrecio0(true);
   	   },
		
		verificarDescuento : function() {
			//console.log($.mobile.ModelLogin.descuento()+'---'+self.DescPorc());
			if (($.mobile.ModelLogin.descuento() > -1)){
				if (self.DescPorc() > $.mobile.ModelLogin.descuento()){
					alert('Descuento aplicado supera al permitido al vendedor');
					self.DescPorc(0);
				}
			}

			if ($.mobile.ModelLogin.descuento() == -1){
				if (self.DescPorc() > self.desctocliente()){
					alert('Descuento aplicado supera al permitido al cliente');
					self.DescPorc(0);
				}

			}
		},
		
		
		determinarPrecio : function(){
			self.p1v(false);self.p2v(false);self.p3v(false);
			//pvpclie fue asignado previamente en ModelCliente
			if (($.mobile.ModelLogin.preciovend1()==-1) &&
				($.mobile.ModelLogin.preciovend2()==-1) &&
				($.mobile.ModelLogin.preciovend3()==-1))
				{
				  self.p1v(true);self.p2v(true);self.p3v(true);
				  self.precio(self.precio3());
				  console.log('Precio Final: '+self.pvpclie());
				}
			
			if ($.mobile.ModelLogin.preciovend1()==1){  
				self.p1v(true);
				self.precio(self.precio1());				
				}
			if ($.mobile.ModelLogin.preciovend2()==1){
				self.p2v(true);
				self.precio(self.precio2());				
			}
			if ($.mobile.ModelLogin.preciovend3()==1){  
				self.p3v(true);
				self.precio(self.precio3());			
			}
			console.log('Precio: '+self.precio());		
		},
		
		getExistenciaServer : function(codprod) {
			$.ajax({
				url : $.mobile.ModelLogin.direccionURL() + 'ObtenerExistencia/'
						+ codprod,
				type : 'GET',
				contentType : 'application/json; charset=utf-8',
				dataType : "json",
				success : function(data) {
					self.existen(data);
				},
				error : function(msg) {
					self.existen("0");
				},
				async : false,
				cache : false
			});

		},
		mostrarDescripcion : function() {
			console.log('Mostrar Descripcion');
			$.mobile.SqLite
					.transaction(function(tx) {
						var consulta = "SELECT descrip, precio1, precio2, precio3, iva, existen FROM PRODUCTOS WHERE codigo = '"
								+ self.codprod() + "' Limit 1";
						tx.executeSql(consulta, [], function(tx, rs) {
							if (rs.rows.length > 0) {
								var item = rs.rows.item(0);
								self.descrip(item.descrip);
								self.existen(item.existen);
								self.iva(item.iva);
								self.getExistenciaServer(self.codprod());
								if (self.pvpclie() == 1)
									self.precio(item.precio1);
								if (self.pvpclie() == 2)
									self.precio(item.precio2);
								if (self.pvpclie() == 3)
									self.precio(item.precio3);
								document.getElementById('canPro').focus();
								// $('canPro').focus();
							} else {
								self.descrip("No Existe Producto");
							}
						}, function(tx, err) {
							$.mobile.SqLite.error(tx, err)
						});
					});

		},

		getExistenciaDevive : function(codprod) {
			$.mobile.SqLite.transaction(function(tx) {
				var consulta = "SELECT existen FROM PRODUCTOS WHERE codigo = '"
						+ codprod + "' Limit 1";
				tx.executeSql(consulta, [], function(tx, rs) {
					if (rs.rows.length > 0) {
						var item = rs.rows.item(0);
						self.existen(item.existen);
					} else {
						self.existen("0");
					}
				}, function(tx, err) {
					$.mobile.SqLite.error(tx, err)
				});
			});
		},

		TotalesParciales : function() {
			// Total Bruto Parcial.			
			self.totalBrutoParcial = ko.computed(function() {
				calculo = ko.observable();
				var c = self.cantidad() * self.precio();
				calculo(c);
				return calculo().toFixed(2);
			}, this);

			// Aplicando Descuento Parcial y General al Producto.
			self.descuentoParcial = ko.computed(
					function() {
						calculo = ko.observable();
						var c = (parseFloat(self.totalBrutoParcial())
								* self.DescPorc() / 100);

						var d = (parseFloat(self.totalBrutoParcial()) - c)
								* self.desctocliente() / 100;

                       	d = d + c ;
						calculo(d);
						return calculo().toFixed(2);
					}, this);

			// Total Neto Parcial.
			self.totalNetoParcial = ko.computed(function() {
				calculo = ko.observable();
				var c = (parseFloat(self.totalBrutoParcial()) - parseFloat(self
						.descuentoParcial()));
				calculo(c);
				return calculo().toFixed(2);
			}, this);

			// Base Imponible Parcial.
			self.baseImponibleParcial = ko.computed(function() {
				calculo = ko.observable();
				var c = 0;
				if (self.iva() == 0)
					c = 0;
				else
					c = parseFloat((self.cantidad() * self.precio())-self.descuentoParcial());
				calculo(c);
				return calculo().toFixed(2);
			}, this);

			// Excento Parcial.
			self.excentoParcial = ko.computed(function() {
				calculo = ko.observable();
				var c = 0;
				if (self.iva() == 0)
					c = parseFloat((self.cantidad() * self.precio())-self.descuentoParcial());
				else
					c = 0;
				calculo(c);
				return calculo().toFixed(2);
			}, this);

			// Iva Parcial.
			self.ivaParcial = ko.computed(function() {
				calculo = ko.observable();
				var c = parseFloat(self.baseImponibleParcial())
						* (self.iva() / 100);
				calculo(c);
				return calculo().toFixed(2);
			}, this);

			// Total Parcial.
			self.totalParcial = ko.computed(function() {
				calculo = ko.observable();
				var c = parseFloat(self.baseImponibleParcial()+self.excentoParcial()+self.ivaParcial());
				calculo(c);
				return calculo().toFixed(2);
			}, this);
		},

		TotalesGenerales : function() {
            // Calcular descuento Global


			// TotalBrutoGeneral
			self.totalBrutoGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				ko.utils.arrayForEach(self.items(), function(w) {
					total = total + parseFloat(w.totalBrutoParcial());
				});
				OSTotal(total);
				return  OSTotal().toFixed(2);
			}, this);

			// TotalDescuentoGeneral individual + descuento del cliente
			self.totalDescuentoGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				ko.utils.arrayForEach(self.items(), function(w) {
					total = total + parseFloat(w.descuentoParcial());
				});
				OSTotal(total);
				return OSTotal().toFixed(2);
			}, this);

			// Total Neto General
			self.totalNetoGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				ko.utils.arrayForEach(self.items(), function(w) {
					total = total + parseFloat(w.totalNetoParcial());
				});
				OSTotal(total-(total*self.descuentog()));
				return OSTotal().toFixed(2);
			}, this);

			// TotalImponiblegeneral
			self.totalImponibleGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				ko.utils.arrayForEach(self.items(), function(w) {
					total = total + parseFloat(w.baseImponibleParcial());
				});
				OSTotal(total-(total*self.descuentog()));
				return OSTotal().toFixed(2);
			}, this);

			// TotalExcentogeneral
			self.totalExcentoGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				ko.utils.arrayForEach(self.items(), function(w) {
					total = total + parseFloat(w.excentoParcial());
				});
				OSTotal(total-(total*self.descuentog()));
				return OSTotal().toFixed(2);
			}, this);

			// TotalIVAGeneral
			self.totalIVAGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				ko.utils.arrayForEach(self.items(), function(w) {
					total = total + parseFloat(w.ivaParcial());
				});
				OSTotal(total-(total*self.descuentog()));
				return OSTotal().toFixed(2);
			}, this);

			// TotalItemGeneral
			self.totalItemGeneral = ko.computed(function() {
				OSTotal = ko.observable();
				var total = 0;
				total = parseFloat(self.totalImponibleGeneral())
						+ parseFloat(self.totalExcentoGeneral())
						+ parseFloat(self.totalIVAGeneral());
				/*
				 * ko.utils.arrayForEach(self.items(), function(w) { total =
				 * total + parseFloat(w.totalParcial()); });
				 */

				OSTotal(total);
				return OSTotal().toFixed(2);
			}, this);
            self.descuentog($.mobile.ModelTotalizar.totalDescuentoGlobal()/(self.totalBrutoGeneral()-self.totalDescuentoGeneral()));
			$.mobile.ModelTotalizar.totalBrutoGeneral(self.totalBrutoGeneral());
			$.mobile.ModelTotalizar.totalDescuentoGeneral(self.totalDescuentoGeneral());
			$.mobile.ModelTotalizar.totalNetoGeneral(self.totalNetoGeneral());
			$.mobile.ModelTotalizar.totalImponibleGeneral(self.totalImponibleGeneral());
			$.mobile.ModelTotalizar.totalExcentoGeneral(self.totalExcentoGeneral());
			$.mobile.ModelTotalizar.totalIVAGeneral(self.totalIVAGeneral());
			$.mobile.ModelTotalizar.totalItemGeneral(self.totalItemGeneral());

		},

		InsertarItemDocumento : function(codigo, descrip, cantidad, precio,
				descuentoParcial, ivaParcial, totalParcial, totalBrutoParcial,
				totalNetoParcial, baseImponibleParcial, excentoParcial,
				porccliente,obsPedidos,codubic,detalleprd/*,moneda*/) {
			var self = this;
			this.coditem = ko.observable(codigo);
			this.descrip = ko.observable(descrip);
			this.precio = ko.observable(precio);
			this.cantidad = ko.observable(cantidad);
			this.descliente = ko.observable(porccliente);
			this.descuentoParcial = ko.observable(descuentoParcial);
			this.ivaParcial = ko.observable(ivaParcial);
			this.totalParcial = ko.observable(totalParcial);
			this.totalBrutoParcial = ko.observable(totalBrutoParcial);
			this.totalNetoParcial = ko.observable(totalNetoParcial);
			this.baseImponibleParcial = ko.observable(baseImponibleParcial);
			this.excentoParcial = ko.observable(excentoParcial);
			this.obsPedidos = ko.observable(obsPedidos);
			this.codubic    = ko.observable(codubic);
			this.detalleprd    = ko.observable(detalleprd);
			//this.moneda		=ko.observable(moneda); //moneda $ 
		},

		InsertarItemProducto : function(codigo, descrip, precio1, precio2,
				precio3, iva, cantidad, precio, existen,precio1i,precio2i,precio3i) {
			self.codprod(codigo);
			self.descrip(descrip);
			self.precio1(precio1);
			self.precio1i(precio1i);
			self.precio2(precio2);
			self.precio2i(precio2i);
			self.precio3(precio3);
			self.precio3i(precio3i);
			self.iva(iva);
			self.cantidad(cantidad);
			self.precio(precio);// Pila
			self.existen(existen);// Pila
		},
		getPrecio : function(codprod) {
			$.mobile.SqLite
					.transaction(function(tx) {
						var consulta = "Select precio1, precio2, precio3 From PRODUCTOS Where codigo = '"
								+ codprod + "'";
						tx.executeSql(consulta, [], function(tx, rs) {
							if (rs.rows.length > 0) {
								var item = rs.rows.item(0);
								if ($.mobile.ModelCliente.tipoprecio() == 1)
									self.precio(item.precio1);
								if ($.mobile.ModelCliente.tipoprecio() == 2)
									self.precio(item.precio2);
								if ($.mobile.ModelCliente.tipoprecio() == 3)
									self.precio(item.precio3);
							}
						}, function(tx, err) {
							$.mobile.SqLite.error(tx, err)
						});
					});
		},

		guardarDocumento : function() {
			if (self.cantidad() > 0) {				
				if ((self.cantidad() <= self.existen()) || ($.mobile.ModelLogin.negativo() == 1)) {
					self.items.push(new self.InsertarItemDocumento(self
							.codprod(), self.descrip(), self.cantidad(), self
							.precio(), self.descuentoParcial(), self
							.ivaParcial(), self.totalParcial(), self
							.totalBrutoParcial(), self.totalNetoParcial(), self
							.baseImponibleParcial(), self.excentoParcial(),
							self.desctocliente(),"",$.mobile.ModelLogin.coddepo(),self.detalleprd()));
					if ($.mobile.ModelLogin.TipoCarga() == 2) {
						self.LimpiarCampos();
						$.mobile.changePage('#IngresoManual');
					} else {
						self.LimpiarCampos();
						$.mobile.changePage('#infoproductos');
					}
				} else {
					alert("Cantidad igual a 0 o mayor a la existencia");
					// self.codprod("");self.cantidad("0")
				}
			} else {
				alert("No hay existencia");
				// self.codprod("");self.cantidad("0")
			}
		},
		clickguardar : function() {
			if ($.mobile.ModelLogin.TipoCarga() == 2) {
				self.getExistenciaServer(self.codprod());
			}
			if ($.mobile.ModelLogin.TipoCarga() == 1) {
				self.getExistenciaDevive(self.codprod());
			}
			setTimeout(function() {
				self.guardarDocumento();
			}, 500);
		},

		clickcancelar : function() {
			self.items.push(new self.InsertarItemDocumento(self.codprod(), self
					.descrip(), self.precio(), self.cantidad(), self
					.descuentoParcial(), self.ivaParcial(),
					self.totalParcial(), self.totalBrutoParcial(), self
							.totalNetoParcial(), self.baseImponibleParcial(),
					self.excentoParcial(),self.desctocliente(),"",$.mobile.ModelLogin.coddepo(),self.detalleprd()));
			$.mobile.changePage('#infoproductos');
		},
		
		clicktotalizar: function(){
			if ($.mobile.ModelTotalizar.totalItemGeneral() > 0 )
    			$.mobile.changePage('#confirmar');
		},

		RemoverItem : function() {
			self.items.remove(this);
			self.TotalesParciales();
			self.TotalesGenerales();
		},


		
		guardarDispositivo : function() {
			var numerod = 0;
			var obsPedidos = $.mobile.ModelTotalizar.obsPedidos();
			var totalDescuentoGlobal = $.mobile.ModelTotalizar.totalDescuentoGlobal();
	//		var moneda = $.mobile.ModelTotalizar.moneda();
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
                                        var sql = 'INSERT INTO DOCUMENTOS(tipodoc,numerod,fechae,linea,coditem,descrip,status,cantidad,codvend,codclie,precio,descuento,totalitem,estaproc,observacion,codubic,detalleprd,descuentog,moneda'+
										          'VALUES("A","' + numerod + '",datetime("now","localtime"),?,?,?,?,?,?,?,?,?,?,0,?,?,?,?;?)';

                                                	tx.executeSql(sql, [ j,
													w.coditem(), w.descrip(),
													1, w.cantidad(),
													self.codvend(),
													self.codclie(), w.precio(),
													w.descuentoParcial(),
													w.totalParcial(),
													obsPedidos,w.codubic(),w.detalleprd(),totalDescuentoGlobal]);

											var sql2 = 'UPDATE PRODUCTOS SET existen = existen - '
													+ w.cantidad()
													+ ' WHERE codigo = "'
													+ w.coditem() + '"';
											tx.executeSql(sql2);
											if (j == (self.items().length) - 1) {
												alert('Pedido Almacenado en Dispositivo Mobil');
												self.items.removeAll();
												self.codclie("");											
											}
											j = j + 1;
										});
					});   

		},

		AnularPedido : function() {
			self.items.removeAll();
			self.totalBrutoParcial(0);
			self.descuentoParcial(0);
			self.totalNetoParcial(0);
			self.baseImponibleParcial(0);
			self.excentoParcial(0);
			self.ivaParcial(0);
			self.totalParcial(0);
		},
		LimpiarCampos : function() {
			self.codprod("");
			self.descrip("");
			self.existen("");
			self.detalleprd("");
			self.DescPorc(0);
			self.cantidad(0);
		},
        CargaCliente: function(){
            $.mobile.changePage('#infocxc');
  	    },
		clicksalir : function() {
	    	 if (confirm("Pedido en curso, desea abandonar"))
	    	 {
	    		 self.items.removeAll();
	    		 $.mobile.changePage('#menu');
	    	 }
       }
	};
	self.init();
})(jQuery);