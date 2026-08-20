<?php
$submissionsFile = dirname(__DIR__) . '/api/submissions.json';
$submissions = [];

if (file_exists($submissionsFile)) {
    $raw = file_get_contents($submissionsFile);
    $submissions = json_decode($raw, true);
    if (!is_array($submissions)) $submissions = [];
}

$submissions = array_reverse($submissions);

function val($arr, $key, $default = '—') {
    return !empty($arr[$key]) ? htmlspecialchars($arr[$key]) : $default;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admission Submissions — PCM Admin</title>
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
.badge-bba{background:#dbeafe;color:#1e40af}
.badge-bcsit{background:#d1fae5;color:#065f46}
.badge-bba-fin{background:#fef3c7;color:#92400e}
.badge-morning{background:#e0e7ff;color:#3730a3}
.badge-day{background:#fce7f3;color:#9d174d}
.btn{padding:6px 14px;border:none;border-radius:6px;cursor:pointer;font-size:.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
.btn-primary{background:#21409A;color:#fff}
.btn-primary:hover{background:#1a327a}
.btn-danger{background:#e53e3e;color:#fff}
.btn-danger:hover{background:#c53030}
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
@media(max-width:768px){
  .modal-grid{grid-template-columns:1fr}
  table{font-size:.8rem}
  td,th{padding:8px 10px}
}
</style>
</head>
<body>

<div class="header">
  <h1>📋 Admission Submissions</h1>
  <div>
    <span class="count"><?php echo count($submissions); ?> total</span>
    <a href="../admission.html" class="btn btn-primary" style="margin-left:12px">← Back to Form</a>
  </div>
</div>

<?php
$bba = 0; $bcsit = 0; $bbaFin = 0; $morning = 0; $day = 0;
foreach ($submissions as $s) {
    if ($s['program_name'] === 'bba') $bba++;
    if ($s['program_name'] === 'bcsit') $bcsit++;
    if ($s['program_name'] === 'bba-finance') $bbaFin++;
    if ($s['shift'] === 'morning') $morning++;
    if ($s['shift'] === 'day') $day++;
}
?>
<div class="stats">
  <div class="stat-card"><div class="num"><?php echo count($submissions); ?></div><div class="label">Total Applications</div></div>
  <div class="stat-card"><div class="num"><?php echo $bba; ?></div><div class="label">BBA</div></div>
  <div class="stat-card"><div class="num"><?php echo $bbaFin; ?></div><div class="label">BBA-Finance</div></div>
  <div class="stat-card"><div class="num"><?php echo $bcsit; ?></div><div class="label">BCSIT</div></div>
  <div class="stat-card"><div class="num"><?php echo $morning; ?></div><div class="label">Morning Shift</div></div>
  <div class="stat-card"><div class="num"><?php echo $day; ?></div><div class="label">Day Shift</div></div>
</div>

<div class="search-bar">
  <input type="text" id="searchInput" placeholder="Search by name, email, phone, program..." oninput="filterTable()">
</div>

<?php if (empty($submissions)): ?>
<div class="empty">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
  <h3>No submissions yet</h3>
  <p>Applications submitted through the admission form will appear here.</p>
</div>
<?php else: ?>
<table id="submissionsTable">
  <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <th>Program</th>
      <th>Shift</th>
      <th>Phone</th>
      <th>Email</th>
      <th>Date</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  <?php foreach ($submissions as $i => $s): ?>
    <tr>
      <td><?php echo $i + 1; ?></td>
      <td><b><?php echo val($s, 'name'); ?></b></td>
      <td>
        <?php
          $prog = $s['program_name'] ?? '';
          $cls = 'badge-bba';
          $lbl = strtoupper($prog);
          if ($prog === 'bcsit') { $cls = 'badge-bcsit'; $lbl = 'BCSIT'; }
          if ($prog === 'bba-finance') { $cls = 'badge-bba-fin'; $lbl = 'BBA-FIN'; }
          if ($prog === 'bba') { $lbl = 'BBA'; }
        ?>
        <span class="badge <?php echo $cls; ?>"><?php echo $lbl; ?></span>
      </td>
      <td>
        <span class="badge <?php echo ($s['shift'] ?? '') === 'morning' ? 'badge-morning' : 'badge-day'; ?>">
          <?php echo ucfirst(val($s, 'shift')); ?>
        </span>
      </td>
      <td><?php echo val($s, 'phone'); ?></td>
      <td><?php echo val($s, 'email'); ?></td>
      <td style="white-space:nowrap"><?php echo val($s, 'submitted_at'); ?></td>
      <td><button class="btn btn-primary" onclick="viewDetail(<?php echo $i; ?>)">View</button></td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
<?php endif; ?>

<div class="modal-overlay" id="modal">
  <div class="modal">
    <button class="modal-close" onclick="closeModal()">&times;</button>
    <h2 id="modalTitle">Application Details</h2>
    <div class="modal-grid" id="modalBody"></div>
  </div>
</div>

<script>
var data = <?php echo json_encode($submissions, JSON_UNESCAPED_UNICODE); ?>;

function viewDetail(idx) {
  var s = data[idx];
  if (!s) return;
  document.getElementById('modalTitle').textContent = (s.name||'Applicant') + ' — Application Details';
  var h = '';
  h += sec('Personal Information');
  h += row('Programme', fmtProg(s.program_name));
  h += row('Shift', (s.shift||'—').charAt(0).toUpperCase()+(s.shift||'').slice(1));
  h += row('Full Name', s.name);
  h += row('Gender', (s.gender||'—').charAt(0).toUpperCase()+(s.gender||'').slice(1));
  h += row('Date of Birth', (s.dob||'—')+' ('+((s.date_option||'bs').toUpperCase())+')');
  h += row('Nationality', s.nationality);
  h += row('Phone', s.phone);
  h += row('Personal Contact', s.personal_contact);
  h += row('Email', s.email);
  if (s.guardian_type) {
    h += row('Guardian Type', s.guardian_type.charAt(0).toUpperCase()+s.guardian_type.slice(1));
    if (s.guardian_type==='father') { h += row("Father's Name", s.father_name); h += row("Father's Phone", s.father_phone); }
    if (s.guardian_type==='mother') { h += row("Mother's Name", s.mother_name); h += row("Mother's Phone", s.mother_phone); }
    if (s.guardian_type==='guardian') { h += row("Guardian", s.guardian_name); h += row("Phone", s.guardian_phone); h += row("Relationship", s.relationship); }
  }
  h += sec('Address');
  h += row('Permanent', [s.permanent_province,s.permanent_district,s.permanent_city,'Ward '+s.permanent_ward].filter(Boolean).join(', '));
  h += row('Temporary', [s.temporary_province,s.temporary_district,s.temporary_city,'Ward '+s.temporary_ward].filter(Boolean).join(', '));
  h += sec('Academic Information');
  h += row('SEE Board', fmtBoard(s.see_bod));
  h += row('SEE School', s.see_school);
  h += row('SEE GPA / Year', [s.see_gpa, s.see_year].filter(Boolean).join(' · '));
  h += row('SEE Marks', [s.see_full_mark, s.see_mark_obtained, s.see_percentage_obtained?s.see_percentage_obtained+'%':null].filter(Boolean).join(' / '));
  h += row('+2 Board', fmtBoard(s.intermediate_bod));
  h += row('+2 College', s.intermediate_school);
  h += row('+2 GPA / Year', [s.intermediate_gpa, s.intermediate_year].filter(Boolean).join(' · '));
  h += row('+2 Marks', [s.intermediate_full_mark, s.intermediate_mark_obtained, s.intermediate_percentage_obtained?s.intermediate_percentage_obtained+'%':null].filter(Boolean).join(' / '));
  h += sec('Documents & Payment');
  if (s.profile) h += row('Profile Photo', '<a href="../'+s.profile+'" target="_blank">View</a>');
  if (s.documents && s.documents.length) {
    h += '<div class="modal-field" style="border-bottom:none"><div class="lbl">Documents ('+s.documents.length+')</div><div class="files-grid">';
    s.documents.forEach(function(d,i){ h += '<a href="../'+d+'" target="_blank">📄 Doc '+(i+1)+'</a>'; });
    h += '</div></div>';
  }
  if (s.payments && s.payments.length) {
    h += '<div class="modal-field" style="border-bottom:none"><div class="lbl">Payment Slips ('+s.payments.length+')</div><div class="files-grid">';
    s.payments.forEach(function(d,i){ h += '<a href="../'+d+'" target="_blank">💰 Slip '+(i+1)+'</a>'; });
    h += '</div></div>';
  }
  h += sec('Submission Info');
  h += row('Reference ID', s.id);
  h += row('Submitted At', s.submitted_at);
  h += row('Declaration Date', s.date);
  document.getElementById('modalBody').innerHTML = h;
  document.getElementById('modal').classList.add('active');
}
function closeModal(){document.getElementById('modal').classList.remove('active');}
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeModal();});
function sec(t){return '<div class="modal-section">'+t+'</div>';}
function row(l,v){return '<div class="modal-field"><div class="lbl">'+l+'</div><div class="val">'+(v||'—')+'</div></div>';}
function fmtProg(p){return p==='bba'?'BBA':p==='bcsit'?'BCSIT':p==='bba-finance'?'BBA-Finance':p||'—';}
function fmtBoard(b){return b==='neb'?'NEB':b==='hseb'?'HSEB':b==='cie'?'CIE':b==='other'?'Other':b||'—';}
function filterTable(){
  var q=document.getElementById('searchInput').value.toLowerCase();
  var rows=document.querySelectorAll('#submissionsTable tbody tr');
  rows.forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?'':'none';});
}
</script>
</body>
</html>
