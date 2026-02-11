document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.lead-form');
    const button = form.querySelector('.button');
    const inputs = form.querySelectorAll('input, textarea');
  
    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
  
      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value.trim() !== '') {
          this.parentElement.classList.add('filled');
        } else {
          this.parentElement.classList.remove('filled');
        }
      });
  
      // Real-time validation feedback
      input.addEventListener('input', function() {
        if (this.validity.valid) {
          this.classList.remove('invalid');
          this.classList.add('valid');
        } else {
          this.classList.remove('valid');
          this.classList.add('invalid');
        }
      });
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      button.disabled = true;
      button.classList.add('loading');
      const originalText = button.textContent;
      button.innerHTML = `
        <span class="spinner"></span>
        <span>Enviando...</span>
      `;
  
      form.classList.add('submitting');
  
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
  
        if (response.ok) {
          form.classList.remove('submitting');
          form.classList.add('success');
          
          button.innerHTML = `
            <span class="checkmark">✓</span>
            <span>Enviado com sucesso!</span>
          `;
          button.classList.remove('loading');
          button.classList.add('success-btn');
  
          showNotification('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
  
          setTimeout(() => {
            form.reset();
            form.classList.remove('success');
            button.disabled = false;
            button.classList.remove('success-btn');
            button.innerHTML = originalText;
            inputs.forEach(input => {
              input.classList.remove('valid');
              input.parentElement.classList.remove('filled');
            });
          }, 3000);
  
        } else {
          throw new Error('Erro no envio');
        }
  
      } catch (error) {
        // Error animation
        form.classList.remove('submitting');
        form.classList.add('error');
        
        button.innerHTML = `
          <span class="error-icon">✕</span>
          <span>Erro ao enviar</span>
        `;
        button.classList.remove('loading');
        button.classList.add('error-btn');
  
        showNotification('Erro ao enviar mensagem. Por favor, tente novamente.', 'error');
  
        setTimeout(() => {
          form.classList.remove('error');
          button.disabled = false;
          button.classList.remove('error-btn');
          button.innerHTML = originalText;
        }, 3000);
  
        console.error('Erro:', error);
      }
    });
  
    function showNotification(message, type = 'info') {
      const existingNotification = document.querySelector('.notification');
      if (existingNotification) {
        existingNotification.remove();
      }
  
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
          <span class="notification-message">${message}</span>
        </div>
      `;
  
      document.body.appendChild(notification);
  
      setTimeout(() => notification.classList.add('show'), 10);
  
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }
  
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
  });