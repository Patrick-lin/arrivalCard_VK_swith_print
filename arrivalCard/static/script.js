
function logMessage(message) {
    const now = new Date();
    const timestamp = now.toISOString();
    console.log(`${timestamp} - INFO - ${message}`);
}

// 翻译映射表
const translations = {
    JPN: {
        "证件号码": "証件番号",
        "姓名": "名前",
        "性别": "性別",
        "国籍": "国籍",
        "出生日期": "生年月日",
        "中文姓名(请用中文填写)": "中国語名（中国語で記入してください）",
        "签证号码": "ビザ番号",
        "免签": "ビザ免除",
        "抵达航班/车次/船名": "到着便番号/列車番号/船名",
        "入境事由": "入国事由",
        "本人电话号码": "本人の電話番号",
        "在华经停和目的城市": "中国での経由地と目的の都市",
        "在华住址或旅馆名称": "中国での住所またはホテル名",
        "市": "市",
        "确认打印": "印刷を確認",
        "清空重采": "クリアして再取得",
        "姓": "姓",
        "名": "名",
        "外交/公务": "外交・公務",
        "商务": "商務",
        "定居": "定住",
        "工作": "就職",
        "学习": "学習",
        "旅游": "観光",
        "探亲": "親族訪問",
        "过境": "通過",
        "其他": "その他",
        "您是否定妥出境行程？如是，请填写具体安排。 ": "出国の行程を予約しましたか？もし予約している場合は、具体的な内容を記入してください。",
        "是": "はい",
        "否": "いいえ",
        "出境时间": "出国日時",
        "出境航班/车次/船名": "出国便番号/列車番号/船名",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "中国に受け入れ先または連絡先はありますか？もしある場合は、連絡先情報を記入してください。",
        "名称": "名称",
        "地址及联系电话": "住所と連絡先電話番号",
        "您在过去两年曾去过哪些国家 (地区)？": "過去2年間にどの国（地域）に行ったことがありますか？"
    },
    KOR: {
        "证件号码": "증명서 번호",
        "姓名": "이름",
        "性别": "성별",
        "国籍": "국적",
        "出生日期": "생년월일",
        "中文姓名(请用中文填写)": "중국어 이름 (중국어로 작성하세요)",
        "签证号码": "비자 번호",
        "免签": "비자 면제",
        "抵达航班/车次/船名": "도착 항공편/기차/선박 번호",
        "入境事由": "입국 사유",
        "本人电话号码": "본인 전화 번호",
        "在华经停和目的城市": "중국에서의 경유 및 목적 도시",
        "在华住址或旅馆名称": "중국에 머무르는 동안의 주소 또는 호텔 이름",
        "市": "시",
        "确认打印": "인쇄 확인",
        "清空重采": "지우고 다시 가져오기",
        "姓": "성",
        "名": "이름",
        "外交/公务": "외교/공무",
        "商务": "상무",
        "定居": "정착",
        "工作": "취업",
        "学习": "학습",
        "旅游": "관광",
        "探亲": "친척 방문",
        "过境": "통과",
        "其他": "기타",
        "您是否定妥出境行程？如是，请填写具体安排。": "출국 일정을 확정하셨나요? 그렇다면 구체적인 일정을 작성하세요.",
        "是": "예",
        "否": "아니오",
        "出境时间": "출국 시간",
        "出境航班/车次/船名": "출국 항공편/기차/선박 번호",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "중국에 접수 기관이나 연락처가 있나요? 있다면 연락처 정보를 작성하세요.",
        "名称": "이름",
        "地址及联系电话": "주소 및 연락처 전화 번호",
        "您在过去两年曾去过哪些国家 (地区)？": "지난 2년 동안 어느 국가(지역)에 가본 적이 있나요?"
    },
    VMN: {
        "证件号码": "Số hiệu giấy tờ",
        "姓名": "Tên",
        "性别": "Giới tính",
        "国籍": "Quốc tịch",
        "出生日期": "Ngày sinh",
        "中文姓名(请用中文填写)": "Tên tiếng Trung (viết bằng tiếng Trung)",
        "签证号码": "Số visa",
        "免签": "Miễn visa",
        "抵达航班/车次/船名": "Số hiệu chuyến bay/ tàu/ thuyền đến",
        "入境事由": "Mục đích nhập cảnh",
        "本人电话号码": "Số điện thoại cá nhân",
        "在华经停和目的城市": "Các thành phố trung gian và mục tiêu trong quá trình ở Trung Quốc",
        "在华住址或旅馆名称": "Địa chỉ hoặc tên khách sạn trong thời gian ở Trung Quốc",
        "市": "Thành phố",
        "确认打印": "Xác nhận in",
        "清空重采": "Xóa và lấy lại",
        "姓": "Họ",
        "名": "Tên",
        "外交/公务": "Ngoại giao/Công vụ",
        "商务": "Thương mại",
        "定居": "Định cư",
        "工作": "Tìm việc",
        "学习": "Học tập",
        "旅游": "Du lịch",
        "探亲": "Thăm thân",
        "过境": "Quá cảnh",
        "其他": "Khác",
        "您是否定妥出境行程？如是，请填写具体安排。": "Bạn đã đặt lịch trình xuất cảnh chưa? Nếu đã đặt, vui lòng ghi rõ các chi tiết.",
        "是": "Có",
        "否": "Không",
        "出境时间": "Thời gian xuất cảnh",
        "出境航班/车次/船名": "Số hiệu chuyến bay/ tàu/ thuyền xuất cảnh",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Bạn có đơn vị tiếp đón hoặc người liên hệ nào trong Trung Quốc không? Nếu có, vui lòng ghi thông tin liên hệ.",
        "名称": "Tên",
        "地址及联系电话": "Địa chỉ và số điện thoại liên hệ",
        "您在过去两年曾去过哪些国家 (地区)？": "Bạn đã đến những quốc gia (khu vực) nào trong hai năm qua?"
    },
    ALB: {
        "证件号码": "Numri i dokumentit",
        "姓名": "Emri",
        "性别": "Gjinia",
        "国籍": "Kombësia",
        "出生日期": "Dita e lindjes",
        "中文姓名(请用中文填写)": "Emri kinez (ju lutem plotësoni në kinezisht)",
        "签证号码": "Numri i vizës",
        "免签": "Pa vizë",
        "抵达航班/车次/船名": "Numri i fluturimit/trenit/Emri i anijes të ardhjes",
        "入境事由": "Arsyeja e hyrjes në vend",
        "本人电话号码": "Numri i telefonit personal",
        "在华经停和目的城市": "Qytetet e ndalesë dhe destinacionit në Kinë",
        "在华住址或旅馆名称": "Adresa ose emri i hotelit në Kinë",
        "市": "Qytet",
        "确认打印": "Konfirmo printimin",
        "清空重采": "Fshije dhe mblidhe përsëri",
        "姓": "Mbiemri",
        "名": "Emri",
        "外交/公务": "Diplomaci/Zyrtarie",
        "商务": "Biznes",
        "定居": "Bazim",
        "工作": "Punë",
        "学习": "Studim",
        "旅游": "Turizëm",
        "探亲": "Vizitë familjare",
        "过境": "Kalim",
        "其他": "Tjetër",
        "您是否定妥出境行程？如是，请填写具体安排。": "A keni rezervuar rrugën tuaj të daljes? Nëse po, ju lutemi shkruani detajet e saj.",
        "是": "Po",
        "否": "Jo",
        "出境时间": "Koha e daljes",
        "出境航班/车次/船名": "Numri i fluturimit/trenit/Emri i anijes së daljes",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "A keni një njësi pritëse ose kontakte në Kinë? Nëse po, ju lutemi shkruani informacionin e kontaktit.",
        "名称": "Emri",
        "地址及联系电话": "Adresa dhe Numri i kontaktit",
        "您在过去两年曾去过哪些国家 (地区)？": "Ne dy vitet e fundit, në cilat vende (rajonet) keni qenë?"
    },
    OOO: {
        "证件号码": "Document number",
        "姓名": "Name",
        "性别": "Gender",
        "国籍": "Nationality",
        "出生日期": "Date of birth",
        "中文姓名(请用中文填写)": "Chinese name (please fill in in Chinese) ",
        "签证号码": "Visa number",
        "免签": "Visa-free",
        "抵达航班/车次/船名": "Arrival Flight/train/ship name",
        "入境事由": "Reasons for entry",
        "本人电话号码": "Your telephone number",
        "在华经停和目的城市": "Stopovers and destination cities in China",
        "在华住址或旅馆名称": "Name of residence or hotel in China",
        "市": "City",
        "确认打印": "Make sure to print",
        "清空重采": "Emptying and re-mining",
        "姓": "Surname",
        "名": "Given name",
        "外交/公务": "Diplomacy/Official",
        "商务": "Business",
        "定居": "Settlement",
        "工作": "Employment",
        "学习": "Study",
        "旅游": "Tourism",
        "探亲": "Visiting Relatives",
        "过境": "Transit",
        "其他": "Others",
        "您是否定妥出境行程？如是，请填写具体安排。": "Have you booked your departure itinerary? If so, please fill in the specific arrangements.",
        "是": "Yes",
        "否": "No",
        "出境时间": "Departure time",
        "出境航班/车次/船名": "Departure Flight/train/ship name",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Do you have a reception unit or contact in China? If so, please fill in the contact information.",
        "名称": "Name",
        "地址及联系电话": "Address and contact phone number",
        "您在过去两年曾去过哪些国家 (地区)？": "Which countries (regions) have you visited in the past two years?"
    },
    SAU: {
        "证件号码": "رقم المستند",
        "姓名": "الاسم",
        "性别": "الجنس",
        "国籍": "الجنسية",
        "出生日期": "تاريخ الميلاد",
        "中文姓名(请用中文填写)": "الاسم الصيني (يرجى ملئه باللغة الصينية)",
        "签证号码": "رقم التأشيرة",
        "免签": "مستثنى من التأشيرة",
        "抵达航班/车次/船名": "رقم الرحلة/القطار/اسم السفينة الوافدة",
        "入境事由": "سبب الدخول",
        "本人电话号码": "رقم هاتفك الشخصي",
        "在华经停和目的城市": "مدن التوقف والوجهة في الصين",
        "在华住址或旅馆名称": "اسم السكن أو الفندق في الصين",
        "市": "المدينة",
        "确认打印": "تأكيد الطباعة",
        "清空重采": "مسح واستلام جديد",
        "姓": "اللقب",
        "名": "الاسم الأول",
        "外交/公务": "سفاراتي/مسؤول",
        "商务": "تجارة",
        "定居": "تثبيت",
        "工作": "عمل",
        "学习": "دراسة",
        "旅游": "سياحة",
        "探亲": "زيارة الأقارب",
        "过境": "مرور",
        "其他": "أخرى",
        "您是否定妥出境行程？如是，请填写具体安排。": "هل قد حجزت جدول سفرك للخروج؟ إذا كان الأمر كذلك، يرجى ملء التفاصيل.",
        "是": "نعم",
        "否": "لا",
        "出境时间": "وقت الخروج",
        "出境航班/车次/船名": "رقم الرحلة/القطار/اسم السفينة الصادرة",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "هل لديك وحدة استقبال أو جهة اتصال في الصين؟ إذا كان الأمر كذلك، يرجى ملء معلومات الاتصال.",
        "名称": "الاسم",
        "地址及联系电话": "العنوان ورقم الهاتف للتواصل",
        "您在过去两年曾去过哪些国家 (地区)？": "أي دول (مناطق) زرت في السنتين الماضيتين؟"
    },
    ARE: {
        "证件号码": "رقم المستند",
        "姓名": "الاسم",
        "性别": "الجنس",
        "国籍": "الجنسية",
        "出生日期": "تاريخ الميلاد",
        "中文姓名(请用中文填写)": "الاسم الصيني (يرجى ملئه باللغة الصينية)",
        "签证号码": "رقم التأشيرة",
        "免签": "مستثنى من التأشيرة",
        "抵达航班/车次/船名": "رقم الرحلة/القطار/اسم السفينة الوافدة",
        "入境事由": "سبب الدخول",
        "本人电话号码": "رقم هاتفك الشخصي",
        "在华经停和目的城市": "مدن التوقف والوجهة في الصين",
        "在华住址或旅馆名称": "اسم السكن أو الفندق في الصين",
        "市": "المدينة",
        "确认打印": "تأكيد الطباعة",
        "清空重采": "مسح واستلام جديد",
        "姓": "اللقب",
        "名": "الاسم الأول",
        "外交/公务": "سفاراتي/مسؤول",
        "商务": "تجارة",
        "定居": "تثبيت",
        "工作": "عمل",
        "学习": "دراسة",
        "旅游": "سياحة",
        "探亲": "زيارة الأقارب",
        "过境": "مرور",
        "其他": "أخرى",
        "您是否定妥出境行程？如是，请填写具体安排。": "هل قد حجزت جدول سفرك للخروج؟ إذا كان الأمر كذلك، يرجى ملء التفاصيل.",
        "是": "نعم",
        "否": "لا",
        "出境时间": "وقت الخروج",
        "出境航班/车次/船名": "رقم الرحلة/القطار/اسم السفينة الصادرة",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "هل لديك وحدة استقبال أو جهة اتصال في الصين؟ إذا كان الأمر كذلك، يرجى ملء معلومات الاتصال.",
        "名称": "الاسم",
        "地址及联系电话": "العنوان ورقم الهاتف للتواصل",
        "您在过去两年曾去过哪些国家 (地区)？": "أي دول (مناطق) زرت في السنتين الماضيتين؟"
    },
    MYS: {
        "证件号码": "Nombor dokumen",
        "姓名": "Nama",
        "性别": "Jantina",
        "国籍": "Kewarganegaraan",
        "出生日期": "Tarikh lahir",
        "中文姓名(请用中文填写)": "Nama Cina (Sila isi dalam bahasa Cina)",
        "签证号码": "Nombor visa",
        "免签": "Tanpa visa",
        "抵达航班/车次/船名": "Nama penerbangan/kereta api/perahu tiba",
        "入境事由": "Sebab masuk negara",
        "本人电话号码": "Nombor telefon peribadi",
        "在华经停和目的城市": "Bandar perhentian dan tujuan di China",
        "在华住址或旅馆名称": "Nama alamat atau hotel di China",
        "市": "Bandar",
        "确认打印": "Sahkan cetakan",
        "清空重采": "Kosongkan dan ambil semula",
        "姓": "Nama keluarga",
        "名": "Nama depan",
        "外交/公务": "Diplomatik/Rasmi",
        "商务": "Perniagaan",
        "定居": "Menduduk",
        "工作": "Pekerjaan",
        "学习": "Belajar",
        "旅游": "Pelancongan",
        "探亲": "Melawat saudara mara",
        "过境": "Lintas negara",
        "其他": "Lain-lain",
        "您是否定妥出境行程？如是，请填写具体安排。": "Adakah anda telah menempah perjalanan keluar negara? Jika ya, sila isi pengaturan khusus.",
        "是": "Ya",
        "否": "Tidak",
        "出境时间": "Masa keluar negara",
        "出境航班/车次/船名": "Nama penerbangan/kereta api/perahu keluar negara",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Adakah anda mempunyai unit penerima atau orang yang boleh dihubungi di China? Jika ya, sila isi maklumat hubungan.",
        "名称": "Nama",
        "地址及联系电话": "Alamat dan Nombor Telefon Hubungan",
        "您在过去两年曾去过哪些国家 (地区)？": "Ke negara (rantau) manakah anda telah pergi dalam dua tahun yang lalu?"
    },
    THA: {
        "证件号码": "หมายเลขบัตรประชาชน",
        "姓名": "ชื่อ",
        "性别": "เพศ",
        "国籍": "สัญชาติ",
        "出生日期": "วันเกิด",
        "中文姓名(请用中文填写)": "ชื่อภาษาจีน (กรุณากรอกด้วยภาษาจีน)",
        "签证号码": "หมายเลขวีซ่า",
        "免签": "ไม่ต้องมีวีซ่า",
        "抵达航班/车次/船名": "ชื่อเที่ยวบิน/รถไฟ/เรือที่มาถึง",
        "入境事由": "เหตุผลการเข้าประเทศ",
        "本人电话号码": "หมายเลขโทรศัพท์ส่วนตัว",
        "在华经停和目的城市": "เมืองระยะทางและเมืองปลายทางในประเทศจีน",
        "在华住址或旅馆名称": "ชื่อที่อยู่หรือโรงแรมในประเทศจีน",
        "市": "เมือง",
        "确认打印": "ยืนยันการพิมพ์",
        "清空重采": "ล้างข้อมูลและรับข้อมูลใหม่",
        "姓": "นามสกุล",
        "名": "ชื่อจริง",
        "外交/公务": "การทูต/ราชการ",
        "商务": "ธุรกิจ",
        "定居": "ตั้งถิ่นฐาน",
        "工作": "การจ้างงาน",
        "学习": "การเรียน",
        "旅游": "การท่องเที่ยว",
        "探亲": "เยี่ยมญาติ",
        "过境": "การผ่าน国境",
        "其他": "อื่นๆ",
        "您是否定妥出境行程？如是，请填写具体安排。": "คุณได้จองตารางเวลาออกประเทศแล้วหรือไม่? ถ้าใช่โปรดระบุรายละเอียด.",
        "是": "ใช่",
        "否": "ไม่",
        "出境时间": "เวลาออกประเทศ",
        "出境航班/车次/船名": "ชื่อเที่ยวบิน/รถไฟ/เรือออกประเทศ",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "คุณมีหน่วยรับประทานหรือผู้ติดต่อในประเทศจีนหรือไม่? ถ้าใช่โปรดระบุข้อมูลการติดต่อ.",
        "名称": "ชื่อ",
        "地址及联系电话": "ที่อยู่และหมายเลขโทรศัพท์ติดต่อ",
        "您在过去两年曾去过哪些国家 (地区)？": "คุณเคยไปยังประเทศ (ภูมิภาค) ใดในช่วงสองปีที่ผ่านมา?"
    },
    IDN: {
        "证件号码": "Nomor dokumen",
        "姓名": "Nama",
        "性别": "Jenis kelamin",
        "国籍": "Kewarganegaraan",
        "出生日期": "Tanggal lahir",
        "中文姓名(请用中文填写)": "Nama Cina (Silakan isi dengan bahasa Cina)",
        "签证号码": "Nomor visa",
        "免签": "Bebas visa",
        "抵达航班/车次/船名": "Nama penerbangan/kereta api/kapal tiba",
        "入境事由": "Alasan masuk negara",
        "本人电话号码": "Nomor telepon pribadi",
        "在华经停和目的城市": "Kota transit dan tujuan di China",
        "在华住址或旅馆名称": "Nama alamat atau hotel di China",
        "市": "Kota",
        "确认打印": "Konfirmasi cetak",
        "清空重采": "Kosongkan dan ambil ulang",
        "姓": "Nama keluarga",
        "名": "Nama depan",
        "外交/公务": "Diplomatik/Pekerjaan resmi",
        "商务": "Bisnis",
        "定居": "Meninggalkan",
        "工作": "Pekerjaan",
        "学习": "Belajar",
        "旅游": "Pariwisata",
        "探亲": "Mengunjungi kerabat",
        "过境": "Transit",
        "其他": "Lainnya",
        "您是否定妥出境行程？如是，请填写具体安排。": "Apakah Anda sudah memesan jadwal keberangkatan? Jika ya, harap isi pengaturan khususnya.",
        "是": "Ya",
        "否": "Tidak",
        "出境时间": "Waktu keberangkatan",
        "出境航班/车次/船名": "Nama penerbangan/kereta api/kapal keberangkatan",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Apakah Anda memiliki unit penerima atau kontak di China? Jika ya, harap isi informasi kontak.",
        "名称": "Nama",
        "地址及联系电话": "Alamat dan Nomor Telepon Kontak",
        "您在过去两年曾去过哪些国家 (地区)？": "Ke negara (wilayah) mana Anda pernah pergi dalam dua tahun terakhir?"
    },
    D: {
        "证件号码": "Ausweisnummer",
        "姓名": "Name",
        "性别": "Geschlecht",
        "国籍": "Nationalität",
        "出生日期": "Geburtsdatum",
        "中文姓名(请用中文填写)": "Chinesischer Name (bitte in chinesischer Schrift ausfüllen)",
        "签证号码": "Visa-Nummer",
        "免签": "Visumfrei",
        "抵达航班/车次/船名": "Ankunftsflug-/Zug-/Schiffsname",
        "入境事由": "Einreisegrund",
        "本人电话号码": "Eigene Telefonnummer",
        "在华经停和目的城市": "Zwischenstopps und Zielstädte in China",
        "在华住址或旅馆名称": "Adresse oder Name des Hotels in China",
        "市": "Stadt",
        "确认打印": "Drucken bestätigen",
        "清空重采": "Löschen und neu erfassen",
        "姓": "Nachname",
        "名": "Vorname",
        "外交/公务": "Diplomatie/Amtspflicht",
        "商务": "Geschäft",
        "定居": "Siedlung",
        "工作": "Beschäftigung",
        "学习": "Studium",
        "旅游": "Reisen",
        "探亲": "Familienbesuch",
        "过境": "Durchreise",
        "其他": "Andere",
        "您是否定妥出境行程？如是，请填写具体安排。": "Haben Sie Ihre Abreise gebucht? Wenn ja, geben Sie bitte die Details an.",
        "是": "Ja",
        "否": "Nein",
        "出境时间": "Abreisezeit",
        "出境航班/车次/船名": "Abreiseflug-/Zug-/Schiffsname",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Haben Sie in China eine Empfangseinheit oder Kontaktperson? Wenn ja, geben Sie bitte die Kontaktinformationen an.",
        "名称": "Name",
        "地址及联系电话": "Adresse und Kontakttelefonnummer",
        "您在过去两年曾去过哪些国家 (地区)？": "In welchen Ländern (Regionen) waren Sie in den letzten zwei Jahren?"
    },
    FRA: {
        "证件号码": "Numéro de pièce d'identité",
        "姓名": "Nom",
        "性别": "Sexe",
        "国籍": "Nationalité",
        "出生日期": "Date de naissance",
        "中文姓名(请用中文填写)": "Nom chinois (veuillez remplir en chinois)",
        "签证号码": "Numéro de visa",
        "免签": "Exemption de visa",
        "抵达航班/车次/船名": "Nom du vol/train/bateau d'arrivée",
        "入境事由": "Motif d'entrée",
        "本人电话号码": "Votre numéro de téléphone",
        "在华经停和目的城市": "Villes d'escale et de destination en Chine",
        "在华住址或旅馆名称": "Adresse ou nom de l'hôtel en Chine",
        "市": "Ville",
        "确认打印": "Confirmer l'impression",
        "清空重采": "Effacer et reprendre la saisie",
        "姓": "Nom de famille",
        "名": "Prénom",
        "外交/公务": "Diplomatie/Fonction publique",
        "商务": "Affaires",
        "定居": "Résidence",
        "工作": "Emploi",
        "学习": "Études",
        "旅游": "Tourisme",
        "探亲": "Visite de famille",
        "过境": "Transit",
        "其他": "Autres",
        "您是否定妥出境行程？如是，请填写具体安排。": "Avez-vous réservé votre itinéraire de départ? Si oui, veuillez remplir les détails.",
        "是": "Oui",
        "否": "Non",
        "出境时间": "Heure de départ",
        "出境航班/车次/船名": "Nom du vol/train/bateau de départ",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Avez-vous une unité d'accueil ou un contact en Chine? Si oui, veuillez remplir les informations de contact.",
        "名称": "Nom",
        "地址及联系电话": "Adresse et numéro de téléphone de contact",
        "您在过去两年曾去过哪些国家 (地区)？": "Dans quels pays (régions) êtes-vous allé(e) au cours des deux dernières années?"
    },
    RUS: {
        "证件号码": "Номер документа",
        "姓名": "Фамилия и имя",
        "性别": "Пол",
        "国籍": "Гражданство",
        "出生日期": "Дата рождения",
        "中文姓名(请用中文填写)": "Китайское имя (заполните на китайском языке)",
        "签证号码": "Номер визы",
        "免签": "Безвизовый режим",
        "抵达航班/车次/船名": "Название прилетающего рейса/поезда/корабля",
        "入境事由": "Цель въезда",
        "本人电话号码": "Ваш номер телефона",
        "在华经停和目的城市": "Города остановок и цель поездки в Китае",
        "在华住址或旅馆名称": "Адрес проживания или название отеля в Китае",
        "市": "Город",
        "确认打印": "Подтвердить печать",
        "清空重采": "Очистить и повторно ввести",
        "姓": "Фамилия",
        "名": "Имя",
        "外交/公务": "Дипломатические/Служебные",
        "商务": "Деловые",
        "定居": "Постоянное проживание",
        "工作": "Работа",
        "学习": "Учеба",
        "旅游": "Туризм",
        "探亲": "Посещение родственников",
        "过境": "Транзит",
        "其他": "Другие",
        "您是否定妥出境行程？如是，请填写具体安排。": "Вы забронировали билет на выезд? Если да, укажите конкретные детали.",
        "是": "Да",
        "否": "Нет",
        "出境时间": "Время выезда",
        "出境航班/车次/船名": "Название вылетающего рейса/поезда/корабля",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "У вас есть приемная организация или контактные лица в Китае? Если да, укажите контактную информацию.",
        "名称": "Название",
        "地址及联系电话": "Адрес и номер телефона для связи",
        "您在过去两年曾去过哪些国家 (地区)？": "В какие страны (регионы) вы были в последние два года?"
    },
    ITA: {
        "证件号码": "Numero documento",
        "姓名": "Nome",
        "性别": "Sesso",
        "国籍": "Nazionalità",
        "出生日期": "Data di nascita",
        "中文姓名(请用中文填写)": "Nome cinese (compila in cinese)",
        "签证号码": "Numero visto",
        "免签": "Esenzione visto",
        "抵达航班/车次/船名": "Nome del volo/treno/naviglio di arrivo",
        "入境事由": "Motivo di ingresso",
        "本人电话号码": "Il tuo numero di telefono",
        "在华经停和目的城市": "Città di scalo e destinazione in Cina",
        "在华住址或旅馆名称": "Indirizzo o nome dell'hotel in Cina",
        "市": "Città",
        "确认打印": "Conferma stampa",
        "清空重采": "Cancella e reinserisci",
        "姓": "Cognome",
        "名": "Nome",
        "外交/公务": "Diplomazia/Servizio pubblico",
        "商务": "Affari",
        "定居": "Settimantosi",
        "工作": "Lavoro",
        "学习": "Studi",
        "旅游": "Turismo",
        "探亲": "Visita ai parenti",
        "过境": "Transito",
        "其他": "Altri",
        "您是否定妥出境行程？如是，请填写具体安排。": "Hai prenotato l'itinerario di partenza? Se sì, per favore inserisci i dettagli specifici.",
        "是": "Sì",
        "否": "No",
        "出境时间": "Ora di partenza",
        "出境航班/车次/船名": "Nome del volo/treno/naviglio di partenza",
        "您是否有接待单位或联系人？如是，请填写具体安排。": "Hai un'unità di ricezione o un contatto in Cina? Se sì, per favore inserisci le informazioni di contatto.",
        "名称": "Nome",
        "地址及联系电话": "Indirizzo e Numero di Telefono di Contatto",
        "您在过去两年曾去过哪些国家 (地区)？": "In quali paesi (regioni) sei stato negli ultimi due anni?"
    }
};

function showUserInfo(userInfo) {
    document.getElementById('placeholder-image').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('documentNO').value = userInfo.documentNO;
    document.getElementById('surname').value = userInfo.surname;
    document.getElementById('givenname').value = userInfo.givenname;
    document.getElementById('sex').value = userInfo.sex;
    document.getElementById('nationality').value = userInfo.nationality;
    document.getElementById('dateOfBirth').value = userInfo.dateOfBirth;

    // 根据国籍进行翻译
    const nationality = userInfo.nationality;
    if (translations[nationality]) {
        const translation = translations[nationality];
        const thElements = document.querySelectorAll('th');
        thElements.forEach(th => {
            const originalText = th.textContent.split('|')[0].trim();
            if (translation[originalText]) {
                th.textContent = `${originalText} | ${translation[originalText]}`;
            }
        });

        const buttonElements = document.querySelectorAll('button');
        buttonElements.forEach(button => {
            const originalText = button.textContent.split('|')[0].trim();
            if (translation[originalText]) {
                button.textContent = `${originalText} | ${translation[originalText]}`;
            }
        });


        const selectElements = document.querySelectorAll('option');
        selectElements.forEach(option => {
            const originalText = option.textContent.split('|')[0].trim();
            if (translation[originalText]) {
                option.textContent = `${originalText} | ${translation[originalText]}`;
            }
        });

    } else {
        const translation = translations["OOO"];
        const thElements = document.querySelectorAll('th');
        thElements.forEach(th => {
            const originalText = th.textContent.split('|')[0].trim();
            if (translation[originalText]) {
                th.textContent = `${originalText} | ${translation[originalText]}`;
            }
        });



        const buttonElements = document.querySelectorAll('button');
        buttonElements.forEach(button => {
            const originalText = button.textContent.split('|')[0].trim();
            if (translation[originalText]) {
                button.textContent = `${originalText} | ${translation[originalText]}`;
            }
        });

        const selectElements = document.querySelectorAll('option');
        console.log("国籍" + nationality)
        selectElements.forEach(option => {
            const originalText = option.textContent.split('|')[0].trim();
            if (translation[originalText]) {
                option.textContent = `${originalText} | ${translation[originalText]}`;
            }
        });
    }
}

function confirmPrint() {
    const documentNO = document.getElementById('documentNO').value;
    const surname = document.getElementById('surname').value;
    const givenname = document.getElementById('givenname').value;
    const nationality = document.getElementById('nationality').value;
    const sex = document.getElementById('sex').value.includes('男') ? 'M' : 'F';
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const chineseName = document.getElementById('chineseName').value;
    const visaNumber = document.getElementById('visaFree').checked ? 'MQ' : document.getElementById('visaNumber').value;
    const arrivalTransport = document.getElementById('arrivalTransport').value;
    const entryPurpose = document.getElementById('entryPurpose').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const citiesInChina = document.getElementById('citiesInChina').value;
    const addressInChina = document.getElementById('addressInChina').value;
    const city = document.getElementById('city').value;

    // 提取需要打印在下一页的内容
    const departureBooked = document.querySelector('input[name="departureBooked"]:checked')?.value || '';
    const dateOfDeparture = document.getElementById('dateOfDeparture').value;
    const departureTransport = document.getElementById('departureTransport').value;
    const hasContacts = document.querySelector('input[name="hasContacts"]:checked')?.value || '';
    const receptionName = document.getElementById('receptionName').value;
    const receptionAddress = document.getElementById('receptionAddress').value;
    const pastCountries = document.getElementById('pastCountries').value;

    const data = {
        documentNO,
        surname,
        givenname,
        nationality,
        sex,
        dateOfBirth,
        chineseName,
        visaNumber,
        arrivalTransport,
        entryPurpose,
        phoneNumber,
        citiesInChina,
        addressInChina,
        city,
        // 下一页的内容
        nextPageContent: [
            departureBooked,
            dateOfDeparture,
            departureTransport,
            hasContacts,
            receptionName,
            receptionAddress,
            pastCountries
        ]
    };

    console.log("user data:" + JSON.stringify(data));
    fetch('/print', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            clearAndReacquire();
            // 创建弹窗元素
            const popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '40px';
            popup.style.width = '400px';
            popup.style.backgroundColor = '#fff';
            popup.style.border = '1px solid #ccc';
            popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            popup.style.zIndex = '1000';
            popup.style.fontSize = '20px';
            popup.style.textAlign = 'center';
            popup.textContent = result.message;
            document.body.appendChild(popup);

            // 三秒后移除弹窗
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 5000);
        })
        .catch(error => {
            alert('打印出错，请重试。');
        });
}

function clearAndReacquire() {
    document.getElementById('USER').reset();
    document.getElementById('user-info').style.display = 'none';
    // 显示图片
    document.getElementById('placeholder-image').style.display = 'block';
    document.getElementById('tip').style.display = 'block';
    // 可以在这里添加重新提示扫描的逻辑
    fetch('/clear', {
        method: 'GET',
        headers: {
            // 这里如果 GET 请求没有特别的请求头需求，可以省略
            // 'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(result => {
            // alert(result.message);
        })
        .catch(error => {
            alert('清除数据出错，请重试。');
        });
    console.log('用户数据清空成功')
}

function simulateReceiveData() {
    console.log('监听后端中。。。');

    fetch('/get_received_data')
        .then(response => response.json())
        .then(data => {
            if (data.data) {
                console.log(`接收到的数据: ${JSON.stringify(data.data)}`);
                document.getElementById('tip').style.display = 'none';
                showUserInfo(data.data);
            }
        })
        .catch(error => {
            logMessage(`请求出错: ${error}`);
        });
}

// 定时接收数据
setInterval(simulateReceiveData, 3000);

//单双面打印开关
let config = {
    enableLastFiveRows: false // 这里可以从配置文件中读取
}

// 异步函数，用于从服务器获取配置信息
async function loadConfig() {
    try {
        // 使用 fetch API 从服务器获取配置信息
        const response = await fetch('/get_config');
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 将响应内容解析为 JSON 格式
        const data = await response.json();
        // 将解析后的数据赋值给 config 对象
        config = data;
        console.log(config);
        // 打印日志，提示配置加载成功
        logMessage('Config loaded successfully');
        // 调用更新状态和背景颜色的函数
        updateLastFiveRowsState(config.enableLastFiveRows);
        updateLastFiveRowsTextColor();
    } catch (error) {
        // 打印错误日志
        logMessage(`Error loading config: ${error.message}`);
    }
}

function updateLastFiveRowsState(enabled) {
    const lastFiveRowsInputs = document.querySelectorAll('.last-five-rows');
    console.log('Number of last-five-rows inputs:', lastFiveRowsInputs.length);
    lastFiveRowsInputs.forEach(input => {
        input.disabled = !enabled;
    });
}

function updateLastFiveRowsTextColor() {
    const lastFiveRows = document.querySelectorAll('table tr:nth-last-child(-n+5) th, table tr:nth-last-child(-n+5) td');
    console.log('Number of last-five-rows elements:', lastFiveRows.length);
    const textColor = config.enableLastFiveRows ? 'black' : 'gray'; // 根据标识设置字体颜色
    lastFiveRows.forEach(element => {
        element.style.color = textColor;
    });
}
// 确保在 DOM 加载完成后加载配置
document.addEventListener('DOMContentLoaded', function () {
    loadConfig();
});

function logMessage(message) {
    console.log(message);
}