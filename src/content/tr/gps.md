---
{
  "id": "gps",
  "title": "Gökyüzündeki saatlerden cebindeki haritaya",
  "person": "Uydu jeodezisi ve GPS ekipleri",
  "date": "20. yüzyılın ikinci yarısı ve sonrası",
  "place": "Dünya çevresindeki yörüngeler ve küresel yer ağı",
  "era": "Uzay Çağı",
  "year": 1994,
  "coords": [
    0.0,
    0.0
  ],
  "hook": "Telefonun yukarıdaki uydulara cetvel uzatmadan yerini nasıl buluyor?",
  "analogy": "Karanlık bir odada, yeri bilinen arkadaşların sana uzaklıklarını söylüyor. Tek bilgi birçok yere uyabilir; yeni uzaklıklar olası yerleri daraltır. Gerçek GPS bunun üç boyutlu ve saat hatalı sürümüdür.",
  "steps": [
    "Birden fazla uydunun konum ve gönderim zamanı bilgisini al.",
    "Sinyal sürelerinden uzaklıkları tahmin et; alıcının saat hatasını da çöz.",
    "Atmosfer ve diğer etkileri düzeltip konumu ortak Dünya sisteminde göster."
  ],
  "tools": [
    "Uydu atom saatleri",
    "Radyo sinyalleri",
    "GPS alıcısı",
    "Yer kontrol ağı",
    "WGS 84 ve düzeltme modelleri"
  ],
  "result": "Sıradan telefonlarda açık gökyüzünde genellikle metre ölçeğinde konum; özel alıcılar, düzeltmeler ve uygun yöntemlerle santimetre ölçeği. 'GPS her zaman santimetre doğrudur' denemez.",
  "uncertainty": "Binalar sinyali engelleyebilir veya yansıtabilir. Atmosfer, uydu geometrisi, alıcı ve saat hataları sonucu etkiler. Haritadaki işaret ile gerçek fiziksel konum arasında belirsizlik vardır. Haritadaki nokta küresel sistemi temsil eder; tek bir ölçüm yeri değildir.",
  "impact": "Gezegenin şeklinin ve hareketinin sürekli izlenmesini; günlük seyirden deprem araştırmalarına kadar ortak konum kullanımını mümkün kıldı.",
  "funFact": "Telefonun konum bulmak için GPS uydularına mesaj göndermesi gerekmez; uyduların yayınlarını dinlemesi yeterlidir.",
  "takeaway": "GPS, uzaklıklara dönüşen zaman bilgilerini ortak bir Dünya sistemi içinde birleştirir.",
  "more": "Radyo sinyali yaklaşık saniyede 300.000 km gider. Zaman ölçümündeki minicik bir fark bu yüzden metrelerce konum farkına dönüşebilir. Normal telefon sonucu ile özel ölçüm düzenini ayrı düşün.",
  "math": "\\rho_i=\\sqrt{(x-x_i)^2+(y-y_i)^2+(z-z_i)^2}+c\\,\\Delta t+\\varepsilon_i,\\qquad i\\geq 4",
  "quiz": [
    {
      "question": "GPS yer bulmak için temelde neyi kullanır?",
      "options": [
        "Uyduya bakışın rengini",
        "Sinyalin yolculuk süresinden çıkarılan uzaklığı",
        "Telefonun ekran büyüklüğünü"
      ],
      "correct": 1,
      "explanation": "Bilinen sinyal hızı ve yolculuk süresi, uyduya uzaklık bilgisi verir."
    },
    {
      "question": "Dördüncü uydu bağımsız konum çözümünde neden gerekir?",
      "options": [
        "Alıcının saat hatasını da çözmek için",
        "Sadece pil şarj etmek için",
        "Dünya'yı döndürmek için"
      ],
      "correct": 0,
      "explanation": "Üç konum bileşeni yanında alıcının saat sapması da bilinmeyendir."
    },
    {
      "question": "Her telefondaki GPS her koşulda santimetre doğru mudur?",
      "options": [
        "Evet",
        "Hayır; alıcı, ortam ve düzeltmeler önemlidir",
        "Sadece ekran parlakken"
      ],
      "correct": 1,
      "explanation": "Santimetre düzeyi özel yöntemler gerektirebilir; tüketici alıcıları genellikle metre ölçeğindedir."
    }
  ],
  "sources": [
    {
      "title": "FAA · GPS nasıl çalışır, dört uydu ve saat çözümü",
      "url": "https://www.faa.gov/about/office_org/headquarters_offices/ato/service_units/techops/navservices/gnss/gps/howitworks"
    },
    {
      "title": "GPS.gov · Trilaterasyon eğitim etkinliği",
      "url": "https://www.gps.gov/trilateration"
    },
    {
      "title": "GPS.gov · Konum doğruluğu ve koşulları",
      "url": "https://www.gps.gov/gps-accuracy"
    },
    {
      "title": "NGA · WGS 84 tanımı ve referans sistemi",
      "url": "https://earth-info.nga.mil/index.php?action=wgs84&dir=wgs84"
    }
  ]
}
---

Bir GPS alıcısı, nerede olduklarını ve sinyalin ne zaman gönderildiğini bildiren uyduları dinler. Sinyalin geliş süresi, uyduya olan uzaklık hakkında bilgi verir. Birden fazla uydu, olası yerleri daraltır.

Telefonun saati uydu saatleri kadar kusursuz değildir. Bu nedenle bağımsız üç boyutlu konum ve saat hatasını birlikte çözmek için en az dört uydu gerekir. Gerçekte çoğu alıcı daha çok uyduyu kullanır ve birçok düzeltme uygular.

Burada ölçülen esas şey bakış açıları değil, sinyal zamanından çıkarılan uzaklıklardır. Bu yüzden eski kule üçgenlemesiyle aynı işlem değildir. Sonuçlar, WGS 84 gibi ortak Dünya modeli ve referans sistemi içinde anlam kazanır.
