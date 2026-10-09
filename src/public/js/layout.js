/**
 * Layout JavaScript - Gà Rán ChipChip
 * Quản lý Header Mobile Drawer & Đánh dấu Active Navigation
 */

// Link cũ /#ve-chipchip (trước kia cuộn xuống section giới thiệu ở trang chủ) nay chuyển sang trang /gioi-thieu
if ((window.location.pathname === '/' || window.location.pathname === '') && window.location.hash === '#ve-chipchip') {
  window.location.replace('/gioi-thieu');
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initUserMenu();
  initActiveNav();
  initMenuFilters();
});

/**
 * Khởi tạo logic mở/đóng Mobile Drawer (dưới 1280px)
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('site-header-toggle');
  const drawer = document.getElementById('site-header-drawer');
  const backdrop = document.getElementById('site-header-backdrop');
  const closeBtn = document.getElementById('site-header-drawer-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Đóng khi bấm link bên trong drawer
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Đóng khi nhấn phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // Tự động đóng drawer nếu resize màn hình >= 1280px
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1280 && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * Bảng menu tài khoản khi đã đăng nhập: bấm tên để mở/đóng,
 * tự đóng khi bấm ra ngoài hoặc nhấn Escape
 */
function initUserMenu() {
  const wrapper = document.getElementById('site-header-user');
  const btn = document.getElementById('site-header-user-btn');
  const menu = document.getElementById('site-header-user-menu');

  if (!wrapper || !btn || !menu) return;

  function openMenu() {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  // Bấm ra ngoài khu vực tài khoản thì đóng
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !wrapper.contains(e.target)) {
      closeMenu();
    }
  });

  // Nhấn Escape thì đóng và trả focus về nút tên
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      closeMenu();
      btn.focus();
    }
  });
}

/**
 * Đánh dấu link điều hướng đang xem (Active Navigation)
 */
function initActiveNav() {
  const navLinks = document.querySelectorAll('.site-header__link, .site-header__drawer-link');
  if (!navLinks.length) return;

  function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      let isActive = false;

      // Trang con (ví dụ /auth/dang-nhap)
      if (href !== '/' && !href.startsWith('/#') && !href.startsWith('#')) {
        isActive = currentPath.startsWith(href);
      } else if (currentPath === '/' || currentPath === '') {
        // Đang ở trang chủ
        if (currentHash) {
          isActive = href === '/' + currentHash || href === currentHash;
        } else {
          // Mặc định không có hash là Trang chủ
          isActive = href === '/' || href === '/#trang-chu' || href === '#trang-chu';
        }
      }

      if (isActive) {
        link.classList.add('is-active', 'active');
      } else {
        link.classList.remove('is-active', 'active');
      }
    });
  }

  // Cập nhật khi tải trang và khi hash thay đổi
  updateActiveLink();
  window.addEventListener('hashchange', updateActiveLink);

  // Cuộn trang mượt mà và cập nhật active theo section trên trang chủ
  if (window.location.pathname === '/' || window.location.pathname === '') {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              const id = entry.target.getAttribute('id');
              const targetHash = id === 'trang-chu' ? '' : `#${id}`;

              navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                let match = false;
                if (!targetHash && (href === '/' || href === '/#trang-chu')) {
                  match = true;
                } else if (targetHash && (href === `/${targetHash}` || href === targetHash)) {
                  match = true;
                }

                if (match) {
                  link.classList.add('is-active', 'active');
                } else {
                  link.classList.remove('is-active', 'active');
                }
              });
            }
          });
        },
        {
          rootMargin: '-80px 0px -50% 0px',
          threshold: [0.25, 0.5],
        }
      );

      sections.forEach((section) => observer.observe(section));
    }
  }
}

/**
 * Tương tác chuyển tab bộ lọc trong Thực đơn
 */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll('.menu__filter-btn');
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('menu__filter-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('menu__filter-btn--active');
      btn.setAttribute('aria-selected', 'true');
    });
  });
}
