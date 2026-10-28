/* =========================================================
   Hội thảo khoa học 2026 · Đại học Minh An
   Toàn bộ dữ liệu đăng ký chỉ lưu trong localStorage của trình duyệt.
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'minhan-hoithao-2026:registrations';
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }

  /* ---------- Dữ liệu tĩnh ---------- */
  var LABELS = {
    type: { 'giang-vien': 'Giảng viên', 'nha-nghien-cuu': 'Nhà nghiên cứu', 'doanh-nghiep': 'Doanh nghiệp', 'sinh-vien': 'Sinh viên' },
    mode: { 'truc-tiep': 'Trực tiếp', 'truc-tuyen': 'Trực tuyến' },
    topics: { 'chuyen-doi-so': 'Chuyển đổi số', 'cong-nghe-xanh': 'Công nghệ xanh', 'doi-moi-sang-tao': 'Đổi mới sáng tạo' }
  };

  var SESSIONS = {
    s3: { time: '09:00 – 10:00', title: 'Chuyển đổi số trong giáo dục', owner: 'Nguyễn Minh Anh' },
    s5: { time: '10:15 – 11:30', title: 'AI và dữ liệu bền vững', owner: 'Trần Hoàng Nam' },
    s7: { time: '13:30 – 15:00', title: 'Công nghệ xanh và kinh tế tuần hoàn', owner: 'Lê Thu Hà' },
    s8: { time: '15:00 – 17:00', title: 'Đổi mới sáng tạo, thảo luận và bế mạc', owner: 'Phạm Quốc Bảo · Ban tổ chức' }
  };

  var SPEAKERS = {
    'minh-anh': {
      name: 'Nguyễn Minh Anh', role: 'Giảng viên', org: 'Đại học Minh An',
      img: 'assets/img/speaker-1.webp', session: 's3',
      bio: [
        'Giảng viên phụ trách các học phần về công nghệ giáo dục, tập trung nghiên cứu mô hình lớp học số và quản trị đại học dựa trên dữ liệu.',
        'Tại hội thảo, diễn giả chia sẻ kinh nghiệm triển khai nền tảng học tập trực tuyến và những bài học khi chuyển đổi số trong nhà trường.'
      ]
    },
    'hoang-nam': {
      name: 'Trần Hoàng Nam', role: 'Chuyên gia công nghệ', org: 'Viện Nghiên cứu Số',
      img: 'assets/img/speaker-2.webp', session: 's5',
      bio: [
        'Chuyên gia về trí tuệ nhân tạo và hạ tầng dữ liệu, tham gia tư vấn nhiều dự án chuyển đổi số cho khối giáo dục và doanh nghiệp.',
        'Phiên trình bày giới thiệu cách khai thác AI và dữ liệu có trách nhiệm, tiết kiệm năng lượng và hướng tới phát triển bền vững.'
      ]
    },
    'thu-ha': {
      name: 'Lê Thu Hà', role: 'Nhà nghiên cứu', org: 'Trung tâm Công nghệ Xanh',
      img: 'assets/img/speaker-3.webp', session: 's7',
      bio: [
        'Nhà nghiên cứu trong lĩnh vực vật liệu tái chế và năng lượng sạch, theo đuổi các giải pháp công nghệ thân thiện với môi trường.',
        'Diễn giả phân tích các mô hình kinh tế tuần hoàn và cơ hội ứng dụng công nghệ xanh trong cộng đồng.'
      ]
    },
    'quoc-bao': {
      name: 'Phạm Quốc Bảo', role: 'Giảng viên', org: 'Khoa Kinh tế và Quản trị',
      img: 'assets/img/speaker-4.webp', session: 's8',
      bio: [
        'Giảng viên nghiên cứu về quản trị đổi mới sáng tạo và hệ sinh thái khởi nghiệp trong trường đại học.',
        'Diễn giả điều phối phiên thảo luận cuối ngày, kết nối ý tưởng từ các phiên trước thành những hướng hợp tác cụ thể.'
      ]
    }
  };

  var TOPICS = {
    'chuyen-doi-so': {
      title: 'Chuyển đổi số', img: 'assets/img/topic-digital.webp',
      summary: 'Ứng dụng công nghệ số trong giáo dục, quản trị và phát triển bền vững.',
      body: 'Chủ đề tập trung vào cách trường đại học, viện nghiên cứu và doanh nghiệp ứng dụng nền tảng số, dữ liệu và trí tuệ nhân tạo để nâng cao chất lượng đào tạo, quản trị và ra quyết định.',
      sessions: ['s3', 's5']
    },
    'cong-nghe-xanh': {
      title: 'Công nghệ xanh', img: 'assets/img/topic-green.webp',
      summary: 'Giải pháp công nghệ hướng tới môi trường và cộng đồng bền vững.',
      body: 'Chủ đề giới thiệu các giải pháp năng lượng sạch, vật liệu tái chế và mô hình kinh tế tuần hoàn giúp giảm phát thải và bảo vệ môi trường.',
      sessions: ['s7']
    },
    'doi-moi-sang-tao': {
      title: 'Đổi mới sáng tạo', img: 'assets/img/topic-innovation.webp',
      summary: 'Thúc đẩy ý tưởng, nghiên cứu và hợp tác vì những giá trị lâu dài.',
      body: 'Chủ đề kết nối nhà khoa học, giảng viên, sinh viên và doanh nghiệp để biến ý tưởng nghiên cứu thành sản phẩm, dịch vụ có giá trị cho xã hội.',
      sessions: ['s8']
    }
  };

  /* ---------- Tiện ích ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'class') el.className = value;
        else if (key === 'text') el.textContent = value;
        else el.setAttribute(key, value === true ? '' : String(value));
      });
    }
    for (var i = 2; i < arguments.length; i++) appendChild(el, arguments[i]);
    return el;
  }
  function appendChild(parent, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { appendChild(parent, c); }); return; }
    parent.appendChild(child.nodeType ? child : document.createTextNode(String(child)));
  }
  function icon(name) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#i-' + name);
    svg.appendChild(use);
    return svg;
  }
  function fold(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }
  function collapseSpaces(text) { return String(text || '').replace(/\s+/g, ' ').trim(); }
  function makeId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function scrollToEl(el, block) {
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: block || 'start' });
  }
  function focusNoScroll(el) {
    if (!el || typeof el.focus !== 'function') return;
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }

  /* ---------- Lưu trữ ---------- */
  var storageAvailable = (function () {
    try {
      var k = '__minhan_test__';
      window.localStorage.setItem(k, k);
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();

  function sanitizeRecord(raw) {
    if (!raw || typeof raw !== 'object') return null;
    function str(v, max) { return typeof v === 'string' ? collapseSpaces(v).slice(0, max) : ''; }
    var topics = Array.isArray(raw.topics) ? raw.topics.filter(function (t, i, arr) {
      return typeof t === 'string' && has(LABELS.topics, t) && arr.indexOf(t) === i;
    }) : [];
    var rec = {
      id: str(raw.id, 64) || makeId(),
      name: str(raw.name, 80),
      email: str(raw.email, 120),
      phone: typeof raw.phone === 'string' ? raw.phone.replace(/\D/g, '').slice(0, 10) : '',
      org: str(raw.org, 120),
      type: typeof raw.type === 'string' && has(LABELS.type, raw.type) ? raw.type : '',
      mode: typeof raw.mode === 'string' && has(LABELS.mode, raw.mode) ? raw.mode : 'truc-tiep',
      topics: topics,
      note: typeof raw.note === 'string' ? raw.note.trim().slice(0, 300) : '',
      createdAt: typeof raw.createdAt === 'number' && isFinite(raw.createdAt) ? raw.createdAt : Date.now(),
      updatedAt: typeof raw.updatedAt === 'number' && isFinite(raw.updatedAt) ? raw.updatedAt : 0
    };
    if (!rec.name || !rec.email) return null;
    return rec;
  }

  function loadList() {
    if (!storageAvailable) return [];
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      var seen = {};
      return parsed.map(sanitizeRecord).filter(function (r) {
        if (!r || seen[r.id]) return false;
        seen[r.id] = true;
        return true;
      });
    } catch (e) { return []; }
  }

  var storageWarned = false;
  function persist() {
    if (!storageAvailable) {
      if (!storageWarned) {
        storageWarned = true;
        toast('Trình duyệt đang chặn bộ nhớ cục bộ. Dữ liệu chỉ được giữ đến khi tải lại trang.', 'danger');
      }
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.list));
    } catch (e) {
      toast('Không thể lưu vào trình duyệt (bộ nhớ đầy hoặc bị chặn).', 'danger');
    }
  }

  /* ---------- Trạng thái ---------- */
  var state = {
    list: loadList(),
    editingId: null,
    lastSavedId: null,
    lastAction: 'create',
    flashId: null,
    query: '',
    submitted: false,
    touched: {},
    pendingDeleteId: null,
    resultsShown: false
  };

  /* ---------- Phần tử ---------- */
  var header = $('.site-header');
  var menuToggle = $('.menu-toggle');
  var menuDialog = $('#mobile-menu');
  var infoDialog = $('#info-dialog');
  var infoContent = $('#info-content');
  var confirmDialog = $('#confirm-dialog');
  var toastRegion = $('#toasts');

  var registerSection = $('#dang-ky');
  var registerTitle = $('#register-title');
  var form = $('#reg-form');
  var submitLabel = $('#submit-label');
  var editBanner = $('#edit-banner');
  var editName = $('#edit-name');
  var fields = {
    name: $('#f-name'),
    email: $('#f-email'),
    phone: $('#f-phone'),
    org: $('#f-org'),
    type: $('#f-type'),
    note: $('#f-note'),
    consent: $('#f-consent')
  };
  var modeInputs = $$('input[name="mode"]', form);
  var topicInputs = $$('input[name="topics"]', form);
  var noteCounter = $('#c-note');
  var FIELD_ORDER = ['name', 'email', 'phone', 'org', 'type', 'mode', 'topics', 'note', 'consent'];

  var resultsSection = $('#ket-qua');
  var resultsTitle = $('#results-title');
  var successCard = $('#success-card');
  var tbody = $('#reg-tbody');
  var searchInput = $('#search');
  var listCount = $('#list-count');

  /* =========================================================
     Header: trạng thái cuộn + mục đang xem
     ========================================================= */
  var navLinks = $$('[data-nav]');
  var spyIds = ['gioi-thieu', 'dien-gia', 'chuong-trinh', 'dang-ky', 'ket-qua', 'lien-he'];
  var currentNav = null;

  function headerOffset() { return header ? header.getBoundingClientRect().height : 0; }

  function updateScrollState() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    var probe = headerOffset() + window.innerHeight * 0.3;
    var current = 'gioi-thieu';
    for (var i = 0; i < spyIds.length; i++) {
      var section = document.getElementById(spyIds[i]);
      if (!section || section.hidden) continue;
      if (section.getBoundingClientRect().top <= probe) current = spyIds[i];
    }
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) current = 'lien-he';
    if (current === 'ket-qua') current = 'dang-ky';
    if (current === currentNav) return;
    currentNav = current;
    navLinks.forEach(function (link) {
      var active = link.getAttribute('data-nav') === current;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  var scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
      scrollTicking = false;
      updateScrollState();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* =========================================================
     Hộp thoại (menu, thông tin, xác nhận xóa)
     ========================================================= */
  var returnFocus = new WeakMap();

  function openDialog(dialog, opener) {
    if (!dialog || dialog.open) return;
    returnFocus.set(dialog, opener || document.activeElement);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.documentElement.classList.add('modal-open');
  }

  function closeDialog(dialog, focusTarget) {
    if (!dialog || !dialog.open) return;
    if (focusTarget !== undefined) returnFocus.set(dialog, focusTarget);
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    afterClose(dialog);
  }

  // Dọn dẹp ngay khi đóng (không chờ sự kiện "close" vốn được phát bất đồng bộ).
  function afterClose(dialog) {
    if (dialog.open) return;
    if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('modal-open');
    if (dialog === menuDialog && menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (dialog === confirmDialog) state.pendingDeleteId = null;
    var target = returnFocus.get(dialog);
    returnFocus.delete(dialog);
    if (target && target.isConnected) focusNoScroll(target);
  }

  [menuDialog, infoDialog, confirmDialog].forEach(function (dialog) {
    if (!dialog) return;
    var pressedOnBackdrop = false;
    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('close', function () { afterClose(dialog); });
    dialog.addEventListener('pointerdown', function (e) { pressedOnBackdrop = e.target === dialog; });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog && pressedOnBackdrop) closeDialog(dialog);
      else if (e.target.closest && e.target.closest('[data-close]')) closeDialog(dialog);
      pressedOnBackdrop = false;
    });
  });

  /* ---------- Menu điện thoại ---------- */
  if (menuToggle && menuDialog) {
    menuToggle.addEventListener('click', function () {
      openDialog(menuDialog, menuToggle);
      menuToggle.setAttribute('aria-expanded', 'true');
    });
    $$('[data-menu-link]', menuDialog).forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = (link.getAttribute('href') || '').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        closeDialog(menuDialog, null);
        if (history.pushState) history.pushState(null, '', '#' + id);
        scrollToEl(target);
      });
    });
    // Tự đóng menu nếu màn hình được mở rộng sang bố cục máy tính.
    var desktopQuery = window.matchMedia('(min-width: 961px)');
    var onDesktop = function (e) { if (e.matches) closeDialog(menuDialog); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onDesktop);
    else if (desktopQuery.addListener) desktopQuery.addListener(onDesktop);
  }

  /* ---------- Hộp thông tin ---------- */
  function showInfo(nodes, opener) {
    infoContent.replaceChildren ? infoContent.replaceChildren() : (infoContent.innerHTML = '');
    appendChild(infoContent, nodes);
    infoContent.scrollTop = 0;
    if (infoDialog.open) {
      var card = $('.modal__card', infoDialog);
      if (card) card.scrollTop = 0;
      focusNoScroll($('#info-title', infoDialog));
    } else {
      openDialog(infoDialog, opener);
      focusNoScroll($('#info-title', infoDialog));
    }
  }

  function sessionItem(id) {
    var s = SESSIONS[id];
    if (!s) return null;
    return h('li', { class: 'info-session' },
      h('time', { text: s.time }),
      h('span', null, s.title, h('small', { text: s.owner }))
    );
  }

  function openSpeaker(key, opener, fromList) {
    var sp = SPEAKERS[key];
    if (!sp) return;
    var actions = [
      h('button', { class: 'btn btn--primary', type: 'button', 'data-act': 'show-session', 'data-session': sp.session },
        'Xem trong chương trình', icon('arrow-right')),
      h('a', { class: 'btn btn--outline', href: '#dang-ky', 'data-act': 'go-register' }, 'Đăng ký tham dự')
    ];
    if (fromList) {
      actions.push(h('button', { class: 'btn btn--outline', type: 'button', 'data-act': 'all-speakers' }, 'Tất cả diễn giả'));
    }
    showInfo([
      h('div', { class: 'info-head' },
        h('img', { src: sp.img, alt: 'Chân dung diễn giả ' + sp.name, width: 382, height: 292 }),
        h('div', null,
          h('p', { class: 'eyebrow', text: 'Diễn giả' }),
          h('h2', { class: 'display display--md', id: 'info-title', tabindex: '-1', text: sp.name }),
          h('p', { class: 'info-head__meta', text: sp.role + ' · ' + sp.org })
        )
      ),
      h('div', { class: 'info-body' }, sp.bio.map(function (p) { return h('p', { text: p }); })),
      h('div', { class: 'info-sessions' },
        h('h3', { text: 'Phiên trình bày' }),
        h('ul', { class: 'info-sessions__list' }, sessionItem(sp.session))
      ),
      h('div', { class: 'info-actions' }, actions)
    ], opener);
  }

  function openAllSpeakers(opener) {
    var people = Object.keys(SPEAKERS).map(function (key) {
      var sp = SPEAKERS[key];
      var s = SESSIONS[sp.session];
      return h('li', null,
        h('button', { class: 'person', type: 'button', 'data-act': 'speaker', 'data-speaker': key },
          h('img', { src: sp.img, alt: '', width: 382, height: 292 }),
          h('span', null,
            h('strong', { text: sp.name }),
            h('span', { text: sp.role + ' · ' + sp.org }),
            s ? h('em', { text: s.time + ' · ' + s.title }) : null
          )
        )
      );
    });
    showInfo([
      h('p', { class: 'eyebrow', text: 'Những người kết nối tri thức' }),
      h('h2', { class: 'display display--md', id: 'info-title', tabindex: '-1', text: 'Tất cả diễn giả' }),
      h('p', { class: 'info-head__meta', text: 'Chọn một diễn giả để xem giới thiệu và phiên trình bày.' }),
      h('ul', { class: 'people-grid' }, people)
    ], opener);
  }

  function openTopic(key, opener) {
    var t = TOPICS[key];
    if (!t) return;
    showInfo([
      h('div', { class: 'info-head' },
        h('img', { class: 'is-illustration', src: t.img, alt: '', width: 272, height: 252 }),
        h('div', null,
          h('p', { class: 'eyebrow', text: 'Chủ đề hội thảo' }),
          h('h2', { class: 'display display--md', id: 'info-title', tabindex: '-1', text: t.title }),
          h('p', { class: 'info-head__meta', text: t.summary })
        )
      ),
      h('div', { class: 'info-body' }, h('p', { text: t.body })),
      h('div', { class: 'info-sessions' },
        h('h3', { text: 'Phiên liên quan' }),
        h('ul', { class: 'info-sessions__list' }, t.sessions.map(sessionItem))
      ),
      h('div', { class: 'info-actions' },
        h('button', { class: 'btn btn--primary', type: 'button', 'data-act': 'register-topic', 'data-topic': key },
          'Đăng ký quan tâm chủ đề này', icon('arrow-right')),
        h('button', { class: 'btn btn--outline', type: 'button', 'data-act': 'show-sessions', 'data-sessions': t.sessions.join(',') },
          'Xem chương trình')
      )
    ], opener);
  }

  infoDialog.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!btn) return;
    var act = btn.getAttribute('data-act');
    if (act === 'speaker') {
      openSpeaker(btn.getAttribute('data-speaker'), null, true);
    } else if (act === 'all-speakers') {
      openAllSpeakers();
    } else if (act === 'show-session' || act === 'show-sessions') {
      var ids = (btn.getAttribute('data-session') || btn.getAttribute('data-sessions') || '').split(',');
      closeDialog(infoDialog, null);
      highlightSessions(ids);
    } else if (act === 'go-register') {
      e.preventDefault();
      closeDialog(infoDialog, null);
      goToForm();
    } else if (act === 'register-topic') {
      var topic = btn.getAttribute('data-topic');
      closeDialog(infoDialog, null);
      topicInputs.forEach(function (input) { if (input.value === topic) input.checked = true; });
      revalidate('topics');
      goToForm();
      toast('Đã chọn chủ đề “' + (LABELS.topics[topic] || '') + '” trong biểu mẫu.');
    }
  });

  $$('[data-topic]').forEach(function (card) {
    if (card.closest('dialog')) return;
    card.addEventListener('click', function () { openTopic(card.getAttribute('data-topic'), card); });
  });
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest ? e.target.closest('[data-speaker]') : null;
    // Bỏ qua nút nằm trong hộp thoại (kể cả nút vừa bị thay nội dung và tách khỏi DOM).
    if (trigger && trigger.isConnected && !trigger.closest('dialog')) openSpeaker(trigger.getAttribute('data-speaker'), trigger, false);
  });
  var allSpeakersBtn = $('[data-all-speakers]');
  if (allSpeakersBtn) allSpeakersBtn.addEventListener('click', function () { openAllSpeakers(allSpeakersBtn); });

  var highlightTimer = null;
  function highlightSessions(ids) {
    var rows = ids.map(function (id) { return document.querySelector('.agenda__row[data-session="' + id + '"]'); }).filter(Boolean);
    if (!rows.length) return;
    $$('.agenda__row.is-highlight').forEach(function (r) { r.classList.remove('is-highlight'); });
    scrollToEl(rows[0], 'center');
    rows.forEach(function (row) {
      void row.offsetWidth;
      row.classList.add('is-highlight');
    });
    clearTimeout(highlightTimer);
    highlightTimer = setTimeout(function () {
      rows.forEach(function (row) { row.classList.remove('is-highlight'); });
    }, 4000);
  }

  /* =========================================================
     Thông báo nhanh
     ========================================================= */
  function toast(message, type) {
    if (!toastRegion) return;
    var el = h('div', { class: 'toast' + (type === 'danger' ? ' toast--danger' : '') },
      icon(type === 'danger' ? 'alert' : 'check'),
      h('span', { text: message })
    );
    toastRegion.appendChild(el);
    while (toastRegion.children.length > 3) toastRegion.removeChild(toastRegion.firstChild);
    var remove = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    setTimeout(function () {
      el.classList.add('is-leaving');
      el.addEventListener('animationend', remove, { once: true });
      setTimeout(remove, 500);
    }, 3600);
  }

  /* =========================================================
     Biểu mẫu đăng ký
     ========================================================= */
  var NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;
  var EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

  function isEmail(value) {
    if (!EMAIL_RE.test(value)) return false;
    var local = value.split('@')[0];
    return local.charAt(0) !== '.' && local.charAt(local.length - 1) !== '.' && value.indexOf('..') === -1;
  }

  function isDuplicateEmail(email) {
    var key = email.toLowerCase();
    return state.list.some(function (r) { return r.email.toLowerCase() === key && r.id !== state.editingId; });
  }

  function getValues() {
    var mode = modeInputs.filter(function (i) { return i.checked; })[0];
    return {
      name: collapseSpaces(fields.name.value),
      email: fields.email.value.trim(),
      phone: fields.phone.value.replace(/\D/g, ''),
      org: collapseSpaces(fields.org.value),
      type: fields.type.value,
      mode: mode ? mode.value : '',
      topics: topicInputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; }),
      note: fields.note.value.trim(),
      consent: fields.consent.checked
    };
  }

  var validators = {
    name: function (v) {
      if (!v.name) return 'Vui lòng nhập họ và tên.';
      if (v.name.length < 2) return 'Vui lòng nhập ít nhất 2 ký tự.';
      if (!NAME_RE.test(v.name)) return 'Họ và tên chỉ gồm chữ cái và khoảng trắng.';
      return '';
    },
    email: function (v) {
      if (!v.email) return 'Vui lòng nhập email.';
      if (!isEmail(v.email)) return 'Email không hợp lệ (ví dụ: ban@example.com).';
      if (isDuplicateEmail(v.email)) return 'Email này đã được đăng ký.';
      return '';
    },
    phone: function (v) {
      if (!v.phone) return 'Vui lòng nhập số điện thoại.';
      if (!/^0\d{9}$/.test(v.phone)) return 'Nhập 10 chữ số, bắt đầu bằng 0.';
      return '';
    },
    org: function (v) {
      if (!v.org) return 'Vui lòng nhập đơn vị công tác.';
      if (v.org.length < 2) return 'Vui lòng nhập ít nhất 2 ký tự.';
      return '';
    },
    type: function (v) { return has(LABELS.type, v.type) ? '' : 'Vui lòng chọn đối tượng tham dự.'; },
    mode: function (v) { return has(LABELS.mode, v.mode) ? '' : 'Vui lòng chọn hình thức tham dự.'; },
    topics: function (v) { return v.topics.length ? '' : 'Chọn ít nhất một chủ đề.'; },
    note: function (v) { return v.note.length > 300 ? 'Ghi chú tối đa 300 ký tự.' : ''; },
    consent: function (v) { return v.consent ? '' : 'Bạn cần đồng ý trước khi đăng ký.'; }
  };

  function inputsOf(key) {
    if (key === 'mode') return modeInputs;
    if (key === 'topics') return topicInputs;
    return fields[key] ? [fields[key]] : [];
  }

  function setFieldError(key, message) {
    var wrap = form.querySelector('[data-field="' + key + '"]');
    var err = document.getElementById('e-' + key);
    if (wrap) wrap.classList.toggle('is-invalid', !!message);
    if (err) err.textContent = message;
    inputsOf(key).forEach(function (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    });
  }

  function validateField(key, values) {
    var message = validators[key](values || getValues());
    setFieldError(key, message);
    return message;
  }

  function revalidate(key) {
    if (state.submitted || state.touched[key]) validateField(key);
    updateSubmitLabel();
  }

  function updateSubmitLabel() {
    var hasErrors = !!form.querySelector('.field.is-invalid');
    if (state.submitted && hasErrors) submitLabel.textContent = 'Kiểm tra lại thông tin';
    else submitLabel.textContent = state.editingId ? 'Lưu thay đổi' : 'Hoàn tất đăng ký';
  }

  function updateCounter() {
    var len = fields.note.value.length;
    noteCounter.textContent = len + '/300';
    noteCounter.classList.toggle('is-near', len >= 270);
  }

  function clearFormState() {
    FIELD_ORDER.forEach(function (key) { setFieldError(key, ''); });
    state.touched = {};
    state.submitted = false;
  }

  function resetForm() {
    form.reset();
    clearFormState();
    updateCounter();
    updateSubmitLabel();
  }

  // Ô văn bản: kiểm tra khi rời ô (nếu đã nhập) và kiểm tra trực tiếp sau đó.
  ['name', 'email', 'phone', 'org', 'note'].forEach(function (key) {
    var input = fields[key];
    input.addEventListener('blur', function () {
      if (input.value.trim() || state.submitted || state.touched[key]) {
        state.touched[key] = true;
        validateField(key);
        updateSubmitLabel();
      }
    });
    input.addEventListener('input', function () { revalidate(key); });
  });
  fields.type.addEventListener('change', function () { state.touched.type = true; revalidate('type'); });
  modeInputs.forEach(function (input) {
    input.addEventListener('change', function () { state.touched.mode = true; revalidate('mode'); });
  });
  topicInputs.forEach(function (input) {
    input.addEventListener('change', function () { state.touched.topics = true; revalidate('topics'); });
  });
  fields.consent.addEventListener('change', function () { state.touched.consent = true; revalidate('consent'); });
  fields.note.addEventListener('input', updateCounter);

  // Số điện thoại: chỉ giữ chữ số (tối đa 10), đổi +84 thành 0, giữ nguyên vị trí con trỏ.
  fields.phone.addEventListener('input', function () {
    var input = fields.phone;
    var raw = input.value;
    var prefixed = /^\s*\+\s*84/.test(raw) ? raw.replace(/^\s*\+\s*84\s*/, '0') : raw;
    var digits = prefixed.replace(/\D/g, '').slice(0, 10);
    if (digits === raw) return;
    var caret = input.selectionStart === null ? raw.length : input.selectionStart;
    var before = raw.slice(0, caret);
    if (prefixed !== raw) before = /^\s*\+\s*84/.test(before) ? before.replace(/^\s*\+\s*84\s*/, '0') : '';
    var pos = Math.min(before.replace(/\D/g, '').length, digits.length);
    input.value = digits;
    try { input.setSelectionRange(pos, pos); } catch (e) { /* một số trình duyệt không hỗ trợ */ }
    revalidate('phone');
  });

  function validateAll() {
    var values = getValues();
    var invalid = [];
    FIELD_ORDER.forEach(function (key) {
      if (validateField(key, values)) invalid.push(key);
    });
    return { values: values, invalid: invalid };
  }

  function focusField(key) {
    var target = inputsOf(key)[0];
    if (!target) return;
    var wrap = form.querySelector('[data-field="' + key + '"]') || target;
    scrollToEl(wrap, 'center');
    focusNoScroll(target);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var result = validateAll();
    state.submitted = true;
    updateSubmitLabel();
    if (result.invalid.length) {
      focusField(result.invalid[0]);
      toast(result.invalid.length === 1
        ? 'Vui lòng kiểm tra lại 1 thông tin chưa hợp lệ.'
        : 'Vui lòng kiểm tra lại ' + result.invalid.length + ' thông tin chưa hợp lệ.', 'danger');
      return;
    }

    var v = result.values;
    var now = Date.now();
    var data = {
      name: v.name, email: v.email, phone: v.phone, org: v.org,
      type: v.type, mode: v.mode, topics: v.topics, note: v.note
    };
    var index = state.editingId ? indexOf(state.editingId) : -1;
    var record;
    var action;
    if (index > -1) {
      record = Object.assign({}, state.list[index], data, { updatedAt: now });
      state.list[index] = record;
      action = 'update';
    } else {
      record = Object.assign({ id: makeId() }, data, { createdAt: now, updatedAt: 0 });
      state.list.push(record);
      action = 'create';
    }
    persist();

    state.lastSavedId = record.id;
    state.lastAction = action;
    state.flashId = record.id;
    state.query = '';
    searchInput.value = '';
    exitEditMode();
    resetForm();
    render();

    focusNoScroll(resultsTitle);
    scrollToEl(resultsSection);
    toast(action === 'update' ? 'Đã cập nhật đăng ký của ' + record.name + '.' : 'Đăng ký thành công! Hẹn gặp bạn tại hội thảo.');
  });

  /* ---------- Chỉnh sửa ---------- */
  function indexOf(id) {
    for (var i = 0; i < state.list.length; i++) if (state.list[i].id === id) return i;
    return -1;
  }
  function findRecord(id) {
    var i = indexOf(id);
    return i > -1 ? state.list[i] : null;
  }

  function startEdit(id) {
    var rec = findRecord(id);
    if (!rec) return;
    resetForm();
    state.editingId = id;
    fields.name.value = rec.name;
    fields.email.value = rec.email;
    fields.phone.value = rec.phone;
    fields.org.value = rec.org;
    fields.type.value = has(LABELS.type, rec.type) ? rec.type : '';
    modeInputs.forEach(function (i) { i.checked = i.value === rec.mode; });
    topicInputs.forEach(function (i) { i.checked = rec.topics.indexOf(i.value) > -1; });
    fields.note.value = rec.note;
    fields.consent.checked = true;
    updateCounter();
    editName.textContent = rec.name;
    editBanner.hidden = false;
    registerTitle.textContent = 'Cập nhật đăng ký';
    updateSubmitLabel();
    scrollToEl(registerSection);
    focusNoScroll(fields.name);
  }

  function exitEditMode() {
    state.editingId = null;
    editBanner.hidden = true;
    editName.textContent = '';
    registerTitle.textContent = 'Đăng ký tham dự';
    updateSubmitLabel();
  }

  $('#cancel-edit').addEventListener('click', function () {
    exitEditMode();
    resetForm();
    focusNoScroll(fields.name);
    toast('Đã hủy chỉnh sửa.');
  });

  function goToForm() {
    scrollToEl(registerSection);
    focusNoScroll(fields.name);
  }

  $('#register-more').addEventListener('click', function () {
    if (state.editingId) exitEditMode();
    resetForm();
    goToForm();
  });

  /* =========================================================
     Danh sách đăng ký
     ========================================================= */
  function chip(mode) {
    var online = mode === 'truc-tuyen';
    return h('span', { class: 'chip ' + (online ? 'chip--online' : 'chip--offline') },
      icon(online ? 'laptop' : 'user-solid'),
      LABELS.mode[mode] || LABELS.mode['truc-tiep']
    );
  }

  function emptyRow(title, text) {
    return h('tr', { class: 'empty-row' },
      h('td', { colspan: 5 }, h('strong', { text: title }), text)
    );
  }

  function renderTable() {
    var q = fold(state.query);
    var sorted = state.list.slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    var items = q ? sorted.filter(function (r) { return fold(r.name + ' ' + r.email + ' ' + r.org).indexOf(q) > -1; }) : sorted;

    var rows = [];
    if (!state.list.length) {
      rows.push(emptyRow('Chưa có đăng ký nào', 'Hãy điền biểu mẫu để đăng ký tham dự hội thảo.'));
    } else if (!items.length) {
      rows.push(emptyRow('Không tìm thấy kết quả', 'Không có đăng ký nào khớp với “' + collapseSpaces(state.query) + '”.'));
    } else {
      items.forEach(function (r) {
        rows.push(h('tr', { 'data-id': r.id, class: r.id === state.flashId ? 'is-new' : null },
          h('td', { 'data-label': 'Họ và tên', text: r.name }),
          h('td', { 'data-label': 'Email', text: r.email }),
          h('td', { 'data-label': 'Đơn vị', text: r.org }),
          h('td', { 'data-label': 'Hình thức', class: 't-center' }, chip(r.mode)),
          h('td', { 'data-label': 'Thao tác', class: 't-center' },
            h('span', { class: 'row-actions' },
              h('button', { class: 'act act--edit', type: 'button', 'data-action': 'edit', 'aria-label': 'Sửa đăng ký của ' + r.name },
                icon('pencil'), h('span', { text: 'Sửa' })),
              h('button', { class: 'act act--delete', type: 'button', 'data-action': 'delete', 'aria-label': 'Xóa đăng ký của ' + r.name },
                icon('trash'), h('span', { text: 'Xóa' }))
            )
          )
        ));
      });
    }
    state.flashId = null;
    if (tbody.replaceChildren) tbody.replaceChildren.apply(tbody, rows);
    else { tbody.innerHTML = ''; rows.forEach(function (row) { tbody.appendChild(row); }); }

    listCount.textContent = q && state.list.length ? 'Hiển thị ' + items.length + '/' + state.list.length + ' đăng ký' : '';
  }

  function renderStats() {
    var offline = state.list.filter(function (r) { return r.mode === 'truc-tiep'; }).length;
    $('#stat-total').textContent = state.list.length;
    $('#stat-offline').textContent = offline;
    $('#stat-online').textContent = state.list.length - offline;
  }

  function renderSuccess() {
    var rec = state.lastSavedId ? findRecord(state.lastSavedId) : null;
    if (!rec) {
      successCard.hidden = true;
      return;
    }
    $('#success-title').textContent = state.lastAction === 'update' ? 'Cập nhật thành công!' : 'Đăng ký thành công!';
    $('#s-name').textContent = rec.name;
    $('#s-email').textContent = rec.email;
    $('#s-org').textContent = rec.org;
    $('#s-mode').textContent = LABELS.mode[rec.mode] || '';
    successCard.hidden = false;
  }

  function render() {
    if (state.list.length) state.resultsShown = true;
    resultsSection.hidden = !state.resultsShown;
    renderStats();
    renderTable();
    renderSuccess();
    currentNav = null;
    updateScrollState();
  }

  searchInput.addEventListener('input', function () {
    state.query = searchInput.value;
    renderTable();
  });

  tbody.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!btn) return;
    var row = btn.closest('tr');
    var id = row ? row.getAttribute('data-id') : null;
    if (!id) return;
    if (btn.getAttribute('data-action') === 'edit') startEdit(id);
    else askDelete(id, btn);
  });

  /* ---------- Xóa ---------- */
  function askDelete(id, opener) {
    var rec = findRecord(id);
    if (!rec) return;
    state.pendingDeleteId = id;
    $('#confirm-name').textContent = rec.name;
    $('#confirm-email').textContent = rec.email;
    openDialog(confirmDialog, opener);
    focusNoScroll($('.modal__actions [data-close]', confirmDialog));
  }

  $('#confirm-delete').addEventListener('click', function () {
    var id = state.pendingDeleteId;
    var index = id ? indexOf(id) : -1;
    if (index === -1) {
      closeDialog(confirmDialog);
      return;
    }
    var removed = state.list.splice(index, 1)[0];
    persist();
    if (state.lastSavedId === id) state.lastSavedId = null;
    if (state.editingId === id) {
      exitEditMode();
      resetForm();
    }
    closeDialog(confirmDialog, state.list.length ? searchInput : resultsTitle);
    render();
    // Email vừa xóa có thể đang bị báo trùng trong biểu mẫu.
    if (state.touched.email || state.submitted) revalidate('email');
    toast('Đã xóa đăng ký của ' + removed.name + '.');
  });

  /* ---------- Đồng bộ giữa các tab ---------- */
  window.addEventListener('storage', function (e) {
    if (e.key !== STORAGE_KEY && e.key !== null) return;
    state.list = loadList();
    if (state.editingId && !findRecord(state.editingId)) {
      exitEditMode();
      resetForm();
    }
    if (state.pendingDeleteId && !findRecord(state.pendingDeleteId)) closeDialog(confirmDialog);
    render();
  });

  /* =========================================================
     Khởi tạo
     ========================================================= */
  $$('svg.icon').forEach(function (svg) {
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
  });
  updateCounter();
  updateSubmitLabel();
  $('#submit-btn').disabled = false;
  render();
  if (location.hash === '#ket-qua' && !resultsSection.hidden) scrollToEl(resultsSection);
})();
