# ICO Dosyası Oluşturma

MicroManager uygulaması için bir ICO dosyası oluşturmak için aşağıdaki adımları izleyebilirsiniz:

## Online Araçlar Kullanarak

1. [ConvertICO](https://convertico.com/) gibi bir online araç kullanabilirsiniz
2. [ICOConvert](https://icoconvert.com/) başka bir seçenektir
3. [RealFaviconGenerator](https://realfavicongenerator.net/) da kullanılabilir

## Adımlar

1. Yüksek çözünürlüklü bir PNG veya SVG dosyası hazırlayın (en az 256x256 piksel)
2. Yukarıdaki araçlardan birini kullanarak bu dosyayı ICO formatına dönüştürün
3. Oluşturulan ICO dosyasını `assets/icon.ico` olarak kaydedin
4. Portable versiyonu tekrar oluşturun:
   ```
   npm run build:portable
   ```

## Önerilen Icon Boyutları

ICO dosyası, aşağıdaki boyutları içermelidir:
- 16x16
- 32x32
- 48x48
- 64x64
- 128x128
- 256x256

## Manuel Olarak Oluşturma

Eğer Photoshop veya GIMP gibi bir grafik düzenleme yazılımınız varsa:

1. Yeni bir dosya oluşturun (256x256 piksel)
2. İkonunuzu tasarlayın
3. ICO formatında dışa aktarın veya kaydedin
4. Oluşturulan dosyayı `assets/icon.ico` olarak kopyalayın

## Örnek Icon

Aşağıda, MicroManager için basit bir icon tasarımı önerisi bulunmaktadır:

- Arka plan: #3498db (mavi)
- Ön plan: Beyaz veya açık gri
- Sembol: Dişli çark veya mikroçip sembolü
- Yazı: "MM" veya "μM" (opsiyonel)

Bu tasarımı kullanarak kendi ikonunuzu oluşturabilir veya profesyonel bir tasarımcıdan yardım alabilirsiniz. 