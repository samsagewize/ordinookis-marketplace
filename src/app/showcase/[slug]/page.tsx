interface PageProps {
  params: { slug: string }
}

export default function GenericShowcase({ params }: PageProps) {
  const name = params.slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  const isFood = /(rest|restaurant|cafe|pizza|food|grill|bistro|bar)/i.test(params.slug)

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, Arial, sans-serif', background: isFood ? 'linear-gradient(160deg,#fff8f1,#ffffff)' : 'linear-gradient(165deg,#0f1117,#1a2233 50%,#111827)', color: isFood ? '#1f2442' : '#edf2ff', padding: '16px 14px 90px' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <header style={{ borderRadius: 18, padding: 14, background: isFood ? '#fff' : 'rgba(17,23,35,.86)', border: isFood ? '1px solid #e8edff' : '1px solid #2f3a54', boxShadow: isFood ? '0 14px 24px rgba(41,49,104,.10)' : '0 16px 30px rgba(0,0,0,.35)' }}>
          <h1 style={{ margin: 0, fontSize: 30 }}>{name}</h1>
          <p style={{ margin: '6px 0 0', opacity: 0.85 }}>Sitio web comercial con experiencia móvil optimizada.</p>
        </header>

        <section style={{ marginTop: 12, borderRadius: 16, padding: 16, background: isFood ? '#fff' : '#151d2d', border: isFood ? '1px solid #e8edff' : '1px solid #2f3a54' }}>
          <h3 style={{ marginTop: 0 }}>Secciones sugeridas</h3>
          <ul style={{ lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
            <li>Inicio</li>
            <li>{isFood ? 'Menú' : 'Servicios'}</li>
            <li>Direcciones</li>
            <li>Contacto</li>
            <li>WhatsApp rápido</li>
          </ul>
        </section>
      </div>
    </main>
  )
}
