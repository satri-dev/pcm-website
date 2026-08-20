<?php
$configFile = dirname(__DIR__) . '/api/feedback-config.json';
$config = ['title' => 'Feedback Form', 'description' => 'We value your feedback.', 'fields' => []];
if (file_exists($configFile)) {
    $raw = file_get_contents($configFile);
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) $config = array_merge($config, $decoded);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Feedback Manager — PCM Admin</title>
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
.tabs{display:flex;gap:8px;margin-bottom:24px}
.tab-btn{padding:10px 24px;border:none;border-radius:8px;cursor:pointer;font-size:.9rem;font-weight:600;font-family:inherit;background:#fff;color:#64748b;box-shadow:0 2px 8px rgba(0,0,0,.06);transition:.2s}
.tab-btn.active{background:#21409A;color:#fff}
.tab-btn:hover:not(.active){background:#e0e7ff}
.tab-content{display:none}
.tab-content.active{display:block}
.card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.06);margin-bottom:20px}
.card h2{font-size:1.1rem;color:#16285b;margin-bottom:16px}
.card h3{font-size:.95rem;color:#21409A;margin-bottom:12px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-group{margin-bottom:14px}
.form-group label{display:block;font-size:.8rem;font-weight:600;color:#475569;margin-bottom:4px}
.form-group input,.form-group select,.form-group textarea{width:100%;padding:10px 14px;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;font-family:inherit}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#21409A;box-shadow:0 0 0 3px rgba(33,64,154,.1)}
.form-group textarea{resize:vertical;min-height:60px}
.checkbox-row{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.checkbox-row input{width:16px;height:16px;accent-color:#21409A}
.checkbox-row label{font-size:.85rem;font-weight:500;color:#475569;margin:0}
.btn{padding:8px 18px;border:none;border-radius:8px;cursor:pointer;font-size:.82rem;font-weight:600;font-family:inherit;display:inline-flex;align-items:center;gap:4px;transition:.2s}
.btn-primary{background:#21409A;color:#fff}
.btn-primary:hover{background:#1a327a}
.btn-danger{background:#e53e3e;color:#fff}
.btn-danger:hover{background:#c53030}
.btn-success{background:#16a34a;color:#fff}
.btn-success:hover{background:#15803d}
.btn-outline{background:#fff;color:#21409A;border:1px solid #21409A}
.btn-outline:hover{background:#e0e7ff}
.btn-sm{padding:5px 12px;font-size:.78rem}
.field-list{display:flex;flex-direction:column;gap:10px}
.field-item{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}
.field-item .field-info{flex:1}
.field-item .field-label{font-weight:600;font-size:.92rem;color:#1e293b}
.field-item .field-meta{font-size:.78rem;color:#64748b;margin-top:2px}
.field-item .field-type{background:#dbeafe;color:#1e40af;padding:2px 10px;border-radius:12px;font-size:.72rem;font-weight:600}
.field-item .field-actions{display:flex;gap:6px;flex-shrink:0}
.empty{text-align:center;padding:60px 20px;color:#64748b}
.empty svg{width:64px;height:64px;margin:0 auto 16px;display:block;opacity:.3}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.06)}
th{background:#21409A;color:#fff;padding:12px 16px;text-align:left;font-size:.82rem;font-weight:600;position:sticky;top:0}
td{padding:10px 16px;border-bottom:1px solid #e2e8f0;font-size:.88rem}
tr:hover{background:#f8fafc}
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
.search-bar{margin-bottom:20px}
.search-bar input{width:100%;padding:12px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:.95rem;font-family:inherit}
.search-bar input:focus{outline:none;border-color:#21409A;box-shadow:0 0 0 3px rgba(33,64,154,.1)}
.toast{position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:10px;color:#fff;font-size:.88rem;font-weight:600;z-index:2000;transform:translateY(100px);opacity:0;transition:.3s}
.toast.show{transform:translateY(0);opacity:1}
.toast-success{background:#16a34a}
.toast-error{background:#e53e3e}
@media(max-width:768px){
  .form-row{grid-template-columns:1fr}
  .modal-grid{grid-template-columns:1fr}
  table{font-size:.8rem}
  td,th{padding:8px 10px}
  .header{flex-direction:column;gap:12px}
  .field-item{flex-direction:column;align-items:flex-start}
}
</style>
</head>
<body>

<div class="header">
  <h1>📝 Feedback Manager</h1>
  <div>
    <span class="count" id="subCount">0 submissions</span>
    <a href="../index.html" class="btn btn-primary" style="margin-left:12px">← Back to Site</a>
  </div>
</div>

<div class="stats">
  <div class="stat-card"><div class="num" id="statTotal">0</div><div class="label">Total Submissions</div></div>
  <div class="stat-card"><div class="num" id="statFields"><?php echo count($config['fields']); ?></div><div class="label">Form Fields</div></div>
  <div class="stat-card"><div class="num" id="statToday">0</div><div class="label">Today</div></div>
</div>

<div class="tabs">
  <button class="tab-btn active" onclick="switchTab('builder')">Field Builder</button>
  <button class="tab-btn" onclick="switchTab('config')">Form Settings</button>
  <button class="tab-btn" onclick="switchTab('submissions')">Submissions</button>
</div>

<!-- FIELD BUILDER TAB -->
<div class="tab-content active" id="tab-builder">
  <div class="card">
    <h2>Add New Field</h2>
    <div class="form-row">
      <div class="form-group">
        <label>Label</label>
        <input type="text" id="fLabel" placeholder="e.g. Your Name">
      </div>
      <div class="form-group">
        <label>Type</label>
        <select id="fType" onchange="toggleOptions()">
          <option value="text">Text Input</option>
          <option value="textarea">Text Area</option>
          <option value="select">Dropdown Select</option>
          <option value="radio">Radio Buttons</option>
          <option value="checkbox">Checkboxes</option>
          <option value="file">File Upload</option>
          <option value="image">Image Upload</option>
          <option value="rating">Rating (Stars)</option>
        </select>
      </div>
    </div>
    <div class="form-group" id="optionsGroup" style="display:none">
      <label>Options (comma separated)</label>
      <textarea id="fOptions" placeholder="e.g. Option 1, Option 2, Option 3"></textarea>
    </div>
    <div class="form-group">
      <label>Placeholder</label>
      <input type="text" id="fPlaceholder" placeholder="Placeholder text">
    </div>
    <div class="checkbox-row">
      <input type="checkbox" id="fRequired">
      <label for="fRequired">Required field</label>
    </div>
    <button class="btn btn-primary" onclick="addField()">+ Add Field</button>
  </div>

  <div class="card">
    <h2>Current Fields</h2>
    <div class="field-list" id="fieldList">
      <?php if (empty($config['fields'])): ?>
        <div class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 11v6M9 14h6"/></svg>
          <h3>No fields configured</h3>
          <p>Add fields above to build your feedback form.</p>
        </div>
      <?php endif; ?>
    </div>
  </div>
</div>

<!-- FORM SETTINGS TAB -->
<div class="tab-content" id="tab-config">
  <div class="card">
    <h2>Form Settings</h2>
    <div class="form-group">
      <label>Form Title</label>
      <input type="text" id="cfgTitle" value="<?php echo htmlspecialchars($config['title']); ?>">
    </div>
    <div class="form-group">
      <label>Form Description</label>
      <textarea id="cfgDesc" rows="3"><?php echo htmlspecialchars($config['description']); ?></textarea>
    </div>
    <button class="btn btn-success" onclick="saveConfig()">Save Settings</button>
  </div>
</div>

<!-- SUBMISSIONS TAB -->
<div class="tab-content" id="tab-submissions">
  <div class="search-bar">
    <input type="text" id="searchInput" placeholder="Search submissions..." oninput="filterTable()">
  </div>
  <div id="submissionsArea">
    <div class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
      <h3>Loading submissions...</h3>
    </div>
  </div>
</div>

<!-- DETAIL MODAL -->
<div class="modal-overlay" id="modal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal()">&times;</button>
    <h2 id="modalTitle">Submission Details</h2>
    <div class="modal-grid" id="modalBody"></div>
  </div>
</div>

<!-- TOAST -->
<div class="toast" id="toast"></div>

<script>
var config = <?php echo json_encode($config, JSON_UNESCAPED_UNICODE); ?>;
var submissions = [];

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(function(b,i){b.classList.remove('active')});
  document.querySelectorAll('.tab-content').forEach(function(c){c.classList.remove('active')});
  var tabs = {builder:0,config:1,submissions:2};
  document.querySelectorAll('.tab-btn')[tabs[name]].classList.add('active');
  document.getElementById('tab-'+name).classList.add('active');
  if (name==='submissions') loadSubmissions();
}

function toggleOptions() {
  var t = document.getElementById('fType').value;
  var show = (t==='select'||t==='radio'||t==='checkbox');
  document.getElementById('optionsGroup').style.display = show ? 'block' : 'none';
}

function showToast(msg, type) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast toast-' + type + ' show';
  setTimeout(function(){ el.classList.remove('show'); }, 3000);
}

function renderFields() {
  var list = document.getElementById('fieldList');
  if (!config.fields || !config.fields.length) {
    list.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 11v6M9 14h6"/></svg><h3>No fields configured</h3><p>Add fields above to build your feedback form.</p></div>';
    document.getElementById('statFields').textContent = '0';
    return;
  }
  document.getElementById('statFields').textContent = config.fields.length;
  var h = '';
  config.fields.forEach(function(f, i) {
    var opts = f.options ? 'Options: ' + f.options : '';
    var req = f.required ? ' • Required' : '';
    h += '<div class="field-item" data-id="'+f.id+'">';
    h += '  <span class="field-type">'+f.type.toUpperCase()+'</span>';
    h += '  <div class="field-info"><div class="field-label">'+esc(f.label)+'</div><div class="field-meta">'+esc(f.type)+req+(opts?' • '+esc(opts):'')+'</div></div>';
    h += '  <div class="field-actions">';
    if (i > 0) h += '    <button class="btn btn-outline btn-sm" onclick="moveField('+i+',-1)">▲</button>';
    if (i < config.fields.length-1) h += '    <button class="btn btn-outline btn-sm" onclick="moveField('+i+',1)">▼</button>';
    h += '    <button class="btn btn-danger btn-sm" onclick="deleteField('+i+')">Delete</button>';
    h += '  </div>';
    h += '</div>';
  });
  list.innerHTML = h;
}

function esc(s) {
  if (!s) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function addField() {
  var label = document.getElementById('fLabel').value.trim();
  if (!label) { showToast('Label is required','error'); return; }
  var field = {
    id: 'field_' + Date.now(),
    label: label,
    type: document.getElementById('fType').value,
    options: document.getElementById('fOptions').value.trim(),
    required: document.getElementById('fRequired').checked,
    placeholder: document.getElementById('fPlaceholder').value.trim()
  };
  config.fields.push(field);
  saveFieldsToServer(function(){
    renderFields();
    document.getElementById('fLabel').value='';
    document.getElementById('fOptions').value='';
    document.getElementById('fPlaceholder').value='';
    document.getElementById('fRequired').checked=false;
    showToast('Field added','success');
  });
}

function deleteField(idx) {
  if (!confirm('Delete "'+config.fields[idx].label+'"?')) return;
  config.fields.splice(idx, 1);
  saveFieldsToServer(function(){ renderFields(); showToast('Field deleted','success'); });
}

function moveField(idx, dir) {
  var newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= config.fields.length) return;
  var tmp = config.fields[idx];
  config.fields[idx] = config.fields[newIdx];
  config.fields[newIdx] = tmp;
  saveFieldsToServer(function(){ renderFields(); });
}

function saveFieldsToServer(cb) {
  fetch('api/feedback.php?action=config', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(config)
  })
  .then(function(r){ return r.json(); })
  .then(function(d){
    if (d.success) { if(cb) cb(); }
    else { showToast(d.error||'Save failed','error'); }
  })
  .catch(function(){ showToast('Network error','error'); });
}

function saveConfig() {
  config.title = document.getElementById('cfgTitle').value.trim() || 'Feedback Form';
  config.description = document.getElementById('cfgDesc').value.trim();
  saveFieldsToServer(function(){ showToast('Settings saved','success'); });
}

function loadSubmissions() {
  fetch('api/feedback.php?action=submissions')
  .then(function(r){ return r.json(); })
  .then(function(d){
    submissions = Array.isArray(d) ? d : [];
    submissions.reverse();
    var today = new Date().toISOString().slice(0,10);
    var todayCount = submissions.filter(function(s){ return (s.submitted_at||'').indexOf(today)===0; }).length;
    document.getElementById('statTotal').textContent = submissions.length;
    document.getElementById('statToday').textContent = todayCount;
    document.getElementById('subCount').textContent = submissions.length + ' submissions';
    renderSubmissions();
  })
  .catch(function(){
    document.getElementById('submissionsArea').innerHTML = '<div class="empty"><h3>Failed to load submissions</h3></div>';
  });
}

function renderSubmissions() {
  var area = document.getElementById('submissionsArea');
  if (!submissions.length) {
    area.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg><h3>No submissions yet</h3><p>Responses submitted through the feedback form will appear here.</p></div>';
    return;
  }
  var h = '<table id="submissionsTable"><thead><tr><th>#</th><th>Date</th><th>Preview</th><th>Action</th></tr></thead><tbody>';
  submissions.forEach(function(s, i) {
    var preview = '—';
    if (s.answers) {
      var keys = Object.keys(s.answers);
      if (keys.length) preview = esc(String(s.answers[keys[0]]).substring(0, 60));
    }
    h += '<tr>';
    h += '<td>'+(i+1)+'</td>';
    h += '<td style="white-space:nowrap">'+esc(s.submitted_at||'—')+'</td>';
    h += '<td>'+preview+'</td>';
    h += '<td><button class="btn btn-primary btn-sm" onclick="viewSubmission('+i+')">View</button></td>';
    h += '</tr>';
  });
  h += '</tbody></table>';
  area.innerHTML = h;
}

function viewSubmission(idx) {
  var s = submissions[idx];
  if (!s) return;
  document.getElementById('modalTitle').textContent = 'Submission — ' + (s.submitted_at||'');
  var h = '';
  h += sec('Submission Info');
  h += row('ID', s.id);
  h += row('Submitted At', s.submitted_at);
  h += sec('Answers');
  if (config.fields && config.fields.length) {
    config.fields.forEach(function(f) {
      var val = s.answers ? s.answers[f.id] : '';
      if (f.type==='checkbox' && Array.isArray(val)) val = val.join(', ');
      h += row(f.label + (f.required?' *':''), val || '—');
    });
  } else if (s.answers) {
    Object.keys(s.answers).forEach(function(k){
      var v = s.answers[k];
      if (Array.isArray(v)) v = v.join(', ');
      h += row(k, v || '—');
    });
  }
  if (s.files && Object.keys(s.files).length) {
    h += sec('Uploaded Files');
    Object.keys(s.files).forEach(function(k){
      var path = s.files[k];
      h += '<div class="modal-field" style="border-bottom:none"><div class="lbl">'+esc(k)+'</div><div class="files-grid"><a href="../'+esc(path)+'" target="_blank">📄 View File</a></div></div>';
    });
  }
  document.getElementById('modalBody').innerHTML = h;
  document.getElementById('modal').classList.add('active');
}

function closeModal(){ document.getElementById('modal').classList.remove('active'); }
document.getElementById('modal').addEventListener('click', function(e){ if(e.target===this) closeModal(); });
function sec(t){ return '<div class="modal-section">'+t+'</div>'; }
function row(l,v){ return '<div class="modal-field"><div class="lbl">'+l+'</div><div class="val">'+(v||'—')+'</div></div>'; }

function filterTable() {
  var q = document.getElementById('searchInput').value.toLowerCase();
  var rows = document.querySelectorAll('#submissionsTable tbody tr');
  rows.forEach(function(r){ r.style.display = r.textContent.toLowerCase().indexOf(q)>-1 ? '' : 'none'; });
}

renderFields();
</script>
</body>
</html>
