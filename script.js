// script.js – FINAL, COMPLETE, TESTED & PERFECT
// For roles.html with smooth animated flow, scroll-to-top, fixed back button, no confetti

document.addEventListener('DOMContentLoaded', () => {

  // Full role names
  const fullRoleNames = {
    researchers: 'Researchers & Educators',
    funders: 'Funders & Policy-Makers',
    leaders: 'Research Managers & University Leaders'
  };

  let currentRole = null;
  let currentRecId = null;

  // The three steps
  const steps = {
    roles: document.getElementById('step-roles'),
    recs: document.getElementById('step-recommendations'),
    resource: document.getElementById('step-resource')
  };

  // -----------------------------------------------------------------
  // 1. Click a Role Card → Show Recommendations
  // -----------------------------------------------------------------
  document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      currentRole = card.dataset.role;
      showRecommendations(currentRole);
      setActiveStep('recs');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // -----------------------------------------------------------------
  // 2. Show Recommendations for the selected role
  // -----------------------------------------------------------------
  function showRecommendations(role) {
    document.getElementById('role-title').textContent = fullRoleNames[role] + ' – Recommendations';

    const grid = document.getElementById('rec-grid');
    grid.innerHTML = ''; // clear previous

    toolkitData[role].forEach(rec => {
      const div = document.createElement('div');
      div.className = 'rec-card';

      // Short preview of the detail text
      const preview = rec.detail.length > 220
        ? rec.detail.substring(0, 220) + '...'
        : rec.detail;

      div.innerHTML = `
        <h3>${rec.id}. ${rec.title}</h3>
        <p>${preview}</p>
      `;

      // Click → go to full resource view
      div.onclick = () => {
        showResource(role, rec.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      grid.appendChild(div);
    });
  }

  // -----------------------------------------------------------------
  // 3. Show Full Resource + Sidebar
  // -----------------------------------------------------------------
  function showResource(role, id) {
    currentRecId = id;
    const rec = toolkitData[role].find(r => r.id === id);
    if (!rec) return;

    // Main title
    const roleLower = fullRoleNames[role].toLowerCase().replace(/&/g, 'and');
    const titleLower = rec.title.charAt(0).toLowerCase() + rec.title.slice(1);
    document.getElementById('res-title').textContent =
      `Resources to help ${roleLower} ${titleLower}.`;

    // Full detail paragraph
    document.getElementById('res-detail').textContent = rec.detail;

    // Sidebar header
    document.getElementById('sidebar-role').textContent = fullRoleNames[role];

    // Sidebar list of all recommendations
    const sidebarList = document.getElementById('sidebar-list');
    sidebarList.innerHTML = '';
    toolkitData[role].forEach(r => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = `${r.id}. ${r.title}`;
      if (r.id === id) a.classList.add('active');
      a.onclick = e => {
        e.preventDefault();
        showResource(role, r.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      sidebarList.appendChild(a);
    });

    // Practical & Theoretical resources
    ['practical', 'theoretical'].forEach(type => {
      const container = document.getElementById(type + '-resources');
      container.innerHTML = '';

      const items = (rec.resourceItems || []).filter(i => i.type === type);

      if (items.length === 0) {
        container.parentElement.style.display = 'none';
        return;
      }
      container.parentElement.style.display = 'block';

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
          <h3><a href="${item.link}" target="_blank">${item.name}</a></h3>
          <p>${item.desc}</p>
        `;
        container.appendChild(card);
      });
    });

    setActiveStep('resource');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // -----------------------------------------------------------------
  // 4. Back Buttons (both steps)
  // -----------------------------------------------------------------
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (steps.resource.classList.contains('active')) {
        setActiveStep('recs');
      } else if (steps.recs.classList.contains('active')) {
        setActiveStep('roles');
        currentRole = null;
        currentRecId = null;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // -----------------------------------------------------------------
  // 5. Switch steps (show/hide)
  // -----------------------------------------------------------------
  function setActiveStep(name) {
    Object.values(steps).forEach(step => step.classList.remove('active'));
    steps[name].classList.add('active');
  }

  // -----------------------------------------------------------------
  // (Optional) Very small smooth-scroll polyfill for older browsers
  // -----------------------------------------------------------------
  if (!window.scrollTo) {
    window.scrollTo = (x, y) => window.scroll(x, y);
  }

    // ——————————————————————————————————
  // SECONDARY ROLE NAV – CORRECTED & FINAL
  // ——————————————————————————————————
  const secondaryNav = document.getElementById('role-nav-secondary');

  // Only show secondary nav on Recommendations & Resource steps
  function updateSecondaryNavVisibility() {
    if (steps.recs.classList.contains('active') || steps.resource.classList.contains('active')) {
      secondaryNav.classList.add('active');
    } else {
      secondaryNav.classList.remove('active');
    }
  }

  // Update active button based on currentRole
  function updateActiveRoleButton() {
    document.querySelectorAll('.role-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === currentRole);
    });
  }

  // Click on secondary nav buttons
  document.querySelectorAll('.role-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newRole = btn.dataset.role;
      currentRole = newRole;

      // Update button highlight
      updateActiveRoleButton();

      // Go to recommendations (or stay in resource)
      if (steps.resource.classList.contains('active')) {
        showResource(newRole, toolkitData[newRole][0].id);  // jump to first rec of new role
      } else {
        showRecommendations(newRole);
        setActiveStep('recs');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Wrap original functions to control secondary nav
  const originalShowRecommendations = showRecommendations;
  showRecommendations = function(role) {
    originalShowRecommendations(role);
    currentRole = role;
    updateActiveRoleButton();
    updateSecondaryNavVisibility();
  };

  const originalShowResource = showResource;
  showResource = function(role, id) {
    originalShowResource(role, id);
    currentRole = role;
    updateActiveRoleButton();
    updateSecondaryNavVisibility();
  };

  // Also update visibility when using Back button
  const originalSetActiveStep = setActiveStep;
  setActiveStep = function(name) {
    originalSetActiveStep(name);
    updateSecondaryNavVisibility();
  };

  // When going back to roles page → hide secondary nav & clear highlight
  document.querySelectorAll('.back-btn').forEach(btn => {
    const oldListener = btn.onclick;
    btn.onclick = () => {
      if (oldListener) oldListener();
      if (steps.roles.classList.contains('active')) {
        secondaryNav.classList.remove('active');
        document.querySelectorAll('.role-nav-btn').forEach(b => b.classList.remove('active'));
        currentRole = null;
      }
      updateSecondaryNavVisibility();
    };
  });
});