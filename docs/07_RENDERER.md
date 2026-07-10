# Renderer

**Version:** 1.0.0

---

# Objetivo

El Renderer es el último componente del pipeline gráfico.

Su responsabilidad consiste en transformar un **LayoutScene** completamente posicionado en un documento SVG válido.

No calcula Física.

No calcula Layout.

No interpreta el significado de los nodos.

Simplemente convierte una escena posicionada en una representación gráfica.

---

# Filosofía

El Renderer responde únicamente una pregunta:

> **¿Cómo se dibuja esta escena?**

Nunca responde:

- qué significa un vector;
- hacia dónde se mueve el personaje;
- dónde debe ubicarse un objeto.

Todas esas decisiones ya fueron tomadas por etapas anteriores.

---

# Flujo del sistema

```text
Physics Module

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

---

# Responsabilidades

El Renderer será responsable de:

- generar SVG válido;
- convertir nodos gráficos en elementos SVG;
- aplicar estilos visuales;
- respetar el orden de dibujo;
- generar identificadores SVG;
- producir un documento exportable.

No será responsable de:

- resolver Física;
- calcular posiciones;
- evitar colisiones;
- interpretar variables.

---

# Entrada

El Renderer recibe exclusivamente un:

```text
LayoutScene
```

Cada nodo ya posee:

- posición;
- dimensiones;
- orientación;
- orden de dibujo;
- visibilidad.

No necesita ninguna otra información.

---

# Salida

Produce un único documento SVG.

Conceptualmente.

```text
Layout Scene

↓

Renderer

↓

SVG Document
```

---

# Independencia

El Renderer no conoce:

- React;
- DOM;
- CSS Modules;
- Physics Engine;
- Layout Engine.

Debe poder ejecutarse desde:

- React;
- Node.js;
- una API;
- pruebas unitarias.

---

# Filosofía de renderizado

Cada nodo del LayoutScene será convertido exactamente en un elemento SVG.

Ejemplo.

```text
AxisNode

↓

<line>
```

```text
LabelNode

↓

<text>
```

```text
VectorNode

↓

<line> + <polygon>
```

```text
CharacterNode

↓

<rect>
```

El Renderer nunca crea nodos nuevos.

---

# Pipeline interno

```text
Layout Scene

↓

Recorrer nodos

↓

Seleccionar Render Strategy

↓

Generar SVG

↓

Documento final
```

---

# Estrategia de renderizado

Cada tipo de nodo tendrá un renderizador especializado.

Ejemplo.

```text
AxisRenderer

LabelRenderer

VectorRenderer

CharacterRenderer

PositionRenderer
```

Esto evita grandes estructuras condicionales.

Incorrecto.

```ts
switch(node.type) {

}
```

La lógica deberá estar distribuida en renderizadores independientes.

---

# Orden de dibujo

El Renderer respetará el orden establecido por el Layout.

Ejemplo.

```text
Axis

↓

Markers

↓

Character

↓

Vectors

↓

Labels
```

Nunca modificará dicho orden.

---

# Estilos

El Renderer será el único responsable de aplicar estilos gráficos.

Ejemplos.

- grosor de líneas;
- tamaño de flechas;
- tipografía;
- color;
- radio de marcadores.

Estos estilos no pertenecen al Scene Graph.

---

# Tema visual

El MVP utilizará un único tema.

Inspirado en diagramas de libros de Física.

Características.

- fondo blanco;
- líneas negras;
- tipografía simple;
- colores mínimos;
- alto contraste.

En versiones futuras podrán incorporarse múltiples temas sin modificar el Layout.

---

# Coordenadas

El Renderer utilizará únicamente las coordenadas entregadas por el Layout.

Nunca realizará ajustes espaciales.

Ejemplo incorrecto.

```text
Mover el personaje 5 px
```

Ese tipo de decisiones pertenecen exclusivamente al Layout.

---

# Renderizado de texto

Todo texto deberá representarse mediante elementos SVG `<text>`.

El Renderer será responsable de:

- alineación;
- anclaje;
- fuente;
- tamaño;
- peso.

Nunca del contenido del texto.

---

# Renderizado de vectores

Todo vector deberá componerse mediante:

```text
Línea

+

Punta de flecha
```

El Renderer no calcula:

- longitud;
- orientación;
- módulo.

Únicamente los dibuja.

---

# Renderizado del personaje

En el MVP el personaje será un cuadrado.

Conceptualmente.

```svg
<rect />
```

En futuras versiones podrá sustituirse por:

- iconos;
- ilustraciones;
- SVG personalizados.

Sin modificar el resto del sistema.

---

# Renderizado del eje

El eje será generado mediante:

- línea principal;
- punta de flecha;
- marcas (ticks), cuando corresponda.

Todo ello respetando la información proporcionada por el Layout.

---

# Visibilidad

Todo nodo podrá indicar.

```text
visible = false
```

El Renderer simplemente omitirá su generación.

---

# Accesibilidad

El documento SVG deberá incorporar atributos básicos.

Ejemplos.

```text
title

desc

role
```

Esto facilitará:

- lectores de pantalla;
- exportación;
- indexación.

---

# Precisión

Las coordenadas deberán conservar precisión suficiente para evitar errores visuales.

El Renderer no redondeará valores salvo que sea estrictamente necesario.

---

# Escalabilidad

El Renderer deberá admitir escenas de cualquier tamaño.

No contendrá límites específicos para MRU.

---

# Extensibilidad

Agregar un nuevo tipo de nodo deberá requerir únicamente:

- crear un nuevo renderer especializado;
- registrarlo.

No deberá modificarse el Renderer principal.

---

# Registro de renderizadores

Conceptualmente.

```text
AxisNode

↓

AxisRenderer
```

```text
VectorNode

↓

VectorRenderer
```

```text
LabelNode

↓

LabelRenderer
```

El Renderer principal únicamente coordina el proceso.

---

# Errores

Si un nodo no posee un renderer registrado.

Debe producirse un error específico.

Ejemplo.

```text
RendererNotFoundError
```

Nunca deberá ignorarse silenciosamente.

---

# Rendimiento

El Renderer deberá:

- recorrer la escena una sola vez;
- minimizar la creación de objetos;
- generar un SVG compacto;
- evitar duplicación de elementos.

---

# Testing

Cada renderer especializado deberá probarse de forma independiente.

Ejemplos.

## AxisRenderer

Entrada.

```text
AxisNode
```

Resultado esperado.

```svg
<line />
```

---

## LabelRenderer

Entrada.

```text
LabelNode
```

Resultado esperado.

```svg
<text />
```

---

## CharacterRenderer

Entrada.

```text
CharacterNode
```

Resultado esperado.

```svg
<rect />
```

---

## VectorRenderer

Entrada.

```text
VectorNode
```

Resultado esperado.

Línea y punta de flecha correctamente alineadas.

---

# Principios arquitectónicos

El Renderer deberá cumplir:

## Determinismo

La misma escena siempre produce el mismo SVG.

---

## Independencia

No conoce Física.

---

## Simplicidad

Cada renderer dibuja un único tipo de nodo.

---

## Reutilización

Los renderizadores podrán reutilizarse en cualquier módulo físico.

---

## Sustituibilidad

El Renderer podrá reemplazarse completamente por:

- Canvas Renderer;
- PDF Renderer;
- TikZ Renderer;

sin modificar el dominio ni el Layout.

---

# Flujo conceptual

```text
Layout Scene

↓

AxisRenderer

↓

CharacterRenderer

↓

VectorRenderer

↓

LabelRenderer

↓

SVG Document
```

---

# Definition of Done

El Renderer estará correctamente implementado cuando:

- transforme cualquier LayoutScene en un SVG válido;
- no dependa del dominio físico;
- no modifique posiciones ni dimensiones;
- delegue el dibujo en renderizadores especializados;
- produzca un SVG accesible y exportable;
- permita incorporar nuevos tipos de nodos sin modificar su núcleo;
- sea completamente determinista;
- pueda ejecutarse sin React ni navegador.