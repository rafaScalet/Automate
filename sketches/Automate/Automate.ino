#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h> // versão 2.2.3

// --------------------- CREDENCIAIS -------------------------
#define WIFI_SSID "Automate"
#define WIFI_PASSWORD "automate@123"

#define chave_api "AIzaSyAoKkjXuo7X76hlkssJ80W5GeIMYEKvCQ4"
#define url_banco_dados "https://automate-52c0d-default-rtdb.firebaseio.com"
#define email_usuario "angelomodanez15@gmail.com"
#define senha_usuario "Automate@123"

// Função callback
void processarDados(AsyncResult &aResultado);

// ------------------ FIREBASE OBJETOS -----------------------
UserAuth autenticacao_usuario(chave_api, email_usuario, senha_usuario);

WiFiClientSecure ssl_client;
FirebaseApp app;
RealtimeDatabase Database;

using AsyncClient = AsyncClientClass;
AsyncClient aCliente(ssl_client);

// ---------------------- SENSOR ------------------------------
#define TRIG 33
#define ECHO 32

// Variáveis
double valorAtual = 0;
double valorAnterior = 0;
long tsAtual = 0;
long tsAnterior = 0;

unsigned long ultimo_envio = 0;
const unsigned long intervalo_envio = 5000;
String lixeiraID = "lixeira01";

// Timestamp
long getTimestamp() { return millis(); }

void atualizarLeituras(double nova) {
  valorAnterior = valorAtual;
  tsAnterior = tsAtual;
  valorAtual = nova;
  tsAtual = getTimestamp();
}

// Callback
void processarDados(AsyncResult &aResultado) {
  if (!aResultado.isResult()) return;

  if (aResultado.isEvent())
    Firebase.printf("[EVENTO] %s → %s (code %d)\n",
                    aResultado.uid().c_str(),
                    aResultado.eventLog().message().c_str(),
                    aResultado.eventLog().code());

  if (aResultado.isError())
    Firebase.printf("[ERRO] %s → %s (code %d)\n",
                    aResultado.uid().c_str(),
                    aResultado.error().message().c_str(),
                    aResultado.error().code());
}

void setup() {
  Serial.begin(115200);

  // Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi conectado!");

  // SSL
  ssl_client.setInsecure();
  ssl_client.setConnectionTimeout(1000);
  ssl_client.setHandshakeTimeout(5);

  // Firebase
  initializeApp(aCliente, app, getAuth(autenticacao_usuario), processarDados, "authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(url_banco_dados);

  // Sensor
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {

  app.loop();  
  if (!app.ready()) return;

  unsigned long agora = millis();

  if (agora - ultimo_envio >= intervalo_envio) {
    ultimo_envio = agora;

    // SENSOR
    digitalWrite(TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG, LOW);

    long tempo = pulseIn(ECHO, HIGH, 500000);
    double distancia = tempo > 0 ? (tempo * 0.0343) / 2.0 : -1;

    if (distancia <= 0) {
      Serial.println("[AVISO] Falha no sensor");
      return;
    }

    Serial.printf("Distância: %.2f cm\n", distancia);
    atualizarLeituras(distancia);

    String base = "/lixeiras/" + lixeiraID + "/leituras";

    // ENVIO ASSÍNCRONO
    Database.set<double>(aCliente, base + "/ultima/valor", valorAtual, processarDados, "ULT_VALOR");
    Database.set<long>(aCliente, base + "/ultima/timestamp", tsAtual, processarDados, "ULT_TS");

    Database.set<double>(aCliente, base + "/anterior/valor", valorAnterior, processarDados, "ANT_VALOR");
    Database.set<long>(aCliente, base + "/anterior/timestamp", tsAnterior, processarDados, "ANT_TS");
  }

  delay(10);
}