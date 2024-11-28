#!/bin/bash

# Step 1: Update the system
echo "Updating system..."
sudo apt-get update -y

# Step 2: Install curl (needed for nvm installation)
echo "Installing curl..."
sudo apt-get install curl -y

echo "Installing git..."
sudo apt-get install git -y

# Step 3: Install NVM (Node Version Manager)
echo "Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Step 4: Load NVM into the current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This line sources NVM for current session

# Step 5: Install Node.js and npm via NVM
NODE_VERSION="18"  # Set the Node.js version you want to install
echo "Installing Node.js version $NODE_VERSION using NVM..."
nvm install $NODE_VERSION
nvm use $NODE_VERSION
nvm alias default $NODE_VERSION

# Confirm Node.js and npm installation
node -v
npm -v

# Step 6: Search for the repository using 'find'
echo "Searching the system for the repository Linux_Crossword-Puzzle..."
REPO_PATH=$(find / -type d -name "Linux_Crossword-Puzzle" 2>/dev/null)

if [ -z "$REPO_PATH" ]; then
  echo "Repository not found on the system. Cloning the Linux Crossword Puzzle repository..."
  git clone https://github.com/codeDeviator/Linux_Crossword-Puzzle.git
  cd Linux_Crossword-Puzzle
else
  echo "Repository found at: $REPO_PATH"
  cd "$REPO_PATH"
fi


# Step 8: Install project dependencies
echo "Installing project dependencies..."
npm install

# Step 9: Start the application server
echo "Starting the crossword app server..."
npm start &

# Step 10: Display a success message
echo "The Linux crossword app server has started! You can now play the crossword game."
