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

    // 兴趣爱好饼图
    const ctx = document.getElementById('interestsChart').getContext('2d');
    new Chart(ctx, {
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
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                    }
                }
            }
        }
    });
});