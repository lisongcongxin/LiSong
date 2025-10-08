document.addEventListener('DOMContentLoaded', function() {
    // 主题切换功能
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme') || 'dark'; // 设置默认主题为暗色

    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }

    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme);

    // 折叠式布局功能
    const collapsibleToggles = document.querySelectorAll('.collapsible-toggle');
    
    collapsibleToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const content = document.querySelector(`#${targetId} .collapsible-content`);
            const isExpanded = content.classList.contains('expanded');
            
            if (isExpanded) {
                content.classList.remove('expanded');
                this.textContent = '展开查看';
                this.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
                this.textContent = '收起内容';
                this.classList.add('expanded');
            }
        });
    });

    // 动态加载项目数据
    async function loadProjects() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            renderProjects(data.projects);
        } catch (error) {
            console.error('加载项目数据失败:', error);
            showError('加载项目数据失败，请稍后重试');
        }
    }

    // 渲染项目卡片
    function renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return;

        container.innerHTML = '';

        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            container.appendChild(projectCard);
        });
    }

    // 创建项目卡片

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-item';

        const projectLink = typeof project.link === 'string' ? project.link.trim() : '';
        const hasLink = projectLink.length > 0;

        if (hasLink) {
            card.classList.add('is-clickable');
            card.setAttribute('role', 'link');
            card.setAttribute('tabindex', '0');
            card.addEventListener('click', (event) => {
                if (event.target.closest('.project-link')) {
                    return;
                }
                window.open(projectLink, '_blank', 'noopener,noreferrer');
            });
            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    window.open(projectLink, '_blank', 'noopener,noreferrer');
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
            ? `<a class="project-link" href="${projectLink}" target="_blank" rel="noopener noreferrer">访问项目<span class="link-icon" aria-hidden="true">&#8599;</span></a>`
            : '<span class="project-link disabled">暂无链接</span>';

        card.innerHTML = `
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-name">${project.name || '未命名项目'}</h3>
                    ${statusMarkup}
                </div>
                ${descriptionMarkup}
                ${technologiesMarkup}
                ${linkMarkup}
            </div>
        `;

        return card;
    }
    // 根据状态获取CSS类
    function getStatusClass(status) {
        const statusMap = {
            '在线': 'status-online',
            '开发中': 'status-development',
            '测试中': 'status-testing'
        };
        return statusMap[status] || 'status-development';
    }

    // 显示错误信息
    function showError(message) {
        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <p>${message}</p>
                    <button onclick="loadProjects()" style="margin-top: 15px; padding: 10px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 20px; cursor: pointer;">重新加载</button>
                </div>
            `;
        }
    }

    // 页面加载完成后加载项目数据
    loadProjects();

    // 兴趣爱好饼图 - 适配深色模式
    function createInterestsChart() {
        const ctx = document.getElementById('interestsChart');
        if (!ctx) return;

        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#e6f1ff' : '#1f2937';

        new Chart(ctx.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['阅读', '运动', '台球', '音乐', '电影', '理财'],
                datasets: [{
                    data: [25, 20, 15, 15, 15, 10],
                    backgroundColor: [
                        '#3B82F6',  // 蓝色
                        '#10B981',  // 绿色
                        '#EF4444',  // 红色
                        '#F59E0B',  // 黄色
                        '#8B5CF6',  // 紫色
                        '#06B6D4'   // 青色
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: '"Noto Sans SC", sans-serif',
                                size: 14
                            },
                            padding: 15,
                            color: textColor
                        }
                    }
                }
            }
        });
    }

    // 等待Chart.js加载完成后初始化图表
    if (typeof Chart !== 'undefined') {
        createInterestsChart();
    } else {
        window.addEventListener('load', createInterestsChart);
    }

    // 主题切换时更新图表颜色
    toggleSwitch.addEventListener('change', function() {
        // 重新加载图表以适配新主题
        const chartCanvas = document.getElementById('interestsChart');
        if (chartCanvas && typeof Chart !== 'undefined') {
            const chart = Chart.getChart(chartCanvas);
            if (chart) {
                chart.destroy();
            }
            // 短暂延迟以确保主题已切换
            setTimeout(createInterestsChart, 100);
        }
    });
});