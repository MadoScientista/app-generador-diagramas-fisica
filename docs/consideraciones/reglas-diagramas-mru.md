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

### 1.1 Inputs del usuario

| Input | Descripción | Unidad por defecto |
|-------|-------------|--------------------|
| $x_i$ | Posición inicial | m |
| $v$ | Velocidad | m/s |
| $t$ | Tiempo | s |
| $x_f$ | Posición final (opcional para cálculo, siempre visible en UI) | m |
| Unidad de $x_i$ | Selector: m o km (independiente de $x_f$) | m |
| Unidad de $x_f$ | Selector: m o km (independiente de $x_i$) | m |
| Unidad de tiempo | Selector: s, min, h | s |
| Unidad de velocidad | Selector: m/s o km/h | m/s |

### 1.2 Toggles de visibilidad de etiquetas

Cada magnitud tiene un toggle independiente que controla si se muestra su valor en el diagrama:

| Magnitud | Label sin valor | Label con valor |
|----------|----------------|-----------------|
| $x_i$ | `xi` | `xi = 20 m` |
| $x_f$ | `xf` | `xf = 50 m` |
| $v$ | `v` | `v = 3 m/s` |
| $t$ | `t` | `t = 10 s` |
| $\Delta x$ | `Δx` | `Δx = 30 m` |

Cuando un toggle está desactivado, la etiqueta muestra solo el identificador (sin valor ni unidad). Cuando está activado, muestra el formato completo.

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

Los valores físicos se convierten internamente a SI en la construcción de escena, por lo que la proporcionalidad es correcta incluso cuando $x_i$ y $x_f$ tienen unidades de distancia diferentes (ej. $x_i$ en m, $x_f$ en km).

Los ticks de posición se restringen a una banda de `USABLE_WIDTH - 2 * POSITION_PADDING` (con `POSITION_PADDING = 40px`) centrada dentro del eje, dejando aire visual en los extremos.

### 2.4 Gap mínimo entre posiciones

Para evitar que ticks de posiciones muy cercanas (ej. $x_i = 0.001$, $x_f = 5$) aparezcan superpuestos en pantalla, el layout engine impone una **distancia mínima de 50px** entre posiciones físicas distintas (origen, $x_i$, $x_f$).

- Se prueba primero un mapeo lineal; si todos los gaps entre adyacentes son ≥ 50px, se usa directamente
- Si algún gap es menor, se redistribuye: cada par adyacente recibe al menos 50px, y el espacio restante se asigna proporcionalmente a sus diferencias físicas
- Posiciones idénticas en valor físico (ej. origen y $x_i = 0$) ocupan el mismo punto en pantalla

### 2.5 Diagrama base (sin inputs)

Cuando hay menos de 3 campos numéricos llenos, se renderiza solo:
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

Donde `{unidad}` depende de los selects de unidad elegidos por el usuario.

| Texto | Ejemplo (SI) | Posición |
|-------|-------------|----------|
| $x = 0$ | `x = 0` | Debajo del tick del origen |
| $x_i$ | `xi = 20 m` | **Sobre el cuadrado** cuando $x_i$ está cerca del origen (distancia en pantalla < 50px); debajo del tick en caso contrario |
| $x_f$ | `xf = 50 m` | Debajo del tick de $x_f$ |
| $v$ | `v = 3 m/s` | Encima del vector velocidad, centrado. Si el texto es largo, se desplaza horizontalmente para mantener 10px de separación con el borde del cuadrado |
| $t$ | `t = 10 s` | En el punto medio entre $x_i$ y $x_f$, arriba de $v$ |
| $\Delta x$ | `Δx = 30 m` | En el punto medio entre $x_i$ y $x_f$, debajo de la flecha de desplazamiento |

### 5.2 Estilo

- Las etiquetas usan **sans-serif**, sin itálica
- La posición inicial se etiqueta como **xi**, no como x₀
- La posición final se etiqueta como **xf**
- $x = 0$ es la única etiqueta que no lleva valor ni unidad

### 5.3 Control de visibilidad

Cada magnitud tiene un toggle en la UI que controla si se muestra el valor en la etiqueta:

- **Toggle activado**: `xi = 20 m`, `xf = 50 m`, `v = 3 m/s`, `t = 10 s`, `Δx = 30 m`
- **Toggle desactivado**: `xi`, `xf`, `v`, `t`, `Δx` (solo identificador, sin valor ni unidad)

El toggle no afecta la existencia del elemento en el diagrama, solo el contenido del texto de la etiqueta.

### 5.4 Formato decimal

Todos los valores numéricos en las etiquetas se formatean con:

- Precisión de 3 decimales en cálculos internos
- Si el valor redondeado no tiene parte decimal (ej. `5.000`), se muestra como entero: `5`
- Si tiene decimales significativos, se muestran hasta 3: `5.123`, `0.5`, `3.1`

Notas sobre unidades:
- $x_i$ usa su propio selector de unidad (`x0Unit`)
- $x_f$ usa su propio selector de unidad (`xfUnit`)
- $\Delta x$ usa la unidad de $x_i$ (`x0Unit`)

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

### 7.5 Validación de consistencia

Cuando el usuario ingresa manualmente los 4 campos ($x_i$, $v$, $t$, $x_f$), se verifica que cumplan la ecuación MRU:

$$x_f \approx x_i + v \cdot t$$

Tolerancia: $|x_f - (x_i + v \cdot t)| \leq 0.001$ (en unidades SI después de conversión).

Si no se cumple, se muestra un error indicando que los valores no son físicamente posibles.

---

## 8. Convenciones físicas y unidades

### 8.1 Sistema de unidades

| Magnitud | Unidades disponibles | Factor de conversión a SI |
|----------|---------------------|--------------------------|
| Distancia | m, km | 1 km = 1000 m |
| Tiempo | s, min, h | 1 min = 60 s, 1 h = 3600 s |
| Velocidad | m/s, km/h | 1 km/h = 0.277... m/s |

Las unidades son **independientes** entre sí. Cada magnitud tiene su propio selector, incluyendo $x_i$ y $x_f$ que tienen selectores de distancia independientes (pueden ser m y km simultáneamente).

### 8.2 Coherencia

- Todos los cálculos se realizan internamente en SI (m, s, m/s)
- Los resultados se convierten a la unidad seleccionada por el usuario para mostrar en las etiquetas
- La unidad seleccionada no afecta el modelo físico subyacente
- $x_i$ y $x_f$ pueden tener unidades de distancia diferentes (ej. $x_i$ en km, $x_f$ en m)
- $\Delta x$ siempre usa la unidad de $x_i$ (`x0Unit`)
- Por defecto: **m**, **s**, **m/s**

### 8.3 Convenciones

- Eje X positivo apunta siempre hacia la derecha (no configurable)
- El sentido del movimiento se deduce del signo de la velocidad
- $v > 0$ → movimiento hacia la derecha
- $v < 0$ → movimiento hacia la izquierda
- No existe selector independiente de sentido

---

## 9. Notas de implementación

### 9.1 Pipeline

El flujo de generación de diagramas es:

1. **Resolución de variable faltante** (detectar cuál de los 4 campos debe auto-computarse)
2. **Conversión de unidades** (entrada → SI → salida)
3. **Validación** de inputs y consistencia
4. **Resolución física** (cálculo de $x_f$, $\Delta x$)
5. **Inferencia** del modelo de diagrama (dirección, orientación, visibilidad)
6. **Construcción de escena** (SceneGraph con nodos semánticos)
7. **Layout** (posicionamiento en coordenadas de pantalla)
8. **Renderizado** (generación de SVG)

### 9.2 Diagrama base

Cuando no hay suficientes inputs para resolver (menos de 3 campos numéricos llenos), se salta el pipeline y se renderiza directamente un diagrama base (eje + origen + caja) usando los mismos módulos de layout y render.

### 9.3 Generación del diagrama

El diagrama se genera al presionar **"Generar Diagrama"**. También se regenera automáticamente cuando el usuario cambia una unidad de medida o un toggle de visibilidad.

Un botón **"Calcular"** se habilita cuando exactamente 3 campos numéricos están llenos. Al presionarlo, el motor computa el campo faltante, lo auto-rellena y genera el diagrama.

Un botón **"Borrar datos"** debajo del formulario resetea todos los inputs, unidades y toggles a sus valores por defecto, y limpia el diagrama.

### 9.4 Arquitectura

- `src/core/units.ts` → tipos y funciones de conversión de unidades
- `src/core/format.ts` → formateo de números (3 decimales, sin decimales si es entero)
- `src/core/layout-engine.ts` → posicionamiento de todos los elementos
- `src/modules/mru/scene-builder.ts` → construcción de nodos semánticos
- `src/core/renderer.ts` → conversión de nodos posicionados a SVG
- `src/app/engine.ts` → coordinador del pipeline

### 9.5 Resolución de variable faltante

El motor detecta qué variable debe calcularse según los campos ingresados al presionar "Calcular" o "Generar Diagrama":

| Campos ingresados por el usuario | Variable a calcular | Fórmula |
|---|---|---|
| $x_i$, $v$, $t$ | $x_f$ | $x_f = x_i + v \cdot t$ |
| $x_i$, $x_f$, $t$ | $v$ | $v = (x_f - x_i) / t$ |
| $x_i$, $x_f$, $v$ | $t$ | $t = (x_f - x_i) / v$ |
| $v$, $t$, $x_f$ | $x_i$ | $x_i = x_f - v \cdot t$ |
| $x_i$, $v$, $t$, $x_f$ | — | Validar consistencia |

La variable calculada se auto-rellena en el input correspondiente y se marca como **computada**.

Reglas adicionales:
- Si el usuario edita el campo auto-computado, pasa a ser considerado **ingresado manualmente** y se valida consistencia con los demás
- Si el usuario cambia una unidad mientras los 4 campos están llenos, se limpia el campo correspondiente a esa unidad y el motor lo re-computa en la nueva unidad:
  - `x0Unit` → limpia $x_i$
  - `xfUnit` → limpia $x_f$
  - `timeUnit` → limpia $t$
  - `velUnit` → limpia $v$
- Si al cambiar una unidad solo hay 3 campos llenos, el motor re-computa el campo faltante con la nueva unidad sin necesidad de limpiar nada
- No se pueden computar 2 variables simultáneamente. El usuario debe proveer al menos 3 campos

### 9.6 Formato decimal

La función `formatValue(value: number): string`:
1. Redondea a 3 decimales: `Math.round(value * 1000) / 1000`
2. Si el resultado es entero (sin parte decimal), devuelve la representación entera: `5` en vez de `5.000`
3. Si tiene decimales, devuelve hasta 3: `5.123`, `0.5`, `3.1`


