<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_ssid = $_POST['ssid'] ?? '';

    if (empty($new_ssid)) {
        echo "SSID is required.";
        exit;
    }

    $hostapd_conf_path = '/etc/hostapd/hostapd.conf';
    $temp_file = '/tmp/hostapd.conf';

    $config = file($hostapd_conf_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($config === false) {
        echo "Failed to read the configuration file.";
        exit;
    }

    $ssid_changed = false;
    foreach ($config as &$line) {
        if (strpos($line, 'ssid=') === 0) {
            $line = 'ssid=' . $new_ssid;
            $ssid_changed = true;
            break;
        }
    }

    if (!$ssid_changed) {
        $config[] = 'ssid=' . $new_ssid;
    }

    if (file_put_contents($temp_file, implode(PHP_EOL, $config) . PHP_EOL) === false) {
        echo "Failed to write to the temporary file.";
        exit;
    }

    // Execute the shell script to update the configuration and restart hostapd
    exec('/usr/local/bin/update_ssid.sh', $output, $return_var);
    if ($return_var !== 0) {
        echo "Failed to apply the new configuration.";
        exit;
    }

    echo "SSID changed successfully.";
} else {
    echo "Invalid request method.";
}
