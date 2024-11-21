# Pictionary
Simple Pictionary game using node.js, express, vuejs, bootstrap and socket.io


## How To Deploy The Appicaltion 
You can use **bash script** to deploy this application on your local server.  
<a href="./deploy.sh">Go to deploy.sh</a>

### Instruction  for using the bash script
---
1. You need to download the file by clicking on **Go to deploy.sh**, you will be navigated to depoly.sh file page and then click on icon as shown in the image below.  
<img src="./deploy.png"/>  

2. open the terminal and navigate to the folder where the file is downloaded using **cd** command.  

3. Now run the command -->   **chmod +x deploy.sh**  

4. Now just put this in your terminal -->  **./deploy.sh**  


<br>

## How to Use This Application
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
  - Click the "Ready" button to begin the game.

---

#### **Gameplay**
1. **Random Word Selection:**
   - Once all users are ready, a random word is displayed on one user’s homepage.
   - A timer starts counting down from 120 points.
   - The user whose turn it is to draw will be highlighted.

2. **Drawing:**
   - The chosen user can draw in the designated draw area by holding and moving the left mouse button.
   - The drawing will be visible on all users' homepages.

3. **Color Selection:**
   - Use the color panel on the right side of the drawing area to select colors.
   - Click a color (e.g., red) to draw in that color.

4. **Erasing:**
   - Use the eraser tool (white box labeled "Eraser") to remove parts of the drawing.
   - Hold and move the mouse over the areas you want to erase.

5. **Clearing the Drawing Area:**
   - Click the "Clear" button on the homepage to erase the entire drawing area.

---

#### **Guessing the Word**
- Non-drawing users can enter guesses into the input box.
- **Wrong Guess:**
  - A **"Wrong Guess"** message appears if the guess is incorrect.
- **Correct Guess:**
  - A **"You Won"** message appears, and points are added to:
    - The user who guessed correctly.
    - The user whose turn it was to draw.

---

#### **Restrictions**
- **Joining During an Active Game:**
  - New users attempting to join during an active game will see an alert: **"A game in progress, please wait for it to complete."**

---

#### **Game Over**
- If no user guesses the correct word before the timer reaches zero:
  - A **"You Lost, No one guessed the word"** message appears for all users.

---

