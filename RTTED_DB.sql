CREATE DATABASE rttedDb;
USE rttedDb;
CREATE TABLE users( 
id int AUTO_INCREMENT PRIMARY KEY, 
firstname varchar(100) NOT NULL, 
lastname varchar(100) NOT NULL,
username varchar(100) UNIQUE NOT NULL,
emailaddress varchar(100) UNIQUE NOT NULL,
password varchar(100) NOT NULL,
created_at TIMESTAMP DEFAULT NOW() 
)