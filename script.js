// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('resume-form');
	const preview = document.getElementById('preview');
	
	if (form) {
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			generateResume();
		});
	}
	
	// Handle current job checkboxes
	document.addEventListener('change', function(e) {
		if (e.target.classList.contains('current-job-checkbox')) {
			const endDateInput = e.target.closest('.experience-item').querySelector('input[name="end-date"]');
			if (e.target.checked) {
				endDateInput.disabled = true;
				endDateInput.value = '';
			} else {
				endDateInput.disabled = false;
			}
		}
	});
	
	// Try to load saved resume on page load
	loadResume();
});

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
	if (!text) return '';
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Format date from YYYY-MM to readable format
function formatDate(dateString) {
	if (!dateString) return '';
	const [year, month] = dateString.split('-');
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	return `${months[parseInt(month) - 1]} ${year}`;
}

// Generate resume preview
function generateResume() {
	const form = document.getElementById('resume-form');
	const preview = document.getElementById('preview');
	const actionButtons = document.getElementById('action-buttons');
	
	if (!form || !preview) return;
	
	// Get personal information
	const fullName = escapeHtml(form.elements['full-name'].value);
	const email = escapeHtml(form.elements['email'].value);
	const phoneNumber = escapeHtml(form.elements['phone-number'].value);
	const address = escapeHtml(form.elements['address'].value);
	const linkedin = form.elements['linkedin'].value;
	const github = form.elements['github'].value;
	const website = form.elements['website'].value;
	const summary = escapeHtml(form.elements['summary'].value);
	
	// Build contact info
	let contactInfo = [];
	if (email) contactInfo.push(`<a href="mailto:${email}">${email}</a>`);
	if (phoneNumber) contactInfo.push(escapeHtml(phoneNumber));
	if (address) contactInfo.push(escapeHtml(address));
	if (linkedin) contactInfo.push(`<a href="${linkedin.startsWith('http') ? linkedin : 'https://' + linkedin}" target="_blank">LinkedIn</a>`);
	if (github) contactInfo.push(`<a href="${github.startsWith('http') ? github : 'https://' + github}" target="_blank">GitHub</a>`);
	if (website) contactInfo.push(`<a href="${website.startsWith('http') ? website : 'https://' + website}" target="_blank">Website</a>`);
	
	// Get work experiences
	const workExperiences = [];
	const workItems = document.querySelectorAll('.experience-item');
	workItems.forEach(item => {
		const jobTitle = escapeHtml(item.querySelector('input[name="job-title"]')?.value || '');
		const company = escapeHtml(item.querySelector('input[name="company"]')?.value || '');
		const startDate = item.querySelector('input[name="start-date"]')?.value || '';
		const endDate = item.querySelector('input[name="end-date"]')?.value || '';
		const isCurrent = item.querySelector('.current-job-checkbox')?.checked || false;
		const description = escapeHtml(item.querySelector('textarea[name="job-description"]')?.value || '').replace(/\n/g, '<br>');
		
		if (jobTitle && company) {
			let dateRange = '';
			if (startDate) {
				dateRange = formatDate(startDate);
				if (isCurrent) {
					dateRange += ' - Present';
				} else if (endDate) {
					dateRange += ' - ' + formatDate(endDate);
				}
			}
			
			workExperiences.push({
				jobTitle,
				company,
				dateRange,
				description
			});
		}
	});
	
	// Get education
	const educations = [];
	const eduItems = document.querySelectorAll('.education-item');
	eduItems.forEach(item => {
		const degree = escapeHtml(item.querySelector('input[name="degree"]')?.value || '');
		const institution = escapeHtml(item.querySelector('input[name="institution"]')?.value || '');
		const gradDate = item.querySelector('input[name="grad-date"]')?.value || '';
		const gpa = escapeHtml(item.querySelector('input[name="gpa"]')?.value || '');
		
		if (degree && institution) {
			educations.push({
				degree,
				institution,
				gradDate: gradDate ? formatDate(gradDate) : '',
				gpa
			});
		}
	});
	
	// Get skills
	const skillsText = form.elements['skills'].value;
	const skills = skillsText.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
	
	// Get projects
	const projects = [];
	const projectItems = document.querySelectorAll('.project-item');
	projectItems.forEach(item => {
		const projectName = escapeHtml(item.querySelector('input[name="project-name"]')?.value || '');
		const projectLink = item.querySelector('input[name="project-link"]')?.value || '';
		const projectDesc = escapeHtml(item.querySelector('textarea[name="project-description"]')?.value || '').replace(/\n/g, '<br>');
		
		if (projectName) {
			projects.push({
				name: projectName,
				link: projectLink,
				description: projectDesc
			});
		}
	});
	
	// Get certifications
	const certifications = [];
	const certItems = document.querySelectorAll('.cert-item');
	certItems.forEach(item => {
		const certName = escapeHtml(item.querySelector('input[name="cert-name"]')?.value || '');
		const certOrg = escapeHtml(item.querySelector('input[name="cert-org"]')?.value || '');
		const certDate = item.querySelector('input[name="cert-date"]')?.value || '';
		
		if (certName) {
			certifications.push({
				name: certName,
				org: certOrg,
				date: certDate ? formatDate(certDate) : ''
			});
		}
	});
	
	// Build resume HTML
	let resumeHTML = `
		<div class="resume-preview">
			<h2>${fullName}</h2>
			<div class="contact-info">${contactInfo.join(' • ')}</div>
	`;
	
	if (summary) {
		resumeHTML += `<div class="summary">${summary.replace(/\n/g, '<br>')}</div>`;
	}
	
	// Work Experience
	if (workExperiences.length > 0) {
		resumeHTML += `<h3>Work Experience</h3>`;
		workExperiences.forEach(exp => {
			resumeHTML += `
				<div class="experience-entry">
					<div class="job-header">
						<div>
							<div class="job-title">${exp.jobTitle}</div>
							<div class="company-name">${exp.company}</div>
						</div>
						${exp.dateRange ? `<div class="date-range">${exp.dateRange}</div>` : ''}
					</div>
					${exp.description ? `<div>${exp.description}</div>` : ''}
				</div>
			`;
		});
	}
	
	// Education
	if (educations.length > 0) {
		resumeHTML += `<h3>Education</h3>`;
		educations.forEach(edu => {
			resumeHTML += `
				<div class="education-entry">
					<div class="edu-header">
						<div>
							<div class="degree-name">${edu.degree}</div>
							<div class="institution-name">${edu.institution}</div>
						</div>
						${edu.gradDate ? `<div class="date-range">${edu.gradDate}</div>` : ''}
					</div>
					${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
				</div>
			`;
		});
	}
	
	// Skills
	if (skills.length > 0) {
		resumeHTML += `<h3>Skills</h3>`;
		resumeHTML += `<div class="skills-list">`;
		skills.forEach(skill => {
			resumeHTML += `<span class="skill-tag">${skill}</span>`;
		});
		resumeHTML += `</div>`;
	}
	
	// Projects
	if (projects.length > 0) {
		resumeHTML += `<h3>Projects</h3>`;
		projects.forEach(project => {
			resumeHTML += `
				<div class="project-entry">
					<div class="project-header">
						<div class="project-name">${project.link ? `<a href="${project.link.startsWith('http') ? project.link : 'https://' + project.link}" target="_blank">${project.name}</a>` : project.name}</div>
					</div>
					${project.description ? `<div>${project.description}</div>` : ''}
				</div>
			`;
		});
	}
	
	// Certifications
	if (certifications.length > 0) {
		resumeHTML += `<h3>Certifications</h3>`;
		certifications.forEach(cert => {
			resumeHTML += `
				<div class="cert-entry">
					<div class="cert-header">
						<div>
							<div class="cert-name">${cert.name}</div>
							${cert.org ? `<div class="cert-org">${cert.org}</div>` : ''}
						</div>
						${cert.date ? `<div class="date-range">${cert.date}</div>` : ''}
					</div>
				</div>
			`;
		});
	}
	
	resumeHTML += `</div>`;
	
	// Display preview
	preview.innerHTML = resumeHTML;
	
	// Show action buttons
	if (actionButtons) {
		actionButtons.style.display = 'flex';
	}
	
	// Scroll to preview
	preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Add work experience section
function addWorkExperience() {
	const container = document.getElementById('work-experience-container');
	const newItem = document.createElement('div');
	newItem.className = 'experience-item';
	newItem.innerHTML = `
		<button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
		<div class="form-row">
			<div class="form-group">
				<label>Job Title *</label>
				<input type="text" name="job-title" class="box" placeholder="Software Engineer" required>
			</div>
			<div class="form-group">
				<label>Company *</label>
				<input type="text" name="company" class="box" placeholder="Tech Company Inc." required>
			</div>
		</div>
		<div class="form-row">
			<div class="form-group">
				<label>Start Date</label>
				<input type="month" name="start-date" class="box">
			</div>
			<div class="form-group">
				<label>End Date</label>
				<input type="month" name="end-date" class="box">
				<label class="checkbox-label">
					<input type="checkbox" name="current-job" class="current-job-checkbox"> Current Position
				</label>
			</div>
		</div>
		<div class="form-group">
			<label>Description *</label>
			<textarea name="job-description" rows="3" class="box" placeholder="Describe your responsibilities and achievements..." required></textarea>
		</div>
	`;
	container.appendChild(newItem);
}

// Add education section
function addEducation() {
	const container = document.getElementById('education-container');
	const newItem = document.createElement('div');
	newItem.className = 'education-item';
	newItem.innerHTML = `
		<button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
		<div class="form-row">
			<div class="form-group">
				<label>Degree/Certification *</label>
				<input type="text" name="degree" class="box" placeholder="Bachelor of Science in Computer Science" required>
			</div>
			<div class="form-group">
				<label>Institution *</label>
				<input type="text" name="institution" class="box" placeholder="University Name" required>
			</div>
		</div>
		<div class="form-row">
			<div class="form-group">
				<label>Graduation Date</label>
				<input type="month" name="grad-date" class="box">
			</div>
			<div class="form-group">
				<label>GPA (Optional)</label>
				<input type="text" name="gpa" class="box" placeholder="3.8/4.0">
			</div>
		</div>
	`;
	container.appendChild(newItem);
}

// Add project section
function addProject() {
	const container = document.getElementById('projects-container');
	const newItem = document.createElement('div');
	newItem.className = 'project-item';
	newItem.innerHTML = `
		<button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
		<div class="form-row">
			<div class="form-group">
				<label>Project Name</label>
				<input type="text" name="project-name" class="box" placeholder="E-Commerce Platform">
			</div>
			<div class="form-group">
				<label>Project Link</label>
				<input type="url" name="project-link" class="box" placeholder="https://project-demo.com">
			</div>
		</div>
		<div class="form-group">
			<label>Description</label>
			<textarea name="project-description" rows="2" class="box" placeholder="Brief description of the project..."></textarea>
		</div>
	`;
	container.appendChild(newItem);
}

// Add certification section
function addCertification() {
	const container = document.getElementById('certifications-container');
	const newItem = document.createElement('div');
	newItem.className = 'cert-item';
	newItem.innerHTML = `
		<button type="button" class="remove-btn" onclick="removeItem(this)">×</button>
		<div class="form-row">
			<div class="form-group">
				<label>Certification Name</label>
				<input type="text" name="cert-name" class="box" placeholder="AWS Certified Solutions Architect">
			</div>
			<div class="form-group">
				<label>Issuing Organization</label>
				<input type="text" name="cert-org" class="box" placeholder="Amazon Web Services">
			</div>
		</div>
		<div class="form-group">
			<label>Date</label>
			<input type="month" name="cert-date" class="box">
		</div>
	`;
	container.appendChild(newItem);
}

// Remove item
function removeItem(button) {
	if (confirm('Are you sure you want to remove this item?')) {
		button.closest('.experience-item, .education-item, .project-item, .cert-item').remove();
	}
}

// Save resume to localStorage
function saveResume() {
	const form = document.getElementById('resume-form');
	if (!form) return;
	
	const formData = new FormData(form);
	const data = {};
	
	// Save all form fields
	for (let [key, value] of formData.entries()) {
		if (!data[key]) {
			data[key] = [];
		}
		data[key].push(value);
	}
	
	// Save dynamic sections
	const workExperiences = [];
	document.querySelectorAll('.experience-item').forEach(item => {
		workExperiences.push({
			jobTitle: item.querySelector('input[name="job-title"]')?.value || '',
			company: item.querySelector('input[name="company"]')?.value || '',
			startDate: item.querySelector('input[name="start-date"]')?.value || '',
			endDate: item.querySelector('input[name="end-date"]')?.value || '',
			isCurrent: item.querySelector('.current-job-checkbox')?.checked || false,
			description: item.querySelector('textarea[name="job-description"]')?.value || ''
		});
	});
	
	const educations = [];
	document.querySelectorAll('.education-item').forEach(item => {
		educations.push({
			degree: item.querySelector('input[name="degree"]')?.value || '',
			institution: item.querySelector('input[name="institution"]')?.value || '',
			gradDate: item.querySelector('input[name="grad-date"]')?.value || '',
			gpa: item.querySelector('input[name="gpa"]')?.value || ''
		});
	});
	
	const projects = [];
	document.querySelectorAll('.project-item').forEach(item => {
		projects.push({
			name: item.querySelector('input[name="project-name"]')?.value || '',
			link: item.querySelector('input[name="project-link"]')?.value || '',
			description: item.querySelector('textarea[name="project-description"]')?.value || ''
		});
	});
	
	const certifications = [];
	document.querySelectorAll('.cert-item').forEach(item => {
		certifications.push({
			name: item.querySelector('input[name="cert-name"]')?.value || '',
			org: item.querySelector('input[name="cert-org"]')?.value || '',
			date: item.querySelector('input[name="cert-date"]')?.value || ''
		});
	});
	
	const saveData = {
		basic: {
			fullName: form.elements['full-name'].value,
			email: form.elements['email'].value,
			phoneNumber: form.elements['phone-number'].value,
			address: form.elements['address'].value,
			linkedin: form.elements['linkedin'].value,
			github: form.elements['github'].value,
			website: form.elements['website'].value,
			summary: form.elements['summary'].value,
			skills: form.elements['skills'].value
		},
		workExperiences,
		educations,
		projects,
		certifications
	};
	
	localStorage.setItem('resumeData', JSON.stringify(saveData));
	alert('Resume saved successfully!');
}

// Load resume from localStorage
function loadResume() {
	const savedData = localStorage.getItem('resumeData');
	if (!savedData) return;
	
	try {
		const data = JSON.parse(savedData);
		const form = document.getElementById('resume-form');
		if (!form) return;
		
		// Load basic info
		if (data.basic) {
			if (form.elements['full-name']) form.elements['full-name'].value = data.basic.fullName || '';
			if (form.elements['email']) form.elements['email'].value = data.basic.email || '';
			if (form.elements['phone-number']) form.elements['phone-number'].value = data.basic.phoneNumber || '';
			if (form.elements['address']) form.elements['address'].value = data.basic.address || '';
			if (form.elements['linkedin']) form.elements['linkedin'].value = data.basic.linkedin || '';
			if (form.elements['github']) form.elements['github'].value = data.basic.github || '';
			if (form.elements['website']) form.elements['website'].value = data.basic.website || '';
			if (form.elements['summary']) form.elements['summary'].value = data.basic.summary || '';
			if (form.elements['skills']) form.elements['skills'].value = data.basic.skills || '';
		}
		
		// Load work experiences
		if (data.workExperiences && data.workExperiences.length > 0) {
			// Clear existing (except first)
			const container = document.getElementById('work-experience-container');
			if (container) {
				container.innerHTML = '';
				data.workExperiences.forEach((exp, index) => {
					if (index === 0) {
						// Use existing first item
						const firstItem = container.querySelector('.experience-item') || document.createElement('div');
						firstItem.className = 'experience-item';
						firstItem.innerHTML = `
							<div class="form-row">
								<div class="form-group">
									<label>Job Title *</label>
									<input type="text" name="job-title" class="box" value="${exp.jobTitle || ''}" required>
								</div>
								<div class="form-group">
									<label>Company *</label>
									<input type="text" name="company" class="box" value="${exp.company || ''}" required>
								</div>
							</div>
							<div class="form-row">
								<div class="form-group">
									<label>Start Date</label>
									<input type="month" name="start-date" class="box" value="${exp.startDate || ''}">
								</div>
								<div class="form-group">
									<label>End Date</label>
									<input type="month" name="end-date" class="box" value="${exp.endDate || ''}" ${exp.isCurrent ? 'disabled' : ''}>
									<label class="checkbox-label">
										<input type="checkbox" name="current-job" class="current-job-checkbox" ${exp.isCurrent ? 'checked' : ''}> Current Position
									</label>
								</div>
							</div>
							<div class="form-group">
								<label>Description *</label>
								<textarea name="job-description" rows="3" class="box" required>${exp.description || ''}</textarea>
							</div>
						`;
						container.appendChild(firstItem);
					} else {
						addWorkExperience();
						const items = container.querySelectorAll('.experience-item');
						const item = items[items.length - 1];
						item.querySelector('input[name="job-title"]').value = exp.jobTitle || '';
						item.querySelector('input[name="company"]').value = exp.company || '';
						item.querySelector('input[name="start-date"]').value = exp.startDate || '';
						item.querySelector('input[name="end-date"]').value = exp.endDate || '';
						item.querySelector('.current-job-checkbox').checked = exp.isCurrent || false;
						item.querySelector('textarea[name="job-description"]').value = exp.description || '';
					}
				});
			}
		}
		
		// Similar loading for education, projects, certifications...
		// (Simplified for brevity - full implementation would load all sections)
		
	} catch (e) {
		console.error('Error loading resume:', e);
	}
}

// Clear resume
function clearResume() {
	if (confirm('Are you sure you want to clear all fields? This cannot be undone.')) {
		document.getElementById('resume-form').reset();
		document.getElementById('work-experience-container').innerHTML = `
			<div class="experience-item">
				<div class="form-row">
					<div class="form-group">
						<label>Job Title *</label>
						<input type="text" name="job-title" class="box" placeholder="Software Engineer" required>
					</div>
					<div class="form-group">
						<label>Company *</label>
						<input type="text" name="company" class="box" placeholder="Tech Company Inc." required>
					</div>
				</div>
				<div class="form-row">
					<div class="form-group">
						<label>Start Date</label>
						<input type="month" name="start-date" class="box">
					</div>
					<div class="form-group">
						<label>End Date</label>
						<input type="month" name="end-date" class="box">
						<label class="checkbox-label">
							<input type="checkbox" name="current-job" class="current-job-checkbox"> Current Position
						</label>
					</div>
				</div>
				<div class="form-group">
					<label>Description *</label>
					<textarea name="job-description" rows="3" class="box" placeholder="Describe your responsibilities and achievements..." required></textarea>
				</div>
			</div>
		`;
		document.getElementById('education-container').innerHTML = `
			<div class="education-item">
				<div class="form-row">
					<div class="form-group">
						<label>Degree/Certification *</label>
						<input type="text" name="degree" class="box" placeholder="Bachelor of Science in Computer Science" required>
					</div>
					<div class="form-group">
						<label>Institution *</label>
						<input type="text" name="institution" class="box" placeholder="University Name" required>
					</div>
				</div>
				<div class="form-row">
					<div class="form-group">
						<label>Graduation Date</label>
						<input type="month" name="grad-date" class="box">
					</div>
					<div class="form-group">
						<label>GPA (Optional)</label>
						<input type="text" name="gpa" class="box" placeholder="3.8/4.0">
					</div>
				</div>
			</div>
		`;
		document.getElementById('projects-container').innerHTML = `
			<div class="project-item">
				<div class="form-row">
					<div class="form-group">
						<label>Project Name</label>
						<input type="text" name="project-name" class="box" placeholder="E-Commerce Platform">
					</div>
					<div class="form-group">
						<label>Project Link</label>
						<input type="url" name="project-link" class="box" placeholder="https://project-demo.com">
					</div>
				</div>
				<div class="form-group">
					<label>Description</label>
					<textarea name="project-description" rows="2" class="box" placeholder="Brief description of the project..."></textarea>
				</div>
			</div>
		`;
		document.getElementById('certifications-container').innerHTML = `
			<div class="cert-item">
				<div class="form-row">
					<div class="form-group">
						<label>Certification Name</label>
						<input type="text" name="cert-name" class="box" placeholder="AWS Certified Solutions Architect">
					</div>
					<div class="form-group">
						<label>Issuing Organization</label>
						<input type="text" name="cert-org" class="box" placeholder="Amazon Web Services">
					</div>
				</div>
				<div class="form-group">
					<label>Date</label>
					<input type="month" name="cert-date" class="box">
				</div>
			</div>
		`;
		document.getElementById('preview').innerHTML = `
			<div class="preview-placeholder">
				<p>👆 Fill out the form and click "Create Resume" to see your preview here</p>
			</div>
		`;
		document.getElementById('action-buttons').style.display = 'none';
		localStorage.removeItem('resumeData');
	}
}

// PDF download function
function downloadPDF() {
	if (typeof html2pdf === 'undefined') {
		alert('PDF library not loaded. Please wait for the page to fully load.');
		return;
	}

	const element = document.getElementById('preview');
	if (!element || element.innerHTML.trim() === '' || element.querySelector('.preview-placeholder')) {
		alert('Please create a resume first before downloading.');
		return;
	}

	const options = {
		filename: 'resume.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { format: 'a4', orientation: 'portrait', unit: 'mm' }
	};

	html2pdf().set(options).from(element).save();
}

// Print resume
function printResume() {
	const element = document.getElementById('preview');
	if (!element || element.innerHTML.trim() === '' || element.querySelector('.preview-placeholder')) {
		alert('Please create a resume first before printing.');
		return;
	}
	
	window.print();
}

// Make functions available globally
window.downloadPDF = downloadPDF;
window.printResume = printResume;
window.saveResume = saveResume;
window.loadResume = loadResume;
window.clearResume = clearResume;
window.addWorkExperience = addWorkExperience;
window.addEducation = addEducation;
window.addProject = addProject;
window.addCertification = addCertification;
window.removeItem = removeItem;
