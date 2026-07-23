# 🚀 Thilip K — Cloud Portfolio with 3D Background & AWS CI/CD

An ultra-modern, high-performance personal portfolio featuring a **3D WebGL cosmic flame storm background (Three.js)**, liquid glassmorphism UI, distinct project color cards, and **automated AWS S3 & CloudFront CI/CD deployment via GitHub Actions**.

---

## 📌 A to Z Project Overview (What, Why, Where & How)

| Component | What it is | Why used | Where located | How it works |
| :--- | :--- | :--- | :--- | :--- |
| **3D Canvas Scene** | Three.js WebGL Particle Storm & Warp Shader | Provides a stunning cosmic 3D background | `myshowcase/script.js` | Uses Three.js shaders & 50,000 particle points rendered on `#bg-3d-canvas`. |
| **HTML Markup** | Semantic HTML5 structure | Clean structure & SEO optimization | `myshowcase/index.html` | Defines Hero, About, Skills, Projects, Contact & Footer sections. |
| **CSS Color Engine** | Custom Glassmorphism & Color tokens | Controls glass blur, glowing borders & text gradients | `myshowcase/styles.css` | Uses CSS variables & `.glass-card` / `.glass-nav` rules. |
| **Dynamic Navbar** | Water-clear dynamic scroll nav | Clean top view & scrolled glass readability | `myshowcase/script.js` & `styles.css` | Toggles `.nav-scrolled` water-glass blur when scrolling past 60px. |
| **Contact Form** | Web3Forms API Integration | Accepts user messages without needing a backend server | `myshowcase/index.html` | POSTs form inputs to Web3Forms API which forwards emails to Gmail. |
| **AWS S3** | Static Website Hosting Storage | Highly reliable, cost-effective cloud hosting | AWS Cloud (S3 Bucket) | Serves `myshowcase/` files (`index.html`, `styles.css`, `script.js`). |
| **AWS CloudFront** | Global Content Delivery Network (CDN) | Delivers fast global loading & free HTTPS SSL | AWS Cloud (CloudFront Edge) | Caches S3 static files at edge locations worldwide. |
| **GitHub Actions** | Automated CI/CD Deployment Pipeline | Automates build & push updates live in seconds | `.github/workflows/deploy.yml` | Triggers on `main`/`develop` push, syncs to S3 & clears CDN cache. |

---

## 📁 Repository Directory Structure

```
AWS-Portfolio-CICD/
├── myshowcase/
│   ├── index.html       ← Main HTML structure & project cards
│   ├── styles.css       ← Custom glass design system & gradient colors
│   └── script.js        ← Three.js 3D canvas storm & navbar scroll logic
├── .github/
│   └── workflows/
│       └── deploy.yml   ← GitHub Actions CI/CD deployment workflow
└── README.md
```

---

## ⚙️ How to Deploy to AWS (Step-by-Step)

### 1️⃣ GitHub Repository Secrets (`Settings → Secrets → Actions`)
Add the following secrets to your GitHub repository:

| Secret Name | Value Example |
| :--- | :--- |
| `AWS_ACCESS_KEY_ID` | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | `us-east-1` (or your AWS region) |
| `AWS_S3_BUCKET` | `your-s3-bucket-name` |
| `CF_DISTRIBUTION_ID` | `E1234567890ABC` (CloudFront ID) |

### 2️⃣ Deploy via Git
Simply push code to `main` or `develop` branch:

```bash
git add .
git commit -m "Updated portfolio code"
git push origin develop
```
*GitHub Actions automatically syncs code to S3 and invalidates CloudFront cache in ~30 seconds!*

---

## 🛠️ Local Development

1. Open `myshowcase/index.html` directly in any web browser or use VS Code Live Server.
2. Edit `myshowcase/styles.css` for visual tweaks or `myshowcase/script.js` for 3D background logic.

---

Made with ❤️ by **Thilip K** — Hosted on **AWS S3 / CloudFront**.
