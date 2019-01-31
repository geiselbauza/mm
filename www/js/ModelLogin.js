(function($) 
{
    var self =  $.mobile.ModelLogin = 
    {

      superusuario         : ko.observable("001"),
      clavesuperusuario    : ko.observable("admin"),
      usuarioclaveMsg : ko.observable(false),
      usuarioMsg      : ko.observable(false),
      claveMsg        : ko.observable(false),   
      verdepo         : ko.observable(false),   
      divintro        : ko.observable(true),
      divlogin        : ko.observable(false),      
      codigo          : ko.observable(""),
      clave           : ko.observable(""),
      descripuser     : ko.observable(""),
      codvenduser     : ko.observable(""),
      preciovend      : ko.observable(0),
      preciovend1     : ko.observable(0),
      preciovend2     : ko.observable(0),
      preciovend3     : ko.observable(0),
      prevalece       : ko.observable(0),
      negativo        : ko.observable(0),
      descuento       : ko.observable(0),
      nivel           : ko.observable(""),
      itemspedido     : ko.observable(0),
      autorizacredito : ko.observable(0),
      posicionpage    : ko.observable(1),
      
      
      Modo1:ko.observable("1"),
      Modo2:ko.observable("2"),
      ModoSele:ko.observable("1"),
      ModoWEB:ko.observable(false),
      vendernegativo: ko.observable("no"),
      TipoCarga:ko.observable(""),  // 1: Carga x Info  // 2: Carga Individual
      IP:ko.observable(""),
      coddepo:ko.observable(""),
      Puerto:ko.observable(""),
      TieneImpreso:ko.observable(0),
      verimagen:ko.observable(0),
      direccionURL:ko.observable(""),
      PA:ko.observable(""),
      
      opciones : ko.observableArray(["No", "Si"]),
      opcion   : ko.observable("Si"),
      
      
      
      
      init : function()
	       {	 
    	        $('#login').live('pageinit',function(){
    	      
		    	     $.mobile.SqLite.transaction
		                 (
		                   function(tx)
			                   {
			                     var consulta = "SELECT * FROM USUARIOS";	                 
			    	             tx.executeSql(consulta,[],
							     function(tx,rs){},
							     function(tx,err){$.mobile.SqLite.createtables()});
			                   }
		                 );    	         
		                 ko.applyBindings(self,document.getElementById('login'));
		                 ko.applyBindings(self,document.getElementById('conexion'));
		                 ko.applyBindings(self,document.getElementById('detvendedor'));
		                 setTimeout(function(){self.getDatosServidor();self.divintro(false);self.divlogin(true);} ,3000);		                 		                 
               });
    	        
    	        $("#conexion").live('pagebeforeshow', function(event, data) {
    	        	self.PA(data.prevPage.attr('id'));
    	        });
           },           
       
           
      clickverificar: function() {
   
    	self.usuarioMsg(false);
        self.claveMsg(false);
        self.usuarioclaveMsg(false);
   
        if (self.codigo()=="")
        {
            self.usuarioMsg(true);        
        }

        if (self.clave()=="")
        {
            self.claveMsg(true);
        }
       
        if ((self.codigo()!="") && (self.clave()!=""))
        {
        	if (self.ModoWEB() == true) 
          	   $.mobile.ModelConfiguracion.clickOpcion('USUARIOS','');
             
           $.mobile.SqLite.transaction
              (
                   function(tx)
	                   {
//                	     var consulta = "select codigo, descrip, clave, codvend, CASE WHEN preciovend1 = 0 THEN 'No' else 'Si' END AS 'preciovend1',  CASE WHEN preciovend2 = 0 THEN 'No' else 'Si' END AS 'preciovend2',  CASE WHEN preciovend3 = 0 THEN 'No' else 'Si' END AS 'preciovend3', precli,  CASE WHEN negativo = 0 THEN 'No' else 'Si' END AS 'negativo', descuento, nivel FROM USUARIOS Where UPPER(codigo) = UPPER('"+self.codigo() +  "') And UPPER(clave) = UPPER('"+ self.clave()+"')";
	                     var consulta = "SELECT * FROM USUARIOS Where UPPER(codigo) = UPPER('"+self.codigo() + "') And UPPER(clave) = UPPER('"+ self.clave()+"')";	                     
	    	             tx.executeSql(consulta,[],
	    	             				function(tx,rs)
	    	             				  {
	    	             				    if(rs.rows.length >0)
	    	             				    {
	    	             				       var item = rs.rows.item(0);	    	             				       
	    	             				       $.mobile.ModelDocumento.codvend(item.codvend);	    	             				       
	    	             				       $.mobile.ModelMenu.descripuser(item.descrip);
                                                               self.verdepo(false);
	    	             				       self.descripuser(item.descrip);
	    	             				       self.codvenduser(item.codvend);
	    	             				       self.preciovend(item.preciovend);
	    	             				       self.preciovend1(item.preciovend1);
	    	             				       self.preciovend2(item.preciovend2);
	    	             				       self.preciovend3(item.preciovend3);
	    	             				       self.prevalece(item.precli);
	    	             				       self.negativo(item.negativo);
	    	             				       self.descuento(item.descuento);
	    	             				       self.nivel(item.nivel);
	    	             				       self.itemspedido(item.items);
	    	             				       self.autorizacredito(item.autorizacredito);
                                                               if (self.nivel() == '01')
                                                                 self.verdepo(true);


	    	             				       $.mobile.changePage('#menu');  	             				       	    	             				       
	    	             				    }
	    	             				    else
	    	             				    {
	    	             				       if ((self.codigo()==self.superusuario()) && (self.clave()==self.clavesuperusuario())){
	    	             				    	   $.mobile.ModelDocumento.codvend("001");	    	             				       
		    	             				       $.mobile.ModelMenu.descripuser("Super Usuario");
		    	             				       self.descripuser("Super Usuario");
		    	             				       self.codvenduser("001");
		    	             				       self.preciovend(-1);
		    	             				       self.preciovend1(-1);
		    	             				       self.preciovend2(-1);
		    	             				       self.preciovend3(-1);
		    	             				       self.prevalece(-1);
		    	             				       self.negativo(-1);
		    	             				       self.descuento(0);
		    	             				       self.nivel("01");
		    	             				       self.itemspedido(100);
		    	             				       self.autorizacredito(1);
	    	             				    	  $.mobile.changePage('#menu');
	    	             				       }
	    	             				       else
	    	             				          self.usuarioclaveMsg(true);
	    	             				    }
	    	             				  },
	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	    	             			  );
	                   }
              );
        
           
         }
	},
	  guardar: function() {		 
		  	$.mobile.SqLite.transaction(function(tx) {
		  		    var tcon;
		  		    if (self.opcion() == 'Si') {
		  		    	tcon = 1;
		  		    	self.ModoWEB(true);		  		    	
		  		    }
		  		    else{
		  		    	tcon = 0;		  	
		  		    	self.ModoWEB(false);		  		    	
		  		    }
					//var sql = 'DELETE FROM DATOSP';					
					//tx.executeSql(sql);				
					//sql = 'INSERT INTO DATOSP(direccion,puerto,tipocarga,tipocon,coddepo) VALUES(?,?,?,?,?)';
					//tx.executeSql(sql, [ self.IP(),self.Puerto(),self.TipoCarga(),tcon]);					
					sql = "UPDATE DATOSP SET direccion ='"+self.IP()+"', puerto = '"+self.Puerto()+"',tipocarga = "+self.TipoCarga()+", tipocon = "+tcon+", coddepo = '"+self.coddepo()+"', tieneimpreso = '"+self.TieneImpreso()+"',verimagen = '"+self.verimagen()+"'";
					tx.executeSql(sql);
				});
		  	self.getDatosServidor();
		  	//$.mobile.changePage('#menu');
			},

	  clicksalir: function() {
             navigator.app.exitApp();
	  },
	  
	  reiniciar: function() {
		  if (confirm("Esta seguro de reiniciar los datos de la aplicacion?")){
			  $.mobile.SqLite.createtables();
			  $.mobile.SqLite.transaction(function(tx) {
		  		   sql = "delete from documentos";
					tx.executeSql(sql);				
				});	    	
			  $.mobile.changePage('#login');			  
		  }
		  else{
			  
		  }
	  },
	  getDatosServidor: function() {
		  $.mobile.SqLite.transaction(function(tx) {
		  var consulta = "SELECT * FROM DATOSP LIMIT 1";
		  tx.executeSql(consulta,[],
         				function(tx,rs)
         				  {
         				    if(rs.rows.length >0)
         				    {
					                var item = rs.rows.item(0);
					                self.IP(item.direccion);
					                self.Puerto(item.puerto);
					                self.coddepo(item.coddepo);
					                self.TieneImpreso(item.TieneImpreso);
							self.verimagen(item.verimagen);
					                self.TipoCarga(item.tipocarga);
					                self.vendernegativo(item.vendernegativo);
					                if (item.tipocon == 1)
					                	{
					                	   self.opcion("Si");
					                	   self.ModoWEB(true);					                	   
					                	}
					                else
					                	{
					                	   self.opcion("No");
					                	   self.ModoWEB(false);					                	 
					                	}
					                
         				    }
			                self.direccionURL("http://"+self.IP()+":"+self.Puerto()+"/Service1.svc/");
					  },
         				function(tx,err){$.mobile.SqLite.error(tx,err)}
         			  );
	  });
	      setTimeout(function(){ console.log('');} ,1000);	      
	  },
	  probarconexion: function(){
		  self.direccionURL("http://"+self.IP()+":"+self.Puerto()+"/Service1.svc/");
		  $.mobile.loading('show');
   	     $.ajax(
    			  {
	    	         url: $.mobile.ModelLogin.direccionURL()+'HayConexion',	    	         
	                 type: 'GET',	                 
	                 contentType: 'application/json; charset=utf-8',
	                 dataType: "json",
	                 success: function(data) {
	                	if (data==0)
	                		{
	                	       alert('Link encontrado');		       	        	  
	                		}
	                 },
	                 error: function(msg) {
	                	alert('Link no encontrado'); 
	                	$.mobile.loading('hide');
	                 },
	                 beforeSend:function(){
	       	    	   $.mobile.loading('show');	       	    	   
	       	         },
	       	         complete:function(){
	       	        	$.mobile.loading('hide');
	       	         },
	                 async: true,
	                 cache: false 
	               }
    		   );
   	  }
    };  
     self.init();        
   })(jQuery);








