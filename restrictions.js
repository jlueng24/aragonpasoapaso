




		

var masInfo = new Array();
var masInfoDefault = "Para más información: <a href=\"mailto:igear@aragon.es\" title=\"Email de contacto\" class=\"enlace\">igear@aragon.es</a>";

addGrupo("Datos generales");
addGrupo("Datos temáticos");

addSubgrupo(0, "");
addSubgrupo(1, "Series de Ortofotos");
addSubgrupo(1, "Ordenación del Territorio");
addSubgrupo(1, "Educación");
addSubgrupo(1, "Hidrografía");
addSubgrupo(1, "Agricultura y Ganadería");
addSubgrupo(1, "Medio Ambiente");
addSubgrupo(1, "Usos del suelo");
addSubgrupo(1, "Industria, Energía y Minas");
addSubgrupo(1, "Transporte");
addSubgrupo(1, "Cuadrículas de referencia");
addSubgrupo(1, "Mapas de Susceptibilidad de Riesgos");
addSubgrupo(1, "Senderos");
addSubgrupo(1, "Información pública");
addSubgrupo(1, "Urbanismo");
addSubgrupo(1, "Patrimonio Cultural");
addSubgrupo(1, "Sanidad");
addSubgrupo(1, "Telecomunicaciones");

addRestriction(0, 0, "Información General", "Información General", false);
addRestriction(0, 0, "Ficheros descargables", "<img border=\"0\" src=\"/lib/IDEAragon/themes/default/images/descargaMini.png\">&nbsp;Ficheros descargables", true, "Ficheros descargables");

addRestriction(1, 0, "Series de Ortofotos", "Fechas de Vuelo", true);
addRestriction(1, 1, "Directrices Parciales", "Directrices Parciales", true);
addRestriction(1, 1, "Dominios de Paisaje", "Dominios de Paisaje", true);
addRestriction(1, 1, "Calidad 1:100.000", "Calidad 1:100.000", true);
addRestriction(1, 1, "Aptitud Homogeneizada", "Aptitud Homogeneizada", true);
addRestriction(1, 1, "Calidad Homogeneizada", "Calidad Homogeneizada", true);
addRestriction(1, 1, "Fragilidad Homogeneizada", "Fragilidad Homogeneizada", true);
addRestriction(1, 1, "Unidades de Paisaje", "Unidades de Paisaje", true);
addRestriction(1, 1, "Tipos de Paisaje", "Tipos de Paisaje", true);
addRestriction(1, 1, "Recorridos y miradores de Paisaje", "Recorridos y miradores de Paisaje", true);
addRestriction(1, 2, "Educación", "Zonas y centros educativos", true);
addRestriction(1, 3, "Ríos", "Ríos", true);
addRestriction(1, 4, "REGA", "Explotaciones ganaderas", true);
addRestriction(1, 5, "Agua", "Agua", true);
addRestriction(1, 5, "Biodiversidad", "Biodiversidad", true);
addRestriction(1, 5, "Humedales", "Humedales", true);
addRestriction(1, 5, "Red Natural de Aragón", "Red Natural de Aragón", true);
addRestriction(1, 5, "Gestores de residuos", "Gestores de residuos", true);
addRestriction(1, 5, "Caza y Pesca", "Caza y Pesca", true);
addRestriction(1, 5, "Gestión forestal", "Gestión forestal", true);
addRestriction(1, 5, "Ámbitos de Medio Ambiente", "Ámbitos de Medio Ambiente", true);
addRestriction(1, 5, "Calidad", "Calidad", true);
addRestriction(1, 6, "CORINE Land Cover", "CORINE Land Cover", true);
addRestriction(1, 6, "SIOSE", "SIOSE", true);
addRestriction(1, 7, "Catastro Minero y Suelo Industrial de Aragón", "Catastro Minero y Suelo Industrial de Aragón", true);
addRestriction(1, 7, "Energía Eólica", "Energía Eólica", true);
addRestriction(1, 8, "Carreteras", "Carreteras", true);
addRestriction(1, 9, "Cuadrícula 1:50.000", "Cuadrícula 1:50.000", true);
addRestriction(1, 9, "Cuadrícula UTM 10 Km", "Cuadrícula UTM 10 Km", true);
addRestriction(1, 10, "Susceptibilidad", "Susceptibilidad", true);
addRestriction(1, 11, "Senderos", "Senderos", true);
addRestriction(1, 12, "Cartografía en plazo de Información pública", "Cartografía en plazo de Información pública", true);
addRestriction(1, 12, "Concentración parcelaria en Información pública", "Concentración parcelaria en Información pública", true);
addRestriction(1, 13, "Figura de Planeamiento", "Figura de Planeamiento", true);
addRestriction(1, 13, "Información de Planeamiento", "Información de Planeamiento", true);
addRestriction(1, 14, "Patrimonio Cultural", "Patrimonio Cultural", true);
addRestriction(1, 15, "Sanidad", "Sanidad", true);
addRestriction(1, 16, "Acceso a internet", "Acceso a internet", true);

masInfo[1][7] ="<b>Tabla de equivalencias de Procedencia:</b><br> 1 - ANEXO II <br> 2 - ANEXO III <br> 3 - REGIMEN GENERAL <br> 4 - PEREA <br> 5 - DISPOSICIÃ“N TRANSITORIA II <br> 6 - I+D <br><br><b>Tabla de equivalencias de Estado:</b><br> 0 - Solicitud de autorización administrativa <br> 1 - Admitido a trámite <br> 2 - Con autorización administrativa previa <br> 3 - Con autorización administrativa de construcción <br> 4 - En funcionamiento <br> 5 - Sin solicitud <br><br><b>Tabla de equivalencias de Origen de la protección:</b><br> 0 - No protegidas <br> 1 - Anexo II <br> 2 - Anexo III <br> 3 - Acceso y Conexión <br>"

masInfo[1][13] = "<b>Observaciones:</b><br>Cotejar la capa cartográfica con el acuerdo del Consejo Provincial de Urbanismo correspondiente dada la posibilidad de existencia de ámbitos suspendidos o sujetos a prescripción.<br><br>Para más información: <b>siua@aragon.es</b> o <b>//idearagon.aragon.es/SIUa</b><br><br><b>Clasificación de suelo:</b><br> SU-C Suelo Urbano Consolidado <br> SU-NC Suelo Urbano No Consolidado <br> SUZ-D Suelo Urbanizable Delimitado <br> SUZ-ND Suelo Urbanizable No Delimitado <br> SNU-G Suelo No Urbanizable GenÃ©rico <br> SNU-E Suelo No Urbanizable Especial <br><br><b>Uso Global o Tipo de Suelo No Urbanizable:</b><br> R o RESIDENCIAL: Uso Residencial <br> I o INDUSTRIAL: Uso Industrial <br> T o TERCIARIO: Uso Terciario<br> SGEL o SGZV: Sistema General de Espacios Libres o Zona Verde <br> SGEQ: Sistema General de Equipamientos <br> SGINF: Sistema General de Infraestrcuturas <br> SGUR: Sistema General de Servicios Urbanos <br> EL o ZV: Espacio Libre o Zona Verde <br> EQ: Equipamiento <br> INF: Infraestructuras si la clase de suelo es SNU-E de Protección de Infraestructuras <br> CA: Suelos No Urbanizable Especial - Curso de Agua <br> RI: Suelos No Urbanizable Especial - Riesgo<br>EA: Suelos No Urbanizable Especial - Espacio Agropecuario <br> EN o Natural-Cultural: Suelos No Urbanizable Especial - Espacio Natural o Cultural <br> DomPubInf: Suelos No Urbanizable Especial - Dominio Público de Infraestructura<br> Generico: Suelo No Urbanizable GenÃ©rico<br>";

var urlWFS_EDUCA = server + "/AragonReferencia?REQUEST=GetFeatureInfo&VERSION=1.0.0&SRS=EPSG:25830&QUERY_LAYERS=TROIDES&INFO_FORMAT=text/xml&FEATURE_COUNT=200";
urlWFS_EDUCA = server + "/AragonReferencia?REQUEST=GetFeatureInfo&VERSION=1.0.0&SRS=EPSG:25830&QUERY_LAYERS=TROIDES&INFO_FORMAT=text/xml&FEATURE_COUNT=200";

var urlWFS_IDEMA = server + "/Visor2D?SERVICE=WFS&REQUEST=GetFeature&OUTPUTFORMAT=application/json&VERSION=1.0.0&SRS=EPSG:25830&MAXFEATURES=50&&EXCEPTIONS=application/json&TYPENAME=";
var urlWFS_Visor2D = server + "/Visor2D?SERVICE=WFS&REQUEST=GetFeature&OUTPUTFORMAT=application/json&VERSION=1.0.0&SRS=EPSG:25830&MAXFEATURES=50&&EXCEPTIONS=application/json&TYPENAME=";

addWFSToRestriction("Información General", urlWFS_Visor2D + "Provincia", "Provincia");
addWFSToRestriction("Información General", urlWFS_Visor2D + "FechaVueloRec", "FechaVueloRec");
addWFSToRestriction("Información General", urlWFS_Visor2D + "Comarca", "Comarca");
addWFSToRestriction("Información General", urlWFS_Visor2D + "Municipio", "Municipio");
addWFSToRestriction("Información General", urlWFS_Visor2D + "Localidad", "Localidad");
addWFSToRestriction("Información General", urlWFS_Visor2D + "OCIC", "OCIC");

addWFSToRestriction("Series de Ortofotos", urlWFS_Visor2D + "FechaVueloSer", "FechaVueloSer");

addWFSToRestriction("Directrices Parciales", urlWFS_Visor2D + "OTP", "OTP");
addWFSToRestriction("Directrices Parciales", urlWFS_Visor2D + "OTM", "OTM");
addWFSToRestriction("Dominios de Paisaje", urlWFS_Visor2D + "MP_GDP", "MP_GDP");
addWFSToRestriction("Dominios de Paisaje", urlWFS_Visor2D + "MP_DP", "MP_DP");
addWFSToRestriction("Calidad 1:100.000", urlWFS_Visor2D + "MP_CR1M", "MP_CR1M");
addWFSToRestriction("Aptitud Homogeneizada", urlWFS_Visor2D + "MP_PAH", "MP_PAH");
addWFSToRestriction("Calidad Homogeneizada", urlWFS_Visor2D + "MP_PCH", "MP_PCH");
addWFSToRestriction("Fragilidad Homogeneizada", urlWFS_Visor2D + "MP_PFH", "MP_PFH");
addWFSToRestriction("Unidades de Paisaje", urlWFS_Visor2D + "MP_UP", "MP_UP");
addWFSToRestriction("Tipos de Paisaje", urlWFS_Visor2D + "MP_TP", "MP_TP");
addWFSToRestriction("Tipos de Paisaje", urlWFS_Visor2D + "MP_DP", "MP_DP");
addWFSToRestriction("Tipos de Paisaje", urlWFS_Visor2D + "MP_UF", "MP_UF");
addWFSToRestriction("Tipos de Paisaje", urlWFS_Visor2D + "MP_VU", "MP_VU");
addWFSToRestriction("Recorridos y miradores de Paisaje", urlWFS_Visor2D + "MP_PR", "MP_PR");
addWFSToRestriction("Recorridos y miradores de Paisaje", urlWFS_Visor2D + "MP_PM", "MP_PM");

addWFSToRestriction("Educación", urlWFS_Visor2D + "v206_zonasescolares", "v206_zonasescolares");
addWFSToRestriction("Educación", urlWFS_Visor2D + "Cen_Educa", "Cen_Educa");
addWFSToRestriction("Educación", urlWFS_Visor2D + "Troides", "Troides");

addWFSToRestriction("Ríos", urlWFS_Visor2D + "Rio", "Rio");

addWFSToRestriction("REGA", urlWFS_Visor2D + "REGA_EXPLOTACIONES", "REGA_EXPLOTACIONES");
addWFSToRestriction("REGA", urlWFS_Visor2D + "REGA_FOCOS", "REGA_FOCOS");
addWFSToRestriction("REGA", urlWFS_Visor2D + "REGA_SERVIDUMBRES", "REGA_SERVIDUMBRES");

addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "ENP_ES24", "ENP_ES24");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "ZENP", "ZENP");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "PORN_ES24", "PORN_ES24");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "ZPORNS", "ZPORNS");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "ZEPA_ES24", "ZEPA_ES24");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "LIC_ES24", "LIC_ES24");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "MaB_ES24", "MaB_ES24");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "ARBOLESSINGULARES_ES24", "ARBOLESSINGULARES_ES24");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "AM.ArboledasSingulares_Aragon", "AM.ArboledasSingulares_Aragon");
addWFSToRestriction("Red Natural de Aragón", urlWFS_Visor2D + "LIG_ES24", "LIG_ES24");

addWFSToRestriction("Catastro Minero y Suelo Industrial de Aragón", urlWFS_Visor2D + "CatMin", "CatMin");
addWFSToRestriction("Catastro Minero y Suelo Industrial de Aragón", urlWFS_Visor2D + "SIA", "SIA");

addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_anexo_ii_origen", "v_pol_anexo_ii_origen")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_anexo_iii_origen", "v_pol_anexo_iii_origen")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_pendiente_aa_previa", "v_pol_pendiente_aa_previa")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_aut_adm_construccion", "v_pol_aut_adm_construccion")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_perea", "v_pol_perea")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_anexo_ii_tramit", "v_pol_anexo_ii_tramit")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_anexo_iii_tramit", "v_pol_anexo_iii_tramit")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_ID_tramit", "v_pol_ID_tramit")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_reg_general_tramit", "v_pol_reg_general_tramit")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_proteg_a_ii", "v_pol_proteg_a_ii")
addWFSToRestriction("Energía Eólica", urlWFS_Visor2D + "v_pol_DT_II", "v_pol_DT_II")


addWFSToRestriction("Carreteras", urlWFS_Visor2D + "RedCarCod", "RedCarCod");

addWFSToRestriction("Biodiversidad", urlWFS_Visor2D + "APPE", "APPE");
addWFSToRestriction("Biodiversidad", urlWFS_Visor2D + "ACRIT", "ACRIT");
addWFSToRestriction("Biodiversidad", urlWFS_Visor2D + "HIC", "HIC");
addWFSToRestriction("Biodiversidad", urlWFS_Visor2D + "VFAUNA10", "VFAUNA10");
addWFSToRestriction("Biodiversidad", urlWFS_Visor2D + "VFLORA1", "VFLORA1");
addWFSToRestriction("Biodiversidad", urlWFS_Visor2D + "VFLORA10", "VFLORA10");

addWFSToRestriction("Humedales", urlWFS_Visor2D + "HMD", "HMD");

addWFSToRestriction("Gestores de residuos", urlWFS_Visor2D + "GesRes", "GesRes");

addWFSToRestriction("Caza y Pesca", urlWFS_Visor2D + "VRTCC1", "VRTCC1");
addWFSToRestriction("Caza y Pesca", urlWFS_Visor2D + "COTOSPESCA", "COTOSPESCA");

addWFSToRestriction("Gestión forestal", urlWFS_Visor2D + "MONTES", "MONTES");
addWFSToRestriction("Gestión forestal", urlWFS_Visor2D + "CONSREP", "CONSREP");
addWFSToRestriction("Gestión forestal", urlWFS_Visor2D + "VVVPP_R_GEN", "VVVPP_R_GEN");

addWFSToRestriction("Ámbitos de Medio Ambiente", urlWFS_Visor2D + "OCAS", "OCAS");
addWFSToRestriction("Ámbitos de Medio Ambiente", urlWFS_Visor2D + "AMAS", "AMAS");
addWFSToRestriction("Ámbitos de Medio Ambiente", urlWFS_Visor2D + "rz_RD1432_LineasZPA_ES24", "rz_RD1432_LineasZPA_ES24");

addWFSToRestriction("Calidad", urlWFS_Visor2D + "AM.AirQualityManagementZone", "AM.AirQualityManagementZone");
addWFSToRestriction("Calidad", urlWFS_Visor2D + "AM.RestrictedZonesAroundContaminatedSites", "AM.RestrictedZonesAroundContaminatedSites");

addWFSToRestriction("Agua", urlWFS_Visor2D + "EDAR", "EDAR");

addWFSToRestriction("Cuadrícula 1:50.000", urlWFS_Visor2D + "Cuad50k", "Cuad50k");
addWFSToRestriction("Cuadrícula UTM 10 Km", urlWFS_Visor2D + "CuaUTM10k", "CuaUTM10k");

addWFSToRestriction("CORINE Land Cover", urlWFS_Visor2D + "CLC1990_N3", "CLC1990_N3");
addWFSToRestriction("CORINE Land Cover", urlWFS_Visor2D + "CLC2000_N3", "CLC2000_N3");
addWFSToRestriction("CORINE Land Cover", urlWFS_Visor2D + "CLC2006_N3", "CLC2006_N3");
addWFSToRestriction("CORINE Land Cover", urlWFS_Visor2D + "CLC2012_N3", "CLC2012_N3");

addWFSToRestriction("Susceptibilidad", urlWFS_Visor2D + "T0212_ALU", "T0212_ALU");
addWFSToRestriction("Susceptibilidad", urlWFS_Visor2D + "T0212_COL", "T0212_COL");
addWFSToRestriction("Susceptibilidad", urlWFS_Visor2D + "T0212_DES", "T0212_DES");
addWFSToRestriction("Susceptibilidad", urlWFS_Visor2D + "T0212_INU", "T0212_INU");
addWFSToRestriction("Susceptibilidad", urlWFS_Visor2D + "T0212_VIE_I", "T0212_VIE_I");

addWFSToRestriction("Senderos", urlWFS_Visor2D + "V_C_STA", "V_C_STA");
addWFSToRestriction("Senderos", urlWFS_Visor2D + "V_C_SSTA", "V_C_SSTA");
addWFSToRestriction("Senderos", urlWFS_Visor2D + "MA_SET", "MA_SET");
addWFSToRestriction("Senderos", urlWFS_Visor2D + "SA_SET", "SA_SET");
addWFSToRestriction("Senderos", urlWFS_Visor2D + "MP_PR", "MP_PR");
addWFSToRestriction("Senderos", urlWFS_Visor2D + "MP_PM", "MP_PM");

addWFSToRestriction("Cartografía en plazo de Información pública", urlWFS_Visor2D + "EIPA", "EIPA");
addWFSToRestriction("Cartografía en plazo de Información pública", urlWFS_Visor2D + "EIP", "EIP");
addWFSToRestriction("Concentración parcelaria en Información pública", urlWFS_Visor2D + "CONCEN_ZONAS", "CONCEN_ZONAS");
addWFSToRestriction("Concentración parcelaria en Información pública", urlWFS_Visor2D + "v_parcela_concen", "v_parcela_concen");
addWFSToRestriction("Concentración parcelaria en Información pública", urlWFS_Visor2D + "v_finca_concen", "v_finca_concen");

addWFSToRestriction("Figura de Planeamiento", urlWFS_Visor2D + "FPM_Info", "FPM_Info");
addWFSToRestriction("Información de Planeamiento", urlWFS_Visor2D + "URB_PLU", "URB_PLU");

addWFSToRestriction("Patrimonio Cultural", urlWFS_Visor2D + "CULTURA_PC", "CULTURA_PC");
addWFSToRestriction("Patrimonio Cultural", urlWFS_Visor2D + "v_bic_bienes_entornos", "v_bic_bienes_entornos");
addWFSToRestriction("Patrimonio Cultural", urlWFS_Visor2D + "v_bic_bienes_limites", "v_bic_bienes_limites");
addWFSToRestriction("Patrimonio Cultural", urlWFS_Visor2D + "v_bic_bienes_puntos", "v_bic_bienes_puntos");

addWFSToRestriction("Sanidad", urlWFS_Visor2D + "Cen_Salud", "Cen_Salud");
addWFSToRestriction("Sanidad", urlWFS_Visor2D + "zonas_salud", "zonas_salud");

addWFSToRestriction("Acceso a internet", urlWFS_Visor2D + "InternetAragon", "InternetAragon")
var restrictions_loaded=true;
