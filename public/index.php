<?php

/**
* Front controller
*/

ini_set('session.cookie_lifetime', '864000'); // ten days in seconds
/**
* Composer
*/
require_once dirname(__DIR__).'/vendor/autoload.php';

/**
* Error and Exception handling
*/
error_reporting(E_ALL);
set_error_handler('Core\Error::errorHandler');
set_exception_handler('Core\Error::exceptionHandler');

/**
 * Sessions
 */
session_start();

/**
* Routing
*/
//require '../Core/Router.php';

$router = new Core\Router();

//Add the routes
$router->add('', ['controller' => 'Home', 'action' => 'index']);
$router->add('login', ['controller' => 'Login', 'action' => 'new']);
$router->add('logout', ['controller' => 'Login', 'action' => 'destroy']);
$router->add('register', ['controller' => 'Signup', 'action' => 'new']);
$router->add('password/reset/{token:[\da-f]+}', ['controller' => 'Password', 'action' => 'reset']);
$router->add('signup/activate/{token:[\da-f]+}', ['controller' => 'Signup', 'action' => 'activate']);
$router->add('{controller}/{action}');

$router->dispatch($_SERVER['QUERY_STRING']);
