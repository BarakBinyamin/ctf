# Attack
Getting full control of the IOT light
1. Use tools like [Fing]() and [Wireshark]() to find the IOT-light connected to the wifi
2. Setup a malicous router with same wifi and ssid as the target, connect malicous servers to it
3. Use the Maurauder to disconnect the **IOT-Light** so it will recconnect to the fake access point
4. When a request to get the new firmware is made, the IOT-light will get the firmware provided by the malicous servers

| Name                                     | Purpose                                                       | 
| :--                                      | :--                                                           |
|[esp32_nat_router](esp32_nat_router)      | A configurable router for esp32, used to dns spoof            |
|[ESP32Marauder](ESP32Marauder)            | Wifi security firmware for esp32 to run deauth attacks        |
|[servers](servers)                        | Malicous dns, http, and https servers                         |

# Wireshark Testing
- [https://superuser.com/questions/884035/wireshark-monitor-mode-decrypting-capture](https://superuser.com/questions/884035/wireshark-monitor-mode-decrypting-capture)
- Some helpful filters
```
wlan.sa==12:48:11:31:42:33 and ip.addr ==
wlan.sa==12:48:11:31:42:33 and (tcp or dns)
Enable WPA key length override helped
eapol
wlan.sa==12:48:11:31:42:33
```

# TCP dump stuff
sudo tcpdump src 192.168.1.130
- `sudo tcpdump -tvvvnA "tcp port http"` shows raw text http requests made (only the unencrypted ones)
    - `-t` for no timestamps, `-A` for ascii, `-vvv` for really really verbose, `"tcp port http"`
- `sudo tcpdump port 53 -l --immediate-mode | grep -o "[^ ]*[.]com"` shows domain names requested (always unencrypted)



