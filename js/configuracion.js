/*
 * CocoaPay v2
 */

const STORAGE_EMPRESA = "cocoaTicket_empresa_v2";
const STORAGE_NUMERACION = "cocoaTicket_numeracion_v2";
const STORAGE_LOGO = "cocoaTicket_logo_v1";

const EMPRESA_INICIAL = {
    razonSocial: "RAZON SOCIAL DE LA EMPRESA",
    nombreComercial: "NOMBRE COMERCIAL DE LA EMPRESA",
    ruc: "0999999999001",
    actividad: "ACTIVIDAD ECONÓMICA PRINCIPAL",
    direccion: "UBICACIÓN DEL ESTABLECIMIENTO",
    telefono: "",
    correo: "correo@empresa.com"
};

const NUMERACION_INICIAL = {
    establecimiento: "001",
    puntoEmision: "001",
    secuencial: 1
};

let empresa = cargarEmpresa();
let numeracion = cargarNumeracion();
let logoEmpresa = localStorage.getItem(STORAGE_LOGO) || "";
empresa.logo = logoEmpresa;


function cargarEmpresa() {

    try {

        const guardado =
            localStorage.getItem(STORAGE_EMPRESA);

        if (!guardado) {
            return { ...EMPRESA_INICIAL };
        }

        const parsed =
            JSON.parse(guardado);

        return {
            ...EMPRESA_INICIAL,
            ...parsed
        };

    } catch (error) {

        console.error(
            "No se pudo cargar la configuración de empresa:",
            error
        );

        return { ...EMPRESA_INICIAL };
    }
}


function cargarNumeracion() {

    try {

        const guardado =
            localStorage.getItem(STORAGE_NUMERACION);

        if (!guardado) {
            return { ...NUMERACION_INICIAL };
        }

        const parsed =
            JSON.parse(guardado);

        return {
            ...NUMERACION_INICIAL,
            ...parsed
        };

    } catch (error) {

        console.error(
            "No se pudo cargar la numeración:",
            error
        );

        return { ...NUMERACION_INICIAL };
    }
}


function guardarEmpresa() {

    empresa = {
        razonSocial:
            obtenerValor("empresaRazonSocial"),

        nombreComercial:
            obtenerValor("empresaNombreComercial"),

        ruc:
            obtenerValor("empresaRuc"),

        actividad:
            obtenerValor("empresaActividad"),

        direccion:
            obtenerValor("empresaDireccion"),

        telefono:
            obtenerValor("empresaTelefono"),

        correo:
            obtenerValor("empresaCorreo"),
        logo: logoEmpresa
    };

    if (!empresa.razonSocial) {

        mostrarEstadoEmpresa(
            "La razón social es obligatoria.",
            "error"
        );

        return false;
    }

    if (
        empresa.ruc &&
        !/^\d{13}$/.test(empresa.ruc)
    ) {

        mostrarEstadoEmpresa(
            "El RUC debe contener 13 dígitos.",
            "error"
        );

        return false;
    }

    localStorage.setItem(
        STORAGE_EMPRESA,
        JSON.stringify(empresa)
    );

    actualizarVistaEmpresa();
    actualizarLogoSidebar();

    mostrarEstadoEmpresa(
        "Datos de la empresa guardados correctamente.",
        "success"
    );

    return true;
}


function restaurarEmpresa() {

    const confirmar =
        confirm(
            "¿Desea restaurar los datos iniciales de la empresa?"
        );

    if (!confirmar) {
        return;
    }

    empresa = { ...EMPRESA_INICIAL, logo: "" };
    logoEmpresa = "";
    localStorage.removeItem(STORAGE_LOGO);

    localStorage.setItem(
        STORAGE_EMPRESA,
        JSON.stringify(empresa)
    );

    cargarEmpresaEnFormulario();

    actualizarVistaEmpresa();

    mostrarEstadoEmpresa(
        "Se restauraron los valores iniciales.",
        "success"
    );
}


function cargarEmpresaEnFormulario() {

    asignarValor(
        "empresaRazonSocial",
        empresa.razonSocial
    );

    asignarValor(
        "empresaNombreComercial",
        empresa.nombreComercial
    );

    asignarValor(
        "empresaRuc",
        empresa.ruc
    );

    asignarValor(
        "empresaActividad",
        empresa.actividad
    );

    asignarValor(
        "empresaDireccion",
        empresa.direccion
    );

    asignarValor(
        "empresaTelefono",
        empresa.telefono
    );

    asignarValor(
        "empresaCorreo",
        empresa.correo
    );
}


function guardarNumeracion() {

    const establecimiento =
        obtenerValor("establecimiento");

    const puntoEmision =
        obtenerValor("puntoEmision");

    const secuencial =
        parseInt(
            obtenerValor("secuencial"),
            10
        );

    if (!/^\d{3}$/.test(establecimiento)) {

        mostrarEstadoNumeracion(
            "El establecimiento debe tener 3 dígitos.",
            "error"
        );

        return false;
    }

    if (!/^\d{3}$/.test(puntoEmision)) {

        mostrarEstadoNumeracion(
            "El punto de emisión debe tener 3 dígitos.",
            "error"
        );

        return false;
    }

    if (
        !Number.isInteger(secuencial) ||
        secuencial < 1
    ) {

        mostrarEstadoNumeracion(
            "El secuencial debe ser un número entero mayor o igual a 1.",
            "error"
        );

        return false;
    }

    numeracion = {
        establecimiento,
        puntoEmision,
        secuencial
    };

    localStorage.setItem(
        STORAGE_NUMERACION,
        JSON.stringify(numeracion)
    );

    actualizarNumeroVista();

    mostrarEstadoNumeracion(
        "Numeración guardada correctamente.",
        "success"
    );

    return true;
}


function cargarNumeracionEnFormulario() {

    asignarValor(
        "establecimiento",
        numeracion.establecimiento
    );

    asignarValor(
        "puntoEmision",
        numeracion.puntoEmision
    );

    asignarValor(
        "secuencial",
        numeracion.secuencial
    );
}


function obtenerNumeroFactura() {

    return [
        String(numeracion.establecimiento).padStart(3, "0"),
        String(numeracion.puntoEmision).padStart(3, "0"),
        String(numeracion.secuencial).padStart(9, "0")
    ].join("-");
}


function incrementarSecuencial() {

    numeracion.secuencial++;

    localStorage.setItem(
        STORAGE_NUMERACION,
        JSON.stringify(numeracion)
    );

    asignarValor(
        "secuencial",
        numeracion.secuencial
    );
}


function actualizarNumeroVista() {

    const numero =
        obtenerNumeroFactura();

    const principal = document.getElementById("vComprobante");
    const prefix = document.getElementById("vComprobantePrefix");
    const kpi = document.getElementById("kpiNext");
    const kpiPrefix = document.getElementById("kpiPrefix");
    const comprobante = document.getElementById("vComprobanteReceipt");
    const parts = numero.split("-");
    const sec = parts[2] || numero;
    const pref = parts.slice(0,2).join("-");
    if (principal) principal.textContent = sec;
    if (prefix) prefix.textContent = pref;
    if (kpi) kpi.textContent = sec;
    if (kpiPrefix) kpiPrefix.textContent = pref;
    if (comprobante) comprobante.textContent = numero;
}


function actualizarVistaEmpresa() {

    const nombre =
        empresa.nombreComercial ||
        empresa.razonSocial ||
        "";

    const nombreElement =
        document.getElementById("vEmpresaNombre");

    const rucElement =
        document.getElementById("vEmpresaRuc");

    const direccionElement =
        document.getElementById("vEmpresaDireccion");

    const receiptNombre =
        document.getElementById("receiptEmpresaNombre");

    const receiptDatos =
        document.getElementById("receiptEmpresaDatos");

    const topCompany =
        document.getElementById("topCompany");

    if (nombreElement) {
        nombreElement.textContent = nombre;
    }

    if (rucElement) {
        rucElement.textContent =
            empresa.ruc || "—";
    }

    if (direccionElement) {
        direccionElement.textContent =
            empresa.direccion || "—";
    }

    if (topCompany) {
        topCompany.textContent = nombre;
    }

    if (receiptNombre) {

        const partes =
            empresa.razonSocial
                .split(" ")
                .reduce(
                    (acumulado, palabra) => {

                        const ultimo =
                            acumulado[acumulado.length - 1];

                        if (
                            !ultimo ||
                            ultimo.length + palabra.length + 1 > 28
                        ) {
                            acumulado.push(palabra);
                        } else {
                            acumulado[acumulado.length - 1] +=
                                " " + palabra;
                        }

                        return acumulado;

                    },
                    []
                );

        receiptNombre.innerHTML =
            partes.join("<br>");
    }

    if (receiptDatos) {

        const lineas = [];

        if (empresa.ruc) {
            lineas.push(
                "RUC: " + empresa.ruc
            );
        }

        if (empresa.actividad) {
            lineas.push(
                empresa.actividad
            );
        }

        if (empresa.direccion) {

            const direccion =
                dividirTexto(
                    empresa.direccion,
                    42
                );

            lineas.push(...direccion);
        }

        receiptDatos.innerHTML =
            lineas.join("<br>");
    }
}


function actualizarLogoPreview() {
    const preview = document.getElementById("empresaLogoPreview");
    const receipt = document.getElementById("receiptLogo");
    const fallback = document.getElementById("logoFallback");
    if (preview) {
        preview.src = logoEmpresa || "";
        preview.style.display = logoEmpresa ? "block" : "none";
    }
    if (receipt) {
        receipt.src = logoEmpresa || "";
        receipt.style.display = logoEmpresa ? "block" : "none";
    }
    if (fallback) fallback.style.display = logoEmpresa ? "none" : "block";
}

function procesarLogo(file) {
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) { alert("Seleccione un logo PNG o JPG."); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        logoEmpresa = e.target.result;
        localStorage.setItem(STORAGE_LOGO, logoEmpresa);
        empresa.logo = logoEmpresa;
        localStorage.setItem(STORAGE_EMPRESA, JSON.stringify(empresa));
        actualizarLogoPreview();
    };
    reader.readAsDataURL(file);
}

function eliminarLogo() {
    logoEmpresa = "";
    empresa.logo = "";
    localStorage.removeItem(STORAGE_LOGO);
    localStorage.setItem(STORAGE_EMPRESA, JSON.stringify(empresa));
    actualizarLogoPreview();
}

function dividirTexto(texto, maximo) {

    const palabras =
        String(texto)
            .trim()
            .split(/\s+/);

    const lineas = [];
    let actual = "";

    palabras.forEach(palabra => {

        const candidata =
            actual
                ? actual + " " + palabra
                : palabra;

        if (candidata.length > maximo) {

            if (actual) {
                lineas.push(actual);
            }

            actual = palabra;

        } else {

            actual = candidata;
        }
    });

    if (actual) {
        lineas.push(actual);
    }

    return lineas;
}


function obtenerValor(id) {

    const elemento =
        document.getElementById(id);

    return elemento
        ? elemento.value.trim()
        : "";
}


function asignarValor(id, valor) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.value =
            valor ?? "";
    }
}


function mostrarEstadoEmpresa(mensaje, tipo = "") {

    const estado = document.getElementById("estadoEmpresa");

    if (!estado) return;

    estado.textContent = mensaje;

    // Limpiar estilos anteriores
    estado.className = "config-status";
    estado.style.color = "";

    if (tipo === "success") {
        estado.style.color = "#16a085";
    }

    if (tipo === "error") {
        estado.style.color = "#d9534f";
    }
}


function mostrarEstadoNumeracion(mensaje, tipo = "") {

    const elemento =
        document.getElementById("estadoNumeracion");

    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.className = "config-status";

    if (tipo) {
        elemento.classList.add(tipo);
    }
}

function actualizarLogoSidebar() {
    const brand = document.querySelector('.brand');
    const img = document.getElementById('sidebarLogo');

    if (!brand || !img) return;

    if (empresa && empresa.logo) {
        img.src = empresa.logo;
        img.classList.add('loaded');

        // Oculta CocoaPay + v2
        brand.classList.add('has-logo');

    } else {
        img.removeAttribute('src');
        img.classList.remove('loaded');

        // Vuelve al diseño original
        brand.classList.remove('has-logo');
    }
}

function inicializarConfiguracion() {

    cargarEmpresaEnFormulario();

    cargarNumeracionEnFormulario();

    actualizarVistaEmpresa();

    actualizarNumeroVista();

    actualizarLogoSidebar();

    document
        .getElementById("btnGuardarEmpresa")
        ?.addEventListener(
            "click",
            guardarEmpresa
        );

    document
        .getElementById("btnRestaurarEmpresa")
        ?.addEventListener(
            "click",
            restaurarEmpresa
        );

    document
        .getElementById("btnGuardarNumeracion")
        ?.addEventListener(
            "click",
            guardarNumeracion
        );

    document.getElementById("empresaLogo")?.addEventListener("change", e => procesarLogo(e.target.files?.[0]));
    document.getElementById("btnEliminarLogo")?.addEventListener("click", eliminarLogo);
    actualizarLogoPreview();
    actualizarLogoSidebar();
}
