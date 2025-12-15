// Main application logic
class BPDietApp {
    constructor() {
        this.currentBPType = null;
        this.elements = {
            navItems: document.querySelectorAll('.nav-item'),
            tabs: document.querySelectorAll('.tab-content'),
            bpCards: document.querySelectorAll('.bp-card'),
            timeSlots: document.getElementById('timeSlots'),
            dietTitle: document.getElementById('dietTitle'),
            guideContent: document.getElementById('guideContent'),
            backBtn: document.getElementById('backBtn'),
            modal: document.getElementById('dietModal'),
            modalBody: document.getElementById('modalBody'),
            modalClose: document.getElementById('modalClose')
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.loadSavedState();
    }
    
    attachEventListeners() {
        // Bottom navigation
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', () => this.switchTab(item.dataset.tab));
        });
        
        // BP type selection
        this.elements.bpCards.forEach(card => {
            card.addEventListener('click', () => this.selectBPType(card.dataset.type));
        });
        
        // Back button
        this.elements.backBtn.addEventListener('click', () => this.switchTab('home'));
        
        // Modal close
        this.elements.modalClose.addEventListener('click', () => this.closeModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.closeModal();
        });
    }
    
    switchTab(tabName) {
        // Update navigation
        this.elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });
        
        // Update content
        this.elements.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.id === `${tabName}Tab`);
        });
        
        // Scroll to top
        document.getElementById('contentArea').scrollTop = 0;
    }
    
    selectBPType(type) {
        this.currentBPType = type;
        
        // Update UI
        this.elements.bpCards.forEach(card => {
            card.classList.toggle('selected', card.dataset.type === type);
        });
        
        // Update diet tab
        this.updateDietTab(type);
        
        // Update guide tab
        this.updateGuideTab(type);
        
        // Save state
        localStorage.setItem('bpType', type);
        
        // Switch to diet tab
        setTimeout(() => this.switchTab('diet'), 300);
    }
    
    updateDietTab(type) {
        const data = dietData[type];
        const title = type === 'high' ? '🔴 हाई बीपी डाइट' : '🔵 लो बीपी डाइट';
        
        this.elements.dietTitle.textContent = title;
        this.elements.timeSlots.innerHTML = '';
        
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
            this.elements.timeSlots.appendChild(card);
        });
    }
    
    updateGuideTab(type) {
        const data = dietData[type];
        this.elements.guideContent.innerHTML = data.rules;
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
        const savedType = localStorage.getItem('bpType');
        if (savedType && dietData[savedType]) {
            this.selectBPType(savedType);
            this.switchTab('home');
        }
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BPDietApp());
} else {
    new BPDietApp();
}
