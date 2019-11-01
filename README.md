# Beat the Books GraphQL API [![CircleCI](https://circleci.com/gh/Brettm12345/beat-the-books-api.svg?style=svg)](https://circleci.com/gh/Brettm12345/beat-the-books-api) [![codecov](https://codecov.io/gh/Brettm12345/beat-the-books-api/branch/master/graph/badge.svg)](https://codecov.io/gh/Brettm12345/beat-the-books-api) [![Maintainability](https://api.codeclimate.com/v1/badges/ce5e462e454bbb30f2d9/maintainability)](https://codeclimate.com/github/Brettm12345/beat-the-books-api/maintainability)

GraphQL Api for Beat the Books

## How to use

### 1. Download example & install dependencies

Clone the repository:

```
git clone git@github.com:brettm12345/beat-the-books-api.git
```

Install Node dependencies:

```
yarn install
```

### 2. Install the Prisma CLI

To run the example, you need the Prisma CLI. Please install it via NPM or [using another method](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/#installation):

```
yarn global install prisma
```

### 3. Set up database & deploy Prisma datamodel

For this example, you'll use a free _demo database_ (AWS Aurora) hosted in Prisma Cloud. To set up your database, run:

```
prisma deploy
```

Then, follow these steps in the interactive CLI wizard:

1. Select **Demo server**
1. **Authenticate** with Prisma Cloud in your browser (if necessary)
1. Back in your terminal, **confirm all suggested values**

<details>
 <summary>Alternative: Run Prisma locally via Docker</summary>

1. Ensure you have Docker installed on your machine. If not, you can get it from [here](https://store.docker.com/search?offering=community&type=edition).
1. Create `docker-compose.yml` for MySQL (see [here](https://www.prisma.io/docs/prisma-server/database-connector-POSTGRES-jgfr/) for Postgres):
    ```yml
    version: '3'
    services:
      prisma:
        image: prismagraphql/prisma:1.34
        restart: always
        ports:
        - "4466:4466"
        environment:
          PRISMA_CONFIG: |
            port: 4466
            databases:
              default:
                connector: mysql
                host: mysql
                port: 3306
                user: root
                password: prisma
                migrations: true
      mysql:
        image: mysql:5.7
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: prisma
        volumes:
          - mysql:/var/lib/mysql
    volumes:
      mysql:
    ```
1. Run `docker-compose up -d`
1. Set the `endpoint` in `prisma.yml` to `http://localhost:4466`
1. Run `prisma deploy`

</details>

You can now use [Prisma Admin](https://www.prisma.io/docs/prisma-admin/overview-el3e/) to view and edit your data by appending `/_admin` to your Prisma endpoint.

### 4. Start the GraphQL server

Launch your GraphQL server with this command:

```
yarn start
```

Navigate to [http://localhost:4000](http://localhost:4000) in your browser to explore the API of your GraphQL server in a [GraphQL Playground](https://github.com/prisma/graphql-playground).