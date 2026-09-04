Pastikan sudah menginstall software berikut di laptop Anda:

- [Git](https://git-scm.com/downloads) → untuk clone repository  
- [Node.js (LTS)](https://nodejs.org/) → otomatis terinstall `npm`  
- [Composer](https://getcomposer.org/download/) → dependency Laravel  
- [PHP](https://windows.php.net/download/) minimal versi **8.1**  
- [XAMPP / Laragon](https://www.apachefriends.org/) → untuk MySQL database  
- [Visual Studio Code](https://code.visualstudio.com/) → code editor 

## Cara Menjalankan Project

### 1️. Clone Repository
git clone https://github.com/shaapaa/KP_Project.git  
lalu ```cd KP_Project```  

### 2️. Setup Backend (Laravel)
Masuk ke folder backend:  
```cd backend```  

#### Install dependency:
```composer install```  

#### Generate key:  
```php artisan key:generate```

#### Konfigurasi database di file .env:

DB_CONNECTION=mysql  
DB_HOST=127.0.0.1  
DB_PORT=3306  
DB_DATABASE=nama_database  
DB_USERNAME=root  
DB_PASSWORD=    

#### Migrasi database:

```php artisan migrate --seed```

#### Jalankan server backend:

```php artisan serve```
Backend akan berjalan di http://127.0.0.1:8000.  

### 3️. Setup Frontend (React + TypeScript + Vite)
Masuk ke folder frontend:  
```cd ../frontend```

#### Install dependency:
```npm install```
#### Jalankan frontend:
```npm run dev```  
Frontend akan berjalan di http://localhost:5173.


