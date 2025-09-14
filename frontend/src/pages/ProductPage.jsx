import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import PreorderModal from '../components/PreorderModal.jsx';

export default function ProductPage() {
  const { sku } = useParams();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    // Try /:sku, fallback to list-filter (works for both sku and _id)
    api.get(`/api/products/${sku}`)
      .then(res => setP(res.data))
      .catch(async () => {
        const { data } = await api.get('/api/products');
        const found = (data || []).find(x =>
          (x.sku === sku) || (x.ProductID === sku) || (x.productId === sku) || (String(x._id) === sku)
        );
        setP(found || null);
      });
    window.scrollTo(0, 0);
  }, [sku]);

  const images = useMemo(() => (p?.images || p?.imageUrls || p?.ImageURLs || []), [p]);
  const collection = p?.collection || p?.collectionName || p?.Collection || 'Collection';

  const preorder = () => (!user ? nav('/login') : setShowModal(true));

  if (!p) return <div className="page-wrap"><p>Loading…</p></div>;

  return (
    <div className="page-wrap product-page">
      <nav className="crumbs">
        <Link to="/">Home</Link> <span>›</span>
        <Link to={`/collections/${encodeURIComponent(collection)}`}>{collection}</Link> <span>›</span>
        <span>{p.name}</span>
      </nav>

      <div className="prod-layout">
        <div className="gallery">
          <div className="stage">
            <img src={images[active] || '/images/placeholder-1.jpg'} alt={p.name} />
          </div>
          <div className="thumbs">
            {images.map((src, i) => (
              <button key={i} className={`thumb ${active===i?'active':''}`} onClick={()=>setActive(i)}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="details">
          <h1 className="title">{p.name}</h1>
          <div className="price">${p.price}</div>
          <p className="desc">{p.description}</p>

          <div className="option-row">
            <label>Size</label>
            <div className="chips">{(p.sizes||[]).map(s => <span key={s} className="chip">{s}</span>)}</div>
          </div>
          <div className="option-row">
            <label>Color</label>
            <div className="chips">{(p.colors||[]).map(c => <span key={c} className="chip">{c}</span>)}</div>
          </div>

          <div className="cta-row">
            <button className="btn-solid wide" onClick={preorder}>PRE-ORDER</button>
            <div className="tiny muted">Trending: {Math.floor(Math.random()*20)+3} pre-orders</div>
          </div>
        </div>
      </div>

      {showModal && (
        <PreorderModal
          product={{ sku: p.sku || p.ProductID || p.productId || p._id, ...p }}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); alert('Pre-order placed!'); }}
        />
      )}
    </div>
  );
}
<div className="thumbs" style={{display:'flex', gap:8, overflowX:'auto', padding:'8px 0'}}>
  {p.images?.map((src, i) => (
    <button key={src} onClick={()=>setActive(i)} style={{
      flex:'0 0 auto', width:64, height:80, borderRadius:10, overflow:'hidden',
      border: i===active ? '2px solid #111' : '1px solid #e6e6e6', padding:0, background:'#fff'
    }}>
      <img src={src} alt="" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
    </button>
  ))}
  <div className="sticky-cta">
  <button className="btn-solid" onClick={preorder}>Pre-order</button>
</div>

</div>
