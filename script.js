const createModal=document.getElementById('createModal');
const joinModal=document.getElementById('joinModal');
const toast=document.getElementById('toast');
document.getElementById('year').textContent=new Date().getFullYear();

function openModal(modal){if(!modal)return;modal.hidden=false;document.body.style.overflow='hidden'}
function closeModal(modal){if(!modal)return;modal.hidden=true;document.body.style.overflow=''}
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500)}

document.querySelectorAll('[data-action="create"]').forEach(btn=>btn.addEventListener('click',()=>openModal(createModal)));
document.querySelectorAll('[data-action="join"]').forEach(btn=>btn.addEventListener('click',()=>openModal(joinModal)));
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.closest('.modal-backdrop'))));
[createModal,joinModal].forEach(modal=>modal?.addEventListener('click',e=>{if(e.target===modal)closeModal(modal)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal(createModal);closeModal(joinModal)}});

function makeCode(sport){const prefix=(sport||'GRP').replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase()||'GRP';return `${prefix}-${Math.floor(1000+Math.random()*9000)}`}

const groupForm=document.getElementById('groupForm');
const groupTypeSelect=groupForm?.querySelector('select[name="groupType"]');
const sportSelect=groupForm?.querySelector('select[name="sport"]');
const sportLabel=sportSelect?.closest('label');
const firstFormRow=groupTypeSelect?.closest('.form-row');
const sportSetup=document.createElement('div');
sportSetup.className='sport-specific-setup';
sportSetup.hidden=true;
firstFormRow?.insertAdjacentElement('afterend',sportSetup);

function prependPlaceholder(select,text){if(!select||select.querySelector('option[value=""]'))return;const opt=document.createElement('option');opt.value='';opt.textContent=text;opt.selected=true;opt.disabled=true;select.prepend(opt)}
prependPlaceholder(groupTypeSelect,'Select group type');
prependPlaceholder(sportSelect,'Select a sport');

const sportFields={
 'Badminton':[['Usual courts','usualCourts','number','2'],['Players per court','playersPerCourtSetup','number','4'],['Court booking cost ($)','courtBookingCost','number','64.00'],['Shuttle tube cost ($)','shuttleTubeCost','number','36.00'],['Shuttles per tube','shuttlesPerTube','number','12']],
 'Football / Soccer':[['Pitch / field','playingArea','text','e.g. Full field'],['Team size','teamSize','number','11'],['Pitch hire cost ($)','venueCost','number','0.00'],['Number of teams','teamCount','number','2']],
 'Cricket':[['Format','format','text','e.g. T20'],['Players per side','teamSize','number','11'],['Ground fee ($)','venueCost','number','0.00'],['Equipment cost ($)','equipmentCost','number','0.00']],
 'Tennis':[['Usual courts','usualCourts','number','1'],['Match type','format','text','Singles / Doubles'],['Court booking cost ($)','courtBookingCost','number','0.00'],['Ball cost ($)','equipmentCost','number','0.00']],
 'Table Tennis':[['Usual tables','usualTables','number','2'],['Players per table','playersPerTable','number','4'],['Venue fee ($)','venueCost','number','0.00'],['Ball/equipment cost ($)','equipmentCost','number','0.00']],
 'Basketball':[['Usual courts','usualCourts','number','1'],['Team size','teamSize','number','5'],['Court hire cost ($)','courtBookingCost','number','0.00'],['Number of teams','teamCount','number','2']],
 'Volleyball':[['Usual courts','usualCourts','number','1'],['Team size','teamSize','number','6'],['Court/ground cost ($)','venueCost','number','0.00'],['Number of teams','teamCount','number','2']],
 'Hockey':[['Usual field','playingArea','text','Field name/type'],['Team size','teamSize','number','11'],['Field hire cost ($)','venueCost','number','0.00'],['Equipment cost ($)','equipmentCost','number','0.00']],
 'Futsal':[['Usual court','playingArea','text','Court name/type'],['Team size','teamSize','number','5'],['Court hire cost ($)','venueCost','number','0.00'],['Number of teams','teamCount','number','2']],
 'Squash':[['Usual courts','usualCourts','number','1'],['Players per court','playersPerCourtSetup','number','2'],['Court cost ($)','courtBookingCost','number','0.00']],
 'Running':[['Usual distance','distance','text','e.g. 5 km'],['Meeting point','meetingPoint','text','Start location']],
 'Swimming':[['Pool / venue','playingArea','text','Pool name'],['Lane booking cost ($)','venueCost','number','0.00'],['Usual lanes','usualLanes','number','1']],
 'Golf':[['Course','playingArea','text','Course name'],['Green fee ($)','venueCost','number','0.00'],['Players per group','playersPerGroup','number','4']],
 'Other / Custom':[['Activity setup','customSetup','text','Describe what should be tracked'],['Venue/equipment cost ($)','venueCost','number','0.00']]
};

function renderSportFields(){const sport=sportSelect?.value;sportSetup.innerHTML='';if(!sport){sportSetup.hidden=true;return}const title=document.createElement('div');title.className='sport-setup-title';title.innerHTML=`<span>SPORT SETUP</span><strong>${sport}</strong><small>Only relevant fields for this sport are shown.</small>`;sportSetup.appendChild(title);const grid=document.createElement('div');grid.className='sport-setup-grid';(sportFields[sport]||sportFields['Other / Custom']).forEach(([label,name,type,placeholder])=>{const wrap=document.createElement('label');wrap.textContent=label;const input=document.createElement('input');input.name=name;input.type=type;input.placeholder=placeholder;input.dataset.sportField='true';if(type==='number'){input.min='0';input.step='any'}wrap.appendChild(input);grid.appendChild(wrap)});sportSetup.appendChild(grid);sportSetup.hidden=false}

function updateGroupTypeFlow(){if(!groupTypeSelect||!sportSelect||!sportLabel)return;const isSports=groupTypeSelect.value==='Sports group';sportLabel.hidden=!isSports;sportSelect.disabled=!isSports;sportSelect.required=isSports;if(!isSports){sportSelect.value='';sportSetup.hidden=true;sportSetup.innerHTML=''}}

groupTypeSelect?.addEventListener('change',updateGroupTypeFlow);
sportSelect?.addEventListener('change',renderSportFields);
if(groupTypeSelect){groupTypeSelect.closest('label')?.insertAdjacentHTML('afterbegin','<span class="field-step">STEP 1</span>')}
if(sportLabel){sportLabel.insertAdjacentHTML('afterbegin','<span class="field-step">STEP 2</span>')}
updateGroupTypeFlow();

groupForm?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);const sportSetupData={};e.target.querySelectorAll('[data-sport-field]').forEach(input=>sportSetupData[input.name]=input.value);const group={id:makeCode(form.get('sport')),name:form.get('name'),groupType:form.get('groupType'),sport:form.get('sport')||null,sportSetup:sportSetupData,venue:form.get('venue'),frequency:form.get('frequency'),capacity:form.get('capacity'),reminder:form.get('reminder'),rsvpOptions:form.get('rsvpOptions'),ownerRole:'Owner',createdAt:new Date().toISOString()};const groups=JSON.parse(localStorage.getItem('eventmate-groups')||'[]');groups.push(group);localStorage.setItem('eventmate-groups',JSON.stringify(groups));closeModal(createModal);e.target.reset();if(groupTypeSelect)groupTypeSelect.value='';if(sportSelect)sportSelect.value='';updateGroupTypeFlow();showToast(`${group.name} created · Invite code ${group.id}`)});

document.getElementById('joinForm')?.addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);const code=form.get('code').trim().toUpperCase();const memberName=form.get('memberName').trim();const groups=JSON.parse(localStorage.getItem('eventmate-groups')||'[]');const found=groups.find(group=>group.id===code);closeModal(joinModal);e.target.reset();showToast(found?`${memberName} joined ${found.name}`:`No demo group found for ${code}`)});

function money(n){return `$${Number(n||0).toFixed(2)}`}
function updateCalculator(){const courtCost=parseFloat(document.getElementById('courtCost')?.value)||0;const tubeCost=parseFloat(document.getElementById('tubeCost')?.value)||0;const tubeQty=Math.max(1,parseFloat(document.getElementById('tubeQty')?.value)||1);const shuttlesUsed=Math.max(0,parseFloat(document.getElementById('shuttlesUsed')?.value)||0);const players=Math.max(1,parseFloat(document.getElementById('players')?.value)||1);const perShuttle=tubeCost/tubeQty;const shuttleSession=perShuttle*shuttlesUsed;const totalSession=courtCost+shuttleSession;const playerShare=totalSession/players;document.getElementById('perShuttle').textContent=money(perShuttle);document.getElementById('shuttleSession').textContent=money(shuttleSession);document.getElementById('totalSession').textContent=money(totalSession);document.getElementById('playerShare').textContent=money(playerShare)}
['courtCost','tubeCost','tubeQty','shuttlesUsed','players'].forEach(id=>document.getElementById(id)?.addEventListener('input',updateCalculator));
updateCalculator();

document.querySelectorAll('.approve').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.payment-item');const name=item.querySelector('strong').textContent;item.style.opacity='.55';item.querySelector('.approval-actions').innerHTML='<span class="paid">Approved</span>';showToast(`${name}'s payment approved`)}));
document.querySelectorAll('.reject').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.payment-item');const name=item.querySelector('strong').textContent;item.style.opacity='.55';item.querySelector('.approval-actions').innerHTML='<span class="due">Rejected</span>';showToast(`${name}'s payment marked for review`)}));
document.querySelectorAll('.proof-btn').forEach(btn=>btn.addEventListener('click',()=>showToast('Payment proof preview will open here in the connected version.')));

let rsvpState={yes:8,maybe:1,no:2,waiting:3,myResponse:'yes'};
function updateRsvp(){document.getElementById('yesCount').textContent=rsvpState.yes;document.getElementById('maybeCount').textContent=rsvpState.maybe;document.getElementById('noCount').textContent=rsvpState.no;document.getElementById('waitingCount').textContent=rsvpState.waiting;const ppc=parseInt(document.getElementById('playersPerCourt')?.value)||4;const courts=Math.max(1,Math.ceil(rsvpState.yes/ppc));document.getElementById('courtSuggestion').textContent=`${courts} court${courts===1?'':'s'}`;document.getElementById('courtRule').textContent=`Based on ${rsvpState.yes} confirmed players · ${ppc} players per court`;document.getElementById('heroCount').textContent=`${rsvpState.yes} playing`;document.getElementById('heroPlaying').textContent=rsvpState.yes;document.getElementById('heroCourtCount').textContent=courts;document.getElementById('heroCourts').textContent=`${courts} court${courts===1?'':'s'} suggested`}
function setMyRsvp(next){if(next===rsvpState.myResponse)return;const prev=rsvpState.myResponse;if(prev&&rsvpState[prev]>0)rsvpState[prev]--;else if(rsvpState.waiting>0)rsvpState.waiting--;rsvpState[next]++;rsvpState.myResponse=next;document.querySelectorAll('.rsvp-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.rsvp===next));const labels={yes:'Yes',maybe:'Maybe',no:'No'};document.getElementById('responseNote').innerHTML=`Your response: <strong>${labels[next]}</strong> · You can change it until RSVP closes.`;updateRsvp();showToast(`RSVP updated to ${labels[next]}`)}
document.querySelectorAll('.rsvp-btn').forEach(btn=>btn.addEventListener('click',()=>setMyRsvp(btn.dataset.rsvp)));
document.getElementById('playersPerCourt')?.addEventListener('change',updateRsvp);
updateRsvp();
