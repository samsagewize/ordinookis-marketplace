export default function HospitalUprShowcase() {
  const navItem = {
    display: 'block',
    padding: '10px 12px',
    borderRadius: 10,
    color: '#d8dff6',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    background: '#1f2637',
    border: '1px solid #303a51',
    marginBottom: 8,
  } as const

  return (
    <main style={{minHeight:'100vh', paddingBottom:90, fontFamily:'Inter,system-ui,Arial,sans-serif', background:'linear-gradient(165deg,#0f1117,#1a2233 50%,#111827)', color:'#edf2ff'}}>
      <div style={{maxWidth:980, margin:'0 auto', padding:'16px 14px 30px'}}>
        <header style={{borderRadius:20,padding:14,background:'rgba(17,23,35,.86)',border:'1px solid #2f3a54',boxShadow:'0 18px 34px rgba(0,0,0,.35)',marginBottom:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
            <div>
              <h1 style={{margin:'0 0 4px',fontSize:28,lineHeight:1.08,color:'#f6f8ff'}}>Hospital UPR Dr. Federico Trilla</h1>
              <p style={{margin:0,color:'#b8c3e6',fontSize:13}}>Carolina, Puerto Rico · Servicios de salud</p>
            </div>
            <details style={{position:'relative'}}>
              <summary style={{listStyle:'none',cursor:'pointer',width:44,height:44,borderRadius:12,border:'1px solid #2f3a54',background:'#151b2a',boxShadow:'0 8px 18px rgba(0,0,0,.35)',display:'grid',placeItems:'center'}}>
                <span style={{ display: 'block', width: 18, height: 2, background: '#dbe6ff', boxShadow: '0 6px 0 #dbe6ff, 0 -6px 0 #dbe6ff' }} />
              </summary>
              <div style={{position:'absolute',right:0,top:52,width:230,padding:10,borderRadius:14,background:'#131a29',border:'1px solid #2f3a54',boxShadow:'0 16px 34px rgba(0,0,0,.42)',zIndex:20}}>
                <a href="#inicio" style={navItem}>Inicio</a>
                <a href="#servicios" style={navItem}>Servicios</a>
                <a href="#ubicacion" style={navItem}>Ubicación</a>
                <a href="#contacto" style={navItem}>Contacto</a>
                <a href="#soporte" style={navItem}>Soporte TI</a>
              </div>
            </details>
          </div>
        </header>

        <section id="inicio" style={{borderRadius:18,padding:18,background:'rgba(17,23,35,.86)',border:'1px solid #2f3a54',boxShadow:'0 16px 28px rgba(0,0,0,.32)',marginBottom:12}}>
          <h2 style={{marginTop:0,color:'#f8fbff'}}>Atención clínica con respaldo tecnológico</h2>
          <p style={{margin:0,color:'#c6d0ec',lineHeight:1.7}}>Plataforma web institucional enfocada en información clara, rutas de contacto y accesos rápidos para pacientes y personal.</p>
        </section>

        <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginBottom:12}}>
          <article id="servicios" style={{borderRadius:16,padding:14,background:'#151d2d',border:'1px solid #2f3a54',boxShadow:'0 10px 22px rgba(0,0,0,.24)'}}>
            <h3 style={{margin:'0 0 8px'}}>Servicios</h3>
            <p style={{margin:0,color:'#c6d0ec',fontSize:14,lineHeight:1.6}}>Información de especialidades, horarios, orientación y canales de atención centralizados.</p>
          </article>
          <article id="contacto" style={{borderRadius:16,padding:14,background:'#151d2d',border:'1px solid #2f3a54',boxShadow:'0 10px 22px rgba(0,0,0,.24)'}}>
            <h3 style={{margin:'0 0 8px'}}>Contacto</h3>
            <p style={{margin:'0 0 6px',color:'#c6d0ec',fontSize:14}}>Call Center: (787) 476-4135</p>
            <p style={{margin:0,color:'#c6d0ec',fontSize:14}}>Email: info@hospitalupr.org</p>
          </article>
        </section>

        <section id="ubicacion" style={{borderRadius:16,padding:16,background:'#151d2d',border:'1px solid #2f3a54',boxShadow:'0 12px 24px rgba(0,0,0,.28)',marginBottom:12}}>
          <h3 style={{marginTop:0}}>Ubicación</h3>
          <p style={{margin:'0 0 10px',color:'#c6d0ec',fontSize:14}}>Carretera 3 km 8.3 Ave 65 de Infantería, Carolina, Puerto Rico.</p>
          <a href="https://maps.google.com/?q=Hospital+UPR+Dr+Federico+Trilla" style={{textDecoration:'none',display:'inline-block',background:'#3b82f6',color:'#fff',padding:'10px 14px',borderRadius:10,fontWeight:700,boxShadow:'0 10px 18px rgba(59,130,246,.28)'}}>Abrir en Google Maps</a>
        </section>

        <section id="soporte" style={{borderRadius:16,padding:16,background:'#151d2d',border:'1px solid #2f3a54',boxShadow:'0 12px 24px rgba(0,0,0,.28)'}}>
          <h3 style={{marginTop:0}}>Opciones digitales sugeridas</h3>
          <ul style={{margin:0,paddingLeft:18,color:'#c6d0ec',lineHeight:1.75,fontSize:14}}>
            <li>Portal de información para pacientes y familiares</li>
            <li>Canales directos de orientación y contacto</li>
            <li>Integración de procesos de soporte TI y automatización</li>
            <li>Secciones optimizadas para móvil y respuesta rápida</li>
          </ul>
        </section>
      </div>

      <div style={{position:'fixed',left:12,right:12,bottom:12,background:'rgba(17,23,35,.92)',border:'1px solid #2f3a54',borderRadius:14,padding:10,boxShadow:'0 16px 28px rgba(0,0,0,.32)',display:'flex',gap:10,justifyContent:'space-between',zIndex:50}}>
        <a href="#servicios" style={{flex:1,textAlign:'center',textDecoration:'none',padding:'10px 8px',borderRadius:10,background:'#1f2637',color:'#dbe6ff',fontWeight:700,fontSize:13}}>Servicios</a>
        <a href="#ubicacion" style={{flex:1,textAlign:'center',textDecoration:'none',padding:'10px 8px',borderRadius:10,background:'#1f2637',color:'#dbe6ff',fontWeight:700,fontSize:13}}>Ubicación</a>
        <a href="https://wa.me/19392164177" style={{flex:1,textAlign:'center',textDecoration:'none',padding:'10px 8px',borderRadius:10,background:'#16a34a',color:'#fff',fontWeight:800,fontSize:13}}>WhatsApp</a>
      </div>
    </main>
  )
}
