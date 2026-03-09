export default function MusaShowcase() {
  return (
    <main style={{minHeight:'100vh',fontFamily:'Inter,system-ui',background:'linear-gradient(145deg,#0c1022,#1b1240 45%,#2a0f2e)',color:'#f7f8ff'}}>
      <div style={{maxWidth:980,margin:'0 auto',padding:'32px 16px 48px'}}>
        <section style={{padding:24,borderRadius:24,background:'rgba(255,255,255,0.08)',boxShadow:'0 20px 40px rgba(0,0,0,.35)',backdropFilter:'blur(10px)'}}>
          <p style={{margin:0,color:'#80eaff',fontWeight:700,letterSpacing:.6}}>FUTURE-READY WEBSITE CONCEPT</p>
          <h1 style={{margin:'8px 0 4px',fontSize:40}}>MUSA · San Juan</h1>
          <p style={{margin:0,color:'#ccd0ff'}}>High-impact visual brand, promo engine, and conversion-first mobile UX.</p>
        </section>

        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginTop:16}}>
          <img src="/showcase/musa/social2.jpg" alt="MUSA social" style={{width:'100%',borderRadius:18,objectFit:'cover',minHeight:280,boxShadow:'0 14px 30px rgba(0,0,0,.35)'}}/>
          <div style={{display:'grid',gap:14}}>
            <img src="/showcase/musa/social3.jpg" alt="MUSA social 2" style={{width:'100%',borderRadius:18,objectFit:'cover',minHeight:132}}/>
            <img src="/showcase/musa/social4.jpg" alt="MUSA social 3" style={{width:'100%',borderRadius:18,objectFit:'cover',minHeight:132}}/>
          </div>
        </div>

        <section style={{marginTop:16,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
          <article style={{background:'rgba(255,255,255,.08)',padding:16,borderRadius:16}}><h3 style={{marginTop:0}}>What we build</h3><p style={{margin:0,color:'#d6dbff'}}>Custom website, customer login portal, rewards logic, promo campaigns, analytics dashboard.</p></article>
          <article style={{background:'rgba(255,255,255,.08)',padding:16,borderRadius:16}}><h3 style={{marginTop:0}}>Marketing boost</h3><p style={{margin:0,color:'#d6dbff'}}>Social proof blocks, influencer/tag section, offer countdowns, and retargeting-ready pages.</p></article>
          <article style={{background:'rgba(255,255,255,.08)',padding:16,borderRadius:16}}><h3 style={{marginTop:0}}>Contact</h3><p style={{margin:0,color:'#d6dbff'}}>Danny Santiago · Caribe Code PR<br/>939-216-4177 · Caribecodepr@gmail.com</p></article>
        </section>
      </div>
    </main>
  )
}
