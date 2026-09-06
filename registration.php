<?php

$userReg = file_get_contents('php://input');

$data = json_decode($userReg, true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = '';

    if ($data['AccountType'] === 'store' || $data['AccountType'] === 'vendor') {

        if (isset($data['businessName'])) {
            $name = $data['businessName'];
        } else if (isset($data['storeName'])) {
            $name = $data['storeName'];
        } else {
            echo json_encode(['Invalid business or store name']);
            exit;
        }

        if (strlen($name) < 5 || strlen($name)  > 100) {
            echo json_encode(['invalid business name']);
            exit;
        }
    }


    if (strlen($data['fullName']) < 2 || strlen($data['fullName']) > 50) {
        echo json_encode(['invalid fullname']);
        exit;
    }

    if (filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false) {
        echo json_encode(['invalid email']);
        exit;
    }

    if (strlen($data['phoneNumber']) !== 11) {
        echo json_encode(['invalid phone number']);
        exit;
    }

    if (strlen($data['address']) < 5 || strlen($data['address'])  > 200) {
        echo json_encode(['invalid address']);
        exit;
    }
} else {
    echo json_encode(['Request method is not post']);
}

echo json_encode(['success data:' => $data]);
