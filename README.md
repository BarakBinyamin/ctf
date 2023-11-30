# Capture The Flag 
Attack surface, attack tooling, and patch included

#TODO diagrams

attack
iot-light
  ESP32Marauder
  esp32_nat_router
  servers
img

Directory
- [Project Directory](#project-directory) 
- [Quickstart](#quickstart)
- [Motivation](#motivation)
- [Resources](#resources)
- [References](#refrences--kudos)

## Project Directory
| Name                                     | Purpose                                                       | 
| :--                                      | :--                                                           |
|[esp32_nat_router](esp32_nat_router)      | A configurable router for esp32, used to dns spoof            |
|[ESP32Marauder](ESP32Marauder)            | Wifi security firmware for esp32 to run deauth attacks        |
|[iot-lght](iot-light)                     | A wireless lamp with OTA (over the air) updates               |
|[servers](servers)                        | Malicous dns, http, and https servers                         |

## Quickstart
- [Requirements](#requirements)
  - [Hardware](#hardware)
  - [Software](#software)
- [Setup](#setup---create-an-iot-light)
  - [Create an iot-lght](#setup---create-an-iot-light)
- [Attack](#attack)
  - [Create an ESP32Marauder](#create-an-esp32marauder)
  - [Create a mini wifi router](#create-a-mini-wifi-router)
  - [Launching an attack](#launching-an-attack)
- [Patch]()
### Requirements
#### Hardware
- [3 ESP32 dev boards]()
- [Micro usb cable]()
- [Breadboard]()
- [Led's]()
- [Resistors]()

#### Software
- [VScode]()
- [PlatformIO vscode extension]()
- [This Repo](https://github.com/BarakBinyamin/ctf)
```
git clone https://github.com/BarakBinyamin/ctf.git && cd ctf
```

### Setup - Create an IOT Light
1. Open [iot-light](iot-light) in its own vscode window
2. Plug in an esp32
3. Add wifi credentials to [iot-light/include/config.h](iot-light/include/config.h) 
3. PlatformIO <img src="https://github.com/BarakBinyamin/RIT-CE-toolbox/assets/60147768/15385a35-3bf9-4561-a204-b651d776f4a1" width="15" height="15">->blue1->upload&monitor

### Attack
#### Create an ESP32Marauder
1. Open the [ESP32Marauder](ESP32Marauder) folder in vscode, let platformio process
2. From the platformio menu, select upload
3. Connect to the **MarauderOTA** wifi, password is **justcallmekoko**
4. Go to [192.18.4.1](http://192.18.4.1)
5. Login with user **admin** password **admin**
6. Choose file -> [.../ESP32Marauder/esp32_marauder_v0_13_3_20231114_old_hardware.bin](ESP32Marauder/esp32_marauder_v0_13_3_20231114_old_hardware.bin), and select update
7. Wait like 60 seconds, a little after the 100% percent feedback is reached
8. Great! You made a marauder! Now you can connect over serial using the platformio monitor button, after a few confguartion messages the cli should pop up
```
CLI Ready
> 
              @@@@@@
              @@@@@@@@
              @@@@@@@@@@@
             @@@@@@  @@@@@@
          @@@@@@@      @@@@@@@
        @@@@@@            @@@@@@
     @@@@@@@                @@@@@@@
   @@@@@@                      @@@@@@
@@@@@@@              @@@@@@@@@@@@@@@@
@@@@@                 @@@@@@@@@@@@@@@
@@@@@                   @@@@@@@
@@@@@                      @@@@@@
@@@@@@                       @@@@@@@
  @@@@@@                        @@@@@@@@@@@@
    @@@@@@@                          @@@@@@
       @@@@@@                     @@@@@@
         @@@@@@@                @@@@@@
            @@@@@@           @@@@@@
              @@@@@@@      @@@@@@
                 @@@@@@ @@@@@@
                   @@@@@@@@@
                      @@@@@@
                        @@@@




--------------------------------

         ESP32 Marauder

            v0.13.4

       By: justcallmekoko

--------------------------------
>#
``` 
#### Create a mini wifi router
1. Open the esp32_nat_server folder in vscode, let platformio process, then press the upload button 
2. On another device you should see a wifi named **ESP32 NAT router**, connect
3. A router settings page should be available @ [http://192.168.4.1](http://192.168.4.1)

For reference, the following line in [esp32_nat_router/main/esp32_nat_router.c](esp32_nat_router/main/esp32_nat_router.c) has been changed so that the first device connnected is the default dns server if traffic is not being forwarded to another router
```c++
#define DEFAULT_DNS "192.168.4.2"
```

#### Launching an attack
##### Overview
1. Use tools like [Fing]() and [Wireshark]() to find the target on the wifi
2. Start a malicous router with same wifi and ssid as the target, connect to it and start up malicous servers
3. Use the Maurauder to disconnect the **IOT-Light** so it will recconnect to the fake access point
4. When a request to get the new firmware is made, it will use the firmware provided by our servers

##### Finding the target
[Fing]()
##### Use Maurauder to disconnect the **IOT-Light** 
3. `scanap` with the marauder to save a list of access points
4. `scansta` with the marauder to save a list of stations and their access points
5. list -c to find the router with ssid and maximum connection (That's our real router) 
6. `select -a <ap-number>` to select the device to fake death packets from so devices will switch to the fake access point

#### Patch for the attack
Have the iot device check the authorship of the tls certificates

#TODO what is tls and how is authorship confirmed

## More Attacks
### Information Disclosure - Viewing Traffic
#TODO
### Denial of service - Deauth
#TODO
### Spoofing/Repudiation - Deauth + Malicous Router
#TODO
### Elevation of Privilege - Uploading new code onto device
#TODO

## Motivation
IOT devices are commonly built with certain hardware constraints, limiting them to use IP over wifi or some subset of wireless communication protocol like Zigbee or espnow to interact with each other

Wireless communication represents a hardware security risk, being that another Wi-Fi capable device in close proximity could intercept data without being detected, as well mascaraed as the intended recipient and send back malicious data

[Hardware security threats](https://en.wikipedia.org/wiki/STRIDE_(security)) are all across the board, including 
- **Spoofing** ex. Malicious router broadcasting the same name/ssid as a trusted router
- **Tampering** ex. Man in the middle altering data
- **Information disclosure** ex. Man in the middle capturing data
- **Repudiation** ex. Malicious router can imitate authorship credentials
- **Denial of Service** ex. Deauth with udp packets or flooding wifi channel with noise
- **Elevation of Privilege** ex. Can’t think of one at the moment but there is probably one out there

[Here is a paper about this project](), [Here are some slides too]()

# Resources
- [https randomnerd](https://randomnerdtutorials.com/esp32-https-requests/)
https://www.the-qrcode-generator.com/

# Refrences & Kudos
- [cert sgned image](https://www.thesslstore.com/blog/ssltls-certificate-its-architecture-process-interactions/)
- [https randomnerd](https://randomnerdtutorials.com/esp32-https-requests/)
https://www.quora.com/What-prevents-people-from-harvesting-WiFi-passwords-by-setting-up-a-fake-access-point-with-the-same-SSID-as-their-target

#todo formatting

[1] Amazon, _cert signed image_,https://www.thesslstore.com/blog/ssltls-certificate-its-architecture-process-interactions
[2]asd 