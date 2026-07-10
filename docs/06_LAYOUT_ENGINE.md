# Layout Engine

**Version:** 1.0.0

---

# Objetivo

El Layout Engine transforma una representación abstracta del diagrama (Scene Graph) en una escena completamente posicionada.

Su responsabilidad consiste exclusivamente en responder la siguiente pregunta:

> **¿Dónde debe ubicarse cada elemento para construir un diagrama claro, legible y consistente?**

El Layout Engine no interpreta Física.

El Layout Engine no genera SVG.

El Layout Engine no conoce React.

Su única responsabilidad consiste en calcular posiciones.

---

# Filosofía

El Scene Graph responde:

> ¿Qué elementos existen?

El Layout responde:

> ¿Dónde deben ubicarse esos elementos?

El Renderer responde:

> ¿Cómo deben dibujarse?

---

# Flujo

```text
Scene Graph

↓

Layout Engine

↓

Layout Scene

↓

Renderer
```

---

# Entrada

El Layout recibe únicamente un Scene Graph.

No recibe:

- PhysicsInput
- PhysicsResult
- DiagramModel
- componentes React

Toda la información física ya fue interpretada previamente.

---

# Salida

Produce un objeto denominado:

```text
LayoutScene
```

Cada nodo posee ahora:

- posición
- dimensiones
- caja de colisión
- orden de dibujo

Todavía no existe SVG.

---

# Responsabilidades

El Layout Engine será responsable de:

- asignar coordenadas
- calcular escalado
- distribuir elementos
- mantener márgenes
- evitar superposición
- respetar jerarquías visuales

No será responsable de:

- resolver ecuaciones
- decidir orientación
- interpretar signos
- dibujar elementos

---

# Principio fundamental

El Layout nunca modifica la estructura del Scene Graph.

Únicamente agrega información espacial.

---

# Coordenadas

El Layout trabajará utilizando un sistema de coordenadas lógico.

No utilizará directamente:

- píxeles del navegador
- tamaño del monitor
- zoom del navegador

Esto permitirá reutilizar el motor en distintos renderizadores.

---

# Sistema de referencia

El Layout define un área de trabajo denominada:

```text
Viewport
```

Conceptualmente.

```text
+--------------------------------------+
|                                      |
|                                      |
|                                      |
|                                      |
+--------------------------------------+
```

Todos los elementos deberán ubicarse dentro de este espacio.

---

# Márgenes

Todo diagrama deberá mantener márgenes mínimos.

Ejemplo conceptual.

```text
┌──────────────────────────────────┐

     Área útil del diagrama

└──────────────────────────────────┘
```

Ningún elemento podrá tocar los bordes.

---

# Área útil

El Layout trabajará únicamente dentro del área útil.

Los márgenes quedan reservados para:

- exportación
- impresión
- respiración visual

---

# Escalado

Uno de los objetivos principales consiste en que cualquier problema produzca un diagrama legible.

Por ejemplo.

Caso A

```text
x₀ = 2

xf = 5
```

Caso B

```text
x₀ = 2000

xf = 5000
```

Ambos deberán generar diagramas visualmente equivalentes.

---

# Escalado relativo

Nunca deberá utilizarse la magnitud absoluta de las variables para posicionar elementos.

Siempre deberá utilizarse una escala relativa.

---

# Principio de normalización

Toda posición física será transformada a un espacio normalizado.

Conceptualmente.

```text
Valores físicos

↓

Normalización

↓

Posiciones relativas

↓

Coordenadas del Layout
```

Esto garantiza independencia respecto de las unidades.

---

# Escalado adaptable

El Layout deberá adaptarse automáticamente cuando existan:

- desplazamientos muy pequeños;
- desplazamientos muy grandes;
- posiciones negativas;
- posiciones positivas.

Sin requerir configuración manual.

---

# Separación mínima

Dos elementos nunca deberán quedar visualmente superpuestos.

Cuando las posiciones físicas sean muy próximas, el Layout garantizará una separación mínima.

Ejemplo.

```text
x₀ = 20

xf = 20.001
```

Visualmente deberá seguir siendo comprensible.

---

# Distancia mínima entre nodos

Todo nodo deberá poseer una distancia mínima respecto de los demás.

Especialmente:

- etiquetas
- vectores
- personaje

---

# Colisiones

El Layout será responsable de detectar colisiones.

Ejemplos.

```text
Label

↓

Label
```

```text
Vector

↓

Texto
```

```text
Character

↓

Etiqueta
```

---

# Resolución de colisiones

Cuando exista una colisión, el Layout deberá intentar resolverla mediante reglas simples.

Ejemplos.

- mover etiqueta
- desplazar texto
- aumentar separación
- modificar nivel vertical

Nunca modificando el fenómeno físico.

---

# Capas visuales

Todo elemento pertenecerá a una capa lógica.

Ejemplo.

```text
Axis

↓

Positions

↓

Character

↓

Vectors

↓

Labels
```

Esto facilita posteriormente el orden de dibujo.

---

# Posicionamiento del eje

El eje será el elemento principal del diagrama.

Todos los demás elementos se posicionarán respecto de él.

---

# Posicionamiento del origen

El origen no siempre se ubicará en el centro.

Dependerá del fenómeno representado.

Ejemplos.

Caso 1

```text
x₀ = 20

xf = 50
```

El origen quedará a la izquierda.

---

Caso 2

```text
x₀ = -20

xf = 40
```

El origen deberá ubicarse entre ambas posiciones.

---

Caso 3

```text
x₀ = -80

xf = -20
```

El origen quedará a la derecha.

---

# Personaje

El personaje siempre deberá quedar alineado con su posición física.

No podrá existir una diferencia entre:

- PositionNode
- CharacterNode

---

# Vectores

Todo vector deberá anclarse al elemento correspondiente.

Ejemplo.

```text
Character

↓

Velocity Vector
```

El Layout calcula únicamente:

- punto inicial
- punto final

No calcula orientación.

---

# Etiquetas

Las etiquetas deberán cumplir.

- no superponerse;
- mantener distancia respecto del objeto;
- permanecer legibles;
- evitar colisiones.

---

# Casos especiales

## Sin movimiento

Cuando no exista movimiento.

El Layout deberá generar.

```text
Personaje

↓

Posición inicial

↓

Posición final
```

en el mismo lugar.

No deberá generar espacios innecesarios.

---

## Cruce del origen

Cuando el fenómeno cruce el origen.

El Layout deberá garantizar que el origen permanezca visible.

---

## Posición inicial en el origen

Cuando:

```text
x₀ = 0
```

El personaje deberá aparecer exactamente sobre el origen.

---

# Layout Scene

El resultado será un nuevo objeto.

Cada nodo contendrá ahora.

```text
id

position

boundingBox

layer

rotation

visibility
```

Todavía no existirán elementos SVG.

---

# Determinismo

El mismo Scene Graph deberá producir siempre exactamente el mismo Layout.

No existirán algoritmos aleatorios.

---

# Rendimiento

El Layout deberá minimizar.

- recorridos del árbol;
- cálculos repetidos;
- recreación de estructuras.

---

# Extensibilidad

El Layout deberá ser completamente independiente del contenido.

No conocerá.

- MRU
- MRUV
- Fuerzas

Trabajará únicamente con nodos.

---

# Testing

Cada algoritmo deberá probarse mediante casos independientes.

Ejemplos.

## Escalado

Entrada.

```text
2 → 5
```

Resultado.

Diagrama legible.

---

Entrada.

```text
2000 → 5000
```

Resultado.

Diagrama equivalente.

---

## Colisiones

Dos etiquetas próximas.

Resultado esperado.

No existen superposiciones.

---

## Cruce del origen

Entrada.

```text
-10 → 20
```

Resultado esperado.

Origen visible.

---

# Reglas arquitectónicas

El Layout nunca deberá.

- interpretar Física;
- modificar el Scene Graph;
- generar SVG;
- acceder al DOM;
- utilizar React.

---

# Definition of Done

El Layout Engine estará correctamente implementado cuando:

- produzca un LayoutScene completamente posicionado;
- garantice márgenes consistentes;
- escale automáticamente cualquier problema;
- evite superposición entre elementos;
- mantenga el origen visible cuando corresponda;
- funcione de forma determinista;
- sea independiente del contenido físico;
- pueda reutilizarse con cualquier módulo del sistema.