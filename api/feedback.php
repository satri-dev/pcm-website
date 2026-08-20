<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$baseDir = dirname(__DIR__);
$configFile  = $baseDir . '/api/feedback-config.json';
$submissionsFile = $baseDir . '/api/feedback-submissions.json';
$uploadDir = $baseDir . '/uploads/feedback';

if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
if (!file_exists($configFile)) file_put_contents($configFile, json_encode(['title'=>'Feedback Form','description'=>'We value your feedback. Please share your thoughts with us.','fields'=>[]], JSON_PRETTY_PRINT));
if (!file_exists($submissionsFile)) file_put_contents($submissionsFile, json_encode([], JSON_PRETTY_PRINT));

function loadJson($path) {
    $raw = file_get_contents($path);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function saveJson($path, $data) {
    $h = fopen($path, 'w');
    if ($h) {
        flock($h, LOCK_EX);
        fwrite($h, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        flock($h, LOCK_UN);
        fclose($h);
    }
}

function saveFile($file, $folder) {
    $dir = dirname(__DIR__) . '/uploads/' . $folder;
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','gif','pdf','doc','docx','xls','xlsx'];
    if (!in_array($ext, $allowed)) return null;
    $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = time() . '_' . $safeName . '.' . $ext;
    if (move_uploaded_file($file['tmp_name'], $dir . '/' . $filename)) {
        return 'uploads/' . $folder . '/' . $filename;
    }
    return null;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// === GET: Load config or submissions ===
if ($method === 'GET') {
    if ($action === 'submissions') {
        $subs = loadJson($submissionsFile);
        echo json_encode(['success'=>true, 'submissions'=>array_reverse($subs)]);
        exit;
    }
    // Default: load config
    $config = loadJson($configFile);
    echo json_encode(['success'=>true, 'config'=>$config]);
    exit;
}

// === POST ===
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Admin: Update config
    if ($action === 'config' && $input) {
        $config = [
            'title'       => $input['title'] ?? 'Feedback Form',
            'description' => $input['description'] ?? '',
            'fields'      => $input['fields'] ?? [],
        ];
        saveJson($configFile, $config);
        echo json_encode(['success'=>true, 'message'=>'Feedback form configuration saved.']);
        exit;
    }

    // Public: Submit feedback
    if ($action === 'submit') {
        $config = loadJson($configFile);
        $fields = $config['fields'] ?? [];
        $submission = [
            'id'           => date('YmdHis') . rand(1000, 9999),
            'submitted_at' => date('Y-m-d H:i:s'),
            'answers'      => [],
            'files'        => [],
        ];

        foreach ($fields as $field) {
            $key = $field['id'] ?? '';
            if (!$key) continue;
            if (($field['type'] ?? '') === 'file' || ($field['type'] ?? '') === 'image') {
                if (!empty($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK) {
                    $saved = saveFile($_FILES[$key], 'feedback');
                    if ($saved) $submission['files'][$key] = $saved;
                }
            } else {
                $submission['answers'][$key] = $_POST[$key] ?? '';
            }
        }

        $existing = loadJson($submissionsFile);
        $existing[] = $submission;
        saveJson($submissionsFile, $existing);

        echo json_encode(['success'=>true, 'message'=>'Thank you for your feedback!', 'id'=>$submission['id']]);
        exit;
    }

    echo json_encode(['success'=>false, 'message'=>'Invalid action.']);
    exit;
}

http_response_code(405);
echo json_encode(['success'=>false, 'message'=>'Method not allowed.']);
