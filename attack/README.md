# Attack
Getting full control of the IOT light
1. Use tools like [Fing]() and [Wireshark]() to find the IOT-light connected to the wifi
2. Setup a malicous router with same wifi and ssid as the target, connect malicous servers to it
3. Use the Maurauder to disconnect the **IOT-Light** so it will recconnect to the fake access point
4. When a request to get the new firmware is made, the IOT-light will get the firmware provided by the malicous servers

# Wireshark
- [https://superuser.com/questions/884035/wireshark-monitor-mode-decrypting-capture](https://superuser.com/questions/884035/wireshark-monitor-mode-decrypting-capture)
wlan.sa==9A:48:11:F7:42:AC and ip.addr ==
wlan.sa==9A:48:11:F7:42:AC and (tcp or dns)
Enable WPA key length override helped
eapol
wlan.sa==9A:48:11:F7:42:AC

# TCP dump
sudo tcpdump src 192.168.1.130



