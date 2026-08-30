function actualizarVista() {
  actualizarNumeroVista();
  asignarTexto('vFecha', obtenerValor('fecha'));
  asignarTexto('vNumeroInterno', obtenerValor('numeroInterno'));
  asignarTexto('vProductor', obtenerValor('productor'));
  asignarTexto('vCodigo', obtenerValor('codigo'));
  asignarTexto('vPrograma', obtenerValor('programa'));
  asignarTexto('vFormaPago', obtenerValor('formaPago'));
  asignarTexto('vObservaciones', obtenerValor('observaciones') || 'COMPRA DE CACAO');
  asignarTexto('vConcepto', obtenerValor('concepto') || 'Cacao en grano');
  const fh=document.getElementById('vFechaHora'); if(fh) fh.textContent=new Date().toLocaleString('es-EC');
  actualizarVistaCalculos();
  actualizarVistaEmpresa();
  const d=obtenerDatosCompra();
  asignarTexto('vCantidadCompra', d.pesoBruto.toFixed(2));
  asignarTexto('vPesoBruto', d.pesoBruto.toFixed(2));
  asignarTexto('vPesoBrutoKG', d.pesoBrutoKG.toFixed(2));
  asignarTexto('vPesoNetoQQ', d.pesoNetoQQ.toFixed(2));
  asignarTexto('vPesoNetoKG', d.pesoNetoKG.toFixed(2));
  asignarTexto('vHumedad', d.humedad.toFixed(2) + '%');
  asignarTexto('vTara', d.tara.toFixed(2) + 'QQ');
  asignarTexto('vCalificacion', d.calificacion.toFixed(2) + '%');
  asignarTexto('vBonificacionTable', '$ ' + d.bonificacion.toFixed(2));
  asignarTexto('vBonificacionTotal', '$ ' + d.bonificacion.toFixed(2));
  asignarTexto('vSubtotal', '$ ' + (d.precioBase * d.pesoNetoQQ).toFixed(2));
  asignarTexto('vVneto', '$ ' + d.total.toFixed(2));
  asignarTexto('vSubtotal15', '$ ' + d.total.toFixed(2));
  asignarTexto('vTotalFinal', '$ ' + d.total.toFixed(2));
  asignarTexto('formPrecioFinal', '$ ' + d.precioFinal.toFixed(2));
  asignarTexto('formPesoBrutoKG', d.pesoBrutoKG.toFixed(2) + ' KG');
  asignarTexto('formPesoNetoQQ', d.pesoNetoQQ.toFixed(2) + ' QQ');
  asignarTexto('formPesoNetoKG', d.pesoNetoKG.toFixed(2) + ' KG');
}

function obtenerFechaHoraEmision() {
    const fechaSeleccionada = document.getElementById("fecha").value;
    const ahora = new Date();

    if (!fechaSeleccionada) {
        return ahora.toLocaleString("es-EC");
    }

    const [anio, mes, dia] = fechaSeleccionada.split("-");

    ahora.setFullYear(anio, mes - 1, dia);

    return ahora.toLocaleString("es-EC");
}

function seleccionarProductor() {
  const campo=document.getElementById('productor'), codigo=document.getElementById('codigo'), resultado=document.getElementById('resultadoProductor');
  const encontrado=buscarProductorPorNombre(campo.value);
  if(encontrado){ codigo.value=encontrado.codigo; resultado.textContent='Productor encontrado en la base.';resultado.style.color = '#16a085'; }
  else { codigo.value=''; resultado.textContent=campo.value.trim()?'No existe una coincidencia exacta en la base.':''; resultado.style.color = '#d9534f';}
  actualizarVista();
}

function marcarErrorCampo(id, mensaje) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.classList.add('field-error');

    // Evitar mensajes duplicados
    let error = campo.parentElement.querySelector('.error-message');

    if (!error) {
        error = document.createElement('small');
        error.className = 'error-message';
        campo.parentElement.appendChild(error);
    }

    error.textContent = mensaje;
}


function limpiarErrorCampo(id) {
    const campo = document.getElementById(id);
    if (!campo) return;

    campo.classList.remove('field-error');

    const error =
        campo.parentElement.querySelector('.error-message');

    if (error) {
        error.remove();
    }
}


function limpiarTodosLosErrores() {
    document
        .querySelectorAll('.field-error')
        .forEach(campo => {
            campo.classList.remove('field-error');
        });

    document
        .querySelectorAll('.error-message')
        .forEach(error => {
            error.remove();
        });
}

//function validarFormulario(){
//  const campos=[['fecha','Fecha'],['productor','Productor'],['codigo','Código del productor'],['pesoBruto','Cantidad'], ['tara','Tara'], ['humedad','Humedad'], ['calificacion','Calificación'],['precioBase','Precio base'],['formaPago','Forma de pago'],['concepto','Concepto']];
//  for(const [id,nombre] of campos){const el=document.getElementById(id);if(!el||!String(el.value).trim()){alert(`Complete el campo obligatorio: ${nombre}.`);el?.focus();return false;}}
//  if(!empresa.razonSocial){alert('Configure primero los datos de la empresa emisora.');return false;}
//  return true;
//}
function validarFormulario(){

  // Limpiar errores anteriores
  limpiarTodosLosErrores();

  const campos = [
    ['fecha','Fecha'],
    ['productor','Productor'],
    ['codigo','Código del productor'],
    ['programa','Programa'],
    ['pesoBruto','Cantidad'],
    ['tara','Tara'],
    ['humedad','Humedad'],
    ['calificacion','Calificación'],
    ['precioBase','Precio base'],
    ['formaPago','Forma de pago'],
    ['concepto','Concepto']
  ];

  // ==============================
  // CAMPOS OBLIGATORIOS
  // ==============================
  for(const [id,nombre] of campos){

    const el = document.getElementById(id);

    if(!el || !String(el.value).trim()){

      marcarErrorCampo(
        id,
        `*Obligatorio`// : ${nombre}.`
      );

      el?.focus();

      return false;
    }
  }

  // ==============================
  // VALIDAR TARA VS CANTIDAD
  // ==============================

  const pesoBruto =
    parseFloat(document.getElementById('pesoBruto').value);

  const tara =
    parseFloat(document.getElementById('tara').value);

  if(tara >= pesoBruto){

    marcarErrorCampo(
      'tara',
      'Tara no puede superar la cantidad.'
    );

    document.getElementById('tara').focus();

    return false;
  }

  // ==============================
  // VALIDAR HUMEDAD
  // ==============================

  const humedad =
    parseFloat(document.getElementById('humedad').value);

  if(humedad < 0 || humedad > 100){

    marcarErrorCampo(
      'humedad',
      'Humedad entre 0 y 100 %'
    );

    document.getElementById('humedad').focus();

    return false;
  }

  // ==============================
  // VALIDAR CALIFICACIÓN
  // ==============================

  const calificacion =
    parseFloat(document.getElementById('calificacion').value);

  if(calificacion < 0 || calificacion > 100){

    marcarErrorCampo(
      'calificacion',
      'Calificación entre 0 y 100 %.'
    );

    document.getElementById('calificacion').focus();

    return false;
  }

  // ==============================
  // VALIDAR PRECIO
  // ==============================

  const precioBase =
    parseFloat(document.getElementById('precioBase').value);

  if(precioBase <= 0 || isNaN(precioBase)){

    marcarErrorCampo(
      'precioBase',
      'Precio base mayor a 0'
    );

    document.getElementById('precioBase').focus();

    return false;
  }

  // ==============================
  // VALIDAR EMPRESA
  // ==============================

  if(!empresa.razonSocial){

    alert('Configure primero los datos de la empresa emisora.');

    return false;
  }

  return true;
}

function validarCampoEnTiempoReal(id){

  const pesoBruto = parseFloat(
    document.getElementById('pesoBruto')?.value
  );

  const tara = parseFloat(
    document.getElementById('tara')?.value
  );

  // Limpiar primero el error de ese campo
  limpiarErrorCampo(id);

  // ==============================
  // TARA VS CANTIDAD
  // ==============================

  if(id === 'tara' && !isNaN(tara) && !isNaN(pesoBruto)){

    if(tara >= pesoBruto){

      marcarErrorCampo(
        'tara',
        'Tara no puede superar la cantidad.'
      );

      return false;
    }
  }

  // ==============================
  // CANTIDAD
  // ==============================

if(id === 'pesoBruto' && !isNaN(pesoBruto)){

    if(pesoBruto <= 0){

        marcarErrorCampo(
            'pesoBruto',
            'Cantidad debe ser mayor que 0.'
        );

        return false;
    }

    if(!isNaN(tara)){

        if(tara >= pesoBruto){

            marcarErrorCampo(
                'tara',
                'Tara no puede superar la cantidad.'
            );

        } else {

            limpiarErrorCampo('tara');
        }
    }
}

  // ==============================
  // HUMEDAD
  // ==============================

  if(id === 'humedad'){

    const humedad = parseFloat(
      document.getElementById('humedad')?.value
    );

    if(!isNaN(humedad) && (humedad < 0 || humedad > 100)){

      marcarErrorCampo(
        'humedad',
        'Humedad entre 0 y 100 %.'
      );

      return false;
    }
  }

  // ==============================
  // CALIFICACIÓN
  // ==============================

  if(id === 'calificacion'){

    const calificacion = parseFloat(
      document.getElementById('calificacion')?.value
    );

    if(
      !isNaN(calificacion) &&
      (calificacion < 0 || calificacion > 100)
    ){

      marcarErrorCampo(
        'calificacion',
        'Calificación entre 0 y 100 %.'
      );

      return false;
    }
  }

  return true;
}

function generarComprobante(){
  if(!validarFormulario()) return;
  if(!window.jspdf){alert('No se pudo cargar jsPDF. Revise su conexión a Internet.');return;}
  actualizarVista();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const W=210, M=10, CW=W-2*M;
  const ink=[42,42,42], gray=[95,95,95], line=[55,55,55], fill=[226,226,226], soft=[246,248,248];
  const d=obtenerDatosCompra(), numero=obtenerNumeroFactura(), productor=obtenerValor('productor'), codigo=obtenerValor('codigo'), fecha=obtenerValor('fecha');
  const txt=(s,x,yy,size=7.5,bold=false,opts={})=>{doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...ink);doc.text(String(s??''),x,yy,opts)};
  const label=(s,x,yy)=>{doc.setFont('helvetica','bold');doc.setFontSize(6.7);doc.setTextColor(...gray);doc.text(s,x,yy)};
  const boxText=(labelText,value,x,yy)=>{label(labelText,x,yy);txt(value,x+21,yy,7.2,false)};

  // Función código de barras
  function generarCodigoBarras(valor) {
    const canvas = document.createElement('canvas');

    JsBarcode(canvas, String(valor), {
      format: 'CODE128',
      width: 2,
      height: 35,
      displayValue: true,
      fontSize: 25,
      margin: 0,
      background: '#f5f7f7',
      lineColor: '#000000'
    });

    return canvas.toDataURL('image/png');
  }

  // Encabezado: logo + empresa + comprobante
  doc.setDrawColor(...line); doc.setLineWidth(.3);
  if(empresa.logo){ try { const logoFmt=empresa.logo.startsWith('data:image/jpeg')?'JPEG':'PNG'; doc.addImage(empresa.logo,logoFmt,M,M+2,35,28,undefined,'FAST'); } catch(e) { txt('Cacao',M+16,M+11,12,true,{align:'center'}); } }
  else { txt('LOGO',M+16,M+11,12,true,{align:'center'}); txt('COCOAPAY',M+16,M+18,5.5,true,{align:'center'}); }
  const companyX=M+38;
  txt(empresa.razonSocial||'EMPRESA EMISORA',companyX,M+6,11,true);
  if(empresa.nombreComercial) txt(empresa.nombreComercial,companyX,M+11,11,true);
  label('RUC:',companyX,M+17); txt(empresa.ruc||'—',companyX+7,M+17,9,true);
  if(empresa.actividad) txt(doc.splitTextToSize(empresa.actividad,105),companyX,M+22,7);
  if(empresa.direccion) txt(doc.splitTextToSize(empresa.direccion,105),companyX,M+27,7);
  doc.setFillColor(...soft); doc.rect(150,M,50,27,'F'); //doc.rect(150,M,50,27);
  txt('RECEPCIÓN DE COMPRA',175,M+7,8,true,{align:'center'});
  //label('NO.',160,M+14); txt(numero,165,M+14,8,true);
  
try {
  const codigoBarras = generarCodigoBarras(numero);
  doc.addImage(codigoBarras, 'PNG', 154, M+10, 43, 15);
} catch(e) {
  console.warn('No se pudo generar el código de barras:', e);
}

  //txt('Documento interno',175,M+25,6.2,false,{align:'center'});
  txt('RECEPCIÓN DE COMPRA',W/2,M+39,15,true,{align:'center'});
  doc.setLineWidth(.55); doc.line(M,M+43,W-M,M+43);
  let y=M+49;

  // Datos generales
  doc.setFillColor(...fill); doc.rect(M,y,CW,7,'F'); doc.rect(M,y,CW,7); label('DATOS DE LA OPERACIÓN',M+2,y+4.8); y+=7;
  doc.rect(M,y,CW,30); 
  boxText('FECHA:',fecha,M+2,y+6); boxText('DOCUMENTO:',numero,M+60,y+6); boxText('PROGRAMA:',obtenerValor('programa'),M+135,y+6);
  boxText('CÓDIGO:',codigo,M+2,y+14); boxText('PRODUCTOR:',productor,M+60,y+14); boxText('F. DE PAGO: ',obtenerValor('formaPago'),M+135,y+14);
  y+=20;

  // Detalle
  //doc.setFillColor(...fill); doc.rect(M,y,CW,7,'F'); doc.rect(M,y,CW,7); label('DETALLE DE LA COMPRA',M+2,y+4.8); y+=7;
  //const widths=[50,22,20,27,27,27,27]; const headers=['DESCRIPCIÓN','CANTIDAD','UNIDAD','PRECIO BASE','BONIFICACIÓN','PRECIO FINAL','TOTAL'];
  //doc.setFillColor(...fill); doc.rect(M,y,CW,8,'F'); doc.rect(M,y,CW,8); let x=M;
  //headers.forEach((h,i)=>{label(h,x+widths[i]/2,y+5.3); doc.text(h,x+widths[i]/2,y+5.3,{align:'center'}); x+=widths[i]});
  //x=M; for(let i=0;i<widths.length-1;i++){x+=widths[i];doc.line(x,y,x,y+20);} y+=8;
  //const vals=[obtenerValor('concepto')||'Cacao',d.pesoBruto.toFixed(2),'QQ',d.precioBase.toFixed(2),d.bonificacion.toFixed(2),d.precioFinal.toFixed(2),d.total.toFixed(2)];
  //x=M; vals.forEach((v,i)=>{txt(v,x+widths[i]/2,y+7,7.4,false,{align:'center'});x+=widths[i]});
  //doc.rect(M,y,CW,12); y+=12;

  // Resumen de peso - ajustado
  doc.setFillColor(...soft);doc.rect(M, y, CW, 17, 'F');doc.rect(M, y, CW, 17);
  const wx = M + 5;
  label('PESO BRUTO', wx, y+6); txt(`${d.pesoBruto.toFixed(2)} QQ / ${d.pesoBrutoKG.toFixed(2)} KG`, wx, y+12, 7.2, true);
  label('TARA (-)', wx+40, y+6); txt(`${d.tara.toFixed(2)} QQ / ${(d.tara * KG_PER_QQ).toFixed(2)} KG`, wx+40, y+12, 7.2, true);
  label('HUMEDAD (-)', wx+82, y+6); txt(`${d.humedad.toFixed(2)} %`, wx+82, y+12, 7.2, true);
  label('CALIFICACIÓN (-)', wx+115, y+6); txt(`${d.calificacion.toFixed(2)} %`, wx+115, y+12, 7.2, true); label('PESO NETO', wx+150, y+6);
  txt(`${d.pesoNetoQQ.toFixed(2)} QQ / ${d.pesoNetoKG.toFixed(2)} KG`, wx+150, y+12, 7.2, true);
  y += 17;


  // Detalle - CORREGIDO
  doc.setFillColor(...fill); doc.rect(M,y,CW,7,'FD'); label('DETALLE DE LA COMPRA',M+2,y+4.8); y+=7;
  const widths=[45,22,20,27,27,27,32]; const headers=['DESCRIPCIÓN','CANTIDAD','UNIDAD','PRECIO BASE','BONIFICACIÓN','PRECIO FINAL','TOTAL'];
  doc.setFillColor(...fill); doc.rect(M,y,CW,8,'FD');
  const posHeaders=[M+15,M+50,M+72,M+93,M+119,M+147,M+175];
  headers.forEach((h,i)=>{label(h,posHeaders[i],y+5.3)});
  let x=M; for(let i=0;i<widths.length-1;i++){x+=widths[i];doc.line(x,y,x,y+20);} y+=8;
  //const vals=[obtenerValor('concepto')||'Cacao',d.pesoBruto.toFixed(2),'QQ','$ '+d.precioBase.toFixed(2),'$ '+d.bonificacion.toFixed(2),'$ '+d.precioFinal.toFixed(2),'$ '+d.total.toFixed(2)];
  //x=M; vals.forEach((v,i)=>{txt(v,x+widths[i]/2,y+7,7.4,false,{align:'center'});x+=widths[i]});
  const vals=[obtenerValor('concepto')||'Cacao en grano',d.pesoNetoQQ.toFixed(2),'QQ','$ '+d.precioBase.toFixed(2),'$ '+d.bonificacion.toFixed(2),'$ '+d.precioFinal.toFixed(2),'$ '+d.total.toFixed(2)];
  x=M; vals.forEach((v,i)=>{let px=x+widths[i]/2;if(i===6)px-=5;txt(v,px,y+7,7.4,false,{align:'center'});x+=widths[i]});
  doc.rect(M,y,CW,12,'S'); y+=12;

  // Resumen de peso
  //doc.setFillColor(...soft); doc.rect(M,y,CW,20,'F'); doc.rect(M,y,CW,20);
  //txt('RESUMEN DE PESO',M+3,y+6,8,true); txt('Conversión estándar: 1 QQ = 45.36 KG',M+3,y+12,6.5,false);
  //const wx=M+75; label('PESO BRUTO',wx,y+6); txt(`${d.pesoBruto.toFixed(2)} QQ / ${d.pesoBrutoKG.toFixed(2)} KG`,wx,y+12,7.2,true);
  //label('HUMEDAD',wx+48,y+6); txt(`${d.humedad.toFixed(2)} %`,wx+48,y+12,7.2,true);
  //label('PESO NETO',wx+82,y+6); txt(`${d.pesoNetoQQ.toFixed(2)} QQ / ${d.pesoNetoKG.toFixed(2)} KG`,wx+82,y+12,7.2,true); y+=25;
  

  // Observaciones + totales
  const leftW=137, rightW=CW-leftW;
  doc.rect(M,y,leftW,60); doc.rect(M+leftW,y,rightW,60);
  label('OBSERVACIONES: ',M+3,y+6); txt(doc.splitTextToSize(obtenerValor('observaciones')||'Conversión estándar: 1 QQ = 45.36 KG',leftW-8),M+3,y+12,7);
 // const sy=y+45; doc.line(M+15,sy,M+60,sy); doc.line(M+75,sy,M+120,sy); txt('Aprobado por:',M+25,sy+5,6.8,false,{align:'center'}); txt('Recibí conforme: ',productor,M+112,sy+5,6.8,false,{align:'center'});
  const sy=y+45; doc.line(M+15,sy,M+60,sy); doc.line(M+75,sy,M+120,sy); txt('Aprobado por:',M+37.5,sy+5,6.8,false,{align:'center'}); txt('Recibí conforme:',M+97.5,sy+5,6.8,false,{align:'center'}); txt(productor,M+97.5,sy+10,6.8,false,{align:'center'});
  const tx=M+leftW+4; let ty=y+7;
  const lines=[['Subtotal',d.precioBase*d.pesoNetoQQ],['Bonificación',d.bonificacion*d.pesoNetoQQ],['Valor Neto',d.total],['Subtotal 0%',0],['IVA',0]];
  lines.forEach(([a,v])=>{label(a+':',tx,ty);
    //txt(Number(v).toFixed(2),W-M-4,ty,7.3,false,{align:'right'});
    txt('$ '+Number(v).toFixed(2),W-M-4,ty,7.3,false,{align:'right'});
    ty+=8});
  doc.setLineWidth(.3); doc.line(tx,ty-3,W-M-4,ty-3); txt('TOTAL:',tx,ty+4,10,true); 
    //txt(d.total.toFixed(2),W-M-4,ty+4,10,true,{align:'right'});
    txt('$ '+d.total.toFixed(2),W-M-4,ty+4,10,true,{align:'right'});
  y+=67;
  label('Elaborado por:',M,y); txt(empresa.nombreComercial||empresa.razonSocial,M+20,y,7); 
  //txt('Documento interno',W-M,y,6.7,false,{align:'right'});
  //txt(new Date().toLocaleString('es-EC'),W-M,y,6.7,false,{align:'right'});
  txt(obtenerFechaHoraEmision(),W-M,y,6.7,false,{align:'right'});
  doc.setFontSize(5.5); doc.setTextColor(...gray); doc.text('Comprobante interno de recepción y compra.',M,289); doc.text('Página 1 de 1',W-M,289,{align:'right'});
  const safe=(codigo||'productor').replace(/[^a-zA-Z0-9_-]/g,'_');
  //doc.save(`${safe}_${numero}.pdf`);
  //registrarCompra(); incrementarSecuencial(); actualizarVista(); actualizarDashboard();
  doc.save(`${safe}_${numero}.pdf`);

registrarCompra();

// Incrementar el número para el siguiente comprobante
incrementarSecuencial();

// Limpiar formulario
limpiarFormulario();

// Actualizar toda la interfaz
actualizarVista();
actualizarDashboard();
actualizarEncabezado();
}

function confirmarGeneracion() {

  // Primero validamos
  if (!validarFormulario()) return;

  const numero = obtenerNumeroFactura();
  const productor = obtenerValor('productor');
  const d = obtenerDatosCompra();

  asignarTexto('confirmComprobante', numero);
  asignarTexto('confirmProductor', productor || '—');
  asignarTexto(
    'confirmCantidad',
    d.pesoNetoQQ.toFixed(2) + ' QQ'
  );
  asignarTexto(
    'confirmTotal',
    '$ ' + d.total.toFixed(2)
  );

  const modalElement = document.getElementById('modalConfirmarCompra');

  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

  modal.show();
}


function limpiarFormulario(){
  //['productor','codigo','direccion','programa','pesoBruto','humedad','precioBase','formaPago','observaciones'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  [
    'productor',
    'codigo',
    'direccion',
    'programa',
    'pesoBruto',
    'tara',
    'humedad',
    'calificacion',
    'precioBase',
    'formaPago',
    'observaciones'
].forEach(id => {
    const e = document.getElementById(id);
    if (e) e.value = '';
});
  const c=document.getElementById('concepto'); if(c)c.value='Cacao en grano';
  const b=document.getElementById('bonificacion'); if(b)b.value='3.17';
  const r=document.getElementById('resultadoProductor');if(r)r.textContent='';
  const f=document.getElementById('fecha');if(f)f.value=new Date().toISOString().slice(0,10); actualizarVista();
}
function asignarTexto(id,valor){const e=document.getElementById(id);if(e)e.textContent=valor??'';}

function inicializarApp(){
  const f=document.getElementById('fecha'); if(f)f.value=new Date().toISOString().slice(0,10);
  inicializarProductores(); inicializarConfiguracion(); inicializarHistorial(); inicializarDashboard();actualizarLogoSidebar();
  document.getElementById('productor')?.addEventListener('input',seleccionarProductor);
  document.getElementById('productor')?.addEventListener('change',seleccionarProductor);
  //document.querySelectorAll('input,select,textarea').forEach(e=>{e.addEventListener('input',actualizarVista);e.addEventListener('change',actualizarVista)});
  document.querySelectorAll('input,select,textarea').forEach(e=>{

  e.addEventListener('input', function(){

    validarCampoEnTiempoReal(this.id);

    actualizarVista();
  });

  e.addEventListener('change', function(){

    validarCampoEnTiempoReal(this.id);

    actualizarVista();
  });

});
  //document.getElementById('btnGenerar')?.addEventListener('click',guardarPDF);
  document.getElementById('btnGenerar')?.addEventListener('click',confirmarGeneracion);
  document.getElementById('btnConfirmarGeneracion')?.addEventListener(
  'click',
  function() {

    const modalElement = document.getElementById('modalConfirmarCompra');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);

    // Cerrar modal
    modal.hide();

    // Generar comprobante
    generarComprobante();
  }
);
  document.getElementById('btnLimpiar')?.addEventListener('click',limpiarFormulario);
  document.getElementById('btnPrintPreview')?.addEventListener('click',()=>window.print());
  //document.getElementById('archivoProductores')?.addEventListener('change',e=>{if(e.target.files[0]){procesarArchivoProductores(e.target.files[0]);setTimeout(()=>{actualizarTablaProductores();actualizarDashboard()},300)}});
  actualizarVista(); actualizarDashboard(); actualizarEncabezado();
}
document.addEventListener('DOMContentLoaded',inicializarApp);
