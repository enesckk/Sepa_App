-- Şehitkamil Belediyesi Süper Uygulama - Veritabanı İlk Kurulum
-- Bu dosya PostgreSQL container'ı ilk başlatıldığında otomatik olarak çalıştırılır

-- Extension'ları etkinleştir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Tablosu
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    mahalle VARCHAR(100),
    golbucks INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    fcm_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Events Tablosu
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category VARCHAR(50),
    is_free BOOLEAN DEFAULT false,
    price DECIMAL(10, 2),
    capacity INTEGER,
    registered INTEGER DEFAULT 0,
    golbucks_reward INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

-- Rewards Tablosu
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    stock INTEGER,
    validity_days INTEGER,
    partner_name VARCHAR(255),
    qr_code VARCHAR(255),
    reference_code VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rewards tablosu için index'ler
CREATE INDEX IF NOT EXISTS idx_rewards_category ON rewards(category);
CREATE INDEX IF NOT EXISTS idx_rewards_points ON rewards(points);
CREATE INDEX IF NOT EXISTS idx_rewards_active ON rewards(is_active);

-- Updated_at için trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated_at trigger'ları
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek veriler (opsiyonel - development için)
-- Production'da bu kısmı kaldırın veya yorum satırı yapın

-- Örnek kullanıcı (şifre: password123 - bcrypt hash)
INSERT INTO users (name, email, password, phone, mahalle, golbucks) VALUES
('Test Kullanıcı', 'test@sehitkamil.gov.tr', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', '05551234567', 'Merkez Mahalle', 450)
ON CONFLICT (email) DO NOTHING;

-- Örnek etkinlikler
INSERT INTO events (title, description, date, time, location, category, is_free, capacity, golbucks_reward) VALUES
('Yaz Konseri', 'Gaziantep Senfoni Orkestrası eşliğinde unutulmaz bir akşam', '2024-03-15', '20:00:00', 'Şehitkamil Kültür Merkezi', 'konser', false, 500, 50),
('Çocuk Tiyatrosu', 'Çocuklar için özel tiyatro gösterisi', '2024-03-12', '14:00:00', 'Şehitkamil Çocuk Merkezi', 'tiyatro', true, 200, 30)
ON CONFLICT DO NOTHING;

-- Örnek ödüller
INSERT INTO rewards (title, description, category, points, stock, validity_days) VALUES
('1 Kahve', 'Anlaşmalı kafelerde geçerli 1 adet kahve kuponu', 'partner', 100, 50, 30),
('%50 Tiyatro Bileti', 'Şehitkamil Kültür Merkezi tiyatro gösterilerinde geçerli', 'digital', 200, 20, 60),
('Belediye Logolu T-Shirt', 'Şehitkamil Belediyesi özel tasarım t-shirt', 'physical', 300, 15, 90)
ON CONFLICT DO NOTHING;

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE 'Veritabanı başarıyla oluşturuldu!';
    RAISE NOTICE 'Tablo sayısı: 3 (users, events, rewards)';
END $$;

