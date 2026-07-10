# MRU Module

**Version:** 1.0.0

---

# Objetivo

El módulo MRU implementa el primer contenido de Física soportado por el sistema.

Su responsabilidad consiste en transformar un problema de Movimiento Rectilíneo Uniforme en un Scene Graph completamente válido que posteriormente será convertido en un diagrama SVG.

El módulo no conoce:

- React
- SVG
- Layout
- Renderer

El módulo únicamente conoce Física.

---

# Objetivos del MVP

El MVP debe permitir generar un diagrama automáticamente a partir de los datos físicos.

Entrada:

```text
x₀ = 20 m
v = 3 m/s
t = 10 s
```

Salida:

- eje X
- origen
- posición inicial
- posición final
- personaje
- vector velocidad
- etiquetas

Sin que el usuario tenga que indicar:

- orientación
- sentido
- posición del origen
- dirección del vector

Todo ello deberá inferirse automáticamente.

---

# Responsabilidades

El módulo MRU será responsable de:

- validar entradas;
- resolver el problema físico;
- inferir el comportamiento del fenómeno;
- construir el Scene Graph.

No será responsable de:

- posicionar elementos;
- calcular escalado;
- generar SVG;
- exportar.

---

# Flujo completo

```text
Formulario

↓

PhysicsInput

↓

validate()

↓

solve()

↓

infer()

↓

buildScene()

↓

Scene Graph
```

---

# Entradas

El MVP utilizará únicamente tres variables obligatorias.

| Variable | Descripción |
|-----------|-------------|
| x₀ | Posición inicial |
| v | Velocidad |
| t | Tiempo |

La posición final será calculada automáticamente.

---

# Modelo de entrada

Conceptualmente.

```text
PhysicsInput

x0

v

t
```

No incluye unidades gráficas.

Las unidades deberán ser coherentes.

---

# Validación

Antes de resolver el problema deberán verificarse.

## x₀

Debe ser un número real.

Puede ser:

- positivo
- negativo
- cero

---

## v

Debe ser un número real.

Puede ser:

- positivo
- negativo
- cero

---

## t

Debe ser un número real.

Debe cumplir.

```text
t ≥ 0
```

---

# Errores

Ejemplos.

```text
Tiempo negativo
```

```text
Valor vacío
```

```text
Dato no numérico
```

Cada error deberá devolver un mensaje claro.

---

# Resolución física

La única ecuación utilizada será.

```text
xf = x₀ + v·t
```

También se calculará.

```text
Δx = xf - x₀
```

---

# Resultado físico

El resultado contendrá.

```text
x0

v

t

xf

Δx
```

Todavía no existe ningún elemento gráfico.

---

# Motor de inferencia

Una vez resuelto el problema comienza la inferencia.

La inferencia transforma datos físicos en decisiones semánticas.

---

# Regla 1

## Sentido del movimiento

```text
v > 0

↓

derecha
```

```text
v < 0

↓

izquierda
```

```text
v = 0

↓

sin movimiento
```

---

# Regla 2

## Orientación del personaje

La orientación del personaje dependerá únicamente del signo de la velocidad.

Nunca del valor de x₀.

---

# Regla 3

## Orientación del vector velocidad

El vector siempre apunta en el mismo sentido que la velocidad.

---

# Regla 4

## Existe desplazamiento

```text
Δx = 0

↓

no existe desplazamiento
```

---

# Regla 5

## Cruce del origen

Si

```text
x₀

y

xf

poseen signos distintos
```

el origen deberá permanecer visible.

---

# Regla 6

## Posición final

Siempre deberá existir una PositionNode para la posición final.

Aunque coincida con la inicial.

---

# Regla 7

## Visibilidad del vector

Cuando

```text
v = 0
```

el vector velocidad no deberá dibujarse.

---

# Regla 8

## Etiquetas

Las etiquetas deberán generarse automáticamente.

Ejemplo.

```text
x₀

xf

v
```

El usuario nunca escribe las etiquetas.

---

# Diagram Model

La inferencia genera un modelo conceptual.

Ejemplo.

```text
Movimiento

↓

Sentido

↓

Orientación

↓

Elementos visibles
```

Este modelo todavía no contiene nodos.

---

# Construcción del Scene Graph

El Scene Builder transforma el Diagram Model en un Scene Graph.

---

# Elementos mínimos

Todo diagrama MRU deberá contener.

```text
Scene

Axis

Origin

Character

Position Initial

Position Final

Velocity Vector

Labels
```

---

# Escena conceptual

```text
Scene

├── Axis
├── Origin
├── Position Initial
├── Position Final
├── Character
├── Velocity Vector
├── Label x₀
├── Label xf
└── Label v
```

---

# Caso 1

Entrada.

```text
x₀ = 20

v = 5

t = 10
```

Resultado.

- personaje mira hacia la derecha;
- vector hacia la derecha;
- posición final a la derecha.

---

# Caso 2

```text
x₀ = 20

v = -5

t = 10
```

Resultado.

- personaje mira a la izquierda;
- vector hacia la izquierda;
- posición final a la izquierda.

---

# Caso 3

```text
x₀ = -20

v = 5

t = 10
```

Resultado.

- origen visible;
- personaje a la izquierda;
- posición final más cercana o posterior al origen.

---

# Caso 4

```text
x₀ = -20

v = 10

t = 5
```

Resultado.

El personaje termina exactamente sobre el origen.

---

# Caso 5

```text
v = 0
```

Resultado.

- personaje inmóvil;
- posición inicial = posición final;
- sin vector velocidad.

---

# Casos límite

El módulo deberá soportar correctamente.

- x₀ = 0
- v = 0
- t = 0
- posiciones negativas
- posiciones positivas
- cruce del origen
- desplazamientos extremadamente pequeños
- desplazamientos extremadamente grandes

Sin intervención del usuario.

---

# Restricciones

El módulo nunca deberá.

- crear SVG;
- conocer React;
- calcular escalado;
- utilizar píxeles;
- acceder al DOM.

---

# Testing

El módulo deberá contar con pruebas unitarias para.

## Validación

- números válidos;
- tiempo negativo;
- campos vacíos.

---

## Resolución física

Verificar.

```text
xf = x₀ + vt
```

en múltiples escenarios.

---

## Inferencia

Probar.

- velocidad positiva;
- velocidad negativa;
- velocidad cero.

---

## Scene Builder

Comprobar que siempre existan los nodos esperados.

---

## Integración

Ejecutar el pipeline completo.

```text
PhysicsInput

↓

Scene Graph
```

---

# Ejemplo completo

Entrada.

```text
x₀ = 20

v = 3

t = 10
```

Resolución.

```text
xf = 50
```

Inferencia.

```text
Movimiento hacia la derecha

↓

Personaje mira a la derecha

↓

Vector hacia la derecha
```

Scene Graph.

```text
Scene

├── Axis
├── Origin
├── Position Initial
├── Position Final
├── Character
├── Velocity Vector
├── Label x₀
├── Label xf
└── Label v
```

Layout.

```text
LayoutScene
```

Renderer.

```text
SVG
```

---

# Definition of Done

El módulo MRU estará correctamente implementado cuando:

- valide correctamente todas las entradas;
- resuelva la ecuación del MRU de forma determinista;
- infiera automáticamente el sentido del movimiento y la orientación del personaje;
- genere un Scene Graph completo sin depender de React ni de SVG;
- funcione para posiciones positivas, negativas y cruce del origen;
- oculte el vector cuando la velocidad sea cero;
- supere todas las pruebas unitarias definidas;
- pueda integrarse en el Core sin modificaciones adicionales.