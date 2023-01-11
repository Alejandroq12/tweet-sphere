<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel


With this project I practiced:
* PHP

* Vue

* Axios

* Javascript

* Composer

* NPM

* HTTP request

Work in progress.... this app is not finished.

--------------------------------------------------------------------------------------------

To run this project:

* 1- PHP: Laravel is built with PHP, so you'll need to have PHP installed on your computer. You can download it from the official PHP website: https://windows.php.net/download/
* 2- Composer: This is a dependency manager for PHP that is used by Laravel. You can download it from the official Composer website: https://getcomposer.org/
* 3- A web server: Laravel is a web framework, so you'll need to have a web server installed on your computer to run the project. You can use Apache or Nginx, or you can use the built-in web server that comes with PHP.

Once you have these installed, you can follow these steps to run the project:


* 1- Open a terminal window and navigate to the root directory of the project.


* 2- Run the command *composer install* to install all of the project's dependencies.


* 3- Run the command *php artisan serve*. This will start the built-in web server and the project will be available at http://localhost:8000/ in your web browser.


If you are facing problem on running the command php artisan serve , ensure that you have set environment variable and other requirements like database connection information is properly set.
Also check the laravel version, if the installed version does not match the project version.
Laravel 9***

-----------------------------------------------------------------------------------

#The Project is also running Vue.js, in addition to the steps I previously outlined, you will also need to have Node.js and npm (Node Package Manager) installed on your computer. These are needed to run and build the Vue.js front-end code.


You can download Node.js and npm from the official Node.js website: https://nodejs.org/en/download/

Once you have Node.js and npm installed, you can run the following commands in the terminal, in the project's root directory, to build and run the Vue.js front-end code:

* 1- *npm install*: This command will install all of the project's front-end dependencies, defined in package.json file.

* 2- *npm run dev*: This command will build the development version of the Vue.js code and bundle it with the Laravel's assets.

* 3- *npm run watch*: This command will start a watcher that will listen for file changes, then rebuild the assets on each change.

You will also need to ensure that the paths to the compiled assets are properly set in the Laravel's blade views or single file components, so that they can be loaded in browser correctly.

And also make sure that the laravel-mix is correctly configured to run vue , incase if you are facing problem on running the above commands.