# A wireless lamp with OTA (over the air) updates


## Project Directory
| Name                                | Purpose                                                       | 
| :--                                 | :--                                                           |
|[ctf-solution](ctf-solution)         | For now, testing base for iot-light, yes it needs to be moved |
|[esp32_nat_router](esp32_nat_router) | A configurable router for esp32, used to dns spoof            |
|[ESP32Marauder](src)                 | Wifi security tool on esp32 that can be used to deauth        |
|[iot-lght](iot-light)                | --                                                            |
|[servers](servers)                   | Malicous dns, http, and https servers                         |

## Project decription
IOT devices are commonly built with certain hardware constraints, limiting them to use IP over wifi or some subset of wireless communication protocol like Zigbee or espnow to interact with each other


Wireless communication represents a hardware security risk, being that another Wi-Fi capable device in close proximity could intercept data without being detected, as well mascaraed as the intended recipient and send back malicious data

[Hardware security threats](https://en.wikipedia.org/wiki/STRIDE_(security)) are all across the board, including 
- **Spoofing** ex. Malicious router broadcasting the same name/ssid as a trusted router
- **Tampering** ex. Man in the middle capturing and altering data
- **Repudiation** ex. Malicious router can imitate authorship credentials
- **Denial of Service** ex. Deauth with udp packets or flooding wifi channel with noise
- **Elevation of Privilege** ex. Can’t think of one at the moment but there is probably one out there

## Building & uploading the nat server to an esp32 dev board
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