# Babel Fish
https://chatbabelfish.com/

Babel Fish is a social network built around helping language students connect and share their knowledge.

### Development

Babel Fish was built as a project for the course CPSC2030 at Langara College.

### Stack

* [Node.JS](https://nodejs.org/) - Server Language
* [Express](https://expressjs.com/) - Webserver Framework
* [MariaDB](https://mariadb.org/) - Relational Database System
* [Socket.io](https://socket.io/) - Chat Communication Socket
* [PHP](http://www.php.net/) - View Compiler
* [Twig](https://twig.symfony.com/) - View Model
* [jQuery](https://jquery.com/) - Front-End Logic
* [Axios](https://github.com/axios/axios) - Background HTTP Requests
* [Less](http://lesscss.org/) - Styling Pre-Processor

### Development Environment Setup

* Make sure you have Node.JS, PHP and MariaDB Installed.
  You should be able to connect to the database with an administrator account.
```sh
    node -v
    php -v
    mysql -v
```

* Install all dependencies 
```sh
    npm install
```


* Setup the environment variables
```sh
    # HTTP/HTTPS Ports (80 and 443 are default)
    export HTTPPORT=80
    export HTTPSPORT=443
    # Dev Mode (Runs on HTTP)
    export DEV=1
```

* Setup the database
// For root
```sh
npm run setupdb
# Type your root password
```

// For another account
```sh
mysql < ./config/setup.sql -u [username] -p
# Type your account password
```

* Run the server
```sh
npm run start
```

## Author

* **Caue Pinheiro** - [CaueStry](https://github.com/CaueStry)

## License

> This project is licensed under the MIT License - see [LICENSE](LICENSE).
