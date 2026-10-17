import React, {Suspense, lazy, useEffect, useRef, useState} from 'react';
import ChapterScene from './ChapterScene.jsx';
import './ChapterReader.css';

const Formula = lazy(() => import('./Formula.jsx'));
const tabs = [['story', 'Hikâye'], ['method', 'Yöntem'], ['sources', 'Kaynaklar']];
const experimentChapters = new Set(['eratosthenes', 'sincar', 'biruni', 'snellius', 'picard', 'aryabhata']);

function getCompleted() {
  try {
    const value = JSON.parse(localStorage.getItem('dunya-completed') || '[]');
    return Array.isArray(value) ? value.filter(item => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function Arrow({direction = 'right'}) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={direction === 'left' ? 'reader-v2-arrow is-left' : 'reader-v2-arrow'}><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}

function BookMark() {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="12.5" /><ellipse cx="16" cy="16" rx="5.5" ry="12.5" /><path d="M3.5 16h25M6 8.5h20M6 23.5h20M16 3.5v25" /></svg>;
}

function ReaderQuiz({items = []}) {
  const [answers, setAnswers] = useState({});
  const answered = Object.keys(answers).length;
  const correct = items.reduce((sum, item, index) => sum + (answers[index] === item.correct ? 1 : 0), 0);
  if (!items.length) return null;

  return <section className="reader-v2-quiz" aria-labelledby="reader-v2-quiz-title">
    <div className="reader-v2-quiz-heading">
      <div><span className="reader-v2-kicker">KENDİNE SOR</span><h3 id="reader-v2-quiz-title">Fikri yakaladın mı?</h3></div>
      <span className="reader-v2-question-count">{answered}/{items.length}</span>
    </div>
    <p className="reader-v2-quiz-intro">Bir cevap seç. Sonra nedenini birlikte düşünelim.</p>
    {items.map((item, index) => {
      const selected = answers[index];
      const isCorrect = selected === item.correct;
      return <fieldset className="reader-v2-question" key={item.question}>
        <legend><span>{String(index + 1).padStart(2, '0')}</span>{item.question}</legend>
        <div className="reader-v2-answers">
          {item.options.map((option, optionIndex) => <button
            type="button"
            key={option}
            aria-pressed={selected === optionIndex}
            className={selected === optionIndex ? `is-selected ${isCorrect ? 'is-correct' : 'is-incorrect'}` : ''}
            onClick={() => setAnswers(value => ({...value, [index]: optionIndex}))}
          ><span className="reader-v2-answer-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span>{selected === optionIndex && <span aria-hidden="true" className="reader-v2-answer-mark">{isCorrect ? '✓' : '↻'}</span>}</button>)}
        </div>
        {selected !== undefined && <div className={`reader-v2-feedback ${isCorrect ? 'is-correct' : ''}`} role="status"><strong>{isCorrect ? 'Doğru düşünce.' : 'Bir ayrıntıya yeniden bakalım.'}</strong><p>{item.explanation}</p></div>}
      </fieldset>;
    })}
    {answered === items.length && <div className="reader-v2-quiz-result" role="status"><span>{correct === items.length ? 'Bütün fikirler yerli yerinde.' : `${items.length} soruda ${correct} doğru. Cevaplarını değiştirebilirsin.`}</span><button type="button" onClick={() => setAnswers({})}>Yeniden dene <span aria-hidden="true">↻</span></button></div>}
  </section>;
}

export default function ChapterReader({chapter, chapters = [], onClose, onSelect, onExperiment}) {
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const openerRef = useRef(null);
  const titleRef = useRef(null);
  const expandedRef = useRef(null);
  const tabRefs = useRef({});
  const [tab, setTab] = useState('story');
  const [completed, setCompleted] = useState(getCompleted);
  const [mathOpen, setMathOpen] = useState(false);
  const [sceneExpanded, setSceneExpanded] = useState(false);
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1000px)').matches);
  const isOpen = Boolean(chapter);
  const chronological = [...chapters].sort((a, b) => a.year - b.year);
  const currentIndex = chronological.findIndex(item => item.id === chapter?.id);
  const previous = chronological[currentIndex - 1];
  const next = chronological[currentIndex + 1];
  const done = completed.includes(chapter?.id);
  const progress = chronological.filter(item => completed.includes(item.id)).length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) return;
    openerRef.current = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = oldOverflow;
      if (dialog.open) dialog.close();
      if (openerRef.current?.isConnected && typeof openerRef.current.focus === 'function') {
        openerRef.current.focus({preventScroll: true});
      }
    };
  }, [isOpen]);

  useEffect(() => {
    setTab('story');
    setMathOpen(false);
    setSceneExpanded(false);
    scrollRef.current?.scrollTo({top: 0, behavior: 'instant'});
    const frame = requestAnimationFrame(() => titleRef.current?.focus({preventScroll: true}));
    return () => cancelAnimationFrame(frame);
  }, [chapter?.id]);

  useEffect(() => {
    const refresh = event => setCompleted(Array.isArray(event.detail?.completed) ? event.detail.completed : getCompleted());
    window.addEventListener('storage', refresh);
    window.addEventListener('dunya-progress', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('dunya-progress', refresh);
    };
  }, []);

  useEffect(() => {
    const expanded = expandedRef.current;
    if (!sceneExpanded || !expanded || !chapter) return;
    if (!expanded.open) expanded.showModal();
    return () => { if (expanded.open) expanded.close(); };
  }, [sceneExpanded, chapter?.id]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 1000px)');
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const markComplete = () => {
    if (!chapter) return;
    const values = done ? completed.filter(id => id !== chapter.id) : [...new Set([...completed, chapter.id])];
    setCompleted(values);
    try { localStorage.setItem('dunya-completed', JSON.stringify(values)); } catch { /* Reading works when storage is unavailable. */ }
    window.dispatchEvent(new CustomEvent('dunya-progress', {detail: {completed: values}}));
  };

  const selectTabByKeyboard = event => {
    const index = tabs.findIndex(([id]) => id === tab);
    let target;
    if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabs.length - 1;
    if (target !== undefined) {
      event.preventDefault();
      setTab(tabs[target][0]);
      tabRefs.current[tabs[target][0]]?.focus();
    }
  };

  return <dialog
    ref={dialogRef}
    className="reader-v2"
    aria-labelledby="reader-v2-title"
    onCancel={event => { event.preventDefault(); onClose?.(); }}
    onClose={event => { if (event.target === dialogRef.current && chapter) onClose?.(); }}
    onClick={event => { if (event.target === dialogRef.current) onClose?.(); }}
  >
    {chapter && <div className="reader-v2-shell">
      <header className="reader-v2-topbar">
        <span className="reader-v2-brand"><BookMark/><span>Dünya’yı <strong>Ölçmek.</strong></span></span>
        <span className="reader-v2-topbar-context"><span>KEŞİF DEFTERİ</span><i aria-hidden="true">/</i>{String(currentIndex + 1).padStart(2, '0')}<span> — {String(chronological.length).padStart(2, '0')}</span></span>
        <button type="button" className="reader-v2-close" onClick={onClose} aria-label="Bölümü kapat ve keşfe geri dön"><span>Keşfe dön</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </header>

      <div className="reader-v2-workspace">
        <nav className="reader-v2-sidebar" aria-label="Kitabın bölümleri">
          <div className="reader-v2-sidebar-intro"><span className="reader-v2-kicker">BİR FİKRİN YOLCULUĞU</span><p>Gölgeden<br/><em>gökyüzüne.</em></p></div>
          <label className="reader-v2-mobile-label" htmlFor="reader-v2-chapter-select">Bölüm seç</label>
          <select id="reader-v2-chapter-select" className="reader-v2-chapter-select" value={chapter.id} onChange={event => onSelect?.(chronological.find(item => item.id === event.target.value))}>
            {chronological.map((item, index) => <option key={item.id} value={item.id}>{String(index + 1).padStart(2, '0')} · {item.person}</option>)}
          </select>
          <ol className="reader-v2-chapter-list">{chronological.map((item, index) => <li key={item.id}><button type="button" aria-current={item.id === chapter.id ? 'page' : undefined} onClick={() => onSelect?.(item)}><span className="reader-v2-chapter-num">{String(index + 1).padStart(2, '0')}</span><span><strong>{item.person}</strong><small>{item.date}</small></span><span className="reader-v2-chapter-status" aria-label={completed.includes(item.id) ? 'Okundu' : undefined}>{completed.includes(item.id) ? '✓' : item.id === chapter.id ? '●' : ''}</span></button></li>)}</ol>
          <div className="reader-v2-reading-progress"><div><span>Yolculuğun</span><strong>{progress}<span> / {chronological.length}</span></strong></div><progress value={progress} max={chronological.length || 1} aria-label="Okunan bölüm sayısı"/><p>Her fikir, bir sonrakine açılır.</p></div>
        </nav>

        <div className="reader-v2-scroll" ref={scrollRef}>
          <div className="reader-v2-pages">
            <article className="reader-v2-article">
              <header className="reader-v2-hero">
                <div className="reader-v2-location"><span>{chapter.era}</span><span>{chapter.date}</span></div>
                <p className="reader-v2-person">{chapter.person}</p>
                <h1 id="reader-v2-title" ref={titleRef} tabIndex={-1}>{chapter.title}</h1>
                <p className="reader-v2-hook">{chapter.hook}</p>
                <div className="reader-v2-place"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>{chapter.place}</span></div>
              </header>

              {compact && <section className="reader-v2-inline-scene" aria-label="Ölçümü gözünde canlandır"><div className="reader-v2-scene-topline"><span>FİKRİN GEOMETRİSİ</span><button type="button" className="reader-v2-expand" onClick={() => setSceneExpanded(true)}>Büyüt <span aria-hidden="true">↗</span></button></div><ChapterScene key={chapter.id} chapterId={chapter.id} variant="reader" interactive={true}/><p className="reader-v2-inline-caption">Şema öğreticidir; ölçekli çizim değildir.</p></section>}

              <div className="reader-v2-tabs" role="tablist" aria-label="Bölüm içeriği" onKeyDown={selectTabByKeyboard}>
                {tabs.map(([id, label]) => <button type="button" role="tab" key={id} id={`reader-v2-tab-${id}`} ref={element => { tabRefs.current[id] = element; }} aria-selected={tab === id} aria-controls={`reader-v2-panel-${id}`} tabIndex={tab === id ? 0 : -1} onClick={() => setTab(id)}>{label}{id === 'sources' && <span>{chapter.sources.length}</span>}</button>)}
              </div>

              {tab === 'story' && <section className="reader-v2-panel reader-v2-story" role="tabpanel" id="reader-v2-panel-story" aria-labelledby="reader-v2-tab-story" tabIndex={0}>
                <div className="reader-v2-prose">{chapter.story.map((paragraph, index) => <p className={index === 0 ? 'reader-v2-opening-paragraph' : ''} key={paragraph}>{paragraph}</p>)}</div>
                <aside className="reader-v2-analogy"><span className="reader-v2-analogy-symbol" aria-hidden="true">✳</span><div><span className="reader-v2-kicker">GÖZÜNDE CANLANDIR</span><p>{chapter.analogy}</p></div></aside>
                <section className="reader-v2-impact"><span className="reader-v2-kicker">NEYİ DEĞİŞTİRDİ?</span><p>{chapter.impact}</p></section>
                <blockquote className="reader-v2-takeaway"><span>Bu bölümden bir fikir</span><p>{chapter.takeaway}</p></blockquote>
                <aside className="reader-v2-funfact"><span className="reader-v2-kicker">DEFTERİN KENARINA</span><p>{chapter.funFact}</p></aside>
                <button type="button" className="reader-v2-next-layer" onClick={() => setTab('method')}><span><small>BİR ADIM YAKLAŞ</small>Ölçümün nasıl yapıldığını gör</span><Arrow/></button>
                <ReaderQuiz key={chapter.id} items={chapter.quiz}/>
              </section>}

              {tab === 'method' && <section className="reader-v2-panel reader-v2-method" role="tabpanel" id="reader-v2-panel-method" aria-labelledby="reader-v2-tab-method" tabIndex={0}>
                <div className="reader-v2-panel-title"><span className="reader-v2-kicker">FİKİRDEN ÖLÇÜME</span><h2>Nasıl düşündü,<br/><em>nasıl ölçtü?</em></h2></div>
                <ol className="reader-v2-method-steps">{chapter.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol>
                <section className="reader-v2-tools"><span className="reader-v2-kicker">ÖLÇÜM ÇANTASI</span><ul>{chapter.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></section>
                <section className="reader-v2-result"><span className="reader-v2-kicker">ORTAYA ÇIKAN SONUÇ</span><p>{chapter.result}</p></section>
                <aside className="reader-v2-uncertainty"><span className="reader-v2-uncertainty-icon" aria-hidden="true">±</span><div><h3>Bir ölçüm, sınırlarıyla birlikte.</h3><p>{chapter.uncertainty.replace("Brief'teki ", '')}</p></div></aside>
                <details className="reader-v2-detail"><summary><span>Bir örnekle düşünelim<small>Hesabı gündelik bir ölçekte izle</small></span><span className="reader-v2-detail-plus" aria-hidden="true">+</span></summary><p>{chapter.more}</p></details>
                <details className="reader-v2-detail" open={mathOpen} onToggle={event => setMathOpen(event.currentTarget.open)}><summary><span>Matematiğine bak<small>Formülü görmek istersen</small></span><span className="reader-v2-detail-plus" aria-hidden="true">+</span></summary>{mathOpen && <Suspense fallback={<p>Formül hazırlanıyor…</p>}><Formula tex={chapter.math}/></Suspense>}</details>
                {experimentChapters.has(chapter.id) && onExperiment && <button type="button" className="reader-v2-experiment" onClick={() => onExperiment(chapter.id)}><span className="reader-v2-experiment-icon" aria-hidden="true">↗</span><span><small>DENEY MASASINDA</small>Bu fikri kendin sına</span><Arrow/></button>}
              </section>}

              {tab === 'sources' && <section className="reader-v2-panel reader-v2-sources" role="tabpanel" id="reader-v2-panel-sources" aria-labelledby="reader-v2-tab-sources" tabIndex={0}>
                <div className="reader-v2-panel-title"><span className="reader-v2-kicker">BUNU NEREDEN BİLİYORUZ?</span><h2>Hikâyenin<br/><em>dayanakları.</em></h2></div>
                <p className="reader-v2-sources-intro">Merak burada bitmiyor. Bu bölümün anlatısını ve ölçüm ayrıntılarını aşağıdaki kaynaklardan izleyebilirsin.</p>
                <ol>{chapter.sources.map((source, index) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer"><span className="reader-v2-source-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{source.title}</strong><small>{new URL(source.url).hostname.replace(/^www\./, '')}</small></span><span aria-hidden="true">↗</span><span className="reader-v2-sr-only"> (yeni sekmede açılır)</span></a></li>)}</ol>
                <aside className="reader-v2-source-note"><span className="reader-v2-kicker">OKUR İÇİN BİR NOT</span><p>Tarihsel bir sayı, kullanılan birim ve yöntemle birlikte anlam kazanır. Bu bölümde bilinen sınırları yöntemin yanında bulabilirsin.</p><button type="button" onClick={() => setTab('method')}>Ölçümün sınırlarına dön <Arrow/></button></aside>
              </section>}

              <footer className="reader-v2-article-footer">
                <button type="button" className={`reader-v2-complete ${done ? 'is-complete' : ''}`} aria-pressed={done} onClick={markComplete}><span aria-hidden="true">{done ? '✓' : '+'}</span>{done ? 'Keşif defterine eklendi' : 'Okudum, keşif defterime ekle'}</button>
                <div className="reader-v2-chapter-navigation">
                  <button type="button" disabled={!previous} onClick={() => previous && onSelect?.(previous)}><Arrow direction="left"/><span><small>ÖNCEKİ BÖLÜM</small><strong>{previous ? previous.person : 'Yolculuğun başlangıcı'}</strong></span></button>
                  <button type="button" disabled={!next} onClick={() => next && onSelect?.(next)}><span><small>SONRAKİ BÖLÜM</small><strong>{next ? next.person : 'Yolculuğun sonu'}</strong></span><Arrow/></button>
                </div>
              </footer>
            </article>

            {!compact && <aside className="reader-v2-aside" aria-label="Ölçümü gözünde canlandır">
              <div className="reader-v2-scene-sticky">
                <div className="reader-v2-scene-topline"><span>FİKRİN GEOMETRİSİ</span><button type="button" className="reader-v2-expand" onClick={() => setSceneExpanded(true)}>Büyüt <span aria-hidden="true">↗</span></button></div>
                <div className="reader-v2-scene-frame"><ChapterScene key={chapter.id} chapterId={chapter.id} variant="reader" interactive={true}/></div>
                <p className="reader-v2-scene-caption">Bir alet, bir gözlem, bir fikir.<br/>Küçük bir parçadan bütünü anlamak.</p>
                <div className="reader-v2-aside-rule"/>
                <div className="reader-v2-aside-question"><span className="reader-v2-kicker">BU KEŞFİN SORUSU</span><p>{chapter.hook}</p></div>
                {experimentChapters.has(chapter.id) && onExperiment && <button type="button" className="reader-v2-aside-experiment" onClick={() => onExperiment(chapter.id)}>Deney masasına geç <Arrow/></button>}
                <span className="reader-v2-schematic-note">Öğretici şema · Ölçekli çizim değildir.</span>
              </div>
            </aside>}
          </div>
        </div>
      </div>
      <dialog ref={expandedRef} className="reader-v2-expanded" aria-labelledby="reader-v2-expanded-title" onCancel={event => { event.preventDefault(); event.stopPropagation(); setSceneExpanded(false); }} onClose={event => { event.stopPropagation(); setSceneExpanded(false); }}>
        {sceneExpanded && <><header><div><span className="reader-v2-kicker">FİKRİN GEOMETRİSİ</span><h2 id="reader-v2-expanded-title">{chapter.title}</h2></div><button type="button" onClick={() => setSceneExpanded(false)} aria-label="Büyük şemayı kapat"><span>Kapat</span><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></header><div className="reader-v2-expanded-content"><p className="reader-v2-pan-hint">Şemayı yana kaydırarak ayrıntıları incele.</p><ChapterScene chapterId={chapter.id} variant="reader" interactive={true}/></div><p>Öğretici şema · Ölçekli çizim değildir.</p></>}
      </dialog>
    </div>}
  </dialog>;
}
