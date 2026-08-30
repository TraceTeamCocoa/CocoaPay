const sectionTitles = {
  dashboard: "Dashboard",
  nuevaCompra: "Nueva compra",
  productores: "Productores",
  empresa: "Empresa",
  historial: "Historial de compras",
  configuracion: "Configuración"
};

function mostrarSeccion(nombre) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`section-${nombre}`)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.section === nombre));
  const title = document.getElementById('pageTitle');
  if (title) title.textContent = sectionTitles[nombre] || 'Dashboard';
  if (nombre === 'productores') renderProductoresTable();
  if (nombre === 'dashboard') actualizarDashboard();
}

function renderProductoresTable() {
  const body = document.getElementById('producerTable');
  if (!body || typeof productores === 'undefined') return;
  body.innerHTML = '';
  productores.forEach(p => {
    const tr = document.createElement('tr');
    [p.codigo, p.nombre].forEach(v => { const td=document.createElement('td'); td.textContent=v; tr.appendChild(td); });
    body.appendChild(tr);
  });
  const count = document.getElementById('producerCount');
  if (count) count.textContent = productores.length.toLocaleString('es-EC');
}

function actualizarDashboard() {
  const next = document.getElementById('kpiNext');
  if (next && typeof obtenerNumeroFactura === 'function') { const parts=obtenerNumeroFactura().split('-'); next.textContent=parts[2]||obtenerNumeroFactura(); const kp=document.getElementById('kpiPrefix'); if(kp) kp.textContent=parts.slice(0,2).join('-'); }
  const pc = document.getElementById('kpiProducers');
  if (pc && typeof productores !== 'undefined') pc.textContent = productores.length.toLocaleString('es-EC');
  const list = typeof compras !== 'undefined' ? compras : [];
  const count = document.getElementById('kpiPurchases');
  if (count) count.textContent = list.length.toLocaleString('es-EC');
  const weight = list.reduce((s,c)=>s+Number(c.peso_neto_qq||0),0);
  const total = list.reduce((s,c)=>s+Number(c.total||0),0);
  const kw=document.getElementById('kpiWeight'); if(kw) kw.textContent=`${weight.toFixed(2)} QQ`;
  const kt=document.getElementById('kpiTotal'); if(kt) kt.textContent=`$ ${total.toFixed(2)}`;
  const body=document.getElementById('dashboardRecent');
  if(body){ body.innerHTML=''; [...list].reverse().slice(0,6).forEach(c=>{const tr=document.createElement('tr'); [c.numero_comprobante,c.fecha,c.productor,`${Number(c.peso_neto_qq||0).toFixed(2)} QQ`,`$ ${Number(c.total||0).toFixed(2)}`].forEach(v=>{const td=document.createElement('td');td.textContent=v??'';tr.appendChild(td)});body.appendChild(tr);}); if(!list.length){body.innerHTML='<tr><td colspan="5" class="empty">No hay compras registradas todavía.</td></tr>';}}
}

function actualizarEncabezado() {
  const el=document.getElementById('topCompany');
  if(el && typeof empresa !== 'undefined') el.textContent=empresa.nombreComercial || empresa.razonSocial || 'Empresa emisora';
  const d=document.getElementById('topDate');
  if(d) d.textContent=new Date().toLocaleDateString('es-EC',{day:'2-digit',month:'2-digit',year:'numeric'});
}

function inicializarDashboard() {
  document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>mostrarSeccion(btn.dataset.section)));
  document.querySelectorAll('[data-go]').forEach(btn=>btn.addEventListener('click',()=>mostrarSeccion(btn.dataset.go)));
  document.getElementById('btnMenu')?.addEventListener('click',()=>document.getElementById('sidebar')?.classList.toggle('open'));
  actualizarEncabezado(); actualizarDashboard(); renderProductoresTable();
}
