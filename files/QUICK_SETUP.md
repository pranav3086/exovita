# 🚀 Quick Setup Reference

## File Replacements

### 1. Cover Page (Landing/Search)
**File**: `src/app/page.tsx`
**Replace with**: `index-page.tsx`
**Purpose**: Main landing page with search and autocomplete

### 2. Dashboard (3D Visualization)
**File**: `src/app/dashboard/page.tsx`
**Replace with**: `dashboard-page.tsx`
**Purpose**: 3D planet visualization that accepts URL parameters

### 3. Data File
**File**: `public/embedded_data.js`
**Action**: ADD (not replace)
**Purpose**: Contains all 4,575 exoplanet data

---

## Components (NO CHANGES NEEDED)

These files stay exactly as they are:
- ✅ `src/components/HabitabilityChart.tsx`
- ✅ `src/components/PlanetScene.tsx`
- ✅ `src/components/ProceduralPlanetMaterial.tsx`

---

## Commands

```bash
# 1. Add data file
cp embedded_data.js public/

# 2. Backup current page
cp src/app/page.tsx src/app/page.tsx.backup

# 3. Replace root page with cover page
cp index-page.tsx src/app/page.tsx

# 4. Create dashboard directory
mkdir -p src/app/dashboard

# 5. Replace dashboard page
cp dashboard-page.tsx src/app/dashboard/page.tsx

# 6. Run app
npm run dev
```

---

## Routes

After setup:
- `/` → Cover page with search
- `/dashboard` → 3D visualization
- `/dashboard?planet=Kepler-452%20b` → 3D visualization with specific planet

---

## Testing Quick Check

1. Go to `http://localhost:3000`
2. Type "Kepler" in search
3. See suggestions appear
4. Click "Kepler-452 b"
5. Should navigate to dashboard
6. Should show 3D planet
7. Should see "Back to Search" button

✅ If all work, you're done!

---

## What Changed

### Cover Page (New Features):
- Search with autocomplete
- Chrome-style suggestions dropdown
- Featured planets grid
- Keyboard navigation
- Links to dashboard with URL params

### Dashboard (New Features):
- Accepts `?planet=` URL parameter
- "Back to Search" button
- Shows searched planet name
- Expanded planet database (9 planets)
- Auto-selects planet from URL

### Dashboard (Preserved):
- All 3D visualization
- Time slider
- Simulation
- Habitability charts
- All original styling
- All original animations

---

## That's It! 🎉

You now have a complete exoplanet exploration system with search integration!