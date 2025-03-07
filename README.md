# MicroManager

A lightweight desktop application for managing .NET Core microservices on your local machine.
![image](https://github.com/user-attachments/assets/f6a4e883-ecb2-4f66-8f57-64bb69a1ed56) 


## Features

- Start and stop .NET Core microservices with a simple click
- View real-time console logs from your services
- Easily add new services by specifying their bin directory
- Run services in Development mode with ASPNETCORE_ENVIRONMENT set
- Display Git branch information for each service
- Persist service configurations between application restarts
- Monitor the status of all your microservices in one place
- Full-width interface with compact log display

## Requirements

- Node.js 14+ and npm
- Windows operating system (for running .NET Core services)
- .NET Core microservices with executable binaries
- Git (optional, for branch detection)

## Development Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application in development mode:
   ```
   npm run dev
   ```

## Building and Distribution Options

There are several ways to build and distribute the application:

### Development Mode
```
npm start             # Regular development mode
npm run dev           # Development mode with enhanced logging
```

### Building for Distribution
```
npm run build         # Build with electron-builder (creates installer)
npm run build:portable # Build portable version (single executable)
npm run build:zip     # Build and package as zip file
npm run package       # Use electron-packager to create portable directory
```

For detailed instructions on each build option, see [BUILD-OPTIONS.md](BUILD-OPTIONS.md).

## Usage

1. Add your .NET Core microservices by specifying the path to their bin directory
2. Choose whether to run the service in Development mode
3. Use the start/stop buttons to control each service
4. View the console output in the log panel
5. See Git branch information for each service
6. Services will be remembered between application restarts
7. Access the About information from the Help menu

## License

MIT

---

# MicroManager (Türkçe)

Yerel makinenizdeki .NET Core microservice'leri yönetmek için ufak bir masaüstü uygulaması.

## Özellikler

- .NET Core microservice'leri tek tıklamayla başlatma ve durdurma
- Servislerinizden gerçek zamanlı konsol loglarını görüntüleme
- Bin dizinini belirterek kolayca yeni servisler ekleme
- Servisleri ASPNETCORE_ENVIRONMENT değişkeni Development olarak ayarlanmış şekilde çalıştırma
- Her servis için Git branch bilgisini görüntüleme
- Servis yapılandırmalarını uygulama yeniden başlatmaları arasında saklama
- Tüm microservice'lerinizin durumunu tek bir yerden izleme
- Tam genişlikte arayüz ve kompakt log görüntüleme

## Gereksinimler

- Node.js 14+ ve npm
- Windows işletim sistemi (.NET Core servisleri çalıştırmak için)
- Çalıştırılabilir binary'lere sahip .NET Core microservice'leri
- Git (isteğe bağlı, branch tespiti için)

## Geliştirme Ortamı Kurulumu

1. Bu repository'yi klonlayın
2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```
3. Uygulamayı başlatın:
   ```
   npm run dev
   ```

## Derleme ve Dağıtım Seçenekleri

Uygulamayı derlemek ve dağıtmak için birkaç yöntem bulunmaktadır:

### Geliştirme Modu
```
npm start             # Normal geliştirme modu
npm run dev           # Gelişmiş loglama ile geliştirme modu
```

### Dağıtım için Derleme
```
npm run build         # electron-builder ile derleme (kurulum dosyası oluşturur)
npm run build:portable # Portable versiyon oluşturma (tek çalıştırılabilir dosya)
npm run build:zip     # Zip dosyası olarak paketleme
npm run package       # electron-packager ile portable dizin oluşturma
```

Her derleme seçeneği hakkında detaylı bilgi için [BUILD-OPTIONS.md](BUILD-OPTIONS.md) dosyasına bakınız.

## Kullanım

1. Bin dizininin yolunu belirterek .NET Core microservice'lerinizi ekleyin
2. Servisi Development modunda çalıştırmayı seçin
3. Servisleri kontrol etmek için başlat/durdur düğmelerini kullanın
4. Log panelinde konsol çıktısını görüntüleyin
5. Her servis için Git branch bilgisini görün
6. Servisler uygulama yeniden başlatmaları arasında hatırlanacaktır
7. Yardım menüsünden Hakkında bilgilerine erişin

## Lisans

MIT 
