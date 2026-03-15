#!/usr/bin/env bash

set -e

echo "[ EmberMetrics Installer ] Starting installation..."

SERVICE_USER="embermetrics"
INSTALL_DIR="/opt/embermetrics"
SUDO_FILE="/etc/sudoers.d/embermetrics"

# Create system user if it doesn't exist
if ! id "$SERVICE_USER" &>/dev/null; then
    echo "[ Installer ] Creating system user..."
    sudo useradd --system --shell /usr/sbin/nologin --home "$INSTALL_DIR" "$SERVICE_USER"
fi

# Create install directory
echo "[ Installer ] Creating install directory..."
sudo mkdir -p "$INSTALL_DIR"
sudo chown "$SERVICE_USER":"$SERVICE_USER" "$INSTALL_DIR"

# Copy application files
echo "[ Installer ] Copying application..."
sudo cp -r ./metrics-api/* "$INSTALL_DIR"

# Install node dependencies
echo "[ Installer ] Installing dependencies..."
cd "$INSTALL_DIR"
sudo -u "$SERVICE_USER" npm install

# Create restricted sudo rule
echo "[ Installer ] Configuring sudo permissions..."

sudo bash -c "cat > $SUDO_FILE" <<EOF
$SERVICE_USER ALL=(ALL) NOPASSWD: \
/usr/bin/apt, \
/usr/bin/dnf, \
/usr/bin/yum, \
/usr/bin/pacman, \
/usr/bin/zypper, \
/usr/bin/emerge, \
/usr/bin/flatpak
EOF

sudo chmod 440 "$SUDO_FILE"

echo "[ Installer ] Sudo configuration installed at $SUDO_FILE"

# Example systemd service
SERVICE_FILE="/etc/systemd/system/embermetrics.service"

echo "[Installer] Creating systemd service..."

sudo bash -c "cat > $SERVICE_FILE" <<EOF
[Unit]
Description=EmberMetrics Agent
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable embermetrics
sudo systemctl start embermetrics

echo "[ Installer ] EmberMetrics installation complete."
