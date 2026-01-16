// ============================================
//   LANDING PAGE - RALDY LOPEZ - VERSIÓN LIMPIA
//   ============================================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar && window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.padding = '15px 0';
    } else if (navbar) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.padding = '20px 0';
    }
});

// ============================================
//   TYPING EFFECT - EFECTO DE ESCRITURA
// ============================================

// Inicializar el efecto typing cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando efecto typing...');
    
    const typingElement = document.querySelector('.typing-text');
    
    if (!typingElement) {
        console.error('No se encontró el elemento .typing-text');
        return;
    }
    
    const texts = [
        "I'm a UI/UX Designer",
        "I'm a Frontend Expert", 
        "I'm a Modern Web Developer",
        "I'm a Creative Developer",
        "I'm a Digital Solutions Expert"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Borrando
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Escribiendo
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Controlar el flujo
        if (!isDeleting && charIndex === currentText.length) {
            // Terminó de escribir
            typingSpeed = 2000; // Pausa larga
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Terminó de borrar
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pausa antes de nuevo texto
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Iniciar el efecto después de 1 segundo
    setTimeout(typeText, 1000);
});
