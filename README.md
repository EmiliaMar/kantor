# System Mobilny Kantoru Wymiany Walut

Projekt aplikacji mobilnej umożliwiającej wymianę walut z integracją API NBP (Narodowy Bank Polski)

---

## 📋 Spis Treści

- [Opis Projektu](#opis-projektu)
- [Wymagania Funkcjonalne](#wymagania-funkcjonalne)
- [Architektura Systemu](#architektura-systemu)
- [Technologie](#technologie)
- [Struktura Projektu](#struktura-projektu)
- [Instalacja i Uruchomienie](#instalacja-i-uruchomienie)
- [Funkcjonalności](#funkcjonalności)
- [Baza Danych](#baza-danych)
- [API Endpoints](#api-endpoints)
- [Aplikacja Mobilna](#aplikacja-mobilna)
- [Zrzuty Ekranu](#zrzuty-ekranu)

---

## 🎯 Opis Projektu

System mobilny kantoru wymiany walut to aplikacja umożliwiająca użytkownikom:
- Rejestrację i logowanie z autoryzacją JWT
- Przeglądanie aktualnych i historycznych kursów walut z NBP
- Wymianę walut (kupno/sprzedaż) w oparciu o rzeczywiste kursy
- Zasilanie wirtualnego portfela w PLN
- Zarządzanie wielowalutowym portfelem (PLN, EUR, USD, GBP, CHF)
- Przeglądanie historii transakcji
- Wizualizację danych za pomocą wykresów

---

## ✅ Wymagania Funkcjonalne

### Część A: Aplikacja Mobilna
- ✅ Rejestracja i logowanie użytkownika
- ✅ Zasilenie konta (symulowany przelew wirtualny)
- ✅ Podgląd aktualnych kursów walut (pobieranych z API NBP)
- ✅ Dostęp do archiwalnych kursów walut
- ✅ Realizacja transakcji kupna/sprzedaży waluty
- ✅ Podgląd historii transakcji oraz stanu posiadanych środków
- ✅ Wizualizacja danych za pomocą wykresów

### Część B: Web Service (REST API)
- ✅ Realizacja logiki biznesowej kantoru
- ✅ Integracja z API NBP w celu pozyskiwania kursów
- ✅ Obsługa komunikacji z aplikacją mobilną
- ✅ Walidacja danych i autoryzacja użytkowników
- ✅ Obliczanie marży (2% spread od kursu średniego NBP)
- ✅ System prowizji (0.5% od wartości transakcji)

### Część C: Baza Danych
- ✅ Przechowywanie informacji o użytkownikach
- ✅ Rejestrowanie transakcji
- ✅ Zapisywanie stanu portfela walutowego użytkownika
- ✅ Cache kursów walut z NBP
- ✅ Historia kursów walutowych

---

## 🏗 Architektura Systemu

```
┌─────────────────────────────────────────┐
│      APLIKACJA MOBILNA (Frontend)       │
│   React Native + Expo (TypeScript)      │
│   - Interfejs użytkownika                │
│   - State management (Context API)       │
│   - Nawigacja (Expo Router)              │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               │ (JWT Authorization)
┌──────────────┴──────────────────────────┐
│      WEB SERVICE (Backend)               │
│   Node.js + Express (ES Modules)         │
│   - REST API endpoints                   │
│   - Logika biznesowa                     │
│   - Autoryzacja JWT                      │
│   - Walidacja danych                     │
└──────┬───────────────┬───────────────────┘
       │               │
       │               │ HTTPS
       │               ▼
       │        ┌─────────────────┐
       │        │   NBP API       │
       │        │  (api.nbp.pl)   │
       │        └─────────────────┘
       │ MySQL
       ▼
┌──────────────────────────────────────────┐
│         BAZA DANYCH (MySQL)              │
│   - Użytkownicy (users)                  │
│   - Portfele (wallets)                   │
│   - Transakcje (transactions)            │
│   - Kursy walut (exchange_rates)         │
└──────────────────────────────────────────┘
```

---

## 💻 Technologie

### Frontend (Aplikacja Mobilna)
- **React Native** 0.81.5 - framework do tworzenia aplikacji mobilnych
- **Expo** ~54.0.25 - platforma rozwojowa
- **TypeScript** ~5.9.2 - statyczne typowanie
- **Expo Router** ~6.0.15 - nawigacja oparta na systemie plików
- **React Navigation** - nawigacja drawer i bottom tabs
- **Axios** ^1.13.2 - komunikacja HTTP
- **AsyncStorage** - lokalne przechowywanie tokenów JWT
- **Expo LinearGradient** - efekty wizualne
- **React Native Chart Kit** ^6.12.0 - wykresy i wizualizacje
- **React Native SVG** - grafika wektorowa dla wykresów
- **i18next** - internacjonalizacja (przygotowanie)

### Backend (Web Service)
- **Node.js** - środowisko uruchomieniowe JavaScript
- **Express** ^5.1.0 - framework web
- **MySQL2** ^3.15.3 - sterownik bazy danych
- **bcrypt** ^6.0.0 - hashowanie haseł
- **jsonwebtoken** ^9.0.2 - autoryzacja JWT
- **uuid** ^13.0.0 - generowanie identyfikatorów
- **cors** ^2.8.5 - obsługa CORS
- **dotenv** ^17.2.3 - zarządzanie zmiennymi środowiskowymi

### Baza Danych
- **MySQL** 8.0+ - relacyjna baza danych

### API Zewnętrzne
- **NBP API** (api.nbp.pl) - kursy walut Narodowego Banku Polskiego

---

## 📁 Struktura Projektu

```
kantor-kopia/
├── frontend/                    # Aplikacja mobilna
│   ├── app/                     # Ekrany aplikacji (Expo Router)
│   │   ├── (auth)/             # Grupa autentykacji
│   │   │   ├── login.tsx       # Ekran logowania
│   │   │   ├── register.tsx    # Ekran rejestracji
│   │   │   └── _layout.tsx     # Layout grupy auth
│   │   ├── (tabs)/             # Grupa z nawigacją dolną
│   │   │   ├── index.tsx       # Ekran główny (dashboard)
│   │   │   ├── exchange.tsx    # Wymiana walut
│   │   │   ├── wallet.tsx      # Portfel
│   │   │   ├── history.tsx     # Historia transakcji
│   │   │   ├── historical.tsx  # Historyczne kursy
│   │   │   ├── charts.tsx      # Wykresy
│   │   │   └── _layout.tsx     # Layout z bottom tabs
│   │   ├── public-rates.tsx    # Publiczne kursy (bez logowania)
│   │   ├── _layout.tsx         # Główny layout z drawer
│   │   └── index.tsx           # Punkt wejścia
│   ├── components/              # Komponenty wielokrotnego użytku
│   │   ├── GlassCard.tsx       # Karta ze szklanym efektem
│   │   ├── CurrencyCard.tsx    # Karta waluty
│   │   ├── WalletCard.tsx      # Karta portfela
│   │   ├── TransactionItem.tsx # Element historii transakcji
│   │   ├── DepositModal.tsx    # Modal zasilenia konta
│   │   ├── ProfileModal.tsx    # Modal profilu użytkownika
│   │   └── DrawerContent.tsx   # Zawartość menu drawer
│   ├── context/                 # Context API
│   │   └── AuthContext.tsx     # Kontekst autentykacji
│   ├── services/                # Usługi API
│   │   ├── api.ts              # Konfiguracja Axios
│   │   ├── authService.ts      # Usługi autentykacji
│   │   ├── ratesService.ts     # Usługi kursów walut
│   │   ├── walletService.ts    # Usługi portfela
│   │   └── transactionService.ts # Usługi transakcji
│   ├── constants/               # Stałe
│   │   ├── theme.ts            # Motyw aplikacji
│   │   └── flags.ts            # Flagi walut
│   ├── styles/                  # Style globalne
│   │   └── global.js
│   ├── assets/                  # Zasoby statyczne
│   │   ├── images/             # Obrazy
│   │   └── flags/              # Flagi państw
│   ├── utils/                   # Narzędzia pomocnicze
│   ├── app.json                 # Konfiguracja Expo
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                     # Zmienne środowiskowe
│
└── backend/                     # Web Service
    ├── src/
    │   ├── config/
    │   │   └── db.js            # Konfiguracja połączenia z MySQL
    │   ├── middleware/
    │   │   ├── auth.middleware.js    # Middleware JWT
    │   │   └── validation.js         # Walidacja danych
    │   ├── models/
    │   │   ├── User.js          # Model użytkownika
    │   │   ├── Wallet.js        # Model portfela
    │   │   └── Transaction.js   # Model transakcji
    │   ├── routes/
    │   │   ├── auth.routes.js   # Endpointy autentykacji
    │   │   ├── rates.routes.js  # Endpointy kursów
    │   │   ├── wallet.routes.js # Endpointy portfela
    │   │   └── transaction.routes.js # Endpointy transakcji
    │   ├── services/
    │   │   └── nbpService.js    # Integracja z API NBP
    │   └── index.js             # Punkt wejścia serwera
    ├── package.json
    └── .env                     # Zmienne środowiskowe
```

---

## 🚀 Instalacja i Uruchomienie

### Wymagania Wstępne
- Node.js 18+ i npm
- MySQL 8.0+
- Expo CLI (dla aplikacji mobilnej)
- Emulator Android/iOS lub fizyczne urządzenie z aplikacją Expo Go

### 1. Konfiguracja Bazy Danych

Utwórz bazę danych MySQL:

```sql
CREATE DATABASE kantor;
USE kantor;
```

Utwórz tabele:

```sql
-- Tabela użytkowników
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela portfeli
CREATE TABLE wallets (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    balance DECIMAL(15, 6) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_currency (user_id, currency_code)
);

-- Tabela kursów walut
CREATE TABLE exchange_rates (
    id VARCHAR(36) PRIMARY KEY,
    currency_code VARCHAR(3) NOT NULL,
    mid_rate DECIMAL(10, 6) NOT NULL,
    buy_rate DECIMAL(10, 6) NOT NULL,
    sell_rate DECIMAL(10, 6) NOT NULL,
    rate_date DATE NOT NULL,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_currency_date (currency_code, rate_date)
);

-- Tabela transakcji
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    transaction_type ENUM('BUY', 'SELL', 'DEPOSIT') NOT NULL,
    from_currency VARCHAR(3),
    to_currency VARCHAR(3),
    amount DECIMAL(15, 6) NOT NULL,
    exchange_rate DECIMAL(10, 6),
    fee DECIMAL(15, 6) DEFAULT 0,
    total_amount DECIMAL(15, 6) NOT NULL,
    rate_id VARCHAR(36),
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rate_id) REFERENCES exchange_rates(id)
);

-- Indeksy dla optymalizacji
CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_rates_date ON exchange_rates(rate_date);
```

### 2. Konfiguracja Backend

```bash
cd backend

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Edytuj plik .env i uzupełnij dane:
# - PORT=3001
# - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
# - JWT_SECRET (wygeneruj bezpieczny klucz)

# Uruchomienie serwera
npm run dev
```

Serwer uruchomi się na `http://localhost:3001`

### 3. Konfiguracja Frontend

```bash
cd frontend

# Instalacja zależności
npm install

# Konfiguracja zmiennych środowiskowych
cp .env.example .env
# Edytuj plik .env:
# EXPO_PUBLIC_API_URL=http://localhost:3001/api

# Uruchomienie aplikacji
npx expo start
```

W terminalu Expo wybierz:
- `a` - uruchomienie na emulatorze Android
- `i` - uruchomienie na symulatorze iOS
- Zeskanuj kod QR w aplikacji Expo Go (urządzenie musi być w tej samej sieci)

---

## 🎨 Funkcjonalności

### 1. Autentykacja i Autoryzacja
- **Rejestracja**: Tworzenie konta z walidacją email i hasła
- **Logowanie**: Autoryzacja JWT z tokenem ważnym 24h
- **Bezpieczeństwo**: Hasła hashowane za pomocą bcrypt
- **Automatyczne portfele**: Utworzenie portfela PLN przy rejestracji

### 2. Dashboard (Ekran Główny)
- Wyświetlanie aktualnych kursów walut (EUR, USD, GBP, CHF)
- Szybki dostęp do funkcji wymiany
- Przegląd stanu portfela
- Nawigacja do wszystkich funkcji aplikacji

### 3. Wymiana Walut
- **Kupno waluty obcej**: Wymiana PLN na EUR/USD/GBP/CHF
- **Sprzedaż waluty obcej**: Wymiana EUR/USD/GBP/CHF na PLN
- Kalkulacja w czasie rzeczywistym:
  - Kurs wymiany z marżą 2%
  - Prowizja 0.5% od wartości transakcji
  - Całkowity koszt/zysk
- Walidacja salda przed transakcją
- Potwierdzenie transakcji z szczegółami

### 4. Portfel Wielowalutowy
- Zarządzanie portfelami w 5 walutach (PLN, EUR, USD, GBP, CHF)
- Wyświetlanie salda dla każdej waluty
- Przeliczenie całkowitej wartości na PLN
- Funkcja zasilenia konta (symulowany przelew)
- Obsługa depozytów od 10 do 100,000 PLN

### 5. Historia Transakcji
- Pełna lista wszystkich transakcji użytkownika
- Filtrowanie po typie (kupno/sprzedaż/zasilenie)
- Szczegółowe informacje:
  - Data i godzina
  - Typ transakcji
  - Waluty źródłowa i docelowa
  - Kwota i kurs wymiany
  - Prowizja
  - Status transakcji
- Sortowanie chronologiczne (najnowsze pierwsze)

### 6. Kursy Historyczne
- Wyszukiwanie kursów z wybranej daty
- Kalendarz z wyborem daty
- Porównanie z kursami bieżącymi
- Obsługa dni wolnych (NBP nie publikuje kursów)

### 7. Wykresy i Statystyki
- Wizualizacja trendów kursów walut
- Analiza wydatków według walut
- Wykresy liniowe i słupkowe
- Podsumowanie portfela

### 8. Profil Użytkownika
- Wyświetlanie danych użytkownika
- Statystyki konta
- Wylogowanie

---

## 🗄 Baza Danych

### Schemat ERD

```
┌─────────────────┐         ┌─────────────────┐
│     users       │         │   wallets       │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │────┐    │ id (PK)         │
│ email           │    │    │ user_id (FK)    │
│ hashed_password │    └───▶│ currency_code   │
│ first_name      │         │ balance         │
│ last_name       │         │ created_at      │
│ role            │         │ updated_at      │
│ is_active       │         └─────────────────┘
│ created_at      │                │
│ updated_at      │                │
└─────────────────┘                │
        │                          │
        │                          │
        │         ┌────────────────┘
        │         │
        ▼         ▼
┌─────────────────────────┐       ┌─────────────────┐
│    transactions         │       │ exchange_rates  │
├─────────────────────────┤       ├─────────────────┤
│ id (PK)                 │       │ id (PK)         │
│ user_id (FK)            │       │ currency_code   │
│ transaction_type        │◀──────│ mid_rate        │
│ from_currency           │rate_id│ buy_rate        │
│ to_currency             │  (FK) │ sell_rate       │
│ amount                  │       │ rate_date       │
│ exchange_rate           │       │ fetched_at      │
│ fee                     │       └─────────────────┘
│ total_amount            │
│ rate_id (FK)            │
│ status                  │
│ created_at              │
└─────────────────────────┘
```

### Opis Tabel

#### users
Przechowuje informacje o użytkownikach systemu.
- `id`: Unikalny identyfikator UUID
- `email`: Adres email (unikalny)
- `hashed_password`: Zahashowane hasło (bcrypt)
- `first_name`, `last_name`: Dane osobowe
- `role`: Rola użytkownika (user/admin)
- `is_active`: Status konta

#### wallets
Przechowuje salda portfeli użytkowników dla różnych walut.
- `id`: Unikalny identyfikator UUID
- `user_id`: Odniesienie do użytkownika
- `currency_code`: Kod waluty (PLN, EUR, USD, GBP, CHF)
- `balance`: Saldo z dokładnością do 6 miejsc dziesiętnych
- Unique constraint: jeden portfel na użytkownika i walutę

#### exchange_rates
Cache kursów walut z NBP.
- `id`: Unikalny identyfikator UUID
- `currency_code`: Kod waluty
- `mid_rate`: Kurs średni NBP
- `buy_rate`: Kurs kupna (mid_rate * 1.02)
- `sell_rate`: Kurs sprzedaży (mid_rate * 0.98)
- `rate_date`: Data obowiązywania kursu
- `fetched_at`: Timestamp pobrania
- Unique constraint: jeden kurs na walutę i datę

#### transactions
Historia wszystkich transakcji użytkowników.
- `id`: Unikalny identyfikator UUID
- `user_id`: Odniesienie do użytkownika
- `transaction_type`: BUY/SELL/DEPOSIT
- `from_currency`, `to_currency`: Waluty transakcji
- `amount`: Kwota bazowa
- `exchange_rate`: Kurs wymiany (jeśli dotyczy)
- `fee`: Prowizja (0.5% dla wymiany)
- `total_amount`: Całkowita kwota
- `rate_id`: Odniesienie do użytego kursu
- `status`: PENDING/COMPLETED/FAILED

---

## 🔌 API Endpoints

### Autentykacja (`/api/auth`)

#### POST `/api/auth/register`
Rejestracja nowego użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jan",
  "lastName": "Kowalski"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Użytkownik zarejestrowany pomyślnie",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "Jan",
    "lastName": "Kowalski"
  }
}
```

#### POST `/api/auth/login`
Logowanie użytkownika.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Zalogowano pomyślnie",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "role": "user"
  }
}
```

### Kursy Walut (`/api/rates`)

#### GET `/api/rates/current`
Pobieranie aktualnych kursów dla wszystkich obsługiwanych walut.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "rates": [
    {
      "id": "uuid-here",
      "currencyCode": "EUR",
      "midRate": 4.3245,
      "buyRate": 4.4110,
      "sellRate": 4.2380,
      "rateDate": "2025-01-27",
      "fetchedAt": "2025-01-27T10:30:00Z"
    },
    {
      "id": "uuid-here",
      "currencyCode": "USD",
      "midRate": 3.9821,
      "buyRate": 4.0617,
      "sellRate": 3.9025,
      "rateDate": "2025-01-27",
      "fetchedAt": "2025-01-27T10:30:00Z"
    }
  ],
  "lastUpdate": "2025-01-27T10:30:00Z"
}
```

#### GET `/api/rates/historical/:currencyCode/:date`
Pobieranie kursu historycznego dla wybranej waluty i daty.

**Parametry:**
- `currencyCode`: EUR, USD, GBP, CHF
- `date`: Format YYYY-MM-DD

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "rate": {
    "currencyCode": "EUR",
    "midRate": 4.3156,
    "buyRate": 4.4019,
    "sellRate": 4.2293,
    "rateDate": "2025-01-20"
  }
}
```

### Portfel (`/api/wallet`)

#### GET `/api/wallet/balance`
Pobieranie sald wszystkich portfeli użytkownika.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "wallets": [
    {
      "currency": "PLN",
      "balance": 1523.45
    },
    {
      "currency": "EUR",
      "balance": 250.00
    },
    {
      "currency": "USD",
      "balance": 0.00
    }
  ],
  "totalInPLN": 2628.73
}
```

#### POST `/api/wallet/deposit`
Zasilenie portfela PLN.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "amount": 500.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Wpłata wykonana pomyślnie",
  "wallet": {
    "currency": "PLN",
    "balance": 2023.45
  },
  "transaction": {
    "id": "uuid-here",
    "type": "DEPOSIT",
    "amount": 500.00,
    "timestamp": "2025-01-27T11:00:00Z"
  }
}
```

### Transakcje (`/api/transactions`)

#### POST `/api/transactions/buy`
Kupno waluty obcej za PLN.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "currencyCode": "EUR",
  "amount": 100.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transakcja zakończona pomyślnie",
  "transaction": {
    "id": "uuid-here",
    "type": "BUY",
    "fromCurrency": "PLN",
    "toCurrency": "EUR",
    "amount": 100.00,
    "exchangeRate": 4.4110,
    "cost": 441.10,
    "fee": 2.21,
    "total": 443.31,
    "timestamp": "2025-01-27T11:15:00Z"
  },
  "wallets": {
    "PLN": 1580.14,
    "EUR": 350.00
  }
}
```

#### POST `/api/transactions/sell`
Sprzedaż waluty obcej na PLN.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "currencyCode": "EUR",
  "amount": 50.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Transakcja zakończona pomyślnie",
  "transaction": {
    "id": "uuid-here",
    "type": "SELL",
    "fromCurrency": "EUR",
    "toCurrency": "PLN",
    "amount": 50.00,
    "exchangeRate": 4.2380,
    "value": 211.90,
    "fee": 1.06,
    "total": 210.84,
    "timestamp": "2025-01-27T11:20:00Z"
  },
  "wallets": {
    "PLN": 1790.98,
    "EUR": 300.00
  }
}
```

#### GET `/api/transactions/history?limit=20&offset=0`
Pobieranie historii transakcji użytkownika.

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit`: Liczba transakcji (domyślnie 20)
- `offset`: Przesunięcie (paginacja)

**Response (200):**
```json
{
  "success": true,
  "transactions": [
    {
      "id": "uuid-here",
      "type": "BUY",
      "fromCurrency": "PLN",
      "toCurrency": "EUR",
      "amount": 100.00,
      "exchangeRate": 4.4110,
      "fee": 2.21,
      "total": 443.31,
      "status": "COMPLETED",
      "timestamp": "2025-01-27T11:15:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## 📱 Aplikacja Mobilna

### Nawigacja

Aplikacja wykorzystuje **Expo Router** z następującą strukturą:

1. **Stack Navigator** (główny):
   - Welcome screen (index)
   - Auth group (rejestracja/logowanie)
   - Drawer Navigator (dla zalogowanych)

2. **Drawer Navigator** (menu boczne):
   - Zawiera Bottom Tab Navigator
   - Opcje profilu i wylogowania

3. **Bottom Tab Navigator** (główna nawigacja):
   - Dashboard (Home)
   - Wymiana (Exchange)
   - Portfel (Wallet)
   - Historia (History)
   - Kursy historyczne (Historical)
   - Wykresy (Charts)

### Ekrany

#### 1. Ekran Powitalny (`app/index.tsx`)
- Logo aplikacji
- Przycisk "Zaloguj się"
- Przycisk "Zarejestruj się"
- Link do przeglądania kursów bez logowania

#### 2. Rejestracja (`app/(auth)/register.tsx`)
- Formularz z polami:
  - Imię
  - Nazwisko
  - Email
  - Hasło
  - Potwierdzenie hasła
- Walidacja po stronie klienta
- Automatyczne przekierowanie po rejestracji

#### 3. Logowanie (`app/(auth)/login.tsx`)
- Formularz z polami:
  - Email
  - Hasło
- Zapamiętanie tokenu JWT w AsyncStorage
- Przekierowanie do Dashboard

#### 4. Dashboard (`app/(tabs)/index.tsx`)
- Powitanie użytkownika
- Karty z aktualnymi kursami walut
- Szybkie akcje:
  - Wymiana walut
  - Zasilenie konta
- Podsumowanie portfela
- Ostatnie transakcje (3 najnowsze)

#### 5. Wymiana (`app/(tabs)/exchange.tsx`)
- Wybór typu transakcji (Kupno/Sprzedaż)
- Wybór waluty (EUR/USD/GBP/CHF)
- Pole kwoty z walidacją
- Kalkulator w czasie rzeczywistym:
  - Koszt/Zysk
  - Prowizja
  - Suma
- Wyświetlanie aktualnego salda
- Przycisk potwierdzenia transakcji

#### 6. Portfel (`app/(tabs)/wallet.tsx`)
- Karty dla każdej waluty z saldem
- Całkowita wartość w PLN
- Przycisk "Zasilenie konta"
- Modal zasilenia:
  - Kwota (10-100,000 PLN)
  - Potwierdzenie

#### 7. Historia (`app/(tabs)/history.tsx`)
- Lista wszystkich transakcji
- Szczegóły każdej transakcji:
  - Ikona typu transakcji
  - Waluty
  - Kwota i kurs
  - Prowizja
  - Data i godzina
- Możliwość filtrowania

#### 8. Kursy Historyczne (`app/(tabs)/historical.tsx`)
- Kalendarz z wyborem daty
- Formularz wyboru waluty
- Wyświetlanie kursu z wybranego dnia
- Porównanie z kursem bieżącym
- Informacja o dniach bez kursów

#### 9. Wykresy (`app/(tabs)/charts.tsx`)
- Wykres trendu wybranej waluty
- Wykres dystrybucji portfela
- Statystyki transakcji
- Analiza wydatków

### Komponenty

#### GlassCard
Karta ze szklanym efektem (glassmorphism):
- Półprzezroczyste tło
- Efekt rozmycia
- Ramka

#### CurrencyCard
Karta wyświetlająca informacje o kursie waluty:
- Flaga państwa
- Kod waluty
- Kurs kupna/sprzedaży
- Zmiana procentowa

#### WalletCard
Karta portfela dla pojedynczej waluty:
- Nazwa waluty
- Saldo
- Wartość w PLN

#### TransactionItem
Element listy transakcji:
- Ikona typu transakcji
- Szczegóły transakcji
- Kolorystyka według typu

### State Management

Aplikacja wykorzystuje **Context API** do zarządzania stanem:

#### AuthContext
- Przechowywanie informacji o użytkowniku
- Token JWT
- Funkcje logowania/wylogowania
- Auto-login przy uruchomieniu

### Stylizacja

- **Motyw**: Jasny z akcentami niebiskimi/turkusowymi
- **Efekty**: LinearGradient, glassmorphism
- **Ikony**: @expo/vector-icons (Ionicons)
- **Typografia**: Czytelna, hierarchiczna

---

## 📊 Logika Biznesowa

### Kursy Walut

#### Pobieranie z NBP
```
1. Sprawdź cache w bazie danych
2. Jeśli brak lub nieaktualne:
   - Pobierz z API NBP (api.nbp.pl)
   - Zapisz do cache
3. Zwróć kursy
```

#### Obliczanie Kursów
```
Kurs średni NBP (mid_rate) → 4.3245 PLN

Kurs kupna (buy_rate) = mid_rate × 1.02 = 4.4110 PLN
  (kantor sprzedaje walutę klientowi)

Kurs sprzedaży (sell_rate) = mid_rate × 0.98 = 4.2380 PLN
  (kantor kupuje walutę od klienta)

Spread: 2% od kursu średniego
```

### Transakcje

#### Kupno Waluty Obcej
```
Dane wejściowe:
- amount_foreign = 100 EUR
- buy_rate = 4.4110 PLN

Obliczenia:
cost_base = amount_foreign × buy_rate = 441.10 PLN
fee = cost_base × 0.005 = 2.21 PLN
total_cost = cost_base + fee = 443.31 PLN

Operacje:
1. Walidacja salda PLN ≥ total_cost
2. PLN -= total_cost
3. EUR += amount_foreign
4. Zapisz transakcję
```

#### Sprzedaż Waluty Obcej
```
Dane wejściowe:
- amount_foreign = 50 EUR
- sell_rate = 4.2380 PLN

Obliczenia:
value_base = amount_foreign × sell_rate = 211.90 PLN
fee = value_base × 0.005 = 1.06 PLN
total_received = value_base - fee = 210.84 PLN

Operacje:
1. Walidacja salda EUR ≥ amount_foreign
2. EUR -= amount_foreign
3. PLN += total_received
4. Zapisz transakcję
```

### Bezpieczeństwo

- **Hasła**: Hashowanie bcrypt (10 rund)
- **Autoryzacja**: JWT z expiration 24h
- **Walidacja**: 
  - Po stronie frontendu (React)
  - Po stronie backendu (middleware)
- **CORS**: Konfiguracja dozwolonych origins
- **SQL Injection**: Prepared statements (MySQL2)
