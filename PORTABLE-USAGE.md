# MicroManager Portable Kullanım Kılavuzu

Bu belge, MicroManager uygulamasının portable (taşınabilir) versiyonunu kullanma talimatlarını içerir.

## Portable Paket İçeriği

Portable paket, aşağıdaki dosya ve klasörleri içerir:

```
MicroManager-win32-x64/
├── MicroManager.exe       # Ana uygulama
├── resources/             # Uygulama kaynakları
├── locales/               # Dil dosyaları
└── [diğer dosyalar]       # Electron ve diğer bağımlılıklar
```

## Kullanım

1. Paketi istediğiniz bir konuma çıkartın
2. `MicroManager.exe` dosyasına çift tıklayarak uygulamayı başlatın
3. Uygulama ayarları ve servis bilgileri, kullanıcı profil dizininde saklanır:
   ```
   %APPDATA%\micromanager\micromanager-config.json
   ```

## Arkadaşlarınızla Paylaşma

### Zip Dosyası Olarak Paylaşma

1. `dist/MicroManager-win32-x64` klasörünü zip dosyası olarak sıkıştırın:
   - Windows Explorer'da klasöre sağ tıklayıp "Sıkıştırılmış klasöre gönder" seçeneğini kullanabilirsiniz
   - Veya 7-Zip gibi bir program kullanabilirsiniz
2. Oluşturulan zip dosyasını arkadaşlarınızla paylaşın

### USB Bellek ile Paylaşma

1. `dist/MicroManager-win32-x64` klasörünü bir USB belleğe kopyalayın
2. USB belleği arkadaşlarınıza verin
3. Arkadaşlarınız, USB bellekteki `MicroManager.exe` dosyasına çift tıklayarak uygulamayı çalıştırabilirler

## Gereksinimler

- Windows işletim sistemi (Windows 7 veya üzeri)
- .NET Core uygulamalarını çalıştırmak için gerekli runtime
- Kurulum gerektirmez, doğrudan çalıştırılabilir

## Notlar

- Uygulama ayarları, her kullanıcının kendi profil dizininde saklanır
- Farklı bilgisayarlarda kullanıldığında, servis yapılandırmaları taşınmaz
- Windows Defender veya antivirüs yazılımı, uygulamayı engelleyebilir (güvenilir olarak işaretlemeniz gerekebilir)

## Sorun Giderme

- **Uygulama Başlatılamıyor**: Windows Defender veya antivirüs yazılımı tarafından engellenmiş olabilir
- **Servisler Başlatılamıyor**: .NET Core runtime'ın yüklü olduğundan emin olun
- **Ayarlar Sıfırlanıyor**: `%APPDATA%\micromanager\micromanager-config.json` dosyasının yazılabilir olduğundan emin olun

## İletişim

Herhangi bir sorun yaşarsanız veya yardıma ihtiyacınız olursa, lütfen iletişime geçin. 