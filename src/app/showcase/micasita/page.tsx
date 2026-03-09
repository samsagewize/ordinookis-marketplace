export default function MicasitaShowcase() {
  const navItem = {
    display: 'block',
    padding: '10px 12px',
    borderRadius: 10,
    color: '#2e365f',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    background: '#f5f7ff',
    border: '1px solid #e7ecff',
    marginBottom: 8,
  } as const

  return (
    <main
      style={{
        minHeight: '100vh',
        paddingBottom: 90,
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        background:
          'radial-gradient(circle at 20% 10%, #e9f1ff 0%, transparent 34%), radial-gradient(circle at 80% 0%, #ffe8f4 0%, transparent 36%), linear-gradient(160deg, #f9fbff 0%, #ffffff 100%)',
        color: '#1f2442',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '16px 14px 30px' }}>
        <header
          style={{
            borderRadius: 20,
            padding: 14,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid #e7ecff',
            boxShadow: '0 18px 34px rgba(47,56,110,0.12)',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 28, lineHeight: 1.08 }}>Mi Casita Restaurant</h1>
              <p style={{ margin: 0, color: '#5f6790', fontSize: 13 }}>Isla Verde, Carolina · Cocina puertorriqueña</p>
            </div>

            <details style={{ position: 'relative' }}>
              <summary
                style={{
                  listStyle: 'none',
                  cursor: 'pointer',
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: '1px solid #e3e9ff',
                  background: '#ffffff',
                  boxShadow: '0 8px 18px rgba(63,75,146,.16)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <span style={{ display: 'block', width: 18, height: 2, background: '#3e4ab8', boxShadow: '0 6px 0 #3e4ab8, 0 -6px 0 #3e4ab8' }} />
              </summary>
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 52,
                  width: 210,
                  padding: 10,
                  borderRadius: 14,
                  background: '#ffffff',
                  border: '1px solid #e7ecff',
                  boxShadow: '0 16px 34px rgba(47,56,110,.18)',
                  zIndex: 20,
                }}
              >
                <a href="#inicio" style={navItem}>Inicio</a>
                <a href="#menu" style={navItem}>Menú</a>
                <a href="#direcciones" style={navItem}>Direcciones</a>
                <a href="#reservas" style={navItem}>Reservas</a>
                <a href="#contacto" style={navItem}>Contacto</a>
              </div>
            </details>
          </div>
        </header>

        <section id="inicio" style={{ position: 'relative', marginBottom: 14 }}>
          <img
            src="/showcase/micasita/social1.png"
            alt="Vista del restaurante"
            style={{ width: '100%', borderRadius: 20, objectFit: 'cover', maxHeight: 430, boxShadow: '0 18px 32px rgba(41,49,104,.16)' }}
          />
          <div
            style={{
              position: 'absolute',
              left: 14,
              bottom: 14,
              right: 14,
              borderRadius: 14,
              background: 'rgba(20,25,52,.64)',
              backdropFilter: 'blur(6px)',
              padding: '10px 12px',
              color: '#f4f6ff',
              boxShadow: '0 10px 22px rgba(0,0,0,.24)',
            }}
          >
            <strong style={{ fontSize: 15 }}>Sabor criollo en el corazón de Isla Verde</strong>
            <div style={{ fontSize: 13, opacity: 0.92 }}>Atención familiar · Ambiente acogedor · Alta actividad en redes</div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 14 }}>
          <article style={{ borderRadius: 16, padding: 14, background: '#fff', border: '1px solid #e8edff', boxShadow: '0 10px 22px rgba(41,49,104,.08)' }}>
            <h3 style={{ margin: '0 0 8px' }}>Sobre nosotros</h3>
            <p style={{ margin: 0, color: '#5f6790', lineHeight: 1.6, fontSize: 14 }}>
              Restaurante familiar con platos puertorriqueños, ideal para turistas y locales que buscan buena comida y servicio consistente.
            </p>
          </article>

          <article id="contacto" style={{ borderRadius: 16, padding: 14, background: '#fff', border: '1px solid #e8edff', boxShadow: '0 10px 22px rgba(41,49,104,.08)' }}>
            <h3 style={{ margin: '0 0 8px' }}>Contacto</h3>
            <p style={{ margin: '0 0 6px', color: '#5f6790', fontSize: 14 }}>Teléfono: (787) 242-4075</p>
            <p style={{ margin: 0, color: '#5f6790', fontSize: 14 }}>Email: micasitarest.pr@gmail.com</p>
          </article>
        </section>

        <section id="menu" style={{ borderRadius: 16, padding: 16, background: '#fff', border: '1px solid #e8edff', boxShadow: '0 12px 24px rgba(41,49,104,.10)', marginBottom: 12 }}>
          <h3 style={{ marginTop: 0 }}>Menú destacado</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
            {['Mofongo de la casa', 'Pollo guisado', 'Arroz con habichuelas', 'Flan de vainilla'].map((item) => (
              <div key={item} style={{ borderRadius: 12, background: '#f7f9ff', border: '1px solid #e7ecff', padding: '10px 12px', color: '#3e4670', fontWeight: 600, fontSize: 14 }}>
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="direcciones" style={{ borderRadius: 16, padding: 16, background: '#fff', border: '1px solid #e8edff', boxShadow: '0 12px 24px rgba(41,49,104,.10)', marginBottom: 12 }}>
          <h3 style={{ marginTop: 0 }}>Direcciones</h3>
          <p style={{ margin: '0 0 10px', color: '#5f6790', fontSize: 14 }}>Plazoleta de Isla Verde, Carolina, Puerto Rico.</p>
          <a href="https://maps.google.com/?q=Mi+Casita+Restaurant+Isla+Verde" style={{ textDecoration: 'none', display: 'inline-block', background: '#4254d6', color: '#fff', padding: '10px 14px', borderRadius: 10, fontWeight: 700, boxShadow: '0 10px 18px rgba(66,84,214,.26)' }}>
            Abrir en Google Maps
          </a>
        </section>

        <section id="reservas" style={{ borderRadius: 16, padding: 16, background: '#fff', border: '1px solid #e8edff', boxShadow: '0 12px 24px rgba(41,49,104,.10)' }}>
          <h3 style={{ marginTop: 0 }}>Reservas y pedidos</h3>
          <p style={{ margin: '0 0 10px', color: '#5f6790', fontSize: 14 }}>Atención rápida por WhatsApp para reservas, pedidos y consultas.</p>
          <a href="https://wa.me/17872424075" style={{ textDecoration: 'none', display: 'inline-block', background: '#16a34a', color: '#fff', padding: '10px 14px', borderRadius: 10, fontWeight: 700, boxShadow: '0 10px 18px rgba(22,163,74,.28)' }}>
            Reservar por WhatsApp
          </a>
        </section>
      </div>

      <div
        style={{
          position: 'fixed',
          left: 12,
          right: 12,
          bottom: 12,
          background: 'rgba(255,255,255,.92)',
          border: '1px solid #e7ecff',
          borderRadius: 14,
          padding: 10,
          boxShadow: '0 16px 28px rgba(41,49,104,.16)',
          display: 'flex',
          gap: 10,
          justifyContent: 'space-between',
          zIndex: 50,
        }}
      >
        <a href="#menu" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '10px 8px', borderRadius: 10, background: '#f3f6ff', color: '#32408f', fontWeight: 700, fontSize: 13 }}>Menú</a>
        <a href="#direcciones" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '10px 8px', borderRadius: 10, background: '#f3f6ff', color: '#32408f', fontWeight: 700, fontSize: 13 }}>Direcciones</a>
        <a href="https://wa.me/17872424075" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '10px 8px', borderRadius: 10, background: '#16a34a', color: '#fff', fontWeight: 800, fontSize: 13 }}>WhatsApp</a>
      </div>
    </main>
  )
}
