<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the new SSID from the POST data
    $new_ssid = $_POST['ssid'] ?? '';

    // Check if the SSID is provided
    if (empty($new_ssid)) {
        echo "SSID is required.";
        exit;
    }

    // Path to the hostapd configuration file
    $hostapd_conf_path = '/etc/hostapd.conf';

    // Read the hostapd configuration file
    $config = file($hostapd_conf_path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if ($config === false) {
        echo "Failed to read the configuration file.";
        exit;
    }

    // Edit the SSID line in the configuration file
    $ssid_changed = false;
    foreach ($config as &$line) {
        if (strpos($line, 'ssid=') === 0) {
            $line = 'ssid=' . $new_ssid;
            $ssid_changed = true;
            break;
        }
    }

    // If SSID line is not found, add it
    if (!$ssid_changed) {
        $config[] = 'ssid=' . $new_ssid;
    }

    // Write the modified configuration back to the file
    $result = file_put_contents($hostapd_conf_path, implode(PHP_EOL, $config) . PHP_EOL);

    if ($result === false) {
        echo "Failed to write to the configuration file.";
        exit;
    }

    // Restart the hostapd service to apply changes (requires appropriate permissions)
    exec('sudo systemctl restart hostapd', $output, $return_var);

    if ($return_var !== 0) {
        echo "Failed to restart the hostapd service.";
        exit;
    }

    echo "SSID changed successfully.";
} else {
    echo "Invalid request method.";
}
?>
