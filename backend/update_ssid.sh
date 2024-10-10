#!/bin/bash

# setup:
# file location: /usr/local/bin/update_ssid.sh
# sudo chown root:root /usr/local/bin/update_ssid.sh
# sudo chmod 755 /usr/local/bin/update_ssid.sh

TEMP_FILE="/tmp/hostapd.conf"
HOSTAPD_CONF="/etc/hostapd/hostapd.conf"

# Copy the temporary file to the hostapd configuration file
cp "$TEMP_FILE" "$HOSTAPD_CONF"

# Restart the hostapd service
systemctl restart hostapd