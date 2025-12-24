/**
 * Login İşlemlerini Test Etme Scripti
 * 
 * Bu script login endpoint'ini test eder:
 * 1. Geçerli kullanıcı ile login
 * 2. Yanlış şifre ile login
 * 3. Olmayan kullanıcı ile login
 * 4. Token doğrulama
 */

// Use axios from backend node_modules
const path = require('path');
const axios = require(path.join(__dirname, 'backend', 'node_modules', 'axios'));
const BASE_URL = 'http://localhost:4000/api';

// Test kullanıcısı bilgileri
const TEST_USER = {
  email: 'test@example.com',
  password: 'test123456',
  name: 'Test User',
};

let createdUserId = null;

async function testLogin() {
  console.log('🧪 LOGIN İŞLEMLERİ TEST EDİLİYOR...\n');
  console.log('════════════════════════════════════════\n');

  try {
    // 1. Test kullanıcısı oluştur (eğer yoksa)
    console.log('1️⃣  Test kullanıcısı oluşturuluyor...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
        name: TEST_USER.name,
        email: TEST_USER.email,
        password: TEST_USER.password,
      });
      
      if (registerResponse.data.success) {
        createdUserId = registerResponse.data.data.user.id;
        console.log('   ✅ Kullanıcı oluşturuldu:', registerResponse.data.data.user.email);
      }
    } catch (registerError) {
      if (registerError.response?.status === 400 && 
          registerError.response?.data?.message?.includes('already exists')) {
        console.log('   ℹ️  Kullanıcı zaten mevcut, devam ediliyor...');
      } else {
        console.error('   ❌ Kullanıcı oluşturma hatası:', registerError.response?.data?.message || registerError.message);
      }
    }

    console.log('\n');

    // 2. Geçerli kullanıcı ile login
    console.log('2️⃣  Geçerli kullanıcı ile login testi...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });

      if (loginResponse.data.success && loginResponse.data.data.tokens) {
        console.log('   ✅ Login başarılı!');
        console.log('   📧 Kullanıcı:', loginResponse.data.data.user.email);
        console.log('   👤 İsim:', loginResponse.data.data.user.name);
        console.log('   💰 Gölbucks:', loginResponse.data.data.user.golbucks);
        console.log('   🔑 Access Token:', loginResponse.data.data.tokens.accessToken.substring(0, 50) + '...');
        console.log('   🔄 Refresh Token:', loginResponse.data.data.tokens.refreshToken.substring(0, 50) + '...');
        
        const accessToken = loginResponse.data.data.tokens.accessToken;
        const refreshToken = loginResponse.data.data.tokens.refreshToken;

        // 3. Token ile /auth/me endpoint'ini test et
        console.log('\n3️⃣  Token doğrulama testi (/auth/me)...');
        try {
          const meResponse = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (meResponse.data.success && meResponse.data.data.user) {
            console.log('   ✅ Token geçerli!');
            console.log('   👤 Kullanıcı bilgileri alındı:', meResponse.data.data.user.email);
          }
        } catch (meError) {
          console.error('   ❌ Token doğrulama hatası:', meError.response?.data?.message || meError.message);
        }

        // 4. Refresh token testi
        console.log('\n4️⃣  Refresh token testi...');
        try {
          const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken: refreshToken,
          });

          if (refreshResponse.data.success && refreshResponse.data.data.accessToken) {
            console.log('   ✅ Refresh token başarılı!');
            console.log('   🔑 Yeni Access Token:', refreshResponse.data.data.accessToken.substring(0, 50) + '...');
          }
        } catch (refreshError) {
          console.error('   ❌ Refresh token hatası:', refreshError.response?.data?.message || refreshError.message);
        }

      } else {
        console.error('   ❌ Login başarısız: Beklenmeyen response formatı');
      }
    } catch (loginError) {
      console.error('   ❌ Login hatası:', loginError.response?.data?.message || loginError.message);
      if (loginError.response?.status === 401) {
        console.error('   ⚠️  Unauthorized - Şifre veya email yanlış olabilir');
      }
    }

    console.log('\n');

    // 5. Yanlış şifre ile login
    console.log('5️⃣  Yanlış şifre ile login testi...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: TEST_USER.email,
        password: 'yanlis_sifre',
      });
      console.error('   ❌ HATA: Yanlış şifre ile login başarılı olmamalıydı!');
    } catch (wrongPasswordError) {
      if (wrongPasswordError.response?.status === 401) {
        console.log('   ✅ Doğru: Yanlış şifre ile login reddedildi');
        console.log('   📝 Hata mesajı:', wrongPasswordError.response?.data?.message);
      } else {
        console.error('   ❌ Beklenmeyen hata:', wrongPasswordError.response?.data?.message || wrongPasswordError.message);
      }
    }

    console.log('\n');

    // 6. Olmayan kullanıcı ile login
    console.log('6️⃣  Olmayan kullanıcı ile login testi...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'nonexistent@example.com',
        password: 'test123456',
      });
      console.error('   ❌ HATA: Olmayan kullanıcı ile login başarılı olmamalıydı!');
    } catch (notFoundError) {
      if (notFoundError.response?.status === 401) {
        console.log('   ✅ Doğru: Olmayan kullanıcı ile login reddedildi');
        console.log('   📝 Hata mesajı:', notFoundError.response?.data?.message);
      } else {
        console.error('   ❌ Beklenmeyen hata:', notFoundError.response?.data?.message || notFoundError.message);
      }
    }

    console.log('\n');

    // 7. Validation testleri
    console.log('7️⃣  Validation testleri...');
    
    // Email validation
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'gecersiz-email',
        password: 'test123456',
      });
      console.error('   ❌ HATA: Geçersiz email ile login başarılı olmamalıydı!');
    } catch (emailValidationError) {
      if (emailValidationError.response?.status === 400) {
        console.log('   ✅ Doğru: Geçersiz email reddedildi');
      } else {
        console.error('   ⚠️  Beklenmeyen durum:', emailValidationError.response?.status);
      }
    }

    // Boş password
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: TEST_USER.email,
        password: '',
      });
      console.error('   ❌ HATA: Boş şifre ile login başarılı olmamalıydı!');
    } catch (emptyPasswordError) {
      if (emptyPasswordError.response?.status === 400) {
        console.log('   ✅ Doğru: Boş şifre reddedildi');
      } else {
        console.error('   ⚠️  Beklenmeyen durum:', emptyPasswordError.response?.status);
      }
    }

    console.log('\n');
    console.log('════════════════════════════════════════');
    console.log('✅ TÜM TESTLER TAMAMLANDI!');
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Genel hata:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Script'i çalıştır
testLogin().catch((error) => {
  console.error('❌ Test script hatası:', error.message);
  process.exit(1);
});

