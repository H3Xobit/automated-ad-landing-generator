"use client";

import { useEffect, useState } from "react";

/** Parse API data URL into HTML string (supports utf-8 comma form and base64). */
function dataUrlToHtmlString(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  if (comma === -1) throw new Error("Invalid data URL");
  const header = dataUrl.slice(0, comma);
  const payload = dataUrl.slice(comma + 1);
  if (header.includes(";base64")) {
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }
  return decodeURIComponent(payload);
}

function createHtmlBlobUrl(dataUrl: string): string {
  const html = dataUrlToHtmlString(dataUrl);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  return URL.createObjectURL(blob);
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="pm-bolt-bg" x1="6" y1="32" x2="32" y2="6" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#2dd4bf" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#pm-bolt-bg)" />
      <path
        d="M19.2 9.5L11 20.25h5.5L16.8 26.5 25 15.75h-5.5L19.2 9.5z"
        fill="#0f172a"
        fillOpacity="0.92"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const [adUrl, setAdUrl] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  /** Blob URL for preview / open / download — avoids broken `data:` navigation in new tabs */
  const [htmlObjectUrl, setHtmlObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!result) {
      setHtmlObjectUrl(null);
      return;
    }
    let url: string;
    try {
      url = createHtmlBlobUrl(result);
    } catch {
      setHtmlObjectUrl(null);
      return;
    }
    setHtmlObjectUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adUrl, landingUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (!data.pageUrl) {
        throw new Error("Invalid response from server");
      }

      setResult(data.pageUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-slate-950/50 px-3.5 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-slate-500/60 focus:bg-slate-950/70 focus:ring-2 focus:ring-slate-500/15";

  const stats = [
    { value: "3x", label: "Conversion lift" },
    { value: "< 1 min", label: "Generation time" },
    { value: "100%", label: "Brand aligned" },
  ] as const;

  const features = [
    "Instant generation",
    "Perfect tone matching",
    "Mobile responsive",
    "Production ready",
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Soft color wash — low contrast */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-cyan-950/25"
        aria-hidden
      />
      {/* Gradient orbs — muted, no screen blend */}
      <div
        className="pointer-events-none absolute -left-[20%] top-[-14%] h-[min(90vw,500px)] w-[min(90vw,500px)] rounded-full bg-blue-600/[0.11] blur-[100px] animate-blob"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[14%] top-[10%] h-[min(82vw,440px)] w-[min(82vw,440px)] rounded-full bg-cyan-600/[0.09] blur-[105px] animate-blob-alt animation-delay-2000"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[12%] h-[min(92vw,520px)] w-[min(92vw,520px)] rounded-full bg-teal-600/[0.08] blur-[115px] animate-blob-slow animation-delay-4000"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_55%_at_50%_-12%,rgba(56,189,248,0.07),transparent_60%)]"
        aria-hidden
      />

      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

      <header className="relative z-20 border-b border-white/10 bg-slate-950/55 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <a
            href="/"
            className="flex items-center gap-3 rounded-lg text-white outline-none ring-offset-2 ring-offset-slate-950 focus-visible:ring-2 focus-visible:ring-slate-500/50"
          >
            <LogoMark className="h-10 w-10 shrink-0 shadow-md shadow-black/40" />
            <div className="leading-tight">
              <span className="block text-[16px] font-semibold tracking-[-0.03em]">PageMatch</span>
              <span className="block text-[11px] font-medium text-slate-400">Ad to landing alignment</span>
            </div>
          </a>
          <button
            type="button"
            className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-slate-300 shadow-sm backdrop-blur-sm transition hover:border-white/15 hover:bg-white/[0.07] hover:text-white"
          >
            Sign in
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="max-w-xl space-y-8 lg:pt-2">
            <p className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
              Real-time Generation
            </p>

            <div className="space-y-5">
              <h1 className="text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.035em] text-slate-50 sm:text-[2.5rem] sm:leading-[1.1] lg:text-[2.65rem]">
                Landing pages that match your ads
              </h1>
              <p className="text-[15px] leading-relaxed text-slate-400 sm:text-base">
                Generate personalized landing pages in seconds. Automatically matches your
                ad&apos;s tone, message, and call-to-action for a seamless user experience from
                click to conversion.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md"
                >
                  <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-100 sm:text-[1.65rem]">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>

            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {features.map((label) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700/50 text-slate-400">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-20">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-1 rounded-[1.125rem] bg-gradient-to-br from-sky-900/20 via-transparent to-slate-900/30 blur-2xl"
                aria-hidden
              />
              <div className="glass-panel relative overflow-hidden rounded-2xl border border-white/[0.09] p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-slate-600/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-6 border-b border-white/10 pb-6">
                    <h2 className="text-lg font-semibold tracking-tight text-white">Try it now</h2>
                    <p className="mt-1.5 text-sm text-slate-400">
                      Enter your URLs to see it in action
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="ad-url" className="text-sm font-medium text-slate-300">
                        Ad Creative URL
                      </label>
                      <input
                        id="ad-url"
                        type="url"
                        name="adUrl"
                        value={adUrl}
                        onChange={(e) => setAdUrl(e.target.value)}
                        placeholder="https://…"
                        required
                        autoComplete="url"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="landing-url" className="text-sm font-medium text-slate-300">
                        Landing Page URL
                      </label>
                      <input
                        id="landing-url"
                        type="url"
                        name="landingUrl"
                        value={landingUrl}
                        onChange={(e) => setLandingUrl(e.target.value)}
                        placeholder="https://…"
                        required
                        autoComplete="url"
                        className={inputClass}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative mt-1 w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/25 shadow-[0_0_28px_-10px_rgba(37,99,235,0.14)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-slate-600 via-slate-700 to-blue-950/50 transition group-hover:from-slate-500 group-hover:via-slate-600 group-hover:to-blue-900/45" />
                      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100 group-hover:bg-white/[0.06]" />
                      <span className="relative flex items-center justify-center gap-2">
                        {loading && (
                          <svg
                            className="h-5 w-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        {loading ? "Generating…" : "Generate Page"}
                      </span>
                    </button>
                  </form>

                  {error && (
                    <div
                      role="alert"
                      className="mt-5 rounded-xl border border-red-500/35 bg-red-950/50 px-4 py-3 text-sm text-red-100 shadow-lg shadow-red-950/30"
                    >
                      <p className="font-medium">Could not generate</p>
                      <p className="mt-1 text-red-200/90">{error}</p>
                    </div>
                  )}

                  {result && !error && (
                    <div className="mt-5 space-y-3">
                      <p className="text-sm font-medium text-slate-400">Preview</p>
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.35)]">
                        <iframe
                          title="Generated page preview"
                          src={htmlObjectUrl ?? result}
                          className="h-[min(62vh,460px)] w-full bg-white"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          disabled={!htmlObjectUrl}
                          onClick={() => {
                            if (!htmlObjectUrl) return;
                            window.open(htmlObjectUrl, "_blank", "noopener,noreferrer");
                          }}
                          className="flex flex-1 items-center justify-center rounded-xl border border-white/12 bg-slate-950/50 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/18 hover:bg-slate-900/70 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Open in new tab
                        </button>
                        <button
                          type="button"
                          disabled={!htmlObjectUrl}
                          onClick={() => {
                            if (!htmlObjectUrl) return;
                            const a = document.createElement("a");
                            a.href = htmlObjectUrl;
                            a.download = `pagematch-landing-${Date.now()}.html`;
                            a.rel = "noopener";
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }}
                          className="flex flex-1 items-center justify-center rounded-xl border border-white/12 bg-slate-800/60 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-slate-800/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Download HTML
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-20 border-t border-white/10 pt-12">
          <p className="text-center text-sm font-medium text-slate-500">
            Powered by modern web technologies
          </p>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/50 py-9 shadow-[0_-8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 text-center text-sm text-slate-500 sm:px-6">
          <p>© {new Date().getFullYear()} PageMatch</p>
        </div>
      </footer>
    </div>
  );
}
