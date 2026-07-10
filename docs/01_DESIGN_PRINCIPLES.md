# Design Principles

**Versión:** 1.0.0

---

# Objetivo

Este documento define los principios fundamentales que gobiernan todo el proyecto.

No describe la arquitectura ni los detalles de implementación.

Define las reglas que nunca deben romperse.

Si durante el desarrollo surge una decisión que contradice alguno de estos principios, deberá replantearse la solución antes de implementarla.

Estos principios tienen prioridad sobre cualquier decisión técnica.

---

# Principio 1 — La Física es la fuente de verdad

Toda representación visual debe derivarse exclusivamente del modelo físico.

El usuario describe un fenómeno físico.

La aplicación representa dicho fenómeno.

Nunca ocurre el proceso inverso.

La representación gráfica jamás debe modificar el comportamiento físico del sistema.

---

## Correcto

```text
Usuario

↓

Variables físicas

↓

Diagrama
```

---

## Incorrecto

```text
Usuario

↓

Opciones gráficas

↓

Interpretación física
```

---

# Principio 2 — El usuario describe el fenómeno, no el dibujo

La aplicación debe minimizar la cantidad de decisiones que toma el usuario.

Siempre que una característica pueda inferirse automáticamente a partir de las variables físicas, deberá calcularse sin solicitar información adicional.

Ejemplos.

El usuario escribe:

```text
v = -5
```

La aplicación deduce automáticamente:

- orientación del vector;
- sentido del movimiento;
- orientación futura del personaje.

No debe existir un selector adicional denominado:

```text
← izquierda

→ derecha
```

La información ya está contenida en el signo de la velocidad.

---

# Principio 3 — No solicitar información redundante

El formulario únicamente debe contener información indispensable.

Nunca deberán coexistir dos campos que representen la misma información.

Ejemplo incorrecto:

```text
Velocidad = -3

Sentido = derecha
```

Esto permite estados inconsistentes.

El formulario debe impedir este tipo de situaciones.

---

# Principio 4 — Separación estricta de responsabilidades

Cada módulo deberá cumplir una única responsabilidad.

No se aceptarán módulos que mezclen:

- cálculos físicos;
- renderizado;
- lógica React;
- escalado;
- exportación.

Cada responsabilidad deberá encontrarse claramente delimitada.

---

# Principio 5 — El dominio no depende de la interfaz

El dominio físico constituye el núcleo del sistema.

Debe poder ejecutarse sin:

- React;
- SVG;
- navegador;
- DOM;
- CSS.

Esto permitirá:

- testing sencillo;
- reutilización;
- exportación a distintos formatos.

---

# Principio 6 — Todo comportamiento debe ser determinista

Un mismo conjunto de variables físicas siempre deberá producir exactamente el mismo resultado.

No existirán:

- decisiones aleatorias;
- heurísticas no documentadas;
- comportamientos dependientes del navegador.

---

# Principio 7 — Inferencia centralizada

Toda decisión gráfica derivada de información física deberá concentrarse en un único módulo.

Nunca deberán existir expresiones como:

```ts
if (v > 0)
```

distribuidas por distintos componentes.

La lógica de inferencia deberá encontrarse completamente centralizada.

---

# Principio 8 — El Renderer no interpreta Física

El Renderer únicamente convierte objetos gráficos en SVG.

No interpreta:

- velocidades;
- aceleraciones;
- posiciones;
- fuerzas.

Recibe una escena completamente definida.

Su única responsabilidad consiste en dibujarla.

---

# Principio 9 — El Layout no interpreta el fenómeno

El Layout únicamente organiza elementos.

Nunca resuelve:

- ecuaciones;
- signos;
- sentido del movimiento.

Su responsabilidad consiste exclusivamente en:

- posicionar;
- escalar;
- distribuir;
- evitar colisiones.

---

# Principio 10 — Todo debe ser reutilizable

Antes de implementar una funcionalidad deberá evaluarse si puede reutilizarse posteriormente.

Por ejemplo.

El vector velocidad deberá diseñarse pensando en futuros vectores:

- aceleración;
- fuerza;
- campo eléctrico.

No deberán implementarse soluciones específicas para MRU cuando sea posible desarrollar componentes reutilizables.

---

# Principio 11 — Composición sobre herencia

La arquitectura favorecerá la composición.

Los objetos complejos deberán construirse mediante componentes pequeños.

Se evitarán jerarquías profundas de herencia.

---

# Principio 12 — Escalabilidad desde el primer día

Aunque el MVP implemente únicamente MRU, todas las decisiones arquitectónicas deberán permitir incorporar nuevos módulos sin modificar el núcleo del sistema.

Agregar un nuevo contenido idealmente consistirá en crear nuevos archivos y registrarlos.

No deberá requerir reescribir componentes existentes.

---

# Principio 13 — El SVG es un formato de salida

El SVG no constituye el modelo del sistema.

La aplicación genera primero una representación abstracta del fenómeno.

Posteriormente dicha representación se transforma en SVG.

Esta decisión permitirá soportar futuros formatos como:

- PNG;
- PDF;
- Canvas;
- TikZ;
- PowerPoint.

---

# Principio 14 — El código debe ser autoexplicativo

El proyecto priorizará:

- nombres claros;
- funciones pequeñas;
- módulos especializados;
- tipado estricto.

Los comentarios no deberán utilizarse para explicar código complejo.

Si una función necesita demasiadas explicaciones, probablemente deba dividirse.

---

# Principio 15 — La accesibilidad es un requisito, no una mejora

Los diagramas deberán ser legibles tanto en:

- pantallas;
- proyectores;
- documentos impresos.

La información esencial nunca dependerá únicamente del color.

El SVG deberá incorporar atributos básicos de accesibilidad cuando corresponda.

---

# Principio 16 — Diseño inspirado en textos científicos

La apariencia del sistema deberá recordar los diagramas presentes en libros de Física.

Se evitarán elementos decorativos innecesarios.

El objetivo principal es transmitir información de forma clara.

---

# Principio 17 — La arquitectura precede a la implementación

Antes de desarrollar cualquier módulo deberán definirse:

- responsabilidades;
- contratos;
- entradas;
- salidas;
- dependencias.

La implementación nunca deberá preceder al diseño.

---

# Principio 18 — Cada decisión importante debe documentarse

Toda decisión arquitectónica relevante deberá registrarse mediante un Architecture Decision Record (ADR).

Esto permitirá comprender el motivo de cada decisión incluso varios años después.

---

# Principio 19 — Los casos límite son parte del diseño

Los casos especiales no deberán resolverse una vez aparezcan errores.

Deben formar parte del diseño inicial.

Ejemplos:

- velocidad igual a cero;
- tiempo igual a cero;
- posiciones negativas;
- cruce del origen;
- desplazamientos extremadamente pequeños;
- desplazamientos extremadamente grandes.

---

# Principio 20 — Evolución continua

El proyecto deberá evolucionar mediante pequeños incrementos funcionales.

Cada nueva versión deberá mantener:

- consistencia;
- compatibilidad arquitectónica;
- simplicidad.

Nunca deberá sacrificarse la calidad del diseño por implementar funcionalidades rápidamente.

---

# Resumen

Toda decisión tomada durante el desarrollo deberá respetar los siguientes principios fundamentales:

1. La Física es la fuente de verdad.
2. El usuario describe el fenómeno, no el dibujo.
3. No solicitar información redundante.
4. Separación estricta de responsabilidades.
5. El dominio no depende de la interfaz.
6. Comportamiento determinista.
7. Inferencia centralizada.
8. El Renderer no interpreta Física.
9. El Layout no interpreta el fenómeno.
10. Reutilización.
11. Composición sobre herencia.
12. Escalabilidad.
13. El SVG es un formato de salida.
14. Código autoexplicativo.
15. Accesibilidad.
16. Diseño científico.
17. La arquitectura precede al código.
18. Decisiones documentadas.
19. Diseño considerando casos límite.
20. Evolución incremental.