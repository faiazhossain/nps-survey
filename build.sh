#!/bin/bash

# Configuration
REMOTE_HOST="198.23.217.44"
REMOTE_USER="root"  # Optional: set if different than current user, e.g., "user@nps"
REMOTE_HTML_DIR="/var/www/npsbd.xyz/html"
REMOTE_BACKUP_DIR="/var/www/backup/html"
LOCAL_OUT_DIR="./out"
SSH_KEY="/Users/faiazhossain/documents/faiaz/OfficeProjects/faiaz.pem"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="html_backup_$TIMESTAMP"
ZIP_NAME="deployment_$TIMESTAMP.zip"
TEMP_DIR="./"

# Full remote server address
REMOTE_SERVER="${REMOTE_USER:+$REMOTE_USER@}$REMOTE_HOST"

echo "Starting deployment..."

# Step 1: Create backup of remote html folder
echo "Creating backup of remote $REMOTE_HTML_DIR..."
ssh -i "$SSH_KEY" "$REMOTE_SERVER" "mkdir -p \"$REMOTE_BACKUP_DIR\" && cp -r \"$REMOTE_HTML_DIR\" \"$REMOTE_BACKUP_DIR/$BACKUP_NAME\" && echo 'Backup created: $BACKUP_NAME'"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create backup on remote server."
    exit 1
fi

# Step 2: Create zip file locally
echo "Creating zip file from $LOCAL_OUT_DIR..."
if [ ! -d "$LOCAL_OUT_DIR" ]; then
    echo "❌ Local output directory $LOCAL_OUT_DIR not found."
    exit 1
fi

cd "$LOCAL_OUT_DIR" && zip -r "../$ZIP_NAME" . && cd - > /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Failed to create zip file."
    exit 1
fi

echo "✅ Zip file created: $ZIP_NAME"

# Step 3: Transfer zip file to remote server
echo "Transferring zip file to remote server..."
scp -i "$SSH_KEY" "$ZIP_NAME" "$REMOTE_SERVER:$TEMP_DIR/$ZIP_NAME"

if [ $? -ne 0 ]; then
    echo "❌ Failed to transfer zip file."
    # Clean up local zip file
    rm -f "$ZIP_NAME"
    exit 1
fi

# Step 4: Unzip and deploy on remote server
echo "Unzipping and deploying on remote server..."
ssh -i "$SSH_KEY" "$REMOTE_SERVER" "
    mkdir -p \"$TEMP_DIR\" &&
    cd \"$TEMP_DIR\" &&
    unzip -o \"$ZIP_NAME\" &&
    rm -rf \"$REMOTE_HTML_DIR\"/* &&
    cp -r . \"$REMOTE_HTML_DIR/\" &&
    rm -f \"$ZIP_NAME\" &&
    cd - > /dev/null &&
    echo 'Files extracted and deployed successfully'
"

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed. Reverting is recommended."
    # Clean up local zip file
    rm -f "$ZIP_NAME"
    exit 1
fi

# Step 5: Clean up local zip file
rm -f "$ZIP_NAME"

echo "✅ Deployment completed successfully!"
echo "   Backup saved as: $REMOTE_BACKUP_DIR/$BACKUP_NAME"
echo "   Deployed from zip: $ZIP_NAME"