<?php
    $host = 'mysql';  // Docker service name
    $username = 'auction_user';
    $password = 'auctionpass';
    $dbname = 'auction_db';

    $conn = null;
    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
        exit;
    }
?>