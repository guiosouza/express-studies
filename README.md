# Express Studies

A project focused on studying and practicing Express.js, a minimalist web framework for Node.js.

## Table of Contents

- [1. Clone the repository](#1-clone-the-repository)
- [2. Install Nodemon (dev dependency only)](#2-install-nodemon-dev-dependency-only)
- [3. Install all dependencies](#3-install-all-dependencies)
- [4. Running the Project](#4-running-the-project)
- [5. Setting up the Database with Docker](#5-setting-up-the-database-with-docker)

## Getting Started


### 1. Clone the repository

If you haven't cloned the repository yet, run:

```bash
git clone git@github.com:guiosouza/express-studies.git
cd express-studies
```
<br>

### 2. Install Nodemon (dev dependency only)

Nodemon is a tool that helps in automatically restarting the server when file changes in the directory are detected. To install Nodemon as a development dependency:

```bash
npm i -D nodemon
```
<br>

### 3. Install all dependencies

To install both production and development dependencies, simply run:

```bash
npm install
```
<br>

### 4. Running the Project

To run the development server using Nodemon:

```bash
npm run start:dev
```

For a normal run (without Nodemon):

```bash
npm start
```
<br>

### 5. Setting up the Database with Docker

To run the database using Docker, ensure that you have Docker and Docker Compose installed on your machine.

<br>

#### 5.1. Start the Database

In the root directory of the project, where the `docker-compose.yml` file is located, run the following command to start the database container:

```bash
docker-compose up -d
```
<br>

#### 5.2. Check if the Database is Running

To ensure that the database container is up and running, use the command:

```bash
docker ps
```

You should see the database container listed.

<br>

#### 5.3. Stop the Database

When you're done working and want to stop the database, use:

```bash
docker-compose down
```

This will stop and remove the containers created by `docker-compose`.
