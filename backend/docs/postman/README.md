# Postman Collection

## 📥 Import

1. Postman'i açın
2. Import butonuna tıklayın
3. `collection.json` dosyasını seçin
4. `environment.json` dosyasını environment olarak import edin

## 🔑 Environment Variables

Postman environment'ında şu değişkenleri ayarlayın:

- `base_url`: API base URL (örn: http://localhost:4000/api)
- `access_token`: JWT access token (login sonrası otomatik set edilir)
- `refresh_token`: JWT refresh token (login sonrası otomatik set edilir)

## 📝 Kullanım

1. Önce `POST /api/auth/register` veya `POST /api/auth/login` ile giriş yapın
2. Token otomatik olarak environment'a kaydedilecektir
3. Diğer endpoint'leri kullanabilirsiniz

## 🧪 Test Scripts

Collection'da bazı endpoint'ler için test script'leri bulunmaktadır:
- Login sonrası token kaydetme
- Token refresh
- Error handling

