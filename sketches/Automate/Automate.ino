#define ENABLE_USER_AUTH
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>

#include "env.h"
#include "Sensors.h"
#include "FirebaseService.h"

WiFiClientSecure ssl_client;
AsyncClient aCliente(ssl_client);
FirebaseApp app;
RealtimeDatabase Database;

unsigned long ultimoEnvio = 0;

void setup() {
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(200);
  }
  Serial.println("\nWiFi conectado!");

  ssl_client.setInsecure();

  UserAuth auth(FIREBASE_API_KEY, FIREBASE_EMAIL, FIREBASE_PASSWORD);
  initializeApp(aCliente, app, getAuth(auth), processarDados, "auth");

  app.getApp<RealtimeDatabase>(Database);
  Database.url(FIREBASE_DB_URL);

  for (int i = 0; i < TOTAL_SENSORES; i++) {
    pinMode(sensores[i].trig, OUTPUT);
    pinMode(sensores[i].echo, INPUT);
  }
}

void loop() {
  app.loop();
  if (!app.ready()) return;

  if (millis() - ultimoEnvio >= INTERVALO_ENVIO) {
    ultimoEnvio = millis();

    for (int i = 0; i < TOTAL_SENSORES; i++) {
      double dist = lerDistancia(sensores[i].trig, sensores[i].echo);

      if (dist < 0) {
        Serial.printf("[%s] Erro no sensor\n", sensores[i].id.c_str());
        continue;
      }

      Serial.printf("[%s] %.2f cm\n", sensores[i].id.c_str(), dist);

      atualizarLeituras(sensores[i], dist);
      enviarDadosFirebase(sensores[i]);
    }
  }
}
