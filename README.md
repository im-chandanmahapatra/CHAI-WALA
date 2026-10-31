# Chaiwala — chai across generations

A React/Vite academic-project prototype for a premium chai counter. It has a cinematic scroll opener, three generational menu worlds, a responsive order bag and local mock checkout.

## Run locally

```powershell
cd client
npm install
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/). Do not open `index.html` with `file://`; Vite must be running.

## Production build

```powershell
cd client
npm run build
```

## Configuration

Copy `client/.env.example` to `client/.env.local` only when connecting a real Supabase project. Never put a service-role key or payment secret in a `VITE_*` variable. Without those variables, the existing mock backend supports the prototype checkout.

## Before public deployment

1. Replace/clear the project-only `Chaiwala` name.
2. Supply and test one appropriate YouTube playlist per generation; playback must remain user initiated.
3. Verify the Supabase RPC payload and RLS with an anonymous client.
4. Deploy `client/dist` to stable HTTPS, then create and phone-test the QR code.

See [TASK.md](TASK.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), and [RESEARCH.md](RESEARCH.md) for the product decision record.
