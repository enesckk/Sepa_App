module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // NativeWind kullanılmıyor - tüm component'ler StyleSheet kullanıyor
      // "nativewind/babel", // Devre dışı bırakıldı
      // Reanimated 4.x için react-native-reanimated/plugin kullanılmalı
      "react-native-reanimated/plugin", // Bu her zaman EN SONDA olmalı
    ],
  };
};

