/**
 * JavaScript cho trang Quản trị Admin ChipChip
 */

document.addEventListener("DOMContentLoaded", () => {
  initSidebarToggle();
  initDeleteConfirm();
  initImagePreview();
  initFlashToast();
});

/**
 * Đóng mở Sidebar trên thiết bị di động
 */
function initSidebarToggle() {
  const toggleBtn = document.getElementById("admin-sidebar-toggle");
  const sidebar = document.getElementById("admin-sidebar");
  const backdrop = document.getElementById("admin-sidebar-backdrop");

  if (!toggleBtn || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add("is-open");
    if (backdrop) backdrop.classList.remove("d-none");
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    if (backdrop) backdrop.classList.add("d-none");
  }

  toggleBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }
}

/**
 * ==========================================================================
 * RESTFUL API CLIENT ĐỒNG BỘ CHO TOÀN BỘ PHÂN HỆ ADMIN
 * ==========================================================================
 */
window.adminApi = {
  async get(url) {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Lỗi HTTP ${res.status}`);
    return data;
  },

  async post(url, body) {
    const isFormData = body instanceof FormData;
    const res = await fetch(url, {
      method: "POST",
      headers: isFormData ? { "Accept": "application/json" } : { "Content-Type": "application/json", "Accept": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Lỗi HTTP ${res.status}`);
    return data;
  },

  async put(url, body) {
    const isFormData = body instanceof FormData;
    const res = await fetch(url, {
      method: "PUT",
      headers: isFormData ? { "Accept": "application/json" } : { "Content-Type": "application/json", "Accept": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Lỗi HTTP ${res.status}`);
    return data;
  },

  async patch(url, body) {
    const isFormData = body instanceof FormData;
    const res = await fetch(url, {
      method: "PATCH",
      headers: isFormData ? { "Accept": "application/json" } : { "Content-Type": "application/json", "Accept": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Lỗi HTTP ${res.status}`);
    return data;
  },

  async delete(url) {
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Accept": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Lỗi HTTP ${res.status}`);
    return data;
  },
};

/**
 * Hộp thoại SweetAlert2 xác nhận xóa an toàn - Chuẩn RESTful DELETE không tải lại trang
 */
function initDeleteConfirm() {
  const deleteForms = document.querySelectorAll(".form-xac-nhan-xoa");
  deleteForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const tenMuc = form.getAttribute("data-ten-muc") || "mục này";
      const submitBtn = form.querySelector('button[type="submit"]');
      const row = form.closest("tr");
      const url = form.getAttribute("action") || form.action;

      if (typeof Swal !== "undefined") {
        const result = await Swal.fire({
          title: "Xác nhận xóa?",
          text: `Bạn có chắc chắn muốn xóa "${tenMuc}" không? Thao tác này không thể hoàn tác!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#C98F91",
          cancelButtonColor: "#8D7B6F",
          confirmButtonText: "Đồng ý xóa",
          cancelButtonText: "Hủy bỏ",
        });

        if (!result.isConfirmed) return;
      } else {
        if (!confirm(`Bạn có chắc chắn muốn xóa "${tenMuc}"?`)) return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        // Gửi RESTful DELETE tới API endpoint
        let res;
        try {
          res = await window.adminApi.delete(url);
        } catch (delErr) {
          // Fallback nếu route cần POST
          res = await window.adminApi.post(url, {});
        }

        if (typeof Swal !== "undefined") {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: res.message || `Đã xóa "${tenMuc}" thành công!`,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }

        // Ẩn mượt mà hàng vừa xóa
        if (row) {
          row.style.transition = "all 0.35s ease";
          row.style.opacity = "0";
          row.style.transform = "translateX(25px)";
          setTimeout(() => {
            row.remove();
            // Cập nhật lại số lượng trong badge
            const countBadge = document.querySelector(".realtime-count-badge");
            if (countBadge) {
              const rows = document.querySelectorAll(".table-custom tbody tr:not(.empty-row):not(.realtime-empty-row)");
              countBadge.innerHTML = `<i class="fa-solid fa-filter" style="font-size: 10px; color: #8E9F8E;"></i> Hiển thị <b>${rows.length}</b>`;
            }
          }, 350);
        } else {
          // Nếu xóa từ trang chi tiết hoặc chỉnh sửa, chuyển hướng về trang danh sách
          const redirectUrl = form.getAttribute("data-redirect-url") || window.location.pathname.split("/").slice(0, 3).join("/");
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1200);
        }
      } catch (err) {
        console.error("Lỗi xóa RESTful:", err);
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "error",
            title: "Lỗi xóa dữ liệu!",
            text: err.message || "Không thể xóa mục này do có ràng buộc dữ liệu.",
            confirmButtonColor: "#C98F91",
          });
        } else {
          alert("Lỗi: " + err.message);
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

/**
 * Xem trước ảnh khi người dùng nhập URL ảnh hoặc chọn file
 */
function initImagePreview() {
  const urlInput = document.getElementById("input-hinh-anh");
  const previewImg = document.getElementById("img-preview");

  if (!urlInput || !previewImg) return;

  urlInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val) {
      previewImg.src = val;
    }
  });
}

/**
 * Hiển thị SweetAlert2 Toast cho thông báo hoặc lỗi
 */
function initFlashToast() {
  const urlParams = new URLSearchParams(window.location.search);
  const thongBao = urlParams.get("thongBao");
  const loi = urlParams.get("loi");

  if (typeof Swal === "undefined") return;

  if (thongBao) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: decodeURIComponent(thongBao),
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
    });
    // Làm sạch URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  if (loi) {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title: decodeURIComponent(loi),
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

/**
 * ==========================================================================
 * HỆ THỐNG ĐIỀU KHIỂN POPUP MODAL (CHUẨN BATHBOOM)
 * ==========================================================================
 */

/**
 * Mở modal theo ID
 */
window.openAdminModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add("is-open");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
};

/**
 * Đóng modal theo ID
 */
window.closeAdminModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.classList.remove("active");

  // Kiểm tra xem còn modal nào mở không
  const anyOpen = document.querySelector(".modal-overlay.is-open, .modal-overlay.active");
  if (!anyOpen) {
    document.body.style.overflow = "";
  }
};

/**
 * Bắt sự kiện click ra vùng nền tối để đóng modal
 */
window.handleBackdropClick = function (event, modalId) {
  if (event.target && event.target.id === modalId) {
    window.closeAdminModal(modalId);
  }
};

/**
 * Lắng nghe phím ESC để đóng nhanh bất kỳ modal nào đang mở
 */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const openModals = document.querySelectorAll(".modal-overlay.is-open, .modal-overlay.active");
    openModals.forEach((m) => {
      m.classList.remove("is-open", "active");
    });
    document.body.style.overflow = "";
  }
});

/**
 * Gán sự kiện xem trước ảnh linh hoạt cho từng modal
 */
window.bindModalImagePreview = function (inputId, imgId) {
  const input = document.getElementById(inputId);
  const img = document.getElementById(imgId);
  if (!input || !img) return;

  function update() {
    const val = input.value.trim();
    if (val) {
      img.src = val;
    }
  }

  input.addEventListener("input", update);
  input.addEventListener("change", update);
};

/**
 * ==========================================================================
 * XỬ LÝ SUBMIT FORM MODAL BẰNG RESTFUL API (POST / PUT)
 * ==========================================================================
 */
window.xuLiSubmitModalRestful = async function (formEl, options = {}) {
  const {
    method = "POST",
    url = formEl.action,
    modalId = null,
    onSuccess = null,
  } = options;

  const submitBtn = formEl.querySelector('button[type="submit"]');
  const originalHtml = submitBtn ? submitBtn.innerHTML : "";

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Đang lưu...</span>`;
  }

  try {
    const formData = new FormData(formEl);
    const body = {};

    formData.forEach((value, key) => {
      body[key] = value;
    });

    // Quét tất cả checkbox để gửi boolean chính xác
    formEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      if (cb.name) {
        body[cb.name] = cb.checked;
      }
    });

    let res;
    const httpMethod = method.toUpperCase();
    if (httpMethod === "PUT") {
      res = await window.adminApi.put(url, body);
    } else if (httpMethod === "PATCH") {
      res = await window.adminApi.patch(url, body);
    } else {
      res = await window.adminApi.post(url, body);
    }

    if (modalId) {
      window.closeAdminModal(modalId);
    }

    if (typeof Swal !== "undefined") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: res.message || "Thao tác thành công!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    }

    setTimeout(() => {
      if (typeof onSuccess === "function") {
        onSuccess(res);
      } else {
        window.location.reload();
      }
    }, 1000);
  } catch (err) {
    console.error("Lỗi submit modal RESTful:", err);
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "error",
        title: "Không thể lưu!",
        text: err.message || "Đã xảy ra lỗi khi gửi yêu cầu lên máy chủ.",
        confirmButtonColor: "#C98F91",
      });
    } else {
      alert("Lỗi: " + err.message);
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
  }
};

/**
 * ==========================================================================
 * CÔNG TẮC BẬT/TẮT TRẠNG THÁI RESTFUL API (AJAX PATCH TỨC THÌ)
 * ==========================================================================
 */
window.toggleTrangThaiApi = async function (checkbox, url, activeText, inactiveText, activeVal, inactiveVal) {
  const isChecked = checkbox.checked;
  const newVal = isChecked ? activeVal : inactiveVal;
  const switchBox = checkbox.closest(".switch, .bb-switch") || checkbox.parentElement;
  const cellEl = checkbox.closest("td");
  const labelEl = (cellEl ? cellEl.querySelector(".switch-status-label, .bb-switch-label") : null) || checkbox.parentElement.querySelector(".bb-switch-label");
  const rowEl = checkbox.closest("tr");

  // Vô hiệu hóa tạm thời để tránh bấm liên tục khi đang gửi request
  checkbox.disabled = true;
  if (switchBox) switchBox.classList.add("is-disabled");

  try {
    let res;
    // Thử gọi chuẩn RESTful PATCH trước, fallback POST
    try {
      res = await window.adminApi.patch(url, { trangThai: newVal });
    } catch (e1) {
      res = await window.adminApi.post(url, { trangThai: newVal, isAjax: true });
    }

    // Cập nhật nhãn chữ
    if (labelEl) {
      labelEl.textContent = isChecked ? activeText : inactiveText;
      labelEl.style.color = isChecked ? "#2e7d32" : "#888888";
    }

    // Cập nhật giao diện hàng
    if (rowEl) {
      if (!isChecked) {
        rowEl.classList.add("row-disabled", "is-disabled");
      } else {
        rowEl.classList.remove("row-disabled", "is-disabled");
      }
    }

    // Hiển thị toast thành công
    if (typeof Swal !== "undefined") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: isChecked ? `Đã kích hoạt: ${activeText}` : `Đã tạm ẩn: ${inactiveText}`,
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
      });
    }
  } catch (err) {
    console.error("Lỗi toggle API:", err);
    // Hoàn tác checkbox
    checkbox.checked = !isChecked;
    if (typeof Swal !== "undefined") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message || "Lỗi khi cập nhật trạng thái!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  } finally {
    checkbox.disabled = false;
    if (switchBox) switchBox.classList.remove("is-disabled");
  }
};

/**
 * ==========================================================================
 * CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG TỨC THÌ (RESTFUL AJAX PATCH API)
 * ==========================================================================
 */
window.capNhatTrangThaiDonHangApi = async function (selectEl, donId) {
  const newVal = selectEl.value;
  const rowEl = selectEl.closest("tr");
  const oldVal = selectEl.getAttribute("data-current-val") || selectEl.value;

  selectEl.disabled = true;

  try {
    let res;
    try {
      res = await window.adminApi.patch(`/admin/api/don-hang/${donId}/trang-thai`, { trangThaiDonHang: newVal });
    } catch (e1) {
      res = await window.adminApi.post(`/admin/don-hang/cap-nhat-trang-thai/${donId}`, { trangThaiDonHang: newVal, isAjax: true });
    }

    selectEl.setAttribute("data-current-val", newVal);
    if (rowEl) {
      rowEl.setAttribute("data-trangthaidh", newVal);
      if (newVal === "da-huy") {
        rowEl.classList.add("row-disabled", "is-disabled");
      } else {
        rowEl.classList.remove("row-disabled", "is-disabled");
      }
    }

    if (typeof Swal !== "undefined") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Đã cập nhật trạng thái đơn hàng!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái đơn:", err);
    if (oldVal) selectEl.value = oldVal;
    if (typeof Swal !== "undefined") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message || "Lỗi cập nhật đơn hàng!",
        showConfirmButton: false,
        timer: 3000,
      });
    }
  } finally {
    selectEl.disabled = false;
  }
};

/**
 * ==========================================================================
 * BỘ LỌC TỰ ĐỘNG REALTIME CHO TOÀN BỘ BẢNG QUẢN TRỊ (KHÔNG CẦN BẤM NÚT LỌC)
 * ==========================================================================
 */
window.initRealtimeTableFilter = function ({
  tableSelector = ".table-custom",
  searchInputId = "realtime-search-input",
  clearBtnId = "realtime-search-clear",
  selectIds = [],
  countBadgeId = "realtime-count-badge",
}) {
  const table = document.querySelector(tableSelector);
  const searchInput = document.getElementById(searchInputId);
  const clearBtn = document.getElementById(clearBtnId);
  const countBadge = document.getElementById(countBadgeId);
  const selects = selectIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tbody tr")).filter((r) => !r.classList.contains("empty-row"));
  const totalRows = rows.length;

  function locDuLieu() {
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

    // Hiển thị / ẩn nút xóa từ khóa
    if (clearBtn) {
      clearBtn.style.display = keyword ? "inline-block" : "none";
    }

    // Lấy giá trị của từng select
    const selectValues = selects.map((sel) => ({
      filterKey: sel.getAttribute("data-filter-key") || "",
      val: sel.value,
    }));

    let visibleCount = 0;

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      let matchKeyword = !keyword || text.includes(keyword);

      let matchSelects = true;
      for (const s of selectValues) {
        if (s.val && s.val !== "tat-ca") {
          const rowDataVal = row.getAttribute(`data-${s.filterKey}`);
          if (rowDataVal) {
            if (rowDataVal !== s.val) {
              matchSelects = false;
              break;
            }
          } else {
            // Kiểm tra trong nội dung text của hàng
            if (!text.includes(s.val.toLowerCase())) {
              matchSelects = false;
              break;
            }
          }
        }
      }

      const show = matchKeyword && matchSelects;
      row.style.display = show ? "" : "none";
      if (show) visibleCount++;
    });

    // Cập nhật số lượng
    if (countBadge) {
      countBadge.innerHTML = `<i class="fa-solid fa-filter" style="font-size: 10px; color: #8E9F8E;"></i> Hiển thị <b>${visibleCount}</b> / ${totalRows}`;
    }

    // Xử lý thông báo không tìm thấy
    let emptyRow = table.querySelector(".realtime-empty-row");
    if (visibleCount === 0) {
      if (!emptyRow) {
        emptyRow = document.createElement("tr");
        emptyRow.className = "realtime-empty-row";
        const cols = table.querySelectorAll("thead th").length || 8;
        emptyRow.innerHTML = `
          <td colspan="${cols}" style="text-align: center; padding: 40px 20px; color: #888;">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 28px; color: #DCD4CC; margin-bottom: 8px; display: block;"></i>
            <strong style="color: #554845;">Không tìm thấy mục nào phù hợp với bộ lọc hiện tại.</strong>
            <p class="small text-muted mb-0">Thử xóa từ khóa hoặc chọn "Tất cả" để xem lại dữ liệu.</p>
          </td>
        `;
        table.querySelector("tbody").appendChild(emptyRow);
      } else {
        emptyRow.style.display = "";
      }
    } else {
      if (emptyRow) {
        emptyRow.style.display = "none";
      }
    }
  }

  // Lắng nghe sự kiện gõ tìm kiếm realtime
  if (searchInput) {
    searchInput.addEventListener("input", locDuLieu);
  }

  // Nút xóa nhanh từ khóa
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      locDuLieu();
      searchInput.focus();
    });
  }

  // Lắng nghe sự kiện đổi select realtime
  selects.forEach((sel) => {
    sel.addEventListener("change", locDuLieu);
  });

  // Chạy lần đầu
  locDuLieu();
};

/**
 * ==========================================================================
 * HÀM TẠO SLUG TIẾNG VIỆT CHUẨN CLIENT-SIDE (TỰ ĐỘNG ĐỒNG BỘ TỪ TÊN)
 * ==========================================================================
 */
window.taoSlug = function (chuoi) {
  if (!chuoi) return "";
  let str = chuoi.toString().toLowerCase().trim();
  str = str
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a")
    .replace(/[éèẻẽẹêếềểễệ]/g, "e")
    .replace(/[íìỉĩị]/g, "i")
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[úùủũụưứừửữự]/g, "u")
    .replace(/[ýỳỷỹỵ]/g, "y")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return str;
};

// Tự động kết nối tất cả các trường slug với nguồn tên tương ứng
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-slug-source]").forEach(function (slugTarget) {
    const sourceSelector = slugTarget.getAttribute("data-slug-source");
    const sourceEl = document.querySelector(sourceSelector);
    if (sourceEl) {
      sourceEl.addEventListener("input", function () {
        slugTarget.value = window.taoSlug(this.value);
      });
    }
  });
});


