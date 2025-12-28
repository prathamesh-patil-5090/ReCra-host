# Render Deployment Guide for ReCra Backend

## Prerequisites

- GitHub account
- Render account (sign up at https://render.com)
- Your code pushed to a GitHub repository

## Step 1: Prepare Your Repository

Ensure the following files are in your repository root:

- ✅ `build.sh` - Build script for Render
- ✅ `render.yaml` - Render configuration file
- ✅ `requirements.txt` - Python dependencies
- ✅ `runtime.txt` - Python version specification
- ✅ `.renderignore` - Files to exclude from deployment

## Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Prepare for Render deployment"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 3: Deploy on Render

### Option A: Using render.yaml (Recommended)

1. Go to https://dashboard.render.com
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click "Apply" to deploy

### Option B: Manual Setup

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: recra-backend
   - **Runtime**: Python 3
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn ReCra.wsgi:application`
   - **Instance Type**: Free

## Step 4: Configure Environment Variables

Add these environment variables in Render dashboard:

**Required:**

- `SECRET_KEY`: Generate a secure key (use Django's `get_random_secret_key()`)
- `DEBUG`: Set to `False`
- `ALLOWED_HOSTS`: Your Render URL (e.g., `your-app.onrender.com`)

**Optional:**

- `CORS_ALLOWED_ORIGINS`: Frontend URLs (comma-separated)
- `CSRF_TRUSTED_ORIGINS`: Frontend URLs with https:// prefix (comma-separated)

Example:

```
SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=recra-backend.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
CSRF_TRUSTED_ORIGINS=https://your-frontend.com,https://www.your-frontend.com
```

## Step 5: Test the Deployment

Once deployed, test your health endpoint:

```bash
curl https://your-app.onrender.com/health/
```

Expected response:

```json
{
  "status": "healthy",
  "message": "ReCra Backend is running",
  "timestamp": "2025-12-28 12:30:00.000000"
}
```

## Step 6: Update Frontend Configuration

Update your React app to use the Render backend URL:

```javascript
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://your-app.onrender.com";
```

## Available Endpoints

- `GET /health/` - Health check endpoint
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `POST /analyze_resume_view/` - Analyze resume
- `POST /suggest_improvements/` - Suggest improvements
- `POST /check_match/` - Check job match

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure all dependencies are in `requirements.txt`
- Verify Python version in `runtime.txt` is supported

### Server Won't Start

- Check `ALLOWED_HOSTS` includes your Render URL
- Verify `SECRET_KEY` is set
- Check start command logs for errors

### Static Files Not Loading

- Ensure `collectstatic` runs in `build.sh`
- WhiteNoise is configured for serving static files
- Check `STATIC_ROOT` and `STATIC_URL` settings

### Database Issues

- Free tier uses SQLite (file-based database)
- For production, consider upgrading to PostgreSQL
- Data persists on Render's free tier but may be cleared during deploys

## Important Notes

1. **Free Tier Limitations**:

   - Service spins down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - 750 hours/month of runtime

2. **Database**:

   - Current setup uses SQLite (not recommended for production)
   - Consider PostgreSQL for production workloads
   - Add database backups if using production data

3. **Machine Learning Models**:

   - TensorFlow and spaCy models will be downloaded during build
   - Build time may be longer (5-10 minutes)
   - Ensure build timeout is sufficient

4. **File Uploads**:
   - Resume uploads are stored temporarily
   - Consider using cloud storage (S3, Cloudinary) for persistence

## Generate Secret Key

Run this in Python to generate a secure SECRET_KEY:

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

## Support

- Render Documentation: https://render.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/
