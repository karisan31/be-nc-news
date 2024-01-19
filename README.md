# Northcoders News API

## Link To Hosted Version

[postgres://djkdzkbx:jAnyosnndRrX2eVaNpST1zu7pqdNk9np@rogue.db.elephantsql.com/djkdzkbx]
[https://backend-recieve-nc-news.onrender.com/]

## Project Summary

This project is the creation of a database called 'nc_news' in which the client can make requests to the server to retreive information such as articles, comments, topics and users. It has implemented features in which the client can retreive data based on article IDs. The client is also able to make post, patch and delete requests to the database. A full breakdown of all features available for this database can be found with the path 'https://backend-recieve-nc-news.onrender.com/api'.

## .env File Information

.env.* files have been added to the .gitignore files to inhibit SQL Injection.

In order to overcome this, create two .env files named .env.test and .env.development

In the .env.test file, write 'PGDATABASE=XXXXX'
In the .env.development file, write 'PGDATABASE=XXXXX'

The names of each database can be found in '/db/setup.sql' and you can replace 'XXXXX' in the lines above with the names of the database.

## Installation Information

1. Clone the repository

    git clone https://github.com/karisan31/be-nc-news

2. Install Dependencies

    npm install

3. Seed Local Database

    npm run seed

4. Run Tests

    npm test

## Minimum Versions Required for this project to run

Node.js (minimum version: v20.8.0)
Postgres (minimum version: 16.1)
