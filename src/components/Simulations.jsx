import React, { useEffect, useId, useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './simulations.css';

const C = { ink: '#122b37', bronze: '#a46b39', green: '#355f51', paper: '#f4f0e6', pale: '#e5e9dd', blue: '#7291a0' };
const fmt = (n, digits = 1) => Number.isFinite(n) ? n.toLocaleString('tr-TR', { maximumFractionDigits: digits }) : '—';
const rad = n => n * Math.PI / 180;
const point = (cx, cy, r, a) => ({ x: cx + r * Math.cos(rad(a)), y: cy + r * Math.sin(rad(a)) });
const arc = (cx, cy, r, a, b) => { const p = point(cx, cy, r, a), q = point(cx, cy, r, b); return `M ${p.x} ${p.y} A ${r} ${r} 0 ${Math.abs(b - a) > 180 ? 1 : 0} ${b > a ? 1 : 0} ${q.x} ${q.y}`; };

function Formula({ tex }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }), [tex]);
  return <div className="sim-formula" dangerouslySetInnerHTML={{ __html: html }} />;
}

function Toggle({ label, checked, onChange, disabled = false }) {
  return <label className={`sim-toggle ${disabled ? 'is-disabled' : ''}`}>
    <input type="checkbox" role="switch" aria-checked={checked} checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} />
    <span className="sim-toggle-track" aria-hidden="true"><span /></span><span>{label}</span>
  </label>;
}

function Range({ label, value, min, max, step = 1, unit = '', onChange, disabled, numbers = true, hint }) {
  const id = useId();
  return <div className="sim-range">
    <div className="sim-range-label"><label htmlFor={id}>{label}</label>{numbers && <output htmlFor={id}>{fmt(value, 2)}{unit && ` ${unit}`}</output>}</div>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} disabled={disabled} aria-valuetext={`${fmt(value, 2)} ${unit}`} />
    {hint && <span className="sim-input-hint">{hint}</span>}
  </div>;
}

function Metrics({ items }) {
  return <dl className="sim-metrics">{items.map(([label, value, note]) => <div key={label}><dt>{label}</dt><dd>{value}</dd>{note && <small>{note}</small>}</div>)}</dl>;
}

function Canvas({ title, desc, children, onClick, onKeyDown, interactive = false }) {
  const id = useId().replace(/:/g, '');
  return <svg className={`sim-svg ${interactive ? 'sim-svg-interactive' : ''}`} viewBox="0 0 720 460" role={interactive ? 'button' : 'img'} aria-labelledby={`${id}-title ${id}-desc`} onClick={onClick} onKeyDown={onKeyDown} tabIndex={interactive ? 0 : undefined}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{desc}</desc>
    <defs>
      <marker id={`${id}-arrow`} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill={C.bronze} /></marker>
      <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke={C.ink} strokeOpacity=".055" /></pattern>
    </defs>
    <rect width="720" height="460" fill={`url(#${id}-grid)`} />
    {children({ arrow: `${id}-arrow`, id })}
  </svg>;
}

function SimFrame({ title, kicker, steps, step, setStep, children, controls, numbers, setNumbers, metrics, math, caption, note }) {
  const free = step === steps.length - 1;
  return <article className="science-sim" aria-label={title}>
    <header className="sim-heading"><div><p className="sim-kicker">{kicker}</p><h3>{title}</h3></div><Toggle label="Rakamları göster" checked={numbers} onChange={setNumbers} /></header>
    <div className="sim-workspace">
      <div className="sim-visual"><div className="sim-canvas-wrap">{children}</div><p className="sim-caption"><span aria-hidden="true">↳</span> {caption}</p>{numbers && metrics}</div>
      <div className="sim-side">
        <div className="sim-story" aria-live="polite" aria-atomic="true"><div className="sim-step-label"><span>{free ? 'ŞİMDİ SIRA SENDE' : `ADIM ${step + 1} / ${steps.length}`}</span><div className="sim-progress" aria-hidden="true">{steps.map((_, i) => <i key={i} className={i <= step ? 'is-done' : ''} />)}</div></div><h4>{steps[step].title}</h4><p>{steps[step].body}</p></div>
        <div className="sim-story-nav"><button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} aria-label="Önceki hikâye adımı">← Geri</button><button type="button" className="sim-next" onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={free}>{step === steps.length - 2 ? 'Denemeye geç' : free ? 'Serbest deneme açık' : 'İleri'} {!free && <span aria-hidden="true">→</span>}</button></div>
        <fieldset className="sim-controls" disabled={!free}><legend>{free ? 'Deney masası' : 'Birazdan sen değiştireceksin'}</legend>{controls}</fieldset>
        {note && <p className="sim-note"><span aria-hidden="true">ⓘ</span> {note}</p>}
        <details className="sim-math"><summary>Matematiği aç <span aria-hidden="true">+</span></summary><div>{math}</div></details>
      </div>
    </div>
  </article>;
}

const eratosthenesSteps = [
  { title: 'Aynı Güneş, iki şehir', body: 'Güneş ışınları Dünya’ya neredeyse paralel ulaşır. İki şehirdeki çubukların aynı anda ne söylediğine bak.' },
  { title: 'Bir çubuğun gölgesi yok', body: 'Syene’de ışık çubuğun doğrultusunda gelir. Daha kuzeydeki İskenderiye’de ise çubuğun bir gölgesi vardır. Yeryüzü eğri olduğunda bu beklenen bir sonuçtur.' },
  { title: 'Küçük bir yay, büyük bir Dünya', body: 'Gölgenin anlattığı açı ile şehirler arasındaki yolu birleştir. İki şehir arasındaki yay, Dünya’nın çevresinin küçük bir parçasını verir.' },
  { title: 'Şimdi uzaklığı ve açıyı değiştir', body: 'Uzaklığı sabit tutup açıyı küçült. Sonra açıyı sabit tutup uzaklığı büyüt. Hangi durumda daha büyük bir Dünya bulduğunu gözle.' },
];

export function EratosthenesSimulator() {
  const [step, setStep] = useState(0), [numbers, setNumbers] = useState(false);
  const [distance, setDistance] = useState(800), [angle, setAngle] = useState(7.2);
  const free = step === 3, d = free ? distance : 800, a = free ? angle : 7.2;
  const circumference = 360 * d / a;
  const cx = 315, cy = 345, radius = 191, theta = -90 + a * 3;
  const syene = point(cx, cy, radius, -90), alex = point(cx, cy, radius, theta);
  const syeneTip = point(cx, cy, radius + 57, -90), alexTip = point(cx, cy, radius + 57, theta);
  const tangent = { x: -Math.sin(rad(theta)), y: Math.cos(rad(theta)) };
  const shadowLength = 57 * Math.tan(rad(theta + 90));
  return <SimFrame title="Bir gölgeden Dünya’nın çevresine" kicker="ERATOSTHENES · İSKENDERİYE & SYENE" steps={eratosthenesSteps} step={step} setStep={setStep} numbers={numbers} setNumbers={setNumbers}
    caption="İki çubuk, bir yay ve birbirine paralel Güneş ışınları. Açı, rahat görülsün diye çizimde büyütülmüştür."
    controls={<><Range label="Şehirler arası uzaklık" value={d} min={100} max={2000} step={10} unit="km" onChange={setDistance} disabled={!free} numbers={numbers} /><Range label="Gölgeden bulunan açı" value={a} min={1} max={20} step={0.1} unit="°" onChange={setAngle} disabled={!free} numbers={numbers} /></>}
    metrics={<Metrics items={[["Ölçülen yay", `${fmt(d, 0)} km`], ["Merkez açısı", `${fmt(a)}°`], ["Bulunan çevre", `${fmt(circumference, 0)} km`]]} />}
    math={<><p>Paralel ışınlar nedeniyle gölge açısı, iki şehir arasındaki merkez açısına eşittir. Uzaklık bir meridyen yayı olarak kabul edilir.</p><Formula tex="\frac{d}{C}=\frac{\theta}{360^\circ}\qquad C=\frac{360^\circ\,d}{\theta}" /><Formula tex={String.raw`C=\frac{360\times ${d}}{${a}}\approx ${Math.round(circumference)}\;\text{km}`} /><p>Başlangıçtaki 800 km ve 7,2° öğretici yuvarlamalardır. Antik stadion biriminin uzunluğu ve şehirlerin tam konumu için tarihsel belirsizlik bulunur.</p></>}
    note="Model aynı meridyen, dik çubuklar ve eşzamanlı gözlem varsayar. Tarihî ölçümün birebir kopyası değildir.">
    <Canvas title="Eratosthenes’in iki çubuk deneyi" desc={`İki şehir arası uzaklık ${d} kilometre, gölge açısı ${a} derece. Bulunan çevre yaklaşık ${Math.round(circumference)} kilometre.`}>{({ arrow }) => <>
      <circle cx={cx} cy={cy} r={radius} fill={C.pale} stroke={C.green} strokeWidth="1.4" />
      <path d={`M ${cx - 120} ${cy - 120} q60 -20 75 20t60 25q30 40 -10 56t-12 60q-35 25 -55 -18t-25 -40q-55 -15 -33 -65Z`} fill={C.green} opacity=".09" />
      {[155, 215, 275, 335, 395, 455, 515, 575].map(x => <line key={x} x1={x} y1="28" x2={x} y2="99" stroke={C.bronze} strokeWidth="1.5" opacity=".65" markerEnd={`url(#${arrow})`} />)}
      <line x1={syene.x} x2={syene.x} y1="28" y2={syene.y} stroke={C.bronze} strokeOpacity=".55" strokeWidth="1.3" /><line x1={alexTip.x} x2={alexTip.x} y1="28" y2={alex.y + tangent.y * shadowLength} stroke={C.bronze} strokeOpacity=".55" strokeWidth="1.3" /><text x="55" y="63" className="svg-label">GÜNEŞ</text><text x="55" y="80" className="svg-small">paralel ışınlar</text>
      <line x1={cx} y1={cy} x2={syene.x} y2={syene.y} stroke={C.ink} strokeDasharray="5 5" opacity=".45" />
      <line x1={cx} y1={cy} x2={alex.x} y2={alex.y} stroke={C.ink} strokeDasharray="5 5" opacity=".45" />
      <path d={arc(cx, cy, 49, -90, theta)} fill="none" stroke={C.bronze} strokeWidth="2" />
      <text x={cx + 16} y={cy - 59} className="svg-metric">{numbers ? `${fmt(a)}°` : 'aynı açı'}</text>
      <path d={arc(cx, cy, radius + 3, -90, theta)} fill="none" stroke={C.bronze} strokeWidth="6" strokeLinecap="round" />
      <line x1={syene.x} y1={syene.y} x2={syeneTip.x} y2={syeneTip.y} stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
      <line x1={alex.x} y1={alex.y} x2={alexTip.x} y2={alexTip.y} stroke={C.ink} strokeWidth="5" strokeLinecap="round" />
      {step > 0 && <><path d={`M${alexTip.x} ${alexTip.y}L${alex.x + tangent.x * shadowLength} ${alex.y + tangent.y * shadowLength}L${alex.x} ${alex.y}Z`} fill={C.bronze} opacity=".16" /><line x1={alex.x} y1={alex.y} x2={alex.x + tangent.x * shadowLength} y2={alex.y + tangent.y * shadowLength} stroke={C.bronze} strokeWidth="4" /><text x={alex.x + tangent.x * (shadowLength + 7) + 10} y={alex.y + tangent.y * (shadowLength + 7) + 3} className="svg-small">gölge</text></>}
      <circle cx={syene.x} cy={syene.y} r="4" fill={C.ink} /><circle cx={alex.x} cy={alex.y} r="4" fill={C.ink} />
      <path d={`M${syeneTip.x - 8} ${syeneTip.y + 8}H236`} className="svg-leader" /><text x="140" y={syeneTip.y + 4} className="svg-label">SYENE</text><text x="140" y={syeneTip.y + 22} className="svg-small">gölgesiz çubuk</text>
      <path d={`M${alexTip.x + 9} ${alexTip.y + 5}H${Math.max(500, alexTip.x + 26)}`} className="svg-leader" /><text x={Math.max(507, alexTip.x + 32)} y={alexTip.y + 1} className="svg-label">İSKENDERİYE</text>
      {step > 1 && <><text x="470" y="300" className="svg-label" fill={C.bronze}>İKİ ŞEHİR ARASI YAY</text><text x="470" y="324" className="svg-metric">{numbers ? `${fmt(d, 0)} km` : 'yürünerek ölçülen yol'}</text><path d={`M462 289L${(syene.x + alex.x) / 2 + 14} ${(syene.y + alex.y) / 2 + 12}`} className="svg-leader" /></>}
      <circle cx={cx} cy={cy} r="4" fill={C.ink} /><text x={cx - 28} y={cy + 25} className="svg-small">Dünya’nın merkezi</text>
    </>}</Canvas>
  </SimFrame>;
}

const sincarSteps = [
  { title: 'Bir düzlük, iki ekip', body: 'Abbâsî dönemindeki ölçümü düşün: ekipler aynı başlangıç yerinden kuzeye ve güneye gider. Amaç, gökyüzündeki değişimi yerdeki yolla karşılaştırmaktır.' },
  { title: 'Kutup yükselir, kutup alçalır', body: 'Kuzeye giden ekip için gök kutbu ufkun üstünde yükselir. Güneye giden ekip için alçalır. İki ekip de yürüdüğü yolu pozitif bir uzunluk olarak kaydeder.' },
  { title: 'İki sonuç birbirini sınar', body: 'İdeal modelde iki ekip aynı Dünya çevresini bulur. Birbirinden farklı sonuçlar elde etmek, gözlemi ve yol ölçümünü yeniden inceleme nedenidir.' },
  { title: 'Gözlem hatası eklemeyi dene', body: 'İki ekibin mesafesini değiştir. Ardından küçük ve ters yönlü bir gözlem hatası ekle; küçük bir açı farkının Dünya ölçeğinde nasıl büyüdüğünü gör.' },
];

function SincarSimulator() {
  const [step, setStep] = useState(0), [numbers, setNumbers] = useState(false), [north, setNorth] = useState(111.2), [south, setSouth] = useState(111.2), [errorOn, setErrorOn] = useState(false), [error, setError] = useState(1);
  const free = step === 3, dn = free ? north : step === 0 ? 20 : step === 1 ? 65 : 111.2, ds = free ? south : dn;
  const eps = free && errorOn ? error / 60 : 0, an = dn / 111.2 + eps, as = ds / 111.2 - eps;
  const cn = 360 * dn / an, cs = 360 * ds / as;
  const yn = 225 - dn * .92, ys = 225 + ds * .92;
  return <SimFrame title="İki ekiple aynı Dünya’yı ölçmek" kicker="SİNCAR · ABBÂSÎ ÖLÇÜM GELENEĞİ" steps={sincarSteps} step={step} setStep={setStep} numbers={numbers} setNumbers={setNumbers}
    caption="Şema, kuzey ve güney yönündeki iki bağımsız ölçümü karşılaştırır. Yol haritası tarihî güzergâh iddiası taşımaz."
    controls={<><Range label="Kuzey ekibinin yolu" value={dn} min={20} max={160} step={0.1} unit="km" onChange={setNorth} disabled={!free} numbers={numbers} /><Range label="Güney ekibinin yolu" value={ds} min={20} max={160} step={0.1} unit="km" onChange={setSouth} disabled={!free} numbers={numbers} /><Toggle label="Gözlem hatasını ekle" checked={errorOn} onChange={setErrorOn} disabled={!free} />{errorOn && <Range label="Zıt yönlü açı hatası" value={error} min={0} max={6} step={0.1} unit="yay dk." onChange={setError} disabled={!free} numbers={numbers} hint="Kuzey gözlemine eklenir, güney gözleminden çıkarılır." />}</>}
    metrics={<Metrics items={[["Kuzey · kutup değişimi", `${fmt(an, 3)}°`, `Çevre: ${fmt(cn, 0)} km`], ["Güney · kutup değişimi", `${fmt(as, 3)}°`, `Çevre: ${fmt(cs, 0)} km`], ["İki sonuç arasındaki fark", `${fmt(Math.abs(cn - cs), 0)} km`]]} />}
    note="Gök kutbu yüksekliği burada ideal geometriyi anlatır; tarihî ölçümün tam yeniden yapımı değildir. Bazı aktarımlar mevsimsel düzeltilmiş öğle Güneşi yüksekliğini anlatır. Kutup Yıldızı gök kutbuyla aynı nokta değildir; tarihî yöntemlerin ayrıntıları kesin değildir."
    math={<><p>Bu öğretici modelde bir derecelik enlem değişimi için 111,2 km alınır. Bu, tarihî sonucun kesin değeri olarak sunulmaz.</p><Formula tex="\Delta\varphi_{\text{ideal}}=\frac{d}{111.2}\;\text{derece}\qquad C=\frac{360\,d}{\lvert\Delta\varphi_{\text{gözlem}}\rvert}" /><Formula tex="\Delta\varphi_N=\frac{d_N}{111.2}+\frac{\varepsilon}{60},\quad\lvert\Delta\varphi_S\rvert=\frac{d_S}{111.2}-\frac{\varepsilon}{60}" /><p>Hatasız başlangıçta her ekip 40.032 km bulur. Enlem açısının işareti yönü gösterir; yol uzunlukları iki ekip için de pozitiftir. Gerçek arazide rota, eğim, ölçüm aletleri ve atmosfer ek belirsizlik getirir.</p></>}>
    <Canvas title="Sincar’da kuzey ve güney ekipleri" desc={`Kuzey yolu ${dn} kilometre, güney yolu ${ds} kilometre. Modelde iki ekip gök kutbunun yüksekliğindeki değişimi ölçüyor.`}>{({ arrow }) => <>
      <path d="M50 382Q150 314 212 359T397 348T675 365" fill="none" stroke={C.bronze} opacity=".16" strokeWidth="40" />
      <path d="M75 101Q175 130 218 110T400 112T670 91" fill="none" stroke={C.bronze} opacity=".1" strokeWidth="30" />
      <path d="M340 57V407" stroke={C.ink} strokeWidth="1" strokeDasharray="4 6" opacity=".3" />
      <path d={`M326 225V${yn}`} stroke={C.green} strokeWidth="4" markerEnd={`url(#${arrow})`} /><path d={`M354 225V${ys}`} stroke={C.bronze} strokeWidth="4" markerEnd={`url(#${arrow})`} />
      <path d="M305 225h70" stroke={C.ink} strokeWidth="2" /><circle cx="340" cy="225" r="7" fill={C.paper} stroke={C.ink} strokeWidth="2" />
      <text x="75" y="230" className="svg-label">ORTAK BAŞLANGIÇ</text><path d="M236 225h65" className="svg-leader" />
      <text x="340" y="34" textAnchor="middle" className="svg-label">K U Z E Y</text><text x="340" y="439" textAnchor="middle" className="svg-label">G Ü N E Y</text>
      {[[yn, C.green, 'Kuzey ekibi', dn, an], [ys, C.bronze, 'Güney ekibi', ds, as]].map(([y, color, name, distance, delta], i) => {
        const panelY = i ? 340 : 126;
        return <g key={name}>
          <circle cx="340" cy={y} r="10" fill={color} stroke={C.paper} strokeWidth="3" /><path d={`M355 ${y}L382 ${panelY + 18}`} stroke={color} strokeOpacity=".25" strokeDasharray="3 4" />
          <path d={`M389 ${panelY + 18}h201`} stroke={C.ink} opacity=".3" /><path d={`M389 ${panelY + 18}l116 ${i ? -40 : -65}`} stroke={color} strokeWidth="1.8" /><path d={`M416 ${panelY + 18}A27 27 0 0 0 ${i ? 414 : 412} ${panelY + (i ? 9 : 5)}`} fill="none" stroke={color} /><text x="609" y={panelY + 23} className="svg-small">ufuk</text>
          <text x="408" y={panelY - 26} className="svg-label" fill={color}>{name}</text><text x="408" y={panelY - 6} className="svg-small">{numbers ? `${fmt(distance)} km · ${fmt(delta, 3)}° değişim` : i ? 'gök kutbu alçalır' : 'gök kutbu yükselir'}</text>
          <path d={`M${i ? 511 : 510} ${panelY - (i ? 27 : 54)}l3 -7 3 7 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5Z`} fill={color} />
        </g>;
      })}
      <text x="75" y="353" className="svg-small">DÜZELTİLMİŞ</text><text x="75" y="373" className="svg-label">gök kutbu gözlemi</text>
      {eps > 0 && <g><rect x="66" y="68" width="190" height="48" rx="5" fill={C.bronze} fillOpacity=".09" /><text x="82" y="89" className="svg-small">GÖZLEM HATASI AÇIK</text><text x="82" y="105" className="svg-small">İki sonuç artık ayrışabilir.</text><text x="76" y="146" className="svg-small">Kuzey sonucu</text><rect x="76" y="154" width={140 * cn / Math.max(cn, cs)} height="6" fill={C.green} /><text x="76" y="183" className="svg-small">Güney sonucu</text><rect x="76" y="191" width={140 * cs / Math.max(cn, cs)} height="6" fill={C.bronze} /></g>}
    </>}</Canvas>
  </SimFrame>;
}

const biruniSteps = [
  { title: 'Önce dağın yüksekliği', body: 'Bîrûnî’nin geometrisinde önce gözlem yerinin düzlüğe göre yüksekliğini bilmek gerekir. Burada yükseklik, deneyin başlangıç bilgisidir.' },
  { title: 'Yatay çizginin altındaki ufuk', body: 'Dağın tepesinden bakınca uzak ufuk, göz hizasındaki yatay çizginin biraz altında kalır. Bu küçük alçalma açısını ölç.' },
  { title: 'Ufka değen bir doğru', body: 'Bakış çizgisi ideal küreye ufukta teğet olur. Merkez, tepe ve ufkun oluşturduğu dik üçgen, dağın yüksekliğini Dünya’nın yarıçapına bağlar.' },
  { title: 'Küçük açının etkisini araştır', body: 'Yüksekliği ve ufuk alçalmasını değiştir. İstersen örnek bir atmosfer düzeltmesi ekle. Küçük açı değişimlerinin sonucu ne kadar değiştirdiğine dikkat et.' },
];

function BiruniSimulator() {
  const [step, setStep] = useState(0), [numbers, setNumbers] = useState(false), [height, setHeight] = useState(300), [dip, setDip] = useState(.57), [refraction, setRefraction] = useState(false);
  const free = step === 3, h = free ? height : 300, delta = free ? dip : .57, corrected = delta + (free && refraction ? .03 : 0), co = Math.cos(rad(corrected)), radiusKm = h * co / (1 - co) / 1000;
  const ox = 277, oy = 354, r = 185 + 22 * Math.sqrt(h / 1500), visualDip = Math.min(46, 18 + corrected * 25), top = { x: ox, y: oy - r / Math.cos(rad(visualDip)) }, q = { x: ox + r * Math.sqrt(1 - (r / (oy - top.y)) ** 2), y: oy - r * r / (oy - top.y) };
  return <SimFrame title="Bir dağın tepesinden Dünya’ya" kicker="BÎRÛNÎ · UFUK GEOMETRİSİ" steps={biruniSteps} step={step} setStep={setStep} numbers={numbers} setNumbers={setNumbers}
    caption="Ufka uzanan bakış, ideal küreye teğettir. Dağ yüksekliği ve açı görünürlük için büyütülmüştür."
    controls={<><Range label="Gözlem yerinin yüksekliği" value={h} min={10} max={1500} step={10} unit="m" onChange={setHeight} disabled={!free} numbers={numbers} /><Range label="Görünen ufuk alçalması" value={delta} min={0.1} max={2} step={0.01} unit="°" onChange={setDip} disabled={!free} numbers={numbers} /><Toggle label="Örnek kırılma düzeltmesi" checked={refraction} onChange={setRefraction} disabled={!free} />{refraction && <p className="sim-inline-warning">Pedagojik varsayım: görünen açıya 0,03° eklenir. Bu sabit değer gerçek bir atmosfer modeli değildir.</p>}</>}
    metrics={<Metrics items={[["Yükseklik", `${fmt(h, 0)} m`], ["Kullanılan alçalma", `${fmt(corrected, 2)}°`], ["Bulunan yarıçap", `${fmt(radiusKm, 0)} km`]]} />}
    note="Atmosfer ufku görünürde yükseltebilir; kırılma hava koşullarına göre değişir. Bu modeldeki isteğe bağlı düzeltme bir tarihî ölçümü yeniden üretmez."
    math={<><p>Teğet ile ufka uzanan yarıçap diktir. Yükseklik ve yarıçap aynı uzunluk biriminde kullanılmalıdır.</p><Formula tex="\cos\delta=\frac{R}{R+h}\qquad R=\frac{h\cos\delta}{1-\cos\delta}" /><Formula tex={String.raw`R=\frac{${h}\cos(${fmt(corrected, 2).replace(',', '.')}^\circ)}{1-\cos(${fmt(corrected, 2).replace(',', '.')}^\circ)}\;\text{m}\approx ${Math.round(radiusKm)}\;\text{km}`} /><p>Başlangıçtaki 300 m ve 0,57° yaklaşık 6.062 km verir. Bu değer Bîrûnî’nin tarihî sonucunun kesin aktarımı değildir. Gerçek gözlemde düzlüğün seçimi, yüksekliğin ölçümü ve kırılma belirsizlik taşır.</p></>}>
    <Canvas title="Bîrûnî’nin dağ ve ufuk üçgeni" desc={`${h} metre yükseklik ve ${corrected} derece ufuk alçalması yaklaşık ${Math.round(radiusKm)} kilometre yarıçap veriyor.`}>{() => <>
      <circle cx={ox} cy={oy} r={r} fill={C.pale} stroke={C.green} strokeWidth="1.4" /><path d={`M${ox - 42} ${oy - r + 4}L${top.x} ${top.y}L${ox + 45} ${oy - r + 6}`} fill={C.bronze} fillOpacity=".18" stroke={C.bronze} strokeWidth="1.5" />
      <line x1={top.x} y1={top.y} x2="632" y2={top.y} stroke={C.ink} strokeDasharray="6 6" opacity=".5" /><text x="509" y={top.y - 14} className="svg-small">yerel yatay</text>
      <line x1={ox - 55} y1={top.y} x2={ox - 55} y2={oy - r} stroke={C.bronze} /><path d={`M${ox - 61} ${top.y}h12M${ox - 61} ${oy - r}h12`} stroke={C.bronze} /><text x={ox - 67} y={(top.y + oy - r) / 2 + 4} textAnchor="end" className="svg-metric">{numbers ? `${fmt(h, 0)} m` : 'yükseklik'}</text>
      {step > 0 && <><line x1={top.x} y1={top.y} x2={q.x} y2={q.y} stroke={C.bronze} strokeWidth="2.8" /><path d={arc(top.x, top.y, 71, 0, Math.atan2(q.y - top.y, q.x - top.x) * 180 / Math.PI)} fill="none" stroke={C.bronze} strokeWidth="2" /><text x="370" y={top.y + 22} className="svg-metric">{numbers ? `${fmt(corrected, 2)}°` : 'ufuk alçalması'}</text><circle cx={q.x} cy={q.y} r="5" fill={C.bronze} /><path d={`M${q.x + 11} ${q.y + 4}l57 25h67`} className="svg-leader" /><text x={q.x + 77} y={q.y + 21} className="svg-label">GÖRÜNEN UFUK</text></>}
      {step > 1 && <><line x1={ox} y1={oy} x2={q.x} y2={q.y} stroke={C.green} strokeWidth="1.7" /><line x1={ox} y1={oy} x2={top.x} y2={top.y} stroke={C.green} strokeWidth="1.5" strokeDasharray="6 5" /><text x="355" y="288" className="svg-metric">{numbers ? `${fmt(radiusKm, 0)} km` : 'yarıçap'}</text><path d={`M${q.x - 12} ${q.y - 10}l-9 11 11 9`} fill="none" stroke={C.green} strokeWidth="1.2" /></>}
      <circle cx={top.x} cy={top.y} r="5" fill={C.ink} /><text x="129" y={top.y - 17} className="svg-label">GÖZLEM YERİ</text><path d={`M229 ${top.y - 21}L265 ${top.y - 5}`} className="svg-leader" />
      <circle cx={ox} cy={oy} r="4" fill={C.ink} /><text x={ox - 29} y={oy + 25} className="svg-small">Dünya’nın merkezi</text>
    </>}</Canvas>
  </SimFrame>;
}

const triangleSteps = [
  { title: 'Yalnızca bir kenarı ölç', body: 'A ve B kuleleri arasındaki düz taban, yerde ölçülen ilk uzunluktur. Sonraki noktalara kadar yürümek zorunda kalmadan ağı büyüteceksin.' },
  { title: 'Üçüncü kuleyi iki yerden gör', body: 'İki uçtan C kulesine bak. Bilinen taban ve gözlenen açılar, üçgenin öteki kenarlarını belirlemeye yeter.' },
  { title: 'Bir üçgenden diğerine', body: 'Bulduğun bir kenar, sonraki üçgenin tabanı olabilir. Böylece ölçüm, bir kule zinciri boyunca ilerler. Açılardaki belirsizlik de zincirle birlikte taşınır.' },
  { title: 'Haritaya yeni kuleler yerleştir', body: 'Haritaya dokunarak ya da “Kule ekle” düğmesiyle ağı kur. Çok dar üçgenlerin nasıl oluştuğuna bak. Kesikli alan, birikimi anlatan basitleştirilmiş bir belirsizlik gösterimidir.' },
];
const basePoints = [{ x: 130, y: 344 }, { x: 302, y: 344 }];
const demoPoints = [{ x: 228, y: 168 }, { x: 430, y: 206 }, { x: 545, y: 98 }];
function angleAt(a, b, c) { const u = { x: a.x - b.x, y: a.y - b.y }, v = { x: c.x - b.x, y: c.y - b.y }; return Math.acos(Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))))) * 180 / Math.PI; }

function TriangulationSimulator() {
  const [step, setStep] = useState(0), [numbers, setNumbers] = useState(false), [points, setPoints] = useState([...basePoints, demoPoints[0]]), [baseline, setBaseline] = useState(100), [error, setError] = useState(.5);
  const free = step === 3, p = free ? points : step === 0 ? basePoints : [...basePoints, ...demoPoints.slice(0, step)], base = free ? baseline : 100, e = free ? error : .5, count = Math.max(0, p.length - 2), scale = base / 172;
  const last = p[p.length - 1], span = Math.hypot(last.x - p[0].x, last.y - p[0].y) * scale;
  const uncertainty = span * rad(e) * Math.pow(Math.max(1, count), 1.5);
  const angles = p.length > 2 ? [angleAt(p[1], p[0], p[2]), angleAt(p[0], p[1], p[2]), angleAt(p[0], p[2], p[1])] : [];
  const add = () => { if (!free || points.length >= 5) return; setPoints(v => { const candidate = [...demoPoints, { x: 590, y: 300 }, { x: 80, y: 90 }].find(q => v.every(t => Math.hypot(t.x - q.x, t.y - q.y) > 62)); return candidate ? [...v, candidate] : v; }); };
  const click = event => { if (!free || points.length >= 5) return; const rect = event.currentTarget.getBoundingClientRect(); const candidate = { x: Math.max(65, Math.min(655, (event.clientX - rect.left) / rect.width * 720)), y: Math.max(65, Math.min(360, (event.clientY - rect.top) / rect.height * 460)) }; if (points.every(v => Math.hypot(v.x - candidate.x, v.y - candidate.y) > 62)) setPoints(v => [...v, candidate]); };
  return <SimFrame title="Bir tabandan bir ülkenin haritasına" kicker="ÜÇGENLEME · ÖLÇÜM AĞLARI" steps={triangleSteps} step={step} setStep={setStep} numbers={numbers} setNumbers={setNumbers}
    caption={free ? 'Boş bir yere dokunarak en fazla beş kule yerleştir. Klavyeyle haritaya odaklanıp Enter da kullanabilirsin.' : 'A–B tabanı sabittir; yeni kuleler önceden ölçülmüş kenarlara bağlanır.'}
    controls={<><Range label="Ölçülen A–B tabanı" value={base} min={50} max={500} step={10} unit="m" onChange={setBaseline} disabled={!free} numbers={numbers} /><Range label="Açı belirsizliği" value={e} min={0.1} max={2} step={0.1} unit="°" onChange={setError} disabled={!free} numbers={numbers} /><div className="sim-button-row"><button type="button" onClick={add} disabled={!free || points.length >= 5}>+ Kule ekle</button><button type="button" onClick={() => setPoints(v => v.slice(0, -1))} disabled={!free || points.length <= 2}>Son kuleyi kaldır</button></div></>}
    metrics={<Metrics items={[["Ölçülen taban", `${fmt(base, 0)} m`], ["Kurulan üçgen", `${count}`], ["Başlangıçtan son kuleye", `${fmt(span, 0)} m`, `Gösterim belirsizliği: ±${fmt(uncertainty, 1)} m`]]} />}
    note="Belirsizlik alanı kalibre edilmiş bir ölçüm sonucu değildir. Hataların ağda birikmesini anlatan basitleştirilmiş bir görselleştirmedir."
    math={<><p>İlk üçgende bilinen taban ve iki açıdan üçüncü açı, ardından öteki kenarlar bulunur. Çok küçük açılar, açı hatalarına duyarlılığı artırır.</p><Formula tex="\gamma=180^\circ-\alpha-\beta,\qquad AC=AB\frac{\sin\beta}{\sin\gamma}" />{angles.length > 0 && <p>İlk üçgenin açıları: {fmt(angles[0])}°, {fmt(angles[1])}° ve {fmt(angles[2])}°.</p>}<Formula tex="u_{\text{gösterim}}=L\,\varepsilon_{\text{radyan}}\,n^{3/2}" /><p>Son ifade yalnızca bu çizimin belirsizlik ölçeğidir; gerçek ağ dengelemesi, kovaryans hesabı veya saha doğruluğu iddiası taşımaz. L başlangıç ile son kule arasındaki uzaklık, n üçgen sayısıdır.</p></>}>
    <Canvas title={free ? 'Üçgenleme haritası: yeni kule ekle' : 'Bir taban üzerine kurulan üçgenleme ağı'} desc={free ? 'Boş bir konuma tıkla veya Enter ile örnek sıradaki kuleyi ekle. En fazla beş kule. İlk iki kule sabittir.' : `${count} üçgenden oluşan ölçüm ağı.`} onClick={click} onKeyDown={event => { if (free && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); add(); } }} interactive={free}>{() => <>
      <path d="M65 100Q200 40 330 120T653 60M67 123Q213 64 332 144T653 86M66 148Q216 91 334 169T653 112M70 410Q235 354 376 405T653 370" stroke={C.green} strokeOpacity=".12" strokeWidth="1" fill="none" />
      {p.slice(2).map((v, i) => <g key={i}><path d={`M${p[i].x} ${p[i].y}L${p[i + 1].x} ${p[i + 1].y}L${v.x} ${v.y}Z`} fill={i % 2 ? C.bronze : C.green} fillOpacity=".055" stroke={i % 2 ? C.bronze : C.green} strokeWidth="1.5" />{i === count - 1 && <circle cx={v.x} cy={v.y} r={10 + e * (i + 1) * 13} fill={C.bronze} fillOpacity=".07" stroke={C.bronze} strokeDasharray="4 5" opacity=".7" />}</g>)}
      <path d={`M${p[0].x} ${p[0].y + 28}H${p[1].x}`} stroke={C.bronze} strokeWidth="2" /><path d={`M${p[0].x} ${p[0].y + 22}v12M${p[1].x} ${p[1].y + 22}v12`} stroke={C.bronze} /><text x="216" y="402" textAnchor="middle" className="svg-label" fill={C.bronze}>{numbers ? `${fmt(base, 0)} m` : 'ÖLÇÜLEN TABAN'}</text>
      {p.map((v, i) => <g key={i}><circle cx={v.x} cy={v.y} r="20" fill={C.paper} /><path d={`M${v.x - 8} ${v.y + 8}h16v-20h-4v5h-8v-5h-4ZM${v.x - 12} ${v.y + 8}h24M${v.x} ${v.y + 7}v-8`} fill={i < 2 ? C.ink : C.green} stroke={i < 2 ? C.ink : C.green} strokeWidth="2" /><text x={v.x + 24} y={v.y + 3} className="svg-metric">{String.fromCharCode(65 + i)}</text></g>)}
      {free && points.length < 5 && <g opacity=".6"><circle cx="604" cy="315" r="19" fill="none" stroke={C.green} strokeDasharray="3 4" /><path d="M596 315h16M604 307v16" stroke={C.green} /><text x="604" y="354" textAnchor="middle" className="svg-small">yeni bir kule ekle</text></g>}
      <text x="70" y="38" className="svg-small">ŞEMATİK ARAZİ · SABİT İLK İKİ KULE</text>
    </>}</Canvas>
  </SimFrame>;
}

const astrolabeSteps = [
  { title: 'Ufku başlangıç çizgisi yap', body: 'Bir usturlap, gökteki bir hedefin ufkun ne kadar üstünde olduğunu ölçmene yardım eder. Aletin dik tutulduğunu ve ölçeğin düzgün olduğunu varsayalım.' },
  { title: 'Nişan kolunu hedefe çevir', body: 'Nişan kolunu gökteki hedefe doğru döndür. Kol ile yatay çizgi arasındaki açıklık, hedefin o andaki yüksekliğidir.' },
  { title: 'Hangi hedefi ölçtüğün önemli', body: 'İdeal gök kutbunun yüksekliği, kuzey yarımkürede bulunduğun yerin enlemini verir. Sıradan bir yıldızın yüksekliği ise tek başına enlem değildir.' },
  { title: 'Gök kutbu ve yıldızı karşılaştır', body: 'Hedefi değiştir; nişan kolunu kaydırıcıyla veya ok tuşlarıyla döndür. Bir yıldız ölçümünü doğrudan enlem diye okumamaya dikkat et.' },
];

function AstrolabeSimulator() {
  const [step, setStep] = useState(0), [numbers, setNumbers] = useState(false), [aim, setAim] = useState(30), [target, setTarget] = useState('pole'), [latitude, setLatitude] = useState(39);
  const free = step === 3, chosen = free ? target : 'pole', phi = free ? latitude : 39, altitude = chosen === 'pole' ? phi : 61, a = free ? aim : [8, 27, 39][step], aligned = Math.abs(a - altitude) < 1.5;
  const cx = 320, cy = 257, r = 160, star = point(cx, cy, 231, -altitude), tip = point(cx, cy, 198, -a), end = point(cx, cy, 155, 180 - a);
  return <SimFrame title="Gökyüzündeki yüksekliği okumak" kicker="USTURLAP · AÇI & YÖN BULMA" steps={astrolabeSteps} step={step} setStep={setStep} numbers={numbers} setNumbers={setNumbers}
    caption="Basitleştirilmiş bir usturlap okuması. Hedefi gözlemek, aleti tanımak ve ölçüyü yorumlamak ayrı adımlardır."
    controls={<><div className="sim-segment" role="group" aria-label="Gökyüzü hedefi"><button type="button" aria-pressed={chosen === 'pole'} onClick={() => setTarget('pole')} disabled={!free}>Gök kutbu</button><button type="button" aria-pressed={chosen === 'star'} onClick={() => setTarget('star')} disabled={!free}>Örnek yıldız</button></div><Range label="Nişan kolunun yüksekliği" value={a} min={0} max={85} step={0.5} unit="°" onChange={setAim} disabled={!free} numbers={numbers} hint="Odaklandıktan sonra ok tuşlarıyla ince ayar yapabilirsin." />{chosen === 'pole' && <Range label="Gözlem yerinin enlemi" value={phi} min={15} max={65} step={1} unit="° K" onChange={setLatitude} disabled={!free} numbers={numbers} />}<button className="sim-small-button" type="button" onClick={() => setAim(altitude)} disabled={!free}>Nişanı hedefe getir</button><p className={`sim-alignment ${aligned ? 'is-aligned' : ''}`} aria-live="polite">{aligned ? '● Nişan hedefle hizalandı.' : '○ Nişan kolunu hedefe yaklaştır.'}</p></>}
    metrics={<Metrics items={[["Nişan yüksekliği", `${fmt(a)}°`], ["Hedef yüksekliği", `${fmt(altitude)}°`], [chosen === 'pole' ? 'Kutup hizasında enlem' : 'Yıldız ölçümünün anlamı', chosen === 'pole' ? aligned ? `${fmt(phi, 0)}° K` : 'Önce hizala' : 'Tek başına enlem vermez']]} />}
    note="Gök kutbu bir geometrik yöndür; Kutup Yıldızı onun tam üzerinde değildir. Gerçek gözlem, hedefe ve döneme uygun düzeltme ister."
    math={<><p>İdeal bir kuzey yarımküre gözleminde, atmosfer ve yerel ufuk etkileri dışarıda bırakıldığında:</p><Formula tex="h_{\text{gök kutbu}}=\varphi" /><p>Herhangi bir yıldız için yükseklik; enlem, yıldızın dik açıklığı ve gözlem anındaki saat açısına bağlıdır.</p><Formula tex="\sin h=\sin\varphi\sin\delta+\cos\varphi\cos\delta\cos H" /><p>Burada δ yıldızın dik açıklığıdır; Bîrûnî deneyindeki ufuk alçalması simgesiyle aynı fiziksel büyüklük değildir. Örnek yıldızın yüksekliği bu alıştırmada sabit tutulur; göğün zamana bağlı simülasyonu yapılmaz.</p></>}>
    <Canvas title="Hedefe çevrilen usturlap nişan kolu" desc={`Nişan ${a} derecede. Hedef ${chosen === 'pole' ? 'gök kutbu' : 'örnek yıldız'}, yüksekliği ${altitude} derece. ${aligned ? 'Nişan hizalı.' : 'Nişan henüz hizalı değil.'}`}>{() => <>
      <circle cx={cx} cy={cy} r={r + 13} fill={C.bronze} fillOpacity=".06" stroke={C.bronze} strokeWidth="2" /><circle cx={cx} cy={cy} r={r} fill={C.paper} stroke={C.bronze} strokeWidth="1" /><circle cx={cx} cy={cy} r="125" fill="none" stroke={C.bronze} strokeOpacity=".2" />
      {Array.from({ length: 73 }, (_, i) => i * 5).map(deg => { const p = point(cx, cy, r - (deg % 15 === 0 ? 14 : 7), deg), q = point(cx, cy, r - 2, deg); return <line key={deg} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.bronze} strokeWidth={deg % 15 === 0 ? 1.3 : .6} />; })}
      {[0, 30, 60, 90].map(deg => { const t = point(cx, cy, 135, -deg); return <text key={deg} x={t.x} y={t.y + 4} textAnchor="middle" className="svg-small">{numbers ? `${deg}°` : deg === 0 ? 'ufuk' : deg === 90 ? 'başucu' : ''}</text>; })}
      <path d={`M${cx - 215} ${cy}H${cx + 275}`} stroke={C.ink} strokeDasharray="5 6" strokeOpacity=".4" /><text x="568" y={cy + 22} className="svg-label">UFUK</text>
      <line x1={cx} y1={cy} x2={cx} y2="439" stroke={C.ink} opacity=".4" /><path d={`M${cx} 426l-6 10h12Z`} fill={C.ink} /><text x={cx + 15} y="439" className="svg-small">çekül doğrultusu</text>
      <path d={`M${end.x} ${end.y}L${tip.x} ${tip.y}`} stroke={C.ink} strokeWidth="9" strokeLinecap="round" /><path d={`M${end.x} ${end.y}L${tip.x} ${tip.y}`} stroke={C.paper} strokeOpacity=".5" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="9" fill={C.bronze} stroke={C.paper} strokeWidth="3" /><circle cx={tip.x} cy={tip.y} r="6" fill={C.paper} stroke={C.ink} strokeWidth="2" />
      <line x1={tip.x} y1={tip.y} x2={point(cx, cy, 252, -a).x} y2={point(cx, cy, 252, -a).y} stroke={C.green} strokeWidth="1.5" strokeDasharray="4 5" />
      <circle cx={star.x} cy={star.y} r="15" fill={aligned ? C.green : C.bronze} fillOpacity=".12" /><path d={`M${star.x} ${star.y - 8}l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2Z`} fill={aligned ? C.green : C.bronze} />
      <text x={star.x + 23} y={star.y - 4} className="svg-label">{chosen === 'pole' ? 'GÖK KUTBU' : 'ÖRNEK YILDIZ'}</text><text x={star.x + 23} y={star.y + 16} className="svg-small">{numbers ? `${fmt(altitude)}° yükseklik` : chosen === 'pole' ? 'ideal kutup yönü' : 'tek bir gözlem anı'}</text>
      {step > 0 && <path d={arc(cx, cy, 58, -a, 0)} fill="none" stroke={C.green} strokeWidth="2" />}
      <path d={`M${cx - 9} ${cy - r - 13}v-14a9 9 0 0 1 18 0v14`} fill="none" stroke={C.bronze} strokeWidth="2" />
    </>}</Canvas>
  </SimFrame>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const onChange = () => setReduced(media.matches); media.addEventListener?.('change', onChange); return () => media.removeEventListener?.('change', onChange); }, []);
  return reduced;
}
const orangeSteps = [
  { title: 'Aynı kuzey, farklı ufuklar', body: 'Portakalı Dünya olarak düşün. Dönme eksenini uzak göğe doğru uzattığında gök kutbunun yönünü bulursun. Bu yön, gözlemcinin portakal üzerindeki yerine göre değişmez.' },
  { title: 'Gözlemciyi kuzeye taşı', body: 'Gözlemci kuzeye giderken yerel dik doğrultusu ve ona dik olan ufuk birlikte döner. Gök kutbunun yönü aynı kaldığı için kutup artık ufkun daha üstünde görünür.' },
  { title: 'Ufuk ile kutup arasını oku', body: 'Ekvatorda ideal gök kutbu ufuktadır. Kuzey Kutbu’na yaklaştıkça başucuna yaklaşır. Bu basit geometri, gökten yapılan bir açı ölçümünün yerdeki konumu nasıl anlattığını gösterir.' },
  { title: 'Kuzeye gittikçe ne değişiyor?', body: 'Gözlemciyi kaydır veya yavaşça gezdir. Sabit kutup yönüyle eğilen yerel ufku karşılaştır. Enlem büyüdükçe gök kutbu yüksekliğinin de aynı miktarda arttığını gör.' },
];

function OrangeSimulator() {
  const [step, setStep] = useState(0), [numbers, setNumbers] = useState(false), [latitude, setLatitude] = useState(39), [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion(), free = step === 3, phi = free ? latitude : [0, 30, 60][step], cx = 318, cy = 285, r = 140, p = point(cx, cy, r, -phi), tip = point(cx, cy, r + 43, -phi);
  const tangent = { x: -Math.sin(rad(phi)), y: -Math.cos(rad(phi)) };
  useEffect(() => { if (!playing || !free || reduced) return; let direction = 1; const timer = window.setInterval(() => setLatitude(v => { if (v >= 80) direction = -1; if (v <= 0) direction = 1; return v + direction; }), 110); return () => window.clearInterval(timer); }, [playing, free, reduced]);
  useEffect(() => { if (!free || reduced) setPlaying(false); }, [free, reduced]);
  return <SimFrame title="Portakalın üstündeki gözlemci" kicker="EVDE DENE · AYNI GÖK, FARKLI UFUK" steps={orangeSteps} step={step} setStep={setStep} numbers={numbers} setNumbers={setNumbers}
    caption="Kuzey yarımküre için ideal geometri. Oklar, dönme eksenine paralel olan uzak gök kutbu yönünü gösterir."
    controls={<><Range label="Gözlemcinin kuzey enlemi" value={phi} min={0} max={80} step={1} unit="° K" onChange={v => { setLatitude(v); setPlaying(false); }} disabled={!free} numbers={numbers} /><div className="sim-button-row"><button type="button" onClick={() => reduced ? setLatitude(v => v >= 75 ? 0 : Math.min(80, v + 15)) : setPlaying(v => !v)} disabled={!free}>{reduced ? 'Sonraki enleme geç' : playing ? 'Ⅱ Gezintiyi durdur' : '▷ Gözlemciyi gezdir'}</button><button type="button" onClick={() => { setLatitude(0); setPlaying(false); }} disabled={!free}>Ekvatora dön</button></div>{reduced && <p className="sim-input-hint">Hareket tercihin için animasyon yerine adımlı ilerleme açık.</p>}</>}
    metrics={<Metrics items={[["Kuzey enlemi", `${fmt(phi, 0)}° K`], ["Gök kutbunun yüksekliği", `${fmt(phi, 0)}°`], ["Kutup ile yerel dik arasındaki açı", `${fmt(90 - phi, 0)}°`]]} />}
    note="Kutup Yıldızı, ideal gök kutbunun tam üzerinde değildir. Gerçek yıldız gözleminde döneme ve gözlem anına uygun düzeltme gerekir. Portakal, bu temel geometriyi düşünmek için bir modeldir."
    math={<><p>Yerel ufuk, gözlemcinin dik doğrultusuna diktir. İdeal kürede, kuzey yarımküredeki gök kutbu yüksekliği kuzey enlemine eşittir.</p><Formula tex="h_{\text{gök kutbu}}=\varphi" /><p>Gök kutbu yönü dönme eksenine paraleldir. Yerel dik ile bu yön arasındaki açı, enlemi bir dik açıya tamamlar.</p><Formula tex="\theta_{\text{dik ile kutup}}=90^\circ-\varphi" /><p>Gök kutbu geometrik bir yöndür; herhangi bir yıldızın yüksekliğiyle aynı kavram değildir. Atmosfer ve yerel ufuk engelleri bu basit çizimde yer almaz.</p></>}>
    <Canvas title="Portakal üzerinde kuzeye taşınan gözlemci" desc={`Gözlemci ${phi} derece kuzey enleminde. İdeal gök kutbunun yerel ufuktan yüksekliği ${phi} derece. Kutup yönü sabit kalırken yerel ufuk dönüyor.`}>{({ arrow, id }) => <>
      <defs><radialGradient id={`${id}-orange`} cx="68%" cy="35%" r="83%"><stop offset="0" stopColor="#d5a465" /><stop offset=".7" stopColor="#bb8045" /><stop offset="1" stopColor="#925d34" /></radialGradient><clipPath id={`${id}-clip`}><circle cx={cx} cy={cy} r={r} /></clipPath></defs>
      {[563, 610, 657].map(x => <line key={x} x1={x} x2={x} y1="205" y2="112" stroke={C.bronze} strokeWidth="1.4" opacity=".55" markerEnd={`url(#${arrow})`} />)}
      <text x="541" y="78" className="svg-label">GÖK KUTBU YÖNÜ</text><text x="541" y="96" className="svg-small">dönme eksenine paralel</text>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-orange)`} stroke={C.bronze} strokeWidth="1.3" />
      <g clipPath={`url(#${id}-clip)`} opacity=".18">{Array.from({ length: 72 }, (_, i) => <circle key={i} cx={cx - 145 + (i * 47) % 300} cy={cy - 147 + (i * 79) % 300} r={i % 3 === 0 ? 2 : 1.2} fill="#62391e" />)}</g>
      <ellipse cx={cx} cy={cy} rx={r} ry="24" fill="none" stroke={C.paper} strokeWidth="1" strokeOpacity=".65" /><path d={`M${cx} ${cy - r - 38}V${cy + r + 18}`} stroke={C.ink} strokeDasharray="5 6" opacity=".45" />
      <text x={cx - 20} y="72" textAnchor="middle" className="svg-label">KUZEY KUTBU</text><text x={cx - 20} y="89" textAnchor="middle" className="svg-small">dönme ekseni</text><text x="130" y={cy + 5} textAnchor="end" className="svg-label">EKVATOR</text><path d={`M139 ${cy}h30`} className="svg-leader" />
      <path d={`M${cx} ${cy - r}q-15 -20 -4 -29q16 10 12 28`} fill={C.green} /><path d={`M${cx - 4} ${cy - r - 17}q-17 -20 -41 -13q7 25 34 25`} fill={C.green} opacity=".8" />
      <ellipse cx={cx} cy={p.y} rx={Math.max(5, r * Math.cos(rad(phi)))} ry="12" fill="none" stroke={C.paper} strokeOpacity=".65" strokeDasharray="4 4" />
      <path d={`M${cx} ${cy}L${p.x} ${p.y}`} stroke={C.paper} strokeWidth="1.4" strokeDasharray="5 5" opacity=".7" />
      <path d={arc(cx, cy, 42, -phi, 0)} fill="none" stroke={C.paper} strokeWidth="2" />
      <line x1={p.x - tangent.x * 85} y1={p.y - tangent.y * 85} x2={p.x + tangent.x * 97} y2={p.y + tangent.y * 97} stroke={C.green} strokeWidth="2" />
      <text x={p.x + tangent.x * 100 - 5} y={p.y + tangent.y * 100 - 12} textAnchor="middle" className="svg-small" fill={C.green}>yerel ufuk</text>
      <line x1={p.x} y1={p.y} x2={p.x} y2="43" stroke={C.bronze} strokeWidth="1.8" strokeDasharray="5 5" markerEnd={`url(#${arrow})`} />
      <path d={arc(p.x, p.y, 43, -90 - phi, -90)} fill="none" stroke={C.bronze} strokeWidth="2.5" />
      <line x1={p.x} y1={p.y} x2={tip.x} y2={tip.y} stroke={C.ink} strokeWidth="5" strokeLinecap="round" /><circle cx={p.x} cy={p.y} r="6" fill={C.paper} stroke={C.ink} strokeWidth="2" />
      <text x={p.x + 14} y={p.y - 39} className="svg-metric">{numbers ? `${fmt(phi, 0)}°` : phi === 0 ? 'kutup ufukta' : 'kutup yüksekliği'}</text>
      <text x={tip.x + 13} y={tip.y + 5} className="svg-small">yerel dik</text>
      <text x="67" y="366" className="svg-label">UFUK GÖZLEMCİYLE DÖNER</text><text x="67" y="387" className="svg-small">Kutup yönü aynı kalır.</text><path d={`M240 366L${p.x - 9} ${p.y + 12}`} className="svg-leader" />
    </>}</Canvas>
  </SimFrame>;
}

const simulations = [
  { id: 'eratosthenes', label: 'Eratosthenes', index: '01', component: EratosthenesSimulator },
  { id: 'sincar', label: 'Sincar', index: '02', component: SincarSimulator },
  { id: 'biruni', label: 'Bîrûnî', index: '03', component: BiruniSimulator },
  { id: 'triangulation', label: 'Üçgenleme', index: '04', component: TriangulationSimulator },
  { id: 'astrolabe', label: 'Usturlap', index: '05', component: AstrolabeSimulator },
  { id: 'orange', label: 'Portakal deneyi', index: '06', component: OrangeSimulator },
];

export default function Simulations({ initial = 'eratosthenes' }) {
  const aliases = { 'üçgenleme': 'triangulation', ucgenleme: 'triangulation', usturlap: 'astrolabe', portakal: 'orange', 'bîrûnî': 'biruni' };
  const preferred = aliases[initial] || initial;
  const [active, setActive] = useState(simulations.some(s => s.id === preferred) ? preferred : 'eratosthenes');
  const id = useId().replace(/:/g, '');
  const current = simulations.find(s => s.id === active), Component = current.component;
  const selectTab = (event, index) => { let next; if (event.key === 'ArrowRight') next = (index + 1) % simulations.length; else if (event.key === 'ArrowLeft') next = (index + simulations.length - 1) % simulations.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = simulations.length - 1; else return; event.preventDefault(); setActive(simulations[next].id); event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus(); };
  return <div className="simulations-module"><div className="sim-tabs" role="tablist" aria-label="Deney seç">{simulations.map((sim, i) => <button type="button" role="tab" id={`${id}-tab-${sim.id}`} aria-controls={`${id}-panel-${sim.id}`} aria-selected={active === sim.id} tabIndex={active === sim.id ? 0 : -1} key={sim.id} onClick={() => setActive(sim.id)} onKeyDown={event => selectTab(event, i)}><span>{sim.index}</span>{sim.label}</button>)}</div><div role="tabpanel" id={`${id}-panel-${active}`} aria-labelledby={`${id}-tab-${active}`} tabIndex="0" className="sim-tab-panel"><Component key={active} /></div></div>;
}
