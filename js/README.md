# JavaScript — Facturación de Cacao

Esta carpeta contiene los archivos JavaScript que implementan la lógica funcional del sistema de **gestión y generación de comprobantes de compra de cacao**.

Los scripts permiten gestionar la información ingresada por el usuario, realizar cálculos relacionados con la compra de cacao, generar comprobantes y controlar diferentes elementos de la aplicación.

## Estructura

```text
js/
├── app.js
├── clientes.js
├── productos.js
├── compras.js
├── comprobante.js
├── pdf.js
└── utils.js
```

> Los nombres anteriores representan una estructura recomendada y deben ajustarse a los archivos existentes en el proyecto.

## Funcionalidades principales

La lógica JavaScript del proyecto permite:

- Registrar información de productores.
- Gestionar productos y precios.
- Registrar compras de cacao.
- Calcular peso neto y valores de compra.
- Aplicar humedad y otros ajustes definidos por el sistema.
- Calcular el precio final.
- Calcular el total a pagar.
- Generar comprobantes de compra.
- Generar documentos PDF.
- Controlar la numeración de los comprobantes.
- Validar los datos ingresados.
- Gestionar la interacción entre formularios, tablas y componentes de la interfaz.

## Descripción de los archivos

### `app.js`

Archivo principal de la aplicación.

Se encarga de inicializar la interfaz y coordinar las principales funcionalidades del sistema.

Entre sus responsabilidades se encuentran:

- Inicialización de la aplicación.
- Configuración de eventos.
- Gestión de formularios.
- Navegación entre las diferentes secciones.
- Coordinación de los módulos JavaScript.
- Actualización de elementos de la interfaz.

---

### `clientes.js`

Gestiona la información relacionada con los productores de cacao.

Puede incluir funcionalidades para:

- Registrar productores.
- Consultar productores existentes.
- Editar información.
- Buscar productores.
- Mostrar información del productor seleccionado.
- Validar datos como identificación, teléfono y correo electrónico.

Los productores constituyen la base de información utilizada posteriormente durante el registro de una compra.

---

### `productos.js`

Gestiona los productos utilizados durante las operaciones de compra.

Entre sus funciones se encuentran:

- Registrar productos.
- Consultar productos disponibles.
- Definir unidades de medida.
- Gestionar precios base.
- Seleccionar el producto correspondiente a una compra.
- Actualizar automáticamente información relacionada con el precio.

---

### `compras.js`

Contiene la lógica relacionada con el registro de las compras de cacao.

Entre sus responsabilidades se encuentran:

- Seleccionar el productor.
- Registrar el peso recibido.
- Registrar el porcentaje de humedad.
- Calcular el peso neto.
- Aplicar el precio correspondiente.
- Calcular ajustes o diferenciales.
- Obtener el precio final.
- Calcular el valor total de la compra.
- Registrar la forma de pago.

El objetivo es centralizar los cálculos necesarios para determinar el valor que debe pagarse al productor.

---

### `comprobante.js`

Gestiona la información necesaria para generar el comprobante de compra.

Incluye funcionalidades relacionadas con:

- Número de comprobante.
- Fecha de compra.
- Datos del productor.
- Datos de la compra.
- Pesos y cantidades.
- Precio base.
- Diferencial.
- Precio final.
- Total a pagar.
- Forma de pago.

También puede encargarse de preparar la información antes de enviarla al módulo encargado de generar el PDF.

---

### `pdf.js`

Contiene la lógica para generar el comprobante en formato PDF.

El documento puede incluir:

- Identificación de la empresa.
- Número de comprobante.
- Fecha.
- Información del productor.
- Detalle de la compra.
- Peso bruto.
- Humedad.
- Peso neto.
- Precio base.
- Diferencial.
- Precio final.
- Total a pagar.
- Forma de pago.

La generación del documento se realiza utilizando las librerías configuradas para el proyecto, como **jsPDF** y sus complementos.

---

### `utils.js`

Contiene funciones auxiliares reutilizables por los demás archivos JavaScript.

Puede incluir funciones para:

- Formatear números.
- Formatear fechas.
- Validar campos.
- Convertir unidades.
- Redondear valores.
- Generar identificadores.
- Manipular elementos del DOM.
- Gestionar valores almacenados en `localStorage`.

El objetivo es evitar duplicación de código y mantener una estructura más organizada.

## Flujo de una compra

El flujo general de la aplicación puede representarse de la siguiente manera:

```text
Productor
    │
    ▼
Selección / registro
    │
    ▼
Datos de la compra
    │
    ├── Peso bruto
    ├── Humedad
    ├── Precio base
    └── Diferencial
    │
    ▼
Cálculos
    │
    ├── Peso neto
    ├── Precio final
    └── Total a pagar
    │
    ▼
Comprobante
    │
    ▼
Generación del PDF
```

## Cálculos

Los scripts relacionados con las compras deben mantener centralizada la lógica de cálculo para evitar inconsistencias.

Entre los principales valores utilizados se encuentran:

- **Peso bruto**
- **Humedad**
- **Peso neto**
- **Precio base**
- **Diferencial**
- **Precio final**
- **Total a pagar**

Las constantes y reglas de cálculo deben mantenerse claramente documentadas para facilitar futuras modificaciones.

## Numeración de comprobantes

El sistema utiliza una numeración consecutiva para los comprobantes.

La lógica de numeración permite:

- Definir un número inicial.
- Generar números consecutivos.
- Mantener el último número utilizado.
- Evitar duplicar números durante el uso normal de la aplicación.

Cuando la aplicación utiliza `localStorage`, esta información puede mantenerse entre diferentes sesiones del navegador.

## Validaciones

Antes de generar un comprobante, los scripts deben validar que la información necesaria esté correctamente ingresada.

Por ejemplo:

- La cantidad debe ser válida.
- La humedad debe encontrarse dentro del rango permitido.
- El precio base debe ser mayor que cero.
- Debe existir un productor seleccionado.
- Deben existir los datos mínimos necesarios para generar el comprobante.

Las validaciones tienen como objetivo evitar errores en los cálculos y en los documentos generados.

## Dependencias

Dependiendo de la configuración del proyecto, los archivos JavaScript pueden utilizar librerías como:

- **jsPDF** — generación de documentos PDF.
- **jsPDF AutoTable** — generación de tablas dentro del PDF.
- Otras librerías utilizadas por la interfaz.

Las dependencias deben mantenerse documentadas en el archivo HTML principal o en la documentación general del proyecto.

## Organización del código

La carpeta `js` busca separar las responsabilidades de la aplicación.

```text
Interfaz
   │
   ▼
app.js
   │
   ├── clientes.js
   ├── productos.js
   ├── compras.js
   ├── comprobante.js
   │
   └── pdf.js
          │
          ▼
       PDF final
```

Esta organización facilita:

- El mantenimiento del sistema.
- La identificación de errores.
- La incorporación de nuevas funcionalidades.
- La reutilización de código.
- La evolución del proyecto hacia una arquitectura más modular.

## Consideraciones para futuras modificaciones

Al modificar los archivos JavaScript:

1. Mantener separadas las responsabilidades de cada módulo.
2. Evitar duplicar funciones.
3. Centralizar funciones reutilizables en `utils.js`.
4. Mantener los cálculos de compra claramente documentados.
5. Validar los datos antes de generar comprobantes.
6. Mantener consistente la numeración de comprobantes.
7. Probar la generación del PDF después de modificar los datos del comprobante.
8. Evitar modificar directamente los valores almacenados sin considerar su impacto en comprobantes existentes.

## Objetivo

Los archivos JavaScript constituyen la capa funcional del sistema de facturación y comprobantes de compra de cacao, conectando la interfaz de usuario con los procesos de registro, cálculo y generación de documentos.

La estructura modular permite que el sistema pueda crecer progresivamente sin concentrar toda la lógica en un único archivo JavaScript.
