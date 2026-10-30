# PrecioCerca – Comparador de precios

Aplicación móvil académica desarrollada con React Native + Expo.

## Requisitos
- Node.js LTS instalado.
- Expo Go en el teléfono (opcional, para probar desde el celular).

## Cómo ejecutar
1. Descomprimí el proyecto.
2. Abrí una terminal dentro de la carpeta `PrecioCerca`.
3. Ejecutá `npm install`.
4. Ejecutá `npx expo start`.
5. Escaneá el código QR con Expo Go o elegí un emulador.

## Funcionalidades
- Listado de productos y búsqueda/filtrado.
- Comparación y ordenamiento de precios por negocio.
- Cálculo automático del precio más bajo.
- Alta de productos con precios por negocio.
- Actualización de precios.
- Lista de compra con cantidades y comparación de totales por negocio.

## Conceptos de programación aplicados
- `useState` para manejar los estados.
- `TextInput` para ingresar y modificar información.
- `Pressable` para botones y eventos.
- `map()` para recorrer productos, negocios y precios.
- Condicionales para mostrar resultados y estados vacíos.
- Arrays y objetos para organizar los datos.
- `filter()` para buscar productos.
- `sort()` y `Math.min()` para comparar precios.
- `reduce()` para calcular el total de la compra.

## Datos
Los datos iniciales son ficticios y están guardados en arrays/objetos dentro de `App.js`. No se utiliza base de datos, backend ni API externa. Los cambios se mantienen mientras la aplicación está abierta; al reiniciarla, vuelven los datos iniciales.
