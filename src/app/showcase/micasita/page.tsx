export default function MicasitaShowcase() {
  return (
    <main
      style={{
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        background:
          'radial-gradient(circle at 20% 10%, #e8edff 0%, transparent 35%), radial-gradient(circle at 80% 0%, #ffe6f2 0%, transparent 35%), linear-gradient(160deg, #f9fbff 0%, #ffffff 100%)',
        color: '#1f1f2e',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '20px 16px 40px' }}>
        <header
          style={{
            borderRadius: 20,
            padding: 18,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid #e8edff',
            boxShadow: '0 10px 24px rgba(31,31,46,0.08)',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#4451d6', letterSpacing: 0.4 }}>PROTOTIPO WEB PROFESIONAL</p>
              <h1 style={{ margin: '4px 0 6px', fontSize: 34, lineHeight: 1.05 }}>Mi Casita Restaurant</h1>
              <p style={{ margin: 0, color: '#5c6485' }}>Mock website por Caribe Code PR para evaluar presencia digital.</p>
            </div>
            <a
              href="tel:9392164177"
              style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg,#4451d6,#8b5cf6)',
                color: 'white',
                padding: '10px 14px',
                borderRadius: 12,
                fontWeight: 700,
                boxShadow: '0 8px 16px rgba(68,81,214,.24)',
              }}
            >
              Contactar a Danny
            </a>
          </div>

          <nav style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['Inicio', 'Menú', 'Direcciones', 'Reservas', 'Contacto'].map((item) => (
              <span
                key={item}
                style={{
                  fontSize: 13,
                  padding: '7px 12px',
                  borderRadius: 999,
                  background: '#f2f5ff',
                  border: '1px solid #e1e8ff',
                  color: '#39406a',
                  fontWeight: 600,
                }}
              >
                {item}
              </span>
            ))}
          </nav>
        </header>

        <img
          src="/showcase/micasita/social1.png"
          alt="Vista del restaurante"
          style={{ width: '100%', borderRadius: 20, boxShadow: '0 12px 24px rgba(20,20,40,.12)', marginBottom: 16, objectFit: 'cover', maxHeight: 420 }}
        />

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <article style={{ borderRadius: 16, padding: 16, background: 'white', border: '1px solid #ebefff', boxShadow: '0 8px 20px rgba(31,31,46,.06)' }}>
            <h3 style={{ marginTop: 0 }}>Sobre el negocio</h3>
            <p style={{ marginBottom: 0, color: '#59607d' }}>
              Restaurante familiar en Isla Verde con cocina puertorriqueña, atención cercana y presencia activa en redes sociales.
            </p>
          </article>

          <article style={{ borderRadius: 16, padding: 16, background: 'white', border: '1px solid #ebefff', boxShadow: '0 8px 20px rgba(31,31,46,.06)' }}>
            <h3 style={{ marginTop: 0 }}>Información clave</h3>
            <p style={{ margin: '0 0 6px', color: '#59607d' }}>Teléfono: (787) 242-4075</p>
            <p style={{ margin: 0, color: '#59607d' }}>Email: micasitarest.pr@gmail.com</p>
          </article>
        </section>

        <section style={{ borderRadius: 18, padding: 18, background: 'white', border: '1px solid #ebefff', boxShadow: '0 10px 22px rgba(31,31,46,.07)' }}>
          <h3 style={{ marginTop: 0 }}>Secciones sugeridas del website</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#4f5676', lineHeight: 1.75 }}>
            <li>Menú digital organizado por categorías</li>
            <li>Botón de direcciones y mapa integrado</li>
            <li>Reservas o pedidos por WhatsApp</li>
            <li>Promociones semanales y testimonios de clientes</li>
          </ul>
        </section>

        <footer style={{ marginTop: 18, color: '#5b6283', fontSize: 14 }}>
          Demo comercial preparado por <strong>Danny Santiago · Caribe Code PR</strong> · 939-216-4177 · Caribecodepr@gmail.com
        </footer>
      </div>
    </main>
  )
}
