/* global React, Ico, StripeImg, tt, TT_DATA */
const { useState, useMemo, useEffect } = React;

// ---------- BOOKING WIZARD ----------
const BookingWizard = ({ go, ctx, onSubmit }) => {
  const [step, setStep] = useState(0);
  const [guestName, setGuestName] = useState('Aanya Sharma');
  const [guestEmail, setGuestEmail] = useState('aanya@example.com');
  const [guestPhone, setGuestPhone] = useState('+91 98 4435 1290');
  const [arrival, setArrival] = useState('Late afternoon · ~17:00');
  const [requests, setRequests] = useState('A pot of filter coffee on arrival, please.');
  const [agree, setAgree] = useState(false);
  const nights = tt.nightsBetween(ctx.checkIn, ctx.checkOut) || 3;
  const subtotal = (ctx.room?.price || 0) * nights;
  const tax = subtotal * 0.12;
  const total = subtotal + tax + 450;
  const labels = ['Trip details', 'About you', 'Review & request'];
  const next = () => step < 2 ? setStep(s => s + 1) : onSubmit({ ...ctx, guest: { name: guestName, email: guestEmail, phone: guestPhone, arrival, requests }, total });

  return (
    <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 1100 }}>
      <button className="tt-btn-link" onClick={() => go('property', { propertyId: ctx.property.id })}>← Back to {ctx.property.name}</button>
      <div className="tt-eyebrow" style={{ marginTop: 24 }}>Booking request</div>
      <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>Tell us about your stay</h1>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, marginTop: 40, marginBottom: 40, borderBottom: '1px solid var(--line)' }}>
        {labels.map((l, i) => (
          <div key={l} onClick={() => i < step && setStep(i)} style={{ flex: 1, padding: '16px 0', borderBottom: `2px solid ${i === step ? 'var(--ink)' : 'transparent'}`, cursor: i < step ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 12, marginBottom: '-1px' }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: i <= step ? 'var(--ink)' : 'var(--bg-soft)', color: i <= step ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{i + 1}</span>
            <span style={{ fontWeight: i === step ? 600 : 400, color: i <= step ? 'var(--ink)' : 'var(--text-muted)', fontSize: 14 }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 56 }}>
        <div>
          {step === 0 && (
            <div>
              <h3 className="tt-h3">Confirm your dates</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
                <div className="tt-field"><label>Check in</label><div className="tt-field-val">{tt.fmtDate(ctx.checkIn)}</div></div>
                <div className="tt-field"><label>Check out</label><div className="tt-field-val">{tt.fmtDate(ctx.checkOut)}</div></div>
                <div className="tt-field"><label>Nights</label><div className="tt-field-val">{nights}</div></div>
              </div>
              <h3 className="tt-h3" style={{ marginTop: 40 }}>Estimated arrival</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                {['Morning · before 12:00','Afternoon · 12-16:00','Late afternoon · ~17:00','Evening · after 19:00'].map(a => (
                  <span key={a} onClick={() => setArrival(a)} className={`tt-chip ${arrival === a ? 'tt-chip-active' : ''}`}>{a}</span>
                ))}
              </div>
              <h3 className="tt-h3" style={{ marginTop: 40 }}>Anything we should know?</h3>
              <textarea className="tt-textarea" rows={4} value={requests} onChange={e => setRequests(e.target.value)} placeholder="Allergies, accessibility, celebrations…"/>
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="tt-h3">Lead guest</h3>
              <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
                <div className="tt-field"><label>Full name</label><input value={guestName} onChange={e => setGuestName(e.target.value)}/></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="tt-field"><label>Email</label><input value={guestEmail} onChange={e => setGuestEmail(e.target.value)}/></div>
                  <div className="tt-field"><label>Phone</label><input value={guestPhone} onChange={e => setGuestPhone(e.target.value)}/></div>
                </div>
              </div>
              <p className="tt-muted" style={{ marginTop: 16, fontSize: 13 }}>We share contact details with the host only after they approve your request. Read our <a href="#" style={{ color: 'var(--ink)' }}>privacy policy</a>.</p>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="tt-h3">Review your request</h3>
              <div style={{ marginTop: 20, padding: 24, border: '1px solid var(--line)', borderRadius: 6 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}><StripeImg label={ctx.property.placeholder} tone={ctx.property.tone} ratio="auto"/></div>
                  <div>
                    <div className="tt-eyebrow" style={{ fontSize: 11 }}>{ctx.property.area}</div>
                    <div style={{ fontWeight: 600, marginTop: 4 }}>{ctx.property.name}</div>
                    <div className="tt-muted" style={{ fontSize: 13, marginTop: 2 }}>{ctx.room?.type}</div>
                  </div>
                </div>
                <hr className="tt-hr"/>
                <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Dates</span><span>{tt.fmtDate(ctx.checkIn)} → {tt.fmtDate(ctx.checkOut)} · {nights} nights</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Guests</span><span>{ctx.guests}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Arrival</span><span>{arrival}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Lead guest</span><span>{guestName}</span></div>
                </div>
              </div>
              <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 24, cursor: 'pointer' }}>
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 4, accentColor: 'var(--ink)' }}/>
                <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>I understand the host will review my request and I&rsquo;ll receive a payment link by email if approved. Cancellations are free up to 48 hours before check-in.</span>
              </label>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--line)' }}>
            <button className="tt-btn tt-btn-ghost" onClick={() => step === 0 ? go('property', { propertyId: ctx.property.id }) : setStep(s => s - 1)}>← Back</button>
            <button className="tt-btn tt-btn-primary" onClick={next} disabled={step === 2 && !agree}>{step === 2 ? 'Submit request' : 'Continue'} <Ico name="arrow" size={14}/></button>
          </div>
        </div>

        <aside style={{ position: 'sticky', top: 120, alignSelf: 'flex-start' }}>
          <div className="tt-summary">
            <div className="tt-eyebrow">Summary</div>
            <div style={{ marginTop: 16, fontWeight: 600, fontSize: 17 }}>{ctx.property.name}</div>
            <div className="tt-muted" style={{ fontSize: 13, marginTop: 2 }}>{ctx.room?.type}</div>
            <hr className="tt-hr"/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">{tt.inr(ctx.room?.price)} × {nights} nights</span><span>{tt.inr(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">Hosting fee</span><span>{tt.inr(450)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="tt-muted">GST 12%</span><span>{tt.inr(tax)}</span></div>
            </div>
            <hr className="tt-hr"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: 18 }}><span>Total</span><span>{tt.inr(total)}</span></div>
            <p className="tt-muted" style={{ fontSize: 12, marginTop: 12 }}>Charged only after the host approves.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
window.BookingWizard = BookingWizard;

// ---------- BOOKING FLOW (awaiting → approved → payment → confirmed) ----------
const BookingFlow = ({ go, booking, advance }) => {
  const [showPay, setShowPay] = useState(false);
  const [paying, setPaying] = useState(false);
  useEffect(() => {
    if (booking.state !== 'awaiting') return;
    const t = setTimeout(() => advance('approved'), 6500);
    return () => clearTimeout(t);
  }, [booking.id, booking.state, advance]);

  const Stage = ({ active, done, label, n }) => (
    <div style={{ flex: 1, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? 'var(--accent)' : active ? 'var(--ink)' : 'var(--bg-soft)', color: (done||active) ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12 }}>{done ? '✓' : n}</div>
        <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: (done||active) ? 'var(--ink)' : 'var(--text-muted)' }}>{label}</span>
      </div>
    </div>
  );

  return (
    <div className="tt-page" style={{ paddingTop: 56, paddingBottom: 96, maxWidth: 920 }}>
      <div className="tt-eyebrow">Reservation {booking.id}</div>
      <h1 className="tt-h1" style={{ margin: '12px 0 0' }}>{booking.property.name}</h1>
      <div className="tt-muted" style={{ marginTop: 8 }}>{tt.fmtDate(booking.checkIn)} → {tt.fmtDate(booking.checkOut)} · {booking.guests}</div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 40, marginBottom: 40, padding: '24px 32px', background: 'var(--bg-soft)', borderRadius: 6 }}>
        <Stage n="1" label="Awaiting host" active={booking.state==='awaiting'} done={['approved','paid','confirmed'].includes(booking.state)}/>
        <div style={{ height: 1, background: 'var(--line-strong)', flex: '0 0 40px' }}/>
        <Stage n="2" label="Approved · pay now" active={booking.state==='approved'} done={['paid','confirmed'].includes(booking.state)}/>
        <div style={{ height: 1, background: 'var(--line-strong)', flex: '0 0 40px' }}/>
        <Stage n="3" label="Confirmed" active={booking.state==='confirmed'} done={booking.state==='confirmed'}/>
      </div>

      {booking.state === 'awaiting' && (
        <div style={{ padding: 40, border: '1px solid var(--line)', borderRadius: 6, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', width: 56, height: 56, borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'tt-spin 1.4s linear infinite' }}/>
          <h2 className="tt-h2" style={{ marginTop: 24, marginBottom: 8 }}>We&rsquo;re notifying the host now.</h2>
          <p style={{ color: 'var(--text-soft)' }}>Most hosts respond within an hour. We&rsquo;ll text and email you the moment they do.</p>
          <button className="tt-btn tt-btn-ghost" style={{ marginTop: 20 }} onClick={() => go('bookings')}>Take me to my bookings</button>
        </div>
      )}

      {booking.state === 'approved' && (
        <div style={{ padding: 40, border: '1px solid var(--accent)', borderRadius: 6, background: 'oklch(0.97 0.04 145)' }}>
          <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Approved · pay within 2 hours</div>
          <h2 className="tt-h2" style={{ marginTop: 12, marginBottom: 12 }}>Anika has approved your stay.</h2>
          <p style={{ color: 'var(--text-soft)', maxWidth: 540 }}>Complete payment to confirm. Your room is held until {new Date(Date.now() + 2*60*60*1000).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="tt-btn tt-btn-primary tt-btn-lg" onClick={() => setShowPay(true)}>Pay {tt.inr(booking.total)} <Ico name="arrow" size={14}/></button>
            <button className="tt-btn tt-btn-ghost">Message host</button>
          </div>
        </div>
      )}

      {booking.state === 'confirmed' && (
        <div style={{ padding: 40, border: '1px solid var(--line)', borderRadius: 6, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>✓</div>
          <h2 className="tt-h2" style={{ marginTop: 20, marginBottom: 8 }}>You&rsquo;re booked.</h2>
          <p style={{ color: 'var(--text-soft)' }}>Confirmation #{booking.id} sent to your email. We can&rsquo;t wait to host you.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
            <button className="tt-btn tt-btn-ghost" onClick={() => go('bookings')}>My bookings</button>
            <button className="tt-btn tt-btn-primary" onClick={() => go('home')}>Plan another trip</button>
          </div>
        </div>
      )}

      {showPay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={() => !paying && setShowPay(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: 460, background: '#fff', borderRadius: 8, padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Secure payment · powered by Razorpay</div>
              {!paying && <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowPay(false)}>×</span>}
            </div>
            <div style={{ padding: 20, background: 'var(--bg-soft)', borderRadius: 6, marginBottom: 20 }}>
              <div className="tt-muted" style={{ fontSize: 12 }}>Amount</div>
              <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{tt.inr(booking.total)}</div>
              <div className="tt-muted" style={{ fontSize: 12, marginTop: 4 }}>{booking.property.name} · {booking.id}</div>
            </div>
            <div className="tt-field"><label>Card number</label><input defaultValue="4111 1111 1111 1234" disabled={paying}/></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              <div className="tt-field"><label>Expiry</label><input defaultValue="04 / 28" disabled={paying}/></div>
              <div className="tt-field"><label>CVV</label><input defaultValue="•••" disabled={paying}/></div>
            </div>
            <button className="tt-btn tt-btn-primary tt-w-full tt-btn-lg" style={{ marginTop: 20 }} disabled={paying} onClick={() => { setPaying(true); setTimeout(() => { setShowPay(false); setPaying(false); advance('confirmed'); }, 1800); }}>
              {paying ? 'Processing…' : `Pay ${tt.inr(booking.total)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
window.BookingFlow = BookingFlow;
