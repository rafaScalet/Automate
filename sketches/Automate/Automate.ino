#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>

// Credenciais
#define WIFI_SSID "Automate"
#define WIFI_PASSWORD "automate@123"

#define chave_api "AIzaSyAoKkjXuo7X76hlkssJ80W5GeIMYEKvCQ4"
#define url_banco_dados "https://automate-52c0d-default-rtdb.firebaseio.com"
#define email_usuario "angelomodanez15@gmail.com"
#define senha_usuario "Automate@123"

void processarDados(AsyncResult &aResultado);

// Objetos FireBase
UserAuth autenticacao_usuario(chave_api, email_usuario, senha_usuario);

WiFiClientSecure ssl_client;
FirebaseApp app;
RealtimeDatabase Database;

using AsyncClient = AsyncClientClass;
AsyncClient aCliente(ssl_client);

// Estrutura de Sensor
struct Sensor {
  String idLixeira;
  int trig;
  int echo;
  double valorAtual;
  long tsAtual;
  double valorAnterior;
  long tsAnterior;
};

// Lista de sensores
Sensor sensores[] = {
  { "r32r32jz", 13, 12, 0, 0, 0, 0 },
  { "x8c6a8sd", 14, 27, 0, 0, 0, 0 },
  { "8qywe7wt", 26, 34, 0, 0, 0, 0 }
};

// Número total
const int totalSensores = sizeof(sensores) / sizeof(sensores[0]);

// Variáveis de envio
unsigned long ultimo_envio = 0;
const unsigned long intervalo_envio = 5000;


long getTimestamp() {
  return millis();
}

void atualizarLeituras(Sensor &sensor, double novaDistancia) {
  sensor.valorAnterior = sensor.valorAtual;
  sensor.tsAnterior = sensor.tsAtual;
  sensor.valorAtual = novaDistancia;
  sensor.tsAtual = getTimestamp();
}

double lerDistancia(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long tempo = pulseIn(echo, HIGH, 500000);
  return (tempo > 0) ? (tempo * 0.0343) / 2.0 : -1;
}

void enviarDados(Sensor &sensor, int index) {
  String base = "/lixeiras/Lixeira" + String(index) + "/leituras/";

  Database.set<double>(aCliente, base + "atual/valor", sensor.valorAtual, processarDados, ("ATL_VALOR_" + sensor.idLixeira).c_str());
  Database.set<long>(aCliente, base + "atual/timestamp", sensor.tsAtual, processarDados, ("ATL_TS_" + sensor.idLixeira).c_str());

  Database.set<double>(aCliente, base + "anterior/valor", sensor.valorAnterior, processarDados, ("ANT_VALOR_" + sensor.idLixeira).c_str());
  Database.set<long>(aCliente, base + "anterior/timestamp", sensor.tsAnterior, processarDados, ("ANT_TS_" + sensor.idLixeira).c_str());
}

void processarDados(AsyncResult &aResultado) {
  if (!aResultado.isResult()) return;

  if (aResultado.isEvent())
    Firebase.printf("[EVENTO] %s → %s (code %d)\n", aResultado.uid().c_str(), aResultado.eventLog().message().c_str(), aResultado.eventLog().code());

  if (aResultado.isError())
    Firebase.printf("[ERRO] %s → %s (code %d)\n", aResultado.uid().c_str(), aResultado.error().message().c_str(), aResultado.error().code());
}

void setup() {
  Serial.begin(115200);

  Serial.print("Conectando ao WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi conectado!");

  ssl_client.setInsecure();
  initializeApp(aCliente, app, getAuth(autenticacao_usuario), processarDados, "authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(url_banco_dados);

  for (int i = 0; i < totalSensores; i++) {
    pinMode(sensores[i].trig, OUTPUT);
    pinMode(sensores[i].echo, INPUT);
  }
}

void loop() {

  app.loop();
  if (!app.ready()) return;

  if (millis() - ultimo_envio >= intervalo_envio) {
    ultimo_envio = millis();

    for (int i = 0; i < totalSensores; i++) {
      double dist = lerDistancia(sensores[i].trig, sensores[i].echo);

      if (dist <= 0) {
        Serial.printf("[AVISO] %s falha no sensor\n", sensores[i].idLixeira.c_str());
        continue;
      }

      Serial.printf("[%s] Distância: %.2f cm\n", sensores[i].idLixeira.c_str(), dist);
      atualizarLeituras(sensores[i], dist);
      enviarDados(sensores[i], i);
    }
  }

  delay(10);
}