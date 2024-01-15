# Northcoders News API

.env.* files have been added to the .gitignore files to inhibit SQL Injection.

In order to overcome this, create two .env files named .env.test and .env.development

In the .env.test file, write 'PGDATABASE=XXXXX'
In the .env.development file, write 'PGDATABASE=XXXXX'

The names of each database can be found in '/db/setup.sql' and you can replace 'XXXXX' in the lines above with the names of the database.
