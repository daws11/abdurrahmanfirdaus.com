---
title: Halaman Project Tersendiri (5 Case Study Pages)
date: 2026-08-05
status: approved
owner: Abdurrahman Firdaus
source-task: Pemisahan naratif case study dari home page; demo live reachable dari tiap halaman
---

# Halaman Project Tersendiri (5 Case Study Pages)

## 1. Konteks & masalah

Section **"Case studies · 03 / 05 — Inside the work."** di home page (`src/components/sections/work.tsx`) saat ini merender **3 dari 5 project** sebagai naratif panjang (rata-rata ~175 kata per study, total ~525 kata), lengkap dengan FDE callout, kicker, impact chips, stack, integrations, dan tombol "Read the code". Hasilnya:

- Home page terlalu berat di section ini; section lain (Metrics, Experience, Contact) tenggelam.
- Pengunjung melihat 5 project di section `Projects` (`<FocusRail>`), lalu hanya 3 yang dibahas mendalam — asimetri yang tidak terjelaskan.
- 2 project lain (Kitchen Fresh, People & Culture) sebenarnya punya demo prototype live (`status: "live"` di `src/demos/_index.ts`) tapi tidak punya naratif.
- Pintu masuk ke demo ("Try demo →") hanya link kecil di pojok visual, kalah dominan dengan tombol "Read the code" — sinyal UX yang salah untuk portfolio yang pembeda utamanya adalah demo interaktif.
- Tidak ada permalink untuk satu project — URL `#/demos/{id}` mengarah ke prototype, bukan narasi.

Tujuan: **setiap project punya halaman naratif sendiri dengan pintu jelas menuju demo live**, dan home page dirampingkan sehingga section lain mendapat napas.

## 2. Keputusan yang sudah disetujui (dari brainstorming 2026-08-05)

1. **Pendekatan:** Opsi C — halaman naratif di marketing site pada hash `#/projects/{id}`, tetap dalam layout marketing (Navbar + brand), CTA besar "Open the demo →" mengarah ke demo shell.
2. **Naratif Kitchen Fresh & People & Culture:** pilihan (a) — tulis narasi lengkap seperti 3 sisanya. Konten dikumpulkan lewat **wawancara terpandu (5-7 pertanyaan per project)** saat implementasi.
3. **Section header di home:** diganti dari `"Case studies · 03 / 05"` menjadi `"Case studies · 05 / 05 — inside the work."`.
4. **Spec workflow:** semua 5 bagian desain disetujui; spec ditulis ke disk dulu, user review, baru implementasi.

## 3. Arsitektur

### 3.1 Tiga mode render di `DemoGate`

`src/demos/_shared/DemoGate.tsx` saat ini menerima dua child (`marketing`, `demo`) dan memilih satu berdasarkan hash. Diubah jadi tiga mode:

| Hash aktif | Mode yang dirender |
|---|---|
| `#/demos` atau `#/demos/...` | `demo` — DemoRouter (tidak berubah) |
| `#/projects/{id}` | `project` — ProjectPage (baru) di dalam layout marketing |
| Lainnya | `marketing` — MarketingSite (tidak berubah) |

Perubahan `DemoGate`:

```ts
type Mode = "marketing" | "project" | "demo";

function detectMode(hash: string): Mode {
  if (hash === "#/demos" || hash.startsWith("#/demos/")) return "demo";
  if (hash.startsWith("#/projects/")) return "project";
  return "marketing";
}
```

Tiga child prop (atau render-prop object) ditambahkan; struktur existing tidak diutak-atik selain penambahan kondisi ini.

### 3.2 Hook routing baru

`src/demos/router.tsx` punya `useDemoRoute` (~40 baris, hash parser + listener). Untuk halaman project, dibuat paralel kecil:

**`src/lib/use-project-route.ts`** — file baru.

```ts
export interface ProjectRoute {
  id: DemoId | null;
}

export function useProjectRoute(): ProjectRoute {
  // parsing "#/projects/{id}" -> DemoId | null
  // listener 'hashchange' -> setState
}
```

Logikanya identik dengan `useDemoRoute` tetapi tanpa sub-route (tidak ada `#/projects/{id}/{sub}`).

### 3.3 URL shape final

- `#/projects/invoice-sense` → halaman naratif Invoice Sense
- `#/projects/invenflow`
- `#/projects/channelflow`
- `#/projects/kitchen-fresh`
- `#/projects/people-culture`
- `#/projects/foo` (invalid) → `ProjectNotFound` (mirror `DemoNotFound`)

Tidak ada path nested di bawah `#/projects/{id}`. Tidak ada perubahan pada URL demo (`#/demos/{id}/{sub}`).

## 4. Komponen

### 4.1 File baru

| Path | Tanggung jawab |
|---|---|
| `src/components/sections/ProjectPage.tsx` | Wrapper: parse id, lookup story, render layout atau NotFound. Dipasang di mode `project` DemoGate. |
| `src/components/sections/project/Hero.tsx` | Hero visual project — reuse pola `<img>` 3:4 + border + shadow dari `work.tsx:69-87`. |
| `src/components/sections/project/Narrative.tsx` | Render `story` dengan parser `**bold**`. Panggil util `renderInlineBold` dari util baru. |
| `src/components/sections/project/Sidebar.tsx` | FDE callout, impact chips, stack, integrations, outcomes list. Reuse kelas dari `work.tsx:91-169`. |
| `src/components/sections/project/CtaToDemo.tsx` | Tombol "Open the demo →" besar + tombol sekunder "Read the code" ke repo. |
| `src/lib/inline-bold.tsx` | Ekstrak `renderInlineBold` dari `work.tsx:216-229`. Tidak ada duplikasi. |
| `src/lib/use-project-route.ts` | Routing hook (lihat §3.2). |

### 4.2 File yang dimodifikasi

| Path | Perubahan |
|---|---|
| `src/App.tsx` | Mount `<ProjectPage>` ketika `DemoGate` mode = `project`. Implementasi: tambahkan `<ProjectPage />` sebagai child ketiga DemoGate. |
| `src/demos/_shared/DemoGate.tsx` | Tambah mode `project` + child `project`. Lihat §3.1. |
| `src/data/portfolio.ts` | Tambah interface `ProjectStory` dan array `projectStories: ProjectStory[]` untuk 5 entry. Hapus atau pertahankan `caseStudies[]` lama? — **lihat §6**. |
| `src/components/sections/work.tsx` | Refactor jadi kartu ringkas (lihat §5.3). Ekstrak `renderInlineBold` ke util bersama. |
| `src/components/sections/projects.tsx` | Tidak berubah secara struktural; CTA bisa ikut update tapi minimal. |

### 4.3 Yang TIDAK disentuh

- `src/demos/router.tsx` — logika demo route dan `ComingSoon` tidak berubah.
- 5 file demo di `src/demos/{id}/` — `index.tsx`, `routes.tsx`, `mocks.ts`, `README.md` dan semua screens.
- `src/demos/_shared/` (kecuali `DemoGate.tsx`) — primitives tetap dipakai prototype.
- Aset visual di `public/assets/images/projects/*.svg` — sudah ada5 file.
- `src/components/sections/{hero,about,metrics,experience,contact,navbar}.tsx`.

## 5. Alur data

### 5.1 Schema baru: `ProjectStory`

```ts
// di src/data/portfolio.ts
export interface ProjectStory {
  id: DemoId;                                  // konsisten dengan registry
  division: string;                             // "Finance" | "Inventory · ..." | ...
  kicker: string;                               // scene-setter
  fdeCallout: string;                           // what I did as FDE here
  story: string;                                // "**Discovery.** ...\n\n**Built.** ...\n\n**Outcome.** ..."
  impact: { label: string; value: string }[];
  outcomes: string[];                           // 3-5 bullet eksekusi tambahan
  stack: string[];
  integrations: string[];
  heroSrc: string;
  duration: string;                             // "Q3 2025 – present"
  teamSize: string;                             // "Solo + 1 booking"
  repoHref: string;                             // GitHub repo URL
}

export const projectStories: ProjectStory[] = [
  // 5 entry — id: "invenflow" | "invoice-sense" | "channelflow"
  //            | "kitchen-fresh" | "people-culture"
];
```

### 5.2 Sumber data

| Project | Sumber naratif & data |
|---|---|
| Invoice Sense | Salin dari `caseStudies[0]` di `portfolio.ts:404-421`. Field tambahan (`duration`, `teamSize`, `outcomes`) dari `experience[0].roles[0-1]` (`portfolio.ts:210-228`). |
| Invenflow | Salin dari `caseStudies[1]` (`portfolio.ts:422-439`). Field tambahan dari experience. |
| Channelflow | Salin dari `caseStudies[2]` (`portfolio.ts:440-470`). Field tambahan dari experience. |
| Kitchen Fresh | **Naratif baru** — dikumpulkan lewat wawancara terpandu saat implementasi. Lihat §7. |
| People & Culture | **Naratif baru** — dikumpulkan lewat wawancara terpandu saat implementasi. Lihat §7. |

### 5.3 Refactor `work.tsx` jadi kartu ringkas

Section `Work` di home page saat ini merender naratif lengkap. Setelah refactor:

- Section header baru: `"Case studies · 05 / 05 — inside the work."` (subheading boleh dipertahankan atau dipersingkat, lihat §6).
- Render `<CaseStudyCard>` per project (5 kartu, bukan 3):
  - Hero visual kecil + division chip + kicker 1 kalimat + 1 impact chip.
  - Tombol: **"Read the case study →"** → `#/projects/{id}` (utama), **"Try demo →"** → `#/demos/{id}` (sekunder).
- Tidak ada lagi paragraf panjang, FDE callout, stack, integrations di home.
- Layout tetap dua-kolom-besar dengan visual alternating (reuse pola `reverse = index % 2 === 1` dari `work.tsx:52`).

### 5.4 Migrasi `caseStudies[]` lama

`caseStudies[]` di `portfolio.ts:404` adalah schema berbeda (`id: string` polymorphic, tidak punya `DemoId`). Dua opsi dipertimbangkan:

- **(i) Pertahankan + adopsi:** rename jadi `legacyCaseStudies` dan tetap ekspor untuk kompatibilitas. Tidak dipakai lagi oleh UI; jadi dead code.
- **(ii) Hapus:** migrasi ke `projectStories[]`. Lebih bersih, tapi menghapus export yang mungkin dipakai external (cek dulu dengan grep — saat ini dipakai hanya oleh `work.tsx:3`).

**Keputusan: opsi (ii) hapus `caseStudies[]`** — `work.tsx` akan direfactor total dan import dihapus. Tidak ada external consumer lain (terverifikasi via `grep -r caseStudies src/`).

### 5.5 Validasi id

`useProjectRoute` mengembalikan `DemoId | null`. `ProjectPage`:
- `null` → render `ProjectNotFound` (mirror gaya `DemoNotFound` di `src/demos/_shared/DemoNotFound.tsx`).
- tidak ditemukan di `projectStories[]` → juga `ProjectNotFound`.
- ditemukan → render layout.

## 6. Scope yang LUAR (out of scope)

- Tidak menyentuh backend atau build pipeline (`vite.config.ts`, `package.json`).
- Tidak menambah route library baru (cukup hook 20-baris).
- Tidak menambah state management baru.
- Tidak menulis narasi Kitchen Fresh & People & Culture di spec ini — konten adalah deliverable implementasi via wawancara.
- Tidak menambah tema baru atau brand baru untuk project pages — pakai tema marketing (`bg-neutral-950`, `text-white`, `border-white/10`, aksen `emerald-400`) konsisten dengan home.
- Tidak menyentuh navbar mobile menu structure — section header di navbar tetap (`#home`, `#about`, `#projects`, `#work`, `#experience`, `#contact`). Tautan ke halaman project diakses dari kartu Work atau Projects, bukan dari navbar.
- Tidak ada migrasi data ke database — `projectStories[]` tetap TypeScript literal di `portfolio.ts`.
- Tidak ada analytics event baru (tidak diminta).

## 7. Strategi implementasi (urutan)

1. **Fondasi routing**
   - Buat `src/lib/use-project-route.ts`.
   - Buat `src/lib/inline-bold.tsx` (ekstrak dari `work.tsx`).
2. **Data**
   - Tambah interface `ProjectStory` di `portfolio.ts`.
   - Salin 3 entry dari `caseStudies[]` ke `projectStories[]` dengan field tambahan (`duration`, `teamSize`, `outcomes`).
   - Hapus `caseStudies[]` lama (setelah konfirmasi §5.4).
3. **Komponen project page**
   - `src/components/sections/project/Hero.tsx`, `Narrative.tsx`, `Sidebar.tsx`, `CtaToDemo.tsx`.
   - `src/components/sections/ProjectPage.tsx` (wrapper + NotFound).
4. **Gate + App**
   - Update `DemoGate.tsx` jadi 3 mode.
   - Update `App.tsx` mount `<ProjectPage>` untuk mode project.
5. **Refactor home Work section**
   - Update `work.tsx` jadi kartu ringkas (5 project, bukan 3).
   - Update section header jadi `"Case studies · 05 / 05 — inside the work."`.
6. **Wawancara terpandu untuk Kitchen Fresh & People & Culture**
   - Saya ajukan 5-7 pertanyaan per project (lihat lampiran A) di chat.
   - Jawaban Anda → saya susun narasi Discovery → Built → Outcome.
   - Anda review + approve sebelum narasi masuk `projectStories[]`.
7. **Verifikasi**
   - `npm run build` lulus.
   - Manual test5 URL `#/projects/{id}` (render benar, CTA demo berfungsi, hero muncul).
   - Manual test `#/projects/foo` → `ProjectNotFound`.
   - Manual test mobile responsive (stack vertikal <md).
   - Visual regression check: home page Work section tidak lebih panjang dari sebelumnya.

## 8. Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| DemoGate 3-mode regression pada mode existing | `demo` dan `marketing` identik dengan kondisi saat ini — logikanya hanya OR tambahan. Regresi mudah terdeteksi karena navigasi hash adalah perilaku inti. |
| Naratif Kitchen Fresh & People & Culture tertunda | Implementasi steps 1-5 tidak bergantung pada naratif. Step 6 (wawancara) dilakukan setelah halaman jadi — kartu Work untuk kedua project itu sementara render dengan field naratif kosong sampai wawancara selesai. Fallback eksplisit ini tidak menggantikan narasi; hanya menjaga kartu tidak pecah. |
| Home Work section jadi kosong/terlalu pendek | Risiko kecil karena sekarang isi5 project (bukan3). Tap visual dari 5 kartu ringkas ≥ 3 kartu panjang secara keseluruhan (estimasi byte: 3 × ~1100 + naratif ≈ 3 × ~2500 vs 5 × ~400 + naratif mini ≈ 5 × ~700). |
| `caseStudies[]` dipakai tempat lain | Sudah diverifikasi via grep — hanya `work.tsx` yang import. Aman dihapus setelah step 5 selesai. |
| URL `#/projects/{id}` conflict dengan planning ke depan (path-as-page, misalnya server route) | Hash router saat ini tanpa niat migrasi ke path routing. Catatan dicatat sebagai pertimbangan masa depan — di luar scope spec ini. |

## 9. Verifikasi sebelum selesai (definition of done)

- [ ] `npm run build` lulus tanpa error TypeScript.
- [ ] Semua 5 URL `#/projects/{id}` render dengan hero + kicker + FDE callout + story (3 paragraf) + impact + outcomes + stack + integrations + duration + team size + repo link + demo CTA.
- [ ] `#/projects/foo` → `ProjectNotFound`.
- [ ] Tombol "Open the demo →" mengarah ke `#/demos/{id}` dan demo shell mount.
- [ ] Work section di home render 5 kartu ringkas (bukan 3 naratif panjang).
- [ ] Section header berubah jadi `"Case studies · 05 / 05 — inside the work."`.
- [ ] `renderInlineBold` tidak duplikat — dipakai bersama via `src/lib/inline-bold.tsx`.
- [ ] `caseStudies[]` lama dihapus, tidak ada referensi menggantung.
- [ ] Mobile (<768px): setiap kartu project stack vertikal, CTA tetap reachable.
- [ ] Kitchen Fresh & People & Culture punya naratif lengkap (bukan placeholder).
- [ ] Tidak ada perubahan pada `src/demos/router.tsx`, `src/demos/_shared/*` (kecuali `DemoGate`), 5 file demo, atau aset SVG.

## Lampiran A — Template wawancara terpandu (5-7 pertanyaan per project)

Untuk Kitchen Fresh & People & Culture, saya akan ajukan:

1. **Konteks awal** — masalah operasional apa yang muncul sebelum app ini? Siapa yang paling terpengaruh?
2. **Discovery** — berapa lama Anda observasi sebelum nulis kode? Insight utama apa yang muncul?
3. **Built (scope)** — apa saja modul/board utama app ini? Bagaimana alur kerja harian penggunanya?
4. **Built (teknologi)** — stack apa yang dipakai? Integrasi apa yang dipasang (kalau ada)?
5. **Outcome terukur** — angka/kualitatif yang berubah setelah adopsi? (mis. jam kerja, error rate, jumlah lokasi)
6. **Adopsi** — siapa yang pakai tiap hari? Apakah ada resistensi awal? Bagaimana Anda mengatasinya?
7. **FDE moment** — adegan spesifik di mana Anda tahu app ini akan dipakai (atau tidak)?

Jawaban Anda jadi dasar narasi Discovery → Built → Outcome yang saya susun dan Anda approve.

## Lampiran B — Sumber referensi di codebase

- Section saat ini: `src/components/sections/work.tsx`
- Data naratif lama: `src/data/portfolio.ts:404-470` (interface di `:384-402`)
- Routing demo: `src/demos/router.tsx` (pola hash parser + listener)
- DemoGate: `src/demos/_shared/DemoGate.tsx`
- Registry 5 demo: `src/demos/_index.ts` (`DemoId`, `DEMOS[]`)
- App composition: `src/App.tsx`
- Demo NotFound style: `src/demos/_shared/DemoNotFound.tsx`
- Fungsi inline bold: `src/components/sections/work.tsx:216-229`
- Section lain: `src/components/sections/{projects,metrics,experience,contact,about,hero,navbar}.tsx`
- Aset visual: `public/assets/images/projects/{invenflow,invoice-sense,channelflow,kitchen-fresh,people-culture}.svg`