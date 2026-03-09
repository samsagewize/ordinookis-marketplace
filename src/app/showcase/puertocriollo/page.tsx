export default function PuertoCriolloShowcase() {
  return (
    <main style={{minHeight:'100vh',fontFamily:'Inter,system-ui',background:'radial-gradient(circle at 10% 10%,#ffe6b2,transparent 30%),radial-gradient(circle at 90% 0,#ffd1f1,transparent 35%),linear-gradient(160deg,#fffaf0,#f3f6ff)',color:'#1e2141'}}>
      <div style={{maxWidth:980,margin:'0 auto',padding:'30px 16px 46px'}}>
        <header style={{background:'rgba(255,255,255,.82)',borderRadius:24,padding:22,boxShadow:'0 14px 30px rgba(34,34,66,.12)'}}>
          <p style={{margin:0,color:'#7d3cff',fontWeight:700}}>PREMIUM WEBSITE PROPOSAL</p>
          <h1 style={{margin:'8px 0 6px',fontSize:38}}>Puerto Criollo · Old San Juan</h1>
          <p style={{margin:0,color:'#5f6488'}}>A stylish, mobile-first website that converts social buzz into reservations and repeat customers.</p>
        </header>

        <div style={{marginTop:16,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
          <img src="/showcase/puertocriollo/social1.jpg" alt="Puerto Criollo 1" style={{width:'100%',borderRadius:16,minHeight:220,objectFit:'cover'}}/>
          <img src="/showcase/puertocriollo/social2.jpg" alt="Puerto Criollo 2" style={{width:'100%',borderRadius:16,minHeight:220,objectFit:'cover'}}/>
          <img src="/showcase/puertocriollo/social3.jpg" alt="Puerto Criollo 3" style={{width:'100%',borderRadius:16,minHeight:220,objectFit:'cover'}}/>
        </div>

        <section style={{marginTop:16,padding:18,borderRadius:18,background:'#fff',boxShadow:'0 10px 24px rgba(40,44,90,.10)'}}>
          <h3 style={{marginTop:0}}>Included in your build</h3>
          <ul style={{margin:0,paddingLeft:18,lineHeight:1.7,color:'#4f5678'}}>
            <li>Fast landing page + menu + WhatsApp CTA</li>
            <li>Customer login area and rewards program</li>
            <li>Promo pages for events and seasonal specials</li>
            <li>Tag/hashtag section featuring real customer buzz</li>
          </ul>
        </section>

        <footer style={{marginTop:18,color:'#5b6187',fontSize:14}}>Prepared by <strong>Danny Santiago · Caribe Code PR</strong> · 939-216-4177 · Caribecodepr@gmail.com</footer>
      </div>
    </main>
  )
}
