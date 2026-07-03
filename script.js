document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo các icon từ Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Các thành phần DOM chính
    const body = document.body;
    const themeToggleBtn = document.getElementById('theme-toggle');
    const fullscreenToggleBtn = document.getElementById('fullscreen-toggle');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const pdfIframe = document.getElementById('pdf-iframe');
    const loader = document.getElementById('loader');
    const viewerContainer = document.getElementById('viewer-container');

    // 1. Quản lý Dark/Light Theme
    const getSavedTheme = () => {
        return localStorage.getItem('docviewer-theme');
    };

    const saveTheme = (theme) => {
        localStorage.setItem('docviewer-theme', theme);
    };

    const setTheme = (theme) => {
        if (theme === 'light') {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        }
    };

    // Khởi tạo theme ban đầu
    const initialTheme = getSavedTheme() || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const isCurrentDark = body.classList.contains('dark-mode');
        const nextTheme = isCurrentDark ? 'light' : 'dark';
        setTheme(nextTheme);
        saveTheme(nextTheme);
    });

    // 2. Ẩn/Hiện Sidebar (Thanh thông tin)
    sidebarToggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
            // Trên mobile, toggle class 'active'
            sidebar.classList.toggle('active');
        } else {
            // Trên desktop, toggle class 'collapsed'
            sidebar.classList.toggle('collapsed');
        }
    });

    // Tự động điều chỉnh trạng thái sidebar khi thay đổi kích thước màn hình
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            sidebar.classList.remove('active');
        }
    });

    // 3. Xem Toàn Màn Hình (Fullscreen)
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            viewerContainer.requestFullscreen()
                .then(() => {
                    updateFullscreenIcon(true);
                })
                .catch(err => {
                    console.error(`Lỗi khi vào chế độ toàn màn hình: ${err.message}`);
                });
        } else {
            document.exitFullscreen()
                .then(() => {
                    updateFullscreenIcon(false);
                });
        }
    };

    const updateFullscreenIcon = (isFullscreen) => {
        const iconContainer = fullscreenToggleBtn.querySelector('i') || fullscreenToggleBtn;
        if (isFullscreen) {
            fullscreenToggleBtn.setAttribute('title', 'Thoát toàn màn hình');
            iconContainer.setAttribute('data-lucide', 'minimize-2');
        } else {
            fullscreenToggleBtn.setAttribute('title', 'Xem toàn màn hình');
            iconContainer.setAttribute('data-lucide', 'maximize-2');
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    fullscreenToggleBtn.addEventListener('click', toggleFullscreen);

    // Lắng nghe sự kiện thay đổi fullscreen (ví dụ người dùng nhấn ESC)
    document.addEventListener('fullscreenchange', () => {
        updateFullscreenIcon(!!document.fullscreenElement);
    });

    // 4. Trạng thái tải của Iframe PDF
    const hideLoader = () => {
        loader.classList.add('hidden');
        pdfIframe.classList.add('loaded');
    };

    // Khi iframe tải xong
    pdfIframe.addEventListener('load', () => {
        hideLoader();
    });

    // Phòng trường hợp sự kiện load không kích hoạt (do bảo mật hoặc lỗi cache trình duyệt),
    // chúng ta sẽ ẩn loader sau tối đa 4 giây nếu file PDF đã bắt đầu hiển thị
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            hideLoader();
        }
    }, 4000);
});
