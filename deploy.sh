#!/bin/bash

# Function to check if Node.js is installed
check_nodejs() {
    
    echo "checking if nodejs is installed or not ?"

    if which node > /dev/null 2>&1; then
    
        echo "Node.js is already installed."
        echo -n "node version -- " 
        node -v
    else
        echo "Node.js is not installed."
        echo "Installing Node.js..."
        sudo apt update > /dev/null 2>&1
        sudo apt install -y nodejs npm > /dev/null 2>&1
        echo "Node.js installation completed."
        echo -n "node version -- " 
        node -v
    fi
}

# Function to check if Git is installed
check_git() {
    if which git > /dev/null 2>&1; then
        echo "Git is already installed."
        echo -n "git version -- " 
        git --version
    else
        echo "Git is not installed."
        echo "Installing Git..."
        sudo apt update > /dev/null 2>&1
        sudo apt install -y git > /dev/null 2>&1
        echo "Git installation completed."
        echo -n "git version -- " 
        git --version
    fi
}



# Function to clone the GitHub repository
clone_repo(){  
    repo_url="https://github.com/coder-shubham-bisht/Pictionary"
    clone_dir="Pictionary"
    rm -rf "$clone_dir"
    echo "Cloning the repository from $repo_url..."
    git clone "$repo_url" > /dev/null 2>&1
}

# Function to check if a port is busy
check_port() {
    local port=1234
    if lsof -i :"$port" > /dev/null 2>&1; then
        echo "Port $port is already in use. Cannot start the application."
        return 1  # Indicate the port is busy
    else
        echo "Port $port is available."
        return 0  # Indicate the port is free
    fi
}

# Function to start the application
start_app(){
    check_port || exit 1  # Exit if the port is busy
    cd "Pictionary" || { echo "Repository directory not found!"; exit 1; }
    npm i > /dev/null 2>&1
    node index.js &
    sleep 5
}

# Function to test if the application is running
check_app(){ 
    if nc -z localhost 1234; then
        echo "Application is running successfully on port 1234."
    else
        echo "Application failed to start on port 1234."
    fi
}

# Get user input
echo "Select an option:"
echo "1. Full Deploy (Install all the tools, clone repo, start application)"
echo "2. Start Application (dependencies are already installed and repo is cloned)"
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo "Performing Full Deploy..."
        check_nodejs
        check_git
        clone_repo
        start_app
        check_app
        ;;
    2)
        echo "Starting Application..."
        check_nodejs
        check_git
        start_app
        check_app
        ;;
    *)
        echo "Invalid choice. Please run the script again and choose either 1 or 2."
        exit 1
        ;;
esac

