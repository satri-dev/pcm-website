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
$surveysFile     = $baseDir . '/api/surveys.json';
$submissionsFile = $baseDir . '/api/survey-submissions.json';
$uploadDir       = $baseDir . '/uploads/surveys';

if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
if (!file_exists($surveysFile)) file_put_contents($surveysFile, json_encode([], JSON_PRETTY_PRINT));
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
    $allowed = ['jpg','jpeg','png','gif','pdf','doc','docx'];
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

// === GET ===
if ($method === 'GET') {
    if ($action === 'list') {
        $surveys = loadJson($surveysFile);
        $active = [];
        foreach ($surveys as $s) {
            if (!empty($s['active'])) $active[] = $s;
        }
        echo json_encode(['success'=>true, 'surveys'=>$active]);
        exit;
    }
    if ($action === 'all') {
        $surveys = loadJson($surveysFile);
        echo json_encode(['success'=>true, 'surveys'=>$surveys]);
        exit;
    }
    if ($action === 'detail' && !empty($_GET['id'])) {
        $surveys = loadJson($surveysFile);
        foreach ($surveys as $s) {
            if ($s['id'] === $_GET['id']) {
                echo json_encode(['success'=>true, 'survey'=>$s]);
                exit;
            }
        }
        echo json_encode(['success'=>false, 'message'=>'Survey not found.']);
        exit;
    }
    if ($action === 'responses' && !empty($_GET['id'])) {
        $allSubs = loadJson($submissionsFile);
        $filtered = [];
        foreach ($allSubs as $sub) {
            if (($sub['survey_id'] ?? '') === $_GET['id']) $filtered[] = $sub;
        }
        echo json_encode(['success'=>true, 'responses'=>$filtered]);
        exit;
    }
    echo json_encode(['success'=>false, 'message'=>'Invalid action.']);
    exit;
}

// === POST ===
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Admin: Create or update survey
    if ($action === 'save' && $input) {
        $surveys = loadJson($surveysFile);
        $surveyData = [
            'id'          => $input['id'] ?? (date('YmdHis') . rand(1000, 9999)),
            'title'       => $input['title'] ?? 'Untitled Survey',
            'description' => $input['description'] ?? '',
            'questions'   => $input['questions'] ?? [],
            'active'      => !empty($input['active']),
            'created_at'  => $input['created_at'] ?? date('Y-m-d H:i:s'),
            'updated_at'  => date('Y-m-d H:i:s'),
        ];

        $found = false;
        foreach ($surveys as $i => $s) {
            if ($s['id'] === $surveyData['id']) {
                $surveyData['created_at'] = $s['created_at'] ?? $surveyData['created_at'];
                $surveys[$i] = $surveyData;
                $found = true;
                break;
            }
        }
        if (!$found) $surveys[] = $surveyData;

        saveJson($surveysFile, $surveys);
        echo json_encode(['success'=>true, 'message'=>'Survey saved.', 'id'=>$surveyData['id']]);
        exit;
    }

    // Admin: Delete survey
    if ($action === 'delete' && $input && !empty($input['id'])) {
        $surveys = loadJson($surveysFile);
        $surveys = array_values(array_filter($surveys, function($s) use ($input) {
            return $s['id'] !== $input['id'];
        }));
        saveJson($surveysFile, $surveys);
        echo json_encode(['success'=>true, 'message'=>'Survey deleted.']);
        exit;
    }

    // Admin: Toggle active
    if ($action === 'toggle' && $input && !empty($input['id'])) {
        $surveys = loadJson($surveysFile);
        foreach ($surveys as $i => $s) {
            if ($s['id'] === $input['id']) {
                $surveys[$i]['active'] = !empty($input['active']);
                $surveys[$i]['updated_at'] = date('Y-m-d H:i:s');
                break;
            }
        }
        saveJson($surveysFile, $surveys);
        echo json_encode(['success'=>true, 'message'=>'Survey toggled.']);
        exit;
    }

    // Public: Submit response
    if ($action === 'submit') {
        $surveyId = $_POST['survey_id'] ?? '';
        if (!$surveyId) {
            echo json_encode(['success'=>false, 'message'=>'Missing survey ID.']);
            exit;
        }

        $surveys = loadJson($surveysFile);
        $survey = null;
        foreach ($surveys as $s) {
            if ($s['id'] === $surveyId) { $survey = $s; break; }
        }
        if (!$survey) {
            echo json_encode(['success'=>false, 'message'=>'Survey not found.']);
            exit;
        }

        $submission = [
            'id'           => date('YmdHis') . rand(1000, 9999),
            'survey_id'    => $surveyId,
            'survey_title' => $survey['title'] ?? '',
            'submitted_at' => date('Y-m-d H:i:s'),
            'respondent'   => $_POST['respondent'] ?? 'Anonymous',
            'answers'      => [],
            'files'        => [],
        ];

        $questions = $survey['questions'] ?? [];
        foreach ($questions as $q) {
            $qid = $q['id'] ?? '';
            if (!$qid) continue;
            if (($q['type'] ?? '') === 'file') {
                if (!empty($_FILES[$qid]) && $_FILES[$qid]['error'] === UPLOAD_ERR_OK) {
                    $saved = saveFile($_FILES[$qid], 'surveys');
                    if ($saved) $submission['files'][$qid] = $saved;
                }
            } else {
                $submission['answers'][$qid] = $_POST[$qid] ?? '';
            }
        }

        $existing = loadJson($submissionsFile);
        $existing[] = $submission;
        saveJson($submissionsFile, $existing);

        echo json_encode(['success'=>true, 'message'=>'Thank you for your response!', 'id'=>$submission['id']]);
        exit;
    }

    echo json_encode(['success'=>false, 'message'=>'Invalid action.']);
    exit;
}

http_response_code(405);
echo json_encode(['success'=>false, 'message'=>'Method not allowed.']);
