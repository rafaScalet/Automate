#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>  // versão 2.2.3

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

// ---------------------- PINOS DOS SENSORES ------------------------------
// Pinos escolhidos para serem Saída/Entrada (seguros para TRIG)
#define TRIG_1 13
#define ECHO_1 12

#define TRIG_2 14
#define ECHO_2 27

#define TRIG_3 26
#define ECHO_3 34  // GPIO 34 é Apenas Entrada, perfeito para ECHO

// ---------------------- VARIÁVEIS POR SENSOR ------------------------------

// Estrutura de Leitura (para cada sensor)
struct LeituraSensor {
  double valorAtual;
  double valorAnterior;
  long tsAtual;
  long tsAnterior;
  String idLixeira;
};

LeituraSensor sensor1 = { 0, 0, 0, 0, "lixeira01" };
LeituraSensor sensor2 = { 0, 0, 0, 0, "lixeira02" };
LeituraSensor sensor3 = { 0, 0, 0, 0, "lixeira03" };

// Variáveis de Controle
unsigned long ultimo_envio = 0;
const unsigned long intervalo_envio = 5000;

// ---------------------- FUNÇÕES GERAIS ------------------------------

// Timestamp
long getTimestamp() {
  return millis();
}

// ---------------------- FUNÇÕES DO SENSOR ------------------------------

void atualizarLeituras(LeituraSensor &sensor, double novaDistancia) {
  sensor.valorAnterior = sensor.valorAtual;
  sensor.tsAnterior = sensor.tsAtual;
  sensor.valorAtual = novaDistancia;
  sensor.tsAtual = getTimestamp();
}

double lerDistancia(int trigPin, int echoPin) {
  // 1. Dispara o pulso ultrassônico
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // 2. Mede o tempo de retorno do pulso (timeout 500ms)
  long tempo = pulseIn(echoPin, HIGH, 500000);

  // 3. Calcula a distância (tempo * velocidade do som em cm/µs) / 2
  if (tempo > 0) {
    // Se a velocidade do som é 0.0343 cm/µs
    return (tempo * 0.0343) / 2.0;
  } else {
    return -1;  // Falha na leitura ou timeout
  }
}

// ---------------------- FUNÇÕES DO FIREBASE ------------------------------

/**
 * @brief Envia os dados de leitura de um sensor para o Firebase Realtime Database.
 */
void enviarDados(LeituraSensor &sensor) {
  String base = "/lixeiras/" + sensor.idLixeira + "/leituras";

  // Envio Assíncrono da Leitura Atual
  Database.set<double>(aCliente, base + "/atual/valor", sensor.valorAtual, processarDados, ("ULT_VALOR_" + sensor.idLixeira).c_str());
  Database.set<long>(aCliente, base + "/atual/timestamp", sensor.tsAtual, processarDados, ("ULT_TS_" + sensor.idLixeira).c_str());

  // Envio Assíncrono da Leitura Anterior
  Database.set<double>(aCliente, base + "/anterior/valor", sensor.valorAnterior, processarDados, ("ANT_VALOR_" + sensor.idLixeira).c_str());
  Database.set<long>(aCliente, base + "/anterior/timestamp", sensor.tsAnterior, processarDados, ("ANT_TS_" + sensor.idLixeira).c_str());
}

// Função Callback do Firebase
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

// ---------------------- SETUP & LOOP ------------------------------

void setup() {
  Serial.begin(115200);

  // 1. Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando ao WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\nWiFi conectado!");

  // 2. SSL
  ssl_client.setInsecure();
  ssl_client.setConnectionTimeout(1000);
  ssl_client.setHandshakeTimeout(5);

  // 3. Firebase
  initializeApp(aCliente, app, getAuth(autenticacao_usuario), processarDados, "authTask");
  app.getApp<RealtimeDatabase>(Database);
  Database.url(url_banco_dados);

  // 4. Configuração dos Pinos dos Sensores

  // Sensor 1
  pinMode(TRIG_1, OUTPUT);
  pinMode(ECHO_1, INPUT);

  // Sensor 2
  pinMode(TRIG_2, OUTPUT);
  pinMode(ECHO_2, INPUT);

  // Sensor 3
  pinMode(TRIG_3, OUTPUT);
  pinMode(ECHO_3, INPUT);
}

void loop() {
  app.loop();
  if (!app.ready()) return;

  unsigned long agora = millis();

  if (agora - ultimo_envio >= intervalo_envio) {
    ultimo_envio = agora;

    // ------------------ LEITURA DOS SENSORES ------------------

    // SENSOR 1
    double dist1 = lerDistancia(TRIG_1, ECHO_1);
    if (dist1 > 0) {
      Serial.printf("S1 - Distância: %.2f cm\n", dist1);
      atualizarLeituras(sensor1, dist1);
      enviarDados(sensor1);
    } else {
      Serial.println("[AVISO] S1 - Falha no sensor");
    }

    // SENSOR 2
    double dist2 = lerDistancia(TRIG_2, ECHO_2);
    if (dist2 > 0) {
      Serial.printf("S2 - Distância: %.2f cm\n", dist2);
      atualizarLeituras(sensor2, dist2);
      enviarDados(sensor2);
    } else {
      Serial.println("[AVISO] S2 - Falha no sensor");
    }

    // SENSOR 3
    double dist3 = lerDistancia(TRIG_3, ECHO_3);
    if (dist3 > 0) {
      Serial.printf("S3 - Distância: %.2f cm\n", dist3);
      atualizarLeituras(sensor3, dist3);
      enviarDados(sensor3);
    } else {
      Serial.println("[AVISO] S3 - Falha no sensor");
    }
  }

  delay(10);
}