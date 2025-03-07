# Manuel Portable Paket Oluşturma

Electron Builder ile paket oluşturma sırasında sembolik bağlantı hatası alıyorsanız, aşağıdaki adımları izleyerek manuel bir portable paket oluşturabilirsiniz.

## Gereksinimler

- Node.js 14+ ve npm
- Windows işletim sistemi

## Adımlar

### 1. Geliştirme Ortamını Hazırlama

```bash
# Projeyi klonlayın veya indirin
git clone https://github.com/kullanici/MicroManager.git
cd MicroManager

# Bağımlılıkları yükleyin
npm install
```

### 2. Uygulama Dosyalarını Hazırlama

```bash
# Yeni bir klasör oluşturun
mkdir MicroManager-Portable

# Gerekli dosyaları kopyalayın
copy main.js MicroManager-Portable\
copy preload.js MicroManager-Portable\
copy package.json MicroManager-Portable\
mkdir MicroManager-Portable\renderer
xcopy /E renderer MicroManager-Portable\renderer\
mkdir MicroManager-Portable\src
xcopy /E src MicroManager-Portable\src\
mkdir MicroManager-Portable\assets
xcopy /E assets MicroManager-Portable\assets\
mkdir MicroManager-Portable\node_modules
xcopy /E node_modules MicroManager-Portable\node_modules\
```

### 3. Başlatma Dosyası Oluşturma

MicroManager-Portable klasöründe `start.bat` adında bir dosya oluşturun:

```batch
@echo off
echo MicroManager başlatılıyor...
npx electron .
```

### 4. Paketleme

```bash
# Tüm dosyaları zip olarak sıkıştırın
# Windows Explorer'da MicroManager-Portable klasörüne sağ tıklayıp "Sıkıştırılmış klasöre gönder" seçeneğini kullanabilirsiniz
# Veya 7-Zip gibi bir program kullanabilirsiniz
```

## Kullanım

1. Zip dosyasını istediğiniz bir konuma çıkartın
2. `start.bat` dosyasına çift tıklayarak uygulamayı başlatın

## Notlar

- Bu yöntem, tam bir portable çözüm değildir çünkü Node.js ve npm gerektirir
- Kullanıcıların bilgisayarında Node.js yüklü olmalıdır
- Uygulama ayarları hala `%APPDATA%\micromanager\micromanager-config.json` dosyasında saklanır
- Daha gelişmiş bir portable çözüm için, Electron Builder'ı yönetici izinleriyle çalıştırmayı deneyebilirsiniz

## Alternatif: Electron Packager Kullanma

Electron Builder yerine Electron Packager kullanmayı deneyebilirsiniz:

```bash
# Electron Packager'ı yükleyin
npm install --save-dev electron-packager

# package.json dosyasına script ekleyin
# "scripts": {
#   "package": "electron-packager . MicroManager --platform=win32 --arch=x64 --out=dist --overwrite"
# }

# Paketi oluşturun
npm run package
```

Bu, `dist/MicroManager-win32-x64` klasöründe çalıştırılabilir bir uygulama oluşturacaktır. Bu klasörü zip olarak sıkıştırıp paylaşabilirsiniz. 