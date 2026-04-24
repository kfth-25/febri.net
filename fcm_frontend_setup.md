# Panduan Setup FCM Frontend (Mobile & Web)

Dokumen ini berisi langkah-langkah detail untuk mengimplementasikan Push Notification menggunakan FCM di sisi **Mobile (Flutter)** dan **Web (React)**.

---

## TAHAP 1: Setup Mobile (Flutter)

### 1. Konfigurasi Awal (Dependensi)
Di terminal folder `mobile`, jalankan:
```bash
flutter pub add firebase_core firebase_messaging flutter_local_notifications
```

### 2. Inisiasi Firebase di [main.dart](file:///c:/febri.net/mobile/lib/main.dart)
Buka file [mobile/lib/main.dart](file:///c:/febri.net/mobile/lib/main.dart):
```dart
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

// 1. Tambahkan background handler
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 2. Inisiasi Firebase
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  
  runApp(const MyApp());
}
```

### 3. Buat `MobileNotificationService`
Buat file `mobile/lib/services/mobile_notification_service.dart`:
```dart
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class MobileNotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotif = FlutterLocalNotificationsPlugin();

  Future<void> initialize() async {
    // 1. Minta izin notifikasi (untuk iOS / Android 13+)
    await _fcm.requestPermission();

    // 2. Setup Local Notification (untuk memunculkan pop-up saat aplikasi terbuka)
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidInit);
    await _localNotif.initialize(initSettings);

    // 3. Listener saat aplikasi sedang dibuka (Foreground)
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      if (message.notification != null) {
        _localNotif.show(
          message.hashCode,
          message.notification!.title,
          message.notification!.body,
          const NotificationDetails(
            android: AndroidNotificationDetails(
              'high_importance_channel', 'High Importance Notifications',
              importance: Importance.max, priority: Priority.high,
            ),
          ),
        );
      }
    });
  }

  // Fungsi mengambil token unik HP ini untuk dikirim ke Backend
  Future<String?> getDeviceToken() async {
    return await _fcm.getToken();
  }
}
```

### 4. Kirim Token ke Backend setelah Login
Di dalam [mobile/lib/providers/auth_provider.dart](file:///c:/febri.net/mobile/lib/providers/auth_provider.dart) fungsi [login()](file:///c:/febri.net/mobile/lib/providers/auth_provider.dart#99-174), setelah berhasil login:
```dart
// Setelah sukses load user info...
final notifService = MobileNotificationService();
String? token = await notifService.getDeviceToken();

if (token != null) {
  // Panggil API Backend Anda
  await http.post(
    Uri.parse('$baseUrl/devices/register-token'),
    headers: {
      'Authorization': 'Bearer $_token',
      'Content-Type': 'application/json',
    },
    body: jsonEncode({'token': token, 'device_type': 'android'}),
  );
}
```

---

## TAHAP 2: Setup Web (React JS / Admin / User Panel)

Notifikasi di Web menggunakan standar Service Worker agar tetap muncul meski *tab browser* Febri.net ditutup (selama browser masih berjalan).

### 1. Konfigurasi Awal (Dependensi)
Di terminal folder `web/user` atau `web/admin`, jalankan:
```bash
npm install firebase
```

### 2. Buat File `firebase.js`
Buat file `src/firebase.js`:
```javascript
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Copy dari Firebase Console > Project Settings > General > Web Apps
const firebaseConfig = {
  apiKey: "API_KEY_ANDA",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, { 
      vapidKey: 'VAPID_KEY_ANDA_DARI_FIREBASE_CONSOLE_CLOUD_MESSAGING_TAB' 
    });
    if (currentToken) {
      console.log('FCM Web Token:', currentToken);
      // TODO: Kirim `currentToken` ini API /devices/register-token di Laravel
      return currentToken;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
```

### 3. Buat File `firebase-messaging-sw.js` (PENTING)
Buat file persis dengan nama ini di dalam folder `public/`:
```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "API_KEY_ANDA",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
});

const messaging = firebase.messaging();

// Menangani notifikasi jika layar tab web tertutup
messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### 4. Menampilkan Notifikasi di React (Contoh di `App.jsx` atau `Dashboard.jsx`)
```javascript
import { useEffect } from 'react';
import { requestForToken, onMessageListener } from './firebase';

function Dashboard() {
  useEffect(() => {
    // 1. Dapatkan Token saat komponen meload & Kirim ke DB
    requestForToken();

    // 2. Tampilkan Toast jika tab aktif saat pesan masuk
    onMessageListener().then((payload) => {
      // (Bisa gunakan komponen Toast seperti react-toastify)
      alert(`[FCM Baru] ${payload.notification.title}: ${payload.notification.body}`);
    }).catch((err) => console.log('failed: ', err));
  }, []);

  return <div>Dashboard Panel</div>;
}
```

---

Kedua tahapan di atas membutuhkan project yang sudah di-daftarkan pada situs **Firebase Console**. Setelah Anda mendaftarkan App di Firebase Console, seluruh kunci API & konfigurasi `google-services.json` yang dibutuhkan akan didapatkan secara gratis.
