// 1. Diccionario de traducciones expandido
const translations = {
    en: {
        "title": "Denmark Salary Calculator | Calculate Net Salary",
        "heading": "Calculate your salary after taxes in Denmark",
        "description": "Enter your monthly details to estimate your take-home pay based on official Danish tax rules.",
        "label-language": "Language:",
        "mode-hourly": "Hourly",
        "mode-monthly": "Monthly",
        "label-hours": "Hours worked per month",
        "label-rate": "Hourly rate (DKK)",
        "label-monthly-gross": "Gross monthly salary (DKK)",
        "label-fradrag": "Terms of Fradrag (Tax-free allowance DKK)",
        "help-skat": "You can find this on your SKAT tax card.",
        "label-tax": "Tax percentage (Skatteprocent %)",
        "btn-calculate": "Calculate Net Salary",
        "result-title": "Estimated Net Salary:",
        "breakdown-title": "Breakdown:",
        "b-gross": "Gross Salary:",
        "alert-fields-hourly": "Please enter the hours worked and your hourly rate.",
        "alert-fields-monthly": "Please enter your gross monthly salary."
    },
    es: {
        "title": "Calculadora de Salario Dinamarca 🇩🇰 | Sueldo Neto",
        "heading": "Calcula tu salario neto en Dinamarca",
        "description": "Ingresa tus datos mensuales para estimar tu salario en mano según las reglas fiscales danesas.",
        "label-language": "Idioma:",
        "mode-hourly": "Por Hora",
        "mode-monthly": "Por Mes",
        "label-hours": "Horas trabajadas al mes",
        "label-rate": "Valor por hora (DKK)",
        "label-monthly-gross": "Sueldo mensual bruto (DKK)",
        "label-fradrag": "Fradrag mensual (DKK libres de impuestos)",
        "help-skat": "Lo encontrás en tu tarjeta de impuestos de SKAT.",
        "label-tax": "Porcentaje de retención (Skatteprocent %)",
        "btn-calculate": "Calcular Salario Neto",
        "result-title": "Salario Neto Estimado:",
        "breakdown-title": "Desglose:",
        "b-gross": "Salario Bruto:",
        "alert-fields-hourly": "Por favor, ingresá las horas trabajadas y el valor de la hora.",
        "alert-fields-monthly": "Por favor, ingresá tu sueldo mensual bruto."
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
    document.getElementById('html-tag').setAttribute('lang', lang);

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

// ==========================================
// NUEVO: Lógica de control para el Switch UI
// ==========================================
const wrapperHourly = document.getElementById('wrapper-hourly');
const wrapperMonthly = document.getElementById('wrapper-monthly');

document.querySelectorAll('input[name="salary-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'hourly') {
            wrapperHourly.classList.remove('hidden');
            wrapperMonthly.classList.add('hidden');
        } else {
            wrapperHourly.classList.add('hidden');
            wrapperMonthly.classList.remove('hidden');
        }
        // Limpiamos la caja de resultados al cambiar de modo para evitar confusiones
        document.getElementById('resultadoBox').style.display = 'none';
    });
});

// 4. Lógica del cálculo matemático y desglose adaptada
document.getElementById('calc-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const currentLang = localStorage.getItem('preferred-lang') || 'en';
    const isHourly = document.getElementById('type-hourly').checked;

    let salarioBruto = 0;
    let horasParaATP = 0;

    // Captura de datos condicional según el modo seleccionado
    if (isHourly) {
        const horas = parseInputValue('hours-input');
        const valorHora = parseInputValue('rate-input');

        if (horas === 0 || valorHora === 0) {
            alert(translations[currentLang]["alert-fields-hourly"]);
            return;
        }
        salarioBruto = horas * valorHora;
        horasParaATP = horas;
    } else {
        const sueldoMensual = parseInputValue('gross-monthly-input');

        if (sueldoMensual === 0) {
            alert(translations[currentLang]["alert-fields-monthly"]);
            return;
        }
        salarioBruto = sueldoMensual;
        horasParaATP = 160.33; // Estándar oficial a tiempo completo en DK para calcular tramo de ATP fijo
    }

    const fradrag = parseInputValue('fradrag');
    const impuesto = parseInputValue('impuesto');

    // 2. CÁLCULO DE ATP basado en las horas calculadas/fijas
    let atp = 0;
    if (horasParaATP >= 117) {
        atp = 99.00;
    } else if (horasParaATP >= 78) {
        atp = 66.00;
    } else if (horasParaATP >= 39) {
        atp = 33.00;
    }
    if (salarioBruto < atp) atp = 0;

    // 3. CÁLCULO DE AM-BIDRAG
    const amIndkomst = salarioBruto - atp;
    const amBidrag = Math.round(amIndkomst * 0.08); // Redondeado oficial

    // 4. CÁLCULO DE A-SKAT (Skatteprocent)
    const baseA_Skat = amIndkomst - amBidrag - fradrag;

    let aSkat = 0;
    if (baseA_Skat > 0) {
        aSkat = Math.round(baseA_Skat * (impuesto / 100));
    }

    // 5. SALARIO NETO
    const salarioNeto = Math.max(0, salarioBruto - atp - amBidrag - aSkat);

    // Renderizado en la interfaz
    document.getElementById('resultadoTexto').innerText = formatDKK(salarioNeto);
    document.getElementById('out-bruto').innerText = formatDKK(salarioBruto);
    document.getElementById('out-atp').innerText = formatDKK(atp);
    document.getElementById('out-ambidrag').innerText = formatDKK(amBidrag);
    document.getElementById('out-askat').innerText = formatDKK(aSkat);

    document.getElementById('resultadoBox').style.display = 'block';
});