// 1. Diccionario de traducciones unificado y corregido
const translations = {
    en: {
        "title": "Denmark Salary Calculator | Calculate Net Salary",
        "heading": "Calculate your salary after taxes in Denmark",
        "description": "Enter your monthly details to estimate your take-home pay based on official Danish tax rules.",
        "label-language": "Language:",
        "label-hours": "Hours worked per month",
        "label-rate": "Hourly rate (DKK)",
        "label-fradrag": "Monthly Fradrag (Tax-free allowance DKK)",
        "help-skat": "You can find this on your SKAT tax card.",
        "label-tax": "Tax percentage (A-skat %)",
        "btn-calculate": "Calculate Net Salary",
        "result-title": "Estimated Net Salary:",
        "breakdown-title": "Breakdown:",
        "b-gross": "Gross Salary:",
        "alert-fields": "Please enter the hours worked and your hourly rate for your primary job.",
        "check-second-job": "I have a second job",
        "title-second-job": "Second Job (Tax Card B)"
    },
    es: {
        "title": "Calculadora de Salario Dinamarca 🇩🇰 | Sueldo Neto",
        "heading": "Calcula tu salario neto en Dinamarca",
        "description": "Ingresa tus datos mensuales para estimar tu salario en mano según las reglas fiscales danesas.",
        "label-language": "Idioma:",
        "label-hours": "Horas trabajadas al mes",
        "label-rate": "Valor por hora (DKK)",
        "label-fradrag": "Fradrag mensual (DKK libres de impuestos)",
        "help-skat": "Lo encontrás en tu tarjeta de impuestos de SKAT.",
        "label-tax": "Porcentaje de impuesto (A-skat %)",
        "btn-calculate": "Calcular Salario Neto",
        "result-title": "Salario Neto Estimado:",
        "breakdown-title": "Desglose:",
        "b-gross": "Salario Bruto:",
        "alert-fields": "Por favor, ingresá las horas trabajadas y el valor de la hora del trabajo principal.",
        "check-second-job": "Tengo un segundo trabajo",
        "title-second-job": "Segundo Trabajo (Tarjeta B)"
    }
};

// Función auxiliar para formatear números al estilo danés (10.000,00)
function formatDKK(amount) {
    return `${amount.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DKK`;
}

// Función auxiliar para parsear inputs de forma segura soportando puntos y comas de celulares
function parseInputValue(id) {
    const element = document.getElementById(id);
    if (!element || !element.value) return 0;
    
    // Reemplaza comas por puntos antes de parsear
    const cleanValue = element.value.replace(',', '.');
    const parsed = parseFloat(cleanValue);
    
    // Si da un número inválido (NaN), devolvemos 0 de forma segura
    return isNaN(parsed) ? 0 : parsed;
}

// 2. Función para procesar el cambio de idioma
function changeLanguage(lang) {
    const htmlTag = document.getElementById('html-tag');
    if (htmlTag) htmlTag.setAttribute('lang', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.tagName === 'TITLE') {
                document.title = translations[lang][key];
            } else {
                element.innerText = translations[lang][key];
            }
        }
    });
    
    // Guardamos la elección del usuario en el navegador
    localStorage.setItem('preferred-lang', lang);
}

// 3. Inicialización del idioma basado en el localStorage
const langSelect = document.getElementById('lang-select');
const savedLang = localStorage.getItem('preferred-lang') || 'en'; // Inglés por defecto

if (langSelect) {
    langSelect.value = savedLang;
    changeLanguage(savedLang);

    // Listener para cambios manuales del dropdown
    langSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}

// --- Control de visibilidad y validación del segundo trabajo ---
const checkboxSegundoTrabajo = document.getElementById('segundo-trabajo-check');
const boxSegundoTrabajo = document.getElementById('segundo-trabajo-box');
const horas2Input = document.getElementById('horas2');
const valorHora2Input = document.getElementById('valorHora2');

if (checkboxSegundoTrabajo && boxSegundoTrabajo) {
    checkboxSegundoTrabajo.addEventListener('change', (e) => {
        if (e.target.checked) {
            boxSegundoTrabajo.style.display = 'block';
            // Hacemos que los campos sean obligatorios si el check está activo
            if (horas2Input) horas2Input.required = true;
            if (valorHora2Input) valorHora2Input.required = true;
        } else {
            boxSegundoTrabajo.style.display = 'none';
            // Sacamos la obligatoriedad si se desmarca
            if (horas2Input) {
                horas2Input.required = false;
                horas2Input.value = ''; // Limpiamos el valor
            }
            if (valorHora2Input) {
                valorHora2Input.required = false;
                valorHora2Input.value = ''; // Limpiamos el valor
            }
        }
    });
}

// --- Restricción de caracteres en tiempo real (Evita letras en PC y duplica puntos/comas) ---
const numericInputs = ['horas', 'valorHora', 'fradrag', 'impuesto', 'horas2', 'valorHora2'];
numericInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/[^0-9.,]/g, '');
            const parts = value.split(/[.,]/);
            if (parts.length > 2) {
                const separator = value.match(/[.,]/)[0];
                value = parts[0] + separator + parts.slice(1).join('');
            }
            e.target.value = value;
        });
    }
});

// 4. Lógica del cálculo matemático y desglose consolidado
document.getElementById('calc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Trabajo 1 (Principal)
    const horas = parseInputValue('horas');
    const valorHora = parseInputValue('valorHora');
    const fradrag = parseInputValue('fradrag');
    const impuesto = parseInputValue('impuesto');
    
    // Validación obligatoria Trabajo 1
    if (horas === 0 || valorHora === 0) {
        const currentLang = localStorage.getItem('preferred-lang') || 'en';
        alert(translations[currentLang]["alert-fields"]);
        return;
    }
    
    // Trabajo 2 (Secundario - solo si el checkbox está activo)
    const tieneSegundoTrabajo = checkboxSegundoTrabajo ? checkboxSegundoTrabajo.checked : false;
    const horas2 = tieneSegundoTrabajo ? parseInputValue('horas2') : 0;
    const valorHora2 = tieneSegundoTrabajo ? parseInputValue('valorHora2') : 0;
    
    // 1. SALARIOS BRUTOS
    const salarioBruto1 = horas * valorHora;
    const salarioBruto2 = horas2 * valorHora2;
    const salarioBrutoTotal = salarioBruto1 + salarioBruto2;
    
    // 2. CÁLCULO DE ATP ÚNICO (Basado en la suma consolidada de horas)
    const horasTotales = horas + horas2;
    let atpTotal = 0;
    if (horasTotales >= 117) {
        atpTotal = 99.00;
    } else if (horasTotales >= 78) {
        atpTotal = 66.00;
    } else if (horasTotales >= 39) {
        atpTotal = 33.00;
    }
    if (salarioBrutoTotal < atpTotal) atpTotal = 0;
    
    // 3. CÁLCULO DE AM-BIDRAG SEPARADOS CON REDONDEO OFICIAL
    // El ATP oficial se descuenta de la base del trabajo principal
    const amIndkomst1 = Math.max(0, salarioBruto1 - atpTotal); 
    const amBidrag1 = Math.round(amIndkomst1 * 0.08);
    
    const amIndkomst2 = salarioBruto2;
    const amBidrag2 = Math.round(amIndkomst2 * 0.08);
    
    const amBidragTotal = amBidrag1 + amBidrag2;
    
    // 4. CÁLCULO DE A-SKAT
    // Trabajo 1: Aplica Fradrag
    const baseA_Skat1 = amIndkomst1 - amBidrag1 - fradrag;
    let aSkat1 = 0;
    if (baseA_Skat1 > 0) {
        aSkat1 = Math.round(baseA_Skat1 * (impuesto / 100));
    }
    
    // Trabajo 2: Sin Fradrag (Tarjeta B)
    const baseA_Skat2 = amIndkomst2 - amBidrag2;
    let aSkat2 = 0;
    if (baseA_Skat2 > 0) {
        aSkat2 = Math.round(baseA_Skat2 * (impuesto / 100));
    }
    
    const aSkatTotal = aSkat1 + aSkat2;
    
    // 5. SALARIO NETO TOTAL CONSOLIDADO
    const salarioNetoTotal = Math.max(0, salarioBrutoTotal - atpTotal - amBidragTotal - aSkatTotal);
    
    // Renderizado en la interfaz
    document.getElementById('resultadoTexto').innerText = formatDKK(salarioNetoTotal);
    document.getElementById('out-bruto').innerText = formatDKK(salarioBrutoTotal);
    document.getElementById('out-atp').innerText = formatDKK(atpTotal);
    document.getElementById('out-ambidrag').innerText = formatDKK(amBidragTotal);
    document.getElementById('out-askat').innerText = formatDKK(aSkatTotal);
    
    document.getElementById('resultadoBox').style.display = 'block';
});