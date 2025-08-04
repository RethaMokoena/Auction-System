CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Surname VARCHAR(255) NOT NULL,
    EmailAddress VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    apiKey VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Auction (
    auctionid VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    parking_spaces INT NOT NULL,
    amenities TEXT NOT NULL,
    short_description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    state ENUM('Waiting', 'Active', 'Closed') DEFAULT 'Waiting',
    buyer VARCHAR(255) NULL,
    user_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS newtable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    Auctionid VARCHAR(255) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Auctionid) REFERENCES Auction(auctionid),
    FOREIGN KEY (userid) REFERENCES Users(id)
);