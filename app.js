// ================================================
// نظام المستخدمين والصلاحيات
// ================================================

const USERS_KEY = 'platform_users';
const CURRENT_USER_KEY = 'current_user';

// ================================================
// الساعة والتاريخ الميلادي والهجري
// ================================================

function startClock() {
    function tick() {
        const now = new Date();

        // الساعة
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const timeEl = document.getElementById('clock-time');
        if (timeEl) timeEl.textContent = `${hh}:${mm}:${ss}`;

        // التاريخ الميلادي بالعربية
        const gregEl = document.getElementById('clock-date-greg');
        if (gregEl) {
            gregEl.textContent = now.toLocaleDateString('ar-DZ', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        }

        // التاريخ الهجري
        const hijriEl = document.getElementById('clock-date-hijri');
        if (hijriEl) {
            hijriEl.textContent = now.toLocaleDateString('ar-SA-u-ca-islamic', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        }
    }
    tick();
    setInterval(tick, 1000);
}

// ================================================
// سبحة الذكر — المذهب المالكي
// ================================================

const TASBIH_STAGES = [
    { name: 'سُبْحَانَ اللهِ',   text: 'سُبْحَانَ اللهِ',   max: 33 },
    { name: 'الحَمْدُ للهِ',     text: 'الحَمْدُ للهِ',     max: 33 },
    { name: 'اللهُ أَكْبَرُ',    text: 'اللهُ أَكْبَرُ',    max: 33 },
    {
        name: 'لا إِلَهَ إِلَّا اللهُ',
        text: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        max: 1
    }
];

let tasbihStage   = 0;
let tasbihCount   = 0;
let tasbihDone    = false;

function openTasbih() {
    document.getElementById('tasbih-modal').style.display = 'flex';
    renderTasbih();
}

function closeTasbih() {
    document.getElementById('tasbih-modal').style.display = 'none';
}

function closeTasbihOnOutside(e) {
    if (e.target.id === 'tasbih-modal') closeTasbih();
}

function countTasbih() {
    if (tasbihDone) return;

    // اهتزاز خفيف إن كان مدعوماً
    if (navigator.vibrate) navigator.vibrate(30);

    tasbihCount++;
    const stage = TASBIH_STAGES[tasbihStage];

    if (tasbihCount >= stage.max) {
        tasbihStage++;
        tasbihCount = 0;
        if (tasbihStage >= TASBIH_STAGES.length) {
            tasbihDone = true;
        }
    }
    renderTasbih();
}

function resetTasbih() {
    tasbihStage = 0;
    tasbihCount = 0;
    tasbihDone  = false;
    renderTasbih();
}

function renderTasbih() {
    if (tasbihDone) {
        document.getElementById('tasbih-bead').style.display    = 'none';
        document.getElementById('tasbih-done').style.display    = 'flex';
        document.getElementById('tasbih-dhikr-name').textContent = '﴿ اكتملت السبحة ﴾';
        document.getElementById('tasbih-dhikr-text').textContent = '';
        document.getElementById('tasbih-progress-fill').style.width = '100%';
        document.getElementById('tasbih-progress-label').textContent = '100 / 100';
        // إبراز كل المراحل
        TASBIH_STAGES.forEach((_, i) => {
            const el = document.getElementById(`stage-${i}`);
            if (el) el.classList.add('done');
        });
        return;
    }

    document.getElementById('tasbih-bead').style.display = 'flex';
    document.getElementById('tasbih-done').style.display = 'none';

    const stage = TASBIH_STAGES[tasbihStage];
    document.getElementById('tasbih-dhikr-name').textContent  = stage.name;
    document.getElementById('tasbih-dhikr-text').textContent  = stage.text;
    document.getElementById('tasbih-count').textContent       = tasbihCount;
    document.getElementById('tasbih-total').textContent       = `/ ${stage.max}`;
    document.getElementById('tasbih-progress-label').textContent = `${tasbihCount} / ${stage.max}`;

    const pct = stage.max > 1 ? (tasbihCount / stage.max) * 100 : (tasbihCount * 100);
    document.getElementById('tasbih-progress-fill').style.width = pct + '%';

    // تلوين مراحل السبحة
    TASBIH_STAGES.forEach((_, i) => {
        const el = document.getElementById(`stage-${i}`);
        if (!el) return;
        el.classList.remove('active', 'done');
        if (i < tasbihStage)  el.classList.add('done');
        if (i === tasbihStage) el.classList.add('active');
    });
}

// المستخدمون الافتراضيون
const DEFAULT_USERS = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        fullName: 'أ.د بن جلول مختار',
        role: 'admin',
        roleAr: 'مدير المنصة',
        title: 'أستاذ اللسانيات العربية',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'import', 'statistics', 'system']
    },
    {
        id: 2,
        username: 'head',
        password: 'head123',
        fullName: 'أ.د احميدة مداني',
        role: 'head',
        roleAr: 'رئيس القسم',
        title: 'رئيس قسم اللغة العربية وآدابها',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'import', 'statistics']
    },
    {
        id: 3,
        username: 'deputy',
        password: 'deputy123',
        fullName: 'أ.د دبيح محمد',
        role: 'deputy',
        roleAr: 'نائب رئيس القسم',
        title: 'نائب رئيس قسم اللغة العربية وآدابها',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'import', 'statistics']
    },
    {
        id: 4,
        username: 'field_head',
        password: 'field123',
        fullName: 'أ.د تركي امحمد',
        role: 'field_head',
        roleAr: 'رئيس الميدان',
        title: 'رئيس ميدان اللغة والأدب العربي',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'import', 'statistics']
    },
    // رؤساء الشعب
    {
        id: 5,
        username: 'branch_head_1',
        password: 'branch123',
        fullName: 'د. بوزيد حمادي',
        role: 'branch_head',
        roleAr: 'رئيس شعبة',
        title: 'رئيس شعبة الدراسات اللغوية',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'statistics'],
        branch: 'دراسات لغوية'
    },
    {
        id: 6,
        username: 'branch_head_2',
        password: 'branch123',
        fullName: 'د. قادري محمد',
        role: 'branch_head',
        roleAr: 'رئيس شعبة',
        title: 'رئيس شعبة الدراسات الأدبية',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'statistics'],
        branch: 'دراسات أدبية'
    },
    {
        id: 7,
        username: 'branch_head_3',
        password: 'branch123',
        fullName: 'د. عبد القادر رحماني',
        role: 'branch_head',
        roleAr: 'رئيس شعبة',
        title: 'رئيس شعبة الدراسات النقدية',
        permissions: ['view', 'add', 'edit', 'delete', 'export', 'statistics'],
        branch: 'دراسات نقدية'
    },
    // رؤساء التخصصات
    {
        id: 8,
        username: 'spec_head_1',
        password: 'spec123',
        fullName: 'د. عمر بلخير',
        role: 'specialization_head',
        roleAr: 'رئيس تخصص',
        title: 'رئيس تخصص لسانيات الخطاب',
        permissions: ['view', 'add', 'edit', 'export', 'statistics'],
        specialization: 'لسانيات الخطاب'
    },
    {
        id: 9,
        username: 'spec_head_2',
        password: 'spec123',
        fullName: 'د. فاطمة بن عيسى',
        role: 'specialization_head',
        roleAr: 'رئيس تخصص',
        title: 'رئيس تخصص تعليمية اللغات',
        permissions: ['view', 'add', 'edit', 'export', 'statistics'],
        specialization: 'تعليمية اللغات'
    },
    {
        id: 10,
        username: 'spec_head_3',
        password: 'spec123',
        fullName: 'د. خالد بن زيان',
        role: 'specialization_head',
        roleAr: 'رئيس تخصص',
        title: 'رئيس تخصص الأدب الحديث والمعاصر',
        permissions: ['view', 'add', 'edit', 'export', 'statistics'],
        specialization: 'أدب حديث ومعاصر'
    },
    {
        id: 11,
        username: 'spec_head_4',
        password: 'spec123',
        fullName: 'د. سعيد بوطاجين',
        role: 'specialization_head',
        roleAr: 'رئيس تخصص',
        title: 'رئيس تخصص النقد الحديث والمعاصر',
        permissions: ['view', 'add', 'edit', 'export', 'statistics'],
        specialization: 'نقد حديث ومعاصر'
    },
    // الأستاذ والطالب
    {
        id: 12,
        username: 'professor',
        password: 'prof123',
        fullName: 'د. محمد الطاهر بن عاشور',
        role: 'professor',
        roleAr: 'أستاذ',
        title: 'أستاذ محاضر',
        permissions: ['view', 'export'],
        professorName: 'د. محمد الطاهر بن عاشور'
    },
    {
        id: 13,
        username: 'student',
        password: 'student123',
        fullName: 'أحمد بن محمد العربي',
        role: 'student',
        roleAr: 'طالب',
        title: 'طالب ماستر',
        permissions: ['view'],
        studentName: 'أحمد بن محمد العربي'
    }
];

// تهيئة المستخدمين الافتراضيين
function initializeUsers() {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

// تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // حفظ المستخدم الحالي
        const currentUser = {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            roleAr: user.roleAr,
            title: user.title,
            permissions: user.permissions,
            professorName: user.professorName,
            studentName: user.studentName,
            branch: user.branch,
            specialization: user.specialization
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
        
        // إخفاء صفحة تسجيل الدخول وإظهار المنصة
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-platform').style.display = 'flex';
        
        // تحديث واجهة المستخدم
        updateUIForUser(currentUser);
        
        showToast(`أهلاً بك ${currentUser.fullName}`, 'success');
    } else {
        showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
    }
}

// تسجيل الخروج
function handleLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        localStorage.removeItem(CURRENT_USER_KEY);
        
        // إخفاء المنصة وإظهار صفحة تسجيل الدخول
        document.getElementById('main-platform').style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        
        // إعادة تعيين النموذج
        document.getElementById('login-form').reset();
        
        showToast('تم تسجيل الخروج بنجاح', 'success');
    }
}

// الحصول على المستخدم الحالي
function getCurrentUser() {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
}

// فحص الصلاحية
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    return user.permissions.includes(permission);
}

// تحديث الواجهة حسب المستخدم
function updateUIForUser(user) {
    // تحديث معلومات المستخدم في الهيدر
    document.getElementById('current-user-name').textContent = user.fullName;
    document.getElementById('current-user-role').textContent = user.roleAr;
    
    // إخفاء/إظهار عناصر القائمة حسب الصلاحيات
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const page = item.getAttribute('data-page');
        
        // القواعد
        if (page === 'add-thesis' && !hasPermission('add')) {
            item.style.display = 'none';
        }
        if (page === 'statistics' && !hasPermission('statistics')) {
            item.style.display = 'none';
        }
    });
    
    // إظهار/إخفاء زر حذف كل المذكرات
    const deleteAllBtn = document.getElementById('delete-all-btn');
    if (deleteAllBtn) {
        deleteAllBtn.style.display = hasPermission('delete') ? 'inline-flex' : 'none';
    }

    // إظهار/إخفاء زر الجدولة الذكية
    const schedBtn = document.getElementById('smart-sched-btn');
    if (schedBtn) {
        schedBtn.style.display = hasPermission('edit') ? 'inline-flex' : 'none';
    }

    // أزرار Excel في لوحة التحكم (نموذج + استيراد)
    const dashImportBtn = document.getElementById('import-excel-btn');
    if (dashImportBtn) {
        dashImportBtn.style.display = hasPermission('import') ? 'inline-flex' : 'none';
    }
    const dlTemplateBtn = document.getElementById('download-template-btn');
    if (dlTemplateBtn) {
        dlTemplateBtn.style.display = hasPermission('import') ? 'inline-flex' : 'none';
    }
    const sampleExcelBtn = document.getElementById('sample-excel-btn');
    if (sampleExcelBtn) {
        sampleExcelBtn.style.display = hasPermission('import') ? 'inline-flex' : 'none';
    }

    // أزرار المشاركة عبر shared-data.json
    const publishBtn = document.getElementById('publish-data-btn');
    if (publishBtn) {
        publishBtn.style.display = (user.role === 'admin' || user.role === 'head') ? 'inline-flex' : 'none';
    }
    const syncBtn = document.getElementById('sync-data-btn');
    if (syncBtn) syncBtn.style.display = 'inline-flex';

    // إخفاء أزرار الاستيراد والتصدير حسب الصلاحيات
    const importBtn = document.querySelector('button[onclick="importExcel()"]');
    const exportBtn = document.querySelector('button[onclick="exportToExcel()"]');
    
    if (importBtn && !hasPermission('import')) {
        importBtn.style.display = 'none';
    }
    if (exportBtn && !hasPermission('export')) {
        exportBtn.style.display = 'none';
    }
    
    // فلترة البيانات حسب المستخدم
    filterDataForUser(user);
}

// فلترة البيانات حسب دور المستخدم
function filterDataForUser(user) {
    // تطبيق الفلاتر (ستتم الفلترة حسب دور المستخدم داخل applyFilters)
    applyFilters();
}

// فحص تسجيل الدخول عند تحميل الصفحة
function checkLoginStatus() {
    const user = getCurrentUser();
    
    if (user) {
        // المستخدم مسجل دخوله
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('main-platform').style.display = 'flex';
        updateUIForUser(user);
    } else {
        // المستخدم غير مسجل
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('main-platform').style.display = 'none';
    }
}

// التبديل إلى صفحة التسجيل
function showRegisterPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'flex';
    document.getElementById('main-platform').style.display = 'none';
}

// التبديل إلى صفحة تسجيل الدخول
function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('main-platform').style.display = 'none';
}

// تحديث حقول نموذج التسجيل حسب الدور
function updateRegisterFields() {
    const role = document.getElementById('reg-role').value;
    const titleGroup = document.getElementById('reg-title-group');
    const studentInfo = document.getElementById('reg-student-info');
    const titleField = document.getElementById('reg-title');
    
    if (role === 'professor') {
        titleGroup.style.display = 'block';
        studentInfo.style.display = 'none';
        titleField.required = true;
    } else if (role === 'student') {
        titleGroup.style.display = 'none';
        studentInfo.style.display = 'block';
        titleField.required = false;
    } else {
        titleGroup.style.display = 'none';
        studentInfo.style.display = 'none';
        titleField.required = false;
    }
}

// التحقق من صحة الاسم الكامل (لقب واسم بينهما فراغ)
function validateFullName(fullName) {
    const trimmed = fullName.trim();
    const parts = trimmed.split(' ');
    
    // يجب أن يحتوي على جزأين على الأقل (لقب واسم)
    if (parts.length < 2) {
        return {
            valid: false,
            message: 'يجب إدخال اللقب والاسم بينهما فراغ (مثال: بن محمد أحمد)'
        };
    }
    
    // التحقق من أن كل جزء يحتوي على أحرف
    for (let part of parts) {
        if (part.length < 2) {
            return {
                valid: false,
                message: 'كل جزء من الاسم يجب أن يحتوي على حرفين على الأقل'
            };
        }
    }
    
    return { valid: true, message: '' };
}

// معالجة التسجيل
function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('reg-fullname').value.trim();
    const role = document.getElementById('reg-role').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-password-confirm').value;
    const title = document.getElementById('reg-title').value;
    const studentId = document.getElementById('reg-student-id').value.trim();
    
    // التحقق من الاسم الكامل
    const nameValidation = validateFullName(fullName);
    if (!nameValidation.valid) {
        showToast(nameValidation.message, 'error');
        return;
    }
    
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
        showToast('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    // التحقق من طول كلمة المرور
    if (password.length < 6) {
        showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
        return;
    }
    
    // التحقق من الرتبة للأستاذ
    if (role === 'professor' && !title) {
        showToast('يجب اختيار الرتبة العلمية', 'error');
        return;
    }
    
    // التحقق من عدم وجود المستخدم مسبقاً
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const existingUser = users.find(u => u.fullName === fullName);
    
    if (existingUser) {
        showToast('يوجد حساب مسجل بهذا الاسم مسبقاً', 'error');
        return;
    }
    
    // إنشاء المستخدم الجديد
    const newUser = {
        id: users.length + 1,
        username: fullName, // اسم المستخدم هو الاسم الكامل
        password: password,
        fullName: fullName,
        role: role,
        roleAr: role === 'professor' ? 'أستاذ' : 'طالب',
        title: role === 'professor' ? title : (studentId || 'طالب ماستر'),
        permissions: role === 'professor' ? ['view', 'export'] : ['view']
    };
    
    // إضافة اسم الأستاذ أو الطالب للفلترة
    if (role === 'professor') {
        newUser.professorName = fullName;
    } else {
        newUser.studentName = fullName;
    }
    
    // حفظ المستخدم
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    showToast('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول', 'success');
    
    // إعادة تعيين النموذج
    document.getElementById('register-form').reset();
    
    // الانتقال لصفحة تسجيل الدخول
    setTimeout(() => {
        showLoginPage();
        // ملء اسم المستخدم تلقائياً
        document.getElementById('username').value = fullName;
    }, 1500);
}

// ================================================
// إعدادات عامة وبيانات ثابتة
// ================================================

const STORAGE_KEY = 'master_theses_data';
const PROFESSORS_KEY = 'professors_list';

// البيانات الثابتة
const BRANCHES = ['دراسات لغوية', 'دراسات أدبية', 'دراسات نقدية'];
const SPECIALIZATIONS = {
    'دراسات لغوية': ['لسانيات الخطاب', 'تعليمية اللغات'],
    'دراسات أدبية': ['أدب حديث ومعاصر'],
    'دراسات نقدية': ['نقد حديث ومعاصر']
};
const ALL_SPECIALIZATIONS = ['لسانيات الخطاب', 'تعليمية اللغات', 'أدب حديث ومعاصر', 'نقد حديث ومعاصر'];
const RANKS = [
    'أستاذ التعليم العالي',
    'أستاذ محاضر أ',
    'أستاذ محاضر ب',
    'أستاذ مساعد أ',
    'أستاذ مساعد ب'
];

// متغيرات عامة
let theses = [];
let currentPage = 1;
let itemsPerPage = 20;
let filteredTheses = [];
let editingThesisId = null;
let currentPDFThesis = null;
let previewData = null; // البيانات المراد معاينتها قبل الاستيراد
let fromFormImport = false; // هل الاستيراد من صفحة النموذج

// ================================================
// تحميل البيانات عند بدء التشغيل
// ================================================

document.addEventListener('DOMContentLoaded', async function() {
    initializeUsers(); // تهيئة المستخدمين
    checkLoginStatus(); // فحص حالة تسجيل الدخول
    await tryLoadSharedData(); // تحميل البيانات المشتركة إن لم تكن هناك بيانات محلية
    loadData();
    initializeApp();
    updateDashboard();
    updateThesesList();
    setupSearchListener();
    loadProfessorsList();
    startClock(); // تشغيل الساعة
});

// ================================================
// إدارة البيانات (LocalStorage)
// ================================================

function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        theses = JSON.parse(storedData);
    } else {
        theses = [];
    }
    filteredTheses = [...theses];
}

// ================================================
// المشاركة التلقائية عبر shared-data.json
// ================================================

// يُحمَّل تلقائياً عند بدء التشغيل إذا لا توجد بيانات محلية
async function tryLoadSharedData() {
    try {
        const existing = localStorage.getItem(STORAGE_KEY);
        if (existing && JSON.parse(existing).length > 0) return; // توجد بيانات محلية → لا حاجة

        const res = await fetch('shared-data.json?v=' + Date.now());
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            showToast(`✅ تم تحميل ${data.length} مذكرة من الملف المشترك`, 'success');
        }
    } catch (e) {
        // لا يوجد ملف مشترك أو خطأ في الشبكة — تجاهل
    }
}

// مزامنة يدوية: يُعيد تحميل shared-data.json ويستبدل البيانات الحالية
async function syncFromShared() {
    try {
        showToast('جاري المزامنة...', 'info');
        const res = await fetch('shared-data.json?v=' + Date.now());
        if (!res.ok) {
            showToast('لم يُعثر على ملف مشترك. تأكد من رفع shared-data.json على GitHub', 'error');
            return;
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            theses = data;
            filteredTheses = [...theses];
            updateDashboard();
            updateThesesList();
            showToast(`✅ تمت المزامنة — ${data.length} مذكرة محدّثة`, 'success');
        } else {
            showToast('الملف المشترك فارغ', 'warning');
        }
    } catch (e) {
        showToast('فشلت المزامنة: ' + e.message, 'error');
    }
}

// تصدير البيانات الحالية كـ shared-data.json لرفعه على GitHub
function publishSharedData() {
    if (theses.length === 0) {
        showToast('لا توجد بيانات للنشر', 'warning');
        return;
    }
    const json = JSON.stringify(theses, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'shared-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast(`📤 تم تحميل shared-data.json (${theses.length} مذكرة) — ارفعه على GitHub لمشاركته مع الجميع`, 'success');
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theses));
}

function saveProfessors(professors) {
    localStorage.setItem(PROFESSORS_KEY, JSON.stringify(professors));
}

function loadProfessors() {
    const stored = localStorage.getItem(PROFESSORS_KEY);
    return stored ? JSON.parse(stored) : [];
}

// ================================================
// التنقل بين الصفحات
// ================================================

function showPage(pageId) {
    // إخفاء كل الصفحات
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // إزالة الـ active من كل أزرار التنقل
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // تفعيل زر التنقل المناسب
    const activeNavItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // تحديث المحتوى حسب الصفحة
    switch(pageId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'theses-list':
            buildFilterPanels();
            applyFilters();
            break;
        case 'professors':
            updateProfessorsPage();
            break;
        case 'statistics':
            updateStatisticsPage();
            break;
        case 'schedule':
            updateSchedulePage();
            break;
        case 'add-thesis':
            if (editingThesisId) {
                loadThesisForEdit(editingThesisId);
            } else {
                resetForm();
            }
            break;
    }
}

// ================================================
// لوحة التحكم (Dashboard)
// ================================================

function updateDashboard() {
    // استخدام البيانات المفلترة حسب دور المستخدم
    const displayTheses = filteredTheses.length > 0 ? filteredTheses : theses;
    
    // إجمالي المذكرات
    document.getElementById('total-theses').textContent = displayTheses.length;

    // إحصائيات التخصصات
    const specCounts = {
        'لسانيات الخطاب': 0,
        'تعليمية اللغات': 0,
        'أدب حديث ومعاصر': 0,
        'نقد حديث ومعاصر': 0
    };

    displayTheses.forEach(thesis => {
        if (specCounts.hasOwnProperty(thesis.specialization)) {
            specCounts[thesis.specialization]++;
        }
    });

    document.getElementById('specialization-1').textContent = specCounts['لسانيات الخطاب'];
    document.getElementById('specialization-2').textContent = specCounts['تعليمية اللغات'];
    document.getElementById('specialization-3').textContent = specCounts['أدب حديث ومعاصر'];
    document.getElementById('specialization-4').textContent = specCounts['نقد حديث ومعاصر'];

    // إحصائيات الشعب
    const branchCounts = {
        'دراسات لغوية': 0,
        'دراسات أدبية': 0,
        'دراسات نقدية': 0
    };

    displayTheses.forEach(thesis => {
        if (branchCounts.hasOwnProperty(thesis.branch)) {
            branchCounts[thesis.branch]++;
        }
    });

    document.getElementById('branch-1').textContent = branchCounts['دراسات لغوية'];
    document.getElementById('branch-2').textContent = branchCounts['دراسات أدبية'];
    document.getElementById('branch-3').textContent = branchCounts['دراسات نقدية'];

    // آخر 10 مذكرات
    displayRecentTheses();
}

function displayRecentTheses() {
    const container = document.getElementById('recent-theses-table');
    const displayTheses = filteredTheses.length > 0 ? filteredTheses : theses;
    const recentTheses = [...displayTheses].reverse().slice(0, 10);

    if (recentTheses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📭</div><h3>لا توجد مذكرات</h3><p>ابدأ بإضافة أول مذكرة</p></div>';
        return;
    }

    let html = '<div class="table-container"><table>';
    html += '<thead><tr>';
    html += '<th>رقم المذكرة</th>';
    html += '<th>الموضوع</th>';
    html += '<th>الطالب</th>';
    html += '<th>المشرف</th>';
    html += '<th>الرئيس</th>';
    html += '<th>المناقش</th>';
    html += '<th>التخصص</th>';
    html += '<th>التاريخ</th>';
    html += '<th>التوقيت</th>';
    html += '<th>القاعة</th>';
    html += '<th>إجراءات</th>';
    html += '</tr></thead><tbody>';

    recentTheses.forEach(thesis => {
        html += '<tr>';
        html += `<td>${thesis.thesis_number}</td>`;
        html += `<td>${truncateText(thesis.title, 60)}</td>`;
        html += `<td>${thesis.student1}</td>`;
        html += `<td>${thesis.supervisor}</td>`;
        html += `<td>${thesis.president}</td>`;
        html += `<td>${thesis.examiner}</td>`;
        html += `<td><span class="badge badge-primary">${thesis.specialization}</span></td>`;
        html += `<td>${thesis.defense_date || '-'}</td>`;
        html += `<td>${thesis.defense_time || '-'}</td>`;
        html += `<td><span class="badge badge-info">${thesis.room || '-'}</span></td>`;
        html += `<td><div class="action-buttons">`;
        
        // أزرار حسب الصلاحيات
        if (hasPermission('edit')) {
            html += `<button onclick="editThesis('${thesis.id}')" class="btn btn-info btn-sm">✏️ تعديل</button>`;
        }
        html += `<button onclick="generatePDFForThesis('${thesis.id}')" class="btn btn-primary btn-sm">🖨️ طباعة</button>`;
        if (hasPermission('delete')) {
            html += `<button onclick="deleteThesis('${thesis.id}')" class="btn btn-danger btn-sm">🗑️ حذف</button>`;
        }
        
        html += `</div></td>`;
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ================================================
// قائمة المذكرات مع الفلترة والبحث
// ================================================

function updateThesesList() {
    displayThesesTable();
    updatePagination();
}

function displayThesesTable() {
    const container = document.getElementById('theses-table-container');
    
    if (filteredTheses.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>لا توجد نتائج</h3><p>لم يتم العثور على مذكرات تطابق معايير البحث</p></div>';
        return;
    }

    // حساب البيانات للصفحة الحالية
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageTheses = filteredTheses.slice(startIndex, endIndex);

    let html = '<div class="table-container"><table>';
    html += '<thead><tr>';
    html += '<th>الرقم</th>';
    html += '<th>الموضوع</th>';
    html += '<th>الطالب</th>';
    html += '<th>المشرف</th>';
    html += '<th>رئيس اللجنة</th>';
    html += '<th>العضو المناقش</th>';
    html += '<th>التخصص</th>';
    html += '<th>الشعبة</th>';
    html += '<th>التاريخ</th>';
    html += '<th>التوقيت</th>';
    html += '<th>القاعة</th>';
    html += '<th>إجراءات</th>';
    html += '</tr></thead><tbody>';

    pageTheses.forEach(thesis => {
        html += '<tr>';
        html += `<td><strong>${thesis.thesis_number}</strong></td>`;
        html += `<td>${truncateText(thesis.title, 50)}</td>`;
        html += `<td>${thesis.student1}${thesis.student2 ? '<br>' + thesis.student2 : ''}</td>`;
        html += `<td>${thesis.supervisor}</td>`;
        html += `<td>${thesis.president}</td>`;
        html += `<td>${thesis.examiner}</td>`;
        html += `<td><span class="badge badge-primary">${thesis.specialization}</span></td>`;
        html += `<td>${thesis.branch}</td>`;
        html += `<td>${thesis.defense_date || '-'}</td>`;
        html += `<td>${thesis.defense_time || '-'}</td>`;
        html += `<td><span class="badge badge-info">${thesis.room || '-'}</span></td>`;
        html += `<td><div class="action-buttons">`;
        
        // أزرار حسب الصلاحيات
        if (hasPermission('edit')) {
            html += `<button onclick="editThesis('${thesis.id}')" class="btn btn-info btn-sm">✏️</button>`;
        }
        if (hasPermission('delete')) {
            html += `<button onclick="deleteThesis('${thesis.id}')" class="btn btn-danger btn-sm">🗑️</button>`;
        }
        html += `<button onclick="generatePDFForThesis('${thesis.id}')" class="btn btn-primary btn-sm">🖨️</button>`;
        
        html += `</div></td>`;
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredTheses.length / itemsPerPage);
    const container = document.getElementById('pagination');

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    html += `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>السابق</button>`;

    // إظهار أول صفحة
    if (currentPage > 3) {
        html += `<button onclick="changePage(1)">1</button>`;
        if (currentPage > 4) html += '<span>...</span>';
    }

    // إظهار الصفحات المجاورة
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    }

    // إظهار آخر صفحة
    if (currentPage < totalPages - 2) {
        if (currentPage < totalPages - 3) html += '<span>...</span>';
        html += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>التالي</button>`;

    container.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredTheses.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    displayThesesTable();
    updatePagination();
}

// ================================================
// البحث والفلترة
// ================================================

function setupSearchListener() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
}

// ================================================
// الفلاتر المتقدمة متعددة الاختيار
// ================================================

// حالة الفلاتر المحددة
const activeFilters = {
    supervisor: new Set(),
    president: new Set(),
    examiner: new Set(),
    branch: new Set(),
    specialization: new Set()
};

// الفتح/الإغلاق للوحة فلتر معين
function toggleFilterPanel(panelId) {
    const panel = document.getElementById(panelId);
    const btn = panel.previousElementSibling;
    const isOpen = panel.classList.contains('open');

    // أغلق كل اللوحات الأخرى
    document.querySelectorAll('.filter-panel.open').forEach(p => {
        p.classList.remove('open');
        p.previousElementSibling.classList.remove('open');
    });

    if (!isOpen) {
        panel.classList.add('open');
        btn.classList.add('open');
    }
}

// إغلاق كل اللوحات عند الضغط خارجها
document.addEventListener('click', function(e) {
    if (!e.target.closest('.multi-filter-group')) {
        document.querySelectorAll('.filter-panel.open').forEach(p => {
            p.classList.remove('open');
            p.previousElementSibling.classList.remove('open');
        });
    }
});

// بناء قوائم الفلاتر من البيانات الفعلية
function buildFilterPanels() {
    const visibleTheses = getVisibleThesesForUser();

    const fields = {
        supervisor: { id: 'filter-supervisor-list', key: 'supervisor' },
        president:  { id: 'filter-president-list',  key: 'president' },
        examiner:   { id: 'filter-examiner-list',   key: 'examiner' },
        branch:     { id: 'filter-branch-list',      key: 'branch' },
        specialization: { id: 'filter-specialization-list', key: 'specialization' }
    };

    Object.entries(fields).forEach(([filterKey, cfg]) => {
        const container = document.getElementById(cfg.id);
        if (!container) return;

        // جمع القيم الفريدة وعدد ظهورها
        const counts = {};
        visibleTheses.forEach(t => {
            const val = t[cfg.key];
            if (val && val.trim()) {
                counts[val] = (counts[val] || 0) + 1;
            }
        });

        const values = Object.keys(counts).sort((a, b) => a.localeCompare(b, 'ar'));

        if (values.length === 0) {
            container.innerHTML = '<div style="padding:10px;color:#999;font-size:0.85rem;text-align:center;">لا توجد بيانات</div>';
            return;
        }

        container.innerHTML = values.map(val => {
            const checked = activeFilters[filterKey].has(val) ? 'checked' : '';
            const safeId = `chk-${filterKey}-${val.replace(/\s+/g, '-')}`;
            return `<label class="filter-check-item">
                <input type="checkbox" id="${safeId}" value="${val}" ${checked}
                    onchange="onFilterChange('${filterKey}', this)">
                <label for="${safeId}">${val}</label>
                <span class="filter-count-chip">${counts[val]}</span>
            </label>`;
        }).join('');
    });
}

// الحصول على المذكرات المسموح للمستخدم برؤيتها (بدون فلاتر)
function getVisibleThesesForUser() {
    const user = getCurrentUser();
    if (!user) return theses;
    return theses.filter(t => {
        if (user.role === 'professor') {
            return t.supervisor === user.professorName ||
                   t.president === user.professorName ||
                   t.examiner === user.professorName;
        }
        if (user.role === 'student') {
            return t.student1 === user.studentName || t.student2 === user.studentName;
        }
        if (user.role === 'branch_head') return t.branch === user.branch;
        if (user.role === 'specialization_head') return t.specialization === user.specialization;
        return true;
    });
}

// عند تغيير أي checkbox
function onFilterChange(filterKey, checkbox) {
    if (checkbox.checked) {
        activeFilters[filterKey].add(checkbox.value);
    } else {
        activeFilters[filterKey].delete(checkbox.value);
    }
    updateFilterBadges();
    applyFilters();
}

// تحديث الشارات (أعداد المحددات)
function updateFilterBadges() {
    ['supervisor', 'president', 'examiner', 'branch', 'specialization'].forEach(key => {
        const badge = document.getElementById(`badge-${key}`);
        const btn   = badge?.closest('.multi-filter-btn');
        const count = activeFilters[key].size;
        if (!badge) return;
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'inline-flex';
            btn?.classList.add('active');
        } else {
            badge.style.display = 'none';
            btn?.classList.remove('active');
        }
    });
}

// تحديد الكل في فلتر
function selectAllFilter(filterKey) {
    const container = document.getElementById(`filter-${filterKey}-list`);
    if (!container) return;
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        activeFilters[filterKey].add(cb.value);
    });
    updateFilterBadges();
    applyFilters();
}

// مسح فلتر واحد
function clearSingleFilter(filterKey) {
    const container = document.getElementById(`filter-${filterKey}-list`);
    if (!container) return;
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    activeFilters[filterKey].clear();
    updateFilterBadges();
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const user = getCurrentUser();

    filteredTheses = theses.filter(thesis => {
        // فلترة حسب دور المستخدم
        if (user) {
            if (user.role === 'professor') {
                const participates = 
                    thesis.supervisor === user.professorName ||
                    thesis.president === user.professorName ||
                    thesis.examiner === user.professorName;
                if (!participates) return false;
            } else if (user.role === 'student') {
                const isHisThesis = 
                    thesis.student1 === user.studentName ||
                    thesis.student2 === user.studentName;
                if (!isHisThesis) return false;
            } else if (user.role === 'branch_head') {
                if (thesis.branch !== user.branch) return false;
            } else if (user.role === 'specialization_head') {
                if (thesis.specialization !== user.specialization) return false;
            }
        }

        // البحث النصي
        const matchesSearch = !searchTerm || 
            thesis.title.toLowerCase().includes(searchTerm) ||
            thesis.student1.toLowerCase().includes(searchTerm) ||
            (thesis.student2 && thesis.student2.toLowerCase().includes(searchTerm)) ||
            thesis.supervisor.toLowerCase().includes(searchTerm) ||
            thesis.president.toLowerCase().includes(searchTerm) ||
            thesis.examiner.toLowerCase().includes(searchTerm) ||
            thesis.thesis_number.toLowerCase().includes(searchTerm);

        // الفلاتر المتعددة
        const matchesSupervisor     = activeFilters.supervisor.size === 0     || activeFilters.supervisor.has(thesis.supervisor);
        const matchesPresident      = activeFilters.president.size === 0      || activeFilters.president.has(thesis.president);
        const matchesExaminer       = activeFilters.examiner.size === 0       || activeFilters.examiner.has(thesis.examiner);
        const matchesBranch         = activeFilters.branch.size === 0         || activeFilters.branch.has(thesis.branch);
        const matchesSpecialization = activeFilters.specialization.size === 0 || activeFilters.specialization.has(thesis.specialization);

        return matchesSearch && matchesSupervisor && matchesPresident &&
               matchesExaminer && matchesBranch && matchesSpecialization;
    });

    currentPage = 1;
    updateThesesList();
}

function clearFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // مسح كل الفلاتر
    ['supervisor', 'president', 'examiner', 'branch', 'specialization'].forEach(key => {
        activeFilters[key].clear();
        const container = document.getElementById(`filter-${key}-list`);
        if (container) {
            container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        }
    });
    updateFilterBadges();
    applyFilters();
}

// ================================================
// نموذج إضافة/تعديل المذكرة
// ================================================

function initializeApp() {
    const form = document.getElementById('thesis-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // إضافة مستمعين للتحقق من التضاربات في الوقت الفعلي
    const dateField = document.getElementById('defense-date');
    const timeField = document.getElementById('defense-time');
    const roomField = document.getElementById('room');

    if (dateField && timeField && roomField) {
        const checkLiveConflicts = () => {
            const date = dateField.value;
            const time = timeField.value;
            const room = roomField.value;

            if (date && time && room) {
                showLiveConflictWarning(date, time, room);
            } else {
                hideLiveConflictWarning();
            }
        };

        dateField.addEventListener('change', checkLiveConflicts);
        timeField.addEventListener('change', checkLiveConflicts);
        roomField.addEventListener('change', checkLiveConflicts);
    }
}

function showLiveConflictWarning(date, time, room) {
    let warningDiv = document.getElementById('live-conflict-warning');
    
    if (!warningDiv) {
        warningDiv = document.createElement('div');
        warningDiv.id = 'live-conflict-warning';
        warningDiv.className = 'live-conflict-warning';
        
        const formGroups = document.querySelector('.form-row');
        if (formGroups) {
            formGroups.parentNode.insertBefore(warningDiv, formGroups.nextSibling);
        }
    }

    // فحص سريع للتضاربات
    const conflicts = theses.filter(t => 
        t.defense_date === date && 
        t.defense_time === time && 
        t.room === room &&
        t.id !== editingThesisId
    );

    if (conflicts.length > 0) {
        warningDiv.innerHTML = `
            <div class="warning-icon">⚠️</div>
            <div class="warning-content">
                <strong>تحذير!</strong> القاعة ${room} محجوزة في هذا التوقيت
                <span class="conflict-count">(${conflicts.length} تضارب)</span>
            </div>
        `;
        warningDiv.style.display = 'flex';
    } else {
        hideLiveConflictWarning();
    }
}

function hideLiveConflictWarning() {
    const warningDiv = document.getElementById('live-conflict-warning');
    if (warningDiv) {
        warningDiv.style.display = 'none';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    // فحص الصلاحيات
    if (editingThesisId && !hasPermission('edit')) {
        showToast('ليس لديك صلاحية التعديل', 'error');
        return;
    }
    if (!editingThesisId && !hasPermission('add')) {
        showToast('ليس لديك صلاحية الإضافة', 'error');
        return;
    }

    // جمع البيانات من النموذج
    const formData = {
        id: editingThesisId || generateId(),
        thesis_number: document.getElementById('thesis-number').value || generateThesisNumber(),
        title: document.getElementById('thesis-title').value,
        branch: document.getElementById('branch').value,
        specialization: document.getElementById('specialization').value,
        student1: document.getElementById('student1').value,
        student2: document.getElementById('student2').value,
        supervisor: document.getElementById('supervisor').value,
        supervisor_rank: document.getElementById('supervisor-rank').value,
        president: document.getElementById('president').value,
        president_rank: document.getElementById('president-rank').value,
        examiner: document.getElementById('examiner').value,
        examiner_rank: document.getElementById('examiner-rank').value,
        defense_date: document.getElementById('defense-date').value,
        defense_time: document.getElementById('defense-time').value,
        room: document.getElementById('room').value,
        created_at: editingThesisId ? 
            theses.find(t => t.id === editingThesisId)?.created_at : 
            new Date().toISOString()
    };

    // التحقق من البيانات
    if (!validateThesis(formData)) {
        return;
    }

    // فحص التضاربات
    const conflicts = checkConflicts(formData);
    if (conflicts.hasConflict) {
        showConflictModal(conflicts, formData);
        return;
    }

    // حفظ أو تحديث المذكرة
    if (editingThesisId) {
        const index = theses.findIndex(t => t.id === editingThesisId);
        if (index !== -1) {
            theses[index] = formData;
            showToast('تم تحديث المذكرة بنجاح', 'success');
        }
        editingThesisId = null;
    } else {
        theses.unshift(formData);
        showToast('تمت إضافة المذكرة بنجاح', 'success');
    }

    // حفظ البيانات وإعادة التحميل
    saveData();
    updateProfessorsFromTheses();
    applyFilters(); // تحديث القائمة المفلترة لتعكس التغييرات
    updateDashboard(); // تحديث لوحة التحكم
    resetForm();
    showPage('theses-list');
}

function validateThesis(thesis) {
    // التحقق من أن الموضوع لا يقل عن 10 أحرف
    if (thesis.title.length < 10) {
        showToast('موضوع المذكرة يجب أن يكون 10 أحرف على الأقل', 'error');
        return false;
    }

    // التحقق من عدم تكرار الأستاذ في أكثر من منصب
    const professors = [thesis.supervisor, thesis.president, thesis.examiner];
    const uniqueProfessors = [...new Set(professors)];
    if (professors.length !== uniqueProfessors.length) {
        showToast('لا يمكن أن يكون الأستاذ في أكثر من منصب في نفس اللجنة', 'error');
        return false;
    }

    return true;
}

// ================================================
// فحص التضاربات
// ================================================

function checkConflicts(newThesis) {
    const conflicts = {
        hasConflict: false,
        roomConflicts: [],
        professorConflicts: [],
        suggestions: {
            rooms: [],
            times: []
        }
    };

    // إذا لم يتم تحديد التاريخ والتوقيت، لا حاجة للفحص
    if (!newThesis.defense_date || !newThesis.defense_time || !newThesis.room) {
        return conflicts;
    }

    // فحص التضاربات مع المذكرات الموجودة (باستثناء المذكرة قيد التعديل)
    const existingTheses = theses.filter(t => t.id !== newThesis.id);

    existingTheses.forEach(thesis => {
        // فحص تضارب القاعات
        if (thesis.defense_date === newThesis.defense_date && 
            thesis.defense_time === newThesis.defense_time && 
            thesis.room === newThesis.room) {
            conflicts.hasConflict = true;
            conflicts.roomConflicts.push({
                thesis: thesis,
                message: `القاعة ${newThesis.room} محجوزة في نفس التوقيت لمذكرة: ${thesis.title.substring(0, 50)}...`
            });
        }

        // فحص تضارب الأساتذة
        if (thesis.defense_date === newThesis.defense_date && 
            thesis.defense_time === newThesis.defense_time) {
            
            const busyProfessors = [];
            
            // فحص المشرف
            if (newThesis.supervisor && 
                (thesis.supervisor === newThesis.supervisor || 
                 thesis.president === newThesis.supervisor || 
                 thesis.examiner === newThesis.supervisor)) {
                busyProfessors.push({
                    name: newThesis.supervisor,
                    role: 'المشرف',
                    busyIn: thesis.title.substring(0, 50) + '...'
                });
            }

            // فحص الرئيس
            if (newThesis.president && 
                (thesis.supervisor === newThesis.president || 
                 thesis.president === newThesis.president || 
                 thesis.examiner === newThesis.president)) {
                busyProfessors.push({
                    name: newThesis.president,
                    role: 'رئيس اللجنة',
                    busyIn: thesis.title.substring(0, 50) + '...'
                });
            }

            // فحص المناقش
            if (newThesis.examiner && 
                (thesis.supervisor === newThesis.examiner || 
                 thesis.president === newThesis.examiner || 
                 thesis.examiner === newThesis.examiner)) {
                busyProfessors.push({
                    name: newThesis.examiner,
                    role: 'العضو المناقش',
                    busyIn: thesis.title.substring(0, 50) + '...'
                });
            }

            if (busyProfessors.length > 0) {
                conflicts.hasConflict = true;
                conflicts.professorConflicts = conflicts.professorConflicts.concat(busyProfessors);
            }
        }
    });

    // اقتراح بدائل إذا وجد تضارب
    if (conflicts.hasConflict) {
        conflicts.suggestions = suggestAlternatives(newThesis, existingTheses);
    }

    return conflicts;
}

function suggestAlternatives(newThesis, existingTheses) {
    const allRooms = [
        'مدرج الوئام', 'مدرج المعرفة', 'مدرج المستقبل', 'مدرج السلام', 'مدرج الأمل',
        'القاعة 01', 'القاعة 02', 'القاعة 03', 'القاعة 20', 'القاعة 21', 'القاعة 22', 'القاعة 23'
    ];
    
    const allTimes = [
        '09 سا و00 د', '10 سا و15 د', '11 سا و30د', '13 سا و15 د', '14 سا و30 د'
    ];

    const suggestions = {
        rooms: [],
        times: []
    };

    // البحث عن القاعات المتاحة في نفس التاريخ والوقت
    const busyRooms = existingTheses
        .filter(t => t.defense_date === newThesis.defense_date && t.defense_time === newThesis.defense_time)
        .map(t => t.room);
    
    suggestions.rooms = allRooms.filter(room => !busyRooms.includes(room));

    // البحث عن التوقيتات المتاحة لنفس القاعة في نفس التاريخ
    const busyTimes = existingTheses
        .filter(t => t.defense_date === newThesis.defense_date && t.room === newThesis.room)
        .map(t => t.defense_time);
    
    suggestions.times = allTimes.filter(time => !busyTimes.includes(time));

    return suggestions;
}

function showConflictModal(conflicts, formData) {
    const modal = document.getElementById('conflict-modal');
    const content = document.getElementById('conflict-content');
    
    let html = '<div class="conflict-warning">';
    html += '<div class="conflict-icon">⚠️</div>';
    html += '<h3>تم اكتشاف تضاربات!</h3>';
    html += '</div>';

    // عرض تضاربات القاعات
    if (conflicts.roomConflicts.length > 0) {
        html += '<div class="conflict-section">';
        html += '<h4>🏛️ تضاربات القاعات:</h4>';
        html += '<ul class="conflict-list">';
        conflicts.roomConflicts.forEach(conflict => {
            html += `<li>${conflict.message}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }

    // عرض تضاربات الأساتذة
    if (conflicts.professorConflicts.length > 0) {
        html += '<div class="conflict-section">';
        html += '<h4>👨‍🏫 تضاربات الأساتذة:</h4>';
        html += '<ul class="conflict-list">';
        conflicts.professorConflicts.forEach(prof => {
            html += `<li><strong>${prof.name}</strong> (${prof.role}) مشغول في: ${prof.busyIn}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }

    // عرض الاقتراحات
    html += '<div class="conflict-section suggestions">';
    html += '<h4>💡 الاقتراحات:</h4>';
    
    if (conflicts.suggestions.rooms.length > 0) {
        html += '<div class="suggestion-group">';
        html += '<strong>القاعات المتاحة في نفس التوقيت:</strong>';
        html += '<div class="suggestion-options">';
        conflicts.suggestions.rooms.forEach(room => {
            html += `<button class="suggestion-btn" onclick="applySuggestion('room', '${room}')">${room}</button>`;
        });
        html += '</div></div>';
    } else {
        html += '<p class="no-suggestions">❌ لا توجد قاعات متاحة في هذا التوقيت</p>';
    }

    if (conflicts.suggestions.times.length > 0) {
        html += '<div class="suggestion-group">';
        html += '<strong>التوقيتات المتاحة لنفس القاعة:</strong>';
        html += '<div class="suggestion-options">';
        conflicts.suggestions.times.forEach(time => {
            html += `<button class="suggestion-btn" onclick="applySuggestion('time', '${time}')">${time}</button>`;
        });
        html += '</div></div>';
    } else {
        html += '<p class="no-suggestions">❌ لا توجد توقيتات متاحة لهذه القاعة</p>';
    }
    
    html += '</div>';

    // أزرار الإجراء
    html += '<div class="conflict-actions">';
    html += '<button class="btn-primary" onclick="forceSubmit()">💾 متابعة الحفظ رغم التضارب</button>';
    html += '<button class="btn-secondary" onclick="closeConflictModal()">❌ إلغاء</button>';
    html += '</div>';

    content.innerHTML = html;
    modal.classList.add('active');

    // حفظ البيانات مؤقتاً لاستخدامها في forceSubmit
    window.pendingThesisData = formData;
}

function applySuggestion(type, value) {
    if (type === 'room') {
        document.getElementById('room').value = value;
        showToast(`تم تغيير القاعة إلى: ${value}`, 'success');
    } else if (type === 'time') {
        document.getElementById('defense-time').value = value;
        showToast(`تم تغيير التوقيت إلى: ${value}`, 'success');
    }
    closeConflictModal();
}

function forceSubmit() {
    if (!window.pendingThesisData) return;
    
    const formData = window.pendingThesisData;
    
    // حفظ أو تحديث المذكرة مباشرة
    if (editingThesisId) {
        const index = theses.findIndex(t => t.id === editingThesisId);
        if (index !== -1) {
            theses[index] = formData;
            showToast('تم تحديث المذكرة بنجاح (مع تضارب)', 'warning');
        }
        editingThesisId = null;
    } else {
        theses.unshift(formData);
        showToast('تمت إضافة المذكرة بنجاح (مع تضارب)', 'warning');
    }

    saveData();
    updateProfessorsFromTheses();
    applyFilters(); // تحديث القائمة المفلترة لتعكس التغييرات
    updateDashboard(); // تحديث لوحة التحكم
    resetForm();
    closeConflictModal();
    showPage('theses-list');
    
    window.pendingThesisData = null;
}

function closeConflictModal() {
    const modal = document.getElementById('conflict-modal');
    modal.classList.remove('active');
    window.pendingThesisData = null;
}

function editThesis(thesisId) {
    // فحص الصلاحيات
    if (!hasPermission('edit')) {
        showToast('ليس لديك صلاحية التعديل', 'error');
        return;
    }

    editingThesisId = thesisId;
    showPage('add-thesis');
    loadThesisForEdit(thesisId);
}

function loadThesisForEdit(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (!thesis) return;

    document.getElementById('form-title').textContent = 'تعديل المذكرة';
    document.getElementById('thesis-id').value = thesis.id;
    document.getElementById('thesis-number').value = thesis.thesis_number;
    document.getElementById('thesis-title').value = thesis.title;
    document.getElementById('branch').value = thesis.branch;
    updateSpecializations();
    document.getElementById('specialization').value = thesis.specialization;
    document.getElementById('student1').value = thesis.student1;
    document.getElementById('student2').value = thesis.student2 || '';
    
    if (thesis.student2) {
        document.getElementById('student2-group').style.display = 'block';
        document.getElementById('add-student-btn').textContent = '❌ إزالة الطالب الثاني';
    }

    document.getElementById('supervisor').value = thesis.supervisor;
    document.getElementById('supervisor-rank').value = thesis.supervisor_rank;
    document.getElementById('president').value = thesis.president;
    document.getElementById('president-rank').value = thesis.president_rank;
    document.getElementById('examiner').value = thesis.examiner;
    document.getElementById('examiner-rank').value = thesis.examiner_rank;
    document.getElementById('defense-date').value = thesis.defense_date || '';
    document.getElementById('defense-time').value = thesis.defense_time || '';
    document.getElementById('room').value = thesis.room || '';
}

function resetForm() {
    document.getElementById('form-title').textContent = 'إضافة مذكرة جديدة';
    document.getElementById('thesis-form').reset();
    document.getElementById('thesis-id').value = '';
    document.getElementById('student2-group').style.display = 'none';
    document.getElementById('add-student-btn').textContent = '➕ إضافة طالب ثانٍ';
    editingThesisId = null;
}

function deleteThesis(thesisId) {
    // فحص الصلاحيات
    if (!hasPermission('delete')) {
        showToast('ليس لديك صلاحية الحذف', 'error');
        return;
    }

    if (!confirm('هل أنت متأكد من حذف هذه المذكرة؟')) {
        return;
    }

    theses = theses.filter(t => t.id !== thesisId);
    saveData();
    showToast('تم حذف المذكرة بنجاح', 'success');
    applyFilters(); // تحديث قائمة المذكرات المفلترة
    updateDashboard();
}

function deleteAllTheses() {
    if (!hasPermission('delete')) {
        showToast('ليس لديك صلاحية الحذف', 'error');
        return;
    }

    const count = theses.length;
    if (count === 0) {
        showToast('لا توجد مذكرات لحذفها', 'warning');
        return;
    }

    // التأكيد الأول
    if (!confirm(`⚠️ تحذير: سيتم حذف جميع المذكرات (${count} مذكرة)\n\nهل أنت متأكد من المتابعة؟`)) {
        return;
    }

    // التأكيد الثاني - تحذير نهائي
    if (!confirm(`❌ تحذير نهائي!\n\nسيتم حذف ${count} مذكرة نهائياً ولا يمكن التراجع عن هذا الإجراء.\n\nهل تريد حذف كل شيء؟`)) {
        return;
    }

    theses = [];
    saveData();
    showToast(`تم حذف جميع المذكرات (${count}) بنجاح`, 'success');
    applyFilters();
    updateDashboard();
}

function toggleStudent2() {
    const student2Group = document.getElementById('student2-group');
    const btn = document.getElementById('add-student-btn');
    
    if (student2Group.style.display === 'none') {
        student2Group.style.display = 'block';
        btn.textContent = '❌ إزالة الطالب الثاني';
    } else {
        student2Group.style.display = 'none';
        document.getElementById('student2').value = '';
        btn.textContent = '➕ إضافة طالب ثانٍ';
    }
}

function updateSpecializations() {
    const branch = document.getElementById('branch').value;
    const specializationSelect = document.getElementById('specialization');
    
    specializationSelect.innerHTML = '<option value="">اختر التخصص</option>';
    
    if (branch && SPECIALIZATIONS[branch]) {
        SPECIALIZATIONS[branch].forEach(spec => {
            const option = document.createElement('option');
            option.value = spec;
            option.textContent = spec;
            specializationSelect.appendChild(option);
        });
    }
}

// ================================================
// البحث التلقائي وملء البيانات
// ================================================

let searchTimeout;

function searchAndFillThesis() {
    // إذا كنا في وضع التعديل، لا نقوم بالبحث التلقائي
    if (editingThesisId) {
        return;
    }

    // إلغاء البحث السابق للتقليل من عدد العمليات
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const thesisNumber = document.getElementById('thesis-number')?.value.trim();
        const student1 = document.getElementById('student1')?.value.trim();
        const student2 = document.getElementById('student2')?.value.trim();

        // البحث عن مذكرة مطابقة
        let foundThesis = null;

        if (thesisNumber && thesisNumber.length >= 3) {
            foundThesis = theses.find(t => t.thesis_number === thesisNumber);
        }
        
        if (!foundThesis && student1 && student1.length >= 5) {
            foundThesis = theses.find(t => t.student1 === student1);
        }
        
        if (!foundThesis && student2 && student2.length >= 5) {
            foundThesis = theses.find(t => t.student2 === student2);
        }

        // إذا وجدنا مذكرة مطابقة، نملأ الحقول
        if (foundThesis) {
            fillThesisData(foundThesis);
        }
    }, 500); // الانتظار 500ms بعد آخر إدخال
}

function fillThesisData(thesis) {
    // ملء جميع الحقول من البيانات الموجودة
    document.getElementById('thesis-number').value = thesis.thesis_number;
    document.getElementById('thesis-title').value = thesis.title;
    document.getElementById('branch').value = thesis.branch;
    
    // تحديث التخصصات بناءً على الشعبة
    updateSpecializations();
    
    // بعد تحديث القائمة، اختيار التخصص
    setTimeout(() => {
        document.getElementById('specialization').value = thesis.specialization;
    }, 100);
    
    document.getElementById('student1').value = thesis.student1;
    
    // إظهار الطالب الثاني إذا كان موجوداً
    if (thesis.student2) {
        const student2Group = document.getElementById('student2-group');
        const btn = document.getElementById('add-student-btn');
        if (student2Group.style.display === 'none') {
            student2Group.style.display = 'block';
            btn.textContent = '❌ إزالة الطالب الثاني';
        }
        document.getElementById('student2').value = thesis.student2;
    }
    
    document.getElementById('supervisor').value = thesis.supervisor;
    document.getElementById('supervisor-rank').value = thesis.supervisor_rank;
    document.getElementById('president').value = thesis.president;
    document.getElementById('president-rank').value = thesis.president_rank;
    document.getElementById('examiner').value = thesis.examiner;
    document.getElementById('examiner-rank').value = thesis.examiner_rank;
    document.getElementById('defense-date').value = thesis.defense_date || '';
    document.getElementById('defense-time').value = thesis.defense_time || '';
    document.getElementById('room').value = thesis.room || '';

    // إظهار رسالة للمستخدم
    showToast('تم العثور على بيانات مطابقة وملؤها تلقائياً', 'info');
}

// ================================================
// صفحة الأساتذة
// ================================================

function updateProfessorsPage() {
    const container = document.getElementById('professors-table-container');
    const professors = getProfessorsStats();

    if (professors.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👨‍🏫</div><h3>لا يوجد أساتذة</h3><p>سيظهر الأساتذة تلقائياً بعد إضافة المذكرات</p></div>';
        return;
    }

    let html = '<div class="table-container"><table>';
    html += '<thead><tr>';
    html += '<th>الاسم</th>';
    html += '<th>عدد الإشرافات</th>';
    html += '<th>رئاسات الجلسات</th>';
    html += '<th>عضويات المناقشة</th>';
    html += '<th>المجموع</th>';
    html += '</tr></thead><tbody>';

    professors.forEach(prof => {
        html += '<tr>';
        html += `<td><strong>${prof.name}</strong></td>`;
        html += `<td>${prof.supervisions}</td>`;
        html += `<td>${prof.presidencies}</td>`;
        html += `<td>${prof.examinations}</td>`;
        html += `<td><strong>${prof.total}</strong></td>`;
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function getProfessorsStats() {
    const stats = {};

    theses.forEach(thesis => {
        // الإشراف
        if (thesis.supervisor) {
            if (!stats[thesis.supervisor]) {
                stats[thesis.supervisor] = { supervisions: 0, presidencies: 0, examinations: 0 };
            }
            stats[thesis.supervisor].supervisions++;
        }

        // الرئاسة
        if (thesis.president) {
            if (!stats[thesis.president]) {
                stats[thesis.president] = { supervisions: 0, presidencies: 0, examinations: 0 };
            }
            stats[thesis.president].presidencies++;
        }

        // العضوية
        if (thesis.examiner) {
            if (!stats[thesis.examiner]) {
                stats[thesis.examiner] = { supervisions: 0, presidencies: 0, examinations: 0 };
            }
            stats[thesis.examiner].examinations++;
        }
    });

    return Object.keys(stats).map(name => ({
        name,
        supervisions: stats[name].supervisions,
        presidencies: stats[name].presidencies,
        examinations: stats[name].examinations,
        total: stats[name].supervisions + stats[name].presidencies + stats[name].examinations
    })).sort((a, b) => b.total - a.total);
}

function updateProfessorsFromTheses() {
    const professors = new Set();
    theses.forEach(thesis => {
        if (thesis.supervisor) professors.add(thesis.supervisor);
        if (thesis.president) professors.add(thesis.president);
        if (thesis.examiner) professors.add(thesis.examiner);
    });
    saveProfessors([...professors]);
    loadProfessorsList();
}

function loadProfessorsList() {
    const professors = loadProfessors();
    const datalist = document.getElementById('professors-list');
    if (datalist) {
        datalist.innerHTML = professors.map(prof => `<option value="${prof}">`).join('');
    }
}

// ================================================
// صفحة الإحصائيات
// ================================================

// مخازن الرسوم البيانية
let statCharts = {};

function destroyStatCharts() {
    Object.values(statCharts).forEach(c => { if (c) c.destroy(); });
    statCharts = {};
}

function updateStatisticsPage() {
    const data = getVisibleThesesForUser();
    const container = document.getElementById('statistics-table-container');
    const cardsEl   = document.getElementById('stats-summary-cards');

    destroyStatCharts();

    if (data.length === 0) {
        if (cardsEl) cardsEl.innerHTML = '';
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><h3>لا توجد إحصائيات</h3><p>أضف مذكرات لعرض الإحصائيات</p></div>';
        return;
    }

    const stats = getProfessorsStats();

    // --- بطاقات الملخص ---
    if (cardsEl) {
        cardsEl.innerHTML = `
            <div class="stat-card primary">
                <div class="stat-icon">📋</div>
                <div class="stat-content"><h3>${data.length}</h3><p>إجمالي المذكرات</p></div>
            </div>
            <div class="stat-card success">
                <div class="stat-icon">👨‍🏫</div>
                <div class="stat-content"><h3>${stats.length}</h3><p>عدد الأساتذة</p></div>
            </div>
            <div class="stat-card info">
                <div class="stat-icon">🎖️</div>
                <div class="stat-content"><h3>${stats.reduce((s, p) => s + p.total, 0)}</h3><p>إجمالي المشاركات</p></div>
            </div>
            <div class="stat-card warning">
                <div class="stat-icon">🏆</div>
                <div class="stat-content"><h3 style="font-size:1.2rem">${stats[0]?.name || '-'}</h3><p>الأكثر مشاركة</p></div>
            </div>
        `;
    }

    const chartDefaults = {
        font: { family: "'Cairo', sans-serif" }
    };

    if (typeof Chart === 'undefined') {
        // Chart.js لم يُحمَّل — الجدول يظهر فقط
        return;
    }

    Chart.defaults.font.family = "'Cairo', sans-serif";

    // --- رسم 1: الشعب (Doughnut) ---
    const ctxBranch = document.getElementById('chart-branch')?.getContext('2d');
    if (ctxBranch) {
        const branchLabels = BRANCHES;
        const branchData   = branchLabels.map(b => data.filter(t => t.branch === b).length);
        statCharts.branch  = new Chart(ctxBranch, {
            type: 'doughnut',
            data: {
                labels: branchLabels,
                datasets: [{
                    data: branchData,
                    backgroundColor: ['#1B5E20', '#1565C0', '#E65100'],
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 18, font: { size: 13 }, usePointStyle: true }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.label}: ${ctx.parsed} مذكرة`
                        }
                    }
                }
            }
        });
    }

    // --- رسم 2: التخصصات (Bar عمودي) ---
    const ctxSpec = document.getElementById('chart-spec')?.getContext('2d');
    if (ctxSpec) {
        const specLabels = ALL_SPECIALIZATIONS;
        const specData   = specLabels.map(s => data.filter(t => t.specialization === s).length);
        statCharts.spec  = new Chart(ctxSpec, {
            type: 'bar',
            data: {
                labels: specLabels,
                datasets: [{
                    label: 'عدد المذكرات',
                    data: specData,
                    backgroundColor: ['#1B5E20', '#2E7D32', '#1565C0', '#E65100'],
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: ctx => ` ${ctx.parsed.y} مذكرة` }
                    }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f0f0f0' } },
                    x: { ticks: { font: { size: 11 } }, grid: { display: false } }
                }
            }
        });
    }

    // --- رسم 3: أعلى 10 أساتذة (Bar أفقي) ---
    const ctxProf = document.getElementById('chart-professors')?.getContext('2d');
    if (ctxProf) {
        statCharts.professors = new Chart(ctxProf, {
            type: 'bar',
            data: {
                labels: top10.map(p => p.name),
                datasets: [{
                    label: 'إجمالي المشاركات',
                    data: top10.map(p => p.total),
                    backgroundColor: top10.map((_, i) =>
                        `rgba(27, 94, 32, ${1 - i * 0.07})`),
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: { label: ctx => ` ${ctx.parsed.x} مشاركة` }
                    }
                },
                scales: {
                    x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f0f0f0' } },
                    y: { ticks: { font: { size: 12 } }, grid: { display: false } }
                }
            }
        });
    }

    // --- رسم 4: تفصيل أدوار الأساتذة (Stacked Bar أفقي) ---
    const ctxRoles = document.getElementById('chart-roles')?.getContext('2d');
    if (ctxRoles) {
        statCharts.roles = new Chart(ctxRoles, {
            type: 'bar',
            data: {
                labels: top10.map(p => p.name),
                datasets: [
                    {
                        label: 'إشرافات',
                        data: top10.map(p => p.supervisions),
                        backgroundColor: '#1B5E20',
                        borderRadius: 4,
                        borderWidth: 0
                    },
                    {
                        label: 'رئاسات',
                        data: top10.map(p => p.presidencies),
                        backgroundColor: '#1565C0',
                        borderRadius: 4,
                        borderWidth: 0
                    },
                    {
                        label: 'عضويات',
                        data: top10.map(p => p.examinations),
                        backgroundColor: '#E65100',
                        borderRadius: 4,
                        borderWidth: 0
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { padding: 18, font: { size: 13 }, usePointStyle: true }
                    }
                },
                scales: {
                    x: { stacked: true, beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f0f0f0' } },
                    y: { stacked: true, ticks: { font: { size: 12 } }, grid: { display: false } }
                }
            }
        });
    }

    // --- الجدول التفصيلي (يُرسم أولاً دائماً) ---
    let html = '';
    ALL_SPECIALIZATIONS.forEach(spec => {
        const specTheses = data.filter(t => t.specialization === spec);
        if (specTheses.length === 0) return;

        html += `<h3 class="stats-section-title">📚 ${spec} <span class="badge-count">${specTheses.length} مذكرة</span></h3>`;
        html += '<div class="table-container" style="margin-bottom:24px;"><table>';
        html += '<thead><tr><th>الأستاذ</th><th>الإشرافات</th><th>الرئاسات</th><th>العضويات</th><th>المجموع</th></tr></thead><tbody>';

        getStatsBySpecializationFromData(data, spec).forEach(prof => {
            html += `<tr>
                <td>${prof.name}</td>
                <td><span class="role-pill sup">${prof.supervisions}</span></td>
                <td><span class="role-pill pre">${prof.presidencies}</span></td>
                <td><span class="role-pill exa">${prof.examinations}</span></td>
                <td><strong>${prof.total}</strong></td>
            </tr>`;
        });

        html += '</tbody></table></div>';
    });
    container.innerHTML = html || '<div class="empty-state"><div class="empty-state-icon">📊</div><h3>لا توجد بيانات كافية</h3></div>';

    // --- الرسوم البيانية (محمية من أخطاء CDN) ---
    if (typeof Chart === 'undefined') return;

    try {
        Chart.defaults.font.family = "'Cairo', sans-serif";
    } catch(e) { return; }

    const top10 = stats.slice(0, 10);
}

function getStatsBySpecialization(specialization) {
    return getStatsBySpecializationFromData(theses, specialization);
}

function getStatsBySpecializationFromData(data, specialization) {
    const stats = {};
    const specTheses = data.filter(t => t.specialization === specialization);

    specTheses.forEach(thesis => {
        if (thesis.supervisor) {
            if (!stats[thesis.supervisor]) stats[thesis.supervisor] = { supervisions: 0, presidencies: 0, examinations: 0 };
            stats[thesis.supervisor].supervisions++;
        }
        if (thesis.president) {
            if (!stats[thesis.president]) stats[thesis.president] = { supervisions: 0, presidencies: 0, examinations: 0 };
            stats[thesis.president].presidencies++;
        }
        if (thesis.examiner) {
            if (!stats[thesis.examiner]) stats[thesis.examiner] = { supervisions: 0, presidencies: 0, examinations: 0 };
            stats[thesis.examiner].examinations++;
        }
    });

    return Object.keys(stats).map(name => ({
        name,
        supervisions: stats[name].supervisions,
        presidencies: stats[name].presidencies,
        examinations: stats[name].examinations,
        total: stats[name].supervisions + stats[name].presidencies + stats[name].examinations
    })).sort((a, b) => b.total - a.total);
}

// ================================================
// البحث عن مناقشات أستاذ
// ================================================

function searchProfessorTheses() {
    const searchInput = document.getElementById('professor-search-input');
    const resultsContainer = document.getElementById('professor-search-results');
    const searchTerm = searchInput.value.trim();

    if (!searchTerm || searchTerm.length < 3) {
        resultsContainer.innerHTML = '';
        return;
    }

    // البحث عن جميع المذكرات التي شارك فيها الأستاذ
    const professorTheses = theses.filter(thesis => {
        const supervisor = thesis.supervisor?.toLowerCase() || '';
        const president = thesis.president?.toLowerCase() || '';
        const examiner = thesis.examiner?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return supervisor.includes(search) || 
               president.includes(search) || 
               examiner.includes(search);
    });

    if (professorTheses.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <div class="no-results-icon">🔍</div>
                <h4>لا توجد نتائج</h4>
                <p>لم يتم العثور على أستاذ بهذا الاسم</p>
            </div>
        `;
        return;
    }

    // جمع إحصائيات الأستاذ
    const professorStats = {
        supervisions: 0,
        presidencies: 0,
        examinations: 0,
        branches: new Set(),
        specializations: new Set()
    };

    professorTheses.forEach(thesis => {
        const search = searchTerm.toLowerCase();
        if (thesis.supervisor?.toLowerCase().includes(search)) professorStats.supervisions++;
        if (thesis.president?.toLowerCase().includes(search)) professorStats.presidencies++;
        if (thesis.examiner?.toLowerCase().includes(search)) professorStats.examinations++;
        professorStats.branches.add(thesis.branch);
        professorStats.specializations.add(thesis.specialization);
    });

    const total = professorStats.supervisions + professorStats.presidencies + professorStats.examinations;

    // عرض النتائج
    let html = '<div class="professor-results-card">';
    
    // رأس البطاقة
    html += '<div class="professor-results-header">';
    html += `<div class="professor-name">👨‍🏫 ${searchTerm}</div>`;
    html += `<div class="professor-count">${professorTheses.length} مذكرة</div>`;
    html += '</div>';

    // إحصائيات موجزة
    html += '<div class="professor-stats-summary">';
    html += `<div class="stat-item"><span class="stat-label">إشرافات:</span><span class="stat-value">${professorStats.supervisions}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">رئاسات:</span><span class="stat-value">${professorStats.presidencies}</span></div>`;
    html += `<div class="stat-item"><span class="stat-label">عضويات:</span><span class="stat-value">${professorStats.examinations}</span></div>`;
    html += `<div class="stat-item total"><span class="stat-label">المجموع:</span><span class="stat-value">${total}</span></div>`;
    html += '</div>';

    // التخصصات والشعب
    html += '<div class="professor-fields">';
    html += `<div class="field-item">📚 الشعب: ${Array.from(professorStats.branches).join('، ')}</div>`;
    html += `<div class="field-item">🎓 التخصصات: ${Array.from(professorStats.specializations).join('، ')}</div>`;
    html += '</div>';

    // جدول المذكرات
    html += '<div class="professor-theses-table">';
    html += '<h4>📋 جميع المذكرات:</h4>';
    html += '<div class="table-container">';
    html += '<table>';
    html += '<thead><tr>';
    html += '<th style="width: 80px;">رقم المذكرة</th>';
    html += '<th>موضوع المذكرة</th>';
    html += '<th style="width: 150px;">الطالب</th>';
    html += '<th style="width: 120px;">الصفة</th>';
    html += '<th style="width: 150px;">التخصص</th>';
    html += '<th style="width: 120px;">التاريخ</th>';
    html += '</tr></thead><tbody>';

    professorTheses.forEach(thesis => {
        const search = searchTerm.toLowerCase();
        let role = [];
        if (thesis.supervisor?.toLowerCase().includes(search)) role.push('مشرف');
        if (thesis.president?.toLowerCase().includes(search)) role.push('رئيس');
        if (thesis.examiner?.toLowerCase().includes(search)) role.push('مناقش');

        html += '<tr>';
        html += `<td><strong>${thesis.thesis_number}</strong></td>`;
        html += `<td class="thesis-title">${thesis.title}</td>`;
        html += `<td>${thesis.student1}${thesis.student2 ? ' و ' + thesis.student2 : ''}</td>`;
        html += `<td><span class="role-badge">${role.join(' و ')}</span></td>`;
        html += `<td>${thesis.specialization}</td>`;
        html += `<td>${thesis.defense_date || '-'}</td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';
    html += '</div></div>';

    // أزرار الإجراءات
    html += '<div class="professor-actions">';
    html += `<button onclick="exportProfessorTheses('${searchTerm}')" class="btn btn-primary">📊 تصدير إلى Excel</button>`;
    html += `<button onclick="printProfessorReport('${searchTerm}')" class="btn btn-secondary">🖨️ طباعة التقرير</button>`;
    html += '</div>';

    html += '</div>';

    resultsContainer.innerHTML = html;
}

function exportProfessorTheses(professorName) {
    const searchTerm = professorName.toLowerCase();
    const professorTheses = theses.filter(thesis => {
        const supervisor = thesis.supervisor?.toLowerCase() || '';
        const president = thesis.president?.toLowerCase() || '';
        const examiner = thesis.examiner?.toLowerCase() || '';

        return supervisor.includes(searchTerm) || 
               president.includes(searchTerm) || 
               examiner.includes(searchTerm);
    });

    if (professorTheses.length === 0) {
        showToast('لا توجد مذكرات لهذا الأستاذ', 'error');
        return;
    }

    const wb = XLSX.utils.book_new();

    // إعداد البيانات
    const data = professorTheses.map(thesis => {
        const search = searchTerm;
        let role = [];
        if (thesis.supervisor?.toLowerCase().includes(search)) role.push('مشرف');
        if (thesis.president?.toLowerCase().includes(search)) role.push('رئيس');
        if (thesis.examiner?.toLowerCase().includes(search)) role.push('مناقش');

        return {
            'رقم المذكرة': thesis.thesis_number,
            'موضوع المذكرة': thesis.title,
            'الطالب الأول': thesis.student1,
            'الطالب الثاني': thesis.student2 || '',
            'الصفة': role.join(' و '),
            'الشعبة': thesis.branch,
            'التخصص': thesis.specialization,
            'تاريخ المناقشة': thesis.defense_date || '',
            'التوقيت': thesis.defense_time || '',
            'القاعة': thesis.room || ''
        };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    
    // تعيين اتجاه RTL
    ws['!views'] = [{ rightToLeft: true }];

    XLSX.utils.book_append_sheet(wb, ws, 'مذكرات الأستاذ');

    // تنزيل الملف
    const fileName = `مذكرات_${professorName}_${new Date().toLocaleDateString('ar')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    showToast('تم تصدير البيانات بنجاح', 'success');
}

function printProfessorReport(professorName) {
    const searchTerm = professorName.toLowerCase();
    const professorTheses = theses.filter(thesis => {
        const supervisor = thesis.supervisor?.toLowerCase() || '';
        const president = thesis.president?.toLowerCase() || '';
        const examiner = thesis.examiner?.toLowerCase() || '';

        return supervisor.includes(searchTerm) || 
               president.includes(searchTerm) || 
               examiner.includes(searchTerm);
    });

    if (professorTheses.length === 0) {
        showToast('لا توجد مذكرات لهذا الأستاذ', 'error');
        return;
    }

    // جمع الإحصائيات
    let supervisions = 0, presidencies = 0, examinations = 0;
    professorTheses.forEach(thesis => {
        if (thesis.supervisor?.toLowerCase().includes(searchTerm)) supervisions++;
        if (thesis.president?.toLowerCase().includes(searchTerm)) presidencies++;
        if (thesis.examiner?.toLowerCase().includes(searchTerm)) examinations++;
    });

    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write('<html><head><title>تقرير مناقشات الأستاذ</title>');
    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 30px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1B5E20; padding-bottom: 20px; }
        .header h1 { color: #1B5E20; font-size: 2rem; margin-bottom: 10px; }
        .header h2 { color: #333; font-size: 1.5rem; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
        .stat-box { background: #f5f5f5; padding: 15px; text-align: center; border-radius: 8px; border-right: 4px solid #1B5E20; }
        .stat-box .label { font-size: 0.9rem; color: #666; margin-bottom: 5px; }
        .stat-box .value { font-size: 2rem; font-weight: 700; color: #1B5E20; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #1B5E20; color: white; padding: 12px; text-align: center; font-weight: 600; }
        td { padding: 10px; border: 1px solid #ddd; text-align: center; }
        tr:nth-child(even) { background: #f9f9f9; }
        .thesis-title { text-align: right; font-weight: 500; }
        .role-badge { background: #1B5E20; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; }
        @media print { body { padding: 20px; } }
    `);
    printWindow.document.write('</style></head><body>');
    
    // الرأس
    printWindow.document.write('<div class="header">');
    printWindow.document.write('<h1>جامعة ابن خلدون - تيارت</h1>');
    printWindow.document.write('<h2>كلية الآداب واللغات - قسم اللغة العربية وآدابها</h2>');
    printWindow.document.write(`<h2 style="margin-top: 20px; color: #1B5E20;">تقرير مناقشات الأستاذ: ${professorName}</h2>`);
    printWindow.document.write('</div>');

    // الإحصائيات
    printWindow.document.write('<div class="stats">');
    printWindow.document.write(`<div class="stat-box"><div class="label">الإشرافات</div><div class="value">${supervisions}</div></div>`);
    printWindow.document.write(`<div class="stat-box"><div class="label">الرئاسات</div><div class="value">${presidencies}</div></div>`);
    printWindow.document.write(`<div class="stat-box"><div class="label">العضويات</div><div class="value">${examinations}</div></div>`);
    printWindow.document.write(`<div class="stat-box"><div class="label">المجموع</div><div class="value">${supervisions + presidencies + examinations}</div></div>`);
    printWindow.document.write('</div>');

    // الجدول
    printWindow.document.write('<table>');
    printWindow.document.write('<thead><tr>');
    printWindow.document.write('<th>رقم المذكرة</th><th>موضوع المذكرة</th><th>الطالب</th><th>الصفة</th><th>التخصص</th><th>التاريخ</th>');
    printWindow.document.write('</tr></thead><tbody>');

    professorTheses.forEach(thesis => {
        let role = [];
        if (thesis.supervisor?.toLowerCase().includes(searchTerm)) role.push('مشرف');
        if (thesis.president?.toLowerCase().includes(searchTerm)) role.push('رئيس');
        if (thesis.examiner?.toLowerCase().includes(searchTerm)) role.push('مناقش');

        printWindow.document.write('<tr>');
        printWindow.document.write(`<td>${thesis.thesis_number}</td>`);
        printWindow.document.write(`<td class="thesis-title">${thesis.title}</td>`);
        printWindow.document.write(`<td>${thesis.student1}${thesis.student2 ? ' و ' + thesis.student2 : ''}</td>`);
        printWindow.document.write(`<td><span class="role-badge">${role.join(' و ')}</span></td>`);
        printWindow.document.write(`<td>${thesis.specialization}</td>`);
        printWindow.document.write(`<td>${thesis.defense_date || '-'}</td>`);
        printWindow.document.write('</tr>');
    });

    printWindow.document.write('</tbody></table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);

    showToast('جاري الطباعة...', 'info');
}

// ================================================
// تصدير إلى Excel
// ================================================

function exportToExcel() {
    // فحص الصلاحيات
    if (!hasPermission('export')) {
        showToast('ليس لديك صلاحية التصدير', 'error');
        return;
    }

    if (theses.length === 0) {
        showToast('لا توجد بيانات للتصدير', 'error');
        return;
    }

    const wb = XLSX.utils.book_new();

    // ورقة المذكرات
    const thesesData = theses.map(t => ({
        'رقم المذكرة': t.thesis_number,
        'موضوع المذكرة': t.title,
        'الطالب الأول': t.student1,
        'الطالب الثاني': t.student2 || '',
        'الشعبة': t.branch,
        'التخصص': t.specialization,
        'الأستاذ المشرف': t.supervisor,
        'رتبة المشرف': t.supervisor_rank,
        'رئيس اللجنة': t.president,
        'رتبة الرئيس': t.president_rank,
        'العضو المناقش': t.examiner,
        'رتبة العضو': t.examiner_rank,
        'تاريخ المناقشة': t.defense_date || '',
        'التوقيت': t.defense_time || '',
        'القاعة': t.room || ''
    }));

    const ws1 = XLSX.utils.json_to_sheet(thesesData);
    ws1['!views'] = [{rightToLeft: true}];
    XLSX.utils.book_append_sheet(wb, ws1, 'المذكرات');

    // ورقة الإحصائيات
    const stats = getProfessorsStats();
    const statsData = stats.map(s => ({
        'الأستاذ': s.name,
        'الإشرافات': s.supervisions,
        'الرئاسات': s.presidencies,
        'العضويات': s.examinations,
        'المجموع': s.total
    }));

    const ws2 = XLSX.utils.json_to_sheet(statsData);
    ws2['!views'] = [{rightToLeft: true}];
    XLSX.utils.book_append_sheet(wb, ws2, 'الإحصائيات');

    // حفظ الملف
    XLSX.writeFile(wb, `مذكرات_الماستر_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('تم تصدير البيانات بنجاح', 'success');
}

function exportStatistics() {
    exportToExcel();
}

// ================================================
// الاستيراد والتصدير
// ================================================

// تنزيل نموذج Excel فارغ
function downloadExcelTemplate() {
    const wb = XLSX.utils.book_new();
    
    // إنشاء نموذج بصف واحد كمثال
    const templateData = [{
        'رقم المذكرة': '202600001',
        'موضوع المذكرة': 'مثال: الاستعارة في الشعر الجاهلي',
        'الطالب الأول': 'أحمد بن محمد',
        'الطالب الثاني': 'فاطمة بنت علي',
        'الشعبة': 'دراسات لغوية',
        'التخصص': 'لسانيات الخطاب',
        'الأستاذ المشرف': 'د. محمد الطاهر',
        'رتبة المشرف': 'أستاذ محاضر أ',
        'رئيس اللجنة': 'د. أحمد العربي',
        'رتبة الرئيس': 'أستاذ التعليم العالي',
        'العضو المناقش': 'د. خديجة الزهراء',
        'رتبة العضو': 'أستاذ محاضر ب',
        'تاريخ المناقشة': '2026-06-15',
        'التوقيت': '09:00',
        'القاعة': 'قاعة المحاضرات 02'
    }];

    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // تعيين عرض الأعمدة
    const colWidths = [
        {wch: 15}, {wch: 50}, {wch: 25}, {wch: 25},
        {wch: 20}, {wch: 25}, {wch: 25}, {wch: 20},
        {wch: 25}, {wch: 20}, {wch: 25}, {wch: 20},
        {wch: 15}, {wch: 10}, {wch: 20}
    ];
    ws['!cols'] = colWidths;

    // تعيين اتجاه RTL (من اليمين لليسار) للورقة
    ws['!views'] = [{rightToLeft: true}];

    XLSX.utils.book_append_sheet(wb, ws, 'نموذج المذكرات');

    // إضافة ورقة تعليمات
    const instructionsData = [
        {'التعليمات': 'نموذج استيراد مذكرات الماستر - جامعة ابن خلدون تيارت'},
        {'التعليمات': ''},
        {'التعليمات': 'الأعمدة الإلزامية (يجب ملؤها):'},
        {'التعليمات': '- موضوع المذكرة'},
        {'التعليمات': '- الطالب الأول'},
        {'التعليمات': '- الشعبة'},
        {'التعليمات': '- التخصص'},
        {'التعليمات': '- الأستاذ المشرف'},
        {'التعليمات': '- رئيس اللجنة'},
        {'التعليمات': '- العضو المناقش'},
        {'التعليمات': ''},
        {'التعليمات': 'الشعب المتاحة:'},
        {'التعليمات': '- دراسات لغوية'},
        {'التعليمات': '- دراسات أدبية'},
        {'التعليمات': '- دراسات نقدية'},
        {'التعليمات': ''},
        {'التعليمات': 'التخصصات المتاحة:'},
        {'التعليمات': '- لسانيات الخطاب'},
        {'التعليمات': '- تعليمية اللغات'},
        {'التعليمات': '- أدب حديث ومعاصر'},
        {'التعليمات': '- نقد حديث ومعاصر'},
        {'التعليمات': ''},
        {'التعليمات': 'الرتب الأكاديمية:'},
        {'التعليمات': '- أستاذ التعليم العالي'},
        {'التعليمات': '- أستاذ محاضر أ'},
        {'التعليمات': '- أستاذ محاضر ب'},
        {'التعليمات': '- أستاذ مساعد أ'},
        {'التعليمات': '- أستاذ مساعد ب'},
    ];

    const ws2 = XLSX.utils.json_to_sheet(instructionsData);
    ws2['!cols'] = [{wch: 60}];
    ws2['!views'] = [{rightToLeft: true}];
    XLSX.utils.book_append_sheet(wb, ws2, 'التعليمات');

    // حفظ الملف
    XLSX.writeFile(wb, `نموذج_مذكرات_الماستر_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('تم تحميل النموذج بنجاح! افتح الملف وأضف البيانات', 'success');
}

function importExcel() {
    // فحص الصلاحيات
    if (!hasPermission('import')) {
        showToast('ليس لديك صلاحية الاستيراد', 'error');
        return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = handleFileUpload;
    input.click();
}

// معالجة ملف Excel المُرفَّع من زر لوحة التحكم
function handleDashboardExcelUpload(e) {
    if (!hasPermission('import')) {
        showToast('ليس لديك صلاحية الاستيراد', 'error');
        // إعادة تعيين قيمة الحقل حتى يمكن اختيار نفس الملف مجدداً
        e.target.value = '';
        return;
    }
    handleFileUpload(e);
    e.target.value = '';
}


function importExcelInForm() {
    // فحص الصلاحيات
    if (!hasPermission('import')) {
        showToast('ليس لديك صلاحية الاستيراد', 'error');
        return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = function(e) {
        handleFileUpload(e, true); // المعامل الثاني يشير إلى أننا في صفحة النموذج
    };
    input.click();
}

function handleFileUpload(e, fromForm = false) {
    const file = e.target.files[0];
    if (!file) return;

    // إظهار رسالة تحميل
    showToast('جاري قراءة الملف...', 'info');

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            if (jsonData.length === 0) {
                showToast('الملف فارغ أو لا يحتوي على بيانات صحيحة', 'error');
                return;
            }

            // تخزين البيانات للمعاينة
            fromFormImport = fromForm;
            showPreviewModal(jsonData);
        } catch (error) {
            showToast('خطأ في قراءة الملف. تأكد من صيغة الملف', 'error');
            console.error(error);
        }
    };
    reader.readAsArrayBuffer(file);
}

// معاينة البيانات قبل الاستيراد
function showPreviewModal(data) {
    previewData = data;
    
    // تحليل البيانات
    const analysis = analyzeImportData(data);
    
    // عرض الإحصائيات
    document.getElementById('preview-total').textContent = analysis.total;
    document.getElementById('preview-valid').textContent = analysis.valid;
    document.getElementById('preview-invalid').textContent = analysis.invalid;

    // عرض الجدول
    displayPreviewTable(analysis.processedData);

    // تفعيل/تعطيل زر التأكيد
    const confirmBtn = document.getElementById('confirm-import-btn');
    if (analysis.valid === 0) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = '❌ لا توجد بيانات صحيحة للاستيراد';
    } else {
        confirmBtn.disabled = false;
        confirmBtn.textContent = `✅ استيراد ${analysis.valid} مذكرة`;
    }

    // إظهار النافذة
    document.getElementById('preview-modal').classList.add('active');
}

// تحليل البيانات المستوردة
function analyzeImportData(data) {
    const processedData = [];
    let valid = 0;
    let invalid = 0;

    data.forEach((row, index) => {
        const errors = [];
        
        // التحقق من الحقول الإلزامية
        if (!row['موضوع المذكرة'] || row['موضوع المذكرة'].toString().trim().length < 10) {
            errors.push('موضوع المذكرة مفقود أو قصير جداً (أقل من 10 أحرف)');
        }
        if (!row['الطالب الأول'] || row['الطالب الأول'].toString().trim() === '') {
            errors.push('اسم الطالب الأول مفقود');
        }
        if (!row['الشعبة'] || !BRANCHES.includes(row['الشعبة'])) {
            errors.push('الشعبة مفقودة أو غير صحيحة');
        }
        if (!row['التخصص'] || !ALL_SPECIALIZATIONS.includes(row['التخصص'])) {
            errors.push('التخصص مفقود أو غير صحيح');
        }
        if (!row['الأستاذ المشرف'] || row['الأستاذ المشرف'].toString().trim() === '') {
            errors.push('اسم الأستاذ المشرف مفقود');
        }
        if (!row['رئيس اللجنة'] || row['رئيس اللجنة'].toString().trim() === '') {
            errors.push('اسم رئيس اللجنة مفقود');
        }
        if (!row['العضو المناقش'] || row['العضو المناقش'].toString().trim() === '') {
            errors.push('اسم العضو المناقش مفقود');
        }

        // التحقق من عدم تكرار الأستاذ في نفس اللجنة
        const supervisor = row['الأستاذ المشرف']?.toString().trim();
        const president = row['رئيس اللجنة']?.toString().trim();
        const examiner = row['العضو المناقش']?.toString().trim();
        
        if (supervisor && president && supervisor === president) {
            errors.push('المشرف ورئيس اللجنة لا يمكن أن يكونا نفس الشخص');
        }
        if (supervisor && examiner && supervisor === examiner) {
            errors.push('المشرف والعضو المناقش لا يمكن أن يكونا نفس الشخص');
        }
        if (president && examiner && president === examiner) {
            errors.push('رئيس اللجنة والعضو المناقش لا يمكن أن يكونا نفس الشخص');
        }

        // التحقق من التكرار في قاعدة البيانات
        const thesisNumber = row['رقم المذكرة']?.toString().trim();
        const title = row['موضوع المذكرة']?.toString().trim();
        const student = row['الطالب الأول']?.toString().trim();
        
        const isDuplicate = theses.some(t => 
            (thesisNumber && t.thesis_number === thesisNumber) ||
            (title && student && t.title === title && t.student1 === student)
        );

        if (isDuplicate) {
            errors.push('مذكرة مكررة (موجودة مسبقاً)');
        }

        processedData.push({
            rowNumber: index + 2, // +2 لأن الصف الأول هو العنوان و index يبدأ من 0
            data: row,
            isValid: errors.length === 0 && !isDuplicate,
            errors: errors
        });

        if (errors.length === 0 && !isDuplicate) {
            valid++;
        } else {
            invalid++;
        }
    });

    return {
        total: data.length,
        valid: valid,
        invalid: invalid,
        processedData: processedData
    };
}

// عرض جدول المعاينة
function displayPreviewTable(processedData) {
    const container = document.getElementById('preview-table-container');
    
    let html = '<div class="table-container"><table>';
    html += '<thead><tr>';
    html += '<th style="width: 50px;">الصف</th>';
    html += '<th>موضوع المذكرة</th>';
    html += '<th>الطالب</th>';
    html += '<th>التخصص</th>';
    html += '<th style="width: 80px;">الحالة</th>';
    html += '<th>الملاحظات</th>';
    html += '</tr></thead><tbody>';

    processedData.forEach(item => {
        const statusClass = item.isValid ? 'success' : 'danger';
        const statusIcon = item.isValid ? '✅' : '❌';
        const bgColor = item.isValid ? '#E8F5E9' : '#FFEBEE';
        
        html += `<tr style="background: ${bgColor};">`;
        html += `<td><strong>${item.rowNumber}</strong></td>`;
        html += `<td>${truncateText(item.data['موضوع المذكرة'] || '-', 40)}</td>`;
        html += `<td>${item.data['الطالب الأول'] || '-'}</td>`;
        html += `<td>${item.data['التخصص'] || '-'}</td>`;
        html += `<td style="text-align: center;">${statusIcon}</td>`;
        html += `<td><small style="color: ${item.isValid ? '#2E7D32' : '#C62828'};">`;
        html += item.isValid ? 'صحيحة وجاهزة' : item.errors.join(' • ');
        html += '</small></td>';
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// تأكيد الاستيراد
function confirmImport() {
    if (!previewData) return;

    const analysis = analyzeImportData(previewData);
    const validData = analysis.processedData
        .filter(item => item.isValid)
        .map(item => item.data);

    // استيراد البيانات الصحيحة فقط
    importValidTheses(validData);
    
    closePreviewModal();
}

// استيراد المذكرات الصحيحة
function importValidTheses(data) {
    let imported = 0;

    data.forEach(row => {
        const thesis = {
            id: generateId(),
            thesis_number: row['رقم المذكرة']?.toString().trim() || generateThesisNumber(),
            title: row['موضوع المذكرة'].toString().trim(),
            student1: row['الطالب الأول'].toString().trim(),
            student2: row['الطالب الثاني']?.toString().trim() || '',
            branch: row['الشعبة'],
            specialization: row['التخصص'],
            supervisor: row['الأستاذ المشرف'].toString().trim(),
            supervisor_rank: row['رتبة المشرف']?.toString().trim() || '',
            president: row['رئيس اللجنة'].toString().trim(),
            president_rank: row['رتبة الرئيس']?.toString().trim() || '',
            examiner: row['العضو المناقش'].toString().trim(),
            examiner_rank: row['رتبة العضو']?.toString().trim() || '',
            defense_date: row['تاريخ المناقشة']?.toString().trim() || '',
            defense_time: row['التوقيت']?.toString().trim() || '',
            room: row['القاعة']?.toString().trim() || '',
            created_at: new Date().toISOString()
        };

        theses.push(thesis);
        imported++;
    });

    saveData();
    updateProfessorsFromTheses();
    applyFilters(); // تحديث القائمة المفلترة لتعكس البيانات المستوردة
    updateDashboard();
    updateThesesList();

    showToast(`✅ تم استيراد ${imported} مذكرة بنجاح!`, 'success');

    // إذا كنا في صفحة النموذج، انتقل لصفحة القائمة
    if (fromFormImport) {
        setTimeout(() => {
            showPage('theses-list');
        }, 1500);
    }
}

// إغلاق نافذة المعاينة
function closePreviewModal() {
    document.getElementById('preview-modal').classList.remove('active');
    previewData = null;
    fromFormImport = false;
}

// ================================================
// توليد PDF للمحضر
// ================================================

function generatePDFForThesis(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (!thesis) return;

    currentPDFThesis = thesis;
    previewPDF();
}

function previewPDF() {
    let thesis = currentPDFThesis;
    
    if (!thesis) {
        // إذا لم يكن هناك مذكرة محددة، نستخدم البيانات من النموذج
        thesis = {
            thesis_number: document.getElementById('thesis-number').value || 'بدون رقم',
            title: document.getElementById('thesis-title').value || 'بدون موضوع',
            student1: document.getElementById('student1').value || 'بدون اسم',
            student2: document.getElementById('student2').value,
            branch: document.getElementById('branch').value,
            specialization: document.getElementById('specialization').value,
            supervisor: document.getElementById('supervisor').value,
            supervisor_rank: document.getElementById('supervisor-rank').value,
            president: document.getElementById('president').value,
            president_rank: document.getElementById('president-rank').value,
            examiner: document.getElementById('examiner').value,
            examiner_rank: document.getElementById('examiner-rank').value,
            defense_date: document.getElementById('defense-date').value,
            defense_time: document.getElementById('defense-time').value,
            room: document.getElementById('room').value
        };
        // حفظ البيانات في currentPDFThesis للاستخدام في downloadPDF
        currentPDFThesis = thesis;
    }

    const previewHtml = generateCertificateHTML(thesis);
    document.getElementById('pdf-preview').innerHTML = previewHtml;
    document.getElementById('pdf-modal').classList.add('active');
}

function generateCertificateHTML(thesis) {
    const studentName = thesis.student2 ? 
        `${thesis.student1} و ${thesis.student2}` : 
        thesis.student1;

    return `
        <div class="certificate">
            <!-- الترويسة الرسمية -->
            <div class="certificate-header">
                <h2 class="header-title">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                <div class="header-divider"></div>
                <p class="header-text">وزارة التعليم العالي والبحث العلمي</p>
                <h3 class="header-university">جامعة ابن خلدون ـ تيارت ـ</h3>
                <p class="header-text">كلية الآداب واللغات - قسم اللغة العربية وآدابها</p>
                <div class="header-year">
                    <span class="year-badge">الموسم الجامعي: 2025/2026</span>
                </div>
            </div>

            <!-- عنوان المحضر -->
            <div class="certificate-title-section">
                <h2 class="certificate-main-title">محضر مناقشة مذكرة الماستر</h2>
            </div>

            <div class="certificate-body">
                <!-- معلومات المذكرة -->
                <div class="info-section">
                    <div class="certificate-info">
                        <div class="info-row">
                            <span class="info-label">رقم المذكرة:</span>
                            <span class="info-value">${thesis.thesis_number} / 2026</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">تاريخ المناقشة:</span>
                            <span class="info-value">${thesis.defense_date || '................'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">التوقيت:</span>
                            <span class="info-value">${thesis.defense_time || '................'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">القاعة:</span>
                            <span class="info-value">${thesis.room || '................'}</span>
                        </div>
                        <div class="info-row full-width">
                            <span class="info-label">اسم ولقب الطالب(ة):</span>
                            <span class="info-value student-name">${studentName}</span>
                        </div>
                        <div class="info-row full-width">
                            <span class="info-label">موضوع المذكرة:</span>
                            <span class="info-value">${thesis.title}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">التخصص:</span>
                            <span class="info-value">${thesis.specialization}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">الشعبة:</span>
                            <span class="info-value">${thesis.branch}</span>
                        </div>
                    </div>
                </div>

                <!-- لجنة المناقشة -->
                <div class="committee-section">
                    <h3 class="section-title">أعضاء لجنة المناقشة:</h3>
                    <div class="committee-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>الصفة</th>
                                    <th>الرتبة العلمية</th>
                                    <th>الاسم واللقب</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>رئيسًا</strong></td>
                                    <td>${thesis.president_rank || '................'}</td>
                                    <td class="name-cell">${thesis.president}</td>
                                </tr>
                                <tr>
                                    <td><strong>مشرفًا ومقررًا</strong></td>
                                    <td>${thesis.supervisor_rank || '................'}</td>
                                    <td class="name-cell">${thesis.supervisor}</td>
                                </tr>
                                <tr>
                                    <td><strong>عضوًا مناقشًا</strong></td>
                                    <td>${thesis.examiner_rank || '................'}</td>
                                    <td class="name-cell">${thesis.examiner}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- نتيجة المناقشة -->
                <div class="result-section">
                    <h3 class="section-title">نتيجة المناقشة:</h3>
                    <div class="result-content">
                        <div class="result-row">
                            <span class="result-label">القرار:</span>
                            <span class="result-input">................................................</span>
                        </div>
                        <div class="result-grid">
                            <div class="result-item">
                                <span class="result-label">المعدل:</span>
                                <span class="result-input">..............</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">الملاحظة:</span>
                                <span class="result-input">........................</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- التوقيعات -->
                <div class="signatures-section">
                    <div class="signatures-grid">
                        <div class="signature-box">
                            <div class="signature-role">رئيس اللجنة</div>
                            <div class="signature-space"></div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-role">الأستاذ المشرف</div>
                            <div class="signature-space"></div>
                        </div>
                        <div class="signature-box">
                            <div class="signature-role">العضو المناقش</div>
                            <div class="signature-space"></div>
                        </div>
                    </div>
                    <div class="stamp-section">
                        <div class="stamp-label">تأشيرة رئيس القسم</div>
                        <div class="stamp-name">أ.د احميدة مداني</div>
                        <div class="stamp-title">رئيس قسم اللغة العربية وآدابها</div>
                        <div class="stamp-space"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function downloadPDF() {
    if (!currentPDFThesis) {
        showToast('لا توجد بيانات للتصدير', 'error');
        return;
    }

    // استخدام window.print للطباعة مع تنسيق محسّن ومبسط
    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write('<html><head><title>محضر مناقشة مذكرة الماستر</title>');
    printWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Amiri:wght@400;700&display=swap" rel="stylesheet">');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        @page {
            size: A4;
            margin: 15mm;
        }
        * {
            box-sizing: border-box;
        }
        body { 
            font-family: 'Cairo', sans-serif; 
            direction: rtl; 
            line-height: 1.35;
            color: #000;
            font-size: 9.5pt;
            background: white;
            margin: 0;
            padding: 0;
        }
        .certificate {
            border: 3px double #000;
            padding: 10px;
            background: white;
            max-width: 100%;
            box-shadow: inset 0 0 0 1px #000;
        }
        .certificate-header {
            text-align: center;
            padding: 6px 0;
            border-bottom: 3px double #000;
            margin-bottom: 8px;
            background: linear-gradient(to bottom, #f9f9f9 0%, white 100%);
        }
        .header-title {
            font-family: 'Amiri', 'Cairo', serif;
            font-size: 1.2rem;
            font-weight: 700;
            margin: 3px 0;
            letter-spacing: 0.5px;
            color: #1a1a1a;
        }
        .header-divider {
            width: 80px;
            height: 2.5px;
            background: linear-gradient(to right, transparent, #000, transparent);
            margin: 4px auto;
        }
        .header-text {
            font-size: 0.9rem;
            margin: 2px 0;
            font-weight: 500;
            color: #2a2a2a;
        }
        .header-university {
            font-family: 'Amiri', 'Cairo', serif;
            font-size: 1.1rem;
            font-weight: 700;
            margin: 3px 0;
            color: #1a1a1a;
        }
        .year-badge {
            display: inline-block;
            border: 2px solid #000;
            padding: 2px 12px;
            font-weight: 700;
            margin-top: 4px;
            font-size: 0.85rem;
            background: #f5f5f5;
            border-radius: 3px;
        }
        .certificate-title-section {
            text-align: center;
            margin: 8px 0;
            padding: 8px;
            border: 3px double #000;
            background: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .certificate-main-title {
            font-family: 'Amiri', 'Cairo', serif;
            font-size: 1.4rem;
            font-weight: 700;
            margin: 0;
            letter-spacing: 1px;
            color: #1a1a1a;
        }
        .certificate-body {
            margin: 6px 0;
        }
        .info-section,
        .committee-section,
        .result-section {
            margin-bottom: 8px;
            padding: 8px;
            border: 2px solid #000;
            page-break-inside: avoid;
            background: white;
            border-radius: 2px;
        }
        .section-title {
            font-family: 'Cairo', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            margin: 0 0 6px 0;
            padding-bottom: 3px;
            border-bottom: 2px solid #000;
            color: #1a1a1a;
            background: #f5f5f5;
            padding: 4px 8px;
            margin: -8px -8px 8px -8px;
        }
        .certificate-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
        }
        .info-row {
            display: flex;
            gap: 6px;
            padding: 4px 6px;
            border-bottom: 1px solid #ddd;
            font-size: 0.9rem;
            align-items: center;
            background: #fafafa;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-row.full-width {
            grid-column: 1 / -1;
        }
        .info-label {
            font-weight: 700;
            min-width: 100px;
            color: #2a2a2a;
        }
        .info-value {
            flex: 1;
            font-weight: 500;
        }
        .student-name {
            font-weight: 700;
            font-size: 1rem;
        }
        .committee-table {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th {
            background: linear-gradient(to bottom, #e8e8e8, #f5f5f5);
            padding: 5px;
            text-align: center;
            font-weight: 700;
            border: 1px solid #000;
            font-size: 0.9rem;
            color: #1a1a1a;
        }
        td {
            padding: 5px;
            text-align: center;
            border: 1px solid #666;
            font-size: 0.85rem;
            background: white;
        }
        .name-cell {
            font-weight: 700;
            font-size: 0.9rem;
        }
        .result-content {
            padding: 5px 0;
        }
        .result-row,
        .result-item {
            display: flex;
            gap: 8px;
            padding: 5px;
            margin-bottom: 4px;
            background: #fafafa;
            border: 1px solid #ddd;
            font-size: 0.85rem;
            align-items: center;
        }
        .result-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        .result-label {
            font-weight: 700;
            color: #2a2a2a;
        }
        .result-input {
            flex: 1;
            border-bottom: 1.5px dotted #666;
            min-height: 16px;
        }
        .signatures-section {
            margin-top: 8px;
            padding: 8px;
            border: 2px solid #000;
            page-break-inside: avoid;
            background: #fafafa;
        }
        .signatures-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 8px;
        }
        .signature-box {
            text-align: center;
            padding: 6px;
            border: 2px solid #666;
            background: white;
            border-radius: 3px;
        }
        .signature-role {
            font-weight: 700;
            margin-bottom: 5px;
            font-size: 0.9rem;
            color: #1a1a1a;
        }
        .signature-space {
            height: 35px;
            border: 2px dashed #999;
            margin: 5px 0;
            background: #fcfcfc;
        }
        .stamp-section {
            text-align: center;
            margin-top: 6px;
            padding: 10px 8px 8px;
            border: 2px solid #1B5E20;
            border-radius: 4px;
            background: white;
        }
        .stamp-label {
            font-weight: 700;
            font-size: 0.88rem;
            color: #1B5E20;
            margin-bottom: 2px;
        }
        .stamp-name {
            font-weight: 800;
            font-size: 0.95rem;
            color: #1a1a1a;
            margin-bottom: 1px;
        }
        .stamp-title {
            font-size: 0.78rem;
            color: #555;
            margin-bottom: 4px;
        }
        .stamp-space {
            height: 38px;
            border-bottom: 1.5px dashed #999;
            margin: 4px 8px 0;
        }
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            .certificate {
                border: 3px double #000;
                page-break-inside: avoid;
            }
            @page {
                size: A4;
                margin: 10mm;
            }
        }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(generateCertificateHTML(currentPDFThesis));
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);

    showToast('جاري الطباعة...', 'info');
}

function closeModal() {
    document.getElementById('pdf-modal').classList.remove('active');
    currentPDFThesis = null;
}

// ================================================
// وظائف مساعدة (Utilities)
// ================================================

function generateId() {
    return 'thesis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateThesisNumber() {
    // توليد رقم تلقائي بصيغة: السنة + رقم تسلسلي
    const year = new Date().getFullYear();
    const count = theses.length + 1;
    return `${year}${String(count).padStart(4, '0')}`;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================================
// تصدير للاستخدام العام
// ================================================

window.showPage = showPage;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.changePage = changePage;
window.editThesis = editThesis;
window.deleteThesis = deleteThesis;
window.toggleStudent2 = toggleStudent2;
window.updateSpecializations = updateSpecializations;
window.searchAndFillThesis = searchAndFillThesis;
window.resetForm = resetForm;
window.previewPDF = previewPDF;
window.downloadPDF = downloadPDF;
window.closeModal = closeModal;
window.importExcel = importExcel;
window.importExcelInForm = importExcelInForm;
window.downloadExcelTemplate = downloadExcelTemplate;
window.closePreviewModal = closePreviewModal;
window.confirmImport = confirmImport;
window.exportToExcel = exportToExcel;
window.exportStatistics = exportStatistics;
window.generatePDFForThesis = generatePDFForThesis;
window.deleteAllTheses = deleteAllTheses;

// ================================================
// نظام الجدولة الذكية التلقائية
// ================================================

const SCHEDULE_TIMES = [
    '09 سا و00 د',
    '10 سا و15 د',
    '11 سا و30د',
    '13 سا و15 د',
    '14 سا و30 د'
];

const SCHEDULE_ROOMS = [
    'مدرج الوئام', 'مدرج المعرفة', 'مدرج المستقبل',
    'مدرج السلام', 'مدرج الأمل',
    'القاعة 01', 'القاعة 02', 'القاعة 03',
    'القاعة 20', 'القاعة 21', 'القاعة 22', 'القاعة 23'
];

const PROF_CONSTRAINTS_KEY = 'smart_prof_constraints';
let schedulingResults = null;
let currentSchedStep = 1;

function getAvailableRooms() {
    const roomSelect = document.getElementById('room');
    if (roomSelect) {
        const opts = Array.from(roomSelect.options).map(o => o.value).filter(v => v && v.trim());
        if (opts.length > 0) return opts;
    }
    return SCHEDULE_ROOMS;
}

function getProfConstraints() {
    try { return JSON.parse(localStorage.getItem(PROF_CONSTRAINTS_KEY) || '{}'); }
    catch { return {}; }
}

function saveProfConstraints(c) {
    localStorage.setItem(PROF_CONSTRAINTS_KEY, JSON.stringify(c));
}

function openSchedulingModal() {
    if (!hasPermission('edit')) {
        showToast('ليس لديك صلاحية الجدولة', 'error');
        return;
    }
    if (theses.length === 0) {
        showToast('لا توجد مذكرات لجدولتها', 'warning');
        return;
    }
    currentSchedStep = 1;
    updateSchedSummary();
    showSchedStep(1);
    document.getElementById('scheduling-modal').style.display = 'block';
}

function closeSchedulingModal() {
    document.getElementById('scheduling-modal').style.display = 'none';
    schedulingResults = null;
}

function showSchedStep(step) {
    currentSchedStep = step;
    [1, 2, 3].forEach(s => {
        const content = document.getElementById(`sched-step-${s}`);
        const ind = document.getElementById(`sind-${s}`);
        if (content) content.classList.toggle('active', s === step);
        if (ind) {
            ind.classList.toggle('active', s === step);
            ind.classList.toggle('done', s < step);
        }
    });
    const prev = document.getElementById('btn-sched-prev');
    const next = document.getElementById('btn-sched-next');
    const apply = document.getElementById('btn-apply-sched');
    if (prev)  prev.style.display  = step > 1 ? 'inline-flex' : 'none';
    if (next)  next.style.display  = step < 3 ? 'inline-flex' : 'none';
    if (apply) apply.style.display = step === 3 ? 'inline-flex' : 'none';
    if (step === 2) buildProfConstraintsUI();
    if (step === 3) runAndPreviewScheduling();
}

function schedNext() {
    if (currentSchedStep === 1) {
        const start = document.getElementById('sched-start-date').value;
        const end   = document.getElementById('sched-end-date').value;
        if (!start || !end) { showToast('الرجاء تحديد تاريخ البداية والنهاية', 'error'); return; }
        if (new Date(end) < new Date(start)) { showToast('تاريخ النهاية يجب أن يكون بعد البداية', 'error'); return; }
    }
    if (currentSchedStep === 2) saveConstraintsFromUI();
    showSchedStep(currentSchedStep + 1);
}

function schedPrev() { showSchedStep(currentSchedStep - 1); }

function updateSchedSummary() {
    const unscheduled = theses.filter(t => !t.defense_date || !t.defense_time || !t.room);
    const scheduled   = theses.filter(t =>  t.defense_date &&  t.defense_time &&  t.room);
    const el = document.getElementById('sched-summary');
    if (!el) return;
    el.innerHTML = `
        <div class="sched-stat"><span class="sched-stat-num">${theses.length}</span><span>إجمالي المذكرات</span></div>
        <div class="sched-stat scheduled"><span class="sched-stat-num">${scheduled.length}</span><span>✅ مجدولة</span></div>
        <div class="sched-stat pending"><span class="sched-stat-num">${unscheduled.length}</span><span>⏳ تحتاج جدولة</span></div>
    `;
}

function buildProfConstraintsUI() {
    const profSet = new Set();
    theses.filter(t => !t.defense_date || !t.defense_time || !t.room).forEach(t => {
        if (t.supervisor) profSet.add(t.supervisor);
        if (t.president)  profSet.add(t.president);
        if (t.examiner)   profSet.add(t.examiner);
    });
    const profs = Array.from(profSet).sort((a, b) => a.localeCompare(b, 'ar'));
    const saved = getProfConstraints();
    const container = document.getElementById('prof-constraints-list');
    if (!container) return;
    if (profs.length === 0) {
        container.innerHTML = '<p class="sched-hint">لا توجد مذكرات غير مجدولة</p>';
        return;
    }
    container.innerHTML = profs.map(prof => {
        const c = saved[prof] || {};
        const count = theses.filter(t => t.supervisor === prof || t.president === prof || t.examiner === prof).length;
        const safeProf = prof.replace(/"/g, '&quot;');
        return `
        <div class="prof-constraint-card" data-prof="${safeProf}">
            <div class="prof-constraint-header">
                <span class="prof-constraint-name">👨‍🏫 ${prof}</span>
                <span class="prof-thesis-count">${count} مذكرة</span>
            </div>
            <div class="prof-constraint-body">
                <label class="constraint-check">
                    <input type="checkbox" class="c-consecutive" ${c.consecutiveDays ? 'checked' : ''}>
                    <span>🔗 يشترط أيام متتالية — تجميع جلساته في أيام متقاربة قدر الإمكان</span>
                </label>
                <label class="constraint-check">
                    <input type="checkbox" class="c-two-days" ${c.twoDaysOnly ? 'checked' : ''}>
                    <span>📅 يومين متتابعين فقط — تُحجز جميع جلساته في يومين متتاليين بالضبط</span>
                </label>
                <div class="constraint-row c-two-days-row" style="display:${c.twoDaysOnly ? 'flex' : 'none'}">
                    <label>📅 اليوم الأول المفضل:</label>
                    <input type="date" class="c-two-days-start" value="${c.twoDaysStart || ''}">
                </div>
                <div class="constraint-row">
                    <label>⏰ الوقت المفضل:</label>
                    <select class="c-time-pref">
                        <option value="any"       ${!c.preferredTime || c.preferredTime==='any'       ? 'selected':''}>أي وقت</option>
                        <option value="morning"   ${c.preferredTime==='morning'   ? 'selected':''}>صباحي (قبل 12ظ)</option>
                        <option value="afternoon" ${c.preferredTime==='afternoon' ? 'selected':''}>مسائي (بعد 12ظ)</option>
                    </select>
                </div>
                <div class="constraint-row">
                    <label>📊 الحد الأقصى في اليوم:</label>
                    <input type="number" class="c-max-day" value="${c.maxPerDay || 3}" min="1" max="10">
                </div>
                <div class="constraint-row">
                    <label>🚫 تواريخ غير متاح:</label>
                    <input type="text" class="c-unavail" placeholder="2026-06-10, 2026-06-11, ..."
                           value="${(c.unavailableDates || []).join(', ')}">
                </div>
            </div>
        </div>`;
    }).join('');

    // إظهار/إخفاء حقل تاريخ اليومين عند تغيير الخيار
    container.querySelectorAll('.c-two-days').forEach(cb => {
        cb.addEventListener('change', function() {
            const row = this.closest('.prof-constraint-body').querySelector('.c-two-days-row');
            if (row) row.style.display = this.checked ? 'flex' : 'none';
        });
    });
}

function saveConstraintsFromUI() {
    const cards = document.querySelectorAll('.prof-constraint-card');
    const constraints = {};
    cards.forEach(card => {
        const prof = card.dataset.prof;
        const unavailStr = card.querySelector('.c-unavail').value;
        const twoDays    = card.querySelector('.c-two-days').checked;
        const twoDaysStart = card.querySelector('.c-two-days-start').value;
        constraints[prof] = {
            consecutiveDays: card.querySelector('.c-consecutive').checked,
            twoDaysOnly:     twoDays,
            twoDaysStart:    twoDays && twoDaysStart ? twoDaysStart : '',
            preferredTime:   card.querySelector('.c-time-pref').value,
            maxPerDay:       parseInt(card.querySelector('.c-max-day').value) || 3,
            unavailableDates: unavailStr ? unavailStr.split(',').map(d => d.trim()).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)) : []
        };
    });
    saveProfConstraints(constraints);
}

function runAndPreviewScheduling() {
    const startDate    = document.getElementById('sched-start-date').value;
    const endDate      = document.getElementById('sched-end-date').value;
    const excludeDays  = Array.from(document.querySelectorAll('input[name="exclude-day"]:checked')).map(cb => parseInt(cb.value));
    const maxProfPerDay = parseInt(document.getElementById('sched-max-per-day').value) || 3;
    const constraints  = getProfConstraints();
    const preview = document.getElementById('scheduling-preview');
    preview.innerHTML = '<div style="text-align:center;padding:40px;font-size:1.1rem;">⏳ جاري التحليل الذكي...</div>';
    setTimeout(() => {
        schedulingResults = runSmartScheduling(startDate, endDate, excludeDays, maxProfPerDay, constraints);
        renderSchedulingPreview(schedulingResults);
    }, 400);
}

function renderSchedulingPreview(result) {
    const preview = document.getElementById('scheduling-preview');
    const applyBtn = document.getElementById('btn-apply-sched');
    if (result.error) {
        preview.innerHTML = `<div class="sched-error">❌ ${result.error}</div>`;
        if (applyBtn) applyBtn.style.display = 'none';
        return;
    }
    const { results, failed } = result;
    let html = '';
    if (results.length > 0) {
        html += `<div class="sched-success-banner">✅ تم توزيع <strong>${results.length}</strong> مذكرة بنجاح وفق القيود المحددة</div>`;
        html += `<div class="sched-preview-table-wrap"><table class="sched-preview-table">
            <thead><tr>
                <th>رقم المذكرة</th><th>الطالب</th><th>المشرف</th><th>الرئيس</th><th>التاريخ المقترح</th><th>التوقيت</th><th>القاعة</th>
            </tr></thead><tbody>`;
        results.forEach(r => {
            html += `<tr>
                <td>${r.thesis.thesis_number}</td>
                <td>${r.thesis.student1}</td>
                <td>${r.thesis.supervisor}</td>
                <td>${r.thesis.president || '-'}</td>
                <td><strong>${formatDateAr(r.date)}</strong></td>
                <td><span class="badge badge-primary">${r.time}</span></td>
                <td><span class="badge badge-info">${r.room}</span></td>
            </tr>`;
        });
        html += '</tbody></table></div>';
    }
    if (failed.length > 0) {
        html += `<div class="sched-failed-banner">⚠️ لم يتمكن النظام من جدولة <strong>${failed.length}</strong> مذكرة — قد تحتاج مراجعة قيود الأساتذة أو توسيع نطاق التواريخ</div>`;
        html += '<ul class="sched-failed-list">';
        failed.forEach(t => { html += `<li>📄 ${t.thesis_number} — ${t.student1} (مشرف: ${t.supervisor})</li>`; });
        html += '</ul>';
    }
    if (results.length === 0 && applyBtn) applyBtn.style.display = 'none';
    preview.innerHTML = html;
}

function formatDateAr(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
}

function applySchedulingResults() {
    if (!schedulingResults || !schedulingResults.results || schedulingResults.results.length === 0) return;
    if (!confirm(`هل تريد تطبيق الجدول المقترح على ${schedulingResults.results.length} مذكرة؟\nسيتم حفظ التواريخ والتوقيتات والقاعات فوراً.`)) return;
    schedulingResults.results.forEach(r => {
        const thesis = theses.find(t => t.id === r.thesis.id);
        if (thesis) {
            thesis.defense_date = r.date;
            thesis.defense_time = r.time;
            thesis.room = r.room;
        }
    });
    saveData();
    closeSchedulingModal();
    applyFilters();
    updateDashboard();
    showToast(`✅ تم تطبيق الجدول على ${schedulingResults.results.length} مذكرة بنجاح`, 'success');
}

// ---- الخوارزمية الأساسية ----

function generateDateRange(startDate, endDate, excludeWeekdays) {
    const dates = [];
    const current = new Date(startDate + 'T00:00:00');
    const end     = new Date(endDate   + 'T00:00:00');
    while (current <= end) {
        if (!excludeWeekdays.includes(current.getDay())) {
            dates.push(current.toISOString().split('T')[0]);
        }
        current.setDate(current.getDate() + 1);
    }
    return dates;
}

function buildOccupationMaps(scheduledTheses) {
    const roomOcc = {}, profOcc = {}, profDays = {};
    scheduledTheses.forEach(t => {
        const { defense_date: d, defense_time: ti, room: r } = t;
        if (!d || !ti || !r) return;
        if (!roomOcc[d]) roomOcc[d] = {};
        if (!roomOcc[d][ti]) roomOcc[d][ti] = {};
        roomOcc[d][ti][r] = true;
        if (!profOcc[d]) profOcc[d] = {};
        if (!profOcc[d][ti]) profOcc[d][ti] = new Set();
        [t.supervisor, t.president, t.examiner].filter(Boolean).forEach(p => {
            profOcc[d][ti].add(p);
            if (!profDays[p]) profDays[p] = new Set();
            profDays[p].add(d);
        });
    });
    return { roomOcc, profOcc, profDays };
}

function daysDiffSched(d1, d2) {
    return Math.abs((new Date(d2 + 'T00:00:00') - new Date(d1 + 'T00:00:00')) / 86400000);
}

function findBestSlot(thesis, availableDates, rooms, constraints, roomOcc, profOcc, profDays, maxProfPerDay) {
    const professors = [thesis.supervisor, thesis.president, thesis.examiner].filter(Boolean);

    // بناء قائمة التواريخ المسموحة لكل أستاذ يشترط يومين متتابعين
    const twoDay = {}; // prof → [day1, day2] أو null
    for (const prof of professors) {
        const c = constraints[prof] || {};
        if (!c.twoDaysOnly) continue;
        if (profDays[prof] && profDays[prof].size >= 2) {
            // الأستاذ استُخدم يومان مسبقاً → قيّده عليهما
            twoDay[prof] = Array.from(profDays[prof]).sort().slice(0, 2);
        } else if (profDays[prof] && profDays[prof].size === 1) {
            const first = Array.from(profDays[prof])[0];
            // اليوم الأول محدد → اليوم الثاني هو اليوم التالي
            const next = new Date(first + 'T00:00:00');
            next.setDate(next.getDate() + 1);
            twoDay[prof] = [first, next.toISOString().split('T')[0]];
        } else if (c.twoDaysStart) {
            // الأستاذ حدد تاريخ البداية
            const d1 = c.twoDaysStart;
            const d2obj = new Date(d1 + 'T00:00:00');
            d2obj.setDate(d2obj.getDate() + 1);
            twoDay[prof] = [d1, d2obj.toISOString().split('T')[0]];
        }
        // إذا لم يُحدد تاريخ → سيُختار أول فرصة ويُقيَّد عليها
    }

    // نُحسب درجة جاذبية كل تاريخ
    const scoredDates = availableDates.map(date => {
        let score = 0;
        for (const prof of professors) {
            const c = constraints[prof] || {};

            // تاريخ محظور → عقوبة كبيرة
            if (c.unavailableDates && c.unavailableDates.includes(date)) return { date, score: -99999 };

            // يومين متتابعين فقط
            if (c.twoDaysOnly) {
                const allowed = twoDay[prof];
                if (allowed) {
                    // إذا التاريخ ليس في اليومين المسموحين → مستحيل
                    if (!allowed.includes(date)) return { date, score: -99999 };
                    score += 20; // مكافأة للتوافق
                } else {
                    // لا يزال يُنشئ يومه الأول: أي تاريخ مقبول، لكن نفضّل البداية المبكرة
                    score += 5;
                }
            }

            // مكافأة الأيام المتتالية (consecutiveDays)
            if (c.consecutiveDays && profDays[prof] && profDays[prof].size > 0) {
                const sortedD = Array.from(profDays[prof]).sort();
                const lastDate = sortedD[sortedD.length - 1];
                const diff = daysDiffSched(lastDate, date);
                if (diff === 0)      score += 8;
                else if (diff === 1) score += 15;
                else if (diff === 2) score += 4;
                else score -= Math.min(diff, 10);
            }
        }
        return { date, score };
    }).sort((a, b) => b.score - a.score);

    for (const { date, score } of scoredDates) {
        if (score <= -99999) continue;

        // التحقق من الحد الأقصى لمشاركة الأستاذ في اليوم
        const overloaded = professors.some(prof => {
            const c = constraints[prof] || {};
            const max = c.maxPerDay || maxProfPerDay;
            let count = 0;
            SCHEDULE_TIMES.forEach(t => { if (profOcc[date]?.[t]?.has(prof)) count++; });
            return count >= max;
        });
        if (overloaded) continue;

        // تحديد ترتيب الأوقات حسب التفضيل
        let timesToTry = [...SCHEDULE_TIMES];
        const morningCount   = professors.filter(p => constraints[p]?.preferredTime === 'morning').length;
        const afternoonCount = professors.filter(p => constraints[p]?.preferredTime === 'afternoon').length;
        if (afternoonCount > morningCount) timesToTry = [...SCHEDULE_TIMES].reverse();

        for (const time of timesToTry) {
            if (professors.some(prof => profOcc[date]?.[time]?.has(prof))) continue;
            for (const room of rooms) {
                if (!roomOcc[date]?.[time]?.[room]) return { date, time, room };
            }
        }
    }
    return null;
}

function runSmartScheduling(startDate, endDate, excludeDays, maxProfPerDay, constraints) {
    const rooms          = getAvailableRooms();
    const availableDates = generateDateRange(startDate, endDate, excludeDays);
    if (availableDates.length === 0) return { error: 'لا توجد تواريخ متاحة في النطاق المحدد' };
    const unscheduled = theses.filter(t => !t.defense_date || !t.defense_time || !t.room);
    if (unscheduled.length === 0) return { error: 'جميع المذكرات مجدولة بالفعل' };
    const scheduled = theses.filter(t => t.defense_date && t.defense_time && t.room);
    const { roomOcc, profOcc, profDays } = buildOccupationMaps(scheduled);

    // ترتيب المذكرات: الأكثر تقييداً أولاً
    const sorted = [...unscheduled].sort((a, b) => {
        const score = thesis => [thesis.supervisor, thesis.president, thesis.examiner]
            .filter(Boolean).reduce((s, p) => {
                const c = constraints[p] || {};
                return s + (c.consecutiveDays ? 10 : 0) + (c.unavailableDates?.length || 0) * 2;
            }, 0);
        return score(b) - score(a);
    });

    const results = [], failed = [];
    for (const thesis of sorted) {
        const slot = findBestSlot(thesis, availableDates, rooms, constraints, roomOcc, profOcc, profDays, maxProfPerDay);
        if (slot) {
            results.push({ thesis, ...slot });
            const { date, time, room } = slot;
            if (!roomOcc[date]) roomOcc[date] = {};
            if (!roomOcc[date][time]) roomOcc[date][time] = {};
            roomOcc[date][time][room] = true;
            if (!profOcc[date]) profOcc[date] = {};
            if (!profOcc[date][time]) profOcc[date][time] = new Set();
            [thesis.supervisor, thesis.president, thesis.examiner].filter(Boolean).forEach(p => {
                profOcc[date][time].add(p);
                if (!profDays[p]) profDays[p] = new Set();
                profDays[p].add(date);
            });
        } else {
            failed.push(thesis);
        }
    }
    return { results, failed };
}

window.openSchedulingModal  = openSchedulingModal;
window.closeSchedulingModal = closeSchedulingModal;
window.schedNext            = schedNext;
window.schedPrev            = schedPrev;
window.updateSchedSummary   = updateSchedSummary;
window.applySchedulingResults = applySchedulingResults;

window.toggleFilterPanel = toggleFilterPanel;
window.onFilterChange = onFilterChange;
window.selectAllFilter = selectAllFilter;
window.clearSingleFilter = clearSingleFilter;

// ================================================
// صفحة برنامج المناقشات
// ================================================

// المتغير الحالي للتاريخ المحدد في صفحة البرنامج
let scheduleCurrentDate = new Date();
// مرجع المخطط الأسبوعي
let weeklyScheduleChart = null;

// دخول الصفحة: تحديث كل شيء
function updateSchedulePage() {
    const picker = document.getElementById('schedule-date-picker');
    if (picker && !picker.value) {
        picker.value = toISODate(scheduleCurrentDate);
    }
    renderTodaySchedule();
    renderWeeklyChart();
}

// تحويل Date إلى YYYY-MM-DD
function toISODate(d) {
    return d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
}

// تنسيق تاريخ عربي كامل
function formatArabicDate(isoDate) {
    const d = new Date(isoDate + 'T00:00:00');
    return d.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// زر اليوم الحالي
function scheduleGoToday() {
    scheduleCurrentDate = new Date();
    const picker = document.getElementById('schedule-date-picker');
    if (picker) picker.value = toISODate(scheduleCurrentDate);
    renderTodaySchedule();
    renderWeeklyChart();
}

// زر التنقل بين الأيام
function scheduleChangeDay(delta) {
    scheduleCurrentDate.setDate(scheduleCurrentDate.getDate() + delta);
    const picker = document.getElementById('schedule-date-picker');
    if (picker) picker.value = toISODate(scheduleCurrentDate);
    renderTodaySchedule();
    renderWeeklyChart();
}

// اختيار يوم من حقل التاريخ
function schedulePickDate(value) {
    if (!value) return;
    scheduleCurrentDate = new Date(value + 'T00:00:00');
    renderTodaySchedule();
    renderWeeklyChart();
}

// عرض جدول مناقشات اليوم المحدد
function renderTodaySchedule() {
    const selectedISO = toISODate(scheduleCurrentDate);
    const todayISO    = toISODate(new Date());
    const isToday     = selectedISO === todayISO;

    // تسميات
    const arabicDate = formatArabicDate(selectedISO);
    const labelEl = document.getElementById('schedule-today-label');
    const titleEl = document.getElementById('schedule-day-title');
    if (labelEl) labelEl.textContent = arabicDate;
    if (titleEl) titleEl.textContent = isToday
        ? `📋 مناقشات اليوم — ${arabicDate}`
        : `📋 مناقشات يوم — ${arabicDate}`;

    // فلترة المذكرات التي لها تاريخ مناقشة = اليوم المحدد
    const dayTheses = theses.filter(t => t.defense_date === selectedISO)
        .sort((a, b) => (a.defense_time || '').localeCompare(b.defense_time || ''));

    const container = document.getElementById('schedule-today-table');
    if (!container) return;

    if (dayTheses.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <h3>لا توجد مناقشات مجدولة لهذا اليوم</h3>
            <p>يمكنك تحديد تاريخ المناقشة عند إضافة أو تعديل المذكرة</p>
        </div>`;
        return;
    }

    let html = `<div class="table-container"><table>
        <thead><tr>
            <th>#</th>
            <th>الوقت</th>
            <th>القاعة</th>
            <th>موضوع المذكرة</th>
            <th>الطالب</th>
            <th>المشرف</th>
            <th>الرئيس</th>
            <th>المناقش</th>
            <th>التخصص</th>
            <th>إجراءات</th>
        </tr></thead><tbody>`;

    dayTheses.forEach((thesis, idx) => {
        const students = thesis.student2
            ? `${thesis.student1} / ${thesis.student2}`
            : thesis.student1;
        html += `<tr>
            <td>${idx + 1}</td>
            <td><span class="badge badge-info">${thesis.defense_time || '-'}</span></td>
            <td><span class="badge badge-primary">${thesis.room || '-'}</span></td>
            <td style="max-width:220px">${truncateText(thesis.title, 70)}</td>
            <td>${students}</td>
            <td>${thesis.supervisor}</td>
            <td>${thesis.president}</td>
            <td>${thesis.examiner}</td>
            <td><span class="badge ${specBadgeClass(thesis.specialization)}">${thesis.specialization}</span></td>
            <td>
                <button onclick="generatePDFForThesis('${thesis.id}')" class="btn btn-primary btn-sm">🖨️ طباعة</button>
                ${hasPermission('edit') ? `<button onclick="editThesis('${thesis.id}')" class="btn btn-info btn-sm">✏️ تعديل</button>` : ''}
            </td>
        </tr>`;
    });

    html += `</tbody></table></div>
        <div style="margin-top:10px;color:var(--gray-600);font-size:0.9rem;">
            إجمالي مناقشات هذا اليوم: <strong>${dayTheses.length}</strong>
        </div>`;
    container.innerHTML = html;
}

// رسم مخطط الأسبوع الكامل (7 أيام تبدأ من السبت)
function renderWeeklyChart() {
    // تحديد بداية ونهاية الأسبوع (السبت → الجمعة)
    const ref = new Date(scheduleCurrentDate);
    const dow = ref.getDay(); // 0=الأحد، 6=السبت
    // السبت = 6، نريد ان يكون أول يوم
    const diffToSat = (dow - 6 + 7) % 7;
    const weekStart = new Date(ref);
    weekStart.setDate(ref.getDate() - diffToSat);

    const dayNames  = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const labels    = [];
    const counts    = [];
    const colors    = [];
    const weekDates = [];
    const todayISO  = toISODate(new Date());
    const selectedISO = toISODate(scheduleCurrentDate);

    for (let i = 0; i < 7; i++) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const iso = toISODate(d);
        weekDates.push(iso);
        const count = theses.filter(t => t.defense_date === iso).length;
        labels.push(dayNames[i]);
        counts.push(count);
        // لون خاص لليوم الحالي وليوم المحدد
        if (iso === todayISO && iso === selectedISO) {
            colors.push('rgba(46, 204, 113, 0.85)');
        } else if (iso === todayISO) {
            colors.push('rgba(46, 204, 113, 0.65)');
        } else if (iso === selectedISO) {
            colors.push('rgba(52, 152, 219, 0.85)');
        } else {
            colors.push('rgba(155, 89, 182, 0.55)');
        }
    }

    // تسمية الأسبوع
    const weekLabelEl = document.getElementById('schedule-week-label');
    if (weekLabelEl) {
        weekLabelEl.textContent = `الأسبوع من ${formatArabicDate(weekDates[0])} إلى ${formatArabicDate(weekDates[6])}`;
    }

    // رسم المخطط
    const canvas = document.getElementById('chart-weekly-schedule');
    if (!canvas) return;
    if (weeklyScheduleChart) {
        weeklyScheduleChart.destroy();
        weeklyScheduleChart = null;
    }
    weeklyScheduleChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'عدد المناقشات',
                data: counts,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace(/[\d.]+\)$/, '1)')),
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: (items) => {
                            const idx = items[0].dataIndex;
                            return `${dayNames[idx]} — ${formatArabicDate(weekDates[idx])}`;
                        },
                        label: (item) => ` ${item.raw} مناقشة`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: { family: 'Cairo' }
                    },
                    grid: { color: 'rgba(0,0,0,0.06)' }
                },
                x: {
                    ticks: { font: { family: 'Cairo', size: 13 } },
                    grid: { display: false }
                }
            },
            onClick: (evt, elements) => {
                if (elements.length > 0) {
                    const idx = elements[0].index;
                    schedulePickDate(weekDates[idx]);
                    const picker = document.getElementById('schedule-date-picker');
                    if (picker) picker.value = weekDates[idx];
                }
            }
        }
    });

    // جدول ملخص الأسبوع
    renderWeekSummary(weekDates, dayNames, counts);
}

// جدول ملخص الأسبوع تحت المخطط
function renderWeekSummary(weekDates, dayNames, counts) {
    const container = document.getElementById('schedule-week-summary');
    if (!container) return;

    const total = counts.reduce((a, b) => a + b, 0);
    if (total === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray-500);font-size:0.9rem;">لا توجد مناقشات مجدولة هذا الأسبوع</p>';
        return;
    }

    const todayISO = toISODate(new Date());
    let html = `<div class="table-container"><table>
        <thead><tr>
            <th>اليوم</th><th>التاريخ</th><th>عدد المناقشات</th><th>التفاصيل</th>
        </tr></thead><tbody>`;

    weekDates.forEach((iso, i) => {
        if (counts[i] === 0) return;
        const isToday = iso === todayISO;
        const rowStyle = isToday ? 'background:rgba(46,204,113,0.08);font-weight:600;' : '';
        html += `<tr style="${rowStyle}">
            <td>${dayNames[i]}${isToday ? ' <span class="badge badge-success">اليوم</span>' : ''}</td>
            <td>${formatArabicDate(iso)}</td>
            <td><span class="badge badge-primary">${counts[i]}</span></td>
            <td><button onclick="schedulePickDate('${iso}');document.getElementById('schedule-date-picker').value='${iso}';" class="btn btn-secondary btn-sm">👁️ عرض</button></td>
        </tr>`;
    });

    html += `</tbody><tfoot><tr>
        <td colspan="2"><strong>إجمالي الأسبوع</strong></td>
        <td colspan="2"><span class="badge badge-info">${total} مناقشة</span></td>
    </tr></tfoot></table></div>`;
    container.innerHTML = html;
}

window.updateSchedulePage  = updateSchedulePage;
window.scheduleGoToday     = scheduleGoToday;
window.scheduleChangeDay   = scheduleChangeDay;
window.schedulePickDate    = schedulePickDate;

// إرجاع كلاس الشارة حسب التخصص
function specBadgeClass(spec) {
    const map = {
        'لسانيات الخطاب':    'badge-spec-linguistics',
        'تعليمية اللغات':    'badge-spec-teaching',
        'أدب حديث ومعاصر':  'badge-spec-literature',
        'نقد حديث ومعاصر':  'badge-spec-criticism'
    };
    return map[spec] || 'badge-warning';
}
