# 1upHealth Demo Application

## Description
This is a web application that uses the 1upHealth API to access test patient data. You can do the following:

- Create basic users in this application, which automatically get created in 1upHealth
- Utilize an EHR connection to populate health data for demo users
- View authorized patient information depending on user permissions

## Setup

#### Create your 1up developer application
Follow instructions [here](https://1up.health/docs/start/quick-start-guide) to create a free account, create an application in the DevConsole, and save the Client ID and Client Secret for your application.

#### Clone this repo
```sh
git clone git@github.com:rakesh-pankhania/1up_demo.git
cd 1up_demo
git checkout develop
```

#### Set your .env file
Create a .env file to hold the OAuth client ID and secret supplied from your 1upHealth application.

```
# .env
OAUTH_CLIENT_ID=ID_FROM_1UP
OAUTH_CLIENT_SECRET=SECRET_FROM_1UP
```

#### Install packages
```sh
npm install
```

#### Run server
```sh
node app.js
```


## Tour

## Run the server
We initialize a few in-memory tables that keep track of data:
- Connections table: All EHR connections that a user can pull data from. To keep things simple, there's only one connection.
- Users table: All users that have been created in the 1up user API. We initialize this table with API data when the server is run.

## Visit site
Navigate to http://localhost:3000. You'll see a quick intro of the application and will be directed to the /users page.

## View users
You will see all users that exist in the 1up API. You are also given the option to create new users. The user list is maintained in-memory in the server.

## Choose a user
You can drill down on a user and see what patients they're authorized to see. You can also choose to connect an EHR and pull data.

## See everything about a patient
You can click further into a patient and see all data available for a patient.
