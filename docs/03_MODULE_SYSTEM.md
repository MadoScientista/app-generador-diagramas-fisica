# Module System

**Version:** 1.0.0

---

# Objetivo

El objetivo de este documento es definir cómo se integra un nuevo contenido de Física dentro del sistema.

La arquitectura del proyecto se basa en un principio muy importante:

> **Todo contenido de Física es un módulo.**

MRU es un módulo.

MRUV será otro módulo.

Caída Libre será otro módulo.

Tiro Parabólico será otro módulo.

El núcleo de la aplicación nunca deberá contener lógica específica de un contenido.

Todo contenido especializado deberá implementarse mediante módulos independientes.

---

# Filosofía

La aplicación no conoce MRU.

La aplicación no conoce Fuerzas.

La aplicación no conoce Electricidad.

La aplicación únicamente conoce módulos.

Cada módulo implementa un contrato común.

El núcleo solamente interactúa con dicho contrato.

---

# Arquitectura general

```text
                    Physics Diagram Engine

                              │

        ┌─────────────────────┴──────────────────────┐

        ▼                                            ▼

 Core Infrastructure                       Physics Modules

                                                │

                 ┌──────────────┬──────────────┬──────────────┐

                 ▼              ▼              ▼

                MRU           MRUV         Free Fall
```

---

# Definición de módulo

Un módulo representa un contenido específico de Física.

Cada módulo posee:

- sus variables de entrada;
- sus ecuaciones;
- sus reglas de inferencia;
- su forma de construir una escena.

Todo lo demás pertenece al Core.

---

# Responsabilidades

Un módulo es responsable de:

- definir su formulario;
- validar datos;
- resolver el fenómeno físico;
- inferir la representación;
- construir el Scene Graph.

No es responsable de:

- renderizar SVG;
- exportar;
- calcular escalado;
- posicionar etiquetas;
- administrar React.

---

# Contrato general

Todo módulo deberá implementar exactamente el mismo flujo.

```text
Input

↓

Validation

↓

Physics

↓

Inference

↓

Scene Builder

↓

Scene Graph
```

El resultado siempre será un Scene Graph.

Nunca un SVG.

---

# Ciclo de vida

Todo módulo recorrerá las siguientes etapas.

## 1. Recepción de datos

Recibe exclusivamente las variables ingresadas por el usuario.

---

## 2. Validación

Verifica:

- tipos;
- rangos;
- unidades;
- consistencia.

---

## 3. Resolución física

Calcula todas las variables derivadas.

Ejemplo en MRU.

```text
xf

desplazamiento
```

---

## 4. Inferencia

Interpreta el fenómeno.

Ejemplos.

- sentido del movimiento;
- existencia de desplazamiento;
- orientación futura del personaje.

---

## 5. Construcción de escena

Genera una representación abstracta.

Ejemplo.

```text
Scene

Axis

Origin

Character

Vector

Labels
```

No existen coordenadas.

---

# El Core nunca pregunta

El Core jamás debe preguntar:

```text
¿Es MRU?
```

Ni:

```text
¿Es MRUV?
```

Simplemente solicita un Scene Graph.

Esto garantiza que el núcleo permanezca completamente desacoplado.

---

# Variables propias

Cada módulo define únicamente las variables que necesita.

Ejemplo.

MRU

```text
x₀

v

t
```

---

MRUV

```text
x₀

v₀

a

t
```

---

Plano Inclinado

```text
masa

ángulo

μ

g
```

El Core no necesita conocer ninguna de estas variables.

---

# Independencia

Cada módulo deberá poder desarrollarse en una carpeta independiente.

Idealmente deberá ser posible eliminar completamente un módulo sin afectar al resto del proyecto.

---

# Registro de módulos

La aplicación deberá poseer un registro centralizado.

Conceptualmente.

```text
MRU

↓

registrar

↓

Engine
```

El Engine únicamente conocerá una lista de módulos disponibles.

Nunca clases concretas.

---

# Agregar un nuevo módulo

Agregar un nuevo contenido deberá requerir únicamente:

1. crear una carpeta;
2. implementar el contrato;
3. registrar el módulo.

Nada más.

No deberá modificarse:

- Renderer;
- Layout;
- Scene Graph;
- Exportación.

---

# Comunicación

Los módulos nunca deberán comunicarse entre sí.

MRU no conoce MRUV.

MRUV no conoce Fuerzas.

Todos se comunican exclusivamente con el Core.

---

# Escalabilidad

Gracias a esta arquitectura será posible incorporar posteriormente:

- Cinemática.
- Dinámica.
- Energía.
- Trabajo.
- Impulso.
- Fluidos.
- Termodinámica.
- Ondas.
- Óptica.
- Electricidad.
- Magnetismo.

sin modificar la infraestructura principal.

---

# Requisitos de calidad

Todo módulo deberá ser:

- independiente;
- testeable;
- reutilizable;
- determinista;
- tipado estrictamente;
- libre de dependencias con React.

---

# Principio fundamental

El éxito del proyecto depende de que el Core permanezca completamente independiente de cualquier contenido específico de Física.

Los módulos evolucionan.

El Core permanece estable.

Esta será una de las decisiones arquitectónicas más importantes de todo el proyecto.