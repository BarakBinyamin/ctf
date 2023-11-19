# ESP32 Marauder
A cool wifi hacking tool that this project will use to deauth

# Attempts to compile and load on regular esp32 
## Add the build and compler flags to ur platform.txt
do this for esp32s2 too and any other chips you might be compiling for
1. mv User_setup.h .pio/build/libdeps/TFT_eSPI
2. Go into ~/.platformio/packages/framework-arduinoespressif32/platform.txt
3. cmd+f for build.extra_flags.esp32, replace `=...` with `=-w`
4. cmd+f for compiler.c.elf.libs.esp32, replace `=...` with `=-w-zmuldefs`

## Sad, espressif32 @ 2.0.1 looks lke its not supported darwin_x86_64
```
Resolving esp32doit-devkit-v1 dependencies...
Platform Manager: Installing espressif32 @ 2.0.1
UnknownPackageError: Could not find the package with 'espressif32 @ 2.0.1' requirements for your system 'darwin_x86_64'
```

### Trying with docker on mac
First Run docker desktop, then
```
docker run --rm --mount type=bind,source="$(pwd)",target=/workspace -u `id -u $USER`:`id -g $USER` --privileged  sglahn/platformio-core:latest ;bash
sudo pip install -U platformio
platformio run
# Results in
Resolving esp32doit-devkit-v1 dependencies...
Platform Manager: Installing espressif32 @ 2.0.1
UnknownPackageError: Could not find the package with 'espressif32 @ 2.0.1' requirements for your system 'darwin_x86_64'
```

# References 
- https://github.com/justcallmekoko/ESP32Marauder/wiki/installing-firmware-from-source
- https://github.com/justcallmekoko/ESP32Marauder/wiki/cli
- https://github.com/justcallmekoko/ESP32Marauder/wiki/arduino-ide-setup