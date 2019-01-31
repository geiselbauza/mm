using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Configuration;
using System.Data.Linq.Mapping;
using System.Data.Linq;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;


namespace WcfRESTFullJSON
{
    public class Service1 : IService1
    {
        public List<Configuracion> ObtenerConfig(Parametro clave)
        {
            List<Configuracion> lista = new List<Configuracion>();            
            Configuracion propiedades = new Configuracion();            
            propiedades.codubic = ConfigurationManager.AppSettings["codubic"].ToString();
            propiedades.referencia = ConfigurationManager.AppSettings["referencia"].ToString();
            propiedades.ventasnegativo = ConfigurationManager.AppSettings["ventasnegativo"].ToString();            
            if (propiedades.codubic == null)
                propiedades.codubic = "01";
            if (propiedades.ventasnegativo == null)
                propiedades.ventasnegativo = "no";
            lista.Add(propiedades);
            return lista;
        }


        public List<Producto> ObtenerProductos(Parametro clave)
        {
            string consulta = ""; IEnumerable<Producto> results = null; string codubic = "01";
            string soloexistencia = ""; string whereExistencia = " "; string refere = "";


            if (ConfigurationManager.AppSettings["soloexistencia"] != null)
            {
                soloexistencia = ConfigurationManager.AppSettings["soloexistencia"].ToString();
                if (soloexistencia == "1") whereExistencia = " And e.existen>0 ";            
            }

            
            Configuracion propiedades = new Configuracion();

            if (ConfigurationManager.AppSettings["referencia"] != null)
            {
                propiedades.referencia = ConfigurationManager.AppSettings["referencia"].ToString();
                if (propiedades.referencia != null)
                {
                    refere = propiedades.referencia;
                    whereExistencia = " And a.refere='" + refere + "' ";
                }

            }
            

            if (clave.coddepo !="") 
             propiedades.codubic =clave.coddepo;
            else
             propiedades.codubic = ConfigurationManager.AppSettings["codubic"].ToString();


            if (propiedades.codubic != null)
                codubic = propiedades.codubic;
            codubic = codubic.Replace("'", ""); codubic = codubic.Replace("(", ""); codubic = codubic.Replace(")", ""); codubic = codubic.Trim(); 
             
            if (codubic !="")
            {
                whereExistencia = whereExistencia + " And e.codubic='" + codubic+"' ";
            }

            using (DataContext db = new DataContext(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString.ToString()))
            {
                try
                {
                    consulta = @"select a.CodProd as CodProd, IsNull(REPLACE(a.Descrip,'''',''),'') AS Descrip, IsNull(Precio1,0.0) As Precio1, 
                                 IsNull(Precio2,0.0) As Precio2, IsNull(Precio3,0.0) AS Precio3, IsNull(Monto,0.0) as iva, 
                                 IsNull(e.Existen,0.0) as existen, CostAct from saprod a inner join saexis e on (a.CodProd=e.CodProd ) left join SATAXPRD b on (a.CodProd = b.CodProd AND B.MONTO>0) 
                                 LEFT JOIN SATAXES T ON (T.CodTaxs=B.CodTaxs AND T.ESRETEN=0) Where a.activo = 1 and (a.CodProd like '%" + clave.parametro + "%' Or a.Descrip like '%" + clave.parametro + "%') " + whereExistencia;

                    
                    results = db.ExecuteQuery<Producto>(consulta);

                    return results.ToList();
                }
                catch (Exception ex)
                {
                    AddToFile(ex.Message + "     " + consulta, "ErrorCargarProducto");
                    return null;
                }

            }
        }

        public List<Clientes> ObtenerClientes(Parametro clave)
        {
            String cadSQL = @"select CodClie, REPLACE(Descrip,'''','') As Descrip, IsNull(ID3,'') As ID3, IsNull(CodZona,'') As CodZona, IsNull(CodVend,'') As CodVend, 
                              Isnull(LimiteCred,0) As LimiteCred, IsNull(DiasCred,0) AS DiasCred, IsNull(Saldo,0) As Saldo, IsNull(MtoMaxCred,0) AsMtoMaxCred, IsNull(Descto,0) As Descto, IsNull(TipoPVP,0) as TipoPVP, DiasTole from SACLIE Where Activo = 1 and CodVend <> '' And Codvend is Not Null And (CodClie like '%" + clave.parametro + "%' Or Descrip like '%" + clave.parametro + "%') Order By Descrip";
            using (DataContext db = new DataContext(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString.ToString()))
            {
                try
                {
                    IEnumerable<Clientes> results = db.ExecuteQuery<Clientes> (cadSQL);                    
                    //(@"select CodClie, Descrip, ID3, IsNull(CodZona,'') As CodZona, IsNull(CodVend,'') As CodVend, LimiteCred, DiasCred, Saldo, MtoMaxCred, Descto,IsNull(TipoPVP,0) as TipoPVP from SACLIE Where Activo = 1 And CodVend = '" + codvend + "'");
                    return results.ToList();                    
                }
                catch (Exception ex)
                {
                    AddToFile(ex.Message, "ErrorCargarClientes");
                    return null;
                }
            }
        }
        /*
        public List<Producto> ObtenerProductos(String clave)
        {
         string consulta = "";IEnumerable<Producto> results=null;
         
                        using (DataContext db = new DataContext(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString.ToString()))
                        {
                            try
                               {
                                  consulta = @"select Top 8000 a.CodProd as CodProd, IsNull(Descrip,'') AS Descrip, IsNull(Precio1,0.0) As Precio1, 
                                               IsNull(Precio2,0.0) As Precio2, IsNull(Precio3,0.0) AS Precio3, IsNull(Monto,0.0) as iva, 
                                               IsNull(a.Existen,0.0) as existen from saprod a left join SATAXPRD b on (a.CodProd = b.CodProd)
                                               Where a.CodProd like '%" + clave + "%' Or a.Descrip like '%" + clave + "%'";                                  
                                  results = db.ExecuteQuery<Producto>(consulta);
                                  return results.ToList();
                               }
                            catch (Exception ex)
                            {
                                AddToFile(ex.Message + "     " + consulta, "ErrorCargarProducto");
                                return null;
                            }
                            
                         }       
        }
        */

        public List<CxC> ObtenerCxC(Parametro clave)
        {
            List<CxC> lista = new List<CxC>();
            try
            {
                SqlConnection connection = new SqlConnection();
                connection.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection.Open();
                String consulta = @"SELECT  CASE  
                                            WHEN TIPOCXC=10 THEN 'Factura' 
                                            WHEN TIPOCXC=41 THEN 'Pago' 
                                            WHEN TIPOCXC=50 THEN 'Adelanto' 
                                            WHEN TIPOCXC IN (30,31)  THEN 'N/C' 
                                            WHEN TIPOCXC IN (20,21) THEN 'N/D' 
                                            WHEN TIPOCXC=50 THEN 'Anticipo'
                                            ELSE '---'  End As TipoDoc,
                                        A.NumeroD,CODCLIE,Document as Documento,
                                        CONVERT(VARCHAR(10), A.FechaE, 120) as FechaE ,CONVERT(VARCHAR(10), A.FechaV, 120) as FechaV,Monto,
                                        Saldo,ISNULL(I.Descrip1,'') As Descrip1,ISNULL(I.Cantidad,0) As Cantidad,
                                        ISNULL(I.TotalItem,0) As TotalItem,0 as NroLinea,  I.CodItem As CodItem, 
                                        ISNULL(I.Precio,0) As Precio, 0 As DescuentoParcial, 0 As iva                                        
                                    FROM SAACXC A LEFT JOIN SAITEMFAC I ON  (A.NumeroD=I.NumeroD AND I.TipoFac='A' AND A.TipoCxc=10) 
                                    WHERE SALDO > 0 AND TIPOCXC <> 50   ORDER BY A.CODCLIE,A.NUMEROD,A.FECHAE";

                SqlCommand cmd = new SqlCommand(consulta, connection);
                SqlDataReader rdr = cmd.ExecuteReader();
                rdr.Read();
                CxC NewCXC = null;
                Boolean hasItems = false;
                String NDF, NDI;
                NDF = "";

                while (rdr.Read())
                {
                    NDI = rdr.GetString(1);
                    if (NDF != NDI)
                    {
                        if (hasItems)
                            lista.Add(NewCXC);
                        NDF = rdr.GetString(1);
                        NewCXC = new CxC();
                        NewCXC.TipoDoc = rdr.GetString(0);
                        NewCXC.NumeroD = rdr.GetString(1);
                        NewCXC.CodClie = rdr.GetString(2);
                        NewCXC.Documento = rdr.GetString(3);
                        NewCXC.FechaE = rdr.GetString(4);
                        NewCXC.FechaV = rdr.GetString(5);
                        NewCXC.Monto = rdr.GetDecimal(6);
                        NewCXC.Saldo = rdr.GetDecimal(7);
                        hasItems = rdr.GetString(8) != "";
                        if (hasItems)
                            NewCXC.itemsCxC = new List<items>();
                        else
                        {
                            NewCXC.itemsCxC = null;
                            lista.Add(NewCXC);
                        }

                    }
                    if (hasItems)
                    {

                        items NewitemsCxC = new items();
                        NewitemsCxC.numerod = rdr.GetString(1);
                        NewitemsCxC.linea = 0;
                        NewitemsCxC.coditem = rdr.GetString(12);
                        NewitemsCxC.descrip = rdr.GetString(8);
                        NewitemsCxC.cantidad = rdr.GetDecimal(9);
                        NewitemsCxC.precio = rdr.GetDecimal(13);
                        NewitemsCxC.descuentoParcial = 0;
                        NewitemsCxC.iva = 0;
                        NewitemsCxC.totalitem = rdr.GetDecimal(10);
                        NewitemsCxC.tipodoc = rdr.GetString(0);
                        NewCXC.itemsCxC.Add(NewitemsCxC);

                    }

                                     
                }
                if (hasItems)
                    lista.Add(NewCXC); 
                rdr.Close(); cmd.Dispose(); connection.Close();
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorLeerCxC");
            }
            return lista;                 
        }



        public decimal ObtenerExistencia(string codprod)
        {
            decimal existencia = 0;
            try
              {
                SqlConnection connection = new SqlConnection();
                connection.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection.Open();
                String codubic = ConfigurationManager.AppSettings["codubic"].ToString();
                string consulta = @"Select SUM(ISNULL(e.existen,0)) - (ISNULL(p.compro,0)) as existen 
                                    From SAPROD p inner join SAEXIS e on (p.CodProd = e.CodProd) 
                                    Where p.CodProd = '" + codprod + "' and e.codubic in " + codubic + @"
                                    Group by p.compro";
                SqlCommand cmd = new SqlCommand(consulta, connection);
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                    existencia = rdr.GetDecimal(0);
            
                rdr.Close(); cmd.Dispose(); connection.Close();
              }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorCargarExistencia");
                existencia = -9999;
            }
            return existencia;
        }

        public int HayConexion()
        {
            return 0;
        }

        public bool IsNumeric(object Expression)
        {

            bool isNum;

            double retNum;

            isNum = Double.TryParse(Convert.ToString(Expression), System.Globalization.NumberStyles.Any, System.Globalization.NumberFormatInfo.InvariantInfo, out retNum);

            return isNum;

        }


        public decimal getParamUserD(String usuario, int modulo, int parametro, int nodata, int campo)
        {
            decimal res = -1;
            SqlConnection connection1 = null;
            SqlCommand cmd1 = null;
            SqlDataReader rdr1 = null;
            String sql = "";
            try
            {
                connection1 = new SqlConnection();
                connection1.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection1.Open();
                sql = @"DECLARE @RES VARCHAR(5) 
                        DECLARE @NIVEL VARCHAR(2) 
                        DECLARE @CodUsua varchar(10) 
                        DECLARE @Modulo INT 
                        DECLARE @Parametro INT 
                        DECLARE @NODATA INT 
                        DECLARE @CAMPO INT 
                        DECLARE @IDATA INT 
                        DECLARE @SDATA varchar(20) 
                        DECLARE @FDATA DECIMAL(28,3) 
                        SET @CodUsua = '"+usuario+@"' 
                        SET @Modulo = "+modulo+@" 
                        SET @Parametro = " + parametro + @" 
                        SET @NODATA = " + nodata + @" 
                        SET @CAMPO = " + campo + @" 
                        IF EXISTS(select * from SSPARD WHERE CodParm = '_U_'+@CodUsua AND Modulo = @Modulo)
                          SELECT @IDATA = IData, @SDATA = SData, @FDATA = FData from SSPARD WHERE CodParm = '_U_'+@CodUsua AND Modulo = @Modulo AND Parametro=@Parametro AND NoData = @NODATA
                        ELSE
                         BEGIN
                          select @NIVEL = RTRIM(LTRIM(SUBSTRING(SDATA2,193,1)+SUBSTRING(SDATA1,77,1))) from ssusrs where CodUsua = @CodUsua
                          IF EXISTS(select * from SSPARD WHERE CodParm = '_N_'+@NIVEL AND Modulo = @Modulo)
                            select @IDATA = IData, @SDATA = SData, @FDATA = FData from SSPARD WHERE CodParm = '_N_'+@NIVEL AND Modulo = @Modulo AND  Parametro=@Parametro AND NoData = @NODATA
                         END
                        SELECT CASE WHEN @CAMPO = 1 THEN ISNULL(@IDATA,-1) WHEN @CAMPO = 2 THEN ISNULL(@FDATA,-1) WHEN @CAMPO = 3 THEN ISNULL(@SDATA,-1)  END AS VALOR";
                cmd1 = new SqlCommand(sql, connection1);
                rdr1 = cmd1.ExecuteReader();
                rdr1.Read();
                if (rdr1.HasRows)
                  res = rdr1.GetDecimal(0);
                rdr1.Close(); cmd1.Dispose(); connection1.Close();
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorLeerParametrosUsuariosDetalles");
                rdr1.Close(); cmd1.Dispose(); connection1.Close();
            }
            return res;            
        }

        public decimal getParamUserM(String usuario, int modulo, int parametro)
        {
            int res = -1;
            SqlConnection connection1 = null;
            SqlCommand cmd1 = null;
            SqlDataReader rdr1 = null;
            String sql = "";
            try
            {
                connection1 = new SqlConnection();
                connection1.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection1.Open();
                sql = @"DECLARE @NIVEL VARCHAR(2) 
                        DECLARE @CodUsua varchar(10) 
                        DECLARE @Modulo INT 
                        DECLARE @Parametro INT 
                        DECLARE @ACTIVO INT 
                        SET @CodUsua = '" + usuario + @"' 
                        SET @Modulo = " + modulo + @" 
                        SET @Parametro = " + parametro + @"                         
                        IF EXISTS(select * from SSPARM WHERE CodParm = '_U_'+@CodUsua AND Modulo = @Modulo)
                         SELECT @ACTIVO = ACTIVO from SSPARM WHERE CodParm = '_U_'+@CodUsua AND Modulo = @Modulo AND Parametro=@Parametro
                        ELSE
                         BEGIN
                          select @NIVEL = RTRIM(LTRIM(SUBSTRING(SDATA2,193,1)+SUBSTRING(SDATA1,77,1))) from ssusrs where CodUsua = @CodUsua
                          IF EXISTS(select * from SSPARM WHERE CodParM = '_N_'+@NIVEL AND Modulo = @Modulo)
                            select @ACTIVO = ACTIVO from SSPARM WHERE CodParm = '_N_'+@NIVEL AND Modulo = @Modulo AND  Parametro=@Parametro
                         END
                        SELECT ISNULL(@ACTIVO,-1) AS VALOR";
                cmd1 = new SqlCommand(sql, connection1);
                rdr1 = cmd1.ExecuteReader();
                rdr1.Read();
                if (rdr1.HasRows)
                    res = rdr1.GetInt32(0);
                rdr1.Close(); cmd1.Dispose(); connection1.Close();
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorLeerParametrosUsuariosMaestros");
                rdr1.Close(); cmd1.Dispose(); connection1.Close();
            }
            return res;

        }


        public List<Usuarios> ObtenerUsuarios(Parametro clave)
        {
            List<Usuarios> lista = new List<Usuarios>();
            string codusua = "";
            try
            {
                SqlConnection connection = new SqlConnection();
                connection.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection.Open();
                string consulta = @"select codusUa,descrip,
                                   RTRIM(LTRIM(SUBSTRING(SDATA3,175,1)+
                                   SUBSTRING(SDATA1,33,1)+
                                   SUBSTRING(SDATA2,90,1)+
                                   SUBSTRING(SDATA3,14,1)+
                                   SUBSTRING(SDATA1,207,1)+
                                   SUBSTRING(SDATA3,111,1)+
                                   SUBSTRING(SDATA3,145,1)+
                                   SUBSTRING(SDATA2,180,1)+
                                   SUBSTRING(SDATA2,9,1)+
                                   SUBSTRING(SDATA3,53,1))) AS Clave,
                                   ISNull(CodVend,'') AS CodVend,
                                   RTRIM(LTRIM(SUBSTRING(SDATA2,193,1)+
                                   SUBSTRING(SDATA1,77,1))) AS Nivel
                                   from ssusrs   
                                   where CodVend is not null And CodVend <> ''";
                SqlCommand cmd = new SqlCommand(consulta, connection);
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    codusua = rdr.GetString(0);                    
                    int precio1 = (int)getParamUserD(codusua, 108, 29, 1, 1);
                    int precio2 = (int)getParamUserD(codusua, 108, 29, 2, 1);
                    int precio3 = (int)getParamUserD(codusua, 108, 29, 3, 1);
                    int descuento = (int)getParamUserD(codusua, 108, 31, 1, 2);
                    int negativo = (int)getParamUserM(codusua, 901, 18);
                    int Items = (int)getParamUserD(codusua, 108, 92,1,1);                    
                    int autorizacredito = (int)getParamUserM(codusua, 901, 19);
                    Usuarios user = new Usuarios();
                    user.Clave = rdr.GetString(2);
                    user.CodUsua = codusua;
                    user.CodVend = rdr.GetString(3);
                    user.Descrip = rdr.GetString(1);
                    user.Negativo = negativo;

                    if (ConfigurationManager.AppSettings["mostrarprecio1"] != null)
                        user.PrecioVend1 = Int32.Parse(ConfigurationManager.AppSettings["mostrarprecio1"].ToString());
                    else
                        user.PrecioVend1 = precio1;

                    if (ConfigurationManager.AppSettings["mostrarprecio2"] != null)
                        user.PrecioVend2 = Int32.Parse(ConfigurationManager.AppSettings["mostrarprecio2"].ToString());
                    else
                        user.PrecioVend2 = precio2;

                    if (ConfigurationManager.AppSettings["mostrarprecio3"] != null)
                        user.PrecioVend3 = Int32.Parse(ConfigurationManager.AppSettings["mostrarprecio3"].ToString());
                    else
                        user.PrecioVend3 = precio3;
                   
                    user.Descuento = descuento;
                    user.Nivel = rdr.GetString(4);
                    user.Items = Items;
                    user.AutorizaCredito = autorizacredito;
                    lista.Add(user);                
                }
                rdr.Close(); cmd.Dispose(); connection.Close();                
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorLeerParametrosUsuarios");
            }
            return lista;            
        }
        /*
        public List<Clientes> ObtenerClientes()
        {

            using (DataContext db = new DataContext(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString.ToString()))
            {
                try{
                    IEnumerable<Clientes> results = db.ExecuteQuery<Clientes>
                     (@"select CodClie, Descrip, IsNull(ID3,'') As ID3, IsNull(CodZona,'') As CodZona, IsNull(CodVend,'') As CodVend, Isnull(LimiteCred,0) As LimiteCred, IsNull(DiasCred,0) AS DiasCred, IsNull(Saldo,0) As Saldo, IsNull(MtoMaxCred,0) AsMtoMaxCred, IsNull(Descto,0) As Descto, IsNull(TipoPVP,0) as TipoPVP from SACLIE Where Activo = 1 and CodVend <> '' And Codvend is Not Null");
                     //(@"select CodClie, Descrip, ID3, IsNull(CodZona,'') As CodZona, IsNull(CodVend,'') As CodVend, LimiteCred, DiasCred, Saldo, MtoMaxCred, Descto,IsNull(TipoPVP,0) as TipoPVP from SACLIE Where Activo = 1 And CodVend = '" + codvend + "'");
                    return results.ToList();
                }
                catch (Exception ex)
                {
                    AddToFile(ex.Message, "ErrorCargarClientes");
                    return null;
                }
            }
        }
        /*
        public Stream ObtenerUsuarios()
        {

                try
                {
                    Piramide a;
                    string cad;
                    a = new Piramide();
                    a.ObtenerUsuarios(out cad);                    
                    WebOperationContext.Current.OutgoingResponse.ContentType = "application/xml; charset=utf-8";
                    cad = "<?xml version='1.0' encoding='UTF-8' ?><!DOCTYPE Edit_Mensaje SYSTEM 'Edit_Mensaje.dtd'><Edit_Mensaje><Mensaje><Remitente><Nombre>Nombre del remitente</Nombre></Remitente></Mensaje></Edit_Mensaje>";
                    return new MemoryStream(Encoding.UTF8.GetBytes(cad));
                }
                catch (Exception ex)
                {
                    AddToFile(ex.Message, "ErrorCargarClientes");
                    return null;
                }
            
        }

        public string ObtenerUsuarios3()
        {

            try
            {
                Piramide a;
                string cad;
                a = new Piramide();
                a.ObtenerUsuarios(out cad);                
                return cad;
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorCargarClientes");
                return null;
            }

        }

        */


        public List<Banco> ObtenerBancos(Parametro clave)
        {

            using (DataContext db = new DataContext(ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString.ToString()))
            {
                try
                {
                    IEnumerable<Banco> results = db.ExecuteQuery<Banco>
                    (@"select CodBanc, Descripcion from sbbanc Where Descripcion is not null");
                    return results.ToList();
                }
                catch (Exception ex)
                {
                    AddToFile(ex.Message, "ErrorCargarBancos");
                    return null;
                }
            }
        }


        public static void AddToFile(string contents,string archivo)
        {
            try
            {
                //FileStream fs = new FileStream(AppDomain.CurrentDomain.BaseDirectory + "depurar.txt", FileMode.OpenOrCreate, FileAccess.Write);
                if (!(Directory.Exists(AppDomain.CurrentDomain.BaseDirectory+"Querys")))
                    Directory.CreateDirectory(AppDomain.CurrentDomain.BaseDirectory + "Querys");
                string dir = AppDomain.CurrentDomain.BaseDirectory + "Querys\\" + archivo + ".txt";                
                FileStream fs = new FileStream(dir, FileMode.OpenOrCreate, FileAccess.Write);
                StreamWriter sw = new StreamWriter(fs);
                sw.BaseStream.Seek(0, SeekOrigin.End);
                sw.WriteLine(DateTime.Now.ToString() + " " + contents);
                sw.Flush();
                sw.Close();
            }
            catch
            {
            }
        }

        public int EnviarPedidos(Pedidos data)
        {
            int retorno = 0;
            string strPedido = "";
            string fecha = "";
            try
            {
                SqlConnection connection = new SqlConnection();
                SqlCommand cmd;
                SqlDataReader rdr;
                connection.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection.Open();
                decimal monto = 0, mtotax = 0, iva = 0, desctop = 0, texento = 0, tgravable = 0;
                string consulta = ""; string strSAFACT = ""; string strSAITEMFAC = ""; string strValues = ""; 
                string strCompro = ""; string strprxpedido = "";

                int linea = 0;

                //string tipoFac = "Z"; //JEISER
 
                string tipoFac = "E";
                
                string codesta = "estaMobil";

                string codusua = "usuaMobil";

                string codclie = data.codclie;

                string codvend = data.codvend;

                string codubic = "01";

                string[] xDescrip;
                int xi;
                int xj;
                int xk;
                int xN;
                int xMax;
                xDescrip = new string[10];
            
                Configuracion propiedades = new Configuracion();
                propiedades.codubic = ConfigurationManager.AppSettings["codubic"].ToString();
                if (propiedades.codubic != null)
                    codubic = propiedades.codubic;
                codubic = codubic.Replace("'", "");
                codubic = codubic.Replace("(", "");
                codubic = codubic.Replace(")", "");
                codubic = codubic.Trim();

                consulta = @"set dateformat ymd select Descrip, ID3, (CASE WHEN  GETDATE() < cast('2020-01-01' as datetime) THEN 0 ELSE 1 END) as activo, isnull(direc1,'') as direc1, ISNULL(telef, '') as telef, isnull(diascred,0) as diascred, isnull(Descto,0) as Descto, isnull(direc2,'') as direc2 from SACLIE Where CodClie = '" + codclie + "'";
                cmd = new SqlCommand(consulta, connection);
                rdr = cmd.ExecuteReader();
                rdr.Read();
                
                string descrip = rdr.GetString(0);
                string id3 = rdr.GetString(1);
                int activo = rdr.GetInt32(2);
                string direcclie = rdr.GetString(3);
                string telefclie = rdr.GetString(4);
                int diascred = rdr.GetInt32(5);
                decimal desctoclie = rdr.GetDecimal(6);
                string direcclie2 = rdr.GetString(7);
                string numd = @"DECLARE @PRXDES INTEGER DECLARE @NUMEROD VARCHAR(20) 
                                SELECT @PRXDES=VALUEINT FROM SACORRELSIS WHERE CODSUCU='00000' AND FIELDNAME='PRXPEDIDO' 
                                SELECT @NUMEROD=REPLICATE('0',VALUEINT-LEN(@PRXDES))+CAST(@PRXDES AS VARCHAR(20))  FROM SACORRELSIS WHERE CODSUCU='00000' AND FIELDNAME='LENCORREL'";
                
                if (activo == 0)
                    foreach (var item in data.items)
                    {
                        // Monto Total...
                        monto += item.precio * item.cantidad;
                        // Monto Total Impuesto...
                        consulta = @"select sp.CodProd, Descrip, IsNull(Monto,0) As Monto, sp.CostAct, sp.existen from SAPROD sp left join SATAXPRD st on (sp.CodProd=st.CodProd) Where sp.CodProd  = '" + item.coditem + "'";                        
                        rdr.Close();
                        cmd = new SqlCommand(consulta, connection);
                        rdr = cmd.ExecuteReader();
                        rdr.Read();
                        iva = rdr.GetDecimal(2) / 100;
                        mtotax += ((item.precio * item.cantidad) - item.descuentoParcial) * iva;
                        //  Descripcion del Item
                        string descrip1 = rdr.GetString(1).ToString();                        
                        // Cantidad del Item
                        string strcantidad = item.cantidad.ToString("0.00", CultureInfo.InvariantCulture);
                        // Total Item
                        decimal totalItem = item.cantidad * item.precio;
                        string strtotalItem = totalItem.ToString("0.00", CultureInfo.InvariantCulture);

                        string codubicI;
                        if (item.codubic != "") 
                           codubicI = item.codubic;
                        else
                            codubicI = codubic;
                        

                        // Monto Total Descuento...
                        desctop += item.descuentoParcial;
                        // Monto Exento...
                        if (iva == 0) texento += monto;
                        if (iva > 0) tgravable += ((item.precio * item.cantidad) - item.descuentoParcial);
                        // Costo Actual...
                        decimal costact = rdr.GetDecimal(3);
                        string strcostact = costact.ToString("0.00", CultureInfo.InvariantCulture);
                        // Descuento del Item...
                        string strdescto = item.descuentoParcial.ToString("0.00", CultureInfo.InvariantCulture);
                        // Precio Item...
                        string strprecio = item.precio.ToString("0.00", CultureInfo.InvariantCulture);
                        // Existencia Anterior...
                        decimal existant = rdr.GetDecimal(4);
                        string strexistant = item.precio.ToString("0.00", CultureInfo.InvariantCulture);
                        rdr.Close();
                        linea += 1;
                        //Insert SAITEMFACT



                  
                        for (xi = 0; xi < 10; xi++)
                        {
                            xDescrip[xi] = "";
                        }

                        xj = 0;
                        xi = 0;
                        xk = 0;
                        xN = item.detalleprd.Length;
                        xMax = 40;

                        while ((xj < xN) && (xj <= 360))
                        {
                            if (xk >= xMax) { xi++; xk = 0; }
                            xDescrip[xi] = xDescrip[xi] + item.detalleprd[xj];
                            xj++;
                            xk++;
                        }



                        strSAITEMFAC += @"INSERT INTO SAITEMFAC(TIPOFAC, NUMEROD,NROLINEA,NROLINEAC,CODITEM,
                                                   CODUBIC,DESCRIP1,REFERE,SIGNO,CANTIDAD,
                                                   TOTALITEM,COSTO,DescTo,PRECIO, FECHAE,
                                                   CodVend,CantMayor,ExistAnt,CodSucu,descrip2,descrip3,descrip4,descrip5,descrip6,descrip7,descrip8,descrip9,descrip10) Values " +
                                        @"('" + tipoFac + "',@NUMEROD,'" + linea + "','0','" + item.coditem + "','" +
                                         codubicI + "','" + descrip1 + "',' ','1','" + strcantidad + "','" +
                                         strtotalItem + "','" + strcostact + "','" + strdescto + "','" + strprecio + "',GETDATE(),'" +
                                         data.codvend + "','1','" + strexistant + "','00000','" + xDescrip[0] + "','" + xDescrip[1]+ "','" + xDescrip[2]+ "','" + xDescrip[3]+ "','" + xDescrip[4]+ "','" + xDescrip[5]+ "','" + xDescrip[6]+ "','" + xDescrip[7]+ "','" + xDescrip[8]+"') ";
                        
                        strCompro += @"UPDATE SAPROD SET COMPRO = COMPRO + " + strcantidad + " WHERE CODPROD = '" + item.coditem + "' ";
                    }

                //strValues = strValues.Remove(strValues.Length - 1, 1);

                string strmonto = monto.ToString("0.00", CultureInfo.InvariantCulture);
                string strmtotax = mtotax.ToString("0.00", CultureInfo.InvariantCulture);
                //string strdesctop = desctop.ToString("0.00", CultureInfo.InvariantCulture);
                string strdesctop = "0.0";
                string strgravable = tgravable.ToString("0.00", CultureInfo.InvariantCulture);
                string strtexento = texento.ToString("0.00", CultureInfo.InvariantCulture);
                decimal sbt = monto - desctop + mtotax;
                string strtotal = sbt.ToString("0.00", CultureInfo.InvariantCulture);
                string strDescto1 = desctop.ToString("0.00", CultureInfo.InvariantCulture);
                string observacion = "";



                for (xi = 0; xi < 10; xi++)
                {
                    xDescrip[xi] = "";
                }

                xj = 0;
                xi = 0;
                xk = 0;
                xN = data.observacion.Length;
                xMax = 40;

                while ((xj < xN) && (xj <= 360))
                {
                    if (xk >= xMax) { xi++; xk = 0; }
                    xDescrip[xi] = xDescrip[xi] + data.observacion[xj];
                    xj++;
                    xk++;
                }

               



                //Insert SAFACT
                strSAFACT = @"INSERT INTO SAFACT(TIPOFAC, NUMEROD, CODESTA, CODUSUA, SIGNO, FECHAT, FACTOR,CODCLIE,
                         CODVEND,CODUBIC,DESCRIP, ID3, Monto, MtoTax,DesctoP,
                         TGravable,TEXENTO, FECHAE,FechaV,MtoTotal,FECHAI,Descto1,
                         TotalPrd,Credito,EsCorrel, direc1,telef,direc2,CodSucu,Notas1,Notas2,Notas3,Notas4,Notas5,Notas6,Notas7,Notas8,Notas9,Notas10) 
                         Values('" + tipoFac + "',@NUMEROD,'" + codesta + "','" + codusua + "',1,GETDATE(),'1.00','" + codclie + "','"
                                      + codvend + "','" + codubic + "','" + descrip + "','" + id3 + "','" + strmonto + "','" + strmtotax + "','" + strdesctop + "','"
                                      + strgravable + "','" + strtexento + "',GETDATE(),GETDATE()+" + diascred + ",'" + strtotal + "',GETDATE(),'" + strDescto1 + "','"
                                      + strmonto + "','" + strtotal + "','1','" + direcclie + "','" + telefclie + "','" + direcclie2 + "','00000','" + xDescrip[0] + "','" + xDescrip[1] + "','" + xDescrip[2] + "','" + xDescrip[3] + "','" + xDescrip[4] + "','" + xDescrip[5] + "','" + xDescrip[6] + "','" + xDescrip[7] + "','" + xDescrip[8] + "','" + xDescrip[9] + "')";

                //Insert SAITEMFACT
                /*strSAITEMFAC = @"INSERT INTO SAITEMFAC(TIPOFAC, NUMEROD,NROLINEA,NROLINEAC,CODITEM,
                                                   CODUBIC,DESCRIP1,REFERE,SIGNO,CANTIDAD,
                                                   TOTALITEM,COSTO,DescTo,PRECIO, FECHAE,
                                                   CodVend,CantMayor,ExistAnt) Values ";
                strSAITEMFAC = strSAITEMFAC + strValues;*/

                //Update SACORRELSIS
                strprxpedido = "UPDATE SACORRELSIS SET VALUEINT=VALUEINT+1 WHERE CODSUCU='00000' AND FIELDNAME='PRXPEDIDO'";
                
                string strCorreo = "Insert Into DOCUMENTOSEMAIL(FECHA,TIPODOC,NUMEROD,ESTATUS) "+
                                   "VALUES(GETDATE(),'"+tipoFac+"',@NumeroD,'A')";


                //Sentencia SQL Final
                string strPedidoaux  = "Begin Transaction " + numd + " " + strSAFACT + " " + strSAITEMFAC + " " + strCompro + " " + strprxpedido + " " + strCorreo+ " Commit Transaction";
                strPedido = strPedidoaux.Replace('"', '.');               
                
                
                
                fecha = DateTime.Now.ToString("dd MM yyyy HH mm ss");
                //AddToFile(strPedido, "strPedido" + fecha);
                rdr.Close();
                cmd = new SqlCommand(strPedido, connection);
                cmd.ExecuteNonQuery();
                connection.Close();
                //retorno = "Pedido Recibido bajo el numero " + numerod;
                retorno = 1;
            }
            catch (Exception e)
            {
                //retorno = "Error al ingresar pedido...";
                AddToFile(strPedido+"--"+e.Message, "strPedido" + fecha);
                retorno = 0;
            }
            return retorno;
        }

        public int EnviarListaPDF(Parametro listaPrecio)
        {
            int retorno = -1; 
            string parametros = listaPrecio.parametro;
            string empresa = "";
            if (DateTime.Now.DayOfWeek == DayOfWeek.Monday) 
            {
                if (!String.IsNullOrEmpty(ConfigurationManager.AppSettings["empresa"]))
                {
                    empresa = ConfigurationManager.AppSettings["empresa"];
                    if (empresa != "venmanisanjorge") return -1;
                }
            }
                try
                {
                    SqlConnection connection = new SqlConnection();
                    SqlCommand cmd;
                    connection.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                    connection.Open();
                    string strLista = "Insert Into DOCUMENTOSEMAIL(FECHA,TIPODOC,NUMEROD,ESTATUS) " +
                                           "VALUES(GETDATE(),'LP','" + parametros + "','A')";
                    cmd = new SqlCommand(strLista, connection);
                    cmd.ExecuteNonQuery();
                    retorno = 1;
                }
                catch (Exception ex)
                {
                    AddToFile(ex.Message, "Error Procesar Lista de Precios");
                    retorno = -1;
                }
           
            return retorno;
        }

        public int EnviarrAnaVenCli(Parametro Vendedor)
        {
            int retorno = 0;
            string parametros = Vendedor.parametro;
            try
            {
                SqlConnection connection = new SqlConnection();
                SqlCommand cmd;
                connection.ConnectionString = ConfigurationManager.ConnectionStrings["CadenaConexion"].ConnectionString;
                connection.Open();
                string strLista = "Insert Into DOCUMENTOSEMAIL(FECHA,TIPODOC,NUMEROD,ESTATUS) " +
                                       "VALUES(GETDATE(),'AV','" + parametros + "','A')";
                cmd = new SqlCommand(strLista, connection);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "Error Procesar Analisis de Vencimiento");
                retorno = -1;
            }
            return retorno;
        }

    /*public int EnviarPedidos2(Stream data)
        {
            StreamReader reader = new StreamReader(data);            
            string res = reader.ReadToEnd();
            reader.Close();
            reader.Dispose();

            try
            {
                Piramide a;                
                a = new Piramide();
                a.EnviarPedidos(res);
                GC.Collect();                
            }
            catch (Exception ex)
            {
                AddToFile(ex.Message, "ErrorCargarClientes");
                return 0;
            }
            AddToFile(res, "Prueba");
            return 1;
        }*/

    } 
}
