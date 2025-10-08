# -*- coding: utf-8 -*-
import re
from pathlib import Path

path = Path('script.js')
text = path.read_text(encoding='utf-8')

create_pattern = re.compile(r"\s*function createProjectCard\(project\) \{[\s\S]*?\}\n", re.M)
if not create_pattern.search(text):
    raise SystemExit('createProjectCard block not found')
new_create = '''function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-item';

    const projectLink = typeof project.link === 'string' ? project.link.trim() : '';
    const hasLink = projectLink.length > 0;

    if (hasLink) {
        card.classList.add('is-clickable');
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        const openProject = () => window.open(projectLink, '_blank', 'noopener,noreferrer');
        card.addEventListener('click', (event) => {
            if (event.target.closest('.project-link')) {
                return;
            }
            openProject();
        });
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProject();
            }
        });
    }

    const statusText = (project.status || '').trim();
    const statusClass = getStatusClass(statusText);
    const techList = Array.isArray(project.technologies) ? project.technologies : [];

    const statusMarkup = statusText ? `<span class="project-status ${statusClass}">${statusText}</span>` : '';
    const descriptionMarkup = project.description ? `<p class="project-description">${project.description}</p>` : '';
    const techMarkup = techList.map((tech) => `<span class="tech-tag">${tech}</span>`).join('');
    const technologiesMarkup = techMarkup ? `<div class="project-technologies">${techMarkup}</div>` : '';
    const linkMarkup = hasLink
        ? `<a class="project-link" href="${projectLink}" target="_blank" rel="noopener noreferrer">\u8bbf\u95ee\u9879\u76ee<span class="link-icon" aria-hidden="true">&#8599;</span></a>`
        : '<span class="project-link disabled">\u6682\u65e0\u94fe\u63a5</span>';

    const safeName = project.name || '\u672a\u547d\u540d\u9879\u76ee';

    card.innerHTML = `
        <div class="project-content">
            <div class="project-header">
                <h3 class="project-name">${safeName}</h3>
                ${statusMarkup}
            </div>
            ${descriptionMarkup}
            ${technologiesMarkup}
            ${linkMarkup}
        </div>
    `;

    return card;
}
'''
text = create_pattern.sub(new_create, text, count=1)

status_pattern = re.compile(r"function getStatusClass\(status\) \{[\s\S]*?\}\n", re.M)
if not status_pattern.search(text):
    raise SystemExit('getStatusClass block not found')
new_status = '''function getStatusClass(status) {
    const statusMap = {
        '\\u5728\\u7ebf': 'status-online',
        '\\u5f00\\u53d1\\u4e2d': 'status-development',
        '\\u6d4b\\u8bd5\\u4e2d': 'status-testing'
    };
    return statusMap[status] || 'status-development';
}
'''
text = status_pattern.sub(new_status, text, count=1)

path.write_text(text, encoding='utf-8')
