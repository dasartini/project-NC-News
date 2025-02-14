# WELCOME TO The Northcoders Times API
My first project ever made, it's a REST API created using technologies such as JavaScript with Express framework and PSQL as a database.

The API has different HTTP requests (GET, POST, DELETE, PATCH) to access to data using any program.

## Minimum versions:
-Node.js v23.6.2

-PostgreSQL 14.11

## Installation 
 
To correctly connect to the provided database and run this project, it is required to create two separate files.

Follow the instructions below:

1. Clone the repository:
   ```bash
   git clone https://github.com/dasartini/project-NC-News.git
   ```
2. Navigate to the project directory:
   ```bash
   cd project-NC-News
   ```

3. In the root folder create a file named ".env.developement" connecting the PGDATABASE to the develpoment database in setup.sql, just paste this text in this variable.
   ```bash
   PGDATABASE=nc_news
   ```

4. In the root folder create a file named ".env.test" connecting the PGDATABASE to the test database in setup.sql, just paste this text in this variable.
   ```bash
   PGDATABASE=nc_news_test
   ```

5. Install dependencies:
   ```bash
   npm install
   ```
6. Set up the database:
   ```bash
   npm run setup-dbs
   ```

7. Seed the database:
   ```bash
   npm run seed
   ```

8. To run the tests locally, run:
   ```bash
   npm run test
   ```
   This will run the test suite and provide all the results.


NOTE 1: This project was developed using Node.j v23.6.2 and PostgreSQL 14.11 therefore this would be a minimum but is not a requirement.


## LINK 

To run this project in your browser I invite you to open this link:

----> https://project-nc-news-adrian-sartini.onrender.com/api

NOTE 2: It might take one minute to completely load due to the free service where the project is hosted.

You can navigate between the different methods I implemented in the app.js file.

Just type the endpoint at the end of the link, you can find all the endpoints in the endpoints.json file in the root folder.

## Example: 

```bash
https://project-nc-news-adrian-sartini.onrender.com/api/articles/6
```
