# 💼 Invoice App

A modern, full-stack **Invoice Management** web application built with **Next.js**, **Prisma**, **Neon**, **Tailwind CSS**, and **shadcn/ui**.  
This app allows users to create, view, update, and delete invoices in an intuitive and responsive UI.

---

## 🛠️ Built With

* [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
* [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
* [![shadcn/ui](https://img.shields.io/badge/shadcn/ui-%23000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ui.shadcn.dev/)
* [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
* [![Neon](https://img.shields.io/badge/Neon-008FFF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMu\nb3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMi41IDExTDkuNSA2TDguNSAxMUgyLjVaIiBmaWxsPSIjRkZGIi8+PC9zdmc+)](https://neon.tech/)
* [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/invoice-app.git
cd invoice-app


npm install

# Neon PostgreSQL database URL
DATABASE_URL="your_neon_database_url"

# Optional secrets (e.g., Stripe)
NEXTAUTH_SECRET="your_auth_secret"

⚠️ Don't forget to add .env to .gitignore

 Set up Prisma
Run the following commands to initialize the Prisma client and run migrations:

npx prisma generate
npx prisma migrate dev --name init

Start the development server

npm run dev


📌 Features
Create, read, update, and delete invoices

Clean and modern UI built with shadcn/ui

Responsive design using Tailwind CSS

Server-side rendering and routing with Next.js

Database powered by Neon + Prisma

Modular file structure and reusable components


