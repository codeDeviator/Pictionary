#!/bin/bash

# Function to check if Node.js is installed
check_nodejs() {
    if which node > /dev/null 2>&1; then
        # Node.js is installed; show the version
        echo "Node.js is already installed."
        node -v
    else
        # Node.js is not installed; proceed to install
        echo "Node.js is not installed. Installing Node.js..."
        sudo apt update
        sudo apt install -y nodejs npm  # Install Node.js and npm
        echo "Node.js installation completed. Version:"
        node -v  # Display Node.js version after installation
    fi
}

# Function to check if Git is installed
check_git() {
    if which git > /dev/null 2>&1; then
        # Git is installed; show the version
        echo "Git is already installed. Version:"
        git --version
    else
        # Git is not installed; proceed to install
        echo "Git is not installed. Installing Git..."
        sudo apt update
        sudo apt install -y git  # Install Git
        echo "Git installation completed. Version:"
        git --version  # Display Git version after installation
    fi
}

# Function to clone the GitHub repository
clone_repo(){  
    repo_url="https://github.com/coder-shubham-bisht/Pictionary"
    clone_dir="Pictionary"
    # removes the clone_dir if it already exist
    rm -rf "$clone_dir"
    # Cloning the repo from github
    echo "Cloning the repository from $repo_url..."
    git clone "$repo_url"
    # changing working drectory to clone_dir
    cd "$clone_dir"
    # installing all the npm packages
    npm i > /dev/null

    # Terminate any existing instance of node index.js
    if pgrep -f "node index.js" > /dev/null; then
    echo "Stopping the previous instance of node index.js..."
    pkill -f "node index.js"
    sleep 2  # Wait a moment to ensure the process has stopped
    fi

    # executing the index.js file using nodejs
    node index.js &
    # wait a few seconds to allow the server to start
    sleep 5

}

# Function to test application is running or not
check_app(){
    # Check if index.js is running
    if pgrep -f "node index.js" > /dev/null; then
    # Check if the port 3000 is open
    if nc -z localhost 1234; then
    echo "Application is running successfully on port 1234."
    else
    echo "Application failed to start on port 1234."
    fi
    else
    echo "Application failed to start."
    fi
  
}



# to check and install nodejs
check_nodejs

# to check and install git 
check_git

# to clone the github repo  and starts the server
clone_repo

# to application is running or not
check_app
