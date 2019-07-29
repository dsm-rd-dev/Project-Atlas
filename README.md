# Introduction 
A central API to combine all other services into a simple interface

# Getting Started

## Install
```
npm install
```

# Configure
## /config/config.js
```
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

## .env
```
PORT=3000
NODE_ENV=development

## Connectwise API Config
cwApiusr=
cwApipwd=
```

# Build and Test
## Run in development mode
```
npm run dev
```
