// Catálog de ID de los derechos provenientes de la API de datosabiertos.unam.mx

var idSS = 1;
var idS = 2;
var idE = 3;
var idA = 4;
var idM = 5;
var idC = 6;
var idT = 7;
var idU = 8;

var categoriasyclaves=[
	['Recepción del Derecho','a','Categoría conceptual cuyos indicadores permiten identificar información sobre la forma en que cada derecho se encuentra incorporado en el sistema legal y en las políticas públicas, así como los resultados generales sobre su garantía.'],
	['Contexto Financiero y Compromiso Presupuestal','f','Categoría conceptual cuyos indicadores se orientan a valorar la disponibilidad efectiva de recursos financieros del Estado para el gasto público social, así como sus compromisos presupuestarios para los derechos.'],
	['Capacidades Estatales','c','Categoría conceptual cuyos indicadores incorporan los aspectos instrumentales y de disponibilidad de recursos al interior del aparato estatal para la atención de los derechos.'],
	['Igualdad y no discriminación','d','Principio transversal cuyos indicadores se orientan a asegurar la protección igualitaria y no discriminatoria de los derechos; detallan los mecanismos y políticas específicos disponibles para los grupos de población en situación de vulnerabilidad.'],
	['Acceso a información pública y participación','i','Principio transversal cuyos indicadores revisan, por un lado, el nivel de información y transparencia sobre los derechos, para una adecuada rendición de cuentas; y por el otro, examinan la disponibilidad de mecanismos para la participación en el diseño, implementación y seguimiento de las políticas públicas correspondientes.'],
	['Acceso a la justicia','j','Principio transversal cuyos indicadores están dirigidos a garantizar los recursos para la exigibilidad de los derechos y el apropiado acceso a la justicia, incluyendo el examen sobre la posibilidad de acceso a mecanismos de reclamo y protección.']
];

var infoPorID={
		6:["Derecho a los Beneficios de la Cultura","Art. 14 PSS"], 
		5:["Derecho a un Medio Ambiente Sano","Art. 11 PSS"], 
		7:["Derecho al Trabajo","Art. 6 y 7 PSS"], 
		4:["Derecho a la Alimentación adecuada","Art. 12 PSS"], 
		8:["Derechos Sindicales","Art. 8 PSS"],
		1:["Derecho a la Seguridad Social","Art. 9 PSS"], 
		3:["Derecho a la Educación","Art. 13 PSS"],
		2:["Derecho a la Salud","Art. 10 PSS"]		
};


var idDerechoPorNombre={
		"Culturales":6, 
		"Medio Ambiente":5, 
		"Trabajo":7, 
		"Alimentación":4, 
		"Sindicales":8,
		"Seguridad Social":1, 
		"Educación":3,
		"Salud":2};

var idDerechoPorNombreSinEspacio={
		"Culturales":6, 
		"MedioAmbiente":5, 
		"Trabajo":7, 
		"Alimentacion":4, 
		"Sindicales":8,
		"SeguridadSocial":1, 
		"Educacion":3,
		"Salud":2};

var nombrePorIdDerecho={
		1:"Seguridad Social",
		2:"Salud",
		3:"Educación",
		4:"Alimentación",
		5:"Medio Ambiente",
		6:"Culturales",
		7:"Trabajo",
		8:"Sindicales"};

var esquemasMonosaturadosPorId=[
	[],
	[['152551'],['203879'],['2b4aa1'],['365dc9'],['5e7dd4'],['869edf'],['aebeea'],['d7dff4'],['ebeffa']],
	[['5a0c0c'],['871212'],['b51717'],['e21d1d'],['e84a4a'],['ed7878'],['f3a5a5'],['f9d2d2'],['fce8e8']],
	[['924107'],['c35709'],['F57821'],['f46c0b'],['f68a3c'],['f8a76d'],['fac49e'],['fde2ce'],['fef0e7']],
	[['976502'],['e29803'],['fcb120'],['fcba36'],['fcc34f'],['fdcb68'],['fdd481'],['fee5b4'],['fff6e6']],
	[['0c5a18'],['128723'],['17b52f'],['1de23b'],['4ae862'],['78ed89'],['a5f3b1'],['d2f9d8'],['e8fceb']],
	[['3c0c5a'],['5a1287'],['7817b5'],['961de2'],['ab4ae8'],['c078ed'],['d5a5f3'],['ead2f9'],['f5e8fc']],
	[['0c4d5a'],['127487'],['179ab5'],['1dc1e2'],['4acde8'],['78daed'],['a5e6f3'],['d2f3f9'],['e8f9fc']],
	[['0c5a4d'],['128774'],['17b59a'],['1de2c1'],['4ae8cd'],['78edda'],['a5f3e6'],['d2f9f3'],['e8fcf9']]
];

var esquemasColoresPorId=[
	[],
	[[],['355CC5'],['355CC5','9E35C5'],['355CC5','9E35C5','C5355C'],['355CC5','9E35C5','C5355C','C55635'],['355CC5','5635C5','9E35C5','C5355C','C55635'],['355CC5','5635C5','9E35C5','9E35C5','C5355C','C55635']],
	[[],['BD1818'],['BD1818','BD6B18'],['BD1818','BD6B18','BDBD18'],['BD1818','BD6B18','BDBD18','6BBD18'],['BD1818','BD6B18','BDBD18','6BBD18','18BD18'],['BD1818','BD6B18','BDBD18','BDBD18','6BBD18','18BD18']],
	[[],['F57821'],['F57821','F5E221'],['F57821','F5E221','9EF521'],['F57821','F5E221','9EF521','21F578'],['F57821','F5E221','9EF521','21F578','21F5E2'],['F57821','F5E221','9EF521','9EF521','21F578','21F5E2']],
	[[],['fcb120'],['fcb120','D9FC20'],['fcb120','D9FC20','20FC43'],['fcb120','D9FC20','20FC43','20D9FC'],['fcb120','D9FC20','20FC43','20FCB1','20D9FC'],['fcb120','D9FC20','6BFC20','20FC43','20FCB1','20D9FC']],
	[[],['18BD32'],['18BD32','18A3BD'],['18BD32','18A3BD','1851BD'],['18BD32','18BD85','18A3BD','1851BD'],['18BD32','18BD85','18A3BD','1851BD','3218BD'],['18BD32','18BD85','18A3BD','18A3BD','1851BD','3218BD']],
	[[],['7E18BD'],['7E18BD','BD1857'],['7E18BD','BD1857','BD7E18'],['7E18BD','BD1857','BD7E18','AABD18'],['7E18BD','BD18AA','BD1857','BD7E18','AABD18'],['7E18BD','BD18AA','BD1857','BD1857','BD7E18','AABD18']],
	[[],['18A1BD'],['18A1BD','184EBD'],['18A1BD','184EBD','8718BD'],['18A1BD','184EBD','8718BD','BD18A1'],['18A1BD','184EBD','8718BD','BD18A1','BD184E'],['18A1BD','184EBD','3418BD','8718BD','BD18A1','BD184E']],
	[[],['18BDA1'],['18BDA1','1887BD'],['18BDA1','1887BD','1834BD'],['18BDA1','1887BD','1834BD','A118BD'],['18BDA1','1887BD','1834BD','A118BD','BD1887'],['18BDA1','1887BD','1834BD','1834BD','A118BD','BD1887']]
	];

var esquemasColoresPorClave={
		"SS":[[],['355CC5'],['355CC5','9E35C5'],['355CC5','9E35C5','C5355C'],['355CC5','9E35C5','C5355C','C55635'],['355CC5','5635C5','9E35C5','C5355C','C55635'],['355CC5','5635C5','9E35C5','9E35C5','C5355C','C55635']],
		"S":[[],['BD1818'],['BD1818','BD6B18'],['BD1818','BD6B18','BDBD18'],['BD1818','BD6B18','BDBD18','6BBD18'],['BD1818','BD6B18','BDBD18','6BBD18','18BD18'],['BD1818','BD6B18','BDBD18','BDBD18','6BBD18','18BD18']],
		"E":[[],['F57821'],['F57821','F5E221'],['F57821','F5E221','9EF521'],['F57821','F5E221','9EF521','21F578'],['F57821','F5E221','9EF521','21F578','21F5E2'],['F57821','F5E221','9EF521','9EF521','21F578','21F5E2']],
		"A":[[],['fcb120'],['fcb120','D9FC20'],['fcb120','D9FC20','20FC43'],['fcb120','D9FC20','20FC43','20D9FC'],['fcb120','D9FC20','20FC43','20FCB1','20D9FC'],['fcb120','D9FC20','6BFC20','20FC43','20FCB1','20D9FC']],
		"M":[[],['18BD32'],['18BD32','18A3BD'],['18BD32','18A3BD','1851BD'],['18BD32','18BD85','18A3BD','1851BD'],['18BD32','18BD85','18A3BD','1851BD','3218BD'],['18BD32','18BD85','18A3BD','18A3BD','1851BD','3218BD']],
		"C":[[],['7E18BD'],['7E18BD','BD1857'],['7E18BD','BD1857','BD7E18'],['7E18BD','BD1857','BD7E18','AABD18'],['7E18BD','BD18AA','BD1857','BD7E18','AABD18'],['7E18BD','BD18AA','BD1857','BD1857','BD7E18','AABD18']],
		"T":[[],['18A1BD'],['18A1BD','184EBD'],['18A1BD','184EBD','8718BD'],['18A1BD','184EBD','8718BD','BD18A1'],['18A1BD','184EBD','8718BD','BD18A1','BD184E'],['18A1BD','184EBD','3418BD','8718BD','BD18A1','BD184E']],
		"U":[[],['18BDA1'],['18BDA1','1887BD'],['18BDA1','1887BD','1834BD'],['18BDA1','1887BD','1834BD','A118BD'],['18BDA1','1887BD','1834BD','A118BD','BD1887'],['18BDA1','1887BD','1834BD','1834BD','A118BD','BD1887']]

		};

var esquemasColoresPorNombre={
		"Salud":[[],['BD1818'],['BD1818','BD6B18'],['BD1818','BD6B18','BDBD18'],['BD1818','BD6B18','BDBD18','6BBD18'],['BD1818','BD6B18','BDBD18','6BBD18','18BD18'],['BD1818','BD6B18','BDBD18','BDBD18','6BBD18','18BD18']],
		"Seguridad Social":[[],['355CC5'],['355CC5','9E35C5'],['355CC5','9E35C5','C5355C'],['355CC5','9E35C5','C5355C','C55635'],['355CC5','5635C5','9E35C5','C5355C','C55635'],['355CC5','5635C5','9E35C5','9E35C5','C5355C','C55635']],
		"Educación":[[],['F57821'],['F57821','F5E221'],['F57821','F5E221','9EF521'],['F57821','F5E221','9EF521','21F578'],['F57821','F5E221','9EF521','21F578','21F5E2'],['F57821','F5E221','9EF521','9EF521','21F578','21F5E2']],
		"Alimentación":[[],['fcb120'],['fcb120','D9FC20'],['fcb120','D9FC20','20FC43'],['fcb120','D9FC20','20FC43','20D9FC'],['fcb120','D9FC20','20FC43','20FCB1','20D9FC'],['fcb120','D9FC20','6BFC20','20FC43','20FCB1','20D9FC']],
		"Medio Ambiente":[[],['18BD32'],['18BD32','18A3BD'],['18BD32','18A3BD','1851BD'],['18BD32','18BD85','18A3BD','1851BD'],['18BD32','18BD85','18A3BD','1851BD','3218BD'],['18BD32','18BD85','18A3BD','18A3BD','1851BD','3218BD']],
		"Culturales":[[],['7E18BD'],['7E18BD','BD1857'],['7E18BD','BD1857','BD7E18'],['7E18BD','BD1857','BD7E18','AABD18'],['7E18BD','BD18AA','BD1857','BD7E18','AABD18'],['7E18BD','BD18AA','BD1857','BD1857','BD7E18','AABD18']],
		"Trabajo":[[],['18A1BD'],['18A1BD','184EBD'],['18A1BD','184EBD','8718BD'],['18A1BD','184EBD','8718BD','BD18A1'],['18A1BD','184EBD','8718BD','BD18A1','BD184E'],['18A1BD','184EBD','3418BD','8718BD','BD18A1','BD184E']],
		"Sindicales":[[],['18BDA1'],['18BDA1','1887BD'],['18BDA1','1887BD','1834BD'],['18BDA1','1887BD','1834BD','A118BD'],['18BDA1','1887BD','1834BD','A118BD','BD1887'],['18BDA1','1887BD','1834BD','1834BD','A118BD','BD1887']]

		};

var colorCodesPorClave={
		"S":"Reds",
		"SS":"Blues",
		"E":"Oranges",
		"A":"YlOrBr",
		"M":"Greens",
		"C":"Purples",
		"T":"PuBuGn",
		"U":"YlGnBu"
};