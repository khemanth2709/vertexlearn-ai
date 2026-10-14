# Implementation Plan: VertexLearn AI Branding & Exact Certificate Engine

Replace existing placeholder branding across the entire LMS with the official **VertexLearn AI Education Logo** and implement the exact **White, Deep-Red & Gold Certificate of Completion** design with client-side A4 landscape PDF generation, cryptographic verification QR code, database persistence, and course completion gating.

---

## 1. Official Logo Asset Integration & Global Website Rebranding

- **Asset Generation (`public/assets/branding/`)**:
  - Replicate the official logo from the user's reference: Graduation cap atop a stylized faceted blue 'V' with an inner learner figure, orbiting purple-blue swoosh, star sparkle, and bold two-tone wordmark ("**Vertex**" in navy, "**Learn**" in cyan, "**AI**" in royal purple) with "Intelligent Learning Management System" subtitle.
  - Provide crisp vector SVG (`vertexlearn-logo.svg`), standalone emblem icon (`vertexlearn-icon.svg`), high-res PNG fallback, and browser favicon (`favicon.ico` / `favicon.svg`).
- **Global Header, Navbar & Navigation**:
  - Update `src/components/layout/Navbar.tsx` and `src/components/layout/Sidebar.tsx` with the new responsive official logo asset and accessible alt text.
  - Update `index.html` title, metadata, and favicon links to match the official branding.
- **Authentication & Dashboard Pages**:
  - Update `src/components/public/LoginPage.tsx`, `StudentRegistrationPage.tsx`, `ForgotPasswordPage.tsx`, and `LandingPage.tsx` with the new official logo.
  - Update student, instructor, and admin dashboards (`StudentDashboard.tsx`, `InstructorDashboard.tsx`, `AdminComplianceDashboard.tsx`).

---

## 2. Exact White-and-Red A4 Landscape Certificate Design

Recreate the visual hierarchy matching the user's reference image:
- **Dimensions & Layout**:
  - A4 Landscape: 297mm × 210mm (1.414 aspect ratio).
  - Clean white canvas with geometric, multi-faceted deep-red corner ornaments (top-left & bottom-right ruby red polygonal folded ribbons).
  - Outer hairline golden accent borders, inner framing lines, and subtle guilloche background wave patterns.
- **Typography & Content Hierarchy**:
  - Top header: Official VertexLearn AI logo with mortarboard emblem; top-right vertical motto ("LEARN / PRACTICE / GROW / ACHIEVE").
  - Title: Formal serif typography: "CERTIFICATE OF COMPLETION" with gold accent ornament dividers.
  - Recipient line: "THIS IS TO CERTIFY THAT" followed by elegant calligraphic recipient name (cursive script style).
  - Course line: "HAS SUCCESSFULLY COMPLETED THE" followed by bold modern title (e.g., "Full Stack Web Development") and "AN ONLINE COURSE OFFERED BY VERTEXLEARN AI".
  - Accreditation narrative: "This certifies the successful completion of all course requirements, including the lessons, assessments, and hands-on projects."
  - Executive Signatures: Authorized signatures ("Dr. Priya Sharma, CEO" and "Rahul Verma, Head of Academic Programs").
  - Central Emblem: High-detail gold medallion seal with red ribbon tails.
  - Issue metadata & QR Code: Date of Issue, unique Certificate ID (e.g., `VXAI-FSWD-2026-00456`), and a functional QR Code pointing directly to `/verify/:certificateId`.
  - Bottom left: "SKILLS TODAY | A BRIGHTER TOMORROW".

---

## 3. High-Resolution Vector PDF Generation Engine

- **Client-Side Vector PDF Generator**:
  - Implement canvas/vector PDF export targeting standard A4 landscape (3508 × 2480 px at 300 DPI print quality).
  - Ensure zero text clipping, crisp SVG rendering, proper margins, and instant file download (`VertexLearn_Certificate_{COURSE_CODE}_{STUDENT_NAME}.pdf`).
  - Provide instant interactive certificate preview modal with zoom and high-res print options.

---

## 4. Verification QR Code & Public Verification Page

- **QR Code Generation**:
  - Render an SVG/canvas QR code linked to the application's verification endpoint: `https://<app-domain>/verify/{certificate_id}`.
- **Dedicated Public Verification Route (`/verify/:certificateId`)**:
  - Create `src/components/public/CertificateVerificationPage.tsx` accessible without requiring prior login.
  - Validates certificate ID against the database: displays student name, course title, issue date, instructor signatures, verification hash, and status badge ("VALID & ACCREDITED" or "INVALID / NOT FOUND").
  - Mount `/verify/:certificateId` route in `src/App.tsx`.

---

## 5. Course Completion Gating, Eligibility Rules & Security

- **Completion Validation**:
  - Enforce backend and context-level verification: certificate generation is strictly locked until all modules, video lessons, and quizzes for the course are 100% completed with passing scores.
  - Display remaining requirements progress bar and locked state in Student Dashboard and Course Player for incomplete courses.
- **Database Persistence & Idempotency**:
  - Persist certificate records in `.data/certificates.json` and `server.ts` with unique `certificateId` constraints.
  - Prevent duplicate certificate issuance when clicking download repeatedly.

---

## 6. End-to-End Testing & Verification

1. Verify logo asset displays cleanly across Navbar, Login, Register, Dashboards, and Certificate.
2. Confirm A4 landscape certificate matches reference image (colors, corners, gold seal, signatures, QR code).
3. Test QR code scan to `/verify/:certificateId` and verify database lookup.
4. Verify certificates remain locked until 100% course progress is achieved.
5. Run `lint_applet` and `compile_applet` to confirm zero TypeScript or build errors.
6. Run `vitest run` to ensure all existing and new tests pass.
