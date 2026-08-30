/*
 * CocoaPay v2
 */
const STORAGE_PRODUCTORES = "cocoaTicket_productores_v2";

const PRODUCTORES_INICIALES = [
    { codigo: "COD-0001", nombre: "PRODUCTOR EJEMPLO 0001" },
    { codigo: "COD-0002", nombre: "PRODUCTOR EJEMPLO 0002" },
    { codigo: "COD-0003", nombre: "PRODUCTOR EJEMPLO 0003" },
    { codigo: "COD-0004", nombre: "PRODUCTOR EJEMPLO 0004" },
    { codigo: "COD-0005", nombre: "PRODUCTOR EJEMPLO 0005" },
    { codigo: "COD-0006", nombre: "PRODUCTOR EJEMPLO 0006" },
    { codigo: "COD-0007", nombre: "PRODUCTOR EJEMPLO 0007" },
    { codigo: "COD-0008", nombre: "PRODUCTOR EJEMPLO 0008" },
    { codigo: "COD-0009", nombre: "PRODUCTOR EJEMPLO 0009" },
    { codigo: "COD-0010", nombre: "PRODUCTOR EJEMPLO 0010" },
    { codigo: "COD-0011", nombre: "PRODUCTOR EJEMPLO 0011" },
    { codigo: "COD-0012", nombre: "PRODUCTOR EJEMPLO 0012" },
    { codigo: "COD-0013", nombre: "PRODUCTOR EJEMPLO 0013" },
    { codigo: "COD-0014", nombre: "PRODUCTOR EJEMPLO 0014" },
    { codigo: "COD-0015", nombre: "PRODUCTOR EJEMPLO 0015" },
    { codigo: "COD-0016", nombre: "PRODUCTOR EJEMPLO 0016" },
    { codigo: "COD-0017", nombre: "PRODUCTOR EJEMPLO 0017" },
    { codigo: "COD-0018", nombre: "PRODUCTOR EJEMPLO 0018" },
    { codigo: "COD-0019", nombre: "PRODUCTOR EJEMPLO 0019" },
    { codigo: "COD-0020", nombre: "PRODUCTOR EJEMPLO 0020" },
    { codigo: "COD-0021", nombre: "PRODUCTOR EJEMPLO 0021" },
    { codigo: "COD-0022", nombre: "PRODUCTOR EJEMPLO 0022" },
    { codigo: "COD-0023", nombre: "PRODUCTOR EJEMPLO 0023" },
    { codigo: "COD-0024", nombre: "PRODUCTOR EJEMPLO 0024" },
    { codigo: "COD-0025", nombre: "PRODUCTOR EJEMPLO 0025" },
    { codigo: "COD-0026", nombre: "PRODUCTOR EJEMPLO 0026" },
    { codigo: "COD-0027", nombre: "PRODUCTOR EJEMPLO 0027" },
    { codigo: "COD-0028", nombre: "PRODUCTOR EJEMPLO 0028" },
    { codigo: "COD-0029", nombre: "PRODUCTOR EJEMPLO 0029" },
    { codigo: "COD-0030", nombre: "PRODUCTOR EJEMPLO 0030" },
    { codigo: "COD-0031", nombre: "PRODUCTOR EJEMPLO 0031" },
    { codigo: "COD-0032", nombre: "PRODUCTOR EJEMPLO 0032" }
];

let productores = cargarProductoresGuardados();

let tablaProductores = null;

function cargarProductoresGuardados() {

    try {

        const guardados =
            localStorage.getItem(STORAGE_PRODUCTORES);

        if (!guardados) {
            return [...PRODUCTORES_INICIALES];
        }

        const parsed =
            JSON.parse(guardados);

        if (!Array.isArray(parsed) || !parsed.length) {
            return [...PRODUCTORES_INICIALES];
        }

        return normalizarProductores(parsed);

    } catch (error) {

        console.error(error);

        return [...PRODUCTORES_INICIALES];
    }
}


function normalizarProductores(datos) {

    return datos
        .map(item => ({
            codigo: String(item.codigo ?? "").trim(),
            nombre: String(item.nombre ?? "").trim()
        }))
        .filter(item => item.codigo && item.nombre);
}


function guardarProductores() {

    localStorage.setItem(
        STORAGE_PRODUCTORES,
        JSON.stringify(productores)
    );
}


function actualizarDatalist() {

    const lista =
        document.getElementById("listaProductores");

    if (!lista) return;

    lista.innerHTML = "";

    productores.forEach(productor => {

        const option =
            document.createElement("option");

        option.value =
            productor.nombre;

        lista.appendChild(option);
    });
}


function buscarProductorPorNombre(nombre) {

    const texto =
        String(nombre || "")
            .trim()
            .toLowerCase();

    if (!texto) return null;

    return productores.find(productor =>
        productor.nombre.toLowerCase() === texto
    ) || null;
}


function actualizarEstadoBase(mensaje, tipo = "") {

    const estado =
        document.getElementById("estadoBase");

    const importacion =
        document.getElementById("estadoImportacion");

    if (estado) {

        estado.textContent = mensaje;

        // Restaurar color normal
        estado.style.color = "";
    }

    if (importacion) {

        importacion.textContent = mensaje;

        // Restaurar estilos anteriores
        importacion.className = "import-status";
        importacion.style.color = "";

        if (tipo === "success") {
            importacion.classList.add("success");
        }

        if (tipo === "error") {

            if (estado) {
                estado.style.color = "#d9534f";
            }

            importacion.style.color = "#d9534f";
            importacion.classList.add("error");
        }
    }
}


function procesarArchivoProductores(file) {

    if (!file) return;

    const nombreArchivo =
        document.getElementById("nombreArchivo");

    if (nombreArchivo) {
        nombreArchivo.textContent =
            `Archivo seleccionado: ${file.name}`;
    }

    if (typeof XLSX === "undefined") {

        actualizarEstadoBase(
            "No se pudo cargar SheetJS. Revise su conexión a Internet.",
            "error"
        );

        return;
    }

    const reader =
        new FileReader();

    reader.onload = function(event) {

        try {

            const datos =
                new Uint8Array(event.target.result);

            const workbook =
                XLSX.read(
                    datos,
                    { type: "array" }
                );

            if (!workbook.SheetNames.length) {
                throw new Error(
                    "El archivo no contiene hojas."
                );
            }

            const hoja =
                workbook.Sheets[
                    workbook.SheetNames[0]
                ];

            const filas =
                XLSX.utils.sheet_to_json(
                    hoja,
                    {
                        defval: "",
                        raw: false
                    }
                );

            if (!filas.length) {
                throw new Error(
                    "La hoja no contiene registros."
                );
            }

            const columnas =
                Object.keys(filas[0]);

            const columnaCodigo =
                encontrarColumna(
                    columnas,
                    [
                        "codigo",
                        "código",
                        "codigo productor",
                        "producer code"
                    ]
                );

            const columnaNombre =
                encontrarColumna(
                    columnas,
                    [
                        "nombre",
                        "nombre productor",
                        "productor",
                        "name"
                    ]
                );

            if (!columnaCodigo || !columnaNombre) {

                throw new Error(
                    "El archivo debe contener las columnas 'codigo' y 'nombre'."
                );
            }

            const nuevaBase =
                normalizarProductores(
                    filas.map(fila => ({
                        codigo: fila[columnaCodigo],
                        nombre: fila[columnaNombre]
                    }))
                );

            if (!nuevaBase.length) {

                throw new Error(
                    "No se encontraron registros válidos."
                );
            }

            productores =
                eliminarDuplicados(nuevaBase);

            guardarProductores();

            actualizarDatalist();
            refrescarTablaProductores();
            actualizarContadorProductores();

            actualizarEstadoBase(
                `Base actualizada: ${productores.length.toLocaleString("es-EC")} productores.`,
                "success"
            );

            limpiarProductorSeleccionado();

        } catch (error) {

            console.error(error);

            actualizarEstadoBase(
                `Error al importar: ${error.message}`,
                "error"
            );
        }
    };

    reader.onerror = function() {

        actualizarEstadoBase(
            "No fue posible leer el archivo.",
            "error"
        );
    };

    reader.readAsArrayBuffer(file);
}


function encontrarColumna(columnas, alternativas) {

    const normalizadas =
        columnas.map(columna => ({
            original: columna,
            normalizada: normalizarTexto(columna)
        }));

    for (const alternativa of alternativas) {

        const buscada =
            normalizarTexto(alternativa);

        const encontrada =
            normalizadas.find(
                item =>
                    item.normalizada === buscada
            );

        if (encontrada) {
            return encontrada.original;
        }
    }

    return null;
}


function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ");
}


function eliminarDuplicados(datos) {

    const vistos = new Set();

    return datos.filter(item => {

        const clave =
            `${item.codigo}|||${normalizarTexto(item.nombre)}`;

        if (vistos.has(clave)) {
            return false;
        }

        vistos.add(clave);

        return true;
    });
}


function limpiarProductorSeleccionado() {

    const productor =
        document.getElementById("productor");

    const codigo =
        document.getElementById("codigo");

    const resultado =
        document.getElementById("resultadoProductor");

    if (productor) productor.value = "";
    if (codigo) codigo.value = "";

    if (resultado) resultado.textContent = "";
}


function inicializarProductores() {

actualizarDatalist();

actualizarTablaProductores();

actualizarContadorProductores();

const archivo =
    document.getElementById("archivoProductores");

if (archivo) {

    archivo.addEventListener(
        "change",
        function() {

            procesarArchivoProductores(
                this.files[0]
            );
        }
    );
}

const botonAgregar =
    document.getElementById("btnAgregarProductor");

if (botonAgregar) {

    botonAgregar.addEventListener(
        "click",
        agregarProductorManual
    );
}

const nombreInput =
    document.getElementById("nuevoProductorNombre");

const codigoInput =
    document.getElementById("nuevoProductorCodigo");

// Permitir guardar presionando ENTER
if (nombreInput) {

    nombreInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                agregarProductorManual();
            }
        }
    );
}

if (codigoInput) {

    codigoInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                agregarProductorManual();
            }
        }
    );
}

actualizarEstadoBase(
    `${productores.length.toLocaleString("es-EC")} productores disponibles.`
);

}


function agregarProductorManual() {

const codigoInput =
    document.getElementById("nuevoProductorCodigo");

const nombreInput =
    document.getElementById("nuevoProductorNombre");

const estado =
    document.getElementById("estadoNuevoProductor");

if (!codigoInput || !nombreInput) {
    return;
}

const codigo =
    codigoInput.value.trim();

const nombre =
    nombreInput.value.trim();

// =========================
// VALIDAR CÓDIGO
// =========================

if (!codigo) {

    mostrarEstadoNuevoProductor(
        "Ingrese el código del productor",
        "error"
    );

    codigoInput.focus();

    return;
}

// =========================
// VALIDAR NOMBRE
// =========================

if (!nombre) {

    mostrarEstadoNuevoProductor(
        "Ingrese los nombres y apellidos del productor.",
        "error"
    );

    nombreInput.focus();

    return;
}

// =========================
// VALIDAR CÓDIGO DUPLICADO
// =========================

const codigoExiste =
    productores.some(productor =>
        normalizarTexto(productor.codigo) ===
        normalizarTexto(codigo)
    );

if (codigoExiste) {

    mostrarEstadoNuevoProductor(
        "Ya existe un productor con ese código.",
        "error"
    );

    codigoInput.focus();

    return;
}

// =========================
// VALIDAR NOMBRE DUPLICADO
// =========================

const nombreExiste =
    productores.some(productor =>
        normalizarTexto(productor.nombre) ===
        normalizarTexto(nombre)
    );

if (nombreExiste) {

    mostrarEstadoNuevoProductor(
        "Ya existe un productor con ese nombre.",
        "error"
    );

    nombreInput.focus();

    return;
}

// =========================
// CREAR PRODUCTOR
// =========================

const nuevoProductor = {
    codigo: codigo,
    nombre: nombre
};

productores.push(nuevoProductor);


guardarProductores();

actualizarDatalist();
refrescarTablaProductores();
actualizarContadorProductores();


codigoInput.value = "";
nombreInput.value = "";

// =========================
// MENSAJE
// =========================

mostrarEstadoNuevoProductor(
    `Productor agregado correctamente (${codigo}).`,
    "success"
);

actualizarEstadoBase(
    `${productores.length.toLocaleString("es-EC")} productores disponibles.`,
    "success"
);

nombreInput.focus();

}

// function mostrarEstadoNuevoProductor(mensaje, tipo = "") {

// const estado =
//     document.getElementById("estadoNuevoProductor");

// if (!estado) return;

// estado.textContent = mensaje;

// estado.className = "config-status";

// if (tipo === "success") {
//     estado.classList.add("success");
// }

// if (tipo === "error") {
//     estado.style.color = "#d9534f";
//     estado.classList.add("error");
// }

// }

// function mostrarEstadoNuevoProductor(mensaje, tipo = "") { const estado = document.getElementById("estadoNuevoProductor"); if (!estado) return; estado.textContent = mensaje; estado.className = "config-status"; estado.style.color = ""; if (tipo === "success") { estado.classList.add("success"); } if (tipo === "error") { estado.style.color = "#b64a4a"; estado.classList.add("error"); } }

function mostrarEstadoNuevoProductor(mensaje, tipo = "") {

    const estado =
        document.getElementById("estadoNuevoProductor");

    if (!estado) return;

    estado.textContent = mensaje;

    estado.className = "config-status";

    // Limpiar estilos anteriores
    estado.style.color = "";

    if (tipo === "success") {
        estado.classList.add("success");
    }

    if (tipo === "error") {
        estado.classList.add("error");
    }
}



function actualizarTablaProductores() {

    const tabla = document.getElementById("producerTable");

    if (!tabla) return;

    // Si DataTables ya fue inicializado,
    // no volver a crearlo.
    if (tablaProductores) {
        return;
    }

    // Crear DataTables una sola vez
    tablaProductores = new DataTable("#tablaProductores", {

        data: productores.map(productor => [
            productor.codigo,
            productor.nombre
        ]),

        pageLength: 5,

        lengthMenu: [
            [5, 10, 20, 50],
            [5, 10, 20, 50]
        ],

        autoWidth: false,

        columnDefs: [
            {
                width: "30%",
                targets: 0
            },
            {
                width: "70%",
                targets: 1
            }
        ],

        order: [
            [0, "asc"]
        ],

        language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ productores",
            info: "Mostrando _START_ a _END_ de _TOTAL_ productores",
            infoEmpty: "Mostrando 0 a 0 de 0 productores",
            infoFiltered: "(filtrado de _MAX_ productores)",
            zeroRecords: "No se encontraron productores",
            emptyTable: "No hay productores registrados",

            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });
}


function refrescarTablaProductores() {

    if (!tablaProductores) {
        actualizarTablaProductores();
        return;
    }

    // Guardar estado actual
    const paginaActual = tablaProductores.page();
    const cantidadActual = tablaProductores.page.len();
    const ordenActual = tablaProductores.order();
    const busquedaActual = tablaProductores.search();

    // Reemplazar completamente los datos
    tablaProductores.clear();

    tablaProductores.rows.add(
        productores.map(productor => [
            productor.codigo,
            productor.nombre
        ])
    );

    // Restaurar estado
    tablaProductores
        .page.len(cantidadActual)
        .order(ordenActual)
        .search(busquedaActual)
        .draw(false);

    // Asegurar que la página actual siga siendo válida
    const paginasTotales =
        tablaProductores.page.info().pages;

    if (paginasTotales > 0) {

        tablaProductores
            .page(
                Math.min(
                    paginaActual,
                    paginasTotales - 1
                )
            )
            .draw(false);
    }
}


function actualizarContadorProductores() {

const contador =
    document.getElementById("producerCount");

if (!contador) return;

contador.textContent =
    productores.length.toLocaleString("es-EC");

}
