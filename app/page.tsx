// Placeholder home — agents replace with brand-specific sections per the
// Penn Tech feature catalog memory (3D paintbrush hero, services scroll-lock,
// animated paint-flow workflow, process timeline, etc.).
export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center container-width text-center">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-primary-400 font-semibold mb-4">
          Soley Painting
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Brand-new site.{' '}
          <span className="gradient-text">Agents are building.</span>
        </h1>
        <p className="text-lg text-dark-300">
          Initial scaffold — the agent loop is iterating on this overnight.
        </p>
      </div>
    </section>
  )
}
