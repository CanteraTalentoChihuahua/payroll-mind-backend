# Payroll MIND Backend

The server side of an app to manage expenses and employee's salaries.

## Pre-requisites

To run the API you need the following:
- Node.js (Version 16 recommended)
- npm (Version 8 recommended)
- A PostgreSQL instance
- A SMTP server

## Installation

### Installing dependencies

First, install the dependencies for the project. You can do this by running the command `npm install`.

### Environment variables

You will need to give the API all of the credentials for the required services. Check the [.env.example](https://github.com/CanteraTalentoChihuahua/payroll-mind-backend/blob/main/.env.example) file to see what you need.

### Running the server (Production)

With your environment variables ready, you can start the API by running the commands:

```
npm run build
npm run start
```

### Running the server (Development)

The command `npm run dev` runs the server with some environment configurations that allow you to use, for example, a local PostgreSQL instance.

If you use [Visual Studio Code](https://code.visualstudio.com), the project contains debugging configurations to aid during development.

## Documentation

Want to see what the API can do without diving into code? Check out the OpenAPI documentation included in the server by typing `/docs` on wherever you have hosted the project. We have listed all endpoints with a description and some example requests.

## Authors

- **Abraham González** - [abrahamgmacias](https://github.com/abrahamgmacias)
- **Brandom Rodríguez** - [BrandomRobor](https://github.com/BrandomRobor)
- **Ricardo Cereceres** - [el-richo](https://github.com/el-richo)

## License

This project is licensed under the [MIT License](https://github.com/CanteraTalentoChihuahua/payroll-mind-backend/blob/main/LICENSE).

## Made with

- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [express](https://expressjs.com)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Nodemailer](https://nodemailer.com/about)
- [Sequelize](https://sequelize.org)
- [OpenAPI](https://www.openapis.org)
- [Typescript](https://www.typescriptlang.org)
