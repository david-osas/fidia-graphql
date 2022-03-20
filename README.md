# fidia-graphql
This is a basic authentication API. Users can signup, login, receive account verification emails and resend account verification emails.
The API was built using the GraphQL architecture.

## Technological tools used
* TypeScript
* NodeJS
* Yarn
* ExpressJS
* Apollo GraphQL
* MongoDB
* Mongoose
* Mocha
* Chai
* Sinon
* Nodemailer
* Heroku (platform used to deploy the API)

The link to the deployed Heroku application: https://fidia-graphql.herokuapp.com/graphql 

## Getting started
The prerequisite tools needed to be installed locally to use this application are 
* Node
* Git
* yarn

## Running locally
Firstly, clone the repository. To clone the repository run the follwoing commands in your terminal
```
$ git clone https://github.com/david-osas/fidia-graphql.git
$ cd fidia-graphql
$ yarn
```
Create your *.env* file in the root of the project and use the *.env.sample* file as a guide in creating the necessary environmental variables for the application.

You will need a mongoDB URI and nodemailer gmail credentials to run the application.

* To run in development mode, set the NODE_ENV environmental variable to *development* and run the following command in your terminal
```
yarn run dev
```
* To run in production mode, set the NODE_ENV environmental variable to *production* and run the follwoing commands in your terminal
```
yarn run build
yarn run start
```
* To run in test mode, set the NODE_ENV environmental variable to *test* and run the follwoing command in your terminal
```
yarn run test
```
There are 4 unit tests written for the application

After starting the application locally, navigate to the */graphql* endpoint, at the appropriate localhost port, in your browser to view the GraphQL playground.
