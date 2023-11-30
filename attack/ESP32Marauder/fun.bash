#!/bin/bash

# Somefun cmds to send to the marauder
crashios17="sourapple"
rickroll="attack -t rickroll"
stopCmd="stopscan"
scanAccessPoints="scanap"
listDevicesAndAccessPoint="list -c"
selectStationToTarget="select -c 0,3"
selctionApToTarget="select -a 10"
targetedDeauth="attack -t deauth -c"
generalDeauth="attack -t deauth"

# cat /dev/tty.usbserial-0001
# echo -e "attack -t rickroll" > /dev/tty.usbserial-0001
# cat /dev/cu.usbmodem411 & cat > /dev/cu.usbmodem411

#echo "attack -t rickroll\r" | screen /dev/tty.usbserial-0001 111520 && exit

stty -f /dev/tty.usbserial-0001 115200
echo "attack -t rickroll\r" > /dev/tty.usbserial-0001 
exit