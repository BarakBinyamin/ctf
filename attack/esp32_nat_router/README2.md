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