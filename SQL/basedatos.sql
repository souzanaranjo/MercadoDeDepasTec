CREATE DATABASE mercadodepastec2;

USE mercadodepastec2;

CREATE TABLE users(
    email VARCHAR(40) NOT NULL,
    fName VARCHAR(30) NOT NULL,
    lName VARCHAR(30) NOT NULL,
    phone VARCHAR(10) NOT NULL,
    passwrd VARCHAR(30) NOT NULL,
    image VARCHAR(255) NOT NULL,
    gender VARCHAR(1) NOT NULL,
    minWillingToPay INT,
    maxWillingToPay INT,
    PRIMARY KEY(email)
);

CREATE TABLE properties(
	id_property int NOT NULL AUTO_INCREMENT,
    iPrice int NOT NULL,
    iRooms int NOT NULL,
    iBathrooms int NOT NULL,
    id_owner VARCHAR(40) NOT NULL,
    sDescripcion VARCHAR(1000) NOT NULL,
    chType VARCHAR(1) NOT NULL,
    iContractTime int NOT NULL,
    sServices VARCHAR(7) NOT NULL,
    iDistance int NOT NULL,
    bFurniture VARCHAR(1) NOT NULL,
    iParking int NOT NULL,
    bPets VARCHAR(1) NOT NULL,
    location VARCHAR(150) NOT NULL,
    latitude FLOAT(10,6),
    longitude FLOAT(10,6),
    PRIMARY KEY(id_property),
    FOREIGN KEY(id_owner) REFERENCES users(email)
);

CREATE TABLE photos(
	id_photo int NOT NULL AUTO_INCREMENT,
	image VARCHAR(255) NOT NULL,
	sDescripcion VARCHAR(100) NOT NULL,
	id_property int NOT NULL,
	PRIMARY KEY(id_photo),
	FOREIGN KEY(id_property) REFERENCES properties(id_property)
);

CREATE TABLE is_favorite_of(
	id_user VARCHAR(40) NOT NULL,
	id_property int NOT NULL,
	PRIMARY KEY(id_user,id_property),
	FOREIGN KEY(id_user) REFERENCES users(email),
	FOREIGN KEY(id_property) REFERENCES properties(id_property)
);

CREATE TABLE reviews(
	id_review int NOT NULL AUTO_INCREMENT,
	texto VARCHAR (500) NOT NULL,
	id_user VARCHAR(40) NOT NULL,
	id_user_calificador VARCHAR(40) NOT NULL,
	limpieza int NOT NULL,
	amabilidad int NOT NULL,
	responsabilidad  int NOT NULL,
	fiestero int NOT NULL,
	PRIMARY KEY(id_review),
	FOREIGN KEY(id_user) REFERENCES users(email),
	FOREIGN KEY(id_user_calificador) REFERENCES users(email)
);