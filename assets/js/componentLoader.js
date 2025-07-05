// Component Loader for Portfolio Website
class ComponentLoader {
  constructor() {
    this.components = {};
    this.loadedComponents = new Set();
  }

  // Load a component from file
  async loadComponent(name, containerId) {
    if (this.loadedComponents.has(name)) {
      return;
    }

    try {
      const response = await fetch(`components/${name}.html`);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${name}`);
      }
      
      const html = await response.text();
      this.components[name] = html;
      this.loadedComponents.add(name);
      
      if (containerId) {
        this.renderComponent(name, containerId);
      }
      
      return html;
    } catch (error) {
      console.error(`Error loading component ${name}:`, error);
      return null;
    }
  }

  // Render a component to a specific container
  renderComponent(name, containerId) {
    const container = document.getElementById(containerId);
    if (container && this.components[name]) {
      container.innerHTML = this.components[name];
    }
  }

  // Load multiple components
  async loadComponents(componentList) {
    const promises = componentList.map(({ name, containerId }) => 
      this.loadComponent(name, containerId)
    );
    
    await Promise.all(promises);
  }

  // Initialize the application
  async init() {
    // Load all components in order
    const components = [
      { name: 'header', containerId: 'header-container' },
      { name: 'sidebar', containerId: 'sidebar-container' },
      { name: 'home', containerId: 'home-container' },
      { name: 'about', containerId: 'about-container' },
      { name: 'resume', containerId: 'resume-container' },
      { name: 'work', containerId: 'work-container' },
      { name: 'testimonial', containerId: 'testimonial-container' },
      { name: 'contact', containerId: 'contact-container' },
      { name: 'modal', containerId: 'modal-container' },
      { name: 'footer', containerId: 'footer-container' }
    ];

    await this.loadComponents(components);
    
    // Initialize all JavaScript functionality after components are loaded
    this.initializeAllScripts();
  }

  // Initialize all scripts after components are loaded
  initializeAllScripts() {
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
      this.initializeNavigation();
      this.initializeSidebar();
      this.initializeTypedJS();
      this.initializeWorkSection();
      this.initializeTestimonials();
      this.initializeContactForm();
      this.initializeThemeToggle();
    }, 100);
  }

  // Initialize navigation functionality
  initializeNavigation() {
    const navLinks = document.querySelectorAll('a.inner-link');
    navLinks.forEach((item) => {
      item.addEventListener('click', function () {
        const activeNavLink = document.querySelector('nav ul li a.active');
        const targetSection = document.querySelector(`main > section${item.getAttribute('href')}`);
        const activeSection = document.querySelector('main > section.active');
        
        if (activeNavLink) activeNavLink.classList.remove('active');
        if (activeSection) activeSection.classList.remove('active');
        
        const targetNavLink = document.querySelector(`nav ul li a[href='${item.getAttribute('href')}']`);
        if (targetNavLink) targetNavLink.classList.add('active');
        if (targetSection) targetSection.classList.add('active');
      });
    });
  }

  // Initialize sidebar toggle
  initializeSidebar() {
    const toggleSidebar = document.querySelector('#sidebar .toggle-sidebar');
    if (toggleSidebar) {
      toggleSidebar.addEventListener('click', function () {
        document.querySelector('#sidebar').classList.toggle('open');
      });
    }
  }

  // Initialize Typed.js
  initializeTypedJS() {
    const typedElement = document.querySelector('.field h2');
    if (typedElement && typeof Typed !== 'undefined') {
      const options = {
        strings: ['Front-End developer', 'Back-End developer', 'Web designer'],
        loop: false,
        typeSpeed: 70,
        backSpeed: 10
      };
      new Typed('.field h2', options);
    }
  }

  // Initialize work section (filters and modal)
  initializeWorkSection() {
    // Initialize Shuffle for work items
    const workItemsContainer = document.querySelector('#my_work .work-items');
    if (workItemsContainer && typeof Shuffle !== 'undefined') {
      const shuffleInstance = new Shuffle(workItemsContainer, {
        itemSelector: '.item'
      });

      // Initialize filter buttons
      const filterButtons = document.querySelectorAll('#my_work .filters button');
      filterButtons.forEach((item) => {
        item.addEventListener('click', function(event) {
          const clickedButton = event.currentTarget;
          const clickedButtonGroup = clickedButton.getAttribute('data-group');
          const activeButton = document.querySelector('#my_work .filters button.active');

          if (activeButton) activeButton.classList.remove('active');
          clickedButton.classList.add("active");

          shuffleInstance.filter(clickedButtonGroup);
        });
      });
    }

    // Initialize work modal
    const workModalElement = document.getElementById('workModal');
    if (workModalElement && typeof bootstrap !== 'undefined') {
      const workModal = new bootstrap.Modal(workModalElement);
      
      // Add click event listeners to work items
      const workElements = document.querySelectorAll("#my_work .work-items .wrap");
      workElements.forEach((item) => {
        item.addEventListener('click', function () {
          const modalBody = document.querySelector('#workModal .modal-body');
          if (modalBody) {
            const modalImg = modalBody.querySelector('img');
            const modalTitle = modalBody.querySelector('.title');
            const modalDescription = modalBody.querySelector('.description');
            const modalClient = modalBody.querySelector('.client .value');
            const modalCompleted = modalBody.querySelector('.completed .value');
            const modalSkills = modalBody.querySelector('.skills .value');
            const modalProjectLink = modalBody.querySelector('.project-link a');

            if (modalImg) modalImg.setAttribute('src', item.getAttribute('data-image'));
            if (modalTitle) modalTitle.innerText = item.getAttribute('data-title');
            if (modalDescription) modalDescription.innerText = item.getAttribute('data-description');
            if (modalClient) modalClient.innerText = item.getAttribute('data-client');
            if (modalCompleted) modalCompleted.innerText = item.getAttribute('data-completed');
            if (modalSkills) modalSkills.innerText = item.getAttribute('data-skills');
            if (modalProjectLink) modalProjectLink.setAttribute('href', item.getAttribute('data-project-link'));

            workModal.show();
          }
        });
      });

      // Add modal event listeners
      workModalElement.addEventListener('show.bs.modal', function (event) {
        const workSection = document.getElementById('my_work');
        const sidebar = document.getElementById('sidebar');
        if (workSection) workSection.classList.add('blur');
        if (sidebar) sidebar.classList.add('blur');
      });

      workModalElement.addEventListener('hide.bs.modal', function (event) {
        const workSection = document.getElementById('my_work');
        const sidebar = document.getElementById('sidebar');
        if (workSection) workSection.classList.remove('blur');
        if (sidebar) sidebar.classList.remove('blur');
      });
    }
  }

  // Initialize testimonials
  initializeTestimonials() {
    const testimonialImages = document.querySelectorAll('#testimonial .images img');
    testimonialImages.forEach((item, index) => {
      let position = index + 1;
      item.addEventListener('click', function () {
        const activeImage = document.querySelector('#testimonial .images img.active');
        const activeComment = document.querySelector('#testimonial .comments .item.active');
        
        if (activeImage) activeImage.classList.remove('active');
        if (activeComment) activeComment.classList.remove('active');
        
        const targetImage = document.querySelector(`#testimonial .images img:nth-child(${position})`);
        const targetComment = document.querySelector(`#testimonial .comments .item:nth-child(${position})`);
        
        if (targetImage) targetImage.classList.add('active');
        if (targetComment) targetComment.classList.add('active');
      });
    });
  }

  // Initialize contact form
  initializeContactForm() {
    const contactFormItems = document.querySelectorAll('#contact_me .form input, #contact_me .form textarea');
    contactFormItems.forEach((item) => {
      item.addEventListener('focus', function () {
        item.parentElement.classList.add('focus');
      });

      item.addEventListener('blur', function () {
        if (!item.value) {
          item.parentElement.classList.remove('focus');
        }
      });
    });
  }

  // Initialize theme toggle
  initializeThemeToggle() {
    // The toggleMode function is already defined globally in script.js
    // We just need to make sure it's available
    if (typeof toggleMode === 'undefined') {
      window.toggleMode = function() {
        let theme = document.querySelector('html').getAttribute('theme');
        if (theme == "dark") {
          theme = "light";
        } else {
          theme = "dark";
        }
        document.querySelector('html').setAttribute("theme", theme);
      };
    }
  }
}

// Global instance
window.componentLoader = new ComponentLoader();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.componentLoader.init();
}); 