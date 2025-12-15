// Theme management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.currentTheme = this.getSavedTheme();
        
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
    }
    
    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    
    getSavedTheme() {
        const saved = localStorage.getItem('bpDietTheme');
        if (saved) return saved;
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }
    
    saveTheme(theme) {
        localStorage.setItem('bpDietTheme', theme);
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ThemeManager());
} else {
    new ThemeManager();
}
