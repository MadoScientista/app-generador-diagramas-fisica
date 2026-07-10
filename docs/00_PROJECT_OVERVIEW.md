# Physics Diagram Engine
## Project Overview

**Version:** 1.0.0

**Status:** MVP - Movimiento Rectilíneo Uniforme (MRU)

---

# 1. Introducción

Physics Diagram Engine es una aplicación web cuyo objetivo es generar automáticamente diagramas de Física claros, consistentes y visualmente profesionales a partir de un conjunto reducido de variables físicas.

La aplicación **no resuelve ejercicios**, **no explica procedimientos matemáticos** y **no utiliza Inteligencia Artificial para generar imágenes**.

Su propósito es transformar información física en representaciones visuales que puedan incorporarse inmediatamente a:

- guías de ejercicios;
- pruebas;
- presentaciones;
- informes;
- material de apoyo;
- libros digitales.

El proyecto busca eliminar una tarea repetitiva que actualmente obliga a muchos docentes a dibujar manualmente diagramas utilizando PowerPoint, Word, Paint o programas de dibujo vectorial.

---

# 2. Problema

Actualmente, la elaboración de material educativo de Física presenta una dificultad recurrente:

Los docentes necesitan representar fenómenos físicos mediante diagramas simples, pero la creación de estos consume una cantidad significativa de tiempo.

Incluso diagramas muy básicos requieren:

- dibujar ejes;
- agregar vectores;
- ubicar posiciones;
- escribir etiquetas;
- mantener proporciones visuales;
- cuidar la estética.

Esta tarea no aporta valor pedagógico directo, ya que el objetivo del docente es enseñar Física, no realizar diseño gráfico.

El resultado suele ser una pérdida considerable de tiempo en una actividad completamente repetitiva.

---

# 3. Solución

La aplicación automatiza completamente la construcción del diagrama.

El usuario únicamente proporciona información física.

Por ejemplo:

```text
x₀ = 20 m

v = -3 m/s

t = 10 s
```

A partir de estos datos, la aplicación genera automáticamente un diagrama consistente.

No existen herramientas de dibujo.

No existen editores gráficos.

No existen elementos arrastrables.

Toda la representación es inferida por el sistema.

---

# 4. Filosofía del proyecto

El proyecto se fundamenta en un principio muy simple:

> **El usuario describe la Física. La aplicación decide cómo representarla.**

Como consecuencia:

El usuario nunca debe indicar:

- hacia dónde apunta un vector;
- dónde termina el móvil;
- cómo escalar el dibujo;
- dónde ubicar etiquetas;
- cuánto debe medir una flecha.

Toda esa información puede deducirse automáticamente.

La aplicación debe actuar como un docente experto capaz de interpretar correctamente el fenómeno físico.

---

# 5. Objetivos

## Objetivo general

Construir una plataforma capaz de generar diagramas físicos automáticamente a partir de variables físicas.

---

## Objetivos específicos

- minimizar el tiempo necesario para crear diagramas;
- producir diagramas consistentes;
- eliminar tareas repetitivas;
- mantener una curva de aprendizaje prácticamente nula;
- facilitar la creación de material educativo;
- construir una arquitectura escalable para futuros contenidos.

---

# 6. Objetivos del MVP

El MVP implementará únicamente diagramas correspondientes al tema:

> Movimiento Rectilíneo Uniforme (MRU)

No se implementarán contenidos adicionales.

No se desarrollarán funcionalidades pensando en casos futuros, salvo aquellas relacionadas con la arquitectura.

El objetivo consiste en validar el núcleo tecnológico del proyecto.

---

# 7. Alcance del MVP

El MVP permitirá:

- ingresar variables físicas;
- validar entradas;
- calcular la posición final;
- inferir automáticamente el diagrama;
- visualizar el resultado en tiempo real;
- exportar el diagrama como SVG.

No incluirá:

- animaciones;
- múltiples móviles;
- fuerzas;
- aceleraciones;
- gráficos posición-tiempo;
- gráficos velocidad-tiempo;
- exportación PDF;
- exportación PNG;
- cuentas de usuario;
- almacenamiento en la nube.

---

# 8. Usuario objetivo

El sistema está diseñado principalmente para:

- profesores de enseñanza media;
- profesores universitarios;
- estudiantes universitarios;
- ayudantes de laboratorio;
- autores de material educativo.

No está orientado a diseñadores gráficos.

No requiere conocimientos sobre software CAD o edición vectorial.

---

# 9. Caso de uso principal

Un profesor desea crear el siguiente ejercicio:

> Un ciclista se encuentra a 20 metros del origen y avanza con una velocidad constante de 3 m/s durante 10 segundos.

El profesor únicamente ingresa:

```text
x₀ = 20

v = 3

t = 10
```

La aplicación genera automáticamente:

- eje X;
- origen;
- posición inicial;
- posición final;
- móvil;
- vector velocidad;
- etiquetas.

Todo ello sin intervención manual.

---

# 10. Principios de diseño

Toda decisión arquitectónica deberá respetar los siguientes principios.

## Simplicidad

El usuario introduce únicamente la información indispensable.

Nunca deberá completar formularios innecesariamente largos.

---

## Consistencia

Los mismos datos físicos deberán generar exactamente el mismo diagrama.

No existirán decisiones aleatorias.

---

## Automatización

Toda información deducible deberá inferirse automáticamente.

Nunca se solicitarán datos redundantes.

---

## Legibilidad

Los diagramas deberán parecer extraídos de un libro de Física.

La prioridad absoluta es la claridad.

---

## Escalabilidad

La arquitectura deberá permitir incorporar nuevos módulos sin modificar el núcleo del sistema.

---

## Mantenibilidad

Las responsabilidades deberán encontrarse claramente separadas.

Cada componente deberá cumplir una única función.

---

# 11. Principios pedagógicos

El proyecto no pretende reemplazar la enseñanza de la Física.

Su objetivo consiste en apoyar el proceso de aprendizaje mediante representaciones visuales correctas.

Los diagramas deberán:

- respetar las convenciones físicas;
- evitar ambigüedades;
- representar únicamente información relevante;
- facilitar la comprensión conceptual;
- mantener consistencia entre distintos ejercicios.

No deberán introducir elementos decorativos que puedan distraer al estudiante.

---

# 12. Convenciones físicas

El proyecto utilizará una única convención para todos los módulos.

## Eje positivo

El eje X positivo siempre apunta hacia la derecha.

Esta convención nunca será configurable.

---

## Signo de la velocidad

El sentido del movimiento se deduce exclusivamente del signo de la velocidad.

Ejemplos:

```text
v > 0

↓

movimiento hacia la derecha
```

```text
v < 0

↓

movimiento hacia la izquierda
```

Nunca existirá un selector independiente para indicar el sentido.

---

## Dirección

En MRU la dirección siempre corresponde al eje horizontal.

No será configurable.

---

## Unidades

Las unidades representan únicamente la forma de visualizar los valores.

No modifican el comportamiento del dominio físico.

---

# 13. Tecnologías

El proyecto utilizará exclusivamente tecnologías modernas y ampliamente adoptadas.

## Frontend

- React
- TypeScript
- Vite
- CSS Modules

---

## Renderizado

- SVG nativo

---

## Estado

- React Hooks

---

## Testing

- Vitest
- React Testing Library

---

## Validación

La librería de validación será definida durante el diseño de la arquitectura (se evaluará Zod u otra alternativa equivalente).

---

# 14. Principios arquitectónicos

El sistema se construirá respetando una arquitectura por capas.

Las responsabilidades estarán completamente separadas.

En particular:

- la Física nunca conocerá React;
- la Física nunca conocerá SVG;
- React nunca realizará cálculos físicos;
- el Renderer nunca resolverá ecuaciones;
- el Layout nunca interpretará fenómenos físicos.

Cada módulo tendrá una única responsabilidad.

---

# 15. Flujo general del sistema

```text
Usuario

↓

Formulario

↓

Validación

↓

Modelo Físico

↓

Motor de Inferencia

↓

Scene Graph

↓

Motor de Layout

↓

Renderer SVG

↓

Visualización

↓

Exportación
```

Cada etapa transformará la información recibida en una representación de mayor nivel de concreción.

---

# 16. Roadmap general

El desarrollo del proyecto seguirá una estrategia incremental.

## Etapa 1

MRU

---

## Etapa 2

MRUV

---

## Etapa 3

Caída Libre

---

## Etapa 4

Lanzamiento Vertical

---

## Etapa 5

Tiro Parabólico

---

## Etapa 6

Diagramas de Fuerzas

---

## Etapa 7

Trabajo y Energía

---

## Etapa 8

Electricidad

---

Cada módulo deberá reutilizar la mayor cantidad posible de infraestructura existente.

---

# 17. Criterios de éxito

Se considerará que el proyecto cumple sus objetivos cuando un docente pueda:

- generar un diagrama completo en menos de treinta segundos;
- comprender inmediatamente el funcionamiento de la aplicación;
- reutilizar el diagrama en cualquier material educativo;
- confiar en que el resultado respeta las convenciones físicas;
- obtener siempre diagramas consistentes.

---

# 18. Visión a largo plazo

El objetivo final no es construir un generador de diagramas de MRU.

El objetivo consiste en desarrollar un **Physics Diagram Engine**, una plataforma modular capaz de representar distintos fenómenos físicos mediante una arquitectura reutilizable.

Cada nuevo contenido deberá incorporarse como un módulo independiente, reutilizando:

- el motor físico;
- el motor de inferencia;
- el Scene Graph;
- el motor de Layout;
- el Renderer.

De esta manera, el crecimiento del proyecto se basará en la extensión del dominio y no en la reescritura de la arquitectura.