# CTF-Solution
One possible solution to this ctf

# Approach
1. Find the IOT device on the network
2. Investigate network traffic and find that it is updating every 10 minutes using a spefic URL
3. Luanch a man in the middle attack, launching a malicous wireless access point to spoof the IOT device into connecting to it. Route any request for a new software image to a malicous image

# Man in the middle attack

