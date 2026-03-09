export default function MicasitaShowcase() {
  return (
    <main style={{fontFamily:'Arial, sans-serif',maxWidth:900,margin:'0 auto',padding:'40px 20px',lineHeight:1.5}}>
      <h1 style={{fontSize:42,marginBottom:8}}>Mi Casita Restaurant</h1>
      <p style={{color:'#555',marginBottom:20}}>Sample website concept by <strong>Caribe Code PR</strong></p>

      <img
        src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop"
        alt="Restaurant sample"
        style={{width:'100%',borderRadius:14,marginBottom:22}}
      />

      <section style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
        <div style={{padding:16,border:'1px solid #ddd',borderRadius:12}}>
          <h3>About</h3>
          <p>Family-friendly restaurant with authentic Puerto Rican food in Isla Verde, Carolina.</p>
        </div>
        <div style={{padding:16,border:'1px solid #ddd',borderRadius:12}}>
          <h3>Contact</h3>
          <p>Phone: (787) 242-4075<br/>Email: micasitarest.pr@gmail.com</p>
        </div>
      </section>

      <section style={{padding:18,border:'1px solid #ddd',borderRadius:12,background:'#fafafa'}}>
        <h3>What Caribe Code PR can build</h3>
        <ul>
          <li>Fast mobile-friendly website</li>
          <li>Menu and online ordering links</li>
          <li>Google Maps + WhatsApp contact button</li>
          <li>Instagram/Facebook feed integration</li>
        </ul>
      </section>

      <footer style={{marginTop:26,paddingTop:14,borderTop:'1px solid #eee',fontSize:14,color:'#444'}}>
        Built as a free demo by <strong>Danny Santiago · Caribe Code PR</strong><br/>
        Phone: 939-216-4177 · Email: Caribecodepr@gmail.com
      </footer>
    </main>
  )
}
