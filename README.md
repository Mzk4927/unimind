# A.R.I.S. — Autonomous Indoor Intelligent Rover

A frontend-only, cinematic robotics-OS style demo built for a Final Year Project presentation.
No backend, no database, no auth — everything is simulated with React state.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5173).

## Build for a laptop demo (no internet needed on stage)

```bash
npm run build
npm run preview
```

## What's simulated

- A cinematic boot sequence with a holographic reveal.
- A procedurally built 3D rover (no external model files needed) that drives, turns its
  wheels, and breathes on its suspension.
- Autonomous navigation across a stylized NUTECH campus: CS Department (Class 501, 502,
  502B, 503, 504), CEN Department, and NUTech Media.
- A live processing log that runs a full ROS2/SLAM-style boot checklist, then loops
  "Processing / Scanning / Avoiding Obstacles" forever — **it will never arrive on its
  own**. Click anywhere on the screen once the rover is at its destination to signal
  arrival, exactly as specified.
- A SLAM occupancy-grid + radar page, a Global/Local planner page, live telemetry
  (battery, speed, LiDAR, depth camera, Jetson Nano, ROS2), an Emergency Stop lock
  screen, and a small onboard AI Assistant chat with canned, on-topic replies.

## Project layout

```
src/
  components/
    scene/     3D: rover model, environment, path, camera rig, particles
    hud/       2D glass-panel UI: buttons, panels, overlays
    pages/     SLAM + Navigation full-screen panels
    chat/      AI Assistant
    loading/   Boot sequence
  store/       Single React context + reducer driving the whole simulation
  data/        Destination coordinates for the campus map
  utils/       Path interpolation helper
```

## Notes for the presentation

- Everything runs on `localhost`; no network calls are made anywhere in the app.
- Colors, glow and type scale live in `tailwind.config.js` — tweak the `neon` palette
  there if you want a different accent color for your slides.
