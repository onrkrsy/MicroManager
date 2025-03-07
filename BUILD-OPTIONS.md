# MicroManager Build Options

This document provides detailed information about the various build options available for the MicroManager application.

## Development Modes

### Regular Development Mode
```
npm start
```
- Sets `NODE_ENV=development`
- Enables DevTools in the application
- Useful for basic development and testing

### Enhanced Development Mode
```
npm run dev
```
- Sets `NODE_ENV=development` and `ELECTRON_ENABLE_LOGGING=true`
- Enables DevTools and additional console logging
- Useful for debugging and troubleshooting

## Distribution Options

### Electron Builder (Installer)
```
npm run build
```
- Uses `electron-builder` to create a Windows installer
- Creates a `.exe` installer in the `dist` directory
- Installs the application to the user's system
- Adds shortcuts to Start Menu
- Recommended for end users who prefer traditional installation

### Portable Executable
```
npm run build:portable
```
- Uses `electron-builder` to create a portable executable
- Creates a single `.exe` file in the `dist` directory
- No installation required, can be run directly
- Requires administrator privileges on some systems
- Note: May encounter symbolic link errors on some systems

### Zip Package
```
npm run build:zip
```
- Uses `electron-builder` to create a zip package
- Creates a `.zip` file in the `dist` directory
- Contains the application and all dependencies
- Easy to distribute via email or file sharing services
- Note: May encounter symbolic link errors on some systems

### Electron Packager (Directory)
```
npm run package
```
- Uses `electron-packager` to create a portable directory
- Creates a `MicroManager-win32-x64` directory in the `dist` folder
- Contains the application executable and all dependencies
- Can be zipped manually for distribution
- Most reliable method, works on all systems

## Choosing the Right Build Option

### For Personal Use
- **Development Mode**: Use `npm start` or `npm run dev` during development
- **Electron Packager**: Use `npm run package` for a reliable portable version

### For Sharing with Friends
- **Electron Packager + Zip**: Use `npm run package` and then zip the resulting directory
- **Portable Executable**: Use `npm run build:portable` if you don't encounter symbolic link errors

### For Distribution to End Users
- **Installer**: Use `npm run build` to create a proper installer
- **Zip Package**: Use `npm run build:zip` for users who prefer portable applications

## Manual Portable Package

If you encounter issues with the automated build processes, you can create a manual portable package:

1. Follow the instructions in [MANUAL-PORTABLE.md](MANUAL-PORTABLE.md)
2. This method requires Node.js to be installed on the target machine

## Icon Customization

To customize the application icon:

1. Create an ICO file using the instructions in [create-icon.md](create-icon.md)
2. Place the ICO file at `assets/icon.ico`
3. Rebuild the application using your preferred method

## Troubleshooting Build Issues

### Symbolic Link Errors
```
ERROR: Cannot create symbolic link : A required privilege is not held by the client
```
- Run the command prompt or PowerShell as Administrator
- Or use `npm run package` which doesn't require symbolic links

### Windows Defender Warnings
- Windows may flag the built application as potentially unsafe
- This is normal for unsigned applications
- Add an exception in Windows Defender or sign the application with a certificate

### Large File Size
- The packaged application may be large (100MB+) due to Electron
- This is normal and expected
- Consider using a file sharing service if the file is too large for email

---

# MicroManager Derleme Seçenekleri (Türkçe)

Bu belge, MicroManager uygulaması için mevcut çeşitli derleme seçenekleri hakkında detaylı bilgi sağlar.

## Geliştirme Modları

### Normal Geliştirme Modu
```
npm start
```
- `NODE_ENV=development` olarak ayarlar
- Uygulamada DevTools'u etkinleştirir
- Temel geliştirme ve test için kullanışlıdır

### Gelişmiş Geliştirme Modu
```
npm run dev
```
- `NODE_ENV=development` ve `ELECTRON_ENABLE_LOGGING=true` olarak ayarlar
- DevTools ve ek konsol loglamasını etkinleştirir
- Hata ayıklama ve sorun giderme için kullanışlıdır

## Dağıtım Seçenekleri

### Electron Builder (Kurulum Dosyası)
```
npm run build
```
- Windows kurulum dosyası oluşturmak için `electron-builder` kullanır
- `dist` dizininde bir `.exe` kurulum dosyası oluşturur
- Uygulamayı kullanıcının sistemine kurar
- Başlat Menüsüne kısayollar ekler
- Geleneksel kurulumu tercih eden son kullanıcılar için önerilir

### Portable Çalıştırılabilir Dosya
```
npm run build:portable
```
- Portable bir çalıştırılabilir dosya oluşturmak için `electron-builder` kullanır
- `dist` dizininde tek bir `.exe` dosyası oluşturur
- Kurulum gerektirmez, doğrudan çalıştırılabilir
- Bazı sistemlerde yönetici izinleri gerektirebilir
- Not: Bazı sistemlerde sembolik bağlantı hataları ile karşılaşabilirsiniz

### Zip Paketi
```
npm run build:zip
```
- Zip paketi oluşturmak için `electron-builder` kullanır
- `dist` dizininde bir `.zip` dosyası oluşturur
- Uygulamayı ve tüm bağımlılıkları içerir
- E-posta veya dosya paylaşım servisleri aracılığıyla dağıtımı kolaydır
- Not: Bazı sistemlerde sembolik bağlantı hataları ile karşılaşabilirsiniz

### Electron Packager (Dizin)
```
npm run package
```
- Portable bir dizin oluşturmak için `electron-packager` kullanır
- `dist` klasöründe bir `MicroManager-win32-x64` dizini oluşturur
- Uygulama çalıştırılabilir dosyasını ve tüm bağımlılıkları içerir
- Dağıtım için manuel olarak zip'lenebilir
- En güvenilir yöntem, tüm sistemlerde çalışır

## Doğru Derleme Seçeneğini Seçme

### Kişisel Kullanım İçin
- **Geliştirme Modu**: Geliştirme sırasında `npm start` veya `npm run dev` kullanın
- **Electron Packager**: Güvenilir bir portable versiyon için `npm run package` kullanın

### Arkadaşlarla Paylaşmak İçin
- **Electron Packager + Zip**: `npm run package` kullanın ve oluşan dizini zip'leyin
- **Portable Çalıştırılabilir**: Sembolik bağlantı hataları ile karşılaşmıyorsanız `npm run build:portable` kullanın

### Son Kullanıcılara Dağıtım İçin
- **Kurulum Dosyası**: Düzgün bir kurulum dosyası oluşturmak için `npm run build` kullanın
- **Zip Paketi**: Portable uygulamaları tercih eden kullanıcılar için `npm run build:zip` kullanın

## Manuel Portable Paket

Otomatik derleme süreçleriyle sorun yaşıyorsanız, manuel bir portable paket oluşturabilirsiniz:

1. [MANUAL-PORTABLE.md](MANUAL-PORTABLE.md) dosyasındaki talimatları izleyin
2. Bu yöntem, hedef makinede Node.js'nin yüklü olmasını gerektirir

## İkon Özelleştirme

Uygulama ikonunu özelleştirmek için:

1. [create-icon.md](create-icon.md) dosyasındaki talimatları kullanarak bir ICO dosyası oluşturun
2. ICO dosyasını `assets/icon.ico` konumuna yerleştirin
3. Uygulamayı tercih ettiğiniz yöntemle yeniden derleyin

## Derleme Sorunlarını Giderme

### Sembolik Bağlantı Hataları
```
ERROR: Cannot create symbolic link : A required privilege is not held by the client
```
- Komut istemini veya PowerShell'i Yönetici olarak çalıştırın
- Veya sembolik bağlantılar gerektirmeyen `npm run package` kullanın

### Windows Defender Uyarıları
- Windows, derlenmiş uygulamayı potansiyel olarak güvensiz olarak işaretleyebilir
- Bu, imzalanmamış uygulamalar için normaldir
- Windows Defender'da bir istisna ekleyin veya uygulamayı bir sertifika ile imzalayın

### Büyük Dosya Boyutu
- Paketlenmiş uygulama, Electron nedeniyle büyük olabilir (100MB+)
- Bu normal ve beklenen bir durumdur
- Dosya e-posta için çok büyükse bir dosya paylaşım servisi kullanmayı düşünün 