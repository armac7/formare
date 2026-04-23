# Full-Stack Deployment Guide: GCP + Nginx + PM2

This guide outlines the professional deployment workflow for a Node.js/React application on **Google Cloud Platform (GCP)**, utilizing **Nginx** as a reverse proxy and **PM2** for process management.

---

## 1. Google Cloud Platform (GCP) Setup

### **Infrastructure Provisioning**
1.  **Compute Engine**: Navigate to `Compute Engine > VM Instances` and create a new instance.
    * **Image**: Ubuntu 22.04 LTS (Recommended).
    * **Machine Type**: `e2-micro` (sufficient for small projects/testing).
2.  **Firewall Rules**: Check the boxes for **Allow HTTP traffic** and **Allow HTTPS traffic**.
3.  **Static IP**: Go to `VPC Network > IP addresses`. Locate your instance and change the type from **Ephemeral** to **Static** to ensure the IP address never changes.

---

## 2. Directory Structure & Permissions

The industry standard for web applications on Linux is the `/var/www/` directory.

### **Setup Commands**
```bash
# Create the project directory
sudo mkdir -p /var/www/html/my-app

# Assign ownership to your current user (replace $USER with your username)
sudo chown -R $USER:$USER /var/www/html/my-app

Your Markdown file explaining PM2 is ready.

[file-tag: code-generated-file-0-1776362776930946648]

### Summary of PM2
PM2 is an essential tool for any Node.js developer moving into production. While you might use `npm start` during development, PM2 provides the "always-on" stability required for professional servers.

**Key Concepts:**
* **Daemonization:** It runs in the background as a service.
* **Auto-Restart:** If your code has a memory leak or an unhandled exception that causes a crash, PM2 brings it back up immediately.
* **Cluster Mode:** It solves the "Single Thread" limitation of Node.js by spinning up an instance of your app for every CPU core on your server, effectively multiplying your app's performance.



**Workflow Example:**
1.  **Start:** `pm2 start app.js --name "my-api"`
2.  **Scale:** `pm2 scale "my-api" +3` (adds 3 more instances)
3.  **Check Health:** `pm2 monit`
4.  **Update code:** `pm2 reload all` (restarts instances one-by-one so users never see a 404/500 error during the update).