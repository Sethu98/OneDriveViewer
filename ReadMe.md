### Introduction

ODViewer is a NodeJs + React application that can show files from One Drive.
This is developed as a take home challenge and is hence a simple viewer.
The features are listed below:
* Login to Microsoft with Oauth 2.0
* View the files and folders in the root of the default drive
* Download any file from the list
* View who the files are shared with
* Files list and sharing information is updated without page refresh (using SSE and Webhook)

I wasn't able to implement viewing files nested within folders due to the time constraint.

### How is it done
* ExpressJS + React
* Microsoft Graph API for interacting with One Drive
* OAuth 2.0 for AAA
* Webhook to get updates whenever something in the drive changes


### Prerequisites

* Install [node](https://nodejs.org/en/download)
* Install [ngrok](https://ngrok.com/download)
  * For ngrok, you need to create a free account and get the authtoken from the account
  * Ngrok is required to get webhook calls into localhost. It exposes localhost to the outside world.

### How to run

* Run `npm install && cd front-end && npm install && cd ..`
* Run `npm start` in project home
* Run `cd front_end && npm start` in a **separate terminal**
* Run `ngrok http http://localhost:3000` in a **separate terminal**
* Navigate to `http://localhost:3003/`

### How to use
* Once you navigate to `http://localhost:3003/`, you'll see a welcome screen
* From the link in the screen, proceed to login to your microsoft account
* After login, you'll be redirected to the files view screen
* Here you can download/view permissions for the files at the root of your drive