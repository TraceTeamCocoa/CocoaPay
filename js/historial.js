/* CocoaTicket - Fase 3: historial acumulado de compras */
const STORAGE_COMPRAS = "cocoaTicket_compras_v3";
let compras = cargarCompras();

function cargarCompras(){
    try { const d=JSON.parse(localStorage.getItem(STORAGE_COMPRAS)||"[]"); return Array.isArray(d)?d.map(r=>({ ...r, bonificacion_qq: Number(r.bonificacion_qq ?? r.diferencial_qq ?? r.bonificacion ?? 0) })):[]; }
    catch(e){ console.error("Error cargando compras",e); return []; }
}
function guardarCompras(){ localStorage.setItem(STORAGE_COMPRAS,JSON.stringify(compras)); }
function n2(v){ return Number(Number(v||0).toFixed(2)); }

function registrarCompra(){
    const d=obtenerDatosCompra();
    const r={
        numero_comprobante:obtenerNumeroFactura(),
        fecha:obtenerValor("fecha"),
        razon_social:empresa.razonSocial,
        nombre_comercial:empresa.nombreComercial,
        ruc_emisor:empresa.ruc,
        productor:obtenerValor("productor"),
        codigo_productor:obtenerValor("codigo"),
        direccion_productor:obtenerValor("direccion"),
        programa:obtenerValor("programa"),
        peso_bruto_qq:n2(d.pesoBruto), peso_bruto_kg:n2(d.pesoBrutoKG),
        humedad_pct:n2(d.humedad), peso_neto_qq:n2(d.pesoNetoQQ), peso_neto_kg:n2(d.pesoNetoKG),
        precio_base_qq:n2(d.precioBase), bonificacion_qq:n2(d.bonificacion), precio_final_qq:n2(d.precioFinal),
        bonificacion:n2(d.bonificacion), total:n2(d.total), forma_pago:obtenerValor("formaPago"),
        BonificacionTotal:n2(d.bonificacion * d.pesoNetoQQ),
        fecha_registro:new Date().toISOString()
    };
    compras.push(r); guardarCompras(); actualizarHistorial();
    return r;
}
let tablaHistorial = null;
//function actualizarHistorial(){
//    const body=document.getElementById("tablaCompras"); if(!body)return;
//    body.innerHTML="";
//    [...compras].reverse().forEach(c=>{
//        const tr=document.createElement("tr");
//        [c.numero_comprobante,c.fecha,c.codigo_productor,c.productor,`${c.peso_neto_qq.toFixed(2)} QQ`,`$ ${c.precio_final_qq.toFixed(2)}`,`$ ${c.total.toFixed(2)}`,c.forma_pago].forEach(v=>{const td=document.createElement("td");td.textContent=v??"";tr.appendChild(td);});
//        body.appendChild(tr);
//    });
//    const count=document.getElementById("contadorCompras"), total=document.getElementById("totalAcumulado");
//    if(count)count.textContent=compras.length.toLocaleString("es-EC");
//    if(total)total.textContent=`$ ${compras.reduce((s,c)=>s+Number(c.total||0),0).toFixed(2)}`;
//}

function estiloFormaPago(forma) {

    const valor = String(forma || '').trim();

    const estilos = {
        'Efectivo': 'pago-efectivo',
        'Transferencia': 'pago-transferencia',
        'Cheque': 'pago-cheque',
        'Efectivo / Transferencia': 'pago-mixto-verde',
        'Efectivo / Cheque': 'pago-mixto-naranja',
        'Transferencia / Cheque': 'pago-mixto-azul',
        'Otro': 'pago-otro'
    };

    return `<span class="pago-badge ${estilos[valor] || 'pago-otro'}">${valor || '—'}</span>`;
}

function actualizarHistorial(){

    const body = document.getElementById("tablaCompras");
    if(!body) return;

    // Si DataTables ya existe, destruirlo antes de reconstruir las filas
    if(tablaHistorial){
        tablaHistorial.destroy();
        tablaHistorial = null;
    }

    body.innerHTML = "";

    [...compras].reverse().forEach(c => {

        const tr = document.createElement("tr");

[
    c.numero_comprobante,
    c.fecha,
    c.codigo_productor,
    c.productor,
    `${Number(c.peso_neto_qq || 0).toFixed(2)} QQ`,
    `$ ${Number(c.precio_final_qq || 0).toFixed(2)}`,
    `$ ${Number(c.total || 0).toFixed(2)}`
].forEach(v => {

    const td = document.createElement("td");
    td.textContent = v ?? "";
    tr.appendChild(td);

});

// Forma de pago con estilo tipo "Office"
const tdPago = document.createElement("td");
tdPago.innerHTML = estiloFormaPago(c.forma_pago);
tr.appendChild(tdPago);

        body.appendChild(tr);
    });

    // Inicializar DataTables
    tablaHistorial = new DataTable("#tablaHistorial", {

        pageLength: 10,

        lengthMenu: [
            [10, 25, 50, 100],
            [10, 25, 50, 100]
        ],

        autoWidth: false,

    columnDefs: [
        { width: "15%",  targets: 0 }, // Comprobante
        { width: "9%",  targets: 1 }, // Fecha
        { width: "10%", targets: 2 }, // Código
        { width: "20%", targets: 3 }, // Productor
        { width: "10%", targets: 4 }, // Peso
        { width: "9%", targets: 5 }, // Precio
        { width: "10%", targets: 6 }, // Total
        { width: "17%", targets: 7 }  // Forma de pago
    ],

        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            infoEmpty: "Mostrando 0 a 0 de 0 registros",
            infoFiltered: "(filtrado de _MAX_ registros)",
            zeroRecords: "No se encontraron compras",
            emptyTable: "No existen compras registradas",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });

    // KPIs
    const count = document.getElementById("contadorCompras");
    const total = document.getElementById("totalAcumulado");

    if(count){
        count.textContent = compras.length.toLocaleString("es-EC");
    }

    if(total){
        total.textContent =
            `$ ${compras.reduce((s,c) => s + Number(c.total || 0), 0).toFixed(2)}`;
    }
}
function exportarComprasExcel(auto=false){
    if(typeof XLSX==="undefined"){ if(!auto)alert("No se pudo cargar SheetJS. Revise su conexión a Internet."); return false; }
    if(!compras.length){ if(!auto)alert("No existen compras registradas para exportar."); return false; }
    const cols=[
      ["Número comprobante","numero_comprobante"],["Fecha","fecha"],["Razón social emisor","razon_social"],["Nombre comercial","nombre_comercial"],["RUC emisor","ruc_emisor"],
      ["Productor","productor"],["Código productor","codigo_productor"],["Dirección productor","direccion_productor"],["Programa","programa"],
      ["Peso bruto (QQ)","peso_bruto_qq"],["Peso bruto (KG)","peso_bruto_kg"],["Humedad (%)","humedad_pct"],["Peso neto (QQ)","peso_neto_qq"],["Peso neto (KG)","peso_neto_kg"],
      ["Precio base ($/QQ)","precio_base_qq"],["Bonificación ($/QQ)","bonificacion_qq"],["Precio final ($/QQ)","precio_final_qq"],["Bonificación total","BonificacionTotal"],["Total","total"],["Forma de pago","forma_pago"],["Fecha de registro","fecha_registro"]
    ];
    const rows=compras.map(c=>Object.fromEntries(cols.map(([t,k])=>[t,c[k]])));
    const ws=XLSX.utils.json_to_sheet(rows); ws["!cols"]=cols.map(([t])=>({wch:Math.max(16,t.length+2)}));
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Compras");
    // La descarga es una instantánea acumulada; el navegador no permite modificar silenciosamente un archivo existente.
    const d=new Date(); const stamp=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
    XLSX.writeFile(wb,`CocoaTicket_Compras_${stamp}.xlsx`); return true;
}
function limpiarHistorial(){
    if(!compras.length){alert("El historial ya está vacío.");return;}
    if(!confirm("Esta acción eliminará todas las compras almacenadas en este navegador. ¿Desea continuar?"))return;
    compras=[];guardarCompras();actualizarHistorial();
}
function inicializarHistorial(){
    document.getElementById("btnExportarCompras")?.addEventListener("click",()=>exportarComprasExcel(false));
    document.getElementById("btnLimpiarHistorial")?.addEventListener("click",limpiarHistorial);
    actualizarHistorial();
}
