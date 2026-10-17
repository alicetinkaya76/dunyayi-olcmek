# Dünya’yı Ölçmek eğitim sitesi tasarımı ve geliştirme yol haritası

Bu proje, matematik bilmeyen bir okurun Dünya’nın büyüklüğünün nasıl ölçülebildiğini kendi sözüyle anlatabilmesi için hazırlanmıştır. Önce bir insanın sorusu, sonra görülebilen bir deney, en son isteyenler için hesap gelir. Ana anlatı formülsüzdür. Gözlem, varsayım ve sonuç birbirinden ayrılır.

Proje künyesi: **Ali Çetinkaya** · [GitHub](https://github.com/alicetinkaya76). Bu künyenin dışında bir kurum, meslek veya kişisel geçmiş atfedilmez.

## Site haritası ve kullanıcı akışı

İlk sürüm, statik olarak yayımlanabilen tek React uygulamasında bağlantı verilebilen bölümler sunar. Tam sayfa yönlendirmelerinin yerine bölüm bağlantıları ve konu seçimi kullanılır; böylece GitHub Pages gibi statik barındırmalarda doğrudan açılış sorunu azaltılır.

| Alan | Okurun sorusu | İçerik ve sonraki adım |
| --- | --- | --- |
| Ana sayfa | Bütün Dünya’yı yürümek zorunda mıyız? | Küre, kısa giriş ve hikâyeye başlama çağrısı. Zaman çizelgesine veya laboratuvara geçiş. |
| Zaman çizelgesi | Her çağ aynı soruya nasıl cevap verdi? | 14 konu, dönem ve yöntem seçimi. Açılan bölümde hikâye, iki ek katman, kaynaklar ve mini test. |
| Ölçüm atlası | Bu ölçümler nerede yapıldı? | İskenderiye, Asvan, Rodos, Sincar, Nandana, Fransa, Hollanda, Laponya, Peru, Dunkirk, Barselona ve Greenwich gibi yerler. İşaret veya eşdeğer metin listesi ilgili konuyu açar. |
| Deney laboratuvarı | Değiştirince ne oluyor? | Altı simülasyon. Dört hikâye adımı, ardından serbest deneme. |
| Kim ne kadar yaklaştı | Sayıları gerçekten karşılaştırabilir miyiz? | Seçilebilir referans çevre, tarihsel birim aralıkları ve sonuçların açıklaması. Koordinat sistemi kurmak gibi doğrudan çevre ölçümü olmayan katkılar ayrı anlatılır. |
| Birim atölyesi | Aynı ad her çağda aynı uzunluk mu? | Çevirici, birim belirsizliği ve hata galerisi. Aralık hesapları tek kesin değere çevrilmez. |
| Türkiye üzerinden anla | Yakınımdaki yerlerle nasıl düşünebilirim? | Enlem farkı ile kuzey-güney uzaklığının ilişkisi. Kentler arası karayolu ile meridyen yayı birbirine karıştırılmaz. |
| Öğretmen köşesi | Bunu sınıfta nasıl yaparız? | Konuya göre ders önerileri, tartışmalar ve beş sayfalık [çalışma kâğıtları](public/calisma-kagitlari.pdf). |
| Kaynaklar ve künye | Hangi bilgiye ne kadar güvenebilirim? | Kurumsal ve akademik kaynaklar, tarihsel belirsizlikler ve GitHub bağlantısı. |

Öğrencinin ana yolu: **Ana sayfa → Zaman çizelgesi → Hikâye → Simülasyon → Formülsüz mini test → Sonraki hikâye**. “Biraz daha” ve “Matematiğini merak ediyorum” isteğe bağlıdır; ana yolu tamamlamak için açılmaları gerekmez.

Öğretmenin yolu: **Öğretmen köşesi → Konu seçimi → Etkinlik → PDF → İlgili simülasyon**. Meraklı okur atlasta bir yerden veya karşılaştırma grafiğindeki bir ölçümden başlayabilir. Her giriş, aynı hikâye ve kaynaklara ulaşır.

## Sayfa içerikleri ve üç katman

Her konu aynı anlaşılır sırayı kullanır: merak eden kişi veya ekip, zaman ve yer, sorun, araç, adım adım yöntem, sonuç, hata, etki, kısa ilginç bilgi, “Aklında kalsın” cümlesi, iki veya üç formülsüz soru ve kaynaklar. İlginç bilgi kutusu doğrulanmış bilgi içerir; kaynakta bulunmayan ayrıntı rivayet olarak bile kesinleştirilmez.

### 1 Eratosthenes ve gölgeler

**Hikâye:** İskenderiye’deki bir gölge, güneydeki bir gözlemle neden aynı değildir? İki dik çubuk ve yaklaşık paralel Güneş ışınları gösterilir. Çubuklar eğri bir yüzeyde farklı yönlere bakar. İki şehir arasındaki yol, bütün turun küçük bir parçasıdır. Yaklaşık MÖ üçüncü yüzyıl bağlamı ve Syene ile modern Asvan ayrımı korunur.

**Biraz daha:** Eğitim örneğinde 800 kilometrelik yolun turun ellide biri olduğu gösterilir; sonuç yaklaşık 40 bin kilometredir. **Matematiği:** Merkez açı ile gölge açısının ilişkisi ve çevre oranı türetilir. Aynı meridyen, uygun zaman, dik çubuklar ve uzak Güneş varsayımları açıkça listelenir.

**Hata ve etki:** Stadionun uzunluğu, yolun nasıl belirlendiği ve sonraki aktarımlar sonuç aralığını etkiler. Bematiste ilişkin ayrıntılar doğrudan deney kaydı gibi sunulmaz. **Aklında kalsın:** Bütün turu yürümek için küçük bir parçanın turda ne kadar yer tuttuğunu bilmek yeterlidir.

### 2 Posidonius ve Canopus

**Hikâye:** Rodos ve İskenderiye’de aynı yıldız aynı yükseklikte görünmez. Bir gözlemci yıldızın ufuktaki yerini karşılaştırırken kendi ufkunun da değiştiğini fark eder. Tarihsel bağlam MÖ birinci yüzyıldır; anlatımların aktarım farkları saklanmaz.

**Biraz daha:** İki yerin kuzey-güney uzaklığı ile yıldız yüksekliği farkı eşleştirilir. **Matematiği:** Aynı göksel yön ve meridyen geometrisinden çevre oranı çıkarılır; ufka yakın kırılma ayrıca ele alınır.

**Hata ve etki:** Özellikle ufka yakın yıldız yüksekliği hassastır; sonraki kaynaklarda farklı mesafe ve çevre değerleri bulunabilir. **Aklında kalsın:** Aynı göğe bakarken değişen şey, üzerinde durduğun yerin yönü olabilir.

### 3 Batlamyus ve koordinatlar

**Hikâye:** İkinci yüzyılda bir coğrafyacı binlerce yeri aynı çizim üzerinde nasıl gösterebilir? Enlem ve boylam, adres bulmaya yarayan iki yönlü çizgi sistemi olarak tanıtılır. “Talihli Adalar” başlangıcı modern tek bir ada koordinatıymış gibi verilmez.

**Biraz daha:** İki noktanın koordinatı bir kâğıt ızgarasında bulunur. **Matematiği:** Kürede koordinatlar, ölçek ve izdüşüm farkı açılır.

**Hata ve etki:** Derlenen veriler, yanlış ölçek ve uzunluklar haritayı bozabilir. Batlamyus’un katkısı yeni bir saha çevre ölçümüyle eş tutulmaz. **Aklında kalsın:** İyi bir adres sistemi, içindeki bütün ölçümlerin doğru olduğu anlamına gelmez.

### 4 Aryabhata ve Hint astronomisi

**Hikâye:** Beşinci ve altıncı yüzyılların astronomları gökyüzünü hesaplamak için tablolar kurar. Bir çemberi kısa parçalara ayırarak anlaşılır bir hesap yolu bulunur. Dünya’nın dönüşü ve boyutuna ilişkin fikirler tarihsel bağlamında anlatılır.

**Biraz daha:** Yojana cinsinden verilen bir uzunluğun başka birime çevrilirken neden aralığa dönüşebildiği gösterilir. **Matematiği:** Çember, kiriş ve sinüs ilişkisi açılır.

**Hata ve etki:** Birim karşılığına göre modern kilometre sonucunun değiştiği belirtilir. Jyā, jība, jayb ve sinus kelime zinciri, filolojik kaynakla doğrulanması gereken ayrı bir dil tarihi kutusudur; bir okuma hatası bütün hikâyeyi tek başına açıklıyormuş gibi anlatılmaz. **Aklında kalsın:** Bilimsel fikirler kadar onları taşıyan sözcükler ve birimler de yolculuk eder.

### 5 Me’mun dönemi ve Sincar ölçümleri

**Hikâye:** Dokuzuncu yüzyılda ekipler eski bir sayıyı kabul etmek yerine yeniden ölçmeyi dener. Kuzeye ve güneye giden ekipler mesafeyi ve gökteki değişimi karşılaştırır. Futbol topundaki bir karıncanın yerel ufkunun değişmesi benzetmesi kullanılır.

**Biraz daha:** Bir derecelik yay için aktarılan 56 ve 56 üçte iki mil gibi sonuçlar, farklı anlatım ve birim yorumlarıyla gösterilir. **Matematiği:** Meridyen yayı, göksel kutup yüksekliği ve enlem ilişkisi; mevsim düzeltmeli Güneş gözlemi alternatifleri ayrılır.

**Hata ve etki:** Arap mili, arşın, yer, araç ve uygulama ayrıntıları bütün kaynaklarda aynı değildir. Biruni’nin aktarımında öğle Güneşi ve mevsim düzeltmesi vardır; deney kesin olarak bugünkü Kutup Yıldızı tekniğiyle yapılmış gibi sunulmaz. Usturlap, ip ve kazık sahnesi öğretim modeli olarak etiketlenir. Harezmi tabloları, sınanmış zîc ve harita ihtiyacı bağlam olarak işlenir; doğrudan motivasyon iddiaları kaynakla sınırlandırılır. **Aklında kalsın:** İki ekibin sonucu karşılaştırması, sayıyı yeniden sınamayı sağlar.

### 6 Biruni ve ufuk

**Hikâye:** On birinci yüzyılın başlarında Nandana çevresinde dağın yüksekliği ile tepedeki ufkun görünüşü birleştirilir. Önce dağın yüksekliğinin de ölçülmesi gerektiği gösterilir. Küçük top ile büyük topun ufuk çizgisi karşılaştırılır.

**Biraz daha:** Aynı yükseklikte ufkun daha çok alçalmasının daha küçük bir küreye karşılık geldiği denenir. **Matematiği:** Dağ tepesi, merkez ve teğet ufuk arasındaki dik üçgenden yarıçap bulunur.

**Hata ve etki:** Çok küçük ufuk açısındaki hata, dağ yüksekliği ve atmosferik kırılma sonucu etkiler. Yöntemin geometrisiyle tarihsel sonucun aşırı kesinliği ayrı değerlendirilir. Uzun bir meridyen yayını ölçme gereği azalır; dağ yüksekliği ölçümü ortadan kalkmaz. **Aklında kalsın:** Ufkun aşağıda görünmesi, büyük bir kürenin küçük bir ipucudur.

### 7 Fernel ve tekerlek

**Hikâye:** On altıncı yüzyıl Fransa’sında bir yolun uzunluğu tekerlek dönüşleriyle izlenir. Bisiklet sayacı benzetmesiyle tekerleğin her turda ne kadar yol aldığı anlatılır. Paris ile Amiens bağlamı verilir.

**Biraz daha:** Bir turda gidilen yol ile dönüş sayısı çarpılır. **Matematiği:** Mesafe, enlem farkı ve çevre bağı kurulur.

**Hata ve etki:** Tekerlek kayması, yol kıvrımları ve doğrultu önemlidir. Sık verilen 1525 tarihiyle 1528 tarihli yayımlanmış çalışma aynı olaymış gibi yazılmaz. **Aklında kalsın:** Yol sayacı ölçer; hangi yolu ölçtüğünü yine sen seçersin.

### 8 Snellius ve üçgen zinciri

**Hikâye:** On yedinci yüzyıl Hollanda’sında her tarlayı baştan sona ölçmeden kuleler arasında bir ağ kurulur. İki gözün aynı nesneye ayrı yerden bakması benzetmesiyle yön ölçmek tanıtılır. Bilinen taban, görünür kuleler ve yeni üçgenler sırayla gösterilir.

**Biraz daha:** Ölçekli çizimde bilinen kenardan öteki kenarlar bulunur. **Matematiği:** Sinüs teoremi ve zincire taşınan belirsizlik açılır.

**Hata ve etki:** Kısa taban, ince üçgen ve açı hatası önemlidir. Üçgenleme daha eski fikirlerle bağları olan bir gelişmedir; tek anda yoktan doğmuş gibi anlatılmaz. **Aklında kalsın:** Bir iyi kenar ve iki yön, uzaktaki bir yeri ölçülebilir kılar.

### 9 Picard ve daha iyi açı ölçümü

**Hikâye:** On yedinci yüzyıl Fransa’sında teleskopla daha iyi nişan almak aynı üçgen fikrini güçlendirir. Bulanık bir hedefi daha net görmek benzetmesi kullanılır. Araçtaki iyileşmenin ağın sonucuna nasıl taşındığı görülür.

**Biraz daha:** Aynı ağda daha küçük gözlem hatası denenir. **Matematiği:** Açı belirsizliğinin kenar hesabına etkisi ve meridyen yayı ölçümü açılır.

**Hata ve etki:** Araç, hizalama ve yıldız gözlemleri önemlidir. Newton’la ilişkisi kronolojik ve kaynaklı anlatılır; tek ölçümün bütün kuramı ispatladığı söylenmez. **Aklında kalsın:** Aynı fikir, daha iyi aletlerle daha güçlü bir ölçüme dönüşür.

### 10 Fransız seferleri ve Dünya’nın şekli

**Hikâye:** On sekizinci yüzyılda Laponya ve Güney Amerika’daki ekipler, Dünya’nın her yerde aynı eğriliğe sahip olup olmadığını sınar. İki farklı yerde bir göksel değişim için gereken yürüyüş karşılaştırılır.

**Biraz daha:** Bir derecelik kuzey-güney yayının uzunluğunun enleme göre değiştiği gösterilir. **Matematiği:** Küre ile basık elipsoit ve meridyen eğrilik yarıçapı ayrılır.

**Hata ve etki:** Sefer koşulları, ölçüm ağı ve yerel etkiler sonuca girer. “Peru” tarihsel sefer adı, bugünkü ülke sınırlarıyla karıştırılmaz. **Aklında kalsın:** Dünya yuvarlaktır ama kusursuz bir top değildir.

### 11 Metrenin doğuşu

**Hikâye:** Delambre ve Méchain’in Dunkirk ile Barselona arasındaki ölçümü ortak bir uzunluk birimi arayışına bağlanır. Bir kapının boyunu yerel ayaklarla değil herkesin paylaşacağı bir ölçüyle anlatma ihtiyacı gösterilir.

**Biraz daha:** Ekvator ile kutup arasındaki mesafenin eşit küçük parçalara bölünmesi anlatılır. **Matematiği:** Meridyen yayı, bütün çeyrek meridyene genelleme ve tanım ile gerçekleşme farkı açılır.

**Hata ve etki:** Tarihsel metre tanımıyla bugün ışık hızına dayanan tanım ayrılır. Méchain’in gözlem uyuşmazlığı, belgelere dayalı anlatılır; kişisel niyeti kesinmiş gibi yazılmaz. **Aklında kalsın:** Birimin tanımı ile onu aletle elde etmek aynı şey değildir.

### 12 Harrison ve boylam

**Hikâye:** Açık denizde doğuya veya batıya ne kadar gidildiğini anlamak için iki yerdeki zamanı karşılaştırmak gerekir. Harrison’ın saatleri, evdeki zamanı yolculuğa taşır. Bu, doğrudan Dünya çevresini yeniden ölçmekten farklı bir konum bulma problemidir.

**Biraz daha:** Bir günlük dönüşün saat farkına bölünmesi gösterilir. **Matematiği:** Zaman farkı ile boylam açısı ve saat hatası ilişkisi açılır.

**Hata ve etki:** Sıcaklık, sallanma ve saatin zaman tutma hatası önemlidir. **Aklında kalsın:** Uzak bir yerin saatini yanında taşırsan doğu-batı konumunu karşılaştırabilirsin.

### 13 Greenwich ve ortak başlangıç

**Hikâye:** 1884 Washington konferansında haritalar için ortak bir başlangıç aranır. Bir cetvelin sıfır noktasını nereden başlatacağımız benzetmesi kullanılır. Sıfır çizgisinin seçimi, fiziksel bir ayrıcalıkla karıştırılmaz.

**Biraz daha:** Aynı yerin farklı başlangıçlara göre boylam adının değiştiği görülür. **Matematiği:** Koordinat başlangıcı dönüşümü ve referans sistemleri açılır.

**Hata ve etki:** Tarihsel Greenwich çizgisiyle modern uydu sistemlerinin referans meridyeni ayrı tutulur. **Aklında kalsın:** Ortak başlangıç uzlaşmayla seçilir; Dünya üzerindeki yerler bu kararla hareket etmez.

### 14 Uydular ve GPS

**Hikâye:** Yeri bilinen birden çok uydudan gelen sinyalin yolculuk süresi, alıcının nerede olabileceğini sınırlar. Arkadaşlarının uzaklıklarını söylediği oda benzetmesi, telefonun saatinin de tam doğru olmadığı açıklamasıyla tamamlanır.

**Biraz daha:** Uzaklık çemberlerinin veya kürelerinin kesişmesi gösterilir. **Matematiği:** Uzaklık ölçerek konum bulma, saat sapması ve en az dört uydu gereksinimi açılır. Açılarla çalışan üçgenlemeden farkı belirtilir.

**Hata ve etki:** Atmosfer, yansımalar, uydu geometrisi ve alıcı saati önemlidir. Telefonda metre ölçeği ile özel alıcı, düzeltme ve gözlem teknikleriyle santimetre ölçeği birbirine eşitlenmez. WGS 84 bir referans sistemidir; Dünya’nın bütün yüzeyi tek düzgün küre değildir. **Aklında kalsın:** Uydu konumu, uzaklık ve zaman birlikte düşünülür.

Harrison konusu tarihe göre zaman çizelgesinde metre konusundan önce gösterilebilir; bölüm numarası briefteki konu listesini izler. Ara katmanlar kapalıyken bütün hikâyeler anlamını korur.

## Özel alanların içerik taslağı

**Birim Hataları Galerisi:** Mars Climate Orbiter örneğinde birimler arasındaki yazılım arayüzü hatası kaynakla açıklanır. “Sayı” ve “birimiyle sayı” ayrımı günlük bir alışveriş etiketiyle gösterilir. Kolomb’un hesapları tek bir mil karışıklığına indirgenmez; coğrafya, birim ve Asya’nın boyutu gibi etkenlerin hangilerinin desteklendiği ayrı değerlendirilir.

**Birim Çevirici:** Modern kilometre ve uluslararası mil belirli dönüşümlerle çalışır. Stadion, tarihsel Arap mili, arşın ve fersah için ad, bölge, dönem, kaynak ve bir aralık gerekir. Aralıkların uçları çarpılarak sonuç aralığı üretilir. Aralık kaynağı yoksa uydurma yüzde eklenmez; hesap durumu “bu yorum için kaynak gerekli” olarak gösterilir.

**Kim Ne Kadar Yaklaştı:** Ekvator çevresi yaklaşık 40.075 kilometre, meridyen çevresi yaklaşık 40.008 kilometredir. Kuzey-güney yayından çıkarılmış bir tarihsel çevreyi ekvatorla karşılaştırmanın küçük bir referans farkı içerdiği gösterilir. Birim belirsizliği ile gözlem hatası ayrı açıklanır. D3 grafiğinin altında aynı veriyi veren metin veya tablo bulunur.

**Türkiye Üzerinden Anla:** Anamur ve Sinop arasındaki enlem farkı ile kuzey-güney uzaklık, seçilen gerçek koordinatlardan hesaplanır; briefteki “yaklaşık altı derece ve 670 kilometre” yalnızca kaba bir benzetmedir. İstanbul-İzmit örneği tek kesin 112 kilometrelik mesafe gibi sunulmaz. Karayolu ve havadan mesafe, bir derecelik meridyen yayı değildir.

**Bugünün Bağlantısı:** Telefonun konumu, harita izdüşümü ve derinlik algısı, ilgili tarihsel konudan erişilen kısa kartlardır. Web Mercator’ın yüksek enlemlerde boyutları neden büyüttüğü küre ile yan yana gösterilir. İzdüşüm hatası, GPS alıcı hatasıyla karıştırılmaz.

## Altı simülasyonun ayrıntılı tasarımı

Ortak arayüz: dört kısa hikâye adımı, “Geri” ve “İleri”, sonunda “Serbest dene”, varsayılan kapalı “Rakamları göster” ve ayrı “Matematiği” açıklaması. İlk adımda yalnızca tek bir görsel durum değişir. Her sahnede metinle aynı sonucu anlatan bir açıklama bulunur. Görsel açıların okunabilirlik için büyütüldüğü sahneler ölçekli çizim diye sunulmaz. Kaydırıcıların erişilebilir adları, klavye desteği ve sınırları vardır; yeniden başlatma başlangıç değerlerini geri getirir.

### Eratosthenes simülatörü

**Hikâye adımları:** İki dik çubuğu gör → Paralel ışınlar gelsin → Bir çubuğun gölgesi uzasın → İki yerin arasındaki yayla bütün turu ilişkilendir. Sonra mesafe veya açı tek tek değiştirilebilir.

**Girdiler:** Kuzey-güney yüzey mesafesi 100 ile 2.000 kilometre; açı farkı 1 ile 20 derece; başlangıç 800 kilometre ve 7,2 derece. **Çıktılar:** Gölge ve merkezdeki yay değişimi; istenirse hesaplanan çevre; “aynı yolda daha fazla yön değişimi, daha küçük küre” açıklaması.

**Hesap:** `C = 360 × d / θ`. Çubuk yüksekliği ve gölge girilen genişletmede `θ = arctan(s / h)` kullanılır; iki yerin uygun işaretli açı farkı gerekir. Sıfır açı bölme hatası üretemez; arayüz minimumuyla engellenir. **Arayüz:** Küre kesiti, iki çubuk, paralel ışınlar, iki etiketli kaydırıcı ve seçmeli sonuç kutusu. İki yerin aynı meridyende olduğu ideal model açıkça yazılır.

### Sincar simülatörü

**Hikâye adımları:** Ekipleri ortak başlangıçta gör → Biri kuzeye, biri güneye yürüsün → Mesafe ve düzeltilmiş göksel yükseklik değişimi izlensin → İki bağımsız sonuç karşılaştırılsın. İp ve kazık sahnesi bir öğretim canlandırmasıdır.

**Girdiler:** İki ekibin yol uzunluğu ayrı ayrı 20 ile 160 kilometre; başlangıç yaklaşık 111,2 kilometre. İsteğe bağlı gözlem hatası 0 ile 6 yay dakikası. **Çıktılar:** İki yol, iki göksel değişim, iki çevre tahmini ve farkın açıklaması.

**Hesap:** Eğitim küresinde `Δφ = d / 111,2`; sonra `C = 360 × d / |Δφ + ε|`. Hata yay dakikasından dereceye `ε / 60` ile çevrilir. Ekipler arasında zıt işaretli örnek hata farkı görünür kılar. Bu sabit, tarihsel ölçüm sonucu değil modelin yaklaşık bir derecelik yay uzunluğudur. **Arayüz:** Yer paneli, gök paneli, ekip seçimleri, iki sonuç şeridi. “Kutup Yıldızı gök kutbu değildir” notu zorunludur. Kesin tarihsel düzeltmenin bilinmediği ve öğle Güneşiyle ilgili aktarımlar bulunduğu belirtilir.

### Biruni simülatörü

**Hikâye adımları:** Alçak gözlemcinin ufkunu gör → Dağa çık → Ufkun biraz aşağıya indiğini fark et → Yükseklik ve ufuk birlikte kürenin büyüklüğünü sınırlasın.

**Girdiler:** Yükseklik 10 ile 1.500 metre; ufuk alçalması 0,1 ile 2 derece; başlangıç 300 metre ve 0,57 derece. İsteğe bağlı atmosfer etkisi anahtarı. **Çıktılar:** Dağ, göz doğrultusu, ufka teğet ışın ve isteğe bağlı yarıçap ile çevre.

**Hesap:** `cos(δ) = R / (R + h)`; buradan `R = h × cos(δ) / (1 − cos(δ))`, `C = 2πR`. Açı hesap içinde radyana dönüştürülür; metre ve kilometre dönüşümü açıkça yapılır. Sabit 0,03 derecelik örnek düzeltme kullanılırsa bu, kalibre edilmiş bir atmosfer modeli değil yalnızca duyarlılık denemesidir. **Arayüz:** Büyük kesit çizimi, iki kaydırıcı, atmosfer etkisi ve duyarlılık açıklaması. Matematik yalnız açılır katmandadır.

### Üçgenleme simülatörü

**Hikâye adımları:** Bilinen tabanı kur → İki uçtan ilk kuleyi gör → Bir kule daha ekleyerek ağı büyüt → Açı belirsizliğiyle hedef bölgesinin genişlemesini izle.

**Girdiler:** İlk iki noktanın oluşturduğu taban 50 ile 500 metre, çizime eklenen kule noktaları ve 0,1 ile 2 derece açı belirsizliği. İlk modelde tabanın ekrandaki uçları sabittir, uzunluğu kaydırıcıyla değişir ve en çok beş nokta kullanılır; tabanı yeniden çizmek sonraki geliştirmedir. **Çıktılar:** Üçgenler, örnek yönler, belirsizlik şeritleri ve kaç adımda hata taşındığını anlatan metin.

**Hesap:** Bir üçgende `a / sin(A) = b / sin(B) = c / sin(C)`. İlk görsel belirsizlik yaklaşık `U = L × ε × n^(3/2)` ile büyütülür; açı radyan cinsindedir. Bu büyüme kalibre edilmiş bir hata hesabı veya ağ dengelemesi değildir. Bağımsız yön pertürbasyonu, kovaryans çözümü ve kapanış denetimi sonraki aşamadır. **Arayüz:** Dokunulabilir SVG çalışma yüzeyi, eşdeğer “kule ekle” düğmesi, sıfırlama ve hata kaydırıcısı.

### Usturlap simülatörü

**Hikâye adımları:** Yerel ufku tanı → Nişangâhı hedefe çevir → Yüksekliği alet üzerinde oku → Yalnız ideal gök kutbu seçildiğinde enlemle ilişkilendir.

**Girdiler:** Nişangâh yüksekliği 0 ile 85 derece ve hedef türü. İdeal gök kutbu seçildiğinde gözlem yeri 15 ile 65 derece kuzey enleminde değişir; örnek yıldızın yüksekliği alıştırmada 61 derecede sabittir. **Çıktılar:** Alet üzerindeki görüş hattı, istenirse yükseklik ve hedefe göre yorum. **Hesap:** İdeal gök kutbu için `φ = h_p`. Genel yıldız için bu eşitlik kullanılmaz; ileri katmanda `sin(h) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(H)` bağıntısı ayrıca anlatılır. Bu alıştırma gerçek zamanlı yıldız göğü değildir.

**Arayüz:** Büyük, sadeleştirilmiş alet görünümü ve klavyeyle işletilen hedef kaydırıcısı. Belirli bir tarihsel usturlabın bütün işlevlerini yeniden ürettiği iddia edilmez. Yıldız yüksekliği ölçmekle tek başına enlem bulmak arasındaki ek bilgi ihtiyacı görünür kalır.

### Portakal ve kalem deneyi

**Hikâye adımları:** Eksen yönünü sabitle → Gözlemciyi ekvatorda gör → Gözlemciyi kuzeye taşı ve yerel ufku döndür → Kutup yönünün ufuktan yüksekliğini karşılaştır.

**Girdiler:** Kuzey yarımkürede 0 ile 80 derece arasında gözlemci enlemi; sayısal okuma tercihi. **Çıktılar:** Küre, eksen, gözlemcinin yerel ufku ve sabit gök kutbu doğrultusu. **Hesap:** İdeal kürede kutup yüksekliği enleme eşittir: `h_kutup = φ`. Yüzey yayı için `s = R × Δφ` radyan cinsinden kullanılır. Küre büyüklüğü aynı yolun yön değişimini belirler. Kutup Yıldızı ile ideal gök kutbu birbirinden ayrılır.

**Arayüz:** Tek enlem kaydırıcısı, ekvator ve kutup için hızlı seçimler, sabit uzak yönü gösteren paralel çizgiler. Yakın bir binaya yaklaşma benzetmesi yalnız sezgi içindir; gerçek neden yıldızın yakına gelmesi değil yerel ufkun dönmesidir.

## Görsel ve erişilebilir tasarım

Lacivert gece, parşömen ve bakır tonları bilimsel çizgilerle birleştirilir. Portresi bilinmeyen kişiler için alet veya yer çizimi kullanılır. Zaman çizelgesinde görsel değişim anlatı adımını destekler; uzun zorunlu animasyon beklemeleri kullanılmaz. Sayısal grafikler desen, etiket veya şekille de ayrılır.

Hedef WCAG 2.1 AA’dır. Bunu bir uyum sertifikası olarak sunmak için ayrıca erişilebilirlik denetimi gerekir. İlk sürümde semantik başlıklar, görünür odak, klavyeyle kontroller, form etiketi, açılır bölüm durumları, metin eşdeğerleri ve azaltılmış hareket tercihi temel kabul ölçütleridir. Mobilde sahne ve kontroller alt alta gelir; yatay kaydırma gerektiren formüller kendi kutusunda kalır. Harita ve üç boyutlu sahne, içeriğe ulaşmanın tek yolu olmaz.

## Kaynak proje yapısı ve çalıştırma

Ana kod **React ve Vite** kullanır. D3 karşılaştırma için, Three.js küre için, Leaflet atlas için, KaTeX açılan matematik için ve Framer Motion arayüz hareketleri için ayrılmıştır. Ağır görsel bileşenlerin ayrı yüklenmesi amaçlanır. Formül veya sayısal veri, hikâye katmanının içine taşınmaz.

```text
dunyayi-olcmek/
  index.html
  package.json
  vite.config.js
  TASARIM_VE_YOL_HARITASI.md
  public/
    favicon.svg
    calisma-kagitlari.pdf
    image-credits.json
    images/
      earth.webp
      astrolabe.webp
      idrisi-map.webp
      sundial.webp
  src/
    main.jsx
    App.jsx
    styles.css
    content/
      index.js
      chapters.json
      tr/
        eratosthenes.md
        posidonius.md
        ptolemy.md
        aryabhata.md
        sincar.md
        biruni.md
        fernel.md
        snellius.md
        picard.md
        french-expeditions.md
        metre.md
        longitude.md
        greenwich.md
        gps.md
    components/
      Simulations.jsx
      simulations.css
      Atlas.jsx
      Atlas.css
      Globe.jsx
      Comparison.jsx
      Comparison.css
```

Ana içerik kaynağı `src/content/tr/` içindeki 14 Markdown dosyasıdır. `src/content/index.js`, dosyaların JSON biçimli ön bilgisini ve hikâye gövdesini Vite üzerinden okur; uygulama bu kaynaktan oluşur. `chapters.json`, karşılaştırma gibi yardımcı bileşenlerin kaynak verisi olarak tutulur; yeni bir içerik değişikliğinde Markdown ile bu kopyanın eşlenmesi gerekir. Türkçe aktiftir. İngilizce ve Arapça kayıtları ile dil yönü altyapısı vardır; çeviriler ve kullanıcı dil seçimi tamamlanmış değildir. Arapça RTL görünümünün denetlenmesi gelecek aşamadadır.

Proje klasöründe `npm install`, ardından `npm run dev` yerel geliştirmeyi açar. `npm run build` statik `dist/` klasörünü üretir. Yayın için bu klasör kullanılır; Vite taban yolu depo alt yoluna göre kontrol edilir. Tam kaynak arşivi proje klasörünün yanında `dunyayi-olcmek-kaynak.zip` olarak hazırlanır. Çalışma kâğıtları uygulamada `public/calisma-kagitlari.pdf` yolundan sunulur.

## Geliştirme yol haritası

Teslim edilen ilk pakette ana sayfa, kronolojik dönem anlatısı, 14 Markdown konu, üç katman, mini testler, altı pedagojik simülasyon, Leaflet atlası, Three.js küresi, D3 karşılaştırması, birim atölyesi ve beş sayfalık PDF vardır. Aşağıdaki ilk iki satır bu paketin kapsamını ve kabul ölçütlerini, sonraki satırlar genişletmeyi tanımlar. Görsel modellerin bilimsel doğrulaması, tarihçi incelemesi ve tam WCAG denetimi ayrı iş kalemleridir.

| Aşama | Somut kapsam | Tamamlanma ölçütü |
| --- | --- | --- |
| MVP | Çalışan ana sayfa, zaman çizelgesi, 14 konu, üç katman, kaynak bağlantıları, Eratosthenes deneyi ve temel öğretmen alanı. | Hikâye katmanı tek başına anlaşılır; kapalı matematik görülmez; üretim derlemesi açılır; mobil ve klavye ana akışları tamamlanır. |
| Etkileşimli ilk paket | Altı pedagojik simülasyon, atlas, küre, karşılaştırma, birim atölyesi ve beş sayfalık çalışma kâğıdı. | Her sim ileri ve geri çalışır; serbest deneme kontrol edilebilir; sonuç birimleri tutarlıdır; PDF sayfaları taşmadan yazdırılır. |
| İçerik ve tarih incelemesi | Bölüm başına birincil pasaj, akademik yorum ve tartışmalı ayrıntıların gözden geçirilmesi; birim aralıklarının kaynaklanması. | Tarihçi incelemesi tamamlanır; belirsiz veri kesin sayı olarak çizilmez; her birim aralığının dayanağı bulunur. |
| Okur ve sınıf denemesi | Matematik kaygısı olan okurla anlatma testi; iki okul deneyi; öğretmen geri bildirimi. | Okur yöntemi formülsüz anlatır; karıştırdığı adımlar düzeltilir; gözlem fişi başka ekipçe yeniden kullanılabilir. |
| Gelişmiş modeller | Gerçek Güneş doğrultusu, tarih ve koordinat; istatistiksel üçgen ağı; daha gerçekçi kırılma; hesapların dışa aktarımı. | Girdi sınırları ve birimler doğrulanır; model sonuçları bağımsız örneklerle karşılaştırılır; fiziksel olmayan durumlar açıklanır. |
| Çok dillilik ve yayın | Mevcut Türkçe Markdown hattının sürdürülmesi, İngilizce ve Arapça çeviriler, RTL, kalıcı bağlantılar, önbellek ve görsel performans iyileştirmeleri. | Dil anahtarı aynı konuya gider; Arapça okuma sırası denetlenir; statik yayın alt yolunda dosya ve PDF bağlantıları çalışır. |

Üretim yayını öncesi temel kontrol: kaynağı belirsiz sayı kalmaması, karşılaştırma referansının açıklanması, mobilde dokunma alanları, klavyeyle altı simülasyon, azaltılmış hareket, ekran okuyucu adları ve yavaş bağlantıda ilk açılış. Gösterilen pedagojik modeller, tarihsel ölçümün bütün ayrıntılarını yeniden üreten bilimsel araçlar olarak tanıtılmaz.

## Kaynak başlangıç listesi

Bu liste içerik ve model incelemesi için başlangıçtır. Kaynak pasajı bir iddiayı desteklemiyorsa o ayrıntı “doğrulanmalı” olarak kalır.

- [NASA Dünya hakkında temel geometri ve Eratosthenes açıklaması](https://imagine.gsfc.nasa.gov/features/cosmic/earth_info.html).
- [MacTutor Biruni’nin koordinatlar metninden aktarım](https://mathshistory.st-andrews.ac.uk/Extras/Al-Biruni_coordinates/) - Me’mun dönemi ölçümlerindeki farklı aktarımlar için.
- [Encyclopaedia Iranica Biruni coğrafyası](https://www.iranicaonline.org/articles/biruni-abu-rayhan-index/biruni-abu-rayhan-iv/) - dağ yöntemi ve tarihsel bağlam için.
- [Académie nationale de médecine Fernel incelemesi](https://www.academie-medecine.fr/jean-fernel-et-lesprit-humaniste/) - tarih ve eser ayrımı için.
- [Observatoire de Paris Picard ve üçgenleme](https://bibnum.obspm.fr/la-triangulation-ou-comment-calculer-la-valeur-du-rayon-terrestre).
- [IGN Dünya’nın şeklinin tarihi](https://www.ign.fr/mag/la-forme-de-la-terre-dans-lhistoire-occidentale).
- [NIST metre](https://www.nist.gov/si-redefinition/meter) ve [BIPM tarihsel metre](https://www.bipm.org/en/-/2024-10-01-metre-radio).
- [Royal Museums Greenwich Harrison saatleri](https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem) ve [başlangıç meridyeni](https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich).
- [FAA GPS nasıl çalışır](https://www.faa.gov/about/office_org/headquarters_offices/ato/service_units/techops/navservices/gnss/gps/howitworks) ve [NGA WGS 84](https://earth-info.nga.mil/index.php?action=wgs84&dir=wgs84).
- [NOAA Güneş konumu hesap ayrıntıları](https://gml.noaa.gov/grad/solcalc/calcdetails.html) - eğitim hesapları için; çevrimiçi hesaplayıcı artık etkin olarak sürdürülmemektedir, yerel en kısa gölge gözlemiyle birlikte kullanılmalıdır.
