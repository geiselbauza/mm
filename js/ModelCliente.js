(function($) {
    var self =  $.mobile.ModelCliente = {


        clientes: ko.observableArray([]),
        clientetofind: ko.observable(""),
        clientecodigo: ko.observable(""),
        clientedescrip: ko.observable(""),
        clientesaldo: ko.observable(""),
        clienterepresent: ko.observable(""),
        clientelimitecred :  ko.observable(""),
        clientetipopvp: ko.observable(""),
        diascred      : ko.observable(0),
        visibleatras: ko.observable(false),
        visibleadelante: ko.observable(false),
        visiblefooter: ko.observable(false),
        init : function()
		      {

    	        $('#infoclientes').live('pageinit',function()
	              {
	                ko.applyBindings(self,document.getElementById('infoclientes'));
                    ko.applyBindings(self,document.getElementById('vercliente'));
	              });

	            $('#infoclientes').live('pageshow',function()
	              {
	            	  $.mobile.ModelDocumento.items.removeAll();
                      $.mobile.ModelProducto.productos.removeAll();
	            	  self.InicializarPaginacion();
	              });

           },
           maxDias:10,
           InicializarPaginacion: function(){
        		 self.Top = 6;
        	     self.Skip = 0;
        	     self.Total = 0;
        	     self.clientetofind("");
        	     self.clientes.removeAll();
        	     self.visibleatras(false);
        	     self.visibleadelante(false);
        	     self.visiblefooter(false);
        	   },

           InsertarCliente: function (codigo, descrip, tipopvp, descto, saldo, diascred, limitecred, represent)
           {
             this.codigo = ko.observable(codigo);
  	         this.descrip = ko.observable(descrip);
  	         this.tipopvp = ko.observable(tipopvp);
  	         this.descto = ko.observable(descto);
  	         this.saldo = ko.observable(saldo);
             this.diascred = ko.observable(diascred);
             this.limitecred = ko.observable(limitecred);
             this.represent = ko.observable(represent);
           },

         AsignarCliente:  function()
           {
        	self.clientedescrip(this.descrip());
        	self.clientecodigo(this.codigo());
        	self.clientesaldo(this.saldo());
            self.diascred(this.diascred());
            self.clientelimitecred(this.limitecred());
            self.clienterepresent(this.represent());
        	self.clientetipopvp(this.tipopvp());

  		    $.mobile.ModelDocumento.codclie(this.codigo());
  		    $.mobile.ModelDocumento.desclie(this.descrip());
  		    $.mobile.ModelTotalizar.desclie(this.descrip());
  		    $.mobile.ModelDocumento.desctocliente(this.descto());
  		    $.mobile.ModelDocumento.pvpclie(this.tipopvp());
  		    var cond = 1;
  		    if (cond == 1) 	self.verificarCxCCliente(self.clientecodigo());
  		    else self.irapagina(0);
       	 },

         clickpuntear:  function() //aqui vamos a desarrollar el punteo de clientes
           {
                alert('aqui el punteo');
           },
       	irapagina: function(facven){
       		if ($.mobile.ModelMenu.menuSelec() == '1')
            {
  		      if ($.mobile.ModelLogin.TipoCarga()==2)
		               $.mobile.changePage('#IngresoManual');
		          else
                  {
		    	    if ((facven==0) || ($.mobile.ModelLogin.autorizacredito()==1))
		    	       $.mobile.changePage('#infoproductos');
		            else
		              alert('Cliente con Facturas Vencidas... No esta autorizado...');
		           }

		      }
		    if ($.mobile.ModelMenu.menuSelec() == '2')
                $.mobile.changePage('#infocxc');

		    if ($.mobile.ModelMenu.menuSelec() == '10')
                $.mobile.changePage('#vercliente');
       	},

       	verificarCxCCliente : function(cliente) {
       	   $.mobile.SqLite
		 	.transaction(function(tx) {
				var consulta = "select count(*) as cantidad from clientes c inner join cxc x on (c.codclie=x.codclie) where c.codvend = '"+$.mobile.ModelDocumento.codvend()+"' and c.codclie = '"+self.clientecodigo()+"' and (select Round(julianday('now') - julianday(fechav))) > "+self.maxDias;
				console.log(consulta);
				tx.executeSql(consulta, [], function(tx, rs) {
				self.irapagina(rs.rows.item(0).cantidad);
				}, function(tx, err) {
					$.mobile.SqLite.error(tx, err)
				});
			});
		},

       Top:6,
	   Skip:0,
	   Total:0,
	   mostrar: function(esenter){
	    self.clientes.removeAll();
	    var clientetofindstr = "";
	    clientetofindstr =  self.clientetofind() + "*";
	    $.mobile.SqLite.transaction
        (
          function(tx)
              {
           	  clientetofindstr = clientetofindstr.replace(/\*/g,"%");
    	   	  self.clientetofind(clientetofindstr);
        	  if (esenter){
                	if ($.mobile.ModelLogin.ModoWEB() == true){
                	      $.mobile.ModelConfiguracion.clickOpcion('CLIENTES',self.clientetofind());
                	      $.mobile.ModelConfiguracion.clickOpcion('CxC',self.clientetofind());
                	  }
                      var consulta = "";
               	      if (($.mobile.ModelMenu.menuSelec()=="1") || ($.mobile.ModelMenu.menuSelec()=="10"))// Lista de Cliente si es para pedidos...
               	    	  {
               		         consulta = "SELECT COUNT(CODCLIE) AS cantidad FROM CLIENTES WHERE (CODCLIE LIKE '"+ self.clientetofind()+"' OR DESCRIP LIKE '"+self.clientetofind()+"') AND UPPER(CLIENTES.CODVEND) = UPPER('"+$.mobile.ModelDocumento.codvend()+"')";
               		         if (($.mobile.ModelLogin.nivel() == '01') || ($.mobile.ModelLogin.nivel() == '02'))
               		            consulta = "SELECT COUNT(CODCLIE) AS cantidad FROM CLIENTES WHERE (CODCLIE LIKE '"+ self.clientetofind()+"' OR DESCRIP LIKE '"+self.clientetofind()+"')";
                          }
               	      if ($.mobile.ModelMenu.menuSelec()=="2")// Lista de Cliente si es para CxC...
               	    	  {
               		         consulta = "SELECT COUNT(CLIENTES.CODCLIE) AS cantidad FROM CLIENTES " +"INNER JOIN CXC ON (CLIENTES.CodClie = CXC.codclie) "+"WHERE ((CLIENTES.CodClie LIKE '"+self.clientetofind()+"' OR CLIENTES.DESCRIP LIKE '"+self.clientetofind()+"') AND UPPER(CLIENTES.CODVEND) = UPPER('"+$.mobile.ModelDocumento.codvend()+"') AND CLIENTES.SALDO > 0) ";
               		         if (($.mobile.ModelLogin.nivel() == '01') || ($.mobile.ModelLogin.nivel() == '02'))
               		             consulta = "SELECT COUNT(CLIENTES.CODCLIE) AS cantidad FROM CLIENTES " +"INNER JOIN CXC ON (CLIENTES.CodClie = CXC.codclie) "+"WHERE ((CLIENTES.CodClie LIKE '"+self.clientetofind()+"' OR CLIENTES.DESCRIP LIKE '"+self.clientetofind()+"') AND CLIENTES.SALDO > 0) ";
               	    	  }

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
                }//Fin EsEnter
              
                   
                        var consulta = ""; 
	    	    
	    	    
           	if (($.mobile.ModelMenu.menuSelec()=="1") || ($.mobile.ModelMenu.menuSelec()=="10"))// Lista de Cliente si es para pedidos...
            {
			       consulta = "SELECT * FROM CLIENTES WHERE (CODCLIE LIKE '"+self.clientetofind()+"' OR DESCRIP LIKE '"+self.clientetofind()+"') AND UPPER(CLIENTES.CODVEND) = UPPER('"+$.mobile.ModelDocumento.codvend()+"') Order By DESCRIP LIMIT "+self.Top+" OFFSET "+self.Skip;
			       if (($.mobile.ModelLogin.nivel() == '01') || ($.mobile.ModelLogin.nivel() == '02'))
         		         consulta = "SELECT * FROM CLIENTES WHERE CODCLIE LIKE '"+self.clientetofind()+"' OR DESCRIP LIKE '"+self.clientetofind()+"' Order By DESCRIP LIMIT "+self.Top+" OFFSET "+self.Skip;
           	 }
           	 if ($.mobile.ModelMenu.menuSelec()=="2")
             {
           		   consulta = "SELECT Distinct CLIENTES.CODCLIE as CodClie, CLIENTES.DESCRIP as Descrip, TipoPVP, Descto, Clientes.Saldo as Saldo, Clientes.DiasCred as DiasCred, Clientes.Represent as Represent, Clientes.limitecred as LimiteCred FROM CLIENTES " +
            		          "INNER JOIN CXC ON (CLIENTES.CodClie = CXC.codclie) WHERE ((CLIENTES.CodClie LIKE '"+self.clientetofind()+"' OR CLIENTES.DESCRIP LIKE '"+self.clientetofind()+"') AND UPPER(CLIENTES.CODVEND) = UPPER('"+$.mobile.ModelDocumento.codvend()+"') AND CLIENTES.SALDO > 0) " +
           		              "Order By CLIENTES.DESCRIP LIMIT "+self.Top+" OFFSET "+self.Skip;
           		   if (($.mobile.ModelLogin.nivel() == '01') || ($.mobile.ModelLogin.nivel() == '02'))
           			    consulta = "SELECT Distinct CLIENTES.CODCLIE as CodClie, CLIENTES.DESCRIP as Descrip, TipoPVP, Descto, Clientes.Saldo as Saldo,  Clientes.DiasCred as DiasCred, Clientes.Represent as Represent, Clientes.limitecred as LimiteCred  FROM CLIENTES " +
  		                           "INNER JOIN CXC ON (CLIENTES.CodClie = CXC.codclie) WHERE ((CLIENTES.CodClie LIKE '"+self.clientetofind()+"' OR CLIENTES.DESCRIP LIKE '"+self.clientetofind()+"') AND CLIENTES.SALDO > 0) " +
 		                           "Order By CLIENTES.DESCRIP LIMIT "+self.Top+" OFFSET "+self.Skip;
           	 }
           	clientetofindstr = clientetofindstr.replace(/\%/g,"*");
           	self.clientetofind(clientetofindstr.substring(0, clientetofindstr.length-1));
                tx.executeSql(consulta,[],
	             				function(tx,rs)
	             				  {
	             				    if(rs.rows.length >0)
	             				    {
	             				    	for(var i=0; i<rs.rows.length;i++){
						                  var item = rs.rows.item(i);
						                  self.clientes.push(new self.InsertarCliente(item.CodClie,item.Descrip,item.TipoPVP,item.Descto,item.Saldo,item.DiasCred,item.LimiteCred,item.Represent));
						                }
	             				    }
	             				    else
	             				    {
	             				      alert("No Existen Datos...");
	             				    }
	             				  },
	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	             			  );


              });// Fin de la Transaccion



	    /*$.mobile.ModelConfiguracion.clickOpcion('CLIENTES');
	    if ($.mobile.ModelConfiguracion.dataajax() == ""){
	      console.log('Datos para la appMobil');
	      self.obtenerDesdeBD();
	    }
        else{

        	console.log('Datos para la App WEB');
        }*/



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

        }
    };
    self.init();
   })(jQuery);












