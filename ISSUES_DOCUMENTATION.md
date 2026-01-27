# AnimeStore - Issues Documentation

## Overview

This document contains a comprehensive analysis of all issues found in the AnimeStore project.
Issues are categorized by severity and organized by component/page.

**Analysis Date:** January 2026
**Total Issues Found:** 80+
**Critical Issues:** 12
**High Priority Issues:** 18
**Medium Priority Issues:** 35+

---

## Table of Contents

1. [Critical Issues (Must Fix First)](#critical-issues)
2. [Homepage & Filters Issues](#homepage--filters)
3. [Product Detail Page Issues](#product-detail-page)
4. [Admin Panel Issues](#admin-panel)
5. [Cart, Favorites, Account Pages](#cart-favorites-account)
6. [Components & Styles Issues](#components--styles)
7. [Data Layer & State Management](#data-layer--state-management)
8. [Accessibility Issues](#accessibility-issues)
9. [Fix Recommendations](#fix-recommendations)

---

## Critical Issues

### 1. Genre Filtering Completely Broken
- **Location:** `app/page.tsx` lines 31, 65
- **Problem:** Filter uses exact string match (`product.genre === selectedGenre`) but products have comma-separated genres (e.g., "Сёнэн, Экшен")
- **Impact:** Genre filtering doesn't work at all - no products match
- **Fix:** Change to `product.genre.includes(selectedGenre)` or split and check array

### 2. Missing `.stagger-0` CSS Class
- **Location:** `app/globals.css` lines 430-439, `components/product-card.tsx` line 33
- **Problem:** Code generates `stagger-0` class but CSS only defines `.stagger-1` through `.stagger-10`
- **Impact:** First product card has no animation delay, breaking stagger effect
- **Fix:** Add `.stagger-0 { animation-delay: 0s; }` to globals.css

### 3. Missing AnimatedBackground on Multiple Pages
- **Location:** `app/product/[id]/page.tsx`, `app/cart/page.tsx`, `app/favorites/page.tsx`, `app/account/page.tsx`
- **Problem:** Pages use plain `<div className="min-h-screen bg-background">` instead of `<AnimatedBackground>`
- **Impact:** "White screen" appearance, visual inconsistency with homepage
- **Fix:** Wrap all pages with `<AnimatedBackground>` component

### 4. Admin Panel Buttons Non-Functional
- **Location:** All admin pages (`users/page.tsx`, `products/page.tsx`, `orders/page.tsx`, `reviews/page.tsx`)
- **Problem:** All action buttons (edit, delete, approve, etc.) only call `console.log()`
- **Impact:** Admin panel is completely non-functional for management tasks
- **Fix:** Implement actual store operations and API calls

### 5. No prefers-reduced-motion Support
- **Location:** `app/globals.css`
- **Problem:** No `@media (prefers-reduced-motion: reduce)` block anywhere
- **Impact:** Users with vestibular disorders see full animations, accessibility violation
- **Fix:** Add reduced motion media queries to disable/reduce animations

### 6. Passwords Stored in Plaintext Client-Side
- **Location:** `data/users.json`, `hooks/use-auth.ts`
- **Problem:** Passwords are plaintext in JSON file, direct string comparison
- **Impact:** Major security vulnerability - authentication bypass possible
- **Fix:** Move auth to backend, use proper password hashing

---

## Homepage & Filters

### File: `app/page.tsx`

#### UI/UX Issues
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Genre list incomplete | 31 | HIGH | Missing genres: "Ужасы", "Супергерои" that exist in products |
| Filter icons identical | 276, 296 | MEDIUM | Genre and Type both use same Filter icon |
| No visual feedback | - | MEDIUM | No indication that filter is active until scrolling |
| Mobile filter state | 260 | LOW | Toggle doesn't show active filters when closed |

#### Code Quality Issues
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Hardcoded filter values | 31-32 | MEDIUM | Should be extracted to config |
| Magic numbers | 49, 58, 147 | LOW | 800ms, 4000ms, "HOT" not configurable |
| No error handling | 63-91 | MEDIUM | Products with missing fields could crash |
| Featured products static | 35 | LOW | Computed at module level, won't update |

#### Performance Issues
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| No search debounce | 63 | MEDIUM | Every keystroke triggers re-filter |
| Animation delay scaling | 429-430 | MEDIUM | 50+ products = 2.5s+ delay on last item |
| Missing image priority | 139-144 | LOW | Above-fold image lacks priority prop |

---

## Product Detail Page

### File: `app/product/[id]/page.tsx`

#### Critical Issues
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Missing AnimatedBackground | 95 | CRITICAL | Causes "white screen" appearance |
| No decorative elements | - | HIGH | Missing FloatingMangaPage, StarBurst, Sparkle |

#### Code Quality Issues
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Unsafe param parsing | 26 | MEDIUM | No validation before Number.parseInt |
| Redundant reviews.find | 28, 215 | LOW | Same lookup called twice |
| Inefficient cart add | 60-62 | LOW | Loop instead of batch operation |

#### Missing Features
- No loading skeleton for product image
- No breadcrumb navigation
- "View all" link resets filters instead of filtering by type

---

## Admin Panel

### Common Issues Across All Admin Pages

| Issue | Severity | Description |
|-------|----------|-------------|
| All actions are console.log only | CRITICAL | No actual save/delete functionality |
| No error handling | HIGH | Operations fail silently |
| No success feedback | HIGH | Users don't know if action worked |
| Currency shows ¥ instead of ₽ | MEDIUM | Wrong currency in orders page |
| No pagination | MEDIUM | Will slow down with 100+ items |
| No bulk operations | MEDIUM | Can't select multiple items |
| Mix of store and JSON data | MEDIUM | Inconsistent data sources |

### Dashboard (`app/admin/page.tsx`)
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Add Product button no handler | 523 | CRITICAL | Button does nothing |
| Hardcoded demo activities | 691-725 | MEDIUM | Shows fake data |
| Stats not real-time | - | MEDIUM | Calculated from static JSON |

### Users Page (`app/admin/users/page.tsx`)
| Issue | Severity | Description |
|-------|----------|-------------|
| Edit/Delete buttons log only | CRITICAL | No actual functionality |
| No add user feature | HIGH | Can't create new users |
| Delete uses browser confirm() | MEDIUM | Poor UX |

### Products Page (`app/admin/products/page.tsx`)
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| 50ms artificial delay | 114 | LOW | Unnecessary jank |
| No image upload | - | MEDIUM | Must paste URLs manually |
| No inventory tracking | - | MEDIUM | Missing stock management |

### Orders Page (`app/admin/orders/page.tsx`)
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Wrong currency symbol | 303 | MEDIUM | Shows ¥ instead of ₽ |
| Order ID truncated | 288 | LOW | Full ID not accessible |
| No order details view | 334 | MEDIUM | Eye button does nothing |

### Reviews Page (`app/admin/reviews/page.tsx`)
| Issue | Severity | Description |
|-------|----------|-------------|
| Approve/Reject log only | CRITICAL | No actual moderation |
| No filter by status | MEDIUM | Can't see pending reviews |
| No bulk moderation | MEDIUM | Must review one by one |

---

## Cart, Favorites, Account

### Cart Page (`app/cart/page.tsx`)
| Issue | Severity | Description |
|-------|----------|-------------|
| Missing AnimatedBackground | HIGH | Visual inconsistency |
| Uses alert() for checkout | MEDIUM | Bad UX, should use toast |
| No confirmation for clear | MEDIUM | Can accidentally clear cart |
| Missing glass morphism | MEDIUM | Doesn't match design system |

### Favorites Page (`app/favorites/page.tsx`)
| Issue | Severity | Description |
|-------|----------|-------------|
| Missing AnimatedBackground | HIGH | Visual inconsistency |
| No confirmation for clear | MEDIUM | Can accidentally clear all |
| No sorting/filtering | LOW | Can't organize favorites |

### Account Page (`app/account/page.tsx`)
| Issue | Severity | Description |
|-------|----------|-------------|
| Missing AnimatedBackground | HIGH | Visual inconsistency |
| Hardcoded status colors | MEDIUM | Not using design system |
| Password change uses alert() | MEDIUM | Bad UX |
| Order item.name vs item.title | LOW | Incorrect property access |
| Many `any` types | MEDIUM | Type safety issues |

---

## Components & Styles

### globals.css Issues
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Missing .stagger-0 | 430-439 | CRITICAL | First card doesn't animate |
| No prefers-reduced-motion | - | HIGH | Accessibility violation |
| Shimmer no dark mode contrast | 404-427 | HIGH | Skeleton invisible in dark |
| Image shine too bright in dark | 631-654 | HIGH | Effect barely visible |
| No scrollbar dark variant | 662-688 | MEDIUM | Scrollbar invisible |

### Header Component (`components/header.tsx`)
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Duplicate search forms | 54, 230, 330 | MEDIUM | Three separate implementations |
| Inconsistent animation classes | 221, 228 | LOW | Mixed delay notation |

### Product Card (`components/product-card.tsx`)
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| Forced empty description | 38, 47 | MEDIUM | Type workaround needed |
| No index validation | 33 | LOW | Assumes index >= 0 |

### Animated Background (`components/animated-background.tsx`)
| Issue | Line | Severity | Description |
|-------|------|----------|-------------|
| No mousemove throttle | 33-38 | MEDIUM | Performance issue |
| Invalid -z-5 z-index | 81 | MEDIUM | Not standard Tailwind |
| will-change overuse | 54, 58, 62, 66 | LOW | Increased memory |

---

## Data Layer & State Management

### Type Safety Issues
| Issue | Location | Severity | Description |
|-------|----------|----------|-------------|
| User type mismatch | store.ts, types/index.ts | CRITICAL | Store user doesn't match type |
| Missing isActive field | types/index.ts | HIGH | Used but not defined |
| ID type inconsistency | All data files | HIGH | Mix of number and string IDs |

### Store Missing Features
| Feature | Impact |
|---------|--------|
| No product persistence | Products reset on refresh |
| No reviews management | Can't add/edit reviews |
| No inventory tracking | No stock validation |
| searchQuery unused | Search state exists but not used |
| No cart validation | Can add non-existent products |

### Auth Flow Issues
| Issue | Severity | Description |
|-------|----------|-------------|
| Plaintext passwords | CRITICAL | Security vulnerability |
| No password hashing | CRITICAL | Passwords compared directly |
| Registration not persisted | HIGH | New users lost on refresh |
| No session management | HIGH | No tokens or expiration |
| No permission checks | HIGH | Admin ops not protected |

---

## Accessibility Issues

### Missing ARIA Labels
- Quantity control buttons (cart, product page)
- Favorite buttons
- Filter dropdowns
- Mobile menu toggle
- Carousel indicators

### Semantic HTML Issues
- No `<nav>` for navigation sections
- Filter list not using `<ul>/<li>`
- No skip links

### Color Contrast
- Muted foreground text may fail WCAG AA
- Status badges rely only on color

### Keyboard Navigation
- No focus trap in mobile menu
- No carousel keyboard controls
- Missing focus indicators

---

## Fix Recommendations

### Priority 1 - Critical (Fix Immediately)

1. **Fix genre filtering** - Change exact match to includes
2. **Add .stagger-0 CSS class** - Add to globals.css
3. **Add AnimatedBackground** - Wrap all pages
4. **Implement admin actions** - Replace console.log with store ops
5. **Add reduced-motion** - Accessibility requirement

### Priority 2 - High (Fix Soon)

1. **Complete filter genres list** - Add all genres from products
2. **Fix dark mode styles** - Shimmer, image shine, scrollbar
3. **Add loading states** - Skeletons for async operations
4. **Replace alert() calls** - Use toast notifications
5. **Add confirmation dialogs** - For destructive actions

### Priority 3 - Medium (Improve)

1. **Redesign filter UI** - User requested 100% redesign
2. **Add pagination** - Admin tables
3. **Fix type safety** - Remove `any` types
4. **Add ARIA labels** - All interactive elements
5. **Throttle mousemove** - Animated background performance

### Priority 4 - Low (Polish)

1. **Extract magic numbers** - To constants
2. **Remove code duplication** - Search forms, star rendering
3. **Add breadcrumbs** - Navigation improvement
4. **Optimize images** - Add sizes, priority props

---

## Estimated Effort

| Priority | Issues | Estimated Time |
|----------|--------|----------------|
| Critical | 12 | 4-6 hours |
| High | 18 | 6-8 hours |
| Medium | 35+ | 10-15 hours |
| Low | 15+ | 3-5 hours |
| **Total** | **80+** | **23-34 hours** |

---

## Next Steps

1. Review this documentation
2. Approve fix priorities
3. Begin implementation in multi-agent mode
4. Test all fixes
5. Final review and polish
