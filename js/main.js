// 1. Diccionario de traducciones expandido
const translations = {
    en: {
        "title": "Denmark Salary Calculator",
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
        "b-gross": "Gross Salary:"
    },
    es: {
        "title": "Calculadora de Salario - Dinamarca",
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
        "b-gross": "Salario Bruto:"
    }
};

// Función auxiliar para formatear números al estilo danés (10.000,00)
function formatDKK(amount) {
    return `${amount.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DKK`;
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

langSelect.value = savedLang;
changeLanguage(savedLang);

// Listener para cambios manuales del dropdown
langSelect.addEventListener('change', (e) => {
    changeLanguage(e.target.value);
});

// 4. Lógica del cálculo matemático y desglose
document.getElementById('calc-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const horas = parseFloat(document.getElementById('horas').value);
    const valorHora = parseFloat(document.getElementById('valorHora').value);
    const fradrag = parseFloat(document.getElementById('fradrag').value);
    const impuesto = parseFloat(document.getElementById('impuesto').value);
    
    const salarioBruto = horas * valorHora;
    
    // Tramos oficiales de ATP
    let atp = 0;
    if (horas >= 117) {
        atp = 99.00;
    } else if (horas >= 78) {
        atp = 66.00;
    } else if (horas >= 39) {
        atp = 33.00;
    }
    
    if (salarioBruto < atp) atp = 0;
    
    const amIndkomst = salarioBruto - atp;
    const amBidrag = amIndkomst * 0.08;
    const baseA_Skat = amIndkomst - amBidrag - fradrag;
    
    let aSkat = 0;
    if (baseA_Skat > 0) {
        aSkat = Math.round(baseA_Skat * (impuesto / 100));
    }
    
    const amBidragRedondeado = Math.round(amBidrag);
    const salarioNeto = Math.max(0, salarioBruto - atp - amBidragRedondeado - aSkat);
    
    // Renderizado en la interfaz
    document.getElementById('resultadoTexto').innerText = formatDKK(salarioNeto);
    document.getElementById('out-bruto').innerText = formatDKK(salarioBruto);
    document.getElementById('out-atp').innerText = formatDKK(atp);
    document.getElementById('out-ambidrag').innerText = formatDKK(amBidragRedondeado);
    document.getElementById('out-askat').innerText = formatDKK(aSkat);
    
    document.getElementById('resultadoBox').style.display = 'block';
});