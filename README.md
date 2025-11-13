# Resume Enhancement Project

This project includes a web-based resume builder and Python scripts for resume analysis and enhancement using OpenAI API.

## Setup Instructions

### 1. Python Environment Setup

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Download the spaCy English model:
```bash
python -m spacy download en_core_web_sm
```

### 2. Environment Variables

Create a `.env` file in the root directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 3. Web Application

The web application (`style.html`) can be opened directly in a browser. No server setup required for basic functionality.

## Features

### Web Resume Builder
- Fill out a form with your personal information
- Generate a formatted resume preview
- Download resume as PDF

### Jupyter Notebook Features
- **Cell 0**: Generate video resume content based on role and company
- **Cell 1**: Generate and filter certificates based on role keywords
- **Cell 2 & 3**: Generate cold emails/messages for job applications
- **Cell 4**: Analyze resume against job specifications

## File Structure

- `style.html` - Main web application interface
- `script.js` - JavaScript for form handling and PDF generation
- `style.css` - Styling for the web application
- `Features.ipynb` - Jupyter notebook with resume enhancement features
- `requirements.txt` - Python dependencies
- `.env` - Environment variables (create this file, not in git)
- `.gitignore` - Git ignore file

## Usage

### Web Application
1. Open `style.html` in a web browser
2. Fill out the form with your information
3. Click "Create Resume" to preview
4. Click "Download as PDF" to save

### Jupyter Notebook
1. Make sure you have `.env` file with `OPENAI_API_KEY` set
2. Open `Features.ipynb` in Jupyter
3. Run cells as needed
4. For cells that require PDF input, ensure `Main.pdf` is in the same directory

## Security Notes

- API keys are now stored in environment variables, not hardcoded
- The `.env` file is excluded from version control
- Always keep your API keys secure and never share them

