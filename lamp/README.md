# A wireless lamp with OTA (over the air) updates

## Project Directory
| Name                                | Purpose                                                       | 
| :--                                 | :--                                                           |
|[ctf-solution](ctf-solution)         | For now, testing base for iot-light, yes it needs to be moved |
|[esp32_nat_router](esp32_nat_router) | A configurable router for esp32, used to dns spoof            |
|[ESP32Marauder](ESP32Marauder)       | Wifi security tool on esp32 that can be used to deauth        |
|[iot-lght](iot-light)                | --                                                            |
|[servers](servers)                   | Malicous dns, http, and https servers                         |

## Project decryption
IOT devices are commonly built with certain hardware constraints, limiting them to use IP over wifi or some subset of wireless communication protocol like Zigbee or espnow to interact with each other

Wireless communication represents a hardware security risk, being that another Wi-Fi capable device in close proximity could intercept data without being detected, as well mascaraed as the intended recipient and send back malicious data

[Hardware security threats](https://en.wikipedia.org/wiki/STRIDE_(security)) are all across the board, including 
- **Spoofing** ex. Malicious router broadcasting the same name/ssid as a trusted router
- **Tampering** ex. Man in the middle altering data
- **Information disclosure** ex. Man in the middle capturing data
- **Repudiation** ex. Malicious router can imitate authorship credentials
- **Denial of Service** ex. Deauth with udp packets or flooding wifi channel with noise
- **Elevation of Privilege** ex. Can’t think of one at the moment but there is probably one out there

## Attacks
### Information Disclosure - Viewing Traffic
#TODO

### Denial of service - Deauth
#TODO

### Spoofing/Repudiation - Deauth + Malicous Router
#TODO

### Elevation of Privilege - Uploading new code onto device
#TODO

## Uploading lamp program to esp32
#TODO

## Uploading Wifi Marauder to esp32
#TODO

## Building & uploading the nat router to an esp32 dev board
1. Open the esp32_nat_server folder in vscode, let platformio process, then press only the build button
2. Install esptool, #TODO install 
3. Upload the image
```bash
esptool.py --chip esp32 \
 --before default_reset --after hard_reset write_flash \
 -z --flash_mode dio --flash_freq 40m --flash_size detect \
 0x1000 .pio/build/esp32dev/bootloader.bin \
 0x8000 .pio/build/esp32dev/partitions.bin \
 0x10000 .pio/build/esp32dev/firmware.bin
```

## Running the malicious servers
#TODO make one run script to run all three, and close all three on ctrl+c