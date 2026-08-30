# CocoaPay v2

Sistema web para la gestión de recepción y compra de cacao.

CocoaPay permite registrar productores, gestionar datos de la empresa, calcular pesos y valores de compra, generar comprobantes internos en PDF y mantener la información almacenada localmente en el navegador.

> Importante: CocoaPay genera comprobantes internos de recepción y compra. No constituye actualmente una factura electrónica autorizada.

---

## Características

### Gestión de compras

- Registro de fecha de operación.
- Registro de productor.
- Código del productor.
- Registro de cantidad/peso bruto.
- Registro de tara.
- Cálculo automático del peso neto.
- Conversión entre QQ y KG.
- Registro de humedad.
- Registro de calificación.
- Registro de precio base.
- Cálculo de bonificaciones.
- Cálculo del precio final.
- Cálculo del valor total de la compra.
- Forma de pago.
- Concepto de compra.
- Observaciones.

### Gestión de productores

- Registro de productores.
- Código asociado a cada productor.
- Búsqueda por nombre.
- Validación de coincidencia del productor.
- Importación de productores desde archivo.
- Visualización del historial de compras.

### Configuración de empresa

Permite configurar:

- Razón social.
- Nombre comercial.
- RUC.
- Actividad económica.
- Dirección.
- Teléfono.
- Correo electrónico.
- Logo de la empresa.

El logo puede ser utilizado tanto en la interfaz como en el comprobante generado.

### Numeración

Sistema de numeración configurable:

- Establecimiento.
- Punto de emisión.
- Secuencial.

El número del comprobante se genera automáticamente con el formato:

001-001-000000001

Después de generar un comprobante, el secuencial se incrementa automáticamente para dejar listo el siguiente registro.

### Generación de comprobantes

CocoaPay genera un comprobante interno en formato PDF utilizando jsPDF.

El documento incluye:

- Logo de la empresa.
- Información de la empresa.
- RUC.
- Actividad económica.
- Dirección.
- Número de comprobante.
- Código de barras.
- Datos del productor.
- Fecha.
- Programa.
- Forma de pago.
- Peso bruto.
- Tara.
- Humedad.
- Calificación.
- Peso neto.
- Precio base.
- Bonificación.
- Precio final.
- Total.
- Observaciones.
- Firmas.

### Almacenamiento local

La aplicación utiliza `localStorage` para conservar la información en el navegador.

Entre los datos almacenados se encuentran:

- Configuración de empresa.
- Logo.
- Numeración.
- Productores.
- Historial de compras.

No requiere actualmente una base de datos externa para funcionar.

---

## Validaciones

El sistema incorpora diferentes validaciones para evitar errores durante el registro.

### Campos obligatorios

Se validan campos como:

- Fecha.
- Productor.
- Código.
- Cantidad.
- Tara.
- Humedad.
- Calificación.
- Precio base.
- Forma de pago.
- Concepto.

### Validación de Tara

La tara debe ser siempre menor que la cantidad/peso bruto.

### Productor inexistente

Cuando se escribe un productor que no coincide con la base registrada, el sistema muestra un mensaje indicando que no existe una coincidencia exacta.

### RUC

El RUC debe contener 13 dígitos.

### Numeración

El establecimiento y punto de emisión utilizan tres dígitos.

Ejemplo:

001

El secuencial debe ser un número entero mayor o igual a 1.

---

## Interfaz

La interfaz está diseñada para ser sencilla y enfocada en el trabajo operativo.

Incluye:

- Dashboard.
- Barra lateral de navegación.
- Barra superior.
- Formularios.
- Tarjetas de información.
- Indicadores KPI.
- Vista previa del comprobante.
- Historial.
- Configuración.
- Diseño responsive.

La interfaz utiliza una combinación de colores claros con tonos verdes relacionados con el concepto de cacao y comercio.

---

## Diseño responsive

La aplicación está adaptada para diferentes tamaños de pantalla.

Se contemplan principalmente:

- Computadores.
- Laptops.
- Tablets.
- Dispositivos móviles.

En pantallas pequeñas, el menú lateral se convierte en un menú desplegable.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage
- jsPDF
- JsBarcode

---

## Librerías externas

### jsPDF

Utilizada para generar los comprobantes en formato PDF.

### JsBarcode

Utilizada para generar el código de barras asociado al número del comprobante.

Estas librerías pueden cargarse mediante CDN o incorporarse localmente al proyecto.

---

## Estructura 

La estructura del proyecto se organiza de la siguiente manera:

    CocoaPay/
    │
    ├── index.html
    │
    ├── css/
    │   └── styles.css
    │
    ├── js/
    │   ├── app.js
    │   ├── empresa.js
    │   ├── productores.js
    │   ├── compras.js
    │   └── dashboard.js
    │
    ├── assets/
    │   └── images/
    │
    └── README.md

---

## Instalación y ejecución

CocoaPay es una aplicación web del lado del cliente.

No requiere inicialmente:

- Node.js.
- PHP.
- MySQL.
- Servidor backend.

Para ejecutar el proyecto:

1. Descargar o clonar el repositorio.

2. Abrir la carpeta del proyecto.

3. Ejecutar `index.html` en un navegador.

Para una mejor experiencia de desarrollo se recomienda utilizar un servidor local como Live Server.

---

## GitHub Pages

El proyecto puede será publicado utilizando GitHub Pages debido a que funciona principalmente del lado del cliente.

Una vez configurado GitHub Pages, la aplicación puede ser utilizada directamente desde el navegador.

---

## Privacidad de los datos

Actualmente los datos se almacenan utilizando `localStorage`.

Esto significa que:

- La información permanece en el navegador utilizado.
- No existe sincronización automática entre dispositivos.
- Los datos pueden perderse si se limpia el almacenamiento del navegador.
- Otro dispositivo no tendrá automáticamente los mismos registros.

Para una versión empresarial se recomienda implementar posteriormente un backend y una base de datos.

---

## Flujo principal

El flujo básico de trabajo es:

    1. Configurar empresa
            ↓
    2. Cargar productores
            ↓
    3. Configurar numeración
            ↓
    4. Registrar compra
            ↓
    5. Validar información
            ↓
    6. Revisar comprobante
            ↓
    7. Generar PDF
            ↓
    8. Registrar compra
            ↓
    9. Incrementar secuencial
            ↓
    10. Limpiar formulario
            ↓
    11. Listo para el siguiente registro

---

## Conversión de peso

El sistema utiliza la conversión estándar:

    1 QQ = 45.36 KG

Ejemplo:

    10 QQ = 453.60 KG

El peso neto se obtiene restando la tara al peso bruto:

    Peso Neto = Peso Bruto - Tara

---

## Número de comprobante

El comprobante utiliza la siguiente estructura:

    ESTABLECIMIENTO-PUNTO_EMISION-SECUENCIAL

Ejemplo:

    001-001-000000027

Después de generar el comprobante:

    001-001-000000027

pasa automáticamente al siguiente:

    001-001-000000028

Esto permite mantener una secuencia automática de comprobantes.

---

## Logo de empresa

El sistema permite cargar un logo en formato:

- PNG.
- JPG/JPEG.

El logo se adapta automáticamente al espacio disponible para evitar que una imagen grande sobresalga de su contenedor.

El logo puede visualizarse en:

- Configuración.
- Barra de navegación.
- Vista previa.
- Comprobante PDF.

---

## Limitaciones actuales

Esta versión utiliza almacenamiento local y está orientada principalmente a una operación local.

Actualmente no incluye:

- Base de datos centralizada.
- Usuarios y contraseñas.
- Control de permisos.
- Sincronización entre dispositivos.
- Backend.
- API.
- Facturación electrónica.
- Firma electrónica.
- Envío automático de comprobantes por correo.

---

## Próximas mejoras

Algunas mejoras que pueden incorporarse posteriormente:

- Base de datos centralizada.
- Sistema de usuarios.
- Inicio de sesión.
- Roles y permisos.
- Respaldo de información.
- Exportación de datos.
- Importación masiva de productores.
- Reportes de compras.
- Reportes por productor.
- Reportes por fechas.
- Estadísticas avanzadas.
- Control de inventario.
- Gestión de proveedores.
- Generación de reportes Excel.
- Facturación electrónica.
- Firma electrónica.
- Copias de seguridad automáticas.
- Sincronización en la nube.

---

## Desarrollo

CocoaPay está desarrollado como una aplicación web utilizando tecnologías frontend estándar.

La lógica principal se encuentra implementada en JavaScript, mientras que HTML y CSS se encargan de la estructura y presentación de la aplicación.

---

## Estado del proyecto

**Versión:** CocoaPay v2

**Estado:** En desarrollo

El proyecto continúa evolucionando con nuevas funcionalidades, validaciones y mejoras visuales.

---

## Licencia

Este proyecto puede adaptarse a las necesidades de la empresa propietaria.

Si el proyecto será distribuido públicamente, se recomienda definir una licencia específica antes de publicar el repositorio.

---

## CocoaPay

Sistema de recepción y compra de cacao.

Diseñado para facilitar el registro, cálculo, control y generación de comprobantes internos de compra de cacao.