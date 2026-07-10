# Reglas de diagramas MRU

Basado en los diagramas de referencia en `docs/diagramas-referencia/`.

---

## 1. Elementos del diagrama

Todo diagrama MRU contiene:

- **Eje X principal**: línea horizontal (sin punta de flecha ni etiqueta "x")
- **Origen**: marcado con un tick vertical en el eje, etiquetado como $x = 0$
- **Móvil (cuadrado)**: representa la **posición inicial** $x_i$, sin ojo ni punto interior
- **Tick de $x_i$**: marca en el eje alineada con el móvil (solo cuando $x_i \neq 0$)
- **Tick de $x_f$**: marca en el eje para la posición final
- **Vector velocidad**: flecha desde el borde frontal del móvil, centrada verticalmente en la caja
- **Flecha de desplazamiento (Δx)**: eje secundario debajo del principal, desde $x_i$ hasta $x_f$
- **Etiquetas**: $x = 0$, $x_i$, $x_f$, $v$, $t$, $\Delta x$

---

## 2. Posiciones

### 2.1 El móvil representa $x_i$

El cuadrado blanco con borde negro representa la **posición inicial** $x_i$.

### 2.2 Ticks en el eje

Existen hasta tres marcas (ticks) verticales sobre el eje:

| Tick | Propósito | Visible cuando... |
|------|-----------|-------------------|
| $x = 0$ | Origen | Siempre |
| $x_i$ | Posición inicial | $x_i \neq 0$ |
| $x_f$ | Posición final | Siempre (aunque coincida con $x_i$) |

Notas:
- La parte superior de los ticks coincide con el eje x principal
- Si $x_i = 0$, el tick de $x_i$ coincide con el origen
- Si $x_f = x_i$ (v = 0, t = 0, o desplazamiento nulo), el tick de $x_f$ coincide con $x_i$

### 2.3 Escalado del Layout

El origen NO está fijo en el centro. Se reubica según el rango de datos:

- $x_i > 0$ y $x_f > 0$ → origen a la **izquierda**
- $x_i < 0$ y $x_f < 0$ → origen a la **derecha**
- $x_i$ y $x_f$ tienen signos distintos → origen **entre ambos**. No necesariamente tiene que estar al centro entre ambos, se debe considerar la distancia según los valores de $x_i$ y $x_f$

### 2.4 Diagrama base (sin inputs)

Cuando no hay inputs o faltan inputs, se renderiza solo:
- Eje X principal
- Origen con etiqueta $x = 0$
- Caja centrada en el origen, sin orientación (mirada neutra)

---

## 3. Vector velocidad

- El vector se ancla al **borde frontal** del móvil (en la dirección del movimiento)
- $v > 0$: flecha desde el **borde derecho** del cuadrado hacia la derecha
- $v < 0$: flecha desde el **borde izquierdo** del cuadrado hacia la izquierda
- $v = 0$: no se dibuja vector
- La línea termina en la **base del triángulo**, no en la punta (la punta es el único extremo visible del triángulo)
- Su longitud es fija (80px, no escala con la magnitud de v)

---

## 4. Flecha de desplazamiento (eje secundario)

Debajo del eje principal hay un segundo eje horizontal:

- **Desde** $x_i$ **hasta** $x_f$
- Dirección de la punta = signo del desplazamiento (→ si $v > 0$, ← si $v < 0$)
- Es una línea continua con punta de flecha (sin dashed)
- La línea termina en la base del triángulo (misma lógica que el vector velocidad)
- Representa visualmente el desplazamiento neto $\Delta x = x_f - x_i$

---

## 5. Etiquetas

### 5.1 Formato

Todas las etiquetas excepto $x = 0$ llevan el formato:

```
{identificador} = {valor} {unidad}
```

Unidades actuales (SI): `m` para posiciones/desplazamiento, `m/s` para velocidad, `s` para tiempo.

| Texto | Ejemplo | Posición |
|-------|---------|----------|
| $x = 0$ | `x = 0` | Debajo del tick del origen |
| $x_i$ | `xi = 20 m` | **Sobre el cuadrado** cuando $x_i$ está cerca del origen (distancia en pantalla < 50px); debajo del tick en caso contrario |
| $x_f$ | `xf = 50 m` | Debajo del tick de $x_f$ |
| $v$ | `v = 3 m/s` | Encima del vector velocidad, centrado |
| $t$ | `t = 10 s` | En el punto medio entre $x_i$ y $x_f$, arriba de $v$ |
| $\Delta x$ | `Δx = 30 m` | En el punto medio entre $x_i$ y $x_f$, debajo de la flecha de desplazamiento |

### 5.2 Estilo

- Las etiquetas usan **sans-serif**, sin itálica
- La posición inicial se etiqueta como **xi**, no como x₀
- La posición final se etiqueta como **xf**
- $x = 0$ es la única etiqueta que no lleva valor ni unidad

---

## 6. Representación del móvil

- Forma: cuadrado de **50×50** unidades
- Fondo: blanco
- Borde: negro, grosor 2px
- Sin ojo ni punto interior
- Orientación (mirada): determinada por el signo de $v$
  - $v > 0$: mira hacia la derecha
  - $v < 0$: mira hacia la izquierda
  - $v = 0$ o diagrama base: mirada neutra (sin dirección)

---

## 7. Casos especiales

### 7.1 $v = 0$ (reposo)

- Sin vector velocidad
- Sin etiqueta $v$
- Sin flecha de desplazamiento
- Sin etiqueta $\Delta x$
- $x_f = x_i$ (ambos ticks coinciden)
- Un solo tick visible para $x_i = x_f$ (además del origen si $x_i \neq 0$)

### 7.2 $x_i = 0$ o cerca del origen

- Móvil centrado sobre el tick del origen
- Tick de $x_i$ = tick del origen (no hay tick separado)
- Etiqueta $x_i$ va **sobre el cuadrado** (misma altura que $t$)

### 7.3 Cruce del origen ($x_i < 0 < x_f$ o $x_f < 0 < x_i$)

- El origen debe permanecer visible entre ambos ticks
- Tres ticks visibles: $x_i$, $x = 0$, $x_f$

### 7.4 $t = 0$

- $x_f = x_i$ (no hay desplazamiento)
- Mismo tratamiento que $v = 0$ (sin vector, sin flecha de desplazamiento, sin etiqueta $\Delta x$, sin etiqueta $v$)

---

## 8. Convenciones físicas

- Eje X positivo apunta siempre hacia la derecha (no configurable)
- El sentido del movimiento se deduce del signo de la velocidad
- $v > 0$ → movimiento hacia la derecha
- $v < 0$ → movimiento hacia la izquierda
- No existe selector independiente de sentido
- Las unidades son solo de visualización, no afectan el modelo físico
- Unidades por defecto: metros (m), segundos (s), m/s

---

## 9. Notas de implementación

### 9.1 Pipeline

El flujo de generación de diagramas es:
1. **Validación** de inputs
2. **Resolución física** (cálculo de $x_f$, $\Delta x$)
3. **Inferencia** del modelo de diagrama (dirección, orientación, visibilidad)
4. **Construcción de escena** (SceneGraph con nodos semánticos)
5. **Layout** (posicionamiento en coordenadas de pantalla)
6. **Renderizado** (generación de SVG)

### 9.2 Diagrama base

Cuando no todos los inputs están completos, se salta el pipeline y se renderiza directamente un diagrama base (eje + origen + caja) usando los mismos módulos de layout y render.

### 9.3 Auto-generación

El diagrama se regenera automáticamente 400ms después del último cambio en cualquier input. El botón "Generar Diagrama" fuerza la generación inmediata.

### 9.4 Arquitectura

- `src/core/layout-engine.ts` → posicionamiento de todos los elementos
- `src/modules/mru/scene-builder.ts` → construcción de nodos semánticos
- `src/core/renderer.ts` → conversión de nodos posicionados a SVG
- `src/app/engine.ts` → coordinador del pipeline

---

## 10. Pendientes / dudas por resolver

- [x] Confirmar si la etiqueta $v > 0$ / $v < 0$ siempre incluye el signo o solo "v" cuando es obvio → **Resuelto: se muestra el valor numérico con unidad**
- [ ] Confirmar si hay un título/encabezado en la parte superior del diagrama (tipo "MRU" o similar)
- [x] Confirmar el formato exacto de $x_i$ y $x_f$ (subíndice itálico: $x_i$, $x_f$) → **Resuelto: sans-serif, sin itálica, formato `xi = {valor} m`**
- [x] Confirmar el largo exacto del vector velocidad (fijo o relativo a algo) → **Resuelto: fijo, 80px**
