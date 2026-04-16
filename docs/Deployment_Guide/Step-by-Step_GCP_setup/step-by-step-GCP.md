# 🚀 GCP CI/CD Deployment Guide (Node.js App)

## 📌 Overview

**User Story:**  
As a web developer, I want a web server and a CI/CD pipeline so that I can deploy and update my website automatically.

**Goal:**  
Set up a production pipeline:
Local Code → GitHub → CI/CD → Google Cloud VM → Domain

---

## ✅ Prerequisites

- 💻 Personal computer
- ☁️ Google Cloud account (with credits)
- 🐙 GitHub account + Node.js repo
- 🌐 Domain name (recommended: Namecheap)
- 🔐 SSH installed

---

# 1️⃣ SSH Key Setup

### Generate SSH keypair
```bash
ssh-keygen -t ed25519
---
# 🚀 Google Cloud VM + CI/CD Deployment Guide

## ☁️ Google Cloud VM Setup

### Steps
1. Go to **Google Cloud Console**
2. Open ☰ menu → **Compute Engine → VM Instances**
3. Click **Create Instance**

### Recommended Settings
- Machine type: `e2-micro` (or `g1-small` if using a database)
- OS: Ubuntu (default)

### Reserve Static IP
1. Go to **VPC Network → External IP addresses**
2. Change:
   - Ephemeral → **Static**

---

## 🔑 3️⃣ Add SSH Public Key

1. Click your VM instance
2. Click **Edit**
3. Scroll to **SSH Keys**
4. Paste your public key

👉 Add keys for:
- Your user
- CI/CD runner (GitHub)

---

## 📦 4️⃣ Install Required Software

### Connect to VM

ssh user@<VM_IP>

### 📦 System Setup
sudo apt update
sudo apt install nodejs npm git nginx -y
sudo npm install pm2 -g

---
🌐 NGINX Setup
Start & Enable

sudo systemctl start nginx
sudo systemctl enable nginx
---
Remove Default Config
sudo unlink /etc/nginx/sites-enabled/default
sudo rm /etc/nginx/sites-enabled/default
---
Create Config File
sudo vim /etc/nginx/sites-available/reverse-proxy
Enable Config
sudo ln -s /etc/nginx/sites-available/reverse-proxy /etc/nginx/sites-enabled/
---
Restart NGINX
sudo systemctl restart nginx
---
🔐 SSL (Certbot)
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx
---
⚙️ PM2 (App Management)
Start App
pm2 start app.mjs
Enable Startup
pm2 startup
pm2 save
Useful PM2 Commands
pm2 list
pm2 logs
pm2 restart app
pm2 delete app
---
🔁 CI/CD (GitHub Actions SSH Commands)
echo "$PRIVATE_KEY" > private_key.pem
chmod 600 private_key.pem

ssh -o StrictHostKeyChecking=no -i private_key.pem -tt user@<VM_IP> <<EOF
  cd <REPO_DIR>
  git pull
  npm ci
  pm2 delete app || true
  pm2 start app.mjs
  exit
EOF

rm -f private_key.pem
---
🧪 Debugging Commands
nginx -t
sudo systemctl status nginx
pm2 logs
---
✅ Done

All essential bash commands for your GCP deployment in one place 🚀


---

If you want, I can merge this back into your full guide so it’s one polished `.md` file instead of separate sections.
# THESE ARE SOME OF THE WAYS WE GOT GCP TO WORK