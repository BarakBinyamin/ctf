/*
  Example from WiFi > WiFiScan
  Complete details at https://RandomNerdTutorials.com/esp32-useful-wi-fi-functions-arduino/
*/

#include "WiFi.h"
#include <ESPmDNS.h>
#include "lwip/stats.h" //https://esp32.com/viewtopic.php?t=9
//#include "lwip/lwipopts.h" //https://esp32.com/viewtopic.php?t=9
#include <WebServer.h>

WebServer server(80);

#define LWIP_STATS 1
#define LWIP_STATS_DISPLAY 1
#define CONFIG_LWIP_STATS 1
#define ICMP_STATS 1

// #define IP_FORWARD 0 // /Users/mbinyamin/.platformio/packages/framework-arduinoespressif32/tools/sdk/esp32/include/lwip/lwip/src/include/lwip/opt.h

#define SSID_REAL "Verizon_JM6PG6"
#define SSID_FAKE "goober"
#define PASS_REAL "BinyaminHaus5!"
#define PASS_FAKE "123456789"


void handle_request() {
  Serial.println("Sending Resoponse to webserver request...");
  server.send(200, "text/html", "<!DOCTYPE html> <html>\n  hey</html>"); 
}

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(SSID_REAL, PASS_REAL);
  Serial.print("Connecting to real wifi");
  while (!WiFi.isConnected()){
    Serial.print('.');
    delay(100);
  }
  Serial.println("Connected!");Serial.print("My IP address is");Serial.println(WiFi.localIP());
  Serial.print("Starting a access point SSID: ");Serial.print(SSID_FAKE);Serial.print(", Pass: ");Serial.println(PASS_FAKE);
  WiFi.softAP(SSID_FAKE, PASS_FAKE);
  delay(100);
  Serial.print("Starting mDNS...");
  while(!MDNS.begin("esp32Host")) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("MDNS started"); 

  Serial.println("Setting up webserver...."); 
  server.on("/", handle_request);
  server.onNotFound(handle_request);
  server.begin();

  Serial.println("Setup done...");
}

void loop() {
    server.handleClient();
}