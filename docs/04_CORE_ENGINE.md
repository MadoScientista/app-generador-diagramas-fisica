# Core Engine

**Version:** 1.0.0

---

# Objetivo

El **Core Engine** constituye el núcleo del proyecto.

Su responsabilidad consiste en coordinar el flujo completo de generación de diagramas físicos.

El Core **no conoce Física**.

El Core **no conoce MRU**.

El Core **no conoce MRUV**.

El Core únicamente conoce contratos.

Su misión es transformar una solicitud en un diagrama utilizando módulos registrados.

---

# Filosofía

El Core debe ser completamente independiente de cualquier contenido específico.

Debe ser posible desarrollar un nuevo módulo de Física sin modificar el Core.

El Core permanece estable.

Los módulos evolucionan.

---

# Responsabilidades

El Core será responsable únicamente de:

- descubrir módulos registrados;
- ejecutar el pipeline de generación;
- coordinar el flujo entre motores;
- administrar errores generales;
- exponer una API uniforme al Frontend;
- mantener desacopladas todas las capas.

No será responsable de:

- resolver ecuaciones;
- interpretar variables físicas;
- generar SVG directamente;
- construir formularios;
- posicionar elementos.

---

# Arquitectura del Core

```text
                    Frontend
                        │
                        ▼
                 Physics Diagram Engine
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Module Registry   Layout Engine   SVG Renderer
        │
        ▼
 Physics Module
        │
        ▼
 Scene Graph
```

---

# Flujo completo

El Core ejecutará siempre el mismo pipeline.

```text
Input

↓

Seleccionar módulo

↓

Validar

↓

Resolver Física

↓

Inferir diagrama

↓

Construir Scene Graph

↓

Layout

↓

Render SVG

↓

Resultado
```

Ningún módulo podrá alterar este flujo.

---

# Pipeline interno

Conceptualmente el Core ejecutará la siguiente secuencia.

```text
User Input

↓

Module.validate()

↓

Module.solve()

↓

Module.infer()

↓

Module.buildScene()

↓

LayoutEngine.layout()

↓

SvgRenderer.render()
```

Cada etapa recibe un único objeto y produce un único objeto.

---

# Contratos conocidos por el Core

El Core únicamente conoce cuatro contratos principales.

```text
PhysicsModule

LayoutEngine

Renderer

Exporter
```

Nunca conoce implementaciones concretas.

---

# PhysicsModule

Todo módulo debe implementar una interfaz común.

Conceptualmente:

```text
validate()

solve()

infer()

buildScene()
```

El Core únicamente invoca estos métodos.

Nunca inspecciona su implementación.

---

# Layout Engine

El Core espera un componente capaz de transformar:

```text
Scene Graph

↓

Layout Scene
```

No importa cómo lo haga.

---

# Renderer

El Core espera un componente capaz de transformar:

```text
Layout Scene

↓

SVG
```

El Renderer no conoce el origen de la escena.

---

# Exporter

Aunque el MVP únicamente utilizará SVG, el Core deberá considerar futuras exportaciones.

Ejemplo.

```text
SVG

↓

PNG
```

```text
SVG

↓

PDF
```

```text
SVG

↓

Clipboard
```

El Core únicamente invoca el exportador correspondiente.

---

# Registro de módulos

El Core mantiene un catálogo de módulos disponibles.

Conceptualmente.

```text
Module Registry

MRU

MRUV

FreeFall

Projectile

Forces
```

El catálogo constituye el único punto de acceso a los módulos.

---

# Descubrimiento de módulos

Cuando el usuario selecciona un contenido.

Ejemplo.

```text
MRU
```

El Core consulta el registro.

Obtiene el módulo correspondiente.

Ejecuta el pipeline.

No utiliza estructuras del tipo:

```ts
if (module === "MRU")
```

o

```ts
switch(module)
```

El comportamiento deberá ser completamente polimórfico.

---

# Module Registry

El registro deberá ofrecer como mínimo las siguientes capacidades.

- registrar módulos;
- obtener un módulo;
- listar módulos disponibles;
- validar nombres duplicados.

No almacenará estado del usuario.

---

# Flujo de datos

El Core nunca modifica directamente los objetos recibidos.

Cada etapa produce un nuevo objeto.

Ejemplo.

```text
PhysicsInput

↓

PhysicsResult

↓

DiagramModel

↓

Scene

↓

LayoutScene

↓

SVG
```

La inmutabilidad simplifica el testing y reduce errores.

---

# Gestión de errores

Cada etapa podrá producir errores específicos.

Ejemplo.

```text
ValidationError
```

```text
PhysicsError
```

```text
LayoutError
```

```text
RenderError
```

El Core será responsable únicamente de capturarlos y propagarlos.

Nunca intentará corregirlos automáticamente.

---

# Trazabilidad

Durante la ejecución deberá ser posible conocer exactamente en qué etapa ocurrió un error.

Ejemplo.

```text
Layout Engine

↓

LabelCollisionError
```

Esto facilitará el diagnóstico y el testing.

---

# Extensión del Core

El Core deberá permitir agregar nuevos motores.

Ejemplos futuros.

```text
Animation Engine
```

```text
Accessibility Engine
```

```text
TikZ Renderer
```

```text
Canvas Renderer
```

Sin modificar el flujo principal.

---

# Estado del Core

El Core no almacenará información permanente.

Será completamente stateless.

Cada solicitud será independiente.

Esto permitirá:

- pruebas unitarias sencillas;
- reutilización;
- ejecución concurrente;
- futura migración a backend.

---

# Independencia del Frontend

El Core deberá poder ejecutarse desde distintos clientes.

Ejemplos.

```text
React
```

```text
CLI
```

```text
REST API
```

```text
Electron
```

```text
VSCode Extension
```

El Frontend constituye únicamente un consumidor del Core.

---

# Rendimiento

El Core deberá minimizar:

- cálculos duplicados;
- transformaciones innecesarias;
- recreación de objetos.

Cada etapa debe ejecutarse exactamente una vez por solicitud.

---

# Observabilidad

El Core deberá facilitar la incorporación futura de herramientas de diagnóstico.

Ejemplos.

- logging;
- métricas;
- profiling;
- tiempos de ejecución.

Estas capacidades deberán añadirse sin modificar los módulos físicos.

---

# Dependencias permitidas

El Core puede depender únicamente de:

- contratos;
- tipos compartidos;
- motores genéricos.

Nunca dependerá de:

- React;
- MRU;
- MRUV;
- componentes visuales.

---

# Flujo conceptual

```text
                User Request
                     │
                     ▼
              Module Registry
                     │
                     ▼
              Physics Module
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
     Physics Engine      Inference Engine
                 │
                 ▼
            Scene Builder
                 │
                 ▼
             Scene Graph
                 │
                 ▼
            Layout Engine
                 │
                 ▼
            Layout Scene
                 │
                 ▼
            SVG Renderer
                 │
                 ▼
              SVG Output
```

---

# Objetivos de calidad

El Core deberá cumplir los siguientes atributos.

## Desacoplamiento

Ningún componente conoce implementaciones concretas.

---

## Extensibilidad

Agregar nuevos módulos no requiere modificar el Core.

---

## Estabilidad

El Core cambia muy poco con el tiempo.

---

## Testabilidad

Cada componente puede probarse de forma aislada.

---

## Reutilización

El Core puede reutilizarse en diferentes interfaces.

---

## Simplicidad

Toda solicitud sigue exactamente el mismo pipeline.

---

# Reglas arquitectónicas

El Core nunca deberá:

- interpretar variables físicas;
- dibujar elementos;
- conocer componentes React;
- generar coordenadas;
- decidir el aspecto visual.

Su única responsabilidad consiste en coordinar el sistema.

---

# Definition of Done

El Core estará correctamente implementado cuando:

- pueda ejecutar cualquier módulo registrado;
- no contenga referencias a contenidos específicos de Física;
- coordine el pipeline completo sin lógica de negocio;
- permita agregar nuevos módulos sin modificaciones internas;
- pueda utilizar distintos motores de Layout y Render;
- sea completamente independiente de la interfaz de usuario;
- pueda probarse mediante pruebas unitarias sin necesidad de React ni del navegador.