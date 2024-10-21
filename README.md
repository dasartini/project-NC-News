# WELCOME TO The Northcoders Times API
 I am glad that you are reading this. my first project ever made, it's a basic backend-based api that can work in any internet navigator, consisting in building an API that interacts with a PostgreSQL database using node postgress. The API has different http requests that went sent gets different responses or an error.

## Minimun versions:
-Node.js v23.6.2
asdasda
-PostgreSQL 14.11

## Instalation 
 
To correctly connect to the provided database and run this project, it is required to create two separate files. Follow the instructions below:

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


NOTE: this project was developed using Node.j v23.6.2 and PostgreSQL 14.11 therefore this would be a minimun but might not a must requirement.


## LINK 

To run this project in your internet navigator I will invite you to open this link:

----> https://project-nc-news-adrian-sartini.onrender.com/api

NOTE 2:It might take one minute to completely load due to the free version of server that spins down the free instance due inactivity.

You can navigate between the different methods I implemented in the app.js

Just type the endpoint at the end of the link, you can find all the endpoints in the endpoints.json file in the root folder.

example:  https://project-nc-news-adrian-sartini.onrender.com/api/articles/6



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
