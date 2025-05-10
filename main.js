import { h, render } from "preact";
import { useState } from "preact/hooks";
import htm from "htm";
const html = htm.bind(h);

// Icon Image Assets
const icons = {
  azucar: "https://cdn-icons-png.flaticon.com/512/5939/5939845.png",
  imc: "https://img.icons8.com/ios-filled/48/609aff/scales.png",
  medic: "https://img.icons8.com/ios-filled/48/609aff/pill.png",
  pasos: "https://img.icons8.com/ios-filled/48/609aff/walking.png",
  agua: "https://img.icons8.com/ios-filled/48/609aff/cup.png"
};

function Card({ icon, title, subtext, onClick }) {
  return html`
    <div class="card" onClick=${onClick}>
      <img src=${icon} />
      <div class="card-content">
        <div class="card-title">${title}</div>
        ${subtext && html`<div class="card-subtext">${subtext}</div>`}
      </div>
    </div>
  `;
}

function BottomNav() {
  return html`
    <nav class="bottom-nav">
      <span class="bottom-nav-btn">🏠</span>
      <span class="bottom-nav-btn">❤️</span>
      <button class="add-btn">+</button>
      <span class="bottom-nav-btn">📊</span>
      <span class="bottom-nav-btn">⚙️</span>
    </nav>
  `;
}

// Modal components for the different features
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return html`
    <div style="
        position:fixed;top:0;left:0;height:100vh;width:100vw;z-index:9;
        background:rgba(0,0,25,0.07);display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:24px 18px;border-radius:14px;max-width:90vw;box-shadow:0 2px 24px #3551851a;position:relative;">
        <button
          style="position:absolute;top:8px;right:12px;font-size:1.3rem;background:none;border:none;color:#609aff;cursor:pointer"
          onClick=${onClose}>✕</button>
        <div style="margin-bottom:12px;font-weight:600;font-size:1.1rem;color:#609aff">${title}</div>
        ${children}
      </div>
    </div>
  `;
}

function AzucarModal({ open, onClose }) {
  const [nivel, setNivel] = useState("");
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    let msg = "";
    const n = parseFloat(nivel);
    if (nivel === "") msg = "";
    else if (n < 70) msg = "Glucosa baja (Hipoglucemia).";
    else if (n > 180) msg = "Glucosa alta (Hiperglucemia).";
    else msg = "Nivel de glucosa normal.";
    setResult(msg);
  }

  return html`
    <${Modal} open=${open} onClose=${onClose} title="Monitoreo de azúcar en sangre">
      <form onSubmit=${handleSubmit}>
        <label>
          Nivel (mg/dL):<br/>
          <input type="number" value=${nivel} onInput=${e=>setNivel(e.target.value)} min="20" max="500" style="width:80px"/>
        </label>
        <button type="submit" style="margin-left:10px;background:#609aff;color:#fff;border:none;padding:6px 16px;border-radius:8px;">Verificar</button>
      </form>
      ${result && html`<div style="margin-top:10px;font-weight:500;color:#2b449e">${result}</div>`}
    <//>
  `;
}

function ImcModal({ open, onClose }) {
  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");
  const [imc, setImc] = useState(null);

  function handleSubmit(e){
    e.preventDefault();
    const p = parseFloat(peso);
    const eM = parseFloat(estatura) / 100;
    if (!p || !eM) {
      setImc(null);
      return;
    }
    let idx = p / (eM*eM);
    let cat = "";
    if (idx < 18.5) cat = "Bajo peso";
    else if (idx < 25) cat = "Normal";
    else if (idx < 30) cat = "Sobrepeso";
    else cat = "Obesidad";
    setImc(`IMC: ${idx.toFixed(1)} (${cat})`);
  }

  return html`
    <${Modal} open=${open} onClose=${onClose} title="Calculadora de IMC">
      <form onSubmit=${handleSubmit}>
        <label>Peso (kg): <input type="number" value=${peso} onInput=${e=>setPeso(e.target.value)} min="20" style="width:60px"/></label> <br/>
        <label>Estatura (cm): <input type="number" value=${estatura} onInput=${e=>setEstatura(e.target.value)} min="80" style="width:60px"/></label><br/>
        <button type="submit" style="margin-top:7px;background:#609aff;color:#fff;border:none;padding:6px 16px;border-radius:8px;">Calcular</button>
      </form>
      ${imc && html`<div style="margin-top:10px;font-weight:500;color:#2b449e">${imc}</div>`}
    <//>
  `;
}

function MedicModal({ open, onClose }) {
  const [recordatorio, setRecordatorio] = useState("");
  const [lista, setLista] = useState([]);

  function agregar(e){
    e.preventDefault();
    if (!recordatorio.trim()) return;
    setLista([...lista, recordatorio]);
    setRecordatorio("");
  }
  return html`
    <${Modal} open=${open} onClose=${onClose} title="Recordatorio de medicación">
      <form onSubmit=${agregar} style="display:flex;gap:6px;">
        <input
          type="text"
          value=${recordatorio}
          onInput=${e=>setRecordatorio(e.target.value)}
          placeholder="Medicamento o alarma"
          style="flex:1;padding:4px 8px;"/>
        <button style="background:#609aff;color:#fff;border:none;border-radius:6px;padding:4px 10px;">+</button>
      </form>
      <ul style="margin:10px 0 0 0;padding:0;list-style:none;">
        ${lista.map((item,i)=>html`<li key=${i} style="margin:3px 0">${item}</li>`)}
      </ul>
    <//>
  `;
}

function PasosModal({ open, onClose, pasos, setPasos }) {
  const objetivo = 3000;
  return html`
    <${Modal} open=${open} onClose=${onClose} title="Contador de pasos">
      <div>
        <div style="font-size:2rem;color:#609aff;font-weight:600;text-align:center">${pasos}/${objetivo}</div>
        <div style="display:flex;justify-content:center;gap:8px;margin:12px 0;">
          <button onClick=${()=>setPasos(p=>Math.max(p-10,0))} style="background:#e7e9f5;border:none;border-radius:50%;width:40px;height:40px;font-size:1.4rem">-</button>
          <button onClick=${()=>setPasos(p=>p+10)} style="background:#e7e9f5;border:none;border-radius:50%;width:40px;height:40px;font-size:1.4rem">+</button>
        </div>
        <div style="text-align:center;font-size:0.93em;color:#686868">¡Sal a caminar! Objetivo diario: ${objetivo}</div>
      </div>
    <//>
  `;
}

function AguaModal({ open, onClose }) {
  const [vasos, setVasos] = useState(0);
  return html`
    <${Modal} open=${open} onClose=${onClose} title="Recordatorio de agua">
      <div style="text-align:center">
        <div style="font-size:2rem;color:#609aff;font-weight:600;margin-bottom:8px">${vasos} vasos</div>
        <button onClick=${()=>setVasos(v=>v+1)} style="background:#e7e9f5;border:none;border-radius:8px;padding:10px 20px;font-size:1.1rem;color:#474b6c;margin-bottom:10px;">+ 1 vaso</button>
        <button onClick=${()=>setVasos(0)} style="background:#fff;border:1px solid #609aff;color:#609aff;border-radius:8px;padding:7px 14px;">Reiniciar</button>
        <div style="font-size:0.93em;color:#686868;margin-top:8px">Toma entre 6-8 vasos al día</div>
      </div>
    <//>
  `;
}

function App() {
  const [modal, setModal] = useState(null);
  const [pasos, setPasos] = useState(131);

  return html`
    <div>
      <div class="header">Más</div>
      <div class="card-list">
        <${Card}
          icon=${icons.azucar}
          title="Azúcar en la sangre"
          onClick=${()=>setModal('azucar')}
        />
        <${Card}
          icon=${icons.imc}
          title="Calcular IMC"
          onClick=${()=>setModal('imc')}
        />
        <${Card}
          icon=${icons.medic}
          title="Recordatorio de medicación"
          onClick=${()=>setModal('medic')}
        />
        <${Card}
          icon=${icons.pasos}
          title="Contador de pasos"
          onClick=${()=>setModal('pasos')}
          subtext=${`${pasos}/3000`}
        />
        <${Card}
          icon=${icons.agua}
          title="Recordatorio de agua"
          onClick=${()=>setModal('agua')}
        />
      </div>
      <${BottomNav} />

      <${AzucarModal} open=${modal === 'azucar'} onClose=${()=>setModal(null)} />
      <${ImcModal} open=${modal === 'imc'} onClose=${()=>setModal(null)} />
      <${MedicModal} open=${modal === 'medic'} onClose=${()=>setModal(null)} />
      <${PasosModal} open=${modal === 'pasos'} onClose=${()=>setModal(null)} pasos=${pasos} setPasos=${setPasos} />
      <${AguaModal} open=${modal === 'agua'} onClose=${()=>setModal(null)} />
    </div>
  `;
}

render(html`<${App} />`, document.getElementById("app"));

