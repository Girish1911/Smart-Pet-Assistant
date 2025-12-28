import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, TextInput, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// --- COLORS ---
const THEME = {
  navy: '#071d57',
  orange: '#FF8C00',
  glass: 'rgba(255, 255, 255, 0.1)',
  white: '#FFFFFF',
  grey: '#B3B3B3',
};

// --- SCREEN 1: DOG INFO ---
function DogInfoScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Buddy's Profile</Text>
        <Image source={{ uri: 'https://placedog.net/100/100' }} style={styles.avatar} />
      </View>

      <View style={styles.card}>
        <Image source={{ uri: 'https://placedog.net/500/300' }} style={styles.heroImage} />
        <View style={styles.cardContent}>
          <Text style={styles.dogName}>Buddy</Text>
          <Text style={styles.dogBreed}>Golden Retriever • 3 yrs</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.miniCard}><Text style={styles.label}>Happiness</Text><Text style={styles.value}>85%</Text></View>
        <View style={styles.miniCard}><Text style={styles.label}>Health</Text><Text style={styles.value}>Stable</Text></View>
      </View>
    </ScrollView>
  );
}

// --- SCREEN 2: SCANNING (AI ENGINE) ---
function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

  if (!permission) return <View />;
  if (!permission.granted) {
    return <View style={styles.centered}><TouchableOpacity onPress={requestPermission}><Text>Grant Camera Permission</Text></TouchableOpacity></View>;
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView style={StyleSheet.absoluteFill} facing="back">
        {/* Scanning Reticle */}
        <View style={styles.reticleContainer}>
          <View style={styles.reticle} />
        </View>

        {/* Glassmorphic AI Overlay */}
        <BlurView intensity={30} tint="dark" style={styles.glassCard}>
          <Text style={styles.glassTitle}>AI ANALYSIS</Text>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Posture: Wagging Tail</Text>
            <Text style={styles.statVal}>80%</Text>
          </View>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>Voice: Barking</Text>
            <Text style={styles.statVal}>70%</Text>
          </View>
          <View style={styles.resultBadge}><Text style={styles.badgeText}>EMOTION: EXCITED</Text></View>
        </BlurView>
      </CameraView>
    </View>
  );
}

// --- SCREEN 3: VETBOT (RAG CHAT) ---
function VetBotScreen() {
  const [messages, setMessages] = useState([{ id: 1, text: "Hi! I'm Buddy's Assistant. How can I help today?", fromBot: true }]);
  const [input, setInput] = useState('');

  const sendMsg = () => {
    if (!input) return;
    setMessages([...messages, { id: Date.now(), text: input, fromBot: false }]);
    setInput('');
    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, text: "I've checked my database. This behavior is normal for Goldens.", fromBot: true }]);
    }, 1000);
  };

  return (
    <View style={styles.chatContainer}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {messages.map(m => (
          <View key={m.id} style={[styles.bubble, m.fromBot ? styles.botBubble : styles.userBubble]}>
            <Text style={{ color: m.fromBot ? '#000' : '#fff' }}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Ask VetBot..." />
        <TouchableOpacity onPress={sendMsg} style={styles.sendBtn}><Ionicons name="send" size={24} color="white" /></TouchableOpacity>
      </View>
    </View>
  );
}

// --- NAVIGATION ---
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'paw' : route.name === 'Scan' ? 'scan' : 'chatbubble-ellipses';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.orange,
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: THEME.navy },
        headerTintColor: '#fff',
      })}>
        <Tab.Screen name="Home" component={DogInfoScreen} />
        <Tab.Screen name="Scan" component={ScanScreen} options={{ headerShown: false }} />
        <Tab.Screen name="VetBot" component={VetBotScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.navy },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, alignItems: 'center' },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: THEME.orange },
  card: { margin: 20, borderRadius: 24, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' },
  heroImage: { width: '100%', height: 200 },
  cardContent: { padding: 15 },
  dogName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  dogBreed: { color: THEME.grey },
  statsRow: { flexDirection: 'row', paddingHorizontal: 15, justifyContent: 'space-between' },
  miniCard: { width: '45%', backgroundColor: THEME.glass, padding: 15, borderRadius: 16 },
  label: { color: THEME.grey, fontSize: 12 },
  value: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  reticleContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: 250, height: 250, borderWidth: 2, borderColor: 'white', borderRadius: 20, backgroundColor: 'transparent' },
  glassCard: { position: 'absolute', bottom: 40, left: 20, right: 20, padding: 20, borderRadius: 24, overflow: 'hidden' },
  glassTitle: { color: THEME.orange, fontWeight: 'bold', marginBottom: 10 },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  statLabel: { color: 'white' },
  statVal: { color: THEME.orange, fontWeight: 'bold' },
  resultBadge: { backgroundColor: THEME.orange, padding: 10, borderRadius: 12, marginTop: 10, alignItems: 'center' },
  badgeText: { color: 'white', fontWeight: 'bold' },
  chatContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  bubble: { padding: 12, borderRadius: 16, marginVertical: 5, maxWidth: '80%' },
  botBubble: { backgroundColor: '#e0e0e0', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: THEME.navy, alignSelf: 'flex-end' },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center' },
  input: { flex: 1, height: 45, backgroundColor: '#eee', borderRadius: 25, paddingHorizontal: 20 },
  sendBtn: { marginLeft: 10, backgroundColor: THEME.orange, padding: 10, borderRadius: 25 },
});