# Getting started with the Movement Station
This repository is meant to be a starting point for prototypes for the **Movement Station**. To get started, first make sure you have a copy of this repository on your computer. Also make sure you have a local server running (or set one up with [XAMPP](https://www.apachefriends.org/) or [MAMP](https://www.mamp.info/)). Place the copy of this repository in the document root (folder) of your local server and visit it within your browser.

Sit or stand in front of your camera and move around a bit to check if everything is working. If not, use the Inspector to check for errors and see if you can fix those or contact us on Slack.

There are comments within the code that clarify what is going on. Also, check the Output format down below to see what type of output you're dealing with. We divided the data gathering- which can be a little more complex- and the visual side of the javascript into two files. We suggest you start working in the **app.js** file. If you'd want to change something about how the data is gathered and/or returned, you should do that within the **data.js** file.

## Output format
There is an array of detected persons. For every person, a bunch of data is extracted. Things like **confidence** (that it is indeed a person), the **width** and **height** they take up on the screen, their position on the screen in **x** and **y**, the change in movement as **deltaPos**, the change of size on screen ad **deltaSize** and a couple of others. Console log this data to get a better idea of what these objects look like in total.


## Browser support
This code was tested on Chrome. We suggest you develop in Google Chrome as well. This will avoid browser compatibility issues between projects.