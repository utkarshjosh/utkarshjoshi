# Portfolio Website

[![Deploy Status](https://github.com/utkarshjosh/utkarshjoshi/workflows/Deploy%20to%20EC2/badge.svg)](https://github.com/utkarshjosh/utkarshjoshi/actions/workflows/deploy.yml)
[![Last Deploy](https://img.shields.io/github/actions/workflow/status/utkarshjosh/utkarshjoshi/deploy.yml?label=last%20deployed&logo=github)](https://github.com/utkarshjosh/utkarshjoshi/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/badge/website-utkarshjoshi.com-blue)](https://utkarshjoshi.com)
[![Hugo](https://img.shields.io/badge/Hugo-latest-ff4088?logo=hugo)](https://gohugo.io/)
[![Theme](https://img.shields.io/badge/Theme-PaperMod-00d9ff)](https://github.com/adityatelange/hugo-PaperMod)

> A modern portfolio website showcasing projects, technical blog posts, and professional experience. Built with Hugo and the Paper Mod theme, customized for personal needs.

## 🌐 Live Site

**Visit:** [utkarshjoshi.com](https://utkarshjoshi.com)

## 📋 Overview

This portfolio website serves as a comprehensive showcase of my work as a backend-focused Software Engineer. It features:

- **Projects Section**: Detailed project pages with live demo links, GitHub repositories, and technical descriptions
- **Blog Posts**: In-depth articles documenting the development process, architecture decisions, and lessons learned for each project
- **About Page**: Professional background and expertise
- **Responsive Design**: Optimized for all devices with a clean, modern interface

## 🚀 Tech Stack

- **Static Site Generator**: [Hugo](https://gohugo.io/) - Fast and flexible static site generator
- **Theme**: [Paper Mod](https://github.com/adityatelange/hugo-PaperMod) - Clean and minimal theme (heavily customized)
- **Deployment**: AWS EC2 with automated CI/CD via GitHub Actions
- **Web Server**: Nginx (serving static files from `/var/www/portfolio`)

## ✨ Features

- 🎨 **Custom Styling**: Extended Paper Mod theme with custom CSS for personalized design
- 📱 **Responsive Layout**: Mobile-first design that works seamlessly across all devices
- 🔍 **SEO Optimized**: Proper meta tags, sitemap, and JSON-LD structured data (Person, ProfilePage, and article publisher/author markup tied to a stable Person entity, configured via `schema` in `hugo.yaml`)
- 📊 **Analytics**: Google Analytics integration for visitor insights
- 🌙 **Dark Mode**: Automatic theme switching based on user preference
- 📝 **Code Highlighting**: Syntax highlighting for code blocks
- 🔗 **Social Links**: Integration with GitHub, LinkedIn, Twitter, and LeetCode
- 📖 **Reading Time**: Automatic reading time calculation for blog posts
- 🏷️ **Tagging System**: Organized content with categories and tags

## 📁 Project Structure

```
utkarshjoshi/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── assets/
│   └── css/
│       └── extended/
│           └── custom.css      # Custom stylesheet
├── content/
│   ├── about.md                # About page
│   ├── posts/                  # Blog posts directory
│   └── projects/               # Projects directory
├── layouts/
│   ├── _default/
│   │   ├── about.html          # Custom about page layout
│   │   └── projects.html       # Custom projects layout
│   └── partials/
│       └── extend_head.html     # Custom head partials
├── static/
│   └── images/                 # Static images (projects, profile, etc.)
├── themes/
│   └── PaperMod/               # Paper Mod theme (vendored, with local modifications)
├── deploy.sh                   # Deployment script
└── hugo.yaml                   # Hugo configuration
```

## 🛠️ Local Development

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (extended version recommended)
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/utkarshjosh/utkarshjoshi.git
   cd utkarshjoshi
   ```

2. **Install Hugo** (if not already installed)
   ```bash
   # On macOS with Homebrew
   brew install hugo
   
   # On Linux
   sudo apt-get install hugo
   
   # Or download from https://gohugo.io/installation/
   ```

3. **Start the development server**
   ```bash
   hugo server -D
   ```

4. **View the site**
   Open [http://localhost:1313](http://localhost:1313) in your browser

### Building for Production

```bash
# Generate static site
hugo

# Output will be in the `public/` directory
```

## 📝 Adding Content

### Adding a New Project

1. Create a new markdown file in `content/projects/`:
   ```bash
   hugo new projects/my-new-project.md
   ```

2. Edit the front matter with project details:
   ```yaml
   ---
   title: "My New Project"
   date: 2024-01-01
   draft: false
   description: "Project description"
   image: "images/projects/project-image.png"
   tags: ["React", "Node.js"]
   github: "https://github.com/username/repo"
   demo: "https://demo-url.com"
   blog: "/posts/my-project-blog-post"
   ---
   ```

### Adding a New Blog Post

1. Create a new markdown file in `content/posts/`:
   ```bash
   hugo new posts/my-blog-post.md
   ```

2. Write your content in Markdown format

## 🚢 Deployment

The site is automatically deployed to AWS EC2 via GitHub Actions whenever changes are pushed to the `main` branch.

### Deployment Process

1. **Push to main branch** triggers the workflow
2. **GitHub Actions** runs the deployment workflow (`.github/workflows/deploy.yml`)
3. **AWS SSM** executes commands on EC2 instance:
   - Pulls latest code from GitHub
   - Runs `deploy.sh` script
   - Builds Hugo site
   - Syncs `public/` directory to `/var/www/portfolio`

### Manual Deployment

If you need to deploy manually:

```bash
# On the EC2 instance
cd /path/to/project
git pull origin main
chmod +x deploy.sh
./deploy.sh
```

## 🎨 Customization

### Custom CSS

Edit `assets/css/extended/custom.css` to add custom styles. These will be automatically included in the build.

### Theme Modifications

The site uses a modified version of Paper Mod. Custom layouts are in the `layouts/` directory:
- `layouts/_default/about.html` - Custom about page
- `layouts/_default/projects.html` - Custom projects listing
- `layouts/partials/extend_head.html` - Additional head elements

The vendored theme is also modified directly; notably `themes/PaperMod/layouts/partials/templates/schema_json.html` emits the JSON-LD structured data (stable Person entity, ProfilePage on the About page, Person publisher/author on posts).

### Configuration

Main configuration is in `hugo.yaml`. Key settings:
- Site metadata and SEO
- Menu structure
- Social media links
- Theme parameters
- Google Analytics

## 📚 Projects Featured

- **Real-Time Quiz App** - Full-stack quiz platform with WebSocket-powered live gameplay
- **Gasless Web3 Payment SDK** - Web3 payment solution with meta-transactions
- **AI Agent Automation** - Intelligent automation using LangGraph and AI agents
- **Real-Time Trading Backend** - High-performance trading system backend

Each project includes:
- Live demo links
- GitHub repository links
- Detailed blog posts explaining the development process
- Technical stack and architecture details

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Utkarsh Joshi**

- Website: [utkarshjoshi.com](https://utkarshjoshi.com)
- GitHub: [@utkarshjosh](https://github.com/utkarshjosh)
- LinkedIn: [utkarshwithknack](https://linkedin.com/in/utkarshwithknack)
- Twitter: [@Utkajoshi](https://x.com/Utkajoshi)
- LeetCode: [utkarshjoshi7](https://leetcode.com/u/utkarshjoshi7/)

---

⭐ If you find this project interesting, consider giving it a star on GitHub!

