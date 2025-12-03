#pragma once
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <FirebaseClient.h>

#include "Sensors.h"
#include "env.h"

using AsyncClient = AsyncClientClass;

extern FirebaseApp app;
extern AsyncClient aCliente;
extern RealtimeDatabase Database;

void processarDados(AsyncResult &r) {
  if (!r.isResult()) return;

  if (r.isEvent())
    Firebase.printf("[EVENTO] %s → %s (code %d)\n", r.uid().c_str(), r.eventLog().message().c_str(), r.eventLog().code());

  if (r.isError())
    Firebase.printf("[ERRO] %s → %s (code %d)\n", r.uid().c_str(), r.error().message().c_str(), r.error().code());
}

void enviarDadosFirebase(Sensor &s, int idx) {
  String base = "/lixeiras/Lixeira" + String(idx) + "/leituras/";

  Database.set<double>(aCliente, base + "atual/valor", s.atual, processarDados);
  Database.set<long>(aCliente, base + "atual/timestamp", s.tsAtual, processarDados);

  Database.set<double>(aCliente, base + "anterior/valor", s.anterior, processarDados);
  Database.set<long>(aCliente, base + "anterior/timestamp", s.tsAnterior, processarDados);
}
