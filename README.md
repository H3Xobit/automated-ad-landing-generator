# PageMatch

PageMatch builds a landing page that follows the ad a visitor just clicked. Paste an ad URL and the current landing page URL. The app reads the offer, tone, and call to action, then returns a page you can preview, open, or download.

## What you get

- A short read of the ad: message, tone, audience, and call to action
- One self-contained HTML page aligned to that ad
- A preview on the same screen
- Open in a new tab, or download the HTML file

The page is generated in the browser session. It is not stored on a server.

## Run locally

Requires Node.js and a [Groq](https://console.groq.com/) API key.

```bash
npm install
```

Create `.env.local` in the project root:

```bash
GROQ_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the local app |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run the linter |

## Stack

Next.js, React, and Tailwind. Generation uses the Groq API through `GROQ_API_KEY`. The key stays in `.env.local` and is not committed.
