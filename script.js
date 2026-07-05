// Navegación
function showView(viewId) {
document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
document.getElementById(viewId).classList.add('active');
window.scrollTo(0, 0);
}

// Helpers
const getVal = (id) => parseFloat(document.getElementById(id).value) || 0;
const showRes = (id, html, type) => {
const el = document.getElementById(id);
el.innerHTML = html;
el.className = `result-box show ${type}`;
};

// 1. ROI
function calcROI() {
let inv = getVal('roi-inversion');
let gan = getVal('roi-ganancia');
if(inv <= 0) return showRes('res-roi', 'Por favor ingresa una inversión válida.', 'res-danger');
let roi = ((gan - inv) / inv) * 100;
let type = roi >= 0 ? 'res-success' : 'res-danger';
showRes('res-roi', `<div class="res-title">Tu ROI es: ${roi.toFixed(2)}%</div>${roi >= 0 ? '¡Buena inversión!' : 'Estás perdiendo dinero.'}`, type);
}

// 2. Interés - VERSIÓN CLARA Y DETALLADA
function calcInterest() {
let c = getVal('int-capital');
let i = getVal('int-tasa') / 100;
let t = getVal('int-tiempo');

let tipoOperacion = document.querySelector('input[name="tipo-operacion"]:checked').value;
let periodo = document.querySelector('input[name="periodo"]:checked').value;

if(c <= 0) return showRes('res-int', 'Por favor ingresa una cantidad válida.', 'res-danger');
if(i <= 0) return showRes('res-int', 'Por favor ingresa una tasa de interés válida.', 'res-danger');
if(t <= 0) return showRes('res-int', 'Por favor ingresa un tiempo válido.', 'res-danger');

let interes = c * i * t;
let total = c + interes;

let periodoTexto = periodo === 'anual' ? (t === 1 ? 'año' : 'años') : (t === 1 ? 'mes' : 'meses');
let tasaPeriodo = periodo === 'anual' ? 'anual' : 'mensual';
let html = '';

if (tipoOperacion === 'prestamo') {
    html = `
        <div class="res-title" style="color: #991b1b;">🔴 PRÉSTAMO - Lo que pagarás</div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 5px 0;"><strong>Dinero que recibes:</strong> $${c.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Tasa:</strong> ${(i*100).toFixed(1)}% ${tasaPeriodo}</p>
            <p style="margin: 5px 0;"><strong>Tiempo:</strong> ${t} ${periodoTexto}</p>
            <hr style="margin: 10px 0; border: none; border-top: 1px solid #fecaca;">
            <p style="margin: 5px 0; font-size: 1.1rem;">
                <strong style="color: #ef4444;">Interés a PAGAR:</strong> 
                <span style="font-size: 1.3rem; color: #ef4444;">$${interes.toFixed(2)}</span>
            </p>
            <p style="margin: 5px 0; font-size: 1.2rem; background: #fee2e2; padding: 10px; border-radius: 6px;">
                <strong>Total a DEVOLVER: $${total.toFixed(2)}</strong>
            </p>
        </div>
        <div style="background: #fef2f2; padding: 12px; border-radius: 6px; border-left: 4px solid #ef4444;">
            <strong>📝 Explicación:</strong><br>
            Pediste <strong>$${c.toFixed(2)}</strong> prestados. Durante ${t} ${periodoTexto} al ${(i*100).toFixed(1)}% ${tasaPeriodo}, 
            pagarás <strong>$${interes.toFixed(2)} EXTRA</strong> de interés. 
            Al final, devolverás <strong>$${total.toFixed(2)}</strong> en total 
            (los $${c.toFixed(2)} que recibiste + $${interes.toFixed(2)} de interés).
        </div>
    `;
} else {
    html = `
        <div class="res-title" style="color: #065f46;">🟢 AHORRO/INVERSIÓN - Lo que ganarás</div>
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p style="margin: 5px 0;"><strong>Dinero que ahorras:</strong> $${c.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Tasa:</strong> ${(i*100).toFixed(1)}% ${tasaPeriodo}</p>
            <p style="margin: 5px 0;"><strong>Tiempo:</strong> ${t} ${periodoTexto}</p>
            <hr style="margin: 10px 0; border: none; border-top: 1px solid #a7f3d0;">
            <p style="margin: 5px 0; font-size: 1.1rem;">
                <strong style="color: #10b981;">Interés a GANAR:</strong> 
                <span style="font-size: 1.3rem; color: #10b981;">$${interes.toFixed(2)}</span>
            </p>
            <p style="margin: 5px 0; font-size: 1.2rem; background: #d1fae5; padding: 10px; border-radius: 6px;">
                <strong>Total que tendrás: $${total.toFixed(2)}</strong>
            </p>
        </div>
        <div style="background: #ecfdf5; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
            <strong>📝 Explicación:</strong><br>
            Ahorraste <strong>$${c.toFixed(2)}</strong>. Durante ${t} ${periodoTexto} al ${(i*100).toFixed(1)}% ${tasaPeriodo}, 
            el banco te pagará <strong>$${interes.toFixed(2)}</strong> de interés. 
            Al final, tendrás <strong>$${total.toFixed(2)}</strong> en total 
            (tus $${c.toFixed(2)} originales + $${interes.toFixed(2)} que ganaste).
        </div>
    `;
}
showRes('res-int', html, tipoOperacion === 'prestamo' ? 'res-danger' : 'res-success');
}

// 3. Punto de Equilibrio
function calcBreakEven() {
let cf = getVal('pe-fijos');
let p = getVal('pe-precio');
let cv = getVal('pe-variable');
let margen = p - cv;
if(margen <= 0) return showRes('res-pe', 'El precio debe ser mayor al costo variable.', 'res-danger');
if(cf <= 0) return showRes('res-pe', 'Ingresa costos fijos válidos.', 'res-danger');
let pe = cf / margen;
showRes('res-pe', `<div class="res-title">Debes vender: ${Math.ceil(pe)} unidades</div>Para cubrir tus $${cf} de gastos fijos. A partir de la unidad ${Math.ceil(pe)+1} empiezas a ganar.`, 'res-success');
}

// 4. Costo Real
function calcRealCost() {
let mp = getVal('costo-mp');
let mo = getVal('costo-mo');
let ci = getVal('costo-ci');
let total = mp + mo + ci;
if(total <= 0) return showRes('res-costo', 'Ingresa al menos un costo válido.', 'res-danger');
showRes('res-costo', `<div class="res-title">Costo Real: $${total.toFixed(2)}</div>Materia Prima: $${mp} | Mano de Obra: $${mo} | Indirectos: $${ci}`, 'res-success');
}

// 5. Precio y Descuentos
let currentPrice = 0;
let currentCost = 0;
function calcPrice() {
currentCost = getVal('precio-costo');
let margin = getVal('precio-margen') / 100;
if(margin >= 1) return showRes('res-precio', 'El margen debe ser menor al 100%', 'res-danger');
if(currentCost <= 0) return showRes('res-precio', 'Ingresa un costo válido.', 'res-danger');
currentPrice = currentCost / (1 - margin);
let profit = currentPrice - currentCost;
let html = `<div class="res-title">Precio de Venta: $${currentPrice.toFixed(2)}</div>`;
html += `Tu ganancia limpia será: $${profit.toFixed(2)} (${(margin*100).toFixed(0)}%)<br>`;
html += `<strong>🛡️ Descuento máximo sin perder: ${(margin*100).toFixed(1)}%</strong>`;
showRes('res-precio', html, 'res-success');
document.getElementById('discount-section').style.display = 'block';
document.getElementById('max-discount-text').innerText = `${(margin*100).toFixed(1)}% (Equivalente a $${profit.toFixed(2)})`;
}

function calcDiscount() {
let discount = getVal('desc-prueba');
if(currentPrice <= 0) return;
let finalPrice = currentPrice * (1 - (discount/100));
let finalProfit = finalPrice - currentCost;
let isSafe = finalProfit >= 0;
let html = `<div class="res-title">Precio final con descuento: $${finalPrice.toFixed(2)}</div>`;
if(isSafe) {
    html += `✅ <strong>SEGURO:</strong> Aún ganas $${finalProfit.toFixed(2)} por venta.`;
    showRes('res-descuento', html, 'res-success');
} else {
    html += `❌ <strong>PELIGRO:</strong> Estás perdiendo $${Math.abs(finalProfit).toFixed(2)} por venta.`;
    showRes('res-descuento', html, 'res-danger');
}
}

// 6. LIQUIDEZ DEL NEGOCIO (NUEVA)
function calcLiquidez() {
let activo = getVal('liq-activo');
let pasivo = getVal('liq-pasivo');

// Validaciones
if(activo <= 0) return showRes('res-liq', 'Por favor ingresa un Activo Circulante válido.', 'res-danger');
if(pasivo <= 0) return showRes('res-liq', 'Por favor ingresa un Pasivo Circulante válido.', 'res-danger');

// Cálculos
let razonLiquidez = activo / pasivo;
let capitalTrabajo = activo - pasivo;
let porcentajeCobertura = razonLiquidez * 100;

// Determinar estado
let estado, emoji, color, tipo;
if(razonLiquidez >= 1.5) {
    estado = 'EXCELENTE';
    emoji = '🟢';
    color = '#10b981';
    tipo = 'res-success';
} else if(razonLiquidez >= 1) {
    estado = 'SALUDABLE';
    emoji = '🟡';
    color = '#f59e0b';
    tipo = 'res-warning';
} else {
    estado = 'EN PELIGRO';
    emoji = '🔴';
    color = '#ef4444';
    tipo = 'res-danger';
}

let html = `
    <div class="res-title" style="color: ${color};">${emoji} Razón de Liquidez: ${razonLiquidez.toFixed(2)}</div>
    <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
        <p style="margin: 5px 0;"><strong>💰 Activo Circulante:</strong> $${activo.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
        <p style="margin: 5px 0;"><strong>💸 Pasivo Circulante:</strong> $${pasivo.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
        <hr style="margin: 10px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="margin: 5px 0; font-size: 1.1rem;">
            <strong>Fórmula:</strong> $${activo.toLocaleString('es-MX')} ÷ $${pasivo.toLocaleString('es-MX')} = <strong style="color: ${color}; font-size: 1.3rem;">${razonLiquidez.toFixed(2)}</strong>
        </p>
    </div>
    
    <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid ${color};">
        <p style="margin: 5px 0; font-size: 1.05rem;"><strong>📊 Estado: ${estado}</strong></p>
        <p style="margin: 10px 0;"><strong>💵 Capital de Trabajo:</strong> $${capitalTrabajo.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
        <p style="margin: 5px 0;"><strong>📈 Cobertura:</strong> ${porcentajeCobertura.toFixed(1)}%</p>
    </div>
    
    <div style="background: ${tipo === 'res-success' ? '#ecfdf5' : tipo === 'res-warning' ? '#fef3c7' : '#fef2f2'}; padding: 12px; border-radius: 6px; border-left: 4px solid ${color};">
        <strong>📝 Explicación como para un niño:</strong><br>
        Por cada <strong>$1 que debes</strong>, tienes <strong>$${razonLiquidez.toFixed(2)} para pagarlo</strong>.<br><br>
        ${razonLiquidez >= 1.5 ? 
            '✅ ¡Excelente! Tu negocio tiene mucho dinero disponible. Puedes pagar todas tus deudas y te sobra.' :
        razonLiquidez >= 1 ? 
            '⚠️ Estás bien, pero justo. Puedes pagar tus deudas, pero no te sobra mucho. Trata de tener más dinero en caja.' :
            '🚨 ¡Cuidado! No tienes suficiente dinero para pagar todas tus deudas de hoy. Necesitas cobrar más rápido o conseguir más dinero.'
        }
    </div>
`;

showRes('res-liq', html, tipo);
}
