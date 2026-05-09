/* global React, Ico, StripeImg, tt, TT_DATA */
const { useState, useMemo } = React;

// ---------- BOOKINGS ----------
const BookingsScreen = ({ go, bookings }) => {
  const [tab, setTab] = useState('Upcoming');
  const list = bookings.filter(b => tab === 'Upcoming' ? b.state !== 'completed' : b.state === 'completed');
  const stateMeta = { awaiting: ['Awaiting host', '#dba049'], approved: ['Approved · pay now', '#1f8a5b'], confirmed: ['Confirmed', '#1f8a5b'], completed: ['Completed', '#7d8294'] };
  return (
    <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="tt-eyebrow">Account</div>
      <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>Your bookings</h1>
      <div style={{ display: 'flex', gap: 0, marginTop: 32, borderBottom: '1px solid var(--line)' }}>
        {['Upcoming','Past'].map(t => (
          <button key={t} onClick={() => setTab(t)} className="tt-btn-link" style={{ padding: '14px 20px', borderBottom: `2px solid ${tab === t ? 'var(--ink)' : 'transparent'}`, marginBottom: '-1px', fontWeight: tab === t ? 600 : 400, color: tab === t ? 'var(--ink)' : 'var(--text-muted)' }}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 16, marginTop: 32 }}>
        {list.length === 0 && <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Nothing here yet. <span style={{ color: 'var(--ink)', cursor: 'pointer' }} onClick={() => go('home')}>Find a stay →</span></div>}
        {list.map(b => (
          <div key={b.id} className="tt-card" style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }} onClick={() => go('flow', { bookingId: b.id })}>
            <div style={{ flex: '0 0 220px', position: 'relative' }}>
              <StripeImg label={b.property.placeholder} tone={b.property.tone} ratio="auto"/>
            </div>
            <div style={{ flex: 1, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="tt-eyebrow" style={{ fontSize: 11 }}>{b.id}</div>
                <h3 className="tt-h3" style={{ marginTop: 6, marginBottom: 6 }}>{b.property.name}</h3>
                <div className="tt-muted" style={{ fontSize: 14 }}>{tt.fmtDate(b.checkIn)} → {tt.fmtDate(b.checkOut)} · {b.guests}</div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 12, fontWeight: 600, color: stateMeta[b.state][1] }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: stateMeta[b.state][1] }}/>
                  {stateMeta[b.state][0]}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{tt.inr(b.total)}</div>
                <div className="tt-btn-link" style={{ marginTop: 8, fontSize: 13 }}>Manage →</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
window.BookingsScreen = BookingsScreen;

// ---------- LOYALTY ----------
const LoyaltyScreen = ({ go, user, bookings }) => {
  const points = bookings.filter(b => b.state === 'confirmed' || b.state === 'completed').reduce((s, b) => s + (b.nights || 3) * 10 + 5, 0) || 320;
  const tiers = [{ n: 'Bronze', min: 0, perks: 'Base rate · welcome amenity' }, { n: 'Silver', min: 500, perks: '5% off · early check-in' }, { n: 'Gold', min: 2000, perks: '10% off · priority queue · room upgrades' }];
  const current = tiers.slice().reverse().find(t => points >= t.min);
  const next = tiers.find(t => t.min > points);
  const pct = next ? Math.min(100, ((points - current.min) / (next.min - current.min)) * 100) : 100;
  return (
    <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96 }}>
      <div className="tt-eyebrow">Wayfarer Rewards</div>
      <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>Welcome back, <span className="tt-italic-soft" style={{ color: 'var(--accent)' }}>{user?.name?.split(' ')[0] || 'traveller'}</span></h1>
      <div style={{ background: '#0a1628', color: '#fff', borderRadius: 6, padding: 40, marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Current tier</div>
          <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 72, lineHeight: 1, marginTop: 8 }}>{current.n}</div>
          <div style={{ marginTop: 16, opacity: 0.85 }}>{current.perks}</div>
        </div>
        <div>
          <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Points balance</div>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1, marginTop: 8 }}>{points}</div>
          {next && <>
            <div style={{ marginTop: 24, opacity: 0.85, fontSize: 14 }}>{next.min - points} points to <b>{next.n}</b></div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: '#a4a6f0' }}/>
            </div>
          </>}
        </div>
      </div>
      <h2 className="tt-h2" style={{ marginTop: 56 }}>All tiers</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 24 }}>
        {tiers.map(t => (
          <div key={t.n} style={{ padding: 28, border: `1px solid ${current.n === t.n ? 'var(--ink)' : 'var(--line)'}`, borderRadius: 6, background: current.n === t.n ? 'var(--bg-soft)' : '#fff' }}>
            <div style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 32 }}>{t.n}</div>
            <div className="tt-muted" style={{ fontSize: 13, marginTop: 4 }}>{t.min}+ points</div>
            <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.55, color: 'var(--text-soft)' }}>{t.perks}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
window.LoyaltyScreen = LoyaltyScreen;

// ---------- TRAVEL FOR A CAUSE ----------
const CauseScreen = ({ go }) => (
  <div>
    <section className="tt-section" style={{ paddingTop: 64 }}>
      <div className="tt-page">
        <div className="tt-eyebrow">CSR &amp; community</div>
        <h1 className="tt-display" style={{ marginTop: 16 }}>Travel that <span className="tt-italic-soft" style={{ color: 'var(--accent)' }}>gives back.</span></h1>
        <p style={{ maxWidth: 640, marginTop: 24, fontSize: 17, lineHeight: 1.55, color: 'var(--text-soft)' }}>
          A portion of every booking funds restoration of temple craft, artisan livelihoods, and coastal cleanup near our properties. Choose a cause when you book.
        </p>
      </div>
    </section>
    <section className="tt-section" style={{ paddingTop: 0 }}>
      <div className="tt-page">
        <div className="tt-grid-3">
          {[
            { t: 'Sandalwood restoration', loc: 'Karnataka', d: 'Replanting native sandalwood with Forest Dept.', label: 'forest', raised: '₹4.2L', goal: '₹10L' },
            { t: 'Pondicherry coastal cleanup', loc: 'Tamil Nadu', d: 'Weekly beach cleans and turtle hatchery support.', label: 'coast', raised: '₹2.8L', goal: '₹6L' },
            { t: 'Artisan grants', loc: 'Pan-India', d: 'Direct grants to potters, weavers, brassworkers.', label: 'craft', raised: '₹5.1L', goal: '₹8L' },
          ].map(c => (
            <div key={c.t} className="tt-card">
              <div className="tt-card-media"><StripeImg label={c.label} tone="oklch(0.85 0.05 145)" ratio="auto"/></div>
              <div className="tt-card-body">
                <div className="tt-eyebrow" style={{ fontSize: 11 }}>{c.loc}</div>
                <h3 className="tt-h3" style={{ marginTop: 6, marginBottom: 8 }}>{c.t}</h3>
                <p className="tt-muted" style={{ fontSize: 14, margin: 0 }}>{c.d}</p>
                <div style={{ marginTop: 16 }}>
                  <div style={{ height: 4, background: 'var(--bg-soft)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: '60%', height: '100%', background: 'var(--accent)' }}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>{c.raised} raised</span>
                    <span className="tt-muted">of {c.goal}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
window.CauseScreen = CauseScreen;

// ---------- GUEST FOLIO ----------
const FolioScreen = ({ go, user, bookings }) => {
  const b = bookings.find(x => x.state === 'confirmed' || x.state === 'completed') || bookings[0];
  if (!b) return <div className="tt-page" style={{ padding: '120px 0', textAlign: 'center', color: 'var(--text-muted)' }}>No active stay yet. <span style={{ color: 'var(--ink)', cursor: 'pointer' }} onClick={() => go('home')}>Book one →</span></div>;
  const lines = [{ d: 'Room · Garden Suite × 3 nights', a: 26400 }, { d: 'Breakfast for two', a: 1800 }, { d: 'Spa · Abhyanga 60min', a: 3500 }, { d: 'Bar · evening', a: 980 }];
  const total = lines.reduce((s, l) => s + l.a, 0);
  return (
    <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 980 }}>
      <div className="tt-eyebrow">Guest folio · live</div>
      <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>Your stay at {b.property.name}</h1>
      <div className="tt-muted" style={{ marginTop: 8 }}>Folio #{b.id}-F · {tt.fmtDate(b.checkIn)} → {tt.fmtDate(b.checkOut)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 56, marginTop: 40 }}>
        <div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', background: 'var(--bg-soft)', display: 'grid', gridTemplateColumns: '1fr 120px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              <span>Description</span><span style={{ textAlign: 'right' }}>Amount</span>
            </div>
            {lines.map((l,i) => (
              <div key={i} style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 120px', borderTop: '1px solid var(--line)', fontSize: 15 }}>
                <span>{l.d}</span><span style={{ textAlign: 'right' }}>{tt.inr(l.a)}</span>
              </div>
            ))}
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 120px', borderTop: '2px solid var(--ink)', fontWeight: 700, fontSize: 17 }}>
              <span>Running total</span><span style={{ textAlign: 'right' }}>{tt.inr(total)}</span>
            </div>
          </div>
          <h3 className="tt-h3" style={{ marginTop: 40 }}>Add to your stay</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 16 }}>
            {[{t:'Sunset boat',p:1800},{t:'Cooking class',p:1200},{t:'Heritage walk',p:600}].map(x => (
              <div key={x.t} style={{ padding: 20, border: '1px solid var(--line)', borderRadius: 6, cursor: 'pointer' }}>
                <div style={{ fontWeight: 600 }}>{x.t}</div>
                <div className="tt-muted" style={{ fontSize: 13, marginTop: 4 }}>{tt.inr(x.p)} per person</div>
                <button className="tt-btn-link" style={{ marginTop: 12, fontSize: 13 }}>Add to folio →</button>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <div className="tt-summary">
            <div className="tt-eyebrow">Settlement</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{tt.inr(total)}</div>
            <div className="tt-muted" style={{ fontSize: 13, marginTop: 4 }}>Auto-charged on checkout · {tt.fmtDate(b.checkOut)}</div>
            <hr className="tt-hr"/>
            <button className="tt-btn tt-btn-primary tt-w-full">Settle now</button>
            <button className="tt-btn tt-btn-ghost tt-w-full" style={{ marginTop: 8 }}>Email PDF receipt</button>
          </div>
        </aside>
      </div>
    </div>
  );
};
window.FolioScreen = FolioScreen;

// ---------- EXPERIENCES / THINGS / EVENTS (lightweight) ----------
const ListPage = ({ eyebrow, title, sub, items }) => (
  <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96 }}>
    <div className="tt-eyebrow">{eyebrow}</div>
    <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>{title}</h1>
    <p style={{ color: 'var(--text-soft)', marginTop: 12, fontSize: 16, maxWidth: 620 }}>{sub}</p>
    <div className="tt-grid-3" style={{ marginTop: 48 }}>
      {items.map(it => (
        <div key={it.t} className="tt-card">
          <div className="tt-card-media"><StripeImg label={it.label} tone={it.tone} ratio="auto"/></div>
          <div className="tt-card-body">
            <div className="tt-eyebrow" style={{ fontSize: 11 }}>{it.cat}</div>
            <h3 className="tt-h3" style={{ marginTop: 6, marginBottom: 8 }}>{it.t}</h3>
            <p className="tt-muted" style={{ fontSize: 14, margin: 0 }}>{it.d}</p>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>{it.price}</span>
              <button className="tt-btn-link" style={{ fontSize: 13 }}>Book →</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ExperienceScreen = ({ go }) => <ListPage eyebrow="Experiences" title={<>Curated days, <span className="tt-italic-soft" style={{ color: 'var(--accent)' }}>locally led.</span></>} sub="Pottery in Pondicherry. Yoga at Auroville. Brunch at Bangalore's oldest cafés." items={[
  {cat:'Pondicherry',t:'Pottery & wheel throwing',d:'Half day in a French quarter studio.',price:'₹2,400',label:'pottery',tone:'oklch(0.85 0.06 60)'},
  {cat:'Auroville',t:'Sunrise yoga & breakfast',d:'Two hours of yoga, then a slow breakfast.',price:'₹1,500',label:'yoga',tone:'oklch(0.88 0.05 145)'},
  {cat:'Bengaluru',t:'Heritage breakfast walk',d:'VV Puram by foot, six tasting stops.',price:'₹900',label:'food',tone:'oklch(0.86 0.06 35)'},
  {cat:'Coast',t:'Catamaran sunset',d:'Local fishermen, bottled water, biscuits.',price:'₹1,800',label:'boat',tone:'oklch(0.85 0.06 215)'},
  {cat:'Bengaluru',t:'Lalbagh tree walk',d:'A botanist guides a slow loop.',price:'₹600',label:'garden',tone:'oklch(0.87 0.05 145)'},
  {cat:'Pondicherry',t:'Indo-French dinner',d:'Pop-up at a private home in White Town.',price:'₹3,200',label:'dinner',tone:'oklch(0.84 0.06 30)'},
]}/>;
window.ExperienceScreen = ExperienceScreen;

const ThingsScreen = ({ go }) => <ListPage eyebrow="Things to do" title={<>Beyond the room.</>} sub="A short list, hand-picked by hosts. Book on the spot or save for later." items={[
  {cat:'Outdoor',t:'Cycling the East Coast Road',d:'Half-day ride, cycle and helmet included.',price:'₹1,200',label:'cycle',tone:'oklch(0.85 0.06 220)'},
  {cat:'Wellness',t:'Abhyanga massage',d:'Sixty minutes of warm-oil bliss.',price:'₹3,500',label:'spa',tone:'oklch(0.88 0.04 60)'},
  {cat:'Crafts',t:'Block-printing class',d:'Take home what you print.',price:'₹2,000',label:'craft',tone:'oklch(0.86 0.06 30)'},
]}/>;
window.ThingsScreen = ThingsScreen;

const EventsScreen = ({ go }) => <ListPage eyebrow="Events &amp; festivals" title={<>What&rsquo;s on, this season.</>} sub="Concerts, supper clubs, temple festivals. Tied to your stay dates." items={[
  {cat:'Pondicherry · 14 May',t:'Tamil New Year supper',d:'Ten-course meal, communal table.',price:'₹2,800',label:'feast',tone:'oklch(0.85 0.06 30)'},
  {cat:'Bengaluru · 22 May',t:'Carnatic at the courtyard',d:'Two-hour concert, doors at 18:00.',price:'₹900',label:'music',tone:'oklch(0.84 0.07 280)'},
  {cat:'Auroville · 5 Jun',t:'Solstice sound bath',d:'Outdoor, bring a blanket.',price:'Free',label:'sound',tone:'oklch(0.87 0.05 200)'},
]}/>;
window.EventsScreen = EventsScreen;
