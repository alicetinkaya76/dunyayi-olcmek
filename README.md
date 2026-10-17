# Dünya’yı Ölçmek

Gölgelerden uydulara, Türkçe etkileşimli bilim tarihi sitesi. Ali Çetinkaya · https://github.com/alicetinkaya76

## Çalıştırma

Node.js 22 veya üzeri ile:

```sh
npm ci
npm run dev
```

Üretim çıktısı:

```sh
npm run build
npm run preview
```

Canlı site: https://alicetinkaya76.github.io/dunyayi-olcmek/

GitHub Pages, `main` dalındaki `docs/` klasöründen yayımlanır. Vite `base: './'` ayarı, proje alt dizinindeki görselleri, deneyleri ve PDF bağlantılarını korur.

Kaynakları değiştirdikten sonra `npm run build:pages` çalıştırıp hem kaynakları hem güncellenen `docs/` klasörünü commit ederek `main` dalına gönderin. `.nojekyll`, hazır statik çıktının doğrudan sunulmasını sağlar.

## İçerik ve yapı

- `src/content/tr/*.md`: 14 tarih bölümünün asıl kaynağı. İlk `---` bloğu JSON biçiminde geçerli YAML ön bilgidir; gövde Türkçe hikâye paragraflarıdır.
- `src/content/index.js`: Markdown yükleyici ve dil kayıtları. Türkçe etkin; İngilizce ve Arapça çevirileri henüz yoktur.
- `src/content/chapters.json`: karşılaştırma kaynakları ve düzenleme için yardımcı veri kopyası. Bölüm verisi değiştirilirse bu kopya da eşlenmelidir.
- `src/App.jsx`: ana sayfa, zaman çizelgesi, bölüm pencereleri, mini testler, birim çevirici, öğretmen ve kaynak alanları.
- `src/components/Simulations.jsx`: altı deney, hikâye/serbest deneme ve isteğe bağlı sayılar/matematik.
- `src/components/Atlas.jsx`: Leaflet haritası ve klavye ile ulaşılabilen yer listesi. Harita döşemeleri için OpenStreetMap bağlantısı gerekir; yerel şematik katman ve bütün yer düğmeleri bağlantı olmadan da vardır.
- `src/components/Comparison.jsx`: D3 karşılaştırması. Belgeli çevre sonuçları çizilir; diğer yöntemler için neden tek sayı verilmediği açıklanır. Belirsizlik bantları istatistiksel güven aralığı değildir.
- `src/components/Globe.jsx`: Three.js ile sürüklenebilir şematik enlem/boylam küresi.
- `src/components/Formula.jsx`: ayrı yüklenen KaTeX gösterimi.
- `public/images/`, `public/image-credits.json`: yerel gerçek arşiv görselleri ve atıfları.
- `public/calisma-kagitlari.pdf`: beş sayfalık sınıf etkinlikleri.
- `TASARIM_VE_YOL_HARITASI.md`: site haritası, içerik katmanları, altı deneyin teknik tasarımı ve genişletme planı.

## Kaynak ve model notları

Ana sayfadaki fotoğraf Apollo 17 / NASA, 7 Aralık 1972’dir. Müze nesneleri The Met’in kamu malı kayıtlarından alınmıştır. İdrisi görseli, Konrad Miller’in 1928’de yayımladığı birleştirmedir; İdrisi’nin özgün el yazması olarak sunulmaz. Ayrıntılı atıflar sitede ve image-credits.json dosyasındadır.

Tarihî stadion, arşın ve mil uzunlukları kesin tek değerler değildir. Hesaplar açıklanan varsayımlarla çalışan eğitim modelleridir. Kutup yüksekliği simülasyonu, tarihî Sincar seferinin birebir yeniden yapımı değildir. Biruni modelinde atmosfer seçeneği pedagojik bir duyarlılık gösterimidir. Üçgenleme belirsizliği şematik bir modeldir. Dünya’nın ekvator çevresi ile kutuplardan geçen çevresi ayrıdır.

## Kontrol edilenler

Üretim derlemesi; 14 bölüm ve 29 soru; altı deneyde hikâye-serbest deneme akışı; Eratosthenes başlangıç hesabı ve slider tepkisi; birimi kendisine çevirme; gerçek görsellerin yüklenmesi ve büyütülmesi; harita/karşılaştırma; 3B küre; masaüstü ve 320/390 piksel telefon genişlikleri kontrol edildi. PDF’in beş sayfası render edilerek incelendi. Tam kapsamlı WCAG uygunluk sertifikasyonu yapılmadı.

## Yeni sergi arayüzü

Koyu gözlemevi açılışı ve gerçek Apollo 17 fotoğrafı; dört dönemden gezilebilen keşif vitrini; 14 bölüme özel etkileşimli bilimsel çizim; tam ekran okuma defteri; Hikâye/Yöntem/Kaynaklar katmanları; büyütülebilen şemalar; arama ve bölüm içi gezinme; tarayıcıda okundu takibi; yeniden tasarlanan deney, harita ve arşiv yüzeyleri. Ana ekrandaki isteğe bağlı Three.js küresi resmî örnek deposundaki equirectangular Dünya haritasını kullanır. Animasyonlar azaltılmış hareket tercihini izler.

Yeni bileşenler: `ChapterReader.jsx`, `ChapterScene.jsx`, `ExhibitModules.css`. GitHub Pages güncellemesi için `npm run build:pages` ile kaynak ve `docs/` birlikte gönderilir.
