import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  MapPin, 
  FileText, 
  Receipt, 
  ClipboardList,
  Settings,
  HelpCircle,
  Info,
} from 'lucide-react-native';
import { Colors } from '../../src/constants/colors';

export default function MenuScreen() {
  const router = useRouter();

  const menuItems = [
    {
      id: '1',
      title: 'Şehir Rehberi',
      icon: <MapPin size={24} color={Colors.primary} />,
      onPress: () => router.push('/city-guide'),
    },
    {
      id: '2',
      title: 'Anketler',
      icon: <ClipboardList size={24} color={Colors.primary} />,
      onPress: () => router.push('/surveys'),
    },
    {
      id: '3',
      title: 'Askıda Fatura',
      icon: <Receipt size={24} color={Colors.primary} />,
      onPress: () => router.push('/bill-support'),
    },
    {
      id: '4',
      title: 'Başvurularım',
      icon: <FileText size={24} color={Colors.primary} />,
      onPress: () => {
        if (__DEV__) {
          console.log('My Applications');
        }
      },
    },
    {
      id: '5',
      title: 'Ayarlar',
      icon: <Settings size={24} color={Colors.primary} />,
      onPress: () => {
        if (__DEV__) {
          console.log('Settings');
        }
      },
    },
    {
      id: '6',
      title: 'Yardım',
      icon: <HelpCircle size={24} color={Colors.primary} />,
      onPress: () => {
        if (__DEV__) {
          console.log('Help');
        }
      },
    },
    {
      id: '7',
      title: 'Hakkında',
      icon: <Info size={24} color={Colors.primary} />,
      onPress: () => {
        if (__DEV__) {
          console.log('About');
        }
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menü</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.iconContainer}>
              {item.icon}
            </View>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItemPressed: {
    opacity: 0.7,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
});

