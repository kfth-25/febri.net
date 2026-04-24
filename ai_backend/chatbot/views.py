
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            message = data.get('message', '').lower()
            
            response_text = ""
            
            # Simple AI Logic
            if not message or message in ['halo', 'hi', 'hai', 'hello']:
                greetings = [
                    "Halo! Saya AI Assistant Febri.net. Ada yang bisa saya bantu?",
                    "Hai! Selamat datang di Febri.net. Mau tanya soal paket internet?",
                    "Halo! Saya siap membantu Anda. Silakan tanya apa saja."
                ]
                response_text = random.choice(greetings)
            
            elif 'paket' in message or 'harga' in message or 'biaya' in message:
                response_text = "Kami memiliki berbagai paket menarik:\n1. Starter Home (20 Mbps) - Rp 250.000\n2. Family Entertainment (50 Mbps) - Rp 350.000\n3. Gamer & Creator (100 Mbps) - Rp 550.000\n\nSemua unlimited tanpa FUP! Mau berlangganan?"
                
            elif 'pasang' in message or 'daftar' in message or 'install' in message:
                response_text = "Untuk pemasangan baru, Anda bisa langsung klik menu 'Daftar Pemasangan' di atas. Prosesnya cepat dan mudah. Ada kendala saat mendaftar?"
            
            elif 'bbs' in message: # Handling user specific keyword if any
                response_text = "BBS (Barang Bukti Surat)? Atau maksud Anda Bebas? Silakan tanya apa saja, saya akan coba jawab sebisanya!"
                
            elif 'lokasi' in message or 'coverage' in message:
                response_text = "Layanan kami mencakup area luas. Anda bisa cek ketersediaan dengan mencoba mendaftar dan memasukkan lokasi Anda di menu Pemasangan."
                
            else:
                defaults = [
                    "Maaf, saya belum mengerti. Bisa tanya seputar paket internet atau cara pasang?",
                    "Wah, pertanyaan menarik. Tapi sebagai AI khusus internet, saya lebih tahu soal WiFi dan paket data.",
                    "Bisa diulangi? Saya bisa bantu jelaskan paket atau status pemasangan."
                ]
                response_text = random.choice(defaults)
            
            return JsonResponse({'response': response_text})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
