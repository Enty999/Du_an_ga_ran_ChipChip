/**
 * Layout JavaScript - Gà Rán ChipChip
 * Quản lý Header Mobile Drawer & Đánh dấu Active Navigation
 */

// Link cũ /#ve-chipchip (trước kia cuộn xuống section giới thiệu ở trang chủ) nay chuyển sang trang /gioi-thieu  
if (
  (window.location.pathname === "/" || window.location.pathname === "") &&
  window.location.hash === "#ve-chipchip"
) {
  window.location.replace("/gioi-thieu");
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileDrawer();
  initUserMenu();
  initActiveNav();
  initMenuFilters();
  initCart();
});

/**
 * Khởi tạo logic mở/đóng Mobile Drawer (dưới 1280px)
 */
function initMobileDrawer() {
  const toggleBtn = document.getElementById("site-header-toggle");
  const drawer = document.getElementById("site-header-drawer");
  const backdrop = document.getElementById("site-header-backdrop");
  const closeBtn = document.getElementById("site-header-drawer-close");

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    if (backdrop) backdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    if (backdrop) backdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDrawer);
  }

  // Đóng khi bấm link bên trong drawer
  const drawerLinks = drawer.querySelectorAll("a");
  drawerLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeDrawer();
    });
  });

  // Đóng khi nhấn phím Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  // Tự động đóng drawer nếu resize màn hình >= 1280px
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1280 && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });
}

/**
 * Bảng menu tài khoản khi đã đăng nhập: bấm tên để mở/đóng,
 * tự đóng khi bấm ra ngoài hoặc nhấn Escape
 */
function initUserMenu() {
  const wrapper = document.getElementById("site-header-user");
  const btn = document.getElementById("site-header-user-btn");
  const menu = document.getElementById("site-header-user-menu");

  if (!wrapper || !btn || !menu) return;

  function openMenu() {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", () => {
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  // Bấm ra ngoài khu vực tài khoản thì đóng
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !wrapper.contains(e.target)) {
      closeMenu();
    }
  });

  // Nhấn Escape thì đóng và trả focus về nút tên
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
      btn.focus();
    }
  });
}

/**
 * Đánh dấu link điều hướng đang xem (Active Navigation)
 */
function initActiveNav() {
  const navLinks = document.querySelectorAll(
    ".site-header__link, .site-header__drawer-link",
  );
  if (!navLinks.length) return;

  function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;

      let isActive = false;

      // Trang con (ví dụ /auth/dang-nhap)
      if (href !== "/" && !href.startsWith("/#") && !href.startsWith("#")) {
        isActive = currentPath.startsWith(href);
      } else if (currentPath === "/" || currentPath === "") {
        // Đang ở trang chủ
        if (currentHash) {
          isActive = href === "/" + currentHash || href === currentHash;
        } else {
          // Mặc định không có hash là Trang chủ
          isActive =
            href === "/" || href === "/#trang-chu" || href === "#trang-chu";
        }
      }

      if (isActive) {
        link.classList.add("is-active", "active");
      } else {
        link.classList.remove("is-active", "active");
      }
    });
  }

  // Cập nhật khi tải trang và khi hash thay đổi
  updateActiveLink();
  window.addEventListener("hashchange", updateActiveLink);

  // Cuộn trang mượt mà và cập nhật active theo section trên trang chủ
  if (window.location.pathname === "/" || window.location.pathname === "") {
    const sections = document.querySelectorAll("section[id]");
    if (sections.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              const id = entry.target.getAttribute("id");
              const targetHash = id === "trang-chu" ? "" : `#${id}`;

              navLinks.forEach((link) => {
                const href = link.getAttribute("href");
                let match = false;
                if (!targetHash && (href === "/" || href === "/#trang-chu")) {
                  match = true;
                } else if (
                  targetHash &&
                  (href === `/${targetHash}` || href === targetHash)
                ) {
                  match = true;
                }

                if (match) {
                  link.classList.add("is-active", "active");
                } else {
                  link.classList.remove("is-active", "active");
                }
              });
            }
          });
        },
        {
          rootMargin: "-80px 0px -50% 0px",
          threshold: [0.25, 0.5],
        },
      );

      sections.forEach((section) => observer.observe(section));
    }
  }
}
// Khi trang web tải xong
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("dangNhap") === "thanhcong") {
    // Thông báo Toast nhỏ gọn, trượt từ góc phải màn hình
    Swal.fire({
      toast: true,
      width: "300px",
      position: "top-end",
      icon: "success",
      title:
        '<span style="font-size: 12px; font-weight: 600;">Đăng nhập thành công!</span>',
      html: '<span style="font-size: 10px;">Chào mừng bạn quay lại với ChipChip 🍗</span>',
      showCloseButton: true,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    // Xóa tham số trên thanh URL để F5 không bị lặp lại
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});



/**
 * Tương tác chuyển tab bộ lọc trong Thực đơn
 */
function initMenuFilters() {
  const filterButtons = document.querySelectorAll(".menu__filter-btn");
  const cards = document.querySelectorAll(".menu__card");
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => {
        b.classList.remove("menu__filter-btn--active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("menu__filter-btn--active");
      btn.setAttribute("aria-selected", "true");

      const category = btn.getAttribute("data-category");
      if (!category || category === "tat-ca") {
        cards.forEach((card) => (card.style.display = ""));
      } else {
        cards.forEach((card) => {
          const cardCat = card.getAttribute("data-category");
          if (!cardCat || cardCat === category) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      }
    });
  });
}
// ==========================================
// QUẢN LÝ GIỎ HÀNG TOÀN CỤC (CART DRAWER)
// ==========================================

/**
 * Khởi tạo sự kiện Giỏ hàng & Cập nhật Badge khi tải trang
 */
function initCart() {
  capNhatBadgeGioHang();

  const btnOpenCart = document.getElementById("btn-open-cart");
  if (btnOpenCart) {
    btnOpenCart.addEventListener("click", () => {
      hienThiGioHangDrawer();
      const cartEl = document.getElementById("cartOffcanvas");
      if (cartEl && window.bootstrap) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(cartEl);
        bsOffcanvas.show();
      }
    });
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-quick-add, .menu__btn-add");
    if (!btn) return;
    e.preventDefault();
    const mon = {
      id: btn.dataset.id,
      tenSanPham: btn.dataset.name,
      slug: btn.dataset.slug,
      hinhAnh: btn.dataset.image,
      gia: Number(btn.dataset.price) || 0,
      khauPhan: btn.dataset.portion || "Tiêu chuẩn",
      doCay: "Tiêu chuẩn",
      ghiChu: "",
      soLuong: 1
    };
    themNhanhVaoGioHang(mon);
  });
}

/**
 * Cập nhật số lượng trên icon Giỏ hàng ở Header
 */
function capNhatBadgeGioHang() {
  try {
    const cart = JSON.parse(localStorage.getItem("chipchip_cart")) || [];
    const tongSoLuong = cart.reduce((tong, item) => tong + (Number(item.soLuong) || 0), 0);
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.textContent = tongSoLuong;
    }
  } catch (err) {
    console.error("Lỗi đọc giỏ hàng từ localStorage:", err);
  }
}
window.capNhatBadgeGioHang = capNhatBadgeGioHang;

/**
 * Render dữ liệu giỏ hàng vào Offcanvas Drawer
 */
function hienThiGioHangDrawer() {
  const cart = JSON.parse(localStorage.getItem("chipchip_cart")) || [];
  const emptyView = document.getElementById("cart-empty-view");
  const itemsView = document.getElementById("cart-items-view");
  const itemsList = document.getElementById("cart-items-list");
  const footerView = document.getElementById("cart-footer-view");
  const drawerCount = document.getElementById("drawer-cart-count");
  const totalPriceEl = document.getElementById("cart-total-price");

  if (!itemsList) return;

  const tongSoLuong = cart.reduce((sum, item) => sum + (Number(item.soLuong) || 0), 0);
  if (drawerCount) drawerCount.textContent = `${tongSoLuong} món`;

  // Giỏ hàng trống
  if (cart.length === 0) {
    if (emptyView) emptyView.style.display = "block";
    if (itemsView) itemsView.style.display = "none";
    if (footerView) footerView.style.display = "none";
    itemsList.innerHTML = "";
    return;
  }

  // Có món trong giỏ
  if (emptyView) emptyView.style.display = "none";
  if (itemsView) itemsView.style.display = "block";
  if (footerView) footerView.style.display = "block";

  let tongTien = 0;
  itemsList.innerHTML = "";

  cart.forEach((item, index) => {
    const gia = Number(item.gia) || 0;
    const soLuong = Number(item.soLuong) || 1;
    const thanhTien = gia * soLuong;
    tongTien += thanhTien;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item p-3 rounded-4 bg-light d-flex gap-3 align-items-center position-relative shadow-sm";
    itemEl.innerHTML = `
      <img src="${item.hinhAnh}" alt="${item.tenSanPham}" class="rounded-3 object-fit-cover flex-shrink-0" style="width: 68px; height: 68px;">
      <div class="flex-grow-1 min-w-0 pe-3">
        <h6 class="fw-bold text-dark mb-1 text-truncate">${item.tenSanPham}</h6>
        <div class="d-flex flex-wrap gap-1 mb-1">
          <span class="badge bg-white text-secondary border small">${item.khauPhan || 'Tiêu chuẩn'}</span>
          ${item.doCay && item.doCay !== 'Tiêu chuẩn' ? `<span class="badge bg-danger-subtle text-danger border border-danger-subtle small">${item.doCay}</span>` : ''}
        </div>
        ${item.ghiChu ? `<p class="text-muted small fst-italic mb-1 text-truncate" title="${item.ghiChu}"><i class="fas fa-pen me-1"></i>${item.ghiChu}</p>` : ''}
        <div class="d-flex justify-content-between align-items-center mt-2">
          <span class="fw-bold text-danger">${thanhTien.toLocaleString('vi-VN')}đ</span>
          <div class="d-flex align-items-center border rounded-pill bg-white px-2 py-1 shadow-sm">
            <button class="btn btn-sm p-0 border-0 text-secondary btn-cart-minus" data-index="${index}" style="width: 22px; height: 22px;">
              <i class="fas fa-minus small"></i>
            </button>
            <span class="px-2 fw-semibold small">${soLuong}</span>
            <button class="btn btn-sm p-0 border-0 text-secondary btn-cart-plus" data-index="${index}" style="width: 22px; height: 22px;">
              <i class="fas fa-plus small"></i>
            </button>
          </div>
        </div>
      </div>
      <button class="btn btn-link text-muted p-0 position-absolute top-0 end-0 m-2 btn-cart-delete" data-index="${index}" title="Xóa món" style="text-decoration: none;">
        <i class="fas fa-times text-secondary"></i>
      </button>
    `;
    itemsList.appendChild(itemEl);
  });

  if (totalPriceEl) totalPriceEl.textContent = tongTien.toLocaleString('vi-VN') + 'đ';

  ganSuKienCartItems();
}

function ganSuKienCartItems() {
  document.querySelectorAll(".btn-cart-plus").forEach(btn => {
    btn.addEventListener("click", (e) => {
      capNhatSoLuongCart(e.currentTarget.dataset.index, 1);
    });
  });

  document.querySelectorAll(".btn-cart-minus").forEach(btn => {
    btn.addEventListener("click", (e) => {
      capNhatSoLuongCart(e.currentTarget.dataset.index, -1);
    });
  });

  document.querySelectorAll(".btn-cart-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      xoaMonCart(e.currentTarget.dataset.index);
    });
  });
}

function capNhatSoLuongCart(index, delta) {
  let cart = JSON.parse(localStorage.getItem("chipchip_cart")) || [];
  if (!cart[index]) return;
  cart[index].soLuong += delta;
  if (cart[index].soLuong <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem("chipchip_cart", JSON.stringify(cart));
  capNhatBadgeGioHang();
  hienThiGioHangDrawer();
}

function xoaMonCart(index) {
  let cart = JSON.parse(localStorage.getItem("chipchip_cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("chipchip_cart", JSON.stringify(cart));
  capNhatBadgeGioHang();
  hienThiGioHangDrawer();
}
/**
 * Thêm nhanh món vào giỏ hàng và tự động mở Drawer
 */
function themNhanhVaoGioHang(mon) {
  let cart = JSON.parse(localStorage.getItem("chipchip_cart")) || [];
  
  const viTriTrung = cart.findIndex(item => 
    item.id === mon.id && 
    item.khauPhan === mon.khauPhan && 
    item.doCay === mon.doCay
  );

  if (viTriTrung > -1) {
    cart[viTriTrung].soLuong += (Number(mon.soLuong) || 1);
  } else {
    cart.push({
      id: mon.id,
      tenSanPham: mon.tenSanPham,
      slug: mon.slug,
      hinhAnh: mon.hinhAnh,
      gia: Number(mon.gia) || 0,
      khauPhan: mon.khauPhan || "Tiêu chuẩn",
      doCay: mon.doCay || "Tiêu chuẩn",
      ghiChu: mon.ghiChu || "",
      soLuong: Number(mon.soLuong) || 1
    });
  }
  localStorage.setItem("chipchip_cart", JSON.stringify(cart));
  capNhatBadgeGioHang();

  // Hiện Toast thông báo nảy lên ở góc màn hình (không tự mở Drawer)
  hienThiToastThanhCong(mon.tenSanPham, mon.khauPhan);
} // <--- Dấu đóng ngoặc nhọn kết thúc hàm themNhanhVaoGioHang

/**
 * Hiển thị Toast thông báo thêm món thành công
 */
function hienThiToastThanhCong(tenMon, khauPhan) {
  const toastMsg = document.getElementById("toast-message");
  if (toastMsg) {
    toastMsg.textContent = khauPhan && khauPhan !== "Tiêu chuẩn"
      ? `Đã thêm 1x ${tenMon} (${khauPhan})`
      : `Đã thêm 1x ${tenMon}`;
  }

  const toastEl = document.getElementById("cart-toast");
  if (toastEl && window.bootstrap) {
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
    toast.show();
  }
}

// ==========================================
// XUẤT CÁC HÀM TOÀN CỤC
// ==========================================
window.capNhatBadgeGioHang = capNhatBadgeGioHang;
window.hienThiGioHangDrawer = hienThiGioHangDrawer;
window.themNhanhVaoGioHang = themNhanhVaoGioHang;
window.hienThiToastThanhCong = hienThiToastThanhCong;