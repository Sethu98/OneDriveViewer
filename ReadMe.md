# OneDrive Viewer
### Introduction

ODViewer is a NodeJs + React application that can show files from One Drive.
This is developed as a take home challenge and is hence a simple viewer.
The features are listed below:
* Login to Microsoft with Oauth 2.0
* View the files and folders in the root of the default drive
* Download any file from the list
* View who the files are shared with
* Files list and sharing information is updated without page refresh (using SSE and Webhook)

Demo Videos can be viewed or downloaded from [here](https://drive.google.com/drive/folders/1rET6uiuSYdIEZs_OJBRQzV6SvIRBJzQp?usp=sharing)

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

Do the following steps in order

* Run `npm install && cd front-end && npm install && cd ..`
* Run `sh start_ngrok.sh` in a **separate terminal**
  * Copy the exposed address from the output
  * It should look something like `https://808d-130-245-192-1.ngrok-free.app`
  * Paste it in the env file `project_home/.env` as the value of `EXPOSED_URL`
  * Note: This step must be repeated if the ngrok command is terminated and restarted
* Run `npm start` in project home
* Run `cd front_end && npm start` in a **separate terminal**
* Navigate to `http://localhost:3003/`

### How to use
* Once you navigate to `http://localhost:3003/`, you'll see a welcome screen
* From the link in the screen, proceed to login to your microsoft account
* After login, you'll be redirected to the files view screen
* Here you can download/view permissions for the files at the root of your drive

### Using without webhook
Webhook receipt may not have millisecond latency. To have real time updates, I have version that just polls on certain intervals.
This would be inefficient but fast. To use this, set `USE_WEBHOOK="false"` in `project_home/.env`.
Changes will be reflected much faster, but this is not the ideal approach.
