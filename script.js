/* =========================================================
   UNDERPRICE SKINCARE MEDAN
   1) Navigasi wizard 3 langkah + validasi ringan
   2) Data produk — DIAMBIL DARI FILE EXCEL TOKO (51 produk kategori Wajah)
   3) Mesin rekomendasi: weighted scoring + bonus kategori,
      penyusun rutinitas step-by-step, dan smart budgeting
   4) Data insight (demo, tersimpan di localStorage)
   5) Render hasil ke modal (tab Top 3 & Rutinitas) tanpa reload halaman
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     1. NAVIGASI WIZARD
  --------------------------------------------------------- */
  const form       = document.getElementById("quizForm");
  const steps      = Array.from(document.querySelectorAll(".step"));
  const trackItems = Array.from(document.querySelectorAll(".step-track__item"));
  let currentStep  = 0;

  function goToStep(index){
    steps.forEach((s, i) => s.classList.toggle("is-active", i === index));
    trackItems.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
      item.classList.toggle("is-done", i < index);
    });
    currentStep = index;
  }

  function validateStep(index){
    if (index === 0){
      const skinType = document.getElementById("skinType").value;
      if (!skinType){
        document.getElementById("skinType").focus();
        return false;
      }
    }
    if (index === 1){
      const checked = document.querySelectorAll('input[name="concerns"]:checked');
      const errorEl = document.getElementById("concernsError");
      if (checked.length === 0){
        errorEl.hidden = false;
        return false;
      }
      errorEl.hidden = true;
    }
    return true;
  }

  document.querySelectorAll('[data-action="next"]').forEach(btn => {
    btn.addEventListener("click", () => {
      if (!validateStep(currentStep)) return;
      goToStep(Math.min(currentStep + 1, steps.length - 1));
    });
  });

  document.querySelectorAll('[data-action="back"]').forEach(btn => {
    btn.addEventListener("click", () => {
      goToStep(Math.max(currentStep - 1, 0));
    });
  });

  /* ---------------------------------------------------------
     2. DATA PRODUK — dari "Data_Data_Skincare_Toko_Underprice_Skincare_Medan.xlsx"
     Hanya kategori "Wajah" yang dimasukkan (sesuai cakupan kuesioner
     jenis kulit wajah). Kolom sumber: Nama Produk, Kategori,
     Target Masalah Kulit, Kandungan Utama, Kisaran Harga(Rp).

     STATUS: Data di bawah ini SUDAH DIKONFIRMASI oleh tim
     Underprice Skincare Medan melalui file "Review_Mapping_Produk_
     Underprice_Skincare.xlsx" (semua 51 baris ditandai "Tidak perlu
     ditinjau — sudah benar").

     Di implementasi nyata, data ini sebaiknya diambil dari API/database
     (lihat skema tabel `produk` yang sudah dirancang sebelumnya), bukan
     hardcode di frontend.
  --------------------------------------------------------- */
  const PRODUCTS = [
    { id: 1, nama: "Glad2Glow Pomegranate 5% Niacinamide", kategori: "Pelembap", icon: "🧴",
      kandungan: "Ekstrak Pomegranate, 5% Niacinamide",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["flek_hitam", "kusam"],
      hargaMin: 33000, hargaMax: 59000, strongActives: false, gentle: false },
    { id: 2, nama: "The Originote Ceratinol Moisturizer", kategori: "Pelembap", icon: "🧴",
      kandungan: "Encapsulated Retinol, Ceramide, Aloe Vera",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kerutan"],
      hargaMin: 50000, hargaMax: 57000, strongActives: true, gentle: false },
    { id: 3, nama: "Skintific 5X Ceramide Barrier Moisture Gel", kategori: "Pelembap", icon: "🧴",
      kandungan: "5 Jenis Ceramide, Hyaluronic Acid, Centella Asiatica",
      jenisKulit: ["kering", "sensitif", "normal"],
      masalah: ["kemerahan", "dehidrasi"],
      hargaMin: 90000, hargaMax: 134000, strongActives: false, gentle: false },
    { id: 4, nama: "Somethinc Niacinamide + Moisture Beet", kategori: "Serum", icon: "🌿",
      kandungan: "Niacinamide, Ekstrak Beetroot",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["flek_hitam", "kusam"],
      hargaMin: 148000, hargaMax: 199000, strongActives: false, gentle: false },
    { id: 5, nama: "Azarine Hydrasoothe Sunscreen Gel SPF 45", kategori: "Tabir Surya", icon: "☀️",
      kandungan: "Aloe Vera, Propolis, Green Tea, Tanpa Alkohol & Minyak",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["jerawat", "pori_besar"],
      hargaMin: 30000, hargaMax: 50600, strongActives: false, gentle: true },
    { id: 6, nama: "Facetology Triple Care Sunscreen", kategori: "Tabir Surya", icon: "☀️",
      kandungan: "Hybrid UV Filters, Niacinamide, Centella Asiatica",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 46000, hargaMax: 89000, strongActives: false, gentle: false },
    { id: 7, nama: "Hanasui Flawless Glow 10 / Acne Serum", kategori: "Serum", icon: "🌿",
      kandungan: "Niacinamide, Salicylic Acid, Centella Asiatica",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat", "flek_hitam", "kusam"],
      hargaMin: 19000, hargaMax: 25000, strongActives: true, gentle: false },
    { id: 8, nama: "Implora Luminous Brightening Serum", kategori: "Serum", icon: "🌿",
      kandungan: "Niacinamide 10%, Caviar Collagen, Black Pearl",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["flek_hitam"],
      hargaMin: 28000, hargaMax: 35000, strongActives: false, gentle: false },
    { id: 9, nama: "Emina Bright Stuff Face Wash", kategori: "Pembersih", icon: "🧼",
      kandungan: "Ekstrak Summer Plum, Vitamin B3",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 15000, hargaMax: 22000, strongActives: false, gentle: false },
    { id: 10, nama: "Garnier Micellar Cleansing Water", kategori: "Pembersih", icon: "🧼",
      kandungan: "Micelles (molekul pembersih), Tanpa Alkohol",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["pori_besar"],
      hargaMin: 25000, hargaMax: 38000, strongActives: false, gentle: true },
    { id: 11, nama: "COSRX Salicylic Acid Daily Cleanser", kategori: "Pembersih", icon: "🧼",
      kandungan: "Salicylic Acid 0,5%, Tea Tree Oil",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["jerawat", "pori_besar"],
      hargaMin: 120000, hargaMax: 149000, strongActives: true, gentle: false },
    { id: 12, nama: "Bioaqua Sheet Mask (Berbagai Varian)", kategori: "Masker", icon: "🎭",
      kandungan: "Aloe Vera, Honey, Pomegranate, Hyaluronic Acid",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam", "dehidrasi"],
      hargaMin: 2500, hargaMax: 5000, strongActives: false, gentle: false },
    { id: 13, nama: "Glad2Glow Centella Asiatica Soothing Gel", kategori: "Pelembap", icon: "🧴",
      kandungan: "Centella Asiatica murni, Allantoin",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["kemerahan"],
      hargaMin: 35000, hargaMax: 45000, strongActives: false, gentle: true },
    { id: 14, nama: "Avoskin Miraculous Refining Toner", kategori: "Toner", icon: "💧",
      kandungan: "AHA, BHA, PHA, Niacinamide",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam", "pori_besar"],
      hargaMin: 95000, hargaMax: 180000, strongActives: true, gentle: false },
    { id: 15, nama: "The Originote Ceraluronic Essence", kategori: "Essence", icon: "🌿",
      kandungan: "Ceramide, Hyaluronic Acid, Chlorella",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam", "dehidrasi"],
      hargaMin: 40000, hargaMax: 55000, strongActives: false, gentle: false },
    { id: 16, nama: "Acnes Sealing Jell", kategori: "Obat Totol", icon: "🎯",
      kandungan: "Salicylic Acid, Sulfur, Vitamin E",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat"],
      hargaMin: 18000, hargaMax: 25000, strongActives: true, gentle: false },
    { id: 17, nama: "Wardah Acne Derm Acne Spot Treatment", kategori: "Obat Totol", icon: "🎯",
      kandungan: "DermaTreat Actives, Aloe Vera",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["jerawat", "flek_hitam", "kemerahan"],
      hargaMin: 22000, hargaMax: 28000, strongActives: false, gentle: false },
    { id: 18, nama: "Azarine Purifying Deep Cleansing Clay Mask", kategori: "Masker", icon: "🎭",
      kandungan: "Clay, Salicylic Acid, Centella",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["pori_besar"],
      hargaMin: 40000, hargaMax: 65000, strongActives: true, gentle: false },
    { id: 19, nama: "Whitelab Brightening Face Toner", kategori: "Toner", icon: "💧",
      kandungan: "Niacinamide, HyaluComplex-10",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 35000, hargaMax: 45000, strongActives: false, gentle: false },
    { id: 20, nama: "Viva Milk Cleanser (Bengkoang/Cucumber)", kategori: "Pembersih", icon: "🧼",
      kandungan: "Ekstrak Bengkoang/Timun",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 6000, hargaMax: 10000, strongActives: false, gentle: false },
    { id: 21, nama: "Safi White Expert Purifying Cleanser", kategori: "Pembersih", icon: "🧼",
      kandungan: "Habbatus Sauda, OxyWhite",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 25000, hargaMax: 45000, strongActives: false, gentle: false },
    { id: 22, nama: "Nivea MicellAIR Skin Breathe", kategori: "Pembersih", icon: "🧼",
      kandungan: "Micellar Water, Rose Water",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 30000, hargaMax: 50000, strongActives: false, gentle: false },
    { id: 23, nama: "Kahf Face Wash Oil and Acne Care", kategori: "Pembersih", icon: "🧼",
      kandungan: "HydroBalance, Salicylic Acid",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["jerawat", "pori_besar"],
      hargaMin: 30000, hargaMax: 40000, strongActives: true, gentle: false },
    { id: 24, nama: "Somethinc AHA BHA PHA Peeling Solution", kategori: "Peeling", icon: "✨",
      kandungan: "AHA 3%, BHA 1%, PHA 2%",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam", "pori_besar"],
      hargaMin: 115000, hargaMax: 130000, strongActives: true, gentle: false },
    { id: 25, nama: "Luxcrime Blur & Cover Two Way Cake", kategori: "Makeup", icon: "💄",
      kandungan: "Vitamin E, UV Protection",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["flek_hitam", "pori_besar"],
      hargaMin: 80000, hargaMax: 120000, strongActives: false, gentle: false },
    { id: 26, nama: "Gatsby Face Wash Men (All Varian)", kategori: "Pria", icon: "🧴",
      kandungan: "Oil Absorbing, Cooling Agent",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["kusam", "pori_besar"],
      hargaMin: 22000, hargaMax: 30000, strongActives: false, gentle: false },
    { id: 27, nama: "Cetaphil Gentle Skin Cleanser", kategori: "Pembersih", icon: "🧼",
      kandungan: "Micellar Water, Tanpa Pewangi",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["kemerahan"],
      hargaMin: 85000, hargaMax: 150000, strongActives: false, gentle: true },
    { id: 28, nama: "Mineral Botanica Acne Care Face Mist", kategori: "Mist", icon: "💦",
      kandungan: "Adansonia Extract, Chamomile",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["jerawat", "kemerahan", "dehidrasi"],
      hargaMin: 25000, hargaMax: 35000, strongActives: false, gentle: false },
    { id: 29, nama: "Sariayu Masker Jerawat", kategori: "Masker", icon: "🎭",
      kandungan: "Ekstrak Pegagan, Daun Sirih",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["jerawat", "pori_besar"],
      hargaMin: 12000, hargaMax: 18000, strongActives: false, gentle: false },
    { id: 30, nama: "Wardah C-Defense Serum", kategori: "Serum", icon: "🌿",
      kandungan: "Hi-Grade Vitamin C",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 75000, hargaMax: 90000, strongActives: false, gentle: false },
    { id: 31, nama: "Pixy Glowssentials Sunshield", kategori: "Sunscreen", icon: "☀️",
      kandungan: "Natural Vita Complex, SPF 32",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 25000, hargaMax: 35000, strongActives: false, gentle: false },
    { id: 32, nama: "Azarine C White Lightening Serum", kategori: "Serum", icon: "🌿",
      kandungan: "Vitamin C, Ferulic Acid",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat", "flek_hitam"],
      hargaMin: 40000, hargaMax: 50000, strongActives: false, gentle: false },
    { id: 33, nama: "The Originote Hyalucera Moisturizer", kategori: "Pelembap", icon: "🧴",
      kandungan: "Hyaluronic Acid, Ceramide",
      jenisKulit: ["kering", "normal"],
      masalah: ["kusam", "dehidrasi"],
      hargaMin: 40000, hargaMax: 50000, strongActives: false, gentle: false },
    { id: 34, nama: "Emina Ms, Pimple Acne Solution Face Wash", kategori: "Pembersih", icon: "🧼",
      kandungan: "Salicylic Acid, Allantoin",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat"],
      hargaMin: 18000, hargaMax: 25000, strongActives: true, gentle: false },
    { id: 35, nama: "NPure Cica Clear Pad", kategori: "Eksfoliasi", icon: "✨",
      kandungan: "Centella Asiatica, AHA, BHA, PHA",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam", "pori_besar"],
      hargaMin: 75000, hargaMax: 95000, strongActives: true, gentle: false },
    { id: 36, nama: "Ovale Facial Mask (Sachet)", kategori: "Masker", icon: "🎭",
      kandungan: "Ekstrak Bengkoang/Lidah Buaya",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 5000, hargaMax: 8000, strongActives: false, gentle: false },
    { id: 37, nama: "Fanbo Acne Solution Loose Powder", kategori: "Makeup", icon: "💄",
      kandungan: "Tea Tree Oil, Double UV Filter",
      jenisKulit: ["berminyak", "normal"],
      masalah: ["jerawat", "pori_besar"],
      hargaMin: 25000, hargaMax: 35000, strongActives: false, gentle: false },
    { id: 38, nama: "La Tulipe Acne Care Serum", kategori: "Serum", icon: "🌿",
      kandungan: "Tea Tree Oil, Piroctone Olamine",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat"],
      hargaMin: 45000, hargaMax: 60000, strongActives: false, gentle: false },
    { id: 39, nama: "Viva White Clean & Mask (5in1)", kategori: "Cleanser", icon: "🧼",
      kandungan: "Yoghurt, Honey",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 15000, hargaMax: 20000, strongActives: false, gentle: false },
    { id: 40, nama: "Azarine Tone Up Mineral Sunscreen", kategori: "Sunscreen", icon: "☀️",
      kandungan: "Mineral UV Filter, Ceramide",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 55000, hargaMax: 65000, strongActives: false, gentle: false },
    { id: 41, nama: "Sariayu Krem Masker Pengencang", kategori: "Masker", icon: "🎭",
      kandungan: "Ekstrak Jati Belanda, Pegagan",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kerutan"],
      hargaMin: 15000, hargaMax: 20000, strongActives: false, gentle: false },
    { id: 42, nama: "Scarlett Whitening Acne Night Cream", kategori: "Krim Malam", icon: "🌙",
      kandungan: "Double Action Salicylic Acid, Natural Vitamin C",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat"],
      hargaMin: 65000, hargaMax: 75000, strongActives: true, gentle: false },
    { id: 43, nama: "Glad2Glow Centella Allantoin Moisturizer", kategori: "Krim Malam", icon: "🌙",
      kandungan: "Centella, Allantoin",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["kemerahan", "dehidrasi"],
      hargaMin: 40000, hargaMax: 50000, strongActives: false, gentle: false },
    { id: 44, nama: "Wardah Lightening Night Cream", kategori: "Krim Malam", icon: "🌙",
      kandungan: "Advanced Niacinamide",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["jerawat", "flek_hitam", "kusam"],
      hargaMin: 35000, hargaMax: 45000, strongActives: false, gentle: false },
    { id: 45, nama: "Safi White Expert Deep Exfoliator", kategori: "Eksfoliasi", icon: "✨",
      kandungan: "Apricot Beads, Habbatus Sauda",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam", "pori_besar"],
      hargaMin: 30000, hargaMax: 45000, strongActives: false, gentle: false },
    { id: 46, nama: "Biore Cleansing Oil", kategori: "Pembersih", icon: "🧼",
      kandungan: "Mineral Oil, Essential Oil",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 80000, hargaMax: 110000, strongActives: false, gentle: false },
    { id: 47, nama: "Purbasari Micellar Water", kategori: "Pembersih", icon: "🧼",
      kandungan: "Tea Tree Oil, Micelles",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 15000, hargaMax: 25000, strongActives: false, gentle: false },
    { id: 48, nama: "Azarine Hydramax-C Sunscreen Serum", kategori: "Sunscreen", icon: "☀️",
      kandungan: "High Grade Vitamin C, Ceramide",
      jenisKulit: ["kering", "normal"],
      masalah: ["kusam", "dehidrasi"],
      hargaMin: 45000, hargaMax: 55000, strongActives: false, gentle: false },
    { id: 49, nama: "Mustika Ratu Masker Bengkoang", kategori: "Masker", icon: "🎭",
      kandungan: "Pati Bengkoang, Akar Manis",
      jenisKulit: ["normal", "berminyak", "kering", "kombinasi", "sensitif"],
      masalah: ["kusam"],
      hargaMin: 12000, hargaMax: 18000, strongActives: false, gentle: false },
    { id: 50, nama: "Herborist Aloe Vera Gel 98%", kategori: "Perawatan", icon: "🌿",
      kandungan: "Aloe Vera murni",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["kemerahan"],
      hargaMin: 20000, hargaMax: 30000, strongActives: false, gentle: true },
    { id: 51, nama: "Citra Fresh Glow Aloe Vera Gel", kategori: "Perawatan", icon: "🌿",
      kandungan: "100% Natural Aloe Vera",
      jenisKulit: ["sensitif", "normal"],
      masalah: ["kemerahan"],
      hargaMin: 20000, hargaMax: 28000, strongActives: false, gentle: false },
  ];

  const CONCERN_LABEL = {
    jerawat: "Jerawat", flek_hitam: "Flek Hitam", kusam: "Kusam",
    pori_besar: "Pori Besar", kerutan: "Kerutan", kemerahan: "Kemerahan",
    dehidrasi: "Dehidrasi"
  };

  /* ---------------------------------------------------------
     3. MESIN REKOMENDASI
  --------------------------------------------------------- */

  /* --- 3a. Definisi urutan rutinitas skincare (fitur #2) ---
     Setiap kategori produk dipetakan ke satu langkah pemakaian.
     `essential: true` = termasuk "Basic Kit" (fitur #3, smart budgeting) */
  const STEP_DEFINITIONS = [
    { key: "cleanser",    label: "1. Facial Wash",     icon: "🧼",
      categories: ["Pembersih", "Cleanser", "Pria"], essential: true },
    { key: "toner",       label: "2. Toner",           icon: "💧",
      categories: ["Toner"], essential: false },
    { key: "treatment",   label: "3. Serum / Treatment", icon: "🌿",
      categories: ["Serum", "Essence", "Obat Totol", "Peeling", "Eksfoliasi"], essential: false },
    { key: "moisturizer", label: "4. Moisturizer",     icon: "🧴",
      categories: ["Pelembap", "Krim Malam", "Perawatan"], essential: true },
    { key: "sunscreen",   label: "5. Sunscreen",       icon: "☀️",
      categories: ["Tabir Surya", "Sunscreen"], essential: true },
  ];
  const FULL_STEPS      = STEP_DEFINITIONS;
  const ESSENTIAL_STEPS = STEP_DEFINITIONS.filter(s => s.essential);

  /* --- 3b. Bonus poin per kategori × masalah kulit (fitur #1) ---
     Contoh sesuai permintaan: kategori "Obat Totol" (Acne Treatment)
     dapat +15 poin ekstra kalau user memilih "jerawat". Ini membuat
     scoring lebih cerdas daripada sekadar cocok/tidak cocok. */
  const CATEGORY_CONCERN_BONUS = {
    "Obat Totol":   { jerawat: 15 },
    "Serum":        { flek_hitam: 8, kusam: 8, kerutan: 6 },
    "Essence":      { dehidrasi: 8, kusam: 6 },
    "Toner":        { pori_besar: 6, kusam: 6 },
    "Tabir Surya":  { flek_hitam: 6, kerutan: 6 },
    "Sunscreen":    { flek_hitam: 6, kerutan: 6 },
    "Peeling":      { pori_besar: 8, kusam: 6 },
    "Eksfoliasi":   { pori_besar: 8, kusam: 6 },
  };

  /* --- 3c. Fungsi scoring inti — dipakai baik untuk Top 3 maupun Rutinitas --- */
  function computeScore(p, user, relaxedSkin){
    let score = 0;
    const matchedConcerns = user.concerns.filter(c => p.masalah.includes(c));

    // Bobot terbesar: kecocokan masalah kulit (0–45)
    score += (matchedConcerns.length / user.concerns.length) * 45;

    // Bonus spesifik kategori × masalah kulit (0–~15), lihat CATEGORY_CONCERN_BONUS
    const bonusTable = CATEGORY_CONCERN_BONUS[p.kategori];
    if (bonusTable){
      user.concerns.forEach(c => { if (bonusTable[c]) score += bonusTable[c]; });
    }

    // Efisiensi budget — makin murah relatif budget, makin tinggi (0–20)
    const hargaAcuan = (p.hargaMin + p.hargaMax) / 2;
    score += Math.max(0, (1 - (hargaAcuan / user.budget))) * 20;

    // Kecocokan eksplisit jenis kulit, bukan hasil fallback (0–15)
    if (!relaxedSkin) score += 15;

    // Sinyal dari kandungan untuk kulit sensitif
    if (user.skinType === "sensitif"){
      if (p.gentle) score += 10;
      if (p.strongActives) score -= 15;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /* --- 3d. TOP 3 PRODUK — weighted scoring murni (fitur #1) --- */
  function getTop3(user){
    let candidates = PRODUCTS.filter(p =>
      p.hargaMin <= user.budget && p.jenisKulit.includes(user.skinType)
    );
    let relaxed = false;
    if (candidates.length === 0){
      candidates = PRODUCTS.filter(p => p.hargaMin <= user.budget);
      relaxed = true;
    }

    const scored = candidates.map(p => ({
      ...p,
      score: computeScore(p, user, relaxed),
      matchedConcerns: user.concerns.filter(c => p.masalah.includes(c))
    }));

    scored.sort((a, b) => b.score - a.score);
    return { items: scored.slice(0, 3), relaxed };
  }

  /* --- 3e. RUTINITAS STEP-BY-STEP + SMART BUDGETING (fitur #2 & #3) --- */
  function pickForSteps(stepDefs, user, preferCheap){
    const chosen = [];
    let total = 0;

    stepDefs.forEach(def => {
      let candidates = PRODUCTS.filter(p =>
        def.categories.includes(p.kategori) && p.jenisKulit.includes(user.skinType)
      );
      let relaxedStep = false;
      if (candidates.length === 0){
        candidates = PRODUCTS.filter(p => def.categories.includes(p.kategori));
        relaxedStep = true;
      }
      if (candidates.length === 0){
        chosen.push({ def, product: null, cost: 0 });
        return;
      }

      const scored = candidates.map(p => ({ ...p, score: computeScore(p, user, relaxedStep) }));
      scored.sort((a, b) => preferCheap ? (a.hargaMin - b.hargaMin) : (b.score - a.score));
      const pick = scored[0];

      chosen.push({ def, product: pick, cost: pick.hargaMin });
      total += pick.hargaMin;
    });

    return { steps: chosen, total };
  }

  function buildRoutine(user){
    // 1) Rutinitas lengkap, produk terbaik (skor tertinggi) per langkah
    const complete = pickForSteps(FULL_STEPS, user, false);
    if (complete.total <= user.budget){
      return { type: "complete", ...complete };
    }
    // 2) Rutinitas lengkap versi hemat (produk termurah per langkah)
    const completeHemat = pickForSteps(FULL_STEPS, user, true);
    if (completeHemat.total <= user.budget){
      return { type: "complete-hemat", ...completeHemat };
    }
    // 3) Basic Kit (hanya langkah esensial: Wash, Moisturizer, Sunscreen), skor terbaik
    const basic = pickForSteps(ESSENTIAL_STEPS, user, false);
    if (basic.total <= user.budget){
      return { type: "basic", ...basic };
    }
    // 4) Basic Kit versi hemat
    const basicHemat = pickForSteps(ESSENTIAL_STEPS, user, true);
    if (basicHemat.total <= user.budget){
      return { type: "basic-hemat", ...basicHemat };
    }
    // 5) Bahkan Basic Kit hemat pun tidak cukup — beri notifikasi edukatif
    return { type: "insufficient", ...basicHemat };
  }

  /* ---------------------------------------------------------
     4. DATA INSIGHT — dicatat "di balik layar" (fitur #4)
     DEMO: memakai localStorage karena ini frontend statis tanpa
     backend. Untuk analitik lintas-pengguna yang sesungguhnya,
     ganti/lengkapi logToBackend() agar mengirim ke API/database
     nyata (lihat skema tabel `rekomendasi_log` yang sudah dirancang
     sebelumnya) — localStorage hanya tersimpan di browser ini saja.
  --------------------------------------------------------- */
  const INSIGHT_LOG_KEY   = "usm_insight_log";
  const INSIGHT_MAX_LOG   = 300;

  function readJSON(key, fallback){
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch(e){ return fallback; }
  }
  function writeJSON(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){ /* storage penuh/disabled, abaikan */ }
  }

  // Placeholder untuk backend sungguhan — aman dipanggil walau belum ada API
  async function logToBackend(entry){
    try {
      // Ganti URL di bawah dengan endpoint API kamu, contoh:
      // await fetch("/api/rekomendasi-log", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(entry)
      // });
    } catch(e){ /* silent-fail: insight bukan fitur kritis, tidak boleh mengganggu UX */ }
  }

  function recordInsight(user, top3Result, routineResult){
    const entry = {
      ts: new Date().toISOString(),
      skinType: user.skinType,
      concerns: user.concerns,
      budget: user.budget,
      routineType: routineResult.type,
      recommendedIds: top3Result.items.map(p => p.id)
    };

    const log = readJSON(INSIGHT_LOG_KEY, []);
    log.push(entry);
    while (log.length > INSIGHT_MAX_LOG) log.shift();
    writeJSON(INSIGHT_LOG_KEY, log);

    logToBackend(entry);
  }

  function getInsightAggregates(){
    const log = readJSON(INSIGHT_LOG_KEY, []);
    const concernCounts = {};
    const productCounts = {};

    log.forEach(entry => {
      entry.concerns.forEach(c => { concernCounts[c] = (concernCounts[c] || 0) + 1; });
      entry.recommendedIds.forEach(id => { productCounts[id] = (productCounts[id] || 0) + 1; });
    });

    return { total: log.length, concernCounts, productCounts };
  }

  /* ---------------------------------------------------------
     5. RENDER HASIL KE MODAL
  --------------------------------------------------------- */
  const modal          = document.getElementById("resultModal");
  const resultList      = document.getElementById("resultList");
  const resultSummary   = document.getElementById("resultSummary");
  const routineStatusEl = document.getElementById("routineStatus");
  const routineStepsEl  = document.getElementById("routineSteps");
  const routineTotalEl  = document.getElementById("routineTotal");
  const insightPanel    = document.getElementById("insightPanel");

  function fillColorForScore(score){
    if (score >= 85) return "#2F5443";
    if (score >= 65) return "#7BA88A";
    return "#E8927C";
  }
  function formatRupiah(num){
    return "Rp" + Math.round(num).toLocaleString("id-ID");
  }
  function formatHargaRange(p){
    if (p.hargaMin === p.hargaMax) return formatRupiah(p.hargaMin);
    return `${formatRupiah(p.hargaMin)} – ${formatRupiah(p.hargaMax)}`;
  }

  /* --- 5a. Render tab "Top 3 Produk" --- */
  function renderTop3(user, result){
    const { items, relaxed } = result;

    resultSummary.textContent = relaxed
      ? `Belum ada produk yang 100% cocok dengan jenis kulit "${user.skinType}" dalam budget ${formatRupiah(user.budget)}, berikut alternatif terbaik yang kami temukan.`
      : `Berdasarkan kulit ${user.skinType}, keluhan ${user.concerns.map(c => CONCERN_LABEL[c]).join(", ")}, dan budget ${formatRupiah(user.budget)}.`;

    if (items.length === 0){
      resultList.innerHTML = `<p class="empty-state">Belum ada produk yang cocok untuk kombinasi ini. Coba naikkan budget atau kurangi jumlah masalah kulit yang dipilih.</p>`;
      return;
    }

    const rankClass = ["rank-1", "rank-2", "rank-3"];

    resultList.innerHTML = items.map((p, i) => {
      const reasonText = p.matchedConcerns.length > 0
        ? `Cocok untuk ${p.matchedConcerns.map(c => CONCERN_LABEL[c]).join(" & ")}`
        : `Cocok untuk jenis kulit ${user.skinType}`;

      return `
        <article class="product-card">
          <span class="rank-badge ${rankClass[i]}">#${i + 1}</span>
          <div class="product-card__icon">${p.icon}</div>
          <div class="product-card__body">
            <h3>${p.nama}</h3>
            <p class="product-card__meta">${p.kategori} · ${p.kandungan}</p>
            <span class="product-card__price">${formatHargaRange(p)}</span><br>
            <span class="product-card__reason">${reasonText}</span>
          </div>
          <div class="match-gauge" style="--fill-color:${fillColorForScore(p.score)}">
            <div class="match-gauge__fill" data-fill="${p.score}"></div>
            <span class="match-gauge__label">${p.score}%</span>
          </div>
        </article>
      `;
    }).join("");

    requestAnimationFrame(() => {
      resultList.querySelectorAll(".match-gauge__fill").forEach(el => {
        el.style.height = el.dataset.fill + "%";
      });
    });
  }

  /* --- 5b. Render tab "Rutinitas Rekomendasi" (step-by-step + smart budgeting) --- */
  const ROUTINE_STATUS_META = {
    "complete":       { cls: "status--complete",     text: "✅ Rutinitas lengkap — sesuai budget kamu" },
    "complete-hemat": { cls: "status--hemat",         text: "✅ Rutinitas lengkap — versi hemat agar muat di budget" },
    "basic":          { cls: "status--basic",         text: "ℹ️ Basic Kit — 3 langkah esensial (budget belum cukup untuk rutinitas lengkap)" },
    "basic-hemat":    { cls: "status--basic",         text: "ℹ️ Basic Kit versi hemat — 3 langkah esensial dengan produk paling ekonomis" },
    "insufficient":   { cls: "status--insufficient",  text: "⚠️ Budget belum cukup, bahkan untuk Basic Kit versi hemat" },
  };

  function renderRoutine(user, routine){
    const meta = ROUTINE_STATUS_META[routine.type];
    routineStatusEl.className = "routine-status " + meta.cls;
    routineStatusEl.textContent = meta.text;

    routineStepsEl.innerHTML = routine.steps.map(step => {
      if (!step.product){
        return `
          <li class="routine-step is-optional-missing">
            <div class="routine-step__marker">${step.def.icon}</div>
            <div class="routine-step__body">
              <p class="routine-step__label">${step.def.label}</p>
              <p class="routine-step__empty">Belum ada produk yang cocok untuk langkah ini.</p>
            </div>
          </li>`;
      }
      const p = step.product;
      return `
        <li class="routine-step">
          <div class="routine-step__marker">${step.def.icon}</div>
          <div class="routine-step__body">
            <p class="routine-step__label">${step.def.label}</p>
            <p class="routine-step__product">${p.nama}</p>
            <p class="routine-step__meta">${p.kategori} · ${p.kandungan}</p>
            <span class="routine-step__price">${formatHargaRange(p)}</span>
          </div>
        </li>`;
    }).join("");

    const overBudget = routine.total > user.budget;
    const isEssentialOnly = routine.type.startsWith("basic");

    let noteHTML = "";
    if (routine.type === "complete-hemat"){
      noteHTML = `<p class="edu-note">💡 Kami pilih varian termurah di tiap langkah agar totalnya muat di budget-mu. Naikkan budget sedikit untuk membuka pilihan produk premium.</p>`;
    } else if (isEssentialOnly){
      const fullMinCost = pickForSteps(FULL_STEPS, user, true).total;
      noteHTML = `<p class="edu-note">💡 Budget kamu saat ini cukup untuk 3 langkah dasar (Facial Wash, Moisturizer, Sunscreen). Untuk rutinitas lengkap dengan Toner & Serum/Treatment, siapkan minimal sekitar ${formatRupiah(fullMinCost)}.</p>`;
    } else if (routine.type === "insufficient"){
      const shortfall = routine.total - user.budget;
      noteHTML = `<p class="edu-note edu-note--warning">⚠️ Budget kamu masih kurang sekitar ${formatRupiah(shortfall)} untuk Basic Kit paling hemat sekalipun. Coba naikkan budget atau beli bertahap: mulai dari Facial Wash & Sunscreen dulu, tambah Moisturizer belakangan.</p>`;
    }

    routineTotalEl.innerHTML = `
      <span>Total estimasi: ${formatRupiah(routine.total)} <span style="font-weight:600;color:var(--color-muted)">/ budget ${formatRupiah(user.budget)}</span></span>
      <span class="${overBudget ? "over-budget" : ""}">${overBudget ? "Melebihi budget" : "Sesuai budget"}</span>
    `;
    if (noteHTML) routineTotalEl.insertAdjacentHTML("afterend", noteHTML);
  }

  /* --- 5c. Tab switching --- */
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      const targetPanel = btn.dataset.tab;
      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("is-active", panel.dataset.panel === targetPanel);
      });
    });
  });

  /* --- 5d. Insight panel (admin, demo) --- */
  function renderInsightPanel(){
    const { total, concernCounts, productCounts } = getInsightAggregates();
    document.getElementById("insightTotal").textContent = total;

    const concernEl = document.getElementById("insightConcerns");
    const sortedConcerns = Object.entries(concernCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxConcern = sortedConcerns.length ? sortedConcerns[0][1] : 1;
    concernEl.innerHTML = sortedConcerns.length
      ? sortedConcerns.map(([key, count]) => `
          <li class="insight-bar-row">
            <div class="insight-bar-row__label"><span>${CONCERN_LABEL[key] || key}</span><span>${count}x</span></div>
            <div class="insight-bar-track"><div class="insight-bar-fill" style="width:${(count / maxConcern) * 100}%"></div></div>
          </li>`).join("")
      : `<li class="empty-state">Belum ada data. Isi kuesioner minimal 1x dulu.</li>`;

    const productEl = document.getElementById("insightProducts");
    const sortedProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxProduct = sortedProducts.length ? sortedProducts[0][1] : 1;
    productEl.innerHTML = sortedProducts.length
      ? sortedProducts.map(([id, count]) => {
          const p = PRODUCTS.find(pr => pr.id === Number(id));
          return `
            <li class="insight-bar-row">
              <div class="insight-bar-row__label"><span>${p ? p.nama : "Produk #" + id}</span><span>${count}x</span></div>
              <div class="insight-bar-track"><div class="insight-bar-fill" style="width:${(count / maxProduct) * 100}%"></div></div>
            </li>`;
        }).join("")
      : `<li class="empty-state">Belum ada data. Isi kuesioner minimal 1x dulu.</li>`;
  }

  document.getElementById("toggleInsight").addEventListener("click", () => {
    const willShow = insightPanel.hidden;
    insightPanel.hidden = !willShow;
    if (willShow) renderInsightPanel();
  });
  document.getElementById("resetInsight").addEventListener("click", () => {
    writeJSON(INSIGHT_LOG_KEY, []);
    renderInsightPanel();
  });

  /* ---------------------------------------------------------
     6. MODAL OPEN/CLOSE
  --------------------------------------------------------- */
  function openModal(){
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModalFn(){
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.getElementById("closeModal").addEventListener("click", closeModalFn);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModalFn(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModalFn(); });

  document.getElementById("restartQuiz").addEventListener("click", () => {
    closeModalFn();
    form.reset();
    document.querySelectorAll(".field-error").forEach(el => el.hidden = true);
    goToStep(0);
  });

  /* ---------------------------------------------------------
     SUBMIT FORM → jalankan Top 3 + Rutinitas → catat insight → tampilkan modal
  --------------------------------------------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const budgetValue = Number(document.getElementById("budget").value);
    if (!budgetValue || budgetValue <= 0){
      document.getElementById("budget").focus();
      return;
    }

    const user = {
      skinType: document.getElementById("skinType").value,
      concerns: Array.from(document.querySelectorAll('input[name="concerns"]:checked')).map(el => el.value),
      budget: budgetValue
    };

    const top3Result   = getTop3(user);
    const routineResult = buildRoutine(user);

    renderTop3(user, top3Result);
    renderRoutine(user, routineResult);
    recordInsight(user, top3Result, routineResult);

    // Selalu buka modal di tab "Top 3" dulu tiap submit baru
    document.querySelector('.tab-btn[data-tab="top3"]').click();
    insightPanel.hidden = true;

    openModal();
  });

});
