# Thilip K — Personal Portfolio with AWS CI/CD

A personal portfolio website built with HTML, CSS, and JavaScript, hosted on **AWS S3** with global delivery via **CloudFront CDN**, and automatically deployed using **GitHub Actions CI/CD** on every code push.

---

## 📁 Project Structure

```
AWS-Portfolio-CICD/
├── myshowcase/
│   ├── index.html       ← Main HTML page (all sections)
│   ├── styles.css       ← Custom CSS design system
│   └── script.js        ← JavaScript logic (theme, starfield)
├── .github/
│   └── workflows/
│       └── deploy.yml   ← GitHub Actions CI/CD pipeline
└── README.md
```

---

## 🧱 What is Used, How it Works, and Why

---

### 1. HTML5 — `index.html`

**What:** The main webpage file with all sections — Hero, About, Skills, Projects, Contact, and Footer.

**How:** Each section is written using semantic HTML tags (`<section>`, `<nav>`, `<footer>`). Tailwind CSS utility classes are applied directly on elements for styling.

**Why:** HTML is the foundation of every web page. Using semantic structure makes it accessible, SEO-friendly, and easy for browsers to understand.

---

### 2. CSS — `styles.css`

**What:** A custom stylesheet containing the dark/light theme design system and glassmorphism card styles.

**How:**
- CSS custom properties (`--bg-body`, `--bg-card`, `--border-color`, `--glow-color`) are defined under `:root` for light mode and overridden under `html.dark` for dark mode.
- `.glass-card` uses `backdrop-filter: blur()` to create the frosted glass panel effect.
- `.gradient-text` uses `-webkit-background-clip: text` to paint the vivid cyan-to-purple gradient only on the text.
- `#bg-3d-canvas` is positioned `fixed` behind all content using `z-index: 0`.

**Why:** Keeping CSS separate from HTML makes the code cleaner, easier to maintain, and reusable. CSS custom properties make switching between light and dark mode instant without rewriting styles.

---

### 3. JavaScript — `script.js`

**What:** All client-side interactivity — icon rendering, theme toggle, and the animated starfield background.

**How:** The file has three parts:

**Part 1 — Lucide Icons**
```js
lucide.createIcons();
```
Scans the page for `data-lucide="icon-name"` attributes and renders SVG icons in place. Called after DOM is ready.

**Part 2 — Dark / Light Theme Toggle**
```js
localStorage.setItem('theme', 'dark');
htmlEl.classList.add('dark');
```
- Reads the user's saved theme from `localStorage` on page load.
- Defaults to dark mode if no preference is saved.
- When the toggle button is clicked, it flips the `dark` class on `<html>` and saves the new choice to `localStorage` so it persists across page refreshes.

**Part 3 — 360° Moving Starfield Canvas**
```js
const ctx = canvas.getContext('2d');
requestAnimationFrame(drawStars);
```
- Creates 180 star objects, each with random position, size, brightness, and drift direction.
- Each frame: clears the canvas, updates each star's position and brightness, and redraws it.
- Stars wrap around the screen edges so they never disappear.
- Uses only native HTML5 Canvas — no external libraries.

**Why:** JavaScript adds life and interactivity to a static HTML page. Using `localStorage` means users don't have to reset their theme every time they visit. The canvas starfield is made from scratch using basic math so it is lightweight, fast, and easy to explain.

---

### 4. Tailwind CSS CDN — `<script src="cdn.tailwindcss.com">`

**What:** A utility-first CSS framework loaded directly from a CDN.

**How:** Added as a `<script>` tag in the `<head>`. Classes like `flex`, `grid`, `text-xl`, `rounded-xl`, `hover:bg-indigo-500` are applied directly on HTML elements.

**Why:** Tailwind eliminates the need to write repetitive CSS for layout and spacing. Using the CDN version is the simplest option for a static site with no build step needed.

---

### 5. Lucide Icons CDN — `<script src="unpkg.com/lucide">`

**What:** A modern, clean icon library with 1000+ SVG icons.

**How:** Icons are declared in HTML as `<i data-lucide="mail" class="w-5 h-5">`, and `lucide.createIcons()` replaces them with proper SVG elements at runtime.

**Why:** Lucide provides sharp, consistent icons without downloading individual image files. It is lightweight and beginner-friendly.

---

### 6. Google Fonts — Inter & Outfit

**What:** Two premium web fonts loaded from Google Fonts CDN.

**How:** Added as a `<link>` tag in `<head>`. Applied in CSS as `font-family: 'Inter', sans-serif` for body text and `font-family: 'Outfit', sans-serif` for headings.

**Why:** Browser default fonts look basic. Inter is a clean, modern font great for UI readability. Outfit gives headings a bold, geometric personality that matches the dark aesthetic.

---

### 7. Web3Forms — Contact Form

**What:** A free form submission service that sends contact form data directly to your Gmail without any server.

**How:** The HTML form posts to `https://api.web3forms.com/submit` with a hidden `access_key` field. Web3Forms receives the submission and emails it to `kthilip0604@gmail.com`.

**Why:** A static website (hosted on S3) cannot run server-side code. Web3Forms is a free, reliable solution to accept contact messages without needing a backend or server.

---

### 8. AWS S3 — Static Website Hosting

**What:** Amazon Simple Storage Service (S3) is a cloud object storage service used to host the portfolio's static files publicly.

**How:** The `myshowcase/` folder (containing `index.html`, `styles.css`, `script.js`) is synced to an S3 bucket with the command:
```bash
aws s3 sync myshowcase/ s3://<bucket-name> --delete --acl public-read
```
`--delete` removes old files no longer in the source. `--acl public-read` makes files publicly accessible.

**Why:** S3 is extremely cheap (almost free for a static site), highly reliable with 99.99% uptime, and globally available. No server is needed — S3 directly serves the HTML files to visitors.

---

### 9. AWS CloudFront — CDN

**What:** Amazon CloudFront is a Content Delivery Network (CDN) that caches your website at edge locations around the world.

**How:** A CloudFront distribution points to the S3 bucket as its origin. When a user visits the site, CloudFront serves the cached files from the nearest edge location instead of the S3 bucket directly.

**Why:** Without CloudFront, every user request would go all the way to the S3 bucket's region (e.g., `ap-south-1` Mumbai). CloudFront caches files globally so users in the USA, Europe, or Singapore get the site loaded fast. It also provides HTTPS for free.

---

### 10. GitHub Actions — CI/CD Pipeline (`.github/workflows/deploy.yml`)

**What:** GitHub Actions is an automation tool that runs a workflow every time code is pushed to the repository.

**How:** The workflow file `deploy.yml` defines 4 steps that run automatically on every push to `main`:

```yaml
on:
  push:
    branches:
      - main
```

| Step | What it does |
|------|-------------|
| `Checkout Code` | Downloads the latest code from the repo onto the runner |
| `Configure AWS Credentials` | Authenticates with AWS using secrets stored in GitHub |
| `Sync to S3` | Uploads `myshowcase/` to the S3 bucket |
| `Invalidate CloudFront Cache` | Clears CloudFront's cached files so visitors get the new version immediately |

AWS secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, `CF_DISTRIBUTION_ID`) are stored securely in **GitHub Repository → Settings → Secrets**.

**Why:** Without CI/CD, you would have to manually upload files to S3 every time you make a change. GitHub Actions automates this entirely — push code, and the live site updates in under 60 seconds.

---

## ⚙️ GitHub Secrets Required

| Secret Name | Description |
|------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key |
| `AWS_REGION` | AWS region of your S3 bucket (e.g. `ap-south-1`) |
| `AWS_S3_BUCKET` | Name of your S3 bucket |
| `CF_DISTRIBUTION_ID` | Your CloudFront distribution ID |

---

## 🚀 How to Deploy

1. Clone this repository
2. Edit content in `myshowcase/index.html`, `styles.css`, or `script.js`
3. Commit and push to the `main` branch
4. GitHub Actions automatically uploads to S3 and invalidates CloudFront
5. Your live site updates within ~60 seconds ✅

---

## 🛠️ Tech Stack Summary

| Technology | Purpose |
|-----------|---------|
| HTML5 | Page structure and content |
| CSS3 (custom) | Design tokens, dark mode, glassmorphism |
| Tailwind CSS (CDN) | Utility-first layout and spacing |
| JavaScript (vanilla) | Theme toggle, starfield animation |
| Lucide Icons (CDN) | SVG icon rendering |
| Google Fonts | Premium web typography |
| HTML5 Canvas API | Animated 360° starfield background |
| Web3Forms | Static contact form with email delivery |
| AWS S3 | Static file hosting |
| AWS CloudFront | Global CDN and HTTPS |
| GitHub Actions | Automated CI/CD deployment pipeline |

---

## 👤 Author

**Thilip K** — Computer Science Engineer | Full-Stack, Cloud & AI Developer

- GitHub: [github.com/Thilip0604](https://github.com/Thilip0604)
- LinkedIn: [linkedin.com/in/thilip0604](https://linkedin.com/in/thilip0604)
- Instagram: [@__.thxlip.__](https://instagram.com/__.thxlip.__)
- Email: kthilip0604@gmail.com
