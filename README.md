### Yelp Camp

**This project was for learning purposes, while practicing the full-stack web developer bootcamp from Udemy.**

_it is a full-stack web application for consulting and managing a list of campgrounds with rating, pricing, and reviewing options_

**Technologies Used:**

- Express JS

- Html, css, JS (with Bootstrap and EJS templating)

- MongoDB (connected and managed through the Mongoose module)


# YelpCamp Installation Guide
Access deployed version on vercel :

[MyCampsApp](https://mycamp-5nu1fkm0d-abdobahibahibahi-6501s-projects.vercel.app/)

# Application Screenshots: 

## Home Page

<img width="1360" height="768" alt="Capture d’écran (16)" src="https://github.com/user-attachments/assets/734286f6-cce3-43ac-b2e8-3e887a82ca8a" />

## Campground list with map

<img width="1360" height="768" alt="Capture d’écran (19)" src="https://github.com/user-attachments/assets/a287af49-cb5a-4e48-9225-a2694ddf0404" />

## Explore Campground with users preview & Rating

<img width="1360" height="768" alt="Capture d’écran (21)" src="https://github.com/user-attachments/assets/78fa40d1-0cff-47ac-9a69-52ef098f87e5" />



# YelpCamp Installation Guide

This guide explains how to install and run the project on another machine.

---

## 1. Clone the Repository

First, clone the repository from GitHub:

```bash
git clone https://github.com/abdo-bahi/Yelp-camp.git

Navigate into the project directory:

cd yelpcamp
2. Install Dependencies

Install all required packages listed in package.json:

npm install

This command will automatically download and install all dependencies into the node_modules folder.

3. Configure Environment Variables

Create a .env file in the root directory of the project.

Example:

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
DB_URL=mongodb://127.0.0.1:27017/yelp-camp

These variables are required for services like image storage and database connection.

4. Start the Application

Run the server using:
nodemon app.js 
or
node app.js
5. Open the Application

Once the server is running, open your browser and go to:

http://localhost:3000
