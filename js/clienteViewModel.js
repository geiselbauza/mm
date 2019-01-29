$(function() {
    var self =  ClienteViewModel = {

        clientes: ko.observableArray([]),
        clientetofind: ko.observable(""),
        
        
       InsertarCliente: function (codigo, descripcion)
         {
	       this.codigo = ko.observable(codigo);
	       this.descripcion = ko.observable(descripcion);
         },
     
        keyOnEnter: function(data, event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode == 13) {
                self.clientes.removeAll();
                $.mobile.SqLite.transaction
                 (
                   function(tx)
	                   {
	                     var consulta = "SELECT * FROM CLIENTES WHERE CODIGO LIKE '%"+self.clientetofind()+"%' OR DESCRIP LIKE '%"+self.clientetofind()+"%'";
	                     	                     
	                     //alert(consulta);        
	    	             tx.executeSql(consulta,[],
	    	             				function(tx,rs)
	    	             				  {
	    	             				    if(rs.rows.length >0)
	    	             				    {
	    	             				     	for(var i=0; i<rs.rows.length;i++){								                
								                var item = rs.rows.item(i);
                                                 self.clientes.push(new self.InsertarCliente(item.codigo,item.descrip));
								                }
	    	             				    }
	    	             				    else
	    	             				    {
	    	             				      alert("No Existen Datos...");
	    	             				    }
	    	             				  },
	    	             				function(tx,err){$.mobile.SqLite.error(tx,err)}
	    	             			  );
	                   }
                 );                
            }
            return true;
        }
        
    };        
    alert('Aplicando');
    ko.applyBindings(self);
   });
	
	    
