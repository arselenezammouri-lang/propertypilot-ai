# PropertyPilot AI Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Notion (clean productivity), Linear (precision), and Airbnb (property trust). Professional SaaS aesthetic with real estate visual warmth.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, professional, excellent readability
- **Headings**: Font weights 700 (h1), 600 (h2-h3), 500 (h4-h6)
- **Body**: Font weight 400, line-height 1.6
- **Sizes**: 
  - Hero: text-5xl to text-6xl
  - Section Headings: text-3xl to text-4xl
  - Body: text-base to text-lg
  - Small: text-sm

### Layout System
**Spacing Units**: Consistently use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for vertical/horizontal spacing
- Section padding: py-16 md:py-24 lg:py-32
- Card padding: p-6 to p-8
- Container: max-w-7xl with px-4 md:px-6

### Component Library

**Landing Page Structure** (7 sections):
1. **Hero**: Full-width with property background image, centered headline + subheadline, dual CTA (primary: "Inizia Gratis", secondary: "Guarda Demo"), trust badge ("Usato da 500+ agenti immobiliari italiani")
2. **Features Grid**: 3-column layout (lg:grid-cols-3), icon + title + description cards with subtle borders
3. **How It Works**: Numbered steps in 3-column layout with connecting line graphic, each step has icon and description
4. **Content Examples**: Showcase section with property listing examples in 2-column layout, before/after comparison style
5. **Pricing**: 3-tier pricing cards (Gratuito, Professionale, Agenzia) with feature comparison, centered highlight on middle tier
6. **Testimonials**: 3-column grid with agent photos, company names, quotes with stars rating
7. **CTA Footer**: Centered call-to-action with gradient background, email capture form inline

**Dashboard Layout**:
- **Left Sidebar**: Fixed 64px width with icon navigation, collapsible to full menu on hover
- **Top Bar**: Breadcrumb navigation, user profile dropdown, notification bell
- **Main Content**: max-w-6xl centered with grid layouts for recent content cards
- **Quick Actions**: Prominent "Genera Nuovo Contenuto" button (top-right)
- **Stats Cards**: 4-column grid showing usage metrics with large numbers and trend indicators

**Content Generation Forms**:
- **Multi-Step Wizard**: Progress indicator at top, 3 steps (Tipo di Proprietà → Dettagli → Personalizzazione)
- **Form Layout**: Single column max-w-2xl, generous spacing between fields
- **Input Fields**: Large text inputs with floating labels, helper text below
- **Property Type Selection**: Visual cards grid (Appartamento, Villa, Ufficio, etc.) with icons
- **Preview Panel**: Right sidebar (lg:w-96) showing live content preview as user types
- **Action Bar**: Sticky bottom bar with "Salva Bozza" and "Genera Contenuto" buttons

**Authentication Pages**:
- **Split Layout**: 50/50 on desktop - left side form, right side property imagery with overlay
- **Form Container**: max-w-md centered, clean white card with shadow
- **Social Auth**: Google/LinkedIn buttons with icons, stacked above divider
- **Typography**: Large heading (text-3xl), welcoming subtext
- **Links**: Inline links for "Password dimenticata?" and "Registrati"

**Subscription Management**:
- **Current Plan Card**: Highlighted with border, shows tier, renewal date, usage bars
- **Plan Comparison Table**: Side-by-side feature matrix with checkmarks
- **Billing History**: Clean table with download invoice links
- **Upgrade CTAs**: Prominent cards for higher tiers with feature highlights

### Buttons & Interactions
- **Primary Button**: Blue background, white text, px-8 py-3, rounded-lg, font-medium
- **Secondary Button**: White background, blue border, blue text
- **Buttons on Images**: Backdrop blur (backdrop-blur-md), semi-transparent white/dark background (bg-white/90)
- **Icon Buttons**: Circular, 40px-48px diameter for actions
- **Form Buttons**: Full-width on mobile, auto width on desktop

### Cards & Containers
- **Standard Cards**: White background, rounded-xl, border or subtle shadow, p-6
- **Feature Cards**: Hover lift effect (transform scale), transition-all duration-300
- **Stat Cards**: Larger padding (p-8), colored accent borders on top
- **Content Cards**: Include thumbnail, title, metadata row (date, type), action menu

### Forms & Inputs
- **Text Inputs**: h-12, rounded-lg, border focus:border-blue-500, px-4
- **Textareas**: min-h-32, same styling as inputs
- **Select Dropdowns**: Custom styled with chevron icon
- **Checkboxes/Radios**: Large touch targets (24px), blue accent
- **Labels**: text-sm font-medium, mb-2, text-gray-700

### Navigation
- **Landing Nav**: Transparent over hero, becomes solid white on scroll with shadow
- **Dashboard Sidebar**: Icons only collapsed, expand to show labels
- **Mobile Menu**: Slide-in drawer with overlay backdrop
- **Breadcrumbs**: text-sm with "/" separators, last item not clickable

### Icons
**Font Awesome** (CDN): Use solid and regular variants
- Navigation: fa-home, fa-file-alt, fa-chart-bar, fa-credit-card, fa-cog
- Actions: fa-plus, fa-edit, fa-trash, fa-download
- Features: fa-magic, fa-language, fa-clock, fa-check-circle

## Images Section
1. **Hero Image**: Large high-quality Italian property (modern apartment or villa exterior), 1920x1080, subtle overlay gradient (dark bottom), positioned as background-cover
2. **Authentication Pages**: Right-side split showing elegant Italian property interior (living room or office), 800x1200, slight opacity overlay
3. **Dashboard Empty State**: Illustration of property documents/clipboard, 400x300, centered when no content
4. **Testimonial Photos**: Square agent headshots, 80x80, rounded-full
5. **Feature Icons**: Use Font Awesome instead of custom images
6. **Content Example Thumbnails**: Property listing images in cards, 320x200, rounded corners

The website includes a **large hero image** with property background and overlay text/buttons.

## Accessibility
- All interactive elements minimum 44px touch target
- Form inputs with associated labels and ARIA attributes
- Color contrast ratio 4.5:1 minimum for text
- Keyboard navigation throughout
- Focus visible indicators (blue ring)