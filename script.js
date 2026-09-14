const createModal=document.getElementById('createModal');
const joinModal=document.getElementById('joinModal');
const toast=document.getElementById('toast');

document.getElementById('year').textContent=new Date().getFullYear();

function openModal(modal){modal.hidden=false;document.body.style.overflow='hidden'}
function closeModal(modal){modal.hidden=true;document.body.style.overflow=''}
function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}

document.querySelectorAll('[data-action="create"]').forEach(btn=>btn.addEventListener('click',()=>openModal(createModal)));
document.querySelectorAll('[data-action="join"]').forEach(btn=>btn.addEventListener('click',()=>openModal(joinModal)));
document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.closest('.modal-backdrop'))));
[createModal,joinModal].forEach(modal=>modal.addEventListener('click',e=>{if(e.target===modal)closeModal(modal)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!createModal.hidden)closeModal(createModal);if(!joinModal.hidden)closeModal(joinModal)}});

function makeCode(sport){const prefix=(sport||'GRP').replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase()||'GRP';return `${prefix}-${Math.floor(1000+Math.random()*9000)}`}

document.getElementById('groupForm').addEventListener('submit',e=>{
  e.preventDefault();
  const form=new FormData(e.target);
  const group={
    id:makeCode(form.get('sport')),
    name:form.get('name'),
    groupType:form.get('groupType'),
    sport:form.get('sport'),
    venue:form.get('venue'),
    frequency:form.get('frequency'),
    capacity:form.get('capacity'),
    ownerRole:'Owner',
    createdAt:new Date().toISOString()
  };
  const groups=JSON.parse(localStorage.getItem('eventmate-groups')||'[]');
  groups.push(group);
  localStorage.setItem('eventmate-groups',JSON.stringify(groups));
  closeModal(createModal);e.target.reset();
  showToast(`${group.name} created · Invite code ${group.id}`);
});

document.getElementById('joinForm').addEventListener('submit',e=>{
  e.preventDefault();
  const form=new FormData(e.target);
  const code=form.get('code').trim().toUpperCase();
  const memberName=form.get('memberName').trim();
  const groups=JSON.parse(localStorage.getItem('eventmate-groups')||'[]');
  const found=groups.find(group=>group.id===code);
  closeModal(joinModal);e.target.reset();
  showToast(found?`${memberName} joined ${found.name}`:`No demo group found for ${code}`);
});

const calculatorIds=['courtCost','tubeCost','tubeQty','shuttlesUsed','players'];
function money(n){return `$${Number(n||0).toFixed(2)}`}
function updateCalculator(){
  const courtCost=parseFloat(document.getElementById('courtCost').value)||0;
  const tubeCost=parseFloat(document.getElementById('tubeCost').value)||0;
  const tubeQty=Math.max(1,parseFloat(document.getElementById('tubeQty').value)||1);
  const shuttlesUsed=Math.max(0,parseFloat(document.getElementById('shuttlesUsed').value)||0);
  const players=Math.max(1,parseFloat(document.getElementById('players').value)||1);
  const perShuttle=tubeCost/tubeQty;
  const shuttleSession=perShuttle*shuttlesUsed;
  const totalSession=courtCost+shuttleSession;
  const playerShare=totalSession/players;
  document.getElementById('perShuttle').textContent=money(perShuttle);
  document.getElementById('shuttleSession').textContent=money(shuttleSession);
  document.getElementById('totalSession').textContent=money(totalSession);
  document.getElementById('playerShare').textContent=money(playerShare);
}
calculatorIds.forEach(id=>document.getElementById(id)?.addEventListener('input',updateCalculator));
updateCalculator();

document.querySelectorAll('.approve').forEach(btn=>btn.addEventListener('click',()=>{
  const item=btn.closest('.payment-item');
  const name=item.querySelector('strong').textContent;
  item.style.opacity='.45';
  item.querySelector('.approval-actions').innerHTML='<span class="paid">Approved</span>';
  showToast(`${name}'s payment approved`);
}));

document.querySelectorAll('.reject').forEach(btn=>btn.addEventListener('click',()=>{
  const item=btn.closest('.payment-item');
  const name=item.querySelector('strong').textContent;
  item.style.opacity='.55';
  item.querySelector('.approval-actions').innerHTML='<span class="due">Rejected</span>';
  showToast(`${name}'s payment marked for review`);
}));

document.querySelectorAll('.proof-btn').forEach(btn=>btn.addEventListener('click',()=>showToast('Payment screenshot preview will open here in the connected version.')));