<?php
    include("config.php");
    header('Content-Type: application/json');
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
    class API
    {
        private static $instance;

        private function __construct()
        {
        }

        public static function getInstance()
        {
            if (!isset(self::$instance)) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        private function generateUniqueApiKey($length = 15)
        {
            // Generate a unique alpha-numeric API key
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $apiKey = '';
            $maxIndex = strlen($characters) - 1;
            for ($i = 0; $i < $length; $i++) {
                $apiKey .= $characters[random_int(0, $maxIndex)];
            }
            return $apiKey;
        }

        public function registration($postData)
        {
            // Validate post data
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';

            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);
            $name = $this->validate_input($postData['name']);
            $surname = $this->validate_input($postData['surname']);
            $email = $this->validate_input($postData['email']);
            $password = $this->validate_input($postData['password']);
            $salt = 'CA04S5u8MczFw8qTAAAB';
            $passwordWithSalt = $password . $salt;
            $sha256Hash = hash('sha256', $passwordWithSalt);
            $apiKey = $this->generateUniqueApiKey();
            // Prepare SQL statement to insert user data into the database
            $stmt = $conn->prepare("INSERT INTO Users (Name, Surname, EmailAddress, Password, apiKey) VALUES (?, ?, ?, ?, ? )");
            $stmt->bindParam(1, $name);
            $stmt->bindParam(2, $surname);
            $stmt->bindParam(3, $email);
            $stmt->bindParam(4, $sha256Hash);
            $stmt->bindParam(5, $apiKey);
            $stmt->execute();

            $timestamp = time();
            if ($stmt->rowCount() > 0) {
                // Registration successful
                return [
                    'status' => 'success',
                    'timestamp' => $timestamp,
                    'data' => [
                        'apikey' => $apiKey
                    ]
                ];
            } else {
                // Registration failed
                return ['status' => 'error', 'message' => 'Failed to register user'];
            }
        }

        public function login($postData)
        {
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);

            $name = $this->validate_input($postData['Name']);
            $stmt = $conn->prepare("SELECT * FROM Users WHERE Name = ?");
            $stmt->bindParam(1, $name);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($result) > 0) {
                $password = $this->validate_input($postData['Password']);
                $salt = 'CA04S5u8MczFw8qTAAAB';
                $passwordWithSalt = $password . $salt;
                $sha256Hash = hash('sha256', $passwordWithSalt);
                $timestamp = time();

                foreach ($result as $row) {
                    if ($row['Password'] === $sha256Hash) {
                        return [
                            'status' => 'success',
                            'timestamp' => $timestamp,
                            'data' => [
                                'username' => $row['Name'],
                                'id' => $row['id']
                            ]
                        ];
                    }
                }
                return ['status' => 'error', 'message' => 'Invalid password'];
            } else {
                return ['status' => 'error', 'message' => 'Invalid username', 'username' => $postData['name']];
            }
        }

        public function createAuction($postData)
        {

            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);

            $auctionid = $this->validate_input($postData['auctionid']);
            $name = $this->validate_input($postData['auctionnameValue']);
            $start_date = $this->validate_input($postData['start_date']);
            $end_date = $this->validate_input($postData['end_date']);
            $title = $this->validate_input($postData['title']);
            $price = $this->validate_input($postData['price']);
            $location = $this->validate_input($postData['location']);
            $bedrooms = $this->validate_input($postData['bedrooms']);
            $bathrooms = $this->validate_input($postData['bathrooms']);
            $parking_spaces = $this->validate_input($postData['parking_spaces']);
            $amenities = $this->validate_input($postData['amenities']);
            $short_description = $this->validate_input($postData['short_description']);
            $image = $this->validate_input($postData['image']);
            $state = 'Waiting';
            $buyer = null;
            $user_id = $this->validate_input($postData['id']);

            $sql = "INSERT INTO Auction(auctionid, name, start_date, end_date, title, price, location, bedrooms, bathrooms, parking_spaces, amenities, short_description, image, state, buyer, user_id) VALUES (:auctionid, :name, :start_date, :end_date, :title, :price, :location, :bedrooms, :bathrooms, :parking_spaces, :amenities, :short_description, :image, :state, :buyer, :user_id)";
            // Prepare the statement
            $stmt = $conn->prepare($sql);
            // Bind parameters
            $stmt->bindParam(':auctionid', $auctionid);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':start_date', $start_date);
            $stmt->bindParam(':end_date', $end_date);
            $stmt->bindParam(':title', $title);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':location', $location);
            $stmt->bindParam(':bedrooms', $bedrooms);
            $stmt->bindParam(':bathrooms', $bathrooms);
            $stmt->bindParam(':parking_spaces', $parking_spaces);
            $stmt->bindParam(':amenities', $amenities);
            $stmt->bindParam(':short_description', $short_description);
            $stmt->bindParam(':image', $image);
            $stmt->bindParam(':state', $state);
            $stmt->bindParam(':buyer', $buyer);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();

            $errorInfo = $stmt->errorInfo();
            if ($errorInfo[0] !== '00000') {
                echo "Error: " . $errorInfo[2];
            }

            $timestamp = time();
            if ($stmt->rowCount() > 0) {
                return [
                    'status' => 'success',
                    'timestamp' => $timestamp,
                    'data' => [
                        'auctionid' => $auctionid
                    ]
                ];
            } else {
                return ['status' => 'error', 'message' => 'Failed to createAuction'];
            }
        }

        public function updateAuction($postData)
        {
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);

            $auctionid = $this->validate_input($postData['auctionid']);
            $fieldsToUpdate = [];

            if ($auctionid) {
                if (isset($postData['auctionnameValue'])) {
                    $fieldsToUpdate['name'] = $this->validate_input($postData['auctionnameValue']);
                }
                if (isset($postData['start_date'])) {
                    $fieldsToUpdate['start_date'] = $this->validate_input($postData['start_date']);
                }
                if (isset($postData['end_date'])) {
                    $fieldsToUpdate['end_date'] = $this->validate_input($postData['end_date']);
                }
                if (isset($postData['title'])) {
                    $fieldsToUpdate['title'] = $this->validate_input($postData['title']);
                }
                if (isset($postData['price'])) {
                    $fieldsToUpdate['price'] = $this->validate_input($postData['price']);
                }
                if (isset($postData['location'])) {
                    $fieldsToUpdate['location'] = $this->validate_input($postData['location']);
                }
                if (isset($postData['bedrooms'])) {
                    $fieldsToUpdate['bedrooms'] = $this->validate_input($postData['bedrooms']);
                }
                if (isset($postData['bathrooms'])) {
                    $fieldsToUpdate['bathrooms'] = $this->validate_input($postData['bathrooms']);
                }
                if (isset($postData['parking_spaces'])) {
                    $fieldsToUpdate['parking_spaces'] = $this->validate_input($postData['parking_spaces']);
                }
                if (isset($postData['amenities'])) {
                    $fieldsToUpdate['amenities'] = $this->validate_input($postData['amenities']);
                }
                if (isset($postData['short_description'])) {
                    $fieldsToUpdate['short_description'] = $this->validate_input($postData['short_description']);
                }
                if (isset($postData['image'])) {
                    $fieldsToUpdate['image'] = $this->validate_input($postData['image']);
                }
                if (isset($postData['state'])) {
                    $fieldsToUpdate['state'] = $this->validate_input($postData['state']);
                }
                if (isset($postData['buyer'])) {
                    $fieldsToUpdate['buyer'] = $this->validate_input($postData['buyer']);
                }
                if (isset($postData['id'])) {
                    $fieldsToUpdate['user_id'] = $this->validate_input($postData['id']);
                }
            
                if (!empty($fieldsToUpdate)) {
                    $query = "UPDATE Auction SET ";
                    $queryParts = [];
                    foreach ($fieldsToUpdate as $field => $value) {
                        $queryParts[] = "$field = :$field";
                    }
                    $query .= implode(", ", $queryParts);
                    $query .= " WHERE auctionid = :auctionid";
                    
                    $stmt = $conn->prepare($query);
        
                    foreach ($fieldsToUpdate as $field => $value) {
                        $stmt->bindValue(":$field", $value);
                    }
                    $stmt->bindValue(':auctionid', $auctionid);
        
                    $timestamp = time();
                    if ($stmt->execute()) {
                        return [
                            'status' => 'success',
                            'timestamp' => $timestamp,
                            'data' => [
                                'auctionid' => $auctionid
                            ]
                        ];
                    } else {
                        $errorInfo = $stmt->errorInfo();
                        if ($errorInfo[0] !== '00000') {
                            echo "Error: " . $errorInfo[2];
                        }
                        return ['status' => 'error', 'message' => 'Failed to update'];
                    }
                } else {
                    return ['status' => 'error', 'message' => 'No fields to update'];
                }
            } else {
                return ['status' => 'error', 'message' => 'Missing auctionid'];
            }
        }
        public function getAuction()
        {
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);

            $sql = "SELECT * FROM Auction";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }

        function joinAuction($postData) {
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $dbname = 'u23815087_homework';
            
            // Create connection
            $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $userid = $this->validate_input($postData['userid']);
            $Auctionid = $this->validate_input($postData['Auctionid']);
            $price = 0;

            $stmt = $conn->prepare("INSERT INTO newtable (userid, Auctionid, Price) VALUES (:userid, :Auctionid, :price)");

            $stmt->bindValue(':userid', $userid);
            $stmt->bindValue(':Auctionid', $Auctionid);
            $stmt->bindValue(':price', $price);

            $timestamp = time();
            if ($stmt->execute()) {
                return [
                    'status' => 'success',
                    'timestamp' => $timestamp,
                    'data' => [
                        'auctionid' => $Auctionid
                    ]
                ];
            } else {
                $errorInfo = $stmt->errorInfo();
                if ($errorInfo[0] !== '00000') {
                    echo "Error: " . $errorInfo[2];
                }
                return ['status' => 'error', 'message' => 'Failed to Update'];
            }
        }

        function joinAuctionUpdate($postData) {

            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $dbname = 'u23815087_homework';
            
            // Create connection
            $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $userid = $this->validate_input($postData['userid']);
            $Auctionid = $this->validate_input($postData['Auctionid']);
            $price = $this->validate_input($postData['Price']);

            $stmt = $conn->prepare("UPDATE newtable SET Price = :price WHERE userid = :userid AND Auctionid = :Auctionid");
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':userid', $userid);
            $stmt->bindParam(':Auctionid', $Auctionid);

            $timestamp = time();
            if ($stmt->execute()) {
                return [
                    'status' => 'success',
                    'timestamp' => $timestamp,
                    'data' => [
                        'auctionid' => $Auctionid,
                    ]
                ];
            } else {
                $errorInfo = $stmt->errorInfo();
                if ($errorInfo[0] !== '00000') {
                    echo "Error: " . $errorInfo[2];
                }
                return ['status' => 'error', 'message' => 'Failed to Update'];
            }
        }

        function getAllBidder() {
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);

            $sql = "SELECT * FROM newtable";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }

        function getAllUsers() {
            $host = 'wheatley.cs.up.ac.za';
            $username = 'u23815087';
            $password = 'TVCHLQPFEEZCHENNTGCBU6WADMSPYHJJ';
            $conn = new PDO("mysql:host=$host;dbname=u23815087_homework", $username, $password);

            $sql = "SELECT * FROM Users";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }

        function validate_input($postData)
        {
            $postData = trim($postData);
            $postData = stripslashes($postData);
            $postData = htmlspecialchars($postData);
            return $postData;
        }
    }

    $api = API::getInstance();

    if (isset($_GET['endpoint']) && $_GET['endpoint'] === 'getAuction') {
        echo json_encode($api->getAuction());
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $rawPostData = file_get_contents('php://input');
        $postData = json_decode($rawPostData, true);
        if (isset($postData['endpoint'])) {
            switch ($postData['endpoint']) {
                case 'login':
                    $response = $api->login($postData);
                    break;
                case 'registration':
                    $response = $api->registration($postData);
                    break;
                case 'createAuction':
                    $response = $api->createAuction($postData);
                    break;
                case 'updateAuction':
                    $response = $api->updateAuction($postData);
                    break;
                case 'joinAuction':
                    $response = $api->joinAuction($postData);
                    break;
                case 'joinAuctionUpdate':
                    $response = $api->joinAuctionUpdate($postData);
                    break;
                default:
                    $response = ['status' => 'error', 'message' => 'Invalid endpoint'];
                    break;
            }
        } else {
            $response = ['status' => 'error', 'message' => 'No endpoint specified'];
        }
        echo json_encode($response);
    } else if (isset($_GET['endpoint']) && $_GET['endpoint'] === 'getAllBidder') {
        echo json_encode($api->getAllBidder());
    } else if (isset($_GET['endpoint']) && $_GET['endpoint'] === 'getAllUsers') {
        echo json_encode($api->getAllUsers());
    }
?>