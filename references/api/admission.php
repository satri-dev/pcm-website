<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$baseDir = dirname(__DIR__);
$uploadDirs = [
    'profiles'  => $baseDir . '/uploads/profiles',
    'documents' => $baseDir . '/uploads/documents',
    'payments'  => $baseDir . '/uploads/payments',
];

foreach ($uploadDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$submissionsFile = $baseDir . '/api/submissions.json';

if (!file_exists($submissionsFile)) {
    file_put_contents($submissionsFile, json_encode([], JSON_PRETTY_PRINT));
}

function saveFile($file, $folder) {
    $dir = dirname(__DIR__) . '/uploads/' . $folder;
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'pdf'];
    
    if (!in_array($ext, $allowed)) {
        return null;
    }
    
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = time() . '_' . $safeName . '.' . $ext;
    $path = $dir . '/' . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $path)) {
        return 'uploads/' . $folder . '/' . $filename;
    }
    return null;
}

$submission = [
    'id'            => date('YmdHis') . rand(1000, 9999),
    'submitted_at'  => date('Y-m-d H:i:s'),
    'program_name'  => $_POST['program_name'] ?? '',
    'shift'         => $_POST['shift'] ?? '',
    'name'          => $_POST['name'] ?? '',
    'gender'        => $_POST['gender'] ?? '',
    'dob'           => $_POST['dob'] ?? '',
    'date_option'   => $_POST['date_option'] ?? 'bs',
    'nationality'   => $_POST['nationality'] ?? '',
    'phone'         => $_POST['phone'] ?? '',
    'personal_contact' => $_POST['personal_contact'] ?? '',
    'email'         => $_POST['email'] ?? '',
    'guardian_type' => $_POST['guardian_type'] ?? '',
    'father_name'   => $_POST['father_name'] ?? '',
    'father_phone'  => $_POST['father_phone'] ?? '',
    'mother_name'   => $_POST['mother_name'] ?? '',
    'mother_phone'  => $_POST['mother_phone'] ?? '',
    'guardian_name' => $_POST['guardian_name'] ?? '',
    'guardian_phone'=> $_POST['guardian_phone'] ?? '',
    'relationship'  => $_POST['relationship'] ?? '',
    'permanent_province'  => $_POST['permanent_province'] ?? '',
    'permanent_district'  => $_POST['permanent_district'] ?? '',
    'permanent_city'      => $_POST['permanent_city'] ?? '',
    'permanent_ward'      => $_POST['permanent_ward'] ?? '',
    'temporary_province'  => $_POST['temporary_province'] ?? '',
    'temporary_district'  => $_POST['temporary_district'] ?? '',
    'temporary_city'      => $_POST['temporary_city'] ?? '',
    'temporary_ward'      => $_POST['temporary_ward'] ?? '',
    'see_bod'              => $_POST['see_bod'] ?? '',
    'see_school'           => $_POST['see_school'] ?? '',
    'see_address'          => $_POST['see_address'] ?? '',
    'see_gpa'              => $_POST['see_gpa'] ?? '',
    'see_year'             => $_POST['see_year'] ?? '',
    'see_full_mark'        => $_POST['see_full_mark'] ?? '',
    'see_mark_obtained'    => $_POST['see_mark_obtained'] ?? '',
    'see_percentage_obtained' => $_POST['see_percentage_obtained'] ?? '',
    'intermediate_bod'        => $_POST['intermediate_bod'] ?? '',
    'intermediate_school'     => $_POST['intermediate_school'] ?? '',
    'intermediate_address'    => $_POST['intermediate_address'] ?? '',
    'intermediate_gpa'        => $_POST['intermediate_gpa'] ?? '',
    'intermediate_year'       => $_POST['intermediate_year'] ?? '',
    'intermediate_full_mark'  => $_POST['intermediate_full_mark'] ?? '',
    'intermediate_mark_obtained' => $_POST['intermediate_mark_obtained'] ?? '',
    'intermediate_percentage_obtained' => $_POST['intermediate_percentage_obtained'] ?? '',
    'date'           => $_POST['date'] ?? '',
    'profile'        => '',
    'documents'      => [],
    'payments'       => [],
];

// Save profile photo
if (!empty($_FILES['profile']['name'])) {
    $saved = saveFile($_FILES['profile'], 'profiles');
    if ($saved) $submission['profile'] = $saved;
}

// Save documents
if (!empty($_FILES['files']['name'][0])) {
    $fileCount = count($_FILES['files']['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        $file = [
            'name'     => $_FILES['files']['name'][$i],
            'type'     => $_FILES['files']['type'][$i],
            'tmp_name' => $_FILES['files']['tmp_name'][$i],
            'error'    => $_FILES['files']['error'][$i],
            'size'     => $_FILES['files']['size'][$i],
        ];
        if ($file['error'] === UPLOAD_ERR_OK) {
            $saved = saveFile($file, 'documents');
            if ($saved) $submission['documents'][] = $saved;
        }
    }
}

// Save payment slips
if (!empty($_FILES['payments']['name'][0])) {
    $fileCount = count($_FILES['payments']['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        $file = [
            'name'     => $_FILES['payments']['name'][$i],
            'type'     => $_FILES['payments']['type'][$i],
            'tmp_name' => $_FILES['payments']['tmp_name'][$i],
            'error'    => $_FILES['payments']['error'][$i],
            'size'     => $_FILES['payments']['size'][$i],
        ];
        if ($file['error'] === UPLOAD_ERR_OK) {
            $saved = saveFile($file, 'payments');
            if ($saved) $submission['payments'][] = $saved;
        }
    }
}

// Append to submissions file
$existing = json_decode(file_get_contents($submissionsFile), true);
if (!is_array($existing)) $existing = [];
$existing[] = $submission;

$fileHandle = fopen($submissionsFile, 'w');
if ($fileHandle) {
    flock($fileHandle, LOCK_EX);
    fwrite($fileHandle, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    flock($fileHandle, LOCK_UN);
    fclose($fileHandle);
}

echo json_encode([
    'success' => true,
    'message' => 'Application submitted successfully!',
    'id'      => $submission['id'],
]);
exit;
