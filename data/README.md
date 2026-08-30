# Data

Esta carpeta está destinada al almacenamiento de los datos utilizados por CocoaTicket.

## Contenido

La carpeta puede contener archivos relacionados con:

- Productores.
- Compras registradas.
- Catálogos y datos de referencia.
- Configuraciones necesarias para la aplicación.
- Archivos utilizados para importar o respaldar información.

## Productores

CocoaTicket permite incorporar información de productores desde archivos externos.

Los datos básicos utilizados actualmente son:

- Código del productor.
- Nombre del productor.

Los archivos de productores pueden utilizarse como fuente para cargar y actualizar la información disponible en la aplicación.

## Compras

Los registros generados por las operaciones de compra pueden ser almacenados o exportados para mantener un historial acumulado de las transacciones.

La información puede incluir datos como:

- Número de comprobante.
- Fecha.
- Productor.
- Código del productor.
- Peso.
- Humedad.
- Precio.
- Bonificación.
- Total.
- Forma de pago.

## Formatos

Dependiendo de la funcionalidad utilizada, los datos pueden manejarse mediante formatos como:

- `.xlsx`
- `.csv`
- `.json`

## Consideraciones

Los archivos contenidos en esta carpeta pueden incluir información operativa de la empresa.

Por este motivo, se recomienda evitar publicar en repositorios públicos información real o sensible de productores y transacciones.

Para GitHub se pueden utilizar archivos de ejemplo o datos ficticios.

## Estructura sugerida

```text
data/
│
├── README.md
│
├── example/
│   └── productores_ejemplo.xlsx
│
└── exports/
    └── .gitkeep
