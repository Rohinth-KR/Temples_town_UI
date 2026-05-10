/* global React, Ico, StripeImg, tt, TT_DATA */
const { useState, useMemo } = React;

// ---------- SEARCH ----------
const SearchScreen = ({ go, searchCtx }) => {
  const [cityFilter, setCityFilter] = useState(searchCtx?.city || 'Pondicherry');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [activeAmenity, setActiveAmenity] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const matches = useMemo(() => TT_DATA.properties.filter(p => {
    if (cityFilter === 'Both cities') return p.from <= maxPrice;
    return p.city === cityFilter.toLowerCase() && p.from <= maxPrice;
  }).sort((a,b) => sortBy === 'Price' ? a.from - b.from : sortBy === 'Rating' ? b.rating - a.rating : 0),
  [cityFilter, maxPrice, sortBy]);
  const amenities = ['All', 'Pool', 'Sea view', 'Pet friendly', 'Workspace', 'Breakfast'];

  return (
    <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div style={{ marginBottom: 32 }}>
        <div className="tt-eyebrow">Stays</div>
        <h1 className="tt-h1" style={{ marginTop: 12, marginBottom: 0 }}>Find your stay in <span className="tt-italic-soft" style={{ color: 'var(--accent)' }}>{cityFilter}</span></h1>
      </div>

      <div className="tt-search">
        <div className="tt-search-cell">
          <span className="lbl">Where</span>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
            <option>Pondicherry</option><option>Bengaluru</option><option>Both cities</option>
          </select>
        </div>
        <div className="tt-search-cell"><span className="lbl">Check in</span><span className="val">{tt.fmtDate(searchCtx?.checkIn || '2026-05-12')}</span></div>
        <div className="tt-search-cell"><span className="lbl">Check out</span><span className="val">{tt.fmtDate(searchCtx?.checkOut || '2026-05-15')}</span></div>
        <div className="tt-search-cell"><span className="lbl">Guests</span><span className="val">{searchCtx?.guests || '2 guests · 1 room'}</span></div>
        <button className="tt-search-go"><Ico name="search" size={14}/> Update</button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {amenities.map(a => (
            <span key={a} onClick={() => setActiveAmenity(a)} className={`tt-chip ${activeAmenity === a ? 'tt-chip-active' : ''}`}>{a}</span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          <span>Up to {tt.inr(maxPrice)} / night</span>
          <input type="range" min="4000" max="15000" step="500" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} style={{ width: 140, accentColor: 'var(--ink)' }}/>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: '1px solid var(--line-strong)', background: 'transparent', borderRadius: 4, padding: '8px 14px', fontSize: 13 }}>
            <option>Recommended</option><option>Price</option><option>Rating</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 40, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 className="tt-h3" style={{ margin: 0 }}>{matches.length} stays · {tt.fmtDate(searchCtx?.checkIn)} → {tt.fmtDate(searchCtx?.checkOut)}</h2>
        <button className="tt-btn-link"><Ico name="pin" size={14}/> Map view</button>
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {matches.map(p => (
          <div key={p.id} className="tt-card" style={{ flexDirection: 'row', display: 'flex', alignItems: 'stretch' }} onClick={() => go('property', { propertyId: p.id })}>
            <div style={{ flex: '0 0 380px', position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
              <StripeImg label={p.placeholder} tone={p.tone} ratio="auto"/>
              <div className="tt-card-tags">
                <span className="tt-tag">{p.city === 'pondicherry' ? 'Pondicherry' : 'Bengaluru'}</span>
                <span className="tt-tag tt-tag-dark">★ {p.rating}</span>
              </div>
            </div>
            <div style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="tt-eyebrow" style={{ fontSize: 11 }}>{p.area}</div>
                <h3 className="tt-h3" style={{ marginTop: 8, marginBottom: 8 }}>{p.name}</h3>
                <p style={{ color: 'var(--text-soft)', margin: 0, fontSize: 15, lineHeight: 1.55 }}>{p.blurb}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                  <span className="tt-chip tt-chip-blue" style={{ cursor: 'default' }}>Free cancel · 48h</span>
                  <span className="tt-chip tt-chip-tonal" style={{ cursor: 'default' }}>Wi-Fi</span>
                  <span className="tt-chip tt-chip-tonal" style={{ cursor: 'default' }}>Breakfast</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
                <span className="tt-muted" style={{ fontSize: 13 }}>{tt.nightsBetween(searchCtx?.checkIn, searchCtx?.checkOut) || 3} nights · taxes incl.</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{tt.inr(p.from)} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}>/ night</span></div>
                  <button className="tt-btn tt-btn-primary tt-btn-sm" style={{ marginTop: 8 }}>View rooms <Ico name="arrow" size={14}/></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {matches.length === 0 && <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>No stays match these filters yet. Try widening the budget.</div>}
      </div>
    </div>
  );
};
window.SearchScreen = SearchScreen;

// ---------- PROPERTY ----------
const PropertyScreen = ({ go, params, searchCtx, user, openSignIn, startBooking }) => {
  const property = TT_DATA.properties.find(p => p.id === params.propertyId);
  const rooms = TT_DATA.rooms[property.id] || [];
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.id);
  const room = rooms.find(r => r.id === selectedRoom);
  const onBook = () => { if (!user) return openSignIn(); startBooking({ property, room }); };
  const nights = tt.nightsBetween(searchCtx?.checkIn, searchCtx?.checkOut) || 3;

  return (
    <div className="tt-page" style={{ paddingTop: 32, paddingBottom: 96 }}>
      <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        <span style={{ cursor: 'pointer' }} onClick={() => go('home')}>Stays</span><span>/</span>
        <span style={{ cursor: 'pointer' }} onClick={() => go('search')}>{property.city === 'pondicherry' ? 'Pondicherry' : 'Bengaluru'}</span><span>/</span>
        <span style={{ color: 'var(--ink)' }}>{property.name}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="tt-eyebrow">{property.area}</div>
          <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>{property.name}</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 12, color: 'var(--text-soft)', fontSize: 15 }}>
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Ico name="star" size={13}/> {property.rating} · {property.reviews} reviews</span>
            <span>·</span><span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><Ico name="pin" size={14}/> {property.area}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="tt-btn tt-btn-ghost tt-btn-sm">Share</button>
          <button className="tt-btn tt-btn-ghost tt-btn-sm">Save</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8, height: 520, borderRadius: 6, overflow: 'hidden' }}>
        <StripeImg label={property.placeholder} tone={property.tone} ratio="auto"/>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
          <StripeImg label="bedroom" tone="oklch(0.9 0.04 220)" ratio="auto"/>
          <StripeImg label="bathroom" tone="oklch(0.92 0.03 200)" ratio="auto"/>
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
          <StripeImg label="lobby" tone="oklch(0.91 0.04 245)" ratio="auto"/>
          <StripeImg label="garden" tone="oklch(0.93 0.03 215)" ratio="auto"/>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 64, marginTop: 64 }}>
        <div>
          <h2 className="tt-h2" style={{ marginTop: 0 }}>{property.blurb}</h2>
          <p style={{ color: 'var(--text-soft)', fontSize: 17, lineHeight: 1.6, marginTop: 16 }}>
            Hosted by Anika &amp; Ravi. Rooms are kept in small numbers — typically two to six per property — so service feels personal. Breakfast is local and seasonal. Check-in any time after 14:00; late arrivals welcome with notice.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 32 }}>
            {[
              { i: 'wifi', t: 'High-speed Wi-Fi', d: 'Mesh coverage everywhere, fibre uplink' },
              { i: 'sun', t: 'Garden & courtyard', d: 'Open until 22:00, lit at dusk' },
              { i: 'shield', t: 'Verified host', d: 'Personally approved by our team' },
              { i: 'gift', t: 'Welcome amenity', d: 'A small gift from the city, every stay' },
            ].map(a => (
              <div key={a.t} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', borderTop: '1px solid var(--line)', paddingTop: 18 }}>
                <Ico name={a.i} size={20}/>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.t}</div>
                  <div className="tt-muted" style={{ fontSize: 13, marginTop: 4 }}>{a.d}</div>
                </div>
              </div>
            ))}
          </div>

          <hr className="tt-hr" style={{ marginTop: 48 }}/>

          <h3 className="tt-h2" style={{ marginTop: 0 }}>Choose a room</h3>
          <p className="tt-muted" style={{ marginTop: 4, fontSize: 14 }}>Real-time availability for your selected dates.</p>
          <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
            {rooms.map(r => (
              <label key={r.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr auto', gap: 24, alignItems: 'center', padding: 16, borderRadius: 6, border: `1px solid ${selectedRoom === r.id ? 'var(--ink)' : 'var(--line)'}`, background: selectedRoom === r.id ? 'var(--bg-soft)' : '#fff', cursor: 'pointer' }}>
                <div style={{ borderRadius: 4, overflow: 'hidden', height: 96 }}>
                  <StripeImg label="bedroom" tone={`oklch(0.9 0.04 ${210 + rooms.indexOf(r)*8})`} ratio="auto"/>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 17 }}>{r.type}</div>
                  <div className="tt-muted" style={{ fontSize: 13, marginTop: 4 }}>{r.beds} · {r.size} · up to {r.capacity} guests</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {r.amenities.slice(0,3).map(a => <span key={a} className="tt-chip tt-chip-tonal" style={{ fontSize: 11, padding: '4px 10px' }}>{a}</span>)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <input type="radio" name="room" checked={selectedRoom === r.id} onChange={() => setSelectedRoom(r.id)} style={{ position: 'absolute', opacity: 0 }}/>
                  <div style={{ fontSize: 19, fontWeight: 600 }}>{tt.inr(r.price)}</div>
                  <div className="tt-muted" style={{ fontSize: 12 }}>per night</div>
                </div>
              </label>
            ))}
          </div>

          <hr className="tt-hr" style={{ marginTop: 48 }}/>

          <h3 className="tt-h2" style={{ marginTop: 0 }}>What guests are saying</h3>
          <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
            {TT_DATA.reviews.map(rv => (
              <div key={rv.name} style={{ padding: 24, background: 'var(--bg-soft)', borderRadius: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 }}>{rv.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{rv.name}</div>
                      <div className="tt-muted" style={{ fontSize: 12 }}>{rv.tier} · {rv.when}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>{Array.from({length: rv.rating}).map((_,i) => <Ico key={i} name="star" size={13}/>)}</div>
                </div>
                <p style={{ margin: '12px 0 0', color: 'var(--text-soft)', fontSize: 15, lineHeight: 1.6 }}>{rv.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="tt-summary">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>From</div>
            <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4, color: 'var(--ink)' }}>{tt.inr(room?.price || property.from)}<span style={{ fontSize: 15, fontWeight: 400, color: 'var(--text-muted)' }}> / night</span></div>

            <div style={{ marginTop: 20, border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <div style={{ padding: 14, borderRight: '1px solid var(--line)' }}>
                  <div className="tt-muted" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Check in</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{tt.fmtDate(searchCtx?.checkIn || '2026-05-12')}</div>
                </div>
                <div style={{ padding: 14 }}>
                  <div className="tt-muted" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Check out</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{tt.fmtDate(searchCtx?.checkOut || '2026-05-15')}</div>
                </div>
              </div>
              <div style={{ padding: 14, borderTop: '1px solid var(--line)' }}>
                <div className="tt-muted" style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Guests</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{searchCtx?.guests || '2 guests · 1 room'}</div>
              </div>
            </div>

            <button className="tt-btn tt-btn-primary tt-btn-lg tt-w-full" style={{ marginTop: 20 }} onClick={onBook}>
              Request to book <Ico name="arrow" size={14}/>
            </button>
            <p className="tt-muted" style={{ fontSize: 12, textAlign: 'center', marginTop: 12 }}>You won&rsquo;t be charged yet · Host approves first</p>
            <hr className="tt-hr"/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">{tt.inr(room?.price || 0)} × {nights} nights</span><span>{tt.inr((room?.price || 0) * nights)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Hosting fee</span><span>{tt.inr(450)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Taxes (GST 12%)</span><span>{tt.inr((room?.price || 0) * nights * 0.12)}</span></div>
              <hr className="tt-hr" style={{ margin: '8px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 16 }}><span>Total (INR)</span><span>{tt.inr((room?.price || 0) * nights * 1.12 + 450)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
window.PropertyScreen = PropertyScreen;
