import React, {useId, useMemo, useState} from 'react';
import {scaleLinear} from 'd3';
import chapterData from '../content/chapters.json';
import './Comparison.css';

const integer = new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 0});
const decimal = new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 1});
const km = value => `${integer.format(value)} km`;
const STADION = {min: 157.5, max: 185};
const ARAB_MILE = {min: 1800, max: 2000};
const TOISE_METRES = 1.9490366;
const chartWidth = 960;
const plot = {left: 247, right: 830, top: 60, row: 69};

const noSingleNumber = [
  {id: 'ptolemy', label: 'Batlamyus', note: 'Birçok kaynaktan bir Dünya haritası kurdu. Benimsediği küçük Dünya ölçeğini, yeni ve bağımsız bir çevre ölçümü gibi ikinci kez saymıyoruz.'},
  {id: 'aryabhata', label: 'Aryabhata', note: 'Yaklaşık 4.967 yojana aktarılır. Yojananın bağlama uygun uzunluğu kesinleştirilmeden bir kilometre sonucu ve başarı yüzdesi seçmiyoruz.'},
  {id: 'biruni', label: 'Biruni', note: 'Dağ yöntemi belgeli. Arşın dönüşümü, çok küçük ufuk açısı ve atmosferik kırılma, tek ve kesin bir kilometre sonucunu sorunlu kılıyor.'},
  {id: 'fernel', label: 'Fernel', note: 'Akademi kaynağı bir derece için 56.746 toise aktarır. Dönemin birimi ve kaynaklar arasındaki sayısal farklar yüzünden kesin kilometreye zorlamıyoruz.'},
  {id: 'snellius', label: 'Snellius', note: 'Üçgenleme ağı belgeli. Burada kullanılan açık kaynak, karşılaştırılabilir tek bir çevre sonucu sağlamadığı için tahmin eklemiyoruz.'},
  {id: 'french-expeditions', label: 'Fransız seferleri', note: 'Amaç, farklı enlemlerde aynı gök değişimine karşılık gelen yolu karşılaştırmaktı. Sonuç Dünya’nın basıklığı; tek bir küre çevresi sayısı değil.'},
  {id: 'metre', label: 'Metrenin doğuşu', note: 'Yaklaşık 40.000 km, ilk metre tasarımının dayandığı meridyen çevresidir. Birim tanımını bağımsız bir ölçüm başarısı gibi puanlamıyoruz.'},
  {id: 'longitude', label: 'Harrison ve boylam', note: 'Dünya üzerinde doğu-batı konumunu buldu. Dünya’nın çevresini yeniden ölçmedi.'},
  {id: 'greenwich', label: 'Greenwich', note: 'Ortak sıfır boylamı üzerinde uzlaşıldı. Konumların başlangıç çizgisi seçildi; yeni bir çevre değeri ölçülmedi.'},
  {id: 'gps', label: 'Uydular ve GPS', note: 'Sürekli güncellenen bir Dünya modeli ve konum sistemi. Buradaki çağdaş referans, bu ölçüm geleneğinin ürünüdür; tek bir tarihî tahmin değildir.'},
];

function SourceLink({id, children = 'Kaynağı oku'}) {
  const chapter = chapterData.find(item => item.id === id);
  const source = chapter?.sources?.[0];
  return source ? <a href={source.url} target="_blank" rel="noreferrer">{children} <span aria-hidden="true">↗</span></a> : null;
}

function getRows(stadion, arabMile) {
  const stadionRow = (id, label, variant, count) => ({
    id: `${id}-${count}`, chapterId: id, label, variant,
    low: count * STADION.min / 1000,
    high: count * STADION.max / 1000,
    value: count * stadion / 1000,
    note: `${integer.format(count)} stadion; seçilen stadion ${decimal.format(stadion)} metre.`,
  });
  return [
    stadionRow('eratosthenes', 'Eratosthenes', '250.000 stadion aktarımı', 250000),
    stadionRow('eratosthenes', 'Eratosthenes', '252.000 stadion aktarımı', 252000),
    stadionRow('posidonius', 'Posidonius', '240.000 stadion aktarımı', 240000),
    stadionRow('posidonius', 'Posidonius', '180.000 stadion geleneği', 180000),
    {
      id: 'sincar', chapterId: 'sincar', label: 'Sincar ekipleri', variant: 'Bir derecede 56⅔ tarihî mil',
      low: 20400 * ARAB_MILE.min / 1000,
      high: 20400 * ARAB_MILE.max / 1000,
      value: 20400 * arabMile / 1000,
      note: `Tam turda 20.400 tarihî mil; seçilen mil ${integer.format(arabMile)} metre.`,
    },
    {
      id: 'picard', chapterId: 'picard', label: 'Picard', variant: 'Bir derecede 57.060 toise',
      low: 57060 * TOISE_METRES * 360 / 1000,
      high: 57060 * TOISE_METRES * 360 / 1000,
      value: 57060 * TOISE_METRES * 360 / 1000,
      note: 'Yaklaşık 1,949 metre toise; yerel dereceyi tam tura büyüten küre yaklaşımı. Birim bandı verilmedi.',
    },
  ];
}

export default function Comparison() {
  const uid = useId();
  const [stadion, setStadion] = useState(157.5);
  const [arabMile, setArabMile] = useState(1900);
  const [referenceKind, setReferenceKind] = useState('meridian');
  const [showNumbers, setShowNumbers] = useState(false);
  const reference = referenceKind === 'meridian' ? 40008 : 40075;
  const referenceName = referenceKind === 'meridian' ? 'Kutuplardan geçen çevre' : 'Ekvator çevresi';
  const rows = useMemo(() => getRows(stadion, arabMile), [stadion, arabMile]);
  const scale = useMemo(() => scaleLinear().domain([26000, 49000]).range([plot.left, plot.right]).nice(), []);
  const height = plot.top + rows.length * plot.row + 58;
  const bottom = plot.top + rows.length * plot.row - 17;
  const ticks = scale.ticks(5);

  return <div className="comparison-chart">
    <p className="comp-intro">Bir tarihî sayının kilometre karşılığı, kullandığın cetvele bağlı. Aşağıdaki noktalar seçtiğin birimi kullanır. Yatay bantlar, bu deneyde izin verilen birim seçimlerinin sonucu ne kadar değiştirdiğini gösterir.</p>

    <div className="comp-controls">
      <div className="comp-slider">
        <label htmlFor={`${uid}-stadion`}>Bir stadion <output htmlFor={`${uid}-stadion`}>{decimal.format(stadion)} metre</output></label>
        <input id={`${uid}-stadion`} type="range" min={STADION.min} max={STADION.max} step="0.5" value={stadion} aria-valuetext={`${decimal.format(stadion)} metre`} onChange={event => setStadion(Number(event.target.value))}/>
        <div className="comp-limits" aria-hidden="true"><span>157,5 m</span><span>185 m</span></div>
      </div>
      <div className="comp-slider">
        <label htmlFor={`${uid}-arab`}>Bir tarihî Arap mili <output htmlFor={`${uid}-arab`}>{integer.format(arabMile)} metre</output></label>
        <input id={`${uid}-arab`} type="range" min={ARAB_MILE.min} max={ARAB_MILE.max} step="10" value={arabMile} aria-valuetext={`${integer.format(arabMile)} metre`} onChange={event => setArabMile(Number(event.target.value))}/>
        <div className="comp-limits" aria-hidden="true"><span>1.800 m</span><span>2.000 m</span></div>
      </div>
    </div>

    <fieldset className="comp-reference">
      <legend>Hangi çevreyle karşılaştırıyoruz?</legend>
      <label><input type="radio" name={`${uid}-reference`} value="meridian" checked={referenceKind === 'meridian'} onChange={() => setReferenceKind('meridian')}/><span>Kutuplardan geçen <small>≈ 40.008 km</small></span></label>
      <label><input type="radio" name={`${uid}-reference`} value="equator" checked={referenceKind === 'equator'} onChange={() => setReferenceKind('equator')}/><span>Ekvator <small>≈ 40.075 km</small></span></label>
    </fieldset>
    <p className="comp-reference-note">Eski kuzey-güney yay ölçümleri için kutuplardan geçen çevre daha uygun bir karşılaştırmadır. Ekvator seçeneği, Dünya’nın tam küre olmamasının etkisini gösterir.</p>

    <div className="comp-chart-top">
      <div className="comp-key" aria-label="Grafik işaretleri"><span><i className="comp-dot-key"/> Seçilen birimle sonuç</span><span><i className="comp-band-key"/> Birim seçimi aralığı</span><span><i className="comp-ref-key"/> Çağdaş referans</span></div>
      <label className="comp-numbers"><input type="checkbox" checked={showNumbers} onChange={event => setShowNumbers(event.target.checked)}/> Sayıları göster</label>
    </div>

    <div className="comp-scroll" tabIndex="0" role="region" aria-label="Dünya çevresi karşılaştırma grafiği. Küçük ekranda yatay kaydırılabilir.">
      <svg viewBox={`0 0 ${chartWidth} ${height}`} width={chartWidth} height={height} role="img" aria-labelledby={`${uid}-title ${uid}-description`}>
        <title id={`${uid}-title`}>Tarihî Dünya ölçümlerinin seçilen birimlere göre karşılaştırılması</title>
        <desc id={`${uid}-description`}>{referenceName}, yaklaşık {km(reference)}. Noktalar seçili birimle çevreyi; bantlar öğretici birim seçimi aralığını gösterir. Bu bantlar istatistiksel güven aralığı değildir. Aynı veriler aşağıdaki erişilebilir tabloda yer alır.</desc>
        <text x="18" y="28" className="comp-svg-heading">TARİHÎ AKTARIM</text>
        <text x={plot.left} y="28" className="comp-svg-heading">DAHA KISA</text>
        <text x={plot.right} y="28" textAnchor="end" className="comp-svg-heading">DAHA UZUN</text>
        {ticks.map(tick => <g key={tick}>
          <line x1={scale(tick)} x2={scale(tick)} y1={plot.top - 15} y2={bottom + 13} className="comp-gridline"/>
          {showNumbers && <text x={scale(tick)} y={bottom + 39} textAnchor="middle" className="comp-axis-label">{integer.format(tick)}</text>}
        </g>)}
        <line x1={scale(reference)} x2={scale(reference)} y1={plot.top - 24} y2={bottom + 17} className="comp-reference-line"/>
        <text x={scale(reference)} y={height - 6} textAnchor="middle" className="comp-reference-label">{showNumbers ? `Referans ≈ ${km(reference)}` : 'Çağdaş referans'}</text>
        {rows.map((row, index) => {
          const y = plot.top + index * plot.row + 12;
          const close = Math.abs(row.value - reference) < 200;
          return <g key={row.id}>
            <title>{row.label}, {row.variant}: yaklaşık {km(row.value)}. {row.low !== row.high ? `Birim seçimi aralığı ${km(row.low)} ile ${km(row.high)}.` : 'Birim seçimi aralığı verilmedi.'}</title>
            <line x1="18" x2={chartWidth - 18} y1={y + 35} y2={y + 35} className="comp-row-rule"/>
            <text x="18" y={y - 2} className="comp-row-name">{row.label}</text>
            <text x="18" y={y + 18} className="comp-row-variant">{row.variant}</text>
            {row.low !== row.high && <>
              <line x1={scale(row.low)} x2={scale(row.high)} y1={y} y2={y} className="comp-interval"/>
              <line x1={scale(row.low)} x2={scale(row.low)} y1={y - 7} y2={y + 7} className="comp-endcap"/>
              <line x1={scale(row.high)} x2={scale(row.high)} y1={y - 7} y2={y + 7} className="comp-endcap"/>
            </>}
            <circle cx={scale(row.value)} cy={y} r="6" className={`comp-point${close ? ' comp-point-close' : ''}`}/>
            {showNumbers && <text x={plot.right + 20} y={y + 5} className="comp-value">≈ {km(row.value)}</text>}
          </g>;
        })}
        {showNumbers && <text x={plot.right + 20} y={bottom + 39} className="comp-axis-label">kilometre</text>}
      </svg>
    </div>
    <p className="comp-live" aria-live="polite">Stadion {decimal.format(stadion)} metre, tarihî mil {integer.format(arabMile)} metre. {showNumbers ? `Sincar aktarımının bu kabulle sonucu yaklaşık ${km(rows[4].value)}.` : 'Noktaları izleyerek birim seçiminin etkisini görebilirsin.'}</p>

    <aside className="comp-caution"><strong>Bant ne söylüyor?</strong><p>Bu aralıklar tarihî ölçüm hatasının bütünü veya istatistiksel bir güven aralığı değildir. Öğretim için seçilen stadion ve mil uzunluklarını deneriz. Farklı dönemlerdeki bütün birimleri kapsadıklarını varsaymayız. Sonraki yazarların farklı aktarımları ayrı satırlardadır; Posidonius’un iki sayısı aynı deneyin iki kesin sonucu gibi okunmamalıdır.</p></aside>

    <details className="comp-method-notes">
      <summary>Grafikteki dört yöntemin kaynakları ve kabulleri <span aria-hidden="true">+</span></summary>
      <ul>
        <li><strong>Eratosthenes.</strong> 250.000 ve 252.000 stadion, antik kaynak geleneğindeki farklı sayılardır. Her ikisi aynı seçili stadionla çevrilir. <SourceLink id="eratosthenes"/></li>
        <li><strong>Posidonius.</strong> Cleomedes 240.000 stadion anlatımını verir; sonraki gelenekte 180.000 de aktarılır. Aralarındaki fark yalnızca birim farkı değildir. <SourceLink id="posidonius"/></li>
        <li><strong>Sincar.</strong> Bir derece için 56⅔ mil, tam tur için 20.400 mil eder. 56 mil aktaran kaynak da vardır; burada 56⅔ aktarımını seçtik. <SourceLink id="sincar"/></li>
        <li><strong>Picard.</strong> Bir derecede 57.060 toise, dönemin toisesinin yaklaşık 1,949 metre kabulüyle tam tura büyütülür. Bu, yerel dereceyi her yerde aynı sayan küre yaklaşımıdır. Sayısal bir hata bandı uydurulmadı. <SourceLink id="picard"/></li>
      </ul>
    </details>

    <div className="comp-other-methods">
      <p className="comp-subheading">Diğer on bölümde neden tek bir nokta yok?</p>
      <div className="comp-method-grid">{noSingleNumber.map(method => <article key={method.id}>
        <h4>{method.label}</h4><p>{method.note}</p><SourceLink id={method.id}/>
      </article>)}</div>
    </div>

    <details className="comp-table-details">
      <summary>14 yöntemi erişilebilir tablo olarak oku <span aria-hidden="true">+</span></summary>
      <div className="comp-table-scroll" tabIndex="0" role="region" aria-label="On dört yöntem için karşılaştırma tablosu">
        <table>
          <caption>Seçili birimlerle öğretici karşılaştırma. Değerler yaklaşık kilometreye yuvarlanmıştır; aralıklar güven aralığı değildir.</caption>
          <thead><tr><th scope="col">Yöntem veya dönem</th><th scope="col">Seçili kabulle sonuç</th><th scope="col">Aralık ve açıklama</th><th scope="col">Kaynak</th></tr></thead>
          <tbody>{[...chapterData].sort((a, b) => a.year - b.year).map(chapter => {
            const chartRows = rows.filter(row => row.chapterId === chapter.id);
            const note = noSingleNumber.find(method => method.id === chapter.id);
            return <tr key={chapter.id}>
              <th scope="row">{note?.label || chartRows[0]?.label || chapter.person}</th>
              <td>{chartRows.length ? chartRows.map(row => <div key={row.id}><strong>≈ {km(row.value)}</strong><small>{row.variant}</small></div>) : 'Tek kilometre değeri verilmedi'}</td>
              <td>{chartRows.length ? chartRows.map(row => <div key={row.id}>{row.low !== row.high ? `${km(row.low)} – ${km(row.high)}. ` : 'Birim bandı yok. '}{row.note}</div>) : note?.note}</td>
              <td><SourceLink id={chapter.id}/></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
    </details>
    <p className="comp-reference-source">Çağdaş boyutlar: <a href="https://earth-info.nga.mil/index.php?action=wgs84&dir=wgs84" target="_blank" rel="noreferrer">NGA · WGS 84</a> ve <a href="https://pagasa.dost.gov.ph/learnings/faqs-and-trivias" target="_blank" rel="noreferrer">PAGASA · Dünya boyutları</a>.</p>
  </div>;
}
