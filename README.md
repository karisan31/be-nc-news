# Northcoders News API

.env.* files have been added to the .gitignore files to inhibit SQL Injection.

In order to overcome this, create two .env files named .env.test and .env.development

In the .env.test file, write 'PGDATABASE=nc_news_test'

In the .env.development file, write 'PGDATABASE=nc_news'
