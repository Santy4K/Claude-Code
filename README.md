# Umbra: Crónicas de un Hechicero

Simulador de vida (estilo BitLife) ambientado en un mundo de maldiciones y hechiceros.
Nacé, crecé, y si tenés lo necesario, cruzá al mundo oculto de la hechicería: elegí
escuela y técnica maldita, subí de grado y viví toda una vida, año a año.

## Stack

- React + TypeScript + Vite
- Zustand (estado + persistencia en `localStorage`)
- Sin backend: todo corre en el dispositivo

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

## Estructura

```
src/
  game/
    content/   # sistema de contenido dual: nombres propios vs. nombres canon de JJK
    data/      # escuelas, técnicas, grados, pool de eventos de vida
    engine/    # motor del loop de vida (character, ageUp, resolución de eventos)
    state/     # store de Zustand con persistencia
  ui/
    screens/   # pantallas del juego
    components/
  styles/      # sistema de diseño global
```

### Sistema de contenido dual

El motor nunca hardcodea nombres de Jujutsu Kaisen. Todo texto que identifica personajes,
escuelas o técnicas se resuelve por ID contra un "content pack" activo:

- `content.original.ts`: nombres propios, pensado para una eventual publicación pública.
- `content.canon.ts`: nombres reales de JJK, para uso personal.

El pack activo se elige desde **Ajustes**, tocando 7 veces la versión al pie de la
pantalla para revelar el menú de desarrollador.

## Roadmap

Ver el plan completo de versiones (v1 MVP → combate y relaciones → Dominios de
Expansión → empaquetado con Capacitor para Android) en la conversación del proyecto.
