# Karisan's News API

## Project Summary

This project is the creation of a RESTful API which serves as the backend to my website [https://kari-nc-news.netlify.app/]. This API will allow the client to make requests to the server to retreive information such as articles, comments, topics and users. It has implemented features such as filtering articles via date, votes and comment count. The client is also able to make post, patch and delete requests to the database.

## Technology Stack

This API was built using Node.js, Express.js for the server and PostgreSQL for the database. Development tools in this project include Husky, Nodemon, Supertest, Jest, Jest-Sorted and Pg-Format.

## Link To Hosted Version [https://backend-recieve-nc-news.onrender.com/api]

## Installation Requirements

- Node.js (minimum version: v19.x)
- PostgreSQL (minimum version: v14.x)

## Cloning the Repository

- In the terminal, please enter:

```
git clone https://github.com/karisan31/be-nc-news
```

```
cd be-nc-news
```

## Installing Dependencies

- The required dependencies can be installed from the package.json file using the following command:

```
npm install
```

## Accessing the Databases

`.env.\*` files have been added to the .gitignore files to inhibit SQL Injection.

In order to connect to the test and development databases, create two `.env` files named `.env.test` and `.env.development`.

In the `.env.test` file, write `PGDATABASE=XXXXX`.
In the `.env.development` file, write `PGDATABASE=XXXXX`.

The names of each database can be found in `/db/setup.sql` and you can replace 'XXXXX' in the lines above with the names of the database.

## Database Setup and Seeding

- Before using or testing the API, you will need to set up the database and seed all of its data. This can be done using the following commands:

```
npm run setup-dbs
```

```
npm run seed
```

## Testing

- This API uses Jest to ensure it works as expected and testing can be run using the following command:

```
npm run test
```

- The test database will be automatically reseeded before every test to ensure consistency of all tests, especially as some tests make changes to the information inside the database using CRUD.

## Development Mode

- To run the application in development mode, please enter the following command:

```
node app.listen.js
```

- This will start a server and allow you to make requests to your localhost on the specified ports using the accessible endpoints presented.
