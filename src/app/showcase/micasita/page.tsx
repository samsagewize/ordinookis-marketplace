export default function MicasitaShowcase() {
  return (
    <main
      style={{
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        background:
          'radial-gradient(circle at 20% 10%, #ffd8e8 0%, transparent 35%), radial-gradient(circle at 80% 0%, #c4f1ff 0%, transparent 35%), linear-gradient(160deg, #fff7fb 0%, #f7fbff 100%)',
        color: '#1f1f2e',
      }}
    >
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '28px 16px 40px' }}>
        <header
          style={{
            borderRadius: 26,
            padding: 22,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 14px 34px rgba(31,31,46,0.08)',
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: '#7b43ff', letterSpacing: 0.4 }}>FREE LIVE DEMO</p>
              <h1 style={{ margin: '4px 0 6px', fontSize: 36, lineHeight: 1.05 }}>Mi Casita Restaurant</h1>
              <p style={{ margin: 0, color: '#555a7a' }}>
                Modern website concept by <strong>Caribe Code PR</strong>
              </p>
            </div>
            <a
              href="tel:9392164177"
              style={{
                alignSelf: 'start',
                textDecoration: 'none',
                background: 'linear-gradient(135deg,#7b43ff,#ff4f9a)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: 14,
                fontWeight: 700,
                boxShadow: '0 10px 20px rgba(123,67,255,.25)',
              }}
            >
              Call Danny
            </a>
          </div>
        </header>

        <img
          src="https://scontent.fsju2-1.fna.fbcdn.net/v/t39.30808-6/494590465_1316207097175671_6743565191557325707_n.jpg?stp=dst-jpg_s720x720_tt6&_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Qa7Jiso4jVkQ7kNvwHuNI0X&_nc_oc=AdkDaqY2TC8U8V-gQ5GUi_gV7A2Y09jNf8eA0Y8kQv8h6ylQZTd9B8x6T31mR6q6hZk&_nc_zt=23&_nc_ht=scontent.fsju2-1.fna&_nc_gid=j_mCrYGv8xTIWFCWPkk8yw&oh=00_AfwaQDRlrX4DtiZqS8x1CwDaO-RlLerffohK2xFAiqdDaw&oe=69B4667A"
          alt="Mi Casita social preview"
          style={{ width: '100%', borderRadius: 22, boxShadow: '0 16px 30px rgba(20,20,40,.12)', marginBottom: 18, objectFit: 'cover', maxHeight: 420 }}
        />

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <article style={{ borderRadius: 18, padding: 18, background: 'white', boxShadow: '0 8px 24px rgba(31,31,46,.07)' }}>
            <h3 style={{ marginTop: 0 }}>About</h3>
            <p style={{ marginBottom: 0, color: '#59607d' }}>
              Family-friendly Puerto Rican food in Isla Verde, with a warm local vibe and strong community presence.
            </p>
          </article>

          <article style={{ borderRadius: 18, padding: 18, background: 'white', boxShadow: '0 8px 24px rgba(31,31,46,.07)' }}>
            <h3 style={{ marginTop: 0 }}>Contact</h3>
            <p style={{ margin: '0 0 6px', color: '#59607d' }}>Phone: (787) 242-4075</p>
            <p style={{ margin: 0, color: '#59607d' }}>Email: micasitarest.pr@gmail.com</p>
          </article>
        </section>

        <section style={{ borderRadius: 22, padding: 20, background: 'white', boxShadow: '0 10px 28px rgba(31,31,46,.08)' }}>
          <h3 style={{ marginTop: 0 }}>What Caribe Code PR can build for them</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: '#4f5676', lineHeight: 1.7 }}>
            <li>Mobile-first design that feels premium</li>
            <li>Menu, delivery links, WhatsApp and Google Maps buttons</li>
            <li>Instagram/Facebook highlight sections</li>
            <li>Lead form + booking/contact CTA</li>
          </ul>
          <img
            src="https://scontent.fsju2-1.fna.fbcdn.net/v/t39.30808-1/264811409_2337286599747408_6364893800807308072_n.png?stp=dst-png&cstp=mx923x923&ctp=s720x720&_nc_cat=102&ccb=1-7&_nc_sid=3ab345&_nc_ohc=-3cDe9DDd_4Q7kNvwE4Wx8o&_nc_oc=AdkkHUT_QlrFs8nTyp4AWU6CytLL2JXH7f4emjWmK-O2wl_60p-3AeJbZBJt69ZLZpSnUzx00dr4XB62DwEFvalz&_nc_zt=24&_nc_ht=scontent.fsju2-1.fna&_nc_gid=ypR6jkETxCgWekmoWidjmQ&_nc_ss=8&oh=00_AfxL2s9Z99RifS045TO6RzVq6APzqIJqdNOwVGPW0d6tGg&oe=69B45F18"
            alt="Mi Casita logo from social"
            style={{ marginTop: 16, width: 120, height: 120, objectFit: 'cover', borderRadius: 18, border: '1px solid #eee' }}
          />
        </section>

        <footer style={{ marginTop: 20, color: '#5b6283', fontSize: 14 }}>
          Built as a sample by <strong>Danny Santiago · Caribe Code PR</strong> · 939-216-4177 · Caribecodepr@gmail.com
        </footer>
      </div>
    </main>
  )
}
