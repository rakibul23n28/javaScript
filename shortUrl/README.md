
# Requirements

You need to have installed [Node.js](https://nodejs.org/es/download/),[mongobd community server](https://www.mongodb.com/try/download/community).


# Set up

Go to the project folder and run

```sh
$ npm install
```

And run your server running the following command in the root of the project:

```sh
$ npm run dev
```

Start the Tailwind CLI build process

Run the CLI tool to scan your template files for classes and build your CSS.:

```sh
$ npm run devcss
```

For accessing admin page you need to do update a user role NORMAL TO ADMIN:

follow the process--

go cmd/terminal

activate mongodb-

```sh
$ mongosh
```

use database-

```sh
$ use shortUrl
```

update you user register user role NORMAL TO ADMIN-

```sh
$ db.users.updateOne({email:'yourEmail@example.com'},{$set:{role:"ADMIN"}}) 
```
