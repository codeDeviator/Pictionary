# Pictionary
Simple Pictionary Application built using <a href="https://nodejs.org/en" target="_blank">**node.js**</a>, <a href="https://expressjs.com/" target="_blank"> **express.js**</a>, <a href="https://vuejs.org/" ttarget="_blank">**vue.js** </a>, <a href="https://getbootstrap.com/" target="_blank"> **bootstrap**</a> and <a href="https://socket.io/" ttarget="_blank">**socket.io.js**</a>.


## How To Deploy The Appicaltion 
You can use my **bash script** to deploy this application on your local server.  
<a href="./deploy.sh">Go to deploy.sh</a>

### Instructions  for using the bash script
---
1. You need to download the file by clicking on **Go to deploy.sh**, you will be navigated to depoly.sh file page and then click on icon as shown in the image below.  
<img src="./deploy.png"/>  

2. Open the terminal and navigate to the folder where the file is downloaded using **cd** command.  

3. Now run the command -->   **chmod +x deploy.sh**  
  **Note** --> we need to use this command only one time or when you downloaded depoloy.sh file again.  

4. Now just put this in your terminal -->  **./deploy.sh**  


<br>

## How To Use This Application
### **Homepage**

- Open the browser and navigate to `http://localhost:1234/`.
- The homepage will appear for each user when they enter the URL.

---

### **Starting the Game**

- **Accessing the Homepage:**
  - First user accesses the application homepage via the URL.
  - Subsequent users can access the homepage using the same URL.
- **Start Game Button:**
  - Visible to all users who have joined the homepage.
  - Atleast three users are needed to accessing the homepage,only then start game will appear to everyone.
  - All users clicks on the "Ready" button to start the game.

---

### **Gameplay**
1. **Random Word Selection:**
   - Once all users are ready, a random word is displayed on one choosen user’s homepage.
   - A timer starts counting down from 120 points in all users homepages.
   - The user whose turn it is to draw will be highlighted in the playerlist.

2. **Drawing:**
   - The chosen user can draw in the designated draw area by holding and moving the left mouse button.
   - The drawing will be visible on all users' homepages.

3. **Color Selection:**
   - Choosen user can use the color panel on the right side of the drawing area to select colors.
   - Click a color (e.g., red) to draw in that color.

4. **Erasing:**
   - Choosen user can use the eraser tool (white box labeled "Eraser") to remove parts of the drawing.
   - Chossen clicks on the the eraser white box then hold and move the mouse over the areas you want to erase.

5. **Clearing the Drawing Area:**
   - Choosen user clicks on the "Clear" button on the homepage to erase the entire drawing area.

---

### **Guessing the Word**
- Non-drawing users can enter their guesses into the input box.
- Non-drawing users click on guess button to check if their guess is correct or not.
- **Wrong Guess:**
  - A **"Wrong Guess"** message appears if the guess is incorrect.
- **Correct Guess:**
  - A **"You Won"** message appears, and points are added to:
    - None-Drawing user who guessed correctly.
    - Choosen user whose turn it was to draw.

---

### **Restrictions**
- **Joining During an Active Game:**
  - New users attempting to join during an active game will see an alert: **"A game in progress, please wait for it to complete."**

---

### **Game Over**
- If no user guesses the correct word before the timer reaches zero:**"You Lost, No one guessed the word"** message appears for all users.

---

