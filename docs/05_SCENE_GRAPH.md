# Scene Graph

**Version:** 1.0.0

---

# Objetivo

El Scene Graph representa la **descripción gráfica abstracta** de un fenómeno físico.

No contiene información sobre React.

No contiene información sobre SVG.

No contiene información sobre píxeles.

No contiene información sobre tamaños reales.

El Scene Graph únicamente responde una pregunta:

> **¿Qué objetos existen en el diagrama?**

No responde:

- dónde se dibujan;
- cuánto miden;
- qué color poseen;
- cómo se renderizan.

---

# Filosofía

El Scene Graph constituye el puente entre el dominio físico y el sistema gráfico.

Su propósito es desacoplar completamente la Física del Renderer.

El dominio físico nunca genera SVG.

El Renderer nunca interpreta Física.

Ambos se comunican exclusivamente mediante un Scene Graph.

---

# Flujo del sistema

```text
Physics Module

↓

PhysicsResult

↓

Inference Engine

↓

DiagramModel

↓

Scene Builder

↓

Scene Graph

↓

Layout Engine

↓

Layout Scene

↓

Renderer

↓

SVG
```

El Scene Graph es la salida del dominio y la entrada del pipeline gráfico.

---

# ¿Qué representa un Scene Graph?

Representa todos los elementos necesarios para construir un diagrama.

Por ejemplo:

```text
Scene

├── Axis
├── Origin
├── Character
├── Initial Position
├── Final Position
├── Velocity Vector
└── Labels
```

Todavía no existe ninguna coordenada.

---

# Principios

## Abstracción

El Scene Graph describe objetos.

No describe gráficos.

---

## Independencia

No depende de:

- React
- SVG
- HTML
- Canvas
- CSS

---

## Inmutabilidad

Una vez construido, el Scene Graph no debe modificarse.

Las transformaciones posteriores producirán nuevos objetos.

---

## Composición

Un diagrama se construye mediante nodos.

Nunca mediante código SVG.

---

# Arquitectura

Todo diagrama posee un único nodo raíz.

```text
Scene
```

Desde este nodo se organizan todos los demás elementos.

---

# Jerarquía

Ejemplo para MRU.

```text
Scene

├── AxisNode
│
├── OriginNode
│
├── CharacterNode
│
├── PositionNode (Inicial)
│
├── PositionNode (Final)
│
├── VectorNode
│
└── LabelNodes
```

Esta estructura representa únicamente relaciones lógicas.

No representa posiciones.

---

# Nodo raíz

Existe exactamente un nodo raíz.

```text
SceneNode
```

Responsabilidades.

- contener todos los nodos;
- mantener el orden lógico;
- actuar como punto de entrada.

No contiene información gráfica.

---

# Nodo Axis

Representa un eje físico.

Propiedades conceptuales.

```text
id

axisType

orientation

showTicks

showArrow
```

No posee longitud.

No posee coordenadas.

---

# Nodo Origin

Representa el origen del sistema de referencia.

Propiedades.

```text
id

label

visible
```

No conoce su posición.

---

# Nodo Position

Representa una posición física.

Puede corresponder a:

- posición inicial;
- posición final;
- posiciones futuras.

Propiedades.

```text
id

semanticRole

physicalValue

showMarker

showLabel
```

No conoce coordenadas.

---

# Nodo Character

Representa el objeto que se mueve.

En el MVP será un cuadrado.

Posteriormente podrá reemplazarse por:

- automóvil;
- peatón;
- tren;
- bicicleta.

El resto del sistema no deberá modificarse.

Propiedades.

```text
id

orientation

visible
```

No contiene geometría.

---

# Nodo Vector

Representa cualquier magnitud vectorial.

Ejemplos futuros.

- velocidad;
- aceleración;
- fuerza;
- campo eléctrico.

Propiedades.

```text
id

vectorType

orientation

magnitude

visible
```

No contiene longitud gráfica.

---

# Nodo Label

Representa texto.

Ejemplos.

```text
x₀

xf

v

20 m

3 m/s
```

Propiedades.

```text
id

text

semanticRole

visible
```

No contiene tipografía.

No contiene tamaño.

---

# Nodo Group

Permite agrupar elementos.

Ejemplo.

```text
Character Group

├── Character
└── Velocity Vector
```

Esto facilita mover ambos elementos conjuntamente durante el Layout.

---

# Relaciones

Los nodos únicamente expresan relaciones semánticas.

Ejemplo.

```text
Velocity Vector

↓

pertenece a

↓

Character
```

No expresan relaciones espaciales.

---

# Identificadores

Todo nodo deberá poseer un identificador único.

Ejemplo.

```text
scene

axis-x

origin

character

initial-position

final-position

velocity-vector

label-x0

label-v
```

Esto facilitará:

- testing;
- depuración;
- exportación;
- futuras animaciones.

---

# Roles semánticos

Los nodos no deben diferenciarse únicamente por su tipo.

También poseen un rol.

Ejemplo.

Dos PositionNode.

```text
PositionNode

↓

role = initial
```

```text
PositionNode

↓

role = final
```

Esto evita crear tipos innecesarios.

---

# Estado visual

El Scene Graph únicamente puede indicar si un nodo existe.

Ejemplo.

```text
visible = true
```

o

```text
visible = false
```

Nunca contiene:

```text
opacity

strokeWidth

fontSize

color
```

Eso pertenece al Renderer.

---

# Qué NO pertenece al Scene Graph

Nunca deberá contener:

- coordenadas;
- márgenes;
- padding;
- tamaños;
- colores;
- estilos;
- fuentes;
- transformaciones SVG;
- animaciones.

Toda esa información corresponde a etapas posteriores.

---

# Construcción

El Scene Graph se construye exclusivamente desde el Scene Builder.

Nunca desde React.

Nunca desde el Renderer.

Nunca desde el Layout.

---

# Ejemplo conceptual

Problema.

```text
x₀ = 20

v = 3

t = 10
```

Produce.

```text
Scene

├── Axis
├── Origin
├── Position (Initial)
├── Position (Final)
├── Character
├── Velocity Vector
├── Label (x₀)
├── Label (xf)
└── Label (v)
```

No existen coordenadas.

---

# Extensibilidad

Agregar nuevos contenidos no deberá modificar los nodos existentes.

Ejemplo.

MRUV podría agregar.

```text
Acceleration Vector
```

sin modificar:

- Character;
- Axis;
- Position.

---

# Reutilización

Los mismos nodos podrán reutilizarse.

Ejemplo.

```text
VectorNode
```

será utilizado por:

- MRU;
- MRUV;
- Fuerzas;
- Campo Eléctrico.

---

# Orden lógico

Los nodos conservarán un orden lógico.

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

Este orden no implica orden de dibujo.

El Renderer podrá reorganizarlo si lo considera necesario.

---

# Integridad

Todo Scene Graph deberá cumplir.

- un único nodo raíz;
- identificadores únicos;
- nodos válidos;
- relaciones válidas;
- ausencia de ciclos.

---

# Validación

Antes de enviarse al Layout, el Scene Graph deberá validarse.

Ejemplos.

No puede existir:

```text
Vector

↓

sin Character asociado
```

No puede existir:

```text
Label

↓

sin elemento asociado
```

La validación protege las siguientes etapas del pipeline.

---

# Evolución

El Scene Graph deberá evolucionar mediante nuevos tipos de nodos.

Nunca modificando el significado de los existentes.

Esto asegura compatibilidad entre versiones.

---

# Relación con el Layout

El Layout recibe un Scene Graph y produce un Layout Scene.

Su única responsabilidad será asignar:

- coordenadas;
- tamaños;
- separación;
- alineación.

Nunca modificará la estructura lógica del árbol.

---

# Relación con el Renderer

El Renderer recibe un Layout Scene.

Nunca recibe un Scene Graph.

Esto garantiza que el Renderer siempre trabaja sobre una escena completamente posicionada.

---

# Definition of Done

El Scene Graph estará correctamente implementado cuando:

- represente únicamente relaciones semánticas;
- no dependa de ninguna tecnología gráfica;
- pueda reutilizarse por distintos renderizadores;
- pueda extenderse mediante nuevos tipos de nodos;
- posea un único nodo raíz;
- garantice identificadores únicos;
- no almacene coordenadas ni estilos;
- sirva como contrato estable entre el dominio y el pipeline gráfico.