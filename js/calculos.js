/* CocoaPay - Cálculos de compra de cacao */
const KG_PER_QQ = 45.36;

function obtenerDatosCompra() {
    const pesoBruto = parseFloat(document.getElementById("pesoBruto")?.value) || 0;
    const tara = parseFloat(document.getElementById("tara")?.value) || 0;
    const humedad = parseFloat(document.getElementById("humedad")?.value) || 0;
    const calificacion = parseFloat(document.getElementById("calificacion")?.value) || 0;
    const precioBase = parseFloat(document.getElementById("precioBase")?.value) || 0;
    const bonificacion = parseFloat(document.getElementById("bonificacion")?.value) || 0;

    const pesoDespuesTara = Math.max(pesoBruto - tara, 0); 
    const pesoDespuesHumedad = pesoDespuesTara * (1 - humedad / 100);

    const pesoNetoQQ = pesoDespuesHumedad * (1 - calificacion / 100);
    const pesoBrutoKG = pesoBruto * KG_PER_QQ;
    const pesoNetoKG = pesoNetoQQ * KG_PER_QQ;
    const taraKG = tara * KG_PER_QQ;
    const precioFinal = precioBase + bonificacion;
    const total = precioFinal * pesoNetoQQ;

    return {pesoBruto,
        tara,
        humedad,
        calificacion,
        pesoNetoQQ,
        pesoBrutoKG,
        pesoNetoKG,
        taraKG,
        precioBase,
        bonificacion,
        precioFinal,
        total};
}

function actualizarVistaCalculos() {
    const d = obtenerDatosCompra();
    asignarTexto("vPesoBruto", d.pesoBruto.toFixed(2));
    asignarTexto("vPesoBrutoKG", d.pesoBrutoKG.toFixed(2));
    asignarTexto("vHumedad", d.humedad.toFixed(2) + "%");
    asignarTexto("vTara", d.tara.toFixed(2) + " QQ");
    asignarTexto("vTara2", d.tara.toFixed(2));
    asignarTexto("vCalificacion", d.calificacion.toFixed(2) + "%");
    asignarTexto("vPesoNetoQQ", d.pesoNetoQQ.toFixed(2));
    asignarTexto("vPesoNetoKG", d.pesoNetoKG.toFixed(2));
    asignarTexto("vTaraKG", d.taraKG.toFixed(2));
    asignarTexto("vPrecioBase", "$ " + d.precioBase.toFixed(2));
    asignarTexto("vBonificacionTable", "$ " + d.bonificacion.toFixed(2));
    asignarTexto("vPrecioFinal", "$ " + d.precioFinal.toFixed(2));
    asignarTexto("vTotal", "$ " + d.total.toFixed(2));
    asignarTexto("formTotal", "$ " + d.total.toFixed(2));
}

function asignarTexto(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = valor ?? "";
}
