import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Pressable,
  TextInput,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Send,
} from 'lucide-react-native';
import { Colors } from '../src/constants/colors';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Uygulamayı nasıl kullanabilirim?',
    answer: 'Uygulamayı kullanmak için önce kayıt olmanız gerekmektedir. Kayıt olduktan sonra ana sayfadan tüm özelliklere erişebilirsiniz.',
  },
  {
    id: '2',
    question: 'Golbucks nedir ve nasıl kazanırım?',
    answer: 'Golbucks, uygulama içi puan sistemidir. Anketlere katılarak, etkinliklere kayıt olarak ve başvurular yaparak Golbucks kazanabilirsiniz.',
  },
  {
    id: '3',
    question: 'Başvurumu nasıl takip edebilirim?',
    answer: 'Menü bölümünden "Başvurularım" sayfasına giderek tüm başvurularınızı ve durumlarını görebilirsiniz.',
  },
  {
    id: '4',
    question: 'Askıda fatura nedir?',
    answer: 'Askıda fatura, ihtiyacı olan vatandaşlarımız için fatura ödeme kampanyasıdır. Faturanızı askıya bırakabilir veya başkalarına destek olabilirsiniz.',
  },
  {
    id: '5',
    question: 'Etkinliklere nasıl kayıt olabilirim?',
    answer: 'Ana sayfadan veya Etkinlikler sekmesinden istediğiniz etkinliği seçip "Kayıt Ol" butonuna tıklayarak kayıt olabilirsiniz.',
  },
];

const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.faqItem}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        style={styles.faqQuestion}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        {isOpen ? (
          <ChevronUp size={20} color={Colors.primary} />
        ) : (
          <ChevronDown size={20} color={Colors.textSecondary} />
        )}
      </Pressable>
      {isOpen && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function HelpScreen() {
  const router = useRouter();
  const [supportMessage, setSupportMessage] = useState('');

  const handleSendSupport = () => {
    if (supportMessage.trim()) {
      if (__DEV__) {
        console.log('Support message:', supportMessage);
      }
      Alert.alert('Başarılı', 'Mesajınız gönderildi. En kısa sürede size dönüş yapacağız.');
      setSupportMessage('');
    }
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+903421234567');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:destek@sehitkamil.bel.tr');
  };

  const handleAddressPress = () => {
    Linking.openURL('https://maps.google.com/?q=Şehitkamil+Belediyesi');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Yardım</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sık Sorulan Sorular</Text>
          {faqData.map((item) => (
            <FAQAccordion key={item.id} item={item} />
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>
          
          <Pressable
            onPress={handlePhonePress}
            style={styles.contactItem}
          >
            <View style={styles.contactIcon}>
              <Phone size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Telefon</Text>
              <Text style={styles.contactValue}>0342 123 45 67</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleEmailPress}
            style={styles.contactItem}
          >
            <View style={styles.contactIcon}>
              <Mail size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>E-posta</Text>
              <Text style={styles.contactValue}>destek@sehitkamil.bel.tr</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleAddressPress}
            style={styles.contactItem}
          >
            <View style={styles.contactIcon}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Adres</Text>
              <Text style={styles.contactValue}>
                Şehitkamil Belediyesi{'\n'}Merkez Mahallesi, Gaziantep
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Support Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek Formu</Text>
          <TextInput
            style={styles.supportInput}
            placeholder="Sorunuzu veya önerinizi yazın..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            value={supportMessage}
            onChangeText={setSupportMessage}
            textAlignVertical="top"
          />
          <Pressable
            onPress={handleSendSupport}
            style={[
              styles.sendButton,
              !supportMessage.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!supportMessage.trim()}
          >
            <Send size={20} color={Colors.surface} />
            <Text style={styles.sendButtonText}>Gönder</Text>
          </Pressable>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 60,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  supportInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
});

