# MicroManager Portable Versiyon

Bu belge, MicroManager uygulamasının portable (taşınabilir) versiyonunu oluşturma ve kullanma talimatlarını içerir.

## Portable Versiyon Nedir?

Portable versiyon, kurulum gerektirmeden doğrudan çalıştırılabilen bir exe dosyasıdır. Bu dosyayı USB bellek gibi taşınabilir ortamlarda kullanabilir veya doğrudan bilgisayarınızda çalıştırabilirsiniz.

## Portable Versiyon Oluşturma

### Gereksinimler

- Node.js 14+ ve npm
- Git (isteğe bağlı, branch tespiti için)
- Windows işletim sistemi

### Adımlar

1. Projeyi klonlayın veya indirin
2. Proje dizinine gidin
3. Bağımlılıkları yükleyin:
   ```
   npm install
   ```
4. Portable versiyon oluşturun:
   ```
   npm run build:portable
   ```
5. Oluşturulan portable exe dosyası `dist` klasöründe olacaktır:
   ```
   dist/MicroManager-Portable-1.0.0.exe
   ```

## Icon Dosyası Hakkında

Uygulamanın düzgün bir ikona sahip olması için:

1. Gerçek bir ICO dosyası oluşturun (online araçlar kullanabilirsiniz)
2. Bu dosyayı `assets/icon.ico` olarak kaydedin
3. Portable versiyonu tekrar oluşturun

## Portable Versiyonu Kullanma

1. Oluşturulan exe dosyasını istediğiniz bir konuma kopyalayın
2. Dosyaya çift tıklayarak uygulamayı başlatın
3. Uygulama ayarları ve servis bilgileri, exe dosyasının bulunduğu dizinde değil, kullanıcı profil dizininde saklanır:
   ```
   %APPDATA%\micromanager\micromanager-config.json
   ```

## Portable Versiyonu Paylaşma

1. Oluşturulan exe dosyasını doğrudan paylaşabilirsiniz
2. Dosyayı e-posta, dosya paylaşım servisleri veya USB bellek gibi yöntemlerle paylaşabilirsiniz
3. Kullanıcıların Windows işletim sistemine sahip olması gerektiğini unutmayın
4. Kullanıcıların .NET Core uygulamalarını çalıştırmak için gerekli runtime'a sahip olması gerektiğini belirtin

## Sorun Giderme

- Uygulama başlatılamıyorsa, Windows Defender veya antivirüs yazılımı tarafından engellenmiş olabilir
- Servisler başlatılamıyorsa, .NET Core runtime'ın yüklü olduğundan emin olun
- Ayarlar sıfırlanıyorsa, `%APPDATA%\micromanager\micromanager-config.json` dosyasının yazılabilir olduğundan emin olun 