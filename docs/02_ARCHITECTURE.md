# Architecture

**Version:** 1.0.0

---

# Objetivo

Este documento define la arquitectura oficial del proyecto.

Su propósito es establecer la organización del sistema, las responsabilidades de cada módulo y las dependencias permitidas entre ellos.

Este documento constituye la referencia principal para cualquier desarrollador o agente de IA que participe en el proyecto.

Toda implementación deberá respetar la arquitectura aquí descrita.

---

# Filosofía arquitectónica

El sistema se construirá utilizando una arquitectura basada en responsabilidades claramente separadas.

La arquitectura debe responder a un principio fundamental:

> **Cada módulo conoce únicamente la información necesaria para realizar su trabajo.**

Esto significa que:

- La Física nunca conoce React.
- La Física nunca conoce SVG.
- El Layout nunca conoce la Física.
- El Renderer nunca interpreta variables físicas.
- React nunca calcula ecuaciones.

Cada módulo recibe una entrada bien definida y produce una salida bien definida.

---

# Arquitectura de alto nivel

```text
                    ┌──────────────────────────┐
                    │        React UI          │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │   Application Layer      │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │    Physics Module        │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │  Inference Engine        │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │      Scene Builder       │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │     Layout Engine        │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │     SVG Renderer         │
                    └─────────────┬────────────┘
                                  │
                                  ▼
                             SVG Final
```

Cada bloque representa un dominio independiente.

Ningún módulo debe omitir etapas.

---

# Arquitectura por capas

La aplicación estará organizada en siete capas.

## 1. Presentación

Responsabilidad:

- Mostrar la interfaz.
- Capturar interacción del usuario.
- Mostrar errores.
- Mostrar el diagrama.

Puede conocer:

- React
- CSS Modules
- Hooks

No puede conocer:

- Física
- SVG
- Escalado

---

## 2. Aplicación

Responsabilidad:

Coordinar el flujo de información entre módulos.

No contiene reglas de negocio.

No realiza cálculos físicos.

Simplemente orquesta el pipeline.

---

## 3. Dominio Físico

Responsabilidad:

Representar el fenómeno físico.

Debe contener únicamente:

- ecuaciones
- modelos
- validaciones físicas
- unidades

No conoce:

- interfaz
- renderizado
- layout

---

## 4. Motor de Inferencia

Responsabilidad:

Transformar información física en decisiones semánticas.

Ejemplos:

- existe movimiento
- orientación del vector
- estado del móvil
- relaciones espaciales

No dibuja.

No posiciona.

No calcula píxeles.

---

## 5. Construcción de Escena

Responsabilidad:

Construir un modelo abstracto del diagrama.

Produce un Scene Graph.

No conoce SVG.

No conoce React.

---

## 6. Motor de Layout

Responsabilidad:

Calcular posiciones.

Resolver colisiones.

Aplicar escalado.

Asignar coordenadas.

No interpreta Física.

---

## 7. Renderer

Responsabilidad:

Transformar una escena posicionada en SVG.

No calcula.

No interpreta.

No modifica.

Únicamente dibuja.

---

# Flujo completo

Todo el proyecto deberá seguir el siguiente flujo.

```text
PhysicsInput

↓

Physics Engine

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

Ningún módulo puede saltarse este flujo.

---

# Dependencias permitidas

La dirección de las dependencias será estrictamente unidireccional.

```text
Presentation

↓

Application

↓

Physics

↓

Inference

↓

Scene Builder

↓

Layout

↓

Renderer
```

Las dependencias inversas están prohibidas.

---

# Regla de dependencia

Una capa únicamente puede conocer:

- su propia implementación;
- la capa inmediatamente inferior.

Nunca puede depender de una capa superior.

Ejemplo.

Correcto:

```text
Renderer

↓

Scene
```

Incorrecto:

```text
Renderer

↓

Physics Engine
```

---

# Pipeline del dominio

El dominio constituye el núcleo del proyecto.

```text
Physics Input

↓

Physics Engine

↓

Inference

↓

Scene Builder
```

Todo este pipeline deberá estar completamente desacoplado de React.

Debe poder ejecutarse desde:

- una aplicación web;
- una aplicación de escritorio;
- una API;
- pruebas unitarias.

---

# Pipeline gráfico

El pipeline gráfico comienza una vez que existe una escena.

```text
Scene

↓

Layout

↓

Renderer

↓

SVG
```

El pipeline gráfico jamás modifica el dominio físico.

---

# Principio de inversión

Los módulos de alto nivel no dependerán de implementaciones concretas.

Dependerán únicamente de contratos.

Por ejemplo.

El Renderer no conocerá:

```text
MRU
```

Conocerá únicamente:

```text
Scene
```

Del mismo modo.

El Layout no conocerá:

```text
Velocity
```

Conocerá únicamente:

```text
VectorNode
```

---

# Módulos del sistema

El sistema estará dividido en módulos independientes.

## Core

Contiene la infraestructura reutilizable.

Ejemplos:

- Scene Graph
- Renderer
- Layout
- utilidades
- tipos comunes

Nunca contendrá contenido específico de MRU.

---

## Physics Modules

Cada contenido de Física será un módulo independiente.

Ejemplos.

```text
MRU

MRUV

Free Fall

Projectile

Forces
```

Cada módulo implementará el mismo contrato.

---

## UI

Contiene exclusivamente:

- componentes React
- formularios
- vistas

No contendrá reglas de negocio.

---

# Comunicación entre módulos

Los módulos únicamente podrán comunicarse mediante objetos bien definidos.

Nunca mediante:

- variables globales;
- estados compartidos ocultos;
- efectos secundarios.

Toda comunicación deberá ser explícita.

---

# Gestión del estado

El estado de React deberá limitarse a:

- valores del formulario;
- preferencias de visualización;
- estado de exportación;
- mensajes.

Nunca almacenará resultados físicos duplicados.

Siempre que sea posible, dichos resultados deberán calcularse nuevamente mediante funciones puras.

---

# Errores

Cada capa será responsable únicamente de los errores que pueda producir.

Ejemplos.

Formulario:

- campo obligatorio.

Physics Engine:

- unidades incompatibles.

Layout:

- imposibilidad de distribuir etiquetas.

Renderer:

- nodo gráfico inválido.

Los errores no deberán propagarse como excepciones genéricas.

Cada módulo deberá producir errores específicos.

---

# Extensibilidad

Agregar un nuevo módulo deberá requerir únicamente:

1. crear un nuevo módulo físico;
2. registrar el módulo;
3. crear el formulario correspondiente.

No deberá requerir modificaciones en:

- Renderer;
- Layout;
- Scene Graph;
- React Core.

---

# Restricciones arquitectónicas

Quedan explícitamente prohibidas las siguientes prácticas.

## React

No deberá:

- calcular Física;
- inferir orientación;
- resolver escalado.

---

## Renderer

No deberá:

- evaluar velocidades;
- calcular posiciones;
- interpretar unidades.

---

## Layout

No deberá:

- resolver ecuaciones;
- interpretar signos;
- conocer MRU.

---

## Physics Engine

No deberá:

- generar SVG;
- conocer componentes React;
- acceder al DOM.

---

# Objetivos de calidad

La arquitectura deberá facilitar:

## Testabilidad

Cada módulo deberá probarse de forma aislada.

---

## Reutilización

Los módulos deberán utilizarse en distintos contenidos.

---

## Mantenibilidad

Los cambios deberán localizarse en un único módulo.

---

## Escalabilidad

La incorporación de nuevos temas de Física no deberá requerir rediseñar la arquitectura.

---

## Legibilidad

La organización del proyecto deberá permitir comprender rápidamente el recorrido de la información.

---

# Diagrama conceptual

```text
                     Usuario
                         │
                         ▼
                 React Application
                         │
                         ▼
                  Application Layer
                         │
                         ▼
                 Physics Module (MRU)
                         │
                         ▼
                 Inference Engine
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
                  Positioned Scene
                         │
                         ▼
                   SVG Renderer
                         │
                         ▼
                    SVG Document
                         │
                         ▼
                      Exportación
```

---

# Definition of Architecture Done

La arquitectura se considerará correctamente implementada cuando se cumplan todos los siguientes criterios.

- Ningún componente React contiene cálculos físicos.
- El dominio puede ejecutarse sin React.
- El Renderer puede reemplazarse sin modificar el dominio.
- El Layout puede reemplazarse sin modificar el Renderer.
- Todos los módulos se comunican mediante contratos.
- Las dependencias siguen una única dirección.
- Los nuevos módulos de Física pueden incorporarse sin modificar el núcleo del sistema.
- Cada capa posee una única responsabilidad.
- Existen pruebas unitarias para el dominio y el motor de inferencia.
- La arquitectura permite incorporar nuevos formatos de salida distintos de SVG.