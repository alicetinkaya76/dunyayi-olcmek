import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Atlas.css';

const INITIAL_BOUNDS = [[22, -13], [68, 90]];
const WORLD_BOUNDS = [[-56, -145], [76, 150]];
const PLACES = [
  { key: 'alexandria', label: 'İskenderiye', region: 'Mısır', coords: [31.20, 29.92], ids: ['eratosthenes', 'posidonius', 'ptolemy'] },
  { key: 'syene', label: 'Syene / Asvan', region: 'Mısır', coords: [24.09, 32.90], ids: ['eratosthenes'] },
  { key: 'rhodes', label: 'Rodos', region: 'Yunanistan', coords: [36.43, 28.22], ids: ['posidonius'] },
  { key: 'kusumapura', label: 'Kusumapura / Patna çevresi', region: 'Hindistan · eşleştirme yaklaşık', coords: [25.61, 85.14], ids: ['aryabhata'] },
  { key: 'sinjar', label: 'Sincar Ovası', region: 'Irak', coords: [36.32, 41.87], ids: ['sincar'] },
  { key: 'nandana', label: 'Nandana', region: 'Pakistan', coords: [32.72, 73.28], ids: ['biruni'] },
  { key: 'paris', label: 'Paris meridyeni çevresi', region: 'Fransa', coords: [48.84, 2.34], ids: ['picard', 'fernel', 'metre'] },
  { key: 'amiens', label: 'Amiens yönü', region: 'Fransa', coords: [49.89, 2.30], ids: ['fernel'] },
  { key: 'leiden', label: 'Leiden', region: 'Hollanda', coords: [52.16, 4.49], ids: ['snellius'] },
  { key: 'alkmaar', label: 'Alkmaar', region: 'Hollanda', coords: [52.63, 4.75], ids: ['snellius'] },
  { key: 'bergen', label: 'Bergen op Zoom', region: 'Hollanda', coords: [51.50, 4.29], ids: ['snellius'] },
  { key: 'lapland', label: 'Laponya / Tornio çevresi', region: 'Bugünkü Finlandiya–İsveç', coords: [66.0, 23.7], ids: ['french-expeditions'] },
  { key: 'peru-expedition', label: 'Peru seferi / Quito çevresi', region: 'Bugünkü Ekvador', coords: [-0.21, -78.50], ids: ['french-expeditions'] },
  { key: 'dunkirk', label: 'Dunkirk', region: 'Fransa', coords: [51.03, 2.38], ids: ['metre'] },
  { key: 'barcelona', label: 'Barselona', region: 'İspanya', coords: [41.38, 2.17], ids: ['metre'] },
  { key: 'greenwich', label: 'Greenwich', region: 'Birleşik Krallık', coords: [51.48, 0.0], ids: ['longitude', 'greenwich'] },
  { key: 'jamaica', label: 'Jamaika / Port Royal', region: 'H4 deneme yolculuğu', coords: [17.94, -76.84], ids: ['longitude'] },
  { key: 'washington', label: 'Washington', region: 'ABD · 1884 konferansı', coords: [38.91, -77.04], ids: ['greenwich'] },
];

const SHORT_NAMES = {
  eratosthenes: 'Eratosthenes', posidonius: 'Posidonius', ptolemy: 'Batlamyus', aryabhata: 'Aryabhata', sincar: 'Me’mun’un ekipleri', biruni: 'Bîrûnî', fernel: 'Fernel', snellius: 'Snellius', picard: 'Picard', 'french-expeditions': 'Fransız seferleri', metre: 'Metrenin hikâyesi', longitude: 'Harrison & boylam', greenwich: 'Ortak meridyen',
};

// This small local drawing is intentionally a schematic, not a national-boundary dataset.
// It stays available below the optional OSM tiles when the reader has no connection.
const LAND = [
  [[-168, 71], [-146, 70], [-129, 59], [-124, 48], [-123, 39], [-116, 31], [-110, 24], [-101, 19], [-88, 16], [-83, 10], [-78, 8], [-77, 16], [-87, 22], [-81, 25], [-80, 32], [-74, 41], [-64, 47], [-57, 52], [-64, 59], [-81, 64], [-97, 71], [-124, 72], [-146, 70], [-168, 71]],
  [[-81, 12], [-72, 12], [-61, 7], [-51, 3], [-35, -6], [-40, -22], [-49, -30], [-58, -39], [-67, -55], [-74, -48], [-75, -35], [-71, -18], [-81, -5], [-81, 12]],
  [[-52, 60], [-43, 61], [-23, 70], [-18, 78], [-39, 83], [-60, 80], [-72, 71], [-52, 60]],
  [[-17, 37], [-3, 36], [10, 37], [23, 32], [32, 31], [35, 23], [44, 12], [51, 12], [43, -2], [40, -14], [32, -26], [18, -35], [12, -29], [8, -7], [-2, 5], [-13, 7], [-17, 20], [-17, 37]],
  [[-10, 36], [-9, 43], [-1, 49], [5, 53], [8, 57], [5, 62], [13, 69], [26, 71], [35, 68], [46, 69], [61, 70], [76, 73], [99, 77], [119, 73], [142, 70], [165, 65], [179, 63], [160, 57], [153, 48], [140, 45], [135, 36], [124, 39], [121, 30], [110, 21], [106, 11], [101, 2], [96, 5], [91, 22], [84, 22], [79, 8], [73, 20], [67, 25], [57, 25], [50, 16], [44, 13], [35, 29], [28, 36], [23, 39], [23, 35], [19, 40], [15, 38], [12, 44], [7, 44], [3, 42], [-1, 39], [-10, 36]],
  [[-8, 50], [-5, 50], [1, 52], [-2, 56], [-4, 59], [-7, 58], [-6, 54], [-8, 50]],
  [[-10, 51], [-6, 51], [-6, 55], [-9, 55], [-10, 51]],
  [[130, 31], [135, 34], [140, 39], [144, 44], [141, 45], [137, 37], [131, 33], [130, 31]],
  [[112, -11], [129, -12], [136, -12], [143, -10], [153, -25], [150, -38], [136, -35], [130, -32], [116, -35], [113, -24], [112, -11]],
  [[47, -13], [50, -16], [48, -25], [45, -25], [43, -20], [47, -13]],
  [[166, -35], [178, -38], [175, -42], [168, -47], [166, -44], [172, -40], [166, -35]],
];

function addLocalBasemap(map) {
  map.createPane('atlas-local');
  map.getPane('atlas-local').style.zIndex = '190';
  const renderer = L.svg({ pane: 'atlas-local' });
  LAND.forEach(polygon => L.polygon(polygon.map(([lon, lat]) => [lat, lon]), {
    renderer, interactive: false, color: '#91a18d', weight: .8, opacity: .8, fillColor: '#dbe2d1', fillOpacity: 1,
  }).addTo(map));
  for (let longitude = -180; longitude <= 180; longitude += 30) {
    L.polyline([[-80, longitude], [84, longitude]], { renderer, interactive: false, color: '#122b37', weight: .6, opacity: .12 }).addTo(map);
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    L.polyline([[latitude, -180], [latitude, 180]], { renderer, interactive: false, color: latitude === 0 ? '#a46b39' : '#122b37', weight: latitude === 0 ? 1 : .6, opacity: latitude === 0 ? .3 : .12, dashArray: latitude === 0 ? '5 6' : undefined }).addTo(map);
  }
}

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Atlas({ chapters = [], onSelect }) {
  const containerRef = useRef(null), mapRef = useRef(null), markersRef = useRef(new Map());
  const callbackRef = useRef(onSelect), chaptersRef = useRef(chapters);
  callbackRef.current = onSelect;
  chaptersRef.current = chapters;
  const [mapState, setMapState] = useState('loading'), [selected, setSelected] = useState(null);
  const places = useMemo(() => {
    const available = new Set(chapters.filter(c => c.id !== 'gps').map(c => c.id));
    const known = PLACES.map(p => ({ ...p, ids: p.ids.filter(id => available.has(id)) })).filter(p => p.ids.length);
    const included = new Set(known.flatMap(p => p.ids));
    // New local chapters can join the map without inventing a GPS origin marker.
    chapters.forEach(chapter => {
      const coords = chapter.coords;
      if (chapter.id === 'gps' || included.has(chapter.id) || !Array.isArray(coords) || coords.length !== 2 || !coords.every(Number.isFinite) || (coords[0] === 0 && coords[1] === 0) || Math.abs(coords[0]) > 85 || Math.abs(coords[1]) > 180) return;
      known.push({ key: `chapter-${chapter.id}`, label: chapter.place || chapter.person || chapter.title, region: 'Yaklaşık konum', coords, ids: [chapter.id] });
    });
    return known;
  }, [chapters]);
  const gps = chapters.find(c => c.id === 'gps');

  const choose = useCallback((place, chapterId = place.ids[0]) => {
    const chapter = chaptersRef.current.find(c => c.id === chapterId);
    if (!chapter) return;
    setSelected(place.key);
    if (mapRef.current) mapRef.current.setView(place.coords, Math.max(5, mapRef.current.getZoom()), { animate: false });
    callbackRef.current?.(chapter);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const map = L.map(containerRef.current, {
      zoomControl: false, minZoom: 1, maxZoom: 17, keyboard: true, keyboardPanDelta: 80,
      scrollWheelZoom: false, touchZoom: true, worldCopyJump: true,
      zoomAnimation: !reduced, fadeAnimation: !reduced, markerZoomAnimation: !reduced,
    });
    mapRef.current = map;
    map.fitBounds(INITIAL_BOUNDS, { padding: [32, 32], maxZoom: 4, animate: false });
    L.control.zoom({ position: 'topleft', zoomInTitle: 'Yakınlaştır', zoomOutTitle: 'Uzaklaştır', zoomInText: '+', zoomOutText: '−' }).addTo(map);
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false, maxWidth: 100 }).addTo(map);
    addLocalBasemap(map);

    let tileSuccesses = 0, disposed = false;
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> katkıda bulunanlar',
      maxZoom: 19, subdomains: 'abc', keepBuffer: 1,
    });
    tiles.on('tileload', () => { tileSuccesses += 1; if (!disposed) setMapState('tiles'); });
    tiles.on('tileerror', () => { if (!disposed) setMapState(tileSuccesses ? 'partial' : 'local'); });
    tiles.addTo(map);
    const timeout = window.setTimeout(() => { if (!disposed && !tileSuccesses) setMapState('local'); }, 6500);

    const markerMap = new Map();
    places.forEach((place, index) => {
      const icon = L.divIcon({
        className: 'atlas-div-marker',
        html: `<span class="atlas-pin-core">${String(index + 1).padStart(2, '0')}</span><span class="atlas-pin-stem"></span>`,
        iconSize: [30, 38], iconAnchor: [15, 38], tooltipAnchor: [0, -34],
      });
      const marker = L.marker(place.coords, { icon, keyboard: true, riseOnHover: true, title: `${place.label} · ${SHORT_NAMES[place.ids[0]] || 'Hikâyeyi oku'}` }).addTo(map);
      const tooltip = document.createElement('span');
      tooltip.textContent = place.label;
      marker.bindTooltip(tooltip, { direction: 'top', className: 'atlas-tooltip', opacity: 1 });
      const element = marker.getElement();
      if (element) element.setAttribute('aria-label', `${place.label}: ${SHORT_NAMES[place.ids[0]] || 'ilgili'} bölümünü oku. ${place.ids.length > 1 ? 'Diğer ilgili bölümler harita altındaki yer listesinde.' : ''}`);
      marker.on('click', () => choose(place));
      markerMap.set(place.key, marker);
    });
    markersRef.current = markerMap;
    let observer;
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(() => map.invalidateSize({ animate: false, pan: false }));
      observer.observe(containerRef.current);
    }
    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      observer?.disconnect();
      markersRef.current.clear();
      map.remove();
      if (mapRef.current === map) mapRef.current = null;
    };
  }, [places, choose]);

  useEffect(() => {
    markersRef.current.forEach((marker, key) => marker.getElement()?.classList.toggle('is-selected', key === selected));
  }, [selected]);

  return <div className="measurement-atlas">
    <div className="atlas-toolbar"><p><span className="atlas-dot" aria-hidden="true" /> {places.length} yer, birbirine bağlanan fikirler</p><div><button type="button" onClick={() => mapRef.current?.fitBounds(INITIAL_BOUNDS, { padding: [32, 32], maxZoom: 4, animate: false })}>Başlangıca dön <span aria-hidden="true">↺</span></button><button type="button" onClick={() => mapRef.current?.fitBounds(WORLD_BOUNDS, { padding: [20, 20], maxZoom: 2, animate: false })}>Dünya görünümü <span aria-hidden="true">⊕</span></button></div></div>
    <div className="atlas-map-wrap"><div className="atlas-map" ref={containerRef} role="region" aria-label="Ölçüm yerlerinin etkileşimli haritası. Ok tuşlarıyla gez, artı ve eksi tuşlarıyla yakınlaş; yer işaretinde Enter ile hikâyeyi aç." /><div className="atlas-compass" aria-hidden="true"><span>K</span><svg viewBox="0 0 28 44"><path d="M14 2 25 38 14 30 3 38Z" fill="#122b37" /><path d="M14 2V30L3 38Z" fill="#a46b39" /></svg></div></div>
    <div className="atlas-map-meta"><p>Sürükleyerek gez. Haritaya odaklanınca ok tuşlarıyla ilerle; + / − ile yakınlaş.</p><p role="status" aria-live="polite">{mapState === 'tiles' ? 'OpenStreetMap ayrıntıları açık' : mapState === 'partial' ? 'Bazı ayrıntılar yüklenemedi · yerel şema altta açık' : mapState === 'loading' ? 'Yerel kıta şeması açık · harita ayrıntıları yükleniyor' : 'Yerel kıta şeması açık · çevrimdışı da keşfedebilirsin'}</p></div>
    <div className="atlas-list-heading"><h3>Bir yere uğra.</h3><p>İşaretler yaklaşık konumları gösterir. Ölçüm güzergâhlarını veya tarihî sınırları göstermez.</p></div>
    <ol className="atlas-place-list" aria-label="Haritadaki bütün yerler ve ilgili bölümler">
      {places.map((place, index) => <li key={place.key} className={selected === place.key ? 'is-selected' : ''}><span className="atlas-place-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div className="atlas-place-content"><strong>{place.label}</strong><small>{place.region}</small><div className="atlas-place-links">{place.ids.map(id => <button key={id} type="button" onClick={() => choose(place, id)} aria-label={`${place.label}: ${chapters.find(c => c.id === id)?.person || SHORT_NAMES[id] || id} bölümünü oku`}>{SHORT_NAMES[id] || chapters.find(c => c.id === id)?.person || 'Hikâyeyi oku'} <Arrow /></button>)}</div></div></li>)}
    </ol>
    {gps && <button type="button" className="atlas-global-link" onClick={() => callbackRef.current?.(gps)}><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="15" fill="none" stroke="currentColor" /><ellipse cx="32" cy="32" rx="7" ry="15" fill="none" stroke="currentColor" /><path d="M17 32h30M32 17v30M6 39C-1 19 40 1 54 14S37 61 13 51" fill="none" stroke="currentColor" strokeDasharray="3 4" /><path d="m49 10 8 5-5 8-8-5Z" fill="#a46b39" /></svg><span><small>TEK BİR YERİN ÖTESİNDE</small><strong>Uydularla bütün Dünya</strong><span>GPS, küresel bir uydu ve yer ağıdır. Hikâyesini aç.</span></span><Arrow /></button>}
    <p className="atlas-schematic-note">Yerel kıta çizgileri, bağlantı kesildiğinde yön bulmayı kolaylaştıran basit bir şemadır. Ayrıntılı harita verisi: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap katkıda bulunanlar</a>.</p>
  </div>;
}
