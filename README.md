# Denmark Net Salary Calculator 🇩🇰

An easy, precise, and transparent way to calculate your monthly salary after taxes in Denmark. 

This project was built using **Vanilla HTML, CSS, and JavaScript**, avoiding heavy frameworks to ensure instant loading times and maximum compatibility.

## 🚀 Live Demo
You can try the live application here: [denmark-salary-calculator.agus-aguirre16.workers.dev](https://denmark-salary-calculator.agus-aguirre16.workers.dev/)

## 💡 Why this project?
Understanding a Danish payslip (*Lønseddel*) for the first time can be confusing for expats, backpackers, and Working Holiday holders. 

While most basic calculators online just apply a flat tax percentage, this tool replicates the actual math behind payroll software (like Danløn), factoring in:
- **ATP (Arbejdsmarkedets Tillægspension):** Automatically calculated based on your monthly hours.
- **AM-bidrag (Labor Market Contribution):** The mandatory 8% tax deducted prior to income tax.
- **A-skat (Income Tax):** Accurately calculated by applying your personal tax rate (*A-skat %*) only to the taxable income after subtracting your personal tax-free allowance (*Fradrag*).

## 🛠️ Tech Stack & Architecture
- **Frontend:** Semantic HTML5, Custom CSS3 (Responsive Design).
- **Logic:** Vanilla JavaScript (ES6+).
- **Internationalization (i18n):** Client-side language switching (English/Spanish) without external libraries, using `data-` attributes and state persistence via `localStorage`.
- **Deployment:** Hosted on **Cloudflare Pages** for ultra-fast CDN delivery and privacy-first analytics.

## 📁 Project Structure
The repository follows a clean, modular structure:

denmark-salary-calculator/
├── index.html          # Main view & structure
├── css/
│   └── styles.css      # Custom styles and responsive layout
├── js/
│   └── main.js         # Tax calculation logic & i18n management
└── README.md

## ⚙️ How to Run Locally

1. Clone this repository:
   git clone [https://github.com/agui16/denmark-salary-calculator.git](https://github.com/agui16/denmark-salary-calculator.git)

2. Navigate to the project directory:
   cd denmark-salary-calculator

3. Open `index.html` in your browser, or use a local development server like VS Code's **Live Server** extension or Node's `npx serve .` to test the code.

## 🤝 Contributions
Feel free to open an issue or submit a pull request if you want to contribute (e.g., adding a new language like Danish, or improving the CSS layout).

---
*Developed with ☕ in Denmark.*