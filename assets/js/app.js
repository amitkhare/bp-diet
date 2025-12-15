// Main application logic
class BPDietApp {
    constructor() {
        this.elements = {
            bpType: document.getElementById('bpType'),
            timeSlot: document.getElementById('timeSlot'),
            showDiet: document.getElementById('showDiet'),
            dietContent: document.getElementById('dietContent'),
            rulesContent: document.getElementById('rulesContent')
        };
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.loadSavedState();
    }
    
    attachEventListeners() {
        this.elements.bpType.addEventListener('change', () => this.handleBPTypeChange());
        this.elements.showDiet.addEventListener('click', () => this.showDiet());
        
        // Add keyboard support
        this.elements.showDiet.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.showDiet();
            }
        });
    }
    
    handleBPTypeChange() {
        const type = this.elements.bpType.value;
        this.elements.timeSlot.innerHTML = '<option value="">-- समय चुनें --</option>';
        
        if (type && dietData[type]) {
            this.populateTimeSlots(type);
            this.elements.timeSlot.disabled = false;
            this.elements.showDiet.disabled = false;
            this.showRules(type);
            this.saveState('bpType', type);
        } else {
            this.resetForm();
        }
    }
    
    populateTimeSlots(type) {
        dietData[type].chart.forEach(item => {
            const option = document.createElement('option');
            option.value = item.time;
            option.textContent = `${item.icon} ${item.time}`;
            this.elements.timeSlot.appendChild(option);
        });
    }
    
    showDiet() {
        const type = this.elements.bpType.value;
        const time = this.elements.timeSlot.value;
        
        if (!type || !time) return;
        
        const item = dietData[type].chart.find(i => i.time === time);
        
        if (item) {
            this.elements.dietContent.innerHTML = `
                <h2>${item.icon} ${item.time}</h2>
                <p><strong>सुझाए गए खाद्य विकल्प:</strong> ${item.food}</p>
                <p><strong>यह कैसे मदद करता है:</strong> ${item.benefit}</p>
            `;
            this.elements.dietContent.style.display = 'block';
            
            // Smooth scroll to diet content
            this.elements.dietContent.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
            
            this.saveState('timeSlot', time);
        }
    }
    
    showRules(type) {
        if (dietData[type]) {
            this.elements.rulesContent.innerHTML = dietData[type].rules;
        }
    }
    
    resetForm() {
        this.elements.timeSlot.disabled = true;
        this.elements.showDiet.disabled = true;
        this.elements.dietContent.style.display = 'none';
        this.elements.rulesContent.innerHTML = '';
        localStorage.removeItem('bpDietApp');
    }
    
    saveState(key, value) {
        const state = JSON.parse(localStorage.getItem('bpDietApp') || '{}');
        state[key] = value;
        localStorage.setItem('bpDietApp', JSON.stringify(state));
    }
    
    loadSavedState() {
        const state = JSON.parse(localStorage.getItem('bpDietApp') || '{}');
        
        if (state.bpType) {
            this.elements.bpType.value = state.bpType;
            this.handleBPTypeChange();
            
            if (state.timeSlot) {
                this.elements.timeSlot.value = state.timeSlot;
            }
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BPDietApp());
} else {
    new BPDietApp();
}
