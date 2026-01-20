#pragma once
#include <Arduino.h>

struct Sensor {
  String id;
  int trig;
  int echo;
  double atual;
  double anterior;
  long tsAtual;
  long tsAnterior;
};

Sensor sensores[] = {
  { "Lixeira0", 13, 12, 0, 0, 0, 0 },
  { "Lixeira1", 14, 27, 0, 0, 0, 0 },
  { "Lixeira2", 26, 34, 0, 0, 0, 0 }
};

const int TOTAL_SENSORES = sizeof(sensores) / sizeof(sensores[0]);

long getTimestamp() {
  return millis();
}

void atualizarLeituras(Sensor &s, double nova) {
  s.anterior = s.atual;
  s.tsAnterior = s.tsAtual;
  s.atual = nova;
  s.tsAtual = getTimestamp();
}

double lerDistancia(int trig, int echo) {
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);

  long tempo = pulseIn(echo, HIGH, 500000);
  return (tempo > 0) ? tempo * 0.0343 / 2.0 : -1;
}
