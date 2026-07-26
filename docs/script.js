document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Animations (Fade Up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(element => {
        observer.observe(element);
    });

    // 2. 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });
    });

    // 3. Generate Mock Heatmap Grid
    const heatmapContainer = document.getElementById('heatmap-container');
    if (heatmapContainer) {
        // Generate 21 days (3 weeks)
        for (let i = 0; i < 21; i++) {
            const day = document.createElement('div');
            day.className = 'heatmap-day';
            
            // Randomly assign a commit level to some days to make it look realistic
            const rand = Math.random();
            if (rand > 0.8) day.classList.add('l4');
            else if (rand > 0.6) day.classList.add('l3');
            else if (rand > 0.4) day.classList.add('l2');
            else if (rand > 0.2) day.classList.add('l1');
            
            heatmapContainer.appendChild(day);
        }
    }
});
