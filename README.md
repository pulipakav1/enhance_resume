# Resume Enhancement Project

A web-based resume builder and AI-powered resume analysis tool using OpenAI API.

## What It Does

- **Web Resume Builder**: Create professional resumes with multiple sections (experience, education, projects, certifications)
- **AI Features**: Generate video resume scripts, cold emails, analyze resume against job descriptions, and get enhancement suggestions

## Quick Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

2. Create `.env` file:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

3. Open `style.html` in browser to use the resume builder

## Workflow

### Web Application
1. Fill out the resume form
2. Click "Create Resume" to preview
3. Save/Load your progress
4. Download as PDF

### Jupyter Notebook
1. Open `Features.ipynb`
2. Run cells to:
   - Generate video resume scripts
   - Analyze certificates relevance
   - Create cold emails/messages
   - Analyze resume against job descriptions
   

## Files

- `style.html` - Resume builder interface
- `script.js` - Form handling & PDF generation
- `Features.ipynb` - AI-powered resume tools
- `requirements.txt` - Python dependencies
