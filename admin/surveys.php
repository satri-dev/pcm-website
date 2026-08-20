<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Surveys — PCM Admin</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Poppins',sans-serif;background:#f0f2f5;color:#1e293b;padding:20px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding:20px 24px;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.header h1{font-size:1.3rem;color:#16285b}
.header .count{background:#21409A;color:#fff;padding:4px 14px;border-radius:20px;font-size:.85rem;font-weight:600}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.stat-card{background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.stat-card .num{font-size:2rem;font-weight:700;color:#21409A}
.stat-card .label{font-size:.85rem;color:#64748b;margin-top:4px}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06)}
th{background:#21409A;color:#fff;padding:12px 16px;text-align:left;font-size:.82rem;font-weight:600;position:sticky;top:0}
td{padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:.88rem}
tr:hover{background:#f8fafc}
.badge{display:inline-block;padding:2px 10px;border-radius:12px;font-size:.75rem;font-weight:600}
.badge-active{background:#d1fae5;color:#065f46}
.badge-inactive{background:#fee2e2;color:#991b1b}
.btn{padding:6px 14px;border:none;border-radius:6px;cursor:pointer;font-size:.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
.btn-primary{background:#21409A;color:#fff}
.btn-primary:hover{background:#1a327a}
.btn-success{background:#059669;color:#fff}
.btn-success:hover{background:#047857}
.btn-danger{background:#e53e3e;color:#fff}
.btn-danger:hover{background:#c53030}
.btn-secondary{background:#64748b;color:#fff}
.btn-secondary:hover{background:#475569}
.btn-outline{background:transparent;border:1px solid #e2e8f0;color:#64748b}
.btn-outline:hover{background:#f1f5f9}
.modal-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:1000;align-items:center;justify-content:center}
.modal-overlay.active{display:flex}
.modal{background:#fff;border-radius:16px;max-width:700px;width:95%;max-height:85vh;overflow-y:auto;padding:32px;position:relative}
.modal-close{position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#64748b}
.modal h2{color:#21409A;margin-bottom:20px;font-size:1.2rem}
.modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.modal-field{padding:8px 0;border-bottom:1px solid #f1f5f9}
.modal-field .lbl{font-size:.78rem;color:#64748b;font-weight:500}
.modal-field .val{font-size:.9rem;color:#1e293b;font-weight:600}
.modal-section{grid-column:1/-1;font-weight:700;color:#21409A;padding:12px 0 4px;border-bottom:2px solid #21409A;margin-top:8px;font-size:.9rem}
.files-grid{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.files-grid a{padding:6px 12px;background:#f1f5f9;border-radius:6px;font-size:.82rem;text-decoration:none;color:#21409A;font-weight:500}
.files-grid a:hover{background:#e0e7ff}
.empty{text-align:center;padding:60px 20px;color:#64748b}
.empty svg{width:64px;height:64px;margin:0 auto 16px;display:block;opacity:.3}
.search-bar{margin-bottom:20px}
.search-bar input{width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:.95rem;font-family:inherit}
.search-bar input:focus{outline:none;border-color:#21409A;box-shadow:0 0 0 3px rgba(33,64,154,.1)}
.form-card{background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:24px}
.form-card h2{color:#21409A;font-size:1.1rem;margin-bottom:20px}
.form-group{margin-bottom:16px}
.form-group label{display:block;font-size:.82rem;font-weight:600;color:#475569;margin-bottom:6px}
.form-group input[type="text"],.form-group textarea,.form-group select{width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;font-family:inherit;transition:border-color .2s}
.form-group input[type="text"]:focus,.form-group textarea:focus,.form-group select:focus{outline:none;border-color:#21409A;box-shadow:0 0 0 3px rgba(33,64,154,.1)}
.form-group textarea{resize:vertical;min-height:80px}
.form-row{display:flex;gap:16px;align-items:flex-end}
.form-row .form-group{flex:1}
.form-check{display:flex;align-items:center;gap:8px;font-size:.88rem}
.form-check input[type="checkbox"]{width:18px;height:18px;accent-color:#21409A}
.question-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:20px;margin-bottom:12px;position:relative}
.question-card .q-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.question-card .q-num{background:#21409A;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700}
.question-card .q-actions{display:flex;gap:6px}
.question-card .q-actions button{background:none;border:1px solid #e2e8f0;border-radius:4px;padding:4px 8px;cursor:pointer;font-size:.78rem;color:#64748b}
.question-card .q-actions button:hover{background:#f1f5f9}
.question-card .q-actions button.q-del{color:#e53e3e;border-color:#fecaca}
.question-card .q-actions button.q-del:hover{background:#fee2e2}
.options-row{display:none}
.options-row.show{display:block}
.responses-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.btn-group{display:flex;gap:8px;flex-wrap:wrap}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeIn .3s ease}
@media(max-width:768px){
  .modal-grid{grid-template-columns:1fr}
  table{font-size:.8rem}
  td,th{padding:8px 10px}
  .form-row{flex-direction:column;gap:0}
  .header{flex-direction:column;gap:12px;text-align:center}
}
</style>
</head>
<body>

<!-- ===== LIST VIEW ===== -->
<div id="viewList">
  <div class="header">
    <h1>📋 Survey Management</h1>
    <div>
      <span class="count" id="surveyCount">0 total</span>
      <button class="btn btn-primary" style="margin-left:12px" onclick="showBuilder()">+ Create New Survey</button>
    </div>
  </div>
  <div class="stats" id="statsArea"></div>
  <div class="search-bar">
    <input type="text" id="searchInput" placeholder="Search surveys by title..." oninput="filterSurveys()">
  </div>
  <div id="surveyTableWrap"></div>
</div>

<!-- ===== BUILDER VIEW ===== -->
<div id="viewBuilder" style="display:none">
  <div class="header">
    <h1 id="builderTitle">📝 Create Survey</h1>
    <div>
      <button class="btn btn-outline" onclick="showList()">← Cancel</button>
    </div>
  </div>
  <div class="form-card fade-in">
    <div class="form-group">
      <label>Survey Title</label>
      <input type="text" id="surveyTitle" placeholder="e.g. Student Satisfaction Survey">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea id="surveyDesc" placeholder="Brief description of this survey..."></textarea>
    </div>
    <div class="form-group">
      <div class="form-check">
        <input type="checkbox" id="surveyActive" checked>
        <label for="surveyActive">Active (visible to respondents)</label>
      </div>
    </div>
  </div>

  <div class="form-card fade-in">
    <h2>Questions</h2>
    <div id="questionsList"></div>
    <div style="margin-top:16px">
      <button class="btn btn-primary" onclick="addQuestion()">+ Add Question</button>
    </div>
  </div>

  <div style="text-align:right;margin-top:8px">
    <button class="btn btn-outline" onclick="showList()" style="margin-right:8px">Cancel</button>
    <button class="btn btn-success" onclick="saveSurvey()">💾 Save Survey</button>
  </div>
</div>

<!-- ===== RESPONSES VIEW ===== -->
<div id="viewResponses" style="display:none">
  <div class="header">
    <h1 id="responsesTitle">📊 Survey Responses</h1>
    <div>
      <span class="count" id="responsesCount">0 responses</span>
      <button class="btn btn-primary" style="margin-left:12px" onclick="showList()">← Back to Surveys</button>
    </div>
  </div>
  <div id="responsesTableWrap"></div>
</div>

<!-- ===== DETAIL MODAL ===== -->
<div class="modal-overlay" id="responseModal">
  <div class="modal">
    <button class="modal-close" onclick="closeResponseModal()">&times;</button>
    <h2 id="responseModalTitle">Response Details</h2>
    <div class="modal-grid" id="responseModalBody"></div>
  </div>
</div>

<script>
var surveys = [];
var editingId = null;
var questionCounter = 0;
var currentResponsesSurveyId = null;
var currentSurveyQuestions = [];

function showList() {
  document.getElementById('viewList').style.display = '';
  document.getElementById('viewBuilder').style.display = 'none';
  document.getElementById('viewResponses').style.display = 'none';
  editingId = null;
  loadSurveys();
}

function showBuilder(surveyId) {
  document.getElementById('viewList').style.display = 'none';
  document.getElementById('viewBuilder').style.display = '';
  document.getElementById('viewResponses').style.display = 'none';
  editingId = surveyId || null;
  document.getElementById('builderTitle').textContent = editingId ? '📝 Edit Survey' : '📝 Create Survey';
  document.getElementById('surveyTitle').value = '';
  document.getElementById('surveyDesc').value = '';
  document.getElementById('surveyActive').checked = true;
  document.getElementById('questionsList').innerHTML = '';
  questionCounter = 0;
  currentSurveyQuestions = [];

  if (editingId) {
    var s = surveys.find(function(x){ return x.id === editingId; });
    if (s) {
      document.getElementById('surveyTitle').value = s.title || '';
      document.getElementById('surveyDesc').value = s.description || '';
      document.getElementById('surveyActive').checked = !!s.active;
      if (s.questions && s.questions.length) {
        s.questions.forEach(function(q) {
          currentSurveyQuestions.push(q);
          renderQuestion(q);
        });
      }
    }
  }
}

function showResponses(surveyId) {
  currentResponsesSurveyId = surveyId;
  document.getElementById('viewList').style.display = 'none';
  document.getElementById('viewBuilder').style.display = 'none';
  document.getElementById('viewResponses').style.display = '';
  var s = surveys.find(function(x){ return x.id === surveyId; });
  document.getElementById('responsesTitle').textContent = '📊 ' + (s ? s.title : 'Survey') + ' — Responses';
  loadResponses(surveyId);
}

/* ========== API ========== */
function loadSurveys() {
  fetch('api/survey.php?action=all')
    .then(function(r){ return r.json(); })
    .then(function(data){
      surveys = data.surveys || data || [];
      if (!Array.isArray(surveys)) surveys = [];
      renderSurveyList();
    })
    .catch(function(e){
      console.error('Failed to load surveys', e);
      surveys = [];
      renderSurveyList();
    });
}

function renderSurveyList() {
  document.getElementById('surveyCount').textContent = surveys.length + ' total';
  var activeCount = surveys.filter(function(s){ return s.active; }).length;
  var totalQ = surveys.reduce(function(a,s){ return a + (s.questions ? s.questions.length : 0); }, 0);
  document.getElementById('statsArea').innerHTML =
    '<div class="stat-card"><div class="num">' + surveys.length + '</div><div class="label">Total Surveys</div></div>' +
    '<div class="stat-card"><div class="num">' + activeCount + '</div><div class="label">Active</div></div>' +
    '<div class="stat-card"><div class="num">' + totalQ + '</div><div class="label">Total Questions</div></div>';

  if (!surveys.length) {
    document.getElementById('surveyTableWrap').innerHTML =
      '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg><h3>No surveys yet</h3><p>Click "Create New Survey" to get started.</p></div>';
    return;
  }
  var h = '<table id="surveyTable"><thead><tr><th>#</th><th>Title</th><th>Questions</th><th>Status</th><th>Created</th><th>Updated</th><th>Actions</th></tr></thead><tbody>';
  surveys.forEach(function(s, i) {
    var qcount = s.questions ? s.questions.length : 0;
    var badge = s.active ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Inactive</span>';
    h += '<tr>';
    h += '<td>' + (i + 1) + '</td>';
    h += '<td><b>' + esc(s.title) + '</b>' + (s.description ? '<br><small style="color:#64748b">' + esc(s.description).substring(0, 60) + '</small>' : '') + '</td>';
    h += '<td>' + qcount + '</td>';
    h += '<td>' + badge + '</td>';
    h += '<td style="white-space:nowrap">' + esc(s.created_at || '—') + '</td>';
    h += '<td style="white-space:nowrap">' + esc(s.updated_at || '—') + '</td>';
    h += '<td>';
    h += '<div class="btn-group">';
    h += '<button class="btn btn-primary" onclick="showBuilder(\'' + s.id + '\')">Edit</button>';
    h += '<button class="btn btn-outline" onclick="toggleSurvey(\'' + s.id + '\',' + (s.active ? 'false' : 'true') + ')">' + (s.active ? 'Deactivate' : 'Activate') + '</button>';
    h += '<button class="btn btn-secondary" onclick="showResponses(\'' + s.id + '\')">Responses</button>';
    h += '<button class="btn btn-danger" onclick="deleteSurvey(\'' + s.id + '\')">Delete</button>';
    h += '</div>';
    h += '</td>';
    h += '</tr>';
  });
  h += '</tbody></table>';
  document.getElementById('surveyTableWrap').innerHTML = h;
}

function toggleSurvey(id, active) {
  fetch('api/survey.php?action=toggle', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: id, active: active === 'true' || active === true})
  }).then(function(){ loadSurveys(); });
}

function deleteSurvey(id) {
  if (!confirm('Are you sure you want to delete this survey? This cannot be undone.')) return;
  fetch('api/survey.php?action=delete', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: id})
  }).then(function(){ loadSurveys(); });
}

/* ========== BUILDER ========== */
function renderQuestion(q) {
  var idx = questionCounter++;
  var typeOptions = '<option value="text"' + (q.type==='text'?' selected':'') + '>Text (Single Line)</option>' +
    '<option value="textarea"' + (q.type==='textarea'?' selected':'') + '>Text (Multi Line)</option>' +
    '<option value="select"' + (q.type==='select'?' selected':'') + '>Dropdown Select</option>' +
    '<option value="radio"' + (q.type==='radio'?' selected':'') + '>Radio Buttons</option>' +
    '<option value="checkbox"' + (q.type==='checkbox'?' selected':'') + '>Checkboxes</option>' +
    '<option value="file"' + (q.type==='file'?' selected':'') + '>File Upload</option>' +
    '<option value="rating"' + (q.type==='rating'?' selected':'') + '>Rating (1-5)</option>';

  var needsOptions = q.type === 'select' || q.type === 'radio' || q.type === 'checkbox';
  var card = document.createElement('div');
  card.className = 'question-card fade-in';
  card.dataset.qid = q.id || '';
  card.dataset.idx = idx;

  card.innerHTML =
    '<div class="q-header">' +
      '<div class="q-num">' + (idx + 1) + '</div>' +
      '<div class="q-actions">' +
        '<button onclick="moveQuestion(this,-1)" title="Move Up">&#9650;</button>' +
        '<button onclick="moveQuestion(this,1)" title="Move Down">&#9660;</button>' +
        '<button class="q-del" onclick="deleteQuestion(this)" title="Delete">&#10005;</button>' +
      '</div>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Question Text</label>' +
      '<input type="text" class="q-text" value="' + esc(q.text || '') + '" placeholder="Type your question here...">' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-group">' +
        '<label>Type</label>' +
        '<select class="q-type" onchange="toggleOptionsRow(this)">' + typeOptions + '</select>' +
      '</div>' +
      '<div class="form-group form-check" style="padding-top:28px">' +
        '<input type="checkbox" class="q-required" id="qreq_' + idx + '"' + (q.required ? ' checked' : '') + '>' +
        '<label for="qreq_' + idx + '">Required</label>' +
      '</div>' +
    '</div>' +
    '<div class="form-group options-row ' + (needsOptions ? 'show' : '') + '">' +
      '<label>Options (comma-separated)</label>' +
      '<textarea class="q-options" placeholder="e.g. Option 1, Option 2, Option 3">' + esc(q.options || '') + '</textarea>' +
    '</div>';

  document.getElementById('questionsList').appendChild(card);
  renumberQuestions();
}

function addQuestion(q) {
  q = q || { id: 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2,5), text: '', type: 'text', options: '', required: false };
  renderQuestion(q);
}

function deleteQuestion(btn) {
  var card = btn.closest('.question-card');
  if (confirm('Delete this question?')) {
    card.remove();
    renumberQuestions();
  }
}

function moveQuestion(btn, dir) {
  var card = btn.closest('.question-card');
  var parent = card.parentNode;
  if (dir === -1 && card.previousElementSibling) {
    parent.insertBefore(card, card.previousElementSibling);
  } else if (dir === 1 && card.nextElementSibling) {
    parent.insertBefore(card.nextElementSibling, card);
  }
  renumberQuestions();
}

function toggleOptionsRow(sel) {
  var card = sel.closest('.question-card');
  var row = card.querySelector('.options-row');
  var t = sel.value;
  if (t === 'select' || t === 'radio' || t === 'checkbox') {
    row.classList.add('show');
  } else {
    row.classList.remove('show');
  }
}

function renumberQuestions() {
  var cards = document.querySelectorAll('#questionsList .question-card');
  cards.forEach(function(c, i) {
    c.querySelector('.q-num').textContent = i + 1;
  });
}

function gatherQuestions() {
  var cards = document.querySelectorAll('#questionsList .question-card');
  var qs = [];
  cards.forEach(function(c) {
    var qid = c.dataset.qid || ('q_' + Date.now() + '_' + Math.random().toString(36).substr(2,5));
    qs.push({
      id: qid,
      text: c.querySelector('.q-text').value.trim(),
      type: c.querySelector('.q-type').value,
      options: c.querySelector('.q-options') ? c.querySelector('.q-options').value.trim() : '',
      required: c.querySelector('.q-required').checked
    });
  });
  return qs;
}

function saveSurvey() {
  var title = document.getElementById('surveyTitle').value.trim();
  if (!title) { alert('Please enter a survey title.'); return; }
  var questions = gatherQuestions();
  if (!questions.length) { alert('Please add at least one question.'); return; }

  var payload = {
    title: title,
    description: document.getElementById('surveyDesc').value.trim(),
    active: document.getElementById('surveyActive').checked,
    questions: questions
  };
  if (editingId) payload.id = editingId;

  fetch('api/survey.php?action=save', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }).then(function(r){ return r.json(); })
    .then(function(res){
      if (res.error) { alert('Error: ' + res.error); return; }
      showList();
    })
    .catch(function(e){
      alert('Failed to save survey. Please try again.');
      console.error(e);
    });
}

/* ========== RESPONSES ========== */
function loadResponses(surveyId) {
  fetch('api/survey.php?action=responses&id=' + encodeURIComponent(surveyId))
    .then(function(r){ return r.json(); })
    .then(function(data){
      var responses = data.responses || data || [];
      if (!Array.isArray(responses)) responses = [];
      var s = surveys.find(function(x){ return x.id === surveyId; });
      currentSurveyQuestions = s && s.questions ? s.questions : [];
      document.getElementById('responsesCount').textContent = responses.length + ' responses';
      if (!responses.length) {
        document.getElementById('responsesTableWrap').innerHTML =
          '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg><h3>No responses yet</h3><p>Responses will appear here once people start filling out the survey.</p></div>';
        return;
      }
      var h = '<table id="responsesTable"><thead><tr><th>#</th><th>Respondent</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
      responses.forEach(function(r, i) {
        h += '<tr>';
        h += '<td>' + (i + 1) + '</td>';
        h += '<td><b>' + esc(r.respondent || 'Anonymous') + '</b></td>';
        h += '<td style="white-space:nowrap">' + esc(r.submitted_at || '—') + '</td>';
        h += '<td><button class="btn btn-primary" onclick=\'viewResponse(' + JSON.stringify(r).replace(/'/g, "&#39;") + ')\'>View</button></td>';
        h += '</tr>';
      });
      h += '</tbody></table>';
      document.getElementById('responsesTableWrap').innerHTML = h;
    })
    .catch(function(e){
      console.error('Failed to load responses', e);
      document.getElementById('responsesTableWrap').innerHTML = '<div class="empty"><h3>Failed to load responses</h3></div>';
    });
}

function viewResponse(resp) {
  var h = '';
  h += sec('Submission Info');
  h += row('Respondent', resp.respondent || 'Anonymous');
  h += row('Submitted', resp.submitted_at || '—');
  h += row('Response ID', resp.id || '—');
  h += sec('Answers');
  var answers = resp.answers || {};
  var files = resp.files || {};
  currentSurveyQuestions.forEach(function(q) {
    var ans = answers[q.id] || '';
    var file = files[q.id] || '';
    var display = '';
    if (q.type === 'rating') {
      display = ans ? ('★'.repeat(parseInt(ans)) + '☆'.repeat(5 - parseInt(ans)) + ' (' + ans + '/5)') : '—';
    } else if (q.type === 'file' && file) {
      display = '<a href="../' + esc(file) + '" target="_blank">View File</a>';
    } else if (q.type === 'checkbox' && ans) {
      var arr = Array.isArray(ans) ? ans : ans.split(',');
      display = arr.map(function(a){ return '<span class="badge badge-active" style="margin:2px">' + esc(a.trim()) + '</span>'; }).join(' ');
    } else {
      display = esc(ans) || '—';
    }
    h += '<div class="modal-field"><div class="lbl">' + esc(q.text) + ' <small>(' + q.type + ')</small></div><div class="val">' + display + '</div></div>';
  });
  document.getElementById('responseModalTitle').textContent = (resp.respondent || 'Anonymous') + ' — Response Details';
  document.getElementById('responseModalBody').innerHTML = h;
  document.getElementById('responseModal').classList.add('active');
}

function closeResponseModal() {
  document.getElementById('responseModal').classList.remove('active');
}
document.getElementById('responseModal').addEventListener('click', function(e) {
  if (e.target === this) closeResponseModal();
});

function sec(t) { return '<div class="modal-section">' + t + '</div>'; }
function row(l, v) { return '<div class="modal-field"><div class="lbl">' + l + '</div><div class="val">' + (v || '—') + '</div></div>'; }
function esc(s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }

function filterSurveys() {
  var q = document.getElementById('searchInput').value.toLowerCase();
  var rows = document.querySelectorAll('#surveyTable tbody tr');
  rows.forEach(function(r) {
    r.style.display = r.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
  });
}

/* ========== INIT ========== */
loadSurveys();
</script>
</body>
</html>
