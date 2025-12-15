// Main application logic
class BPDietApp {
    constructor() {
        this.currentBP = 'high';
        this.elements = {
            navItems: document.querySelectorAll('.nav-item'),
            pages: document.querySelectorAll('.page-content'),
            topTabs: document.querySelectorAll('.top-tab'),
            sections: document.querySelectorAll('.section-content'),
            modal: document.getElementById('dietModal'),
            modalBody: document.getElementById('modalBody'),
            modalClose: document.getElementById('modalClose')
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.loadContent();
        this.loadSavedState();
    }
    
    attachEventListeners() {
        // Bottom navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => this.switchBP(item.dataset.bp));
        });
        
        // Top tabs
        this.elements.topTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchSection(tab.dataset.page, tab.dataset.section);
            });
        });
        
        // Modal
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });
    }
    
    switchBP(bpType) {
        this.currentBP = bpType;
        
        // Update bottom nav
        this.elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.bp === bpType);
        });
        
        // Update pages
        this.elements.pages.forEach(page => {
            page.classList.toggle('active', page.id === `${bpType}BPPage`);
        });
        
        // Scroll to top
        document.getElementById('contentArea').scrollTop = 0;
        
        // Save state
        localStorage.setItem('currentBP', bpType);
    }
    
    switchSection(page, section) {
        // Update top tabs for this page
        this.elements.topTabs.forEach(tab => {
            if (tab.dataset.page === page) {
                tab.classList.toggle('active', tab.dataset.section === section);
            }
        });
        
        // Update sections for this page
        const dietSection = document.getElementById(`${page}Diet`);
        const guideSection = document.getElementById(`${page}Guide`);
        
        if (section === 'diet') {
            dietSection.classList.add('active');
            guideSection.classList.remove('active');
        } else {
            dietSection.classList.remove('active');
            guideSection.classList.add('active');
        }
        
        // Scroll to top
        document.getElementById('contentArea').scrollTop = 0;
    }
    
    loadContent() {
        // Load High BP content
        this.loadDietContent('high');
        this.loadGuideContent('high');
        
        // Load Low BP content
        this.loadDietContent('low');
        this.loadGuideContent('low');
    }
    
    loadDietContent(type) {
        const data = dietData[type];
        const container = document.getElementById(`${type}TimeSlots`);
        
        container.innerHTML = '';
        
        data.chart.forEach(item => {
            const card = document.createElement('button');
            card.className = 'time-slot-card';
            card.innerHTML = `
                <div class="time-slot-header">
                    <span class="time-slot-icon">${item.icon}</span>
                    <span class="time-slot-time">${item.time}</span>
                </div>
                <div class="time-slot-food">${item.food}</div>
            `;
            card.addEventListener('click', () => this.showDietDetail(item));
            container.appendChild(card);
        });
    }
    
    loadGuideContent(type) {
        const data = dietData[type];
        const container = document.getElementById(`${type}GuideContent`);
        container.innerHTML = data.rules;
    }
    
    showDietDetail(item) {
        this.elements.modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-icon">${item.icon}</span>
                <h2 class="modal-title">${item.time}</h2>
            </div>
            <div class="modal-section">
                <div class="modal-label">सुझाए गए खाद्य विकल्प</div>
                <div class="modal-text">${item.food}</div>
            </div>
            <div class="modal-section">
                <div class="modal-label">यह कैसे मदद करता है</div>
                <div class="modal-text">${item.benefit}</div>
            </div>
        `;
        this.elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    loadSavedState() {
        const savedBP = localStorage.getItem('currentBP');
        if (savedBP && (savedBP === 'high' || savedBP === 'low')) {
            this.switchBP(savedBP);
        }
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BPDietApp());
} else {
    new BPDietApp();
}
