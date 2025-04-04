# Client Code

This directory contains the client/frontend source code. 

## Necessary Installations
1) We need to install node.js which serves as our JavaScript runtime engine (i.e. this will allow us to run JavaScript files in our command-line terminal instead of only in the browser). It will also include npm which is going to be the package manager we're using (or if you prefer yarn, that comes included too). Install the LTS version via: https://nodejs.org/en
2) Install npm globally by going to your terminal and executing the command: **npm install -g npm**. To check that you have installed npm, and node correctly, execute **node -v** and **npm -v**. If you see a number, hooray, you got it!
3) We also need to install android studio so we can see how our app changes as we make changes to our codebase (i.e. our emulator for an android phone). We can alternatively use our own phone to develop if you want but I personally find it easier to look at my at my computer screen instead of my phone when developing. Another option is using the web (if you're more familiar with web development) to see the changes.
The link to the download can be found here: https://developer.android.com/studio
4) Our handy dandy code studio editor. I prefer VSCode but you can use anything you want (Atom, Sublime, etc...). Download link for VSCode: https://code.visualstudio.com/


## Running the app

Now for the exciting part, running the app!

First, enter the command **npm install** to install all the required dependencies, in particular Expo.

To run the app, go to your terminal in your code editor (preferably using git bash or something similar). Enter the command **npm start**

This runs the app in development mode (you can check the details of what that command does by going into the package.json file).

You should now see something like this in your terminal:

![image](https://github.com/user-attachments/assets/b6962a55-37a5-4298-b61c-790557048fb7)

You can either scan the QR code (download the EXPO app on the Apple Store/Google Play Store) if you want to see the changes live on your phone or use the emulator (which I prefer).

To set up the emulator, open up Android Studio and you should see the following:

![image](https://user-images.githubusercontent.com/97481912/229945190-c91a2a11-4e65-4bc0-b6dc-b2969c29eac9.png)

Click More Actions >> Virtual Device Manager

![image](https://user-images.githubusercontent.com/97481912/229945225-68aaa5fc-622b-427d-8928-d0967e06c679.png)

Click on Create device (if this is the first time you're using this, you shouldn't see any other emulators. 

![image](https://github.com/user-attachments/assets/7ca4d018-25d3-44c2-ba2b-7d82739721e7)

Choose a device (any will work but preferably one with the Google Play Icon) - I chose Pixel 4.

![image](https://user-images.githubusercontent.com/97481912/229945426-e41d7c04-3633-4b35-ab73-be0dd865b26c.png)

Click Next and select a System Image (I just downloaded UpsideDownCake and used that) and click Next.

![image](https://user-images.githubusercontent.com/97481912/229945540-0064241e-4ae8-4644-9eb3-1a1bfb620541.png)

Change the name if you want and click Finish.

If the emulator does not automatically open, just click the play button in the Create Device screen on your emulator and it should boot up.

![image](https://github.com/user-attachments/assets/1d1c842a-361a-4256-bf96-9e1f8cde09c2)

Once your emulator boots up you can close the android studio app.

Now back to the terminal, If you don't already have your app in development mode from earlier, just run **npm start** again. Once your in this page, press "a" to open Android and give it some time to bundle.

Once completed, you should see the app live on your emulator. Something like this on your screen.

![image](https://github.com/user-attachments/assets/400853d0-a5f9-47fc-98c9-da0f5696ec57)

Make changes to the relevant files and you'll see your changes.

If you want to refresh your page you can just type "r" in the terminal in development mode or just restart the entire thing again. (Crtl + C, **npm start** + a). If your emulator is not reflecting the changes, you can just restart your emulator. The emulator should have hot module replacement so any changes you make and save (Ctrl + S) should automatically be reflected in the app.

If any of these steps do not work, just shoot me a discord message or smth.
