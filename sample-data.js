// بيانات تجريبية للاختبار
// هذا الملف اختياري ويمكن حذفه بعد الاختبار

const SAMPLE_THESES = [
    {
        id: 'thesis-001',
        thesis_number: '202600001',
        title: 'الاستعارة في الشعر الجاهلي - دراسة لسانية تحليلية',
        branch: 'دراسات لغوية',
        specialization: 'لسانيات الخطاب',
        student1: 'أحمد بن محمد العربي',
        student2: '',
        supervisor: 'د. محمد الطاهر بن عاشور',
        supervisor_rank: 'أستاذ محاضر أ',
        president: 'أ.د بن جلول مختار',
        president_rank: 'أستاذ التعليم العالي',
        examiner: 'أ.د احميدة مداني',
        examiner_rank: 'أستاذ التعليم العالي',
        defense_date: '2026-06-15',
        defense_time: '09 سا و00 د',
        room: 'مدرج الوئام',
        created_at: new Date().toISOString()
    },
    {
        id: 'thesis-002',
        thesis_number: '202600002',
        title: 'التداولية في الخطاب القرآني - مقاربة معاصرة',
        branch: 'دراسات لغوية',
        specialization: 'لسانيات الخطاب',
        student1: 'فاطمة الزهراء بنت علي',
        student2: 'مريم بنت حسن',
        supervisor: 'أ.د احميدة مداني',
        supervisor_rank: 'أستاذ التعليم العالي',
        president: 'أ.د بن جلول مختار',
        president_rank: 'أستاذ التعليم العالي',
        examiner: 'د. محمد الطاهر بن عاشور',
        examiner_rank: 'أستاذ محاضر أ',
        defense_date: '2026-06-16',
        defense_time: '10 سا و15 د',
        room: 'القاعة 01',
        created_at: new Date().toISOString()
    },
    {
        id: 'thesis-003',
        thesis_number: '202600003',
        title: 'استراتيجيات تعليم اللغة العربية للناطقين بغيرها',
        branch: 'دراسات لغوية',
        specialization: 'تعليمية اللغات',
        student1: 'عبد الرحمن بن عمر',
        student2: '',
        supervisor: 'أ.د دبيح محمد',
        supervisor_rank: 'أستاذ التعليم العالي',
        president: 'أ.د احميدة مداني',
        president_rank: 'أستاذ التعليم العالي',
        examiner: 'د. محمد الطاهر بن عاشور',
        examiner_rank: 'أستاذ محاضر أ',
        defense_date: '2026-06-17',
        defense_time: '11 سا و30د',
        room: 'مدرج المعرفة',
        created_at: new Date().toISOString()
    },
    {
        id: 'thesis-004',
        thesis_number: '202600004',
        title: 'الرمزية في شعر بدر شاكر السياب',
        branch: 'دراسات أدبية',
        specialization: 'أدب حديث ومعاصر',
        student1: 'خديجة بنت إبراهيم',
        student2: 'سارة بنت يوسف',
        supervisor: 'د. محمد الطاهر بن عاشور',
        supervisor_rank: 'أستاذ محاضر أ',
        president: 'أ.د دبيح محمد',
        president_rank: 'أستاذ التعليم العالي',
        examiner: 'أ.د بن جلول مختار',
        examiner_rank: 'أستاذ التعليم العالي',
        defense_date: '2026-06-18',
        defense_time: '13 سا و15 د',
        room: 'القاعة 02',
        created_at: new Date().toISOString()
    },
    {
        id: 'thesis-005',
        thesis_number: '202600005',
        title: 'النقد الثقافي في الخطاب الأدبي المعاصر',
        branch: 'دراسات نقدية',
        specialization: 'نقد حديث ومعاصر',
        student1: 'محمود بن سعيد',
        student2: '',
        supervisor: 'أ.د بن جلول مختار',
        supervisor_rank: 'أستاذ التعليم العالي',
        president: 'أ.د دبيح محمد',
        president_rank: 'أستاذ التعليم العالي',
        examiner: 'أ.د احميدة مداني',
        examiner_rank: 'أستاذ التعليم العالي',
        defense_date: '2026-06-19',
        defense_time: '14 سا و30 د',
        room: 'مدرج السلام',
        created_at: new Date().toISOString()
    }
];

// دالة لتحميل البيانات التجريبية (استخدمها في الكونسول)
function loadSampleData() {
    const existing = localStorage.getItem('master_theses_data');
    if (existing && JSON.parse(existing).length > 0) {
        console.log('⚠️ توجد بيانات بالفعل. هل تريد استبدالها؟');
        console.log('استخدم: loadSampleData(true) لاستبدال البيانات الموجودة');
        return;
    }
    
    localStorage.setItem('master_theses_data', JSON.stringify(SAMPLE_THESES));
    console.log('✅ تم تحميل ' + SAMPLE_THESES.length + ' مذكرات تجريبية');
    console.log('🔄 قم بتحديث الصفحة لرؤية البيانات');
}

// دالة لحذف كل البيانات
function clearAllData() {
    if (confirm('هل أنت متأكد من حذف كل البيانات؟')) {
        localStorage.removeItem('master_theses_data');
        localStorage.removeItem('professors_list');
        localStorage.removeItem('current_user');
        console.log('✅ تم حذف جميع البيانات');
        console.log('🔄 قم بتحديث الصفحة');
    }
}

console.log('📚 البيانات التجريبية جاهزة!');
console.log('📝 استخدم loadSampleData() لتحميل 5 مذكرات تجريبية');
console.log('🗑️ استخدم clearAllData() لحذف جميع البيانات');
