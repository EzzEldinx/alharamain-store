<?php
// products.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';
$method = $_SERVER['REQUEST_METHOD'];

// 1. GET: عرض المنتجات
if ($method == 'GET') {
    $sql = "SELECT * FROM products ORDER BY id DESC";
    $result = $conn->query($sql);
    $products = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $row['isSale'] = $row['isSale'] ? true : false;
            $row['isNew'] = $row['isNew'] ? true : false;
            $products[] = $row;
        }
    }
    echo json_encode($products);
}

// 2. POST: إضافة منتج جديد
elseif ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    if(!empty($data->name) && !empty($data->price) && !empty($data->category)) {
        $name = $conn->real_escape_string($data->name);
        $category = $conn->real_escape_string($data->category);
        $price = $data->price;
        $oldPrice = !empty($data->oldPrice) ? $data->oldPrice : "NULL";
        $image = $conn->real_escape_string($data->image);
        $description = $conn->real_escape_string($data->description);
        $isSale = !empty($data->isSale) && $data->isSale ? 1 : 0;
        $isNew = !empty($data->isNew) && $data->isNew ? 1 : 0;

        $sql = "INSERT INTO products (name, category, price, oldPrice, image, description, isSale, isNew) 
                VALUES ('$name', '$category', $price, $oldPrice, '$image', '$description', $isSale, $isNew)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Product added successfully."]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    }
}

// 3. PUT: تعديل منتج موجود
elseif ($method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    if(isset($data->id) && !empty($data->name)) {
        $id = (int)$data->id;
        $name = $conn->real_escape_string($data->name);
        $category = $conn->real_escape_string($data->category);
        $price = $data->price;
        $oldPrice = !empty($data->oldPrice) ? $data->oldPrice : "NULL";
        $image = $conn->real_escape_string($data->image);
        $description = $conn->real_escape_string($data->description);
        $isSale = !empty($data->isSale) && $data->isSale ? 1 : 0;
        $isNew = !empty($data->isNew) && $data->isNew ? 1 : 0;

        $sql = "UPDATE products SET name='$name', category='$category', price=$price, oldPrice=$oldPrice, image='$image', description='$description', isSale=$isSale, isNew=$isNew WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Product updated successfully."]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    }
}

// 4. DELETE: مسح منتج
elseif ($method == 'DELETE') {
    if(isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $sql = "DELETE FROM products WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Product deleted successfully."]);
        } else {
            echo json_encode(["error" => "Error: " . $conn->error]);
        }
    }
}
$conn->close();
?>