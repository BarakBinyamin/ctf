#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Update.h>
#include <ArduinoWebsockets.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>
#include "config.h"

#define   VERSION            1
#define   VERSION_URL        "/version"
#define   FIRMWARE_URL       "/whatisthefirmwareurl"
#define   FIRMWARE_PATH      "/firmware"
#define   BLUE_LED           LED_BUILTIN
#define   RED_LED            32
#define   BLINK_RATE         1                        // time on/off in intervals of .5 seconds

using namespace websockets;
WebsocketsClient ws;
bool             LIGHT_ON  = false;
bool             connected = false;
bool             justconnected = false;

/*
This is an iot lamp
1. It will listen for requests to set an led on or off
2. On connection to the wifi, the device will check /version to see if it needs an update 
*/
void connectToWS(){
  Serial.println("Connecting to websockets server...");
  int attempts = 0;
  bool connected = ws.connect(WSSERVER, WSPORT, "/?id=device");
  while(!connected && attempts<5){
    attempts++;
    Serial.print('.');
    delay(1000);
    connected = ws.connect(WSSERVER, WSPORT, "/?id=device");
  }
  if(connected){
    Serial.println("\nConnected to websockets server...");
  }else{
    Serial.println("\nTimed out attempting to connect to websockets server...");
    digitalWrite(BLUE_LED, HIGH);
  }
}


// Update Stuff
bool updateAvailable(){
  HTTPClient client;
  client.begin( (String("http://") + String(WSSERVER) + String(VERSION_URL)).c_str() );
  int  httpResponseCode = client.GET();
  bool isUpdateNeeded = false;
  if (httpResponseCode>0 && httpResponseCode == HTTP_CODE_OK) {
    String payload = client.getString();
    if (payload){
      if (payload.toInt() > VERSION){
        isUpdateNeeded=true;
      }
    }
  }
  client.end();
  return isUpdateNeeded;
}
String getUpdateURL(){
  HTTPClient client;
  client.begin( (String("http://") + String(WSSERVER) + String(FIRMWARE_URL)).c_str() );
  int  httpResponseCode = client.GET();
  String updateURL;
  if (httpResponseCode>0 && httpResponseCode == HTTP_CODE_OK) {
    String payload = client.getString();
    if (payload){
      updateURL = payload;
    }
  }
  client.end();
  return updateURL;
}
void installUpdate(void){
  File file = SPIFFS.open(FIRMWARE_PATH, FILE_READ);
  if(!file){
    Serial.println("Failed to open file for reading");
    return;
  }
  Serial.println("Starting update...");
  size_t fileSize = file.size();
  Serial.print("Firmware file size is ");Serial.print(fileSize);Serial.println("Bytes");
  if(!Update.begin(fileSize)){
      String error = Update.errorString();
      Serial.println("Cannot do the update");
      Serial.println(error);
      return;
  }
  Update.writeStream(file);
  if(Update.end()){
    Serial.println("Successful update!");  
  }else {
    Serial.println("Error Occurred during update install from flash: " + String(Update.getError()));
    return;
  }
  file.close();
  Serial.println("Reset in 4 seconds...\n\n\n\n");
  delay(4000);
  ESP.restart();
}
bool getUpdate(String updateURL){
  if(SPIFFS.exists(FIRMWARE_PATH)){
    SPIFFS.remove(FIRMWARE_PATH);
  }
  File file = SPIFFS.open(FIRMWARE_PATH, FILE_WRITE);
  if(!file){
    Serial.println("Failed to open file for writing...");
    SPIFFS.end();
    return false;
  }

  // Get the firmware
  HTTPClient client;
  bool success = false;
  client.begin(updateURL.c_str());
  int httpResponseCode = client.GET();
  if (httpResponseCode>0 && httpResponseCode == HTTP_CODE_OK) {
    int totalBytes      = client.getSize();
    int bytesLeftToRead = client.getSize();
    uint8_t      buff[2048] = { 0 };
    WiFiClient * stream     = client.getStreamPtr();
    while(client.connected() && bytesLeftToRead > 0) {
      // get available data size
      size_t size = stream->available();
      if(size) {
          int numBytesToWrite = stream->readBytes(buff, ((size > sizeof(buff)) ? sizeof(buff) : size));
          size_t numBytesWritten = file.write(buff, numBytesToWrite);
          if(bytesLeftToRead > 0) {
              bytesLeftToRead -= numBytesToWrite;
          }
      }
      Serial.print((((float)totalBytes-(float)bytesLeftToRead)/(float)totalBytes)*(float)100);Serial.println("%");
      delay(1);
      digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
    }
    if (bytesLeftToRead==0 && totalBytes>0) {
      Serial.print("New firmware update saved to SPIFFS!");
      success=true; 
    }else{
      Serial.print("Failed to write image to spiffs");
      success=false;
    }
  }else {
    Serial.print("Error code from firware URL: ");
    Serial.println(httpResponseCode);
  }
  file.close();
  client.end();
  return success;
}
void getUpdateIfAvailable(){
  if (updateAvailable()){
      Serial.println("Update Available!");
      String updateURL      = getUpdateURL();
      bool updateDownloaded = getUpdate(updateURL);
      if (updateDownloaded){
        installUpdate();
      }
  }else{
    Serial.println("Firmware up to date...");
  }
}

// Wifi stuff
void Wifi_connected(WiFiEvent_t event, WiFiEventInfo_t info){
  Serial.println("Successfully connected to Access Point");
}
void Get_IPAddress(WiFiEvent_t event, WiFiEventInfo_t info){
  Serial.println("WIFI is connected!");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  connected=true;
  justconnected=true;
}
void Wifi_disconnected(WiFiEvent_t event, WiFiEventInfo_t info){
  connected=false;
  Serial.println("Disconnected from WIFI access point");
  Serial.print("WiFi lost connection. Reason: ");
  Serial.println(info.wifi_sta_disconnected.reason);
  Serial.println("Reconnecting...");
  WiFi.begin(SSID, PASS);
}
void setupWiFi(){
  WiFi.disconnect(true);
  delay(1000);
  WiFi.onEvent(Wifi_connected,    WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_CONNECTED);
  WiFi.onEvent(Get_IPAddress,     WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_GOT_IP);
  WiFi.onEvent(Wifi_disconnected, WiFiEvent_t::ARDUINO_EVENT_WIFI_STA_DISCONNECTED);
  WiFi.begin(SSID,PASS);
}


/*
* MAIN PROGRAM
*
* 1. Connect to wifi
* 2. Listen to for CMD's
*
*/
void setup() {
  Serial.begin(115200); 
  Serial.print("\n\n<--------Version ");Serial.print(VERSION);Serial.print("----------->\n\n");
  
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // Setup spiffs for updates
  if(!SPIFFS.begin(true)){
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  // Setup wifi and websockets
  setupWiFi();
  ws.onMessage([&](WebsocketsMessage message){
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, message.data());
      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
      }else{
        const char* type = doc["type"];
        if (strcmp(type,"status")==0){
          String msg = String("{\"type\":\"status\", \"state\":" + String(LIGHT_ON)  + "}");
          ws.send(msg);
        }else if (strcmp(type,"change")==0){
          LIGHT_ON = doc["state"];
          digitalWrite(RED_LED, LIGHT_ON);
          String msg = String("{\"type\":\"status\", \"state\":" + String(LIGHT_ON)  + "}");
          ws.send(msg);
        }
      }
      Serial.print("Got Message: ");
      Serial.println(message.data());
  });
}
void loop() {
  if (connected){
    if (justconnected){justconnected=false;getUpdateIfAvailable();}
    if(ws.available()){ws.poll();}else{connectToWS();}
    delay(BLINK_RATE * 500);
    digitalWrite(BLUE_LED, !digitalRead(BLUE_LED));
  }  
}



