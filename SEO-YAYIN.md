# Yayın öncesi kalan ayarlar

Alan adı henüz seçilmedi. Yerel adresler Google için yayın adresi değildir.

1. Nihai HTTPS alan adı seçilince `node configure-domain.mjs https://ALAN-ADI` çalıştırın. Gerçek alan adını kullanın; örnek adresi yayımlamayın. Bu komut canonical adresleri, işletmenin URL alanlarını, sitemap.xml ve robots.txt dosyasını hazırlar.
2. `dist` klasörünü HTTPS destekleyen statik hostingde yayımlayın. Ana adresin `/` ve `/index.html` sürümleri için kalıcı yönlendirme ayarlayın; canonical ana sayfa `/` olur.
3. Google Search Console'da alan adı sahipliğini doğrulayın, `/sitemap.xml` gönderin ve ana sayfanın URL denetimini yapın.
4. Google İşletme Profili'ne aynı site adresini ekleyin. Adres, telefon, açık günler ve 08.00–22.00 saatlerini işletmeyle doğrulayın. Günler kullanıcı tarafından belirtilmediği için yapılandırılmış veriye gün adı eklenmedi.
5. Yayındaki URL'yi Google Rich Results Test ve PageSpeed Insights ile kontrol edin. Yereldeki test, Google tarafından tarandığı anlamına gelmez.

Sahte değerlendirme, fiyat, kesin ürün bulunabilirliği veya sıralama garantisi eklenmedi. Kategori görselleri temsilidir.
