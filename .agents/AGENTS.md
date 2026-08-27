# Project Architecture & Development Guidelines

This document defines the core architecture, directory structure, and best practices for developing and maintaining the codebase. All AI subagents and developers must strictly follow these rules when introducing new features, refactoring existing code, or creating components.

---

## 1. Project Directory & Component Architecture

Organize all code inside `src/` following a clean, modular layer separation:

```
src/
├── app/                  # Next.js App Router (Pages, Layouts, Routes)
│   └── _components/      # Page-specific layout sections
├── components/           # Reusable UI & Application Components
│   ├── ui/               # Primitive/Basic UI components
│   └── shared/           # Reusable business & layout components shared across pages
├── hooks/                # Custom React Hooks
├── validations/          # Zod validation schemas
├── services/             # Raw API network service functions
├── queries/              # TanStack Query (React Query) hooks
├── contexts/             # React Context Providers
├── providers/            # Global App Providers
├── types/                # TypeScript type definitions and interfaces
├── utils/                # Helper utility functions
├── lib/                  # Third-party client setups
└── constants/            # Global app constants and static options
```

### Component Guidelines & Directory Separation

- **`src/components/ui/`**: Base primitive UI components and form controls. Must be domain-agnostic, highly configurable via standard props (e.g., `value`, `onChange`, `error`, `label`, `disabled`, `className`), and styled consistently across the entire application.
    - **Form Controls & Inputs**: `TextInput`, `Select`, `Checkbox`, `RadioGroup`, `Textarea`.
    - **Feedback & Layout Primitives**: `Button`, `Modal`, `Badge`, `Toast`, `SectionLoader`, `Skeleton`.
    - _Rule_: Create and centralize reusable primitive inputs in `src/components/ui/` so styling and standard prop contracts are managed from a single source of truth.

- **`src/components/shared/`**: Reusable business logic & compound components shared across multiple pages and feature routes.
    - **Form Inputs & Selectors**: `CountryDropdown`, `PhoneInput`, `AddressSelector`.
    - **Compound Layout Elements**: `Navbar`, `Footer`, `CartDrawer`, `AuthActionWrapper`, `UserAvatarDropdown`.
    - _Rule_: Keep reusable inputs with domain-specific features (such as `CountryDropdown` or `PhoneInput`) inside `src/components/shared/` so they can be reused across all forms seamlessly.

- **`src/app/_components/`**: Page-specific layout sections and private sub-views used only by a single route or flow.
    - **Examples**: `HeroSection`, `FeatureSection`, `ProductGridSection`, `TestimonialSection`.
    - _Rule_: Keep Next.js page files (`app/page.tsx`) clean by composing sections imported from `_components/`.

---

## 2. Form Management & Validation (React Hook Form + Zod)

Always manage forms using **React Hook Form** paired with **Zod** schema validation via `@hookform/resolvers/zod`.

### Validation Schema Standards

- Place all validation schemas in `src/validations/` with proper descriptive filenames (`<feature>.validation.ts`).
- Infer TypeScript types directly from Zod schemas using `z.infer<typeof schema>`.

#### Example (`src/validations/auth.validation.ts`):

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

#### Example Form Usage in Component with `handleFormApiError`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/validations/auth.validation';
import { handleFormApiError } from '@/utils/form-error-handler';

export function LoginForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = (data: LoginInput) => {
        loginUser(data, {
            onSuccess: () => router.push('/dashboard'),
            onError: (error) => handleFormApiError(error, setError),
        });
    };

    return <form onSubmit={handleSubmit(onSubmit)}>{/* Input fields */}</form>;
}
```

### Form API Error Handling Standard (`src/utils/form-error-handler.ts`)
- **`handleFormApiError(error, setError)` Rule**: ALWAYS use `handleFormApiError(error, setError)` inside `onError` callbacks when submitting forms via React Query mutations. It automatically maps backend validation error objects (`error.errors`) directly to React Hook Form field errors, with automatic fallback to `root.serverError`.

### Phone Input & Foreign Key Selection Handling Standards

- **Mandatory Optional Chaining Rule**:
  - ALWAYS use optional chaining `?.` when accessing nested object properties (e.g., use `country?.id` instead of `country.id`, and `phone?.full_phone` instead of `phone.full_phone`) to prevent null or undefined runtime crashes.

- **Phone Field Rules**:
  - **Form Submission**: Always submit full phone numbers as a single concatenated string including the country code (e.g., `+918129133008`).
  - **Displaying / Read-only Views**: Use `phone?.full_phone` from the API payload object structure (`"phone": { "country_code": "+91", "phone": "8129133008", "full_phone": "+918129133008" }`).
  - **Edit Form Pre-filling**: When opening edit forms, use `phone?.country_code` to automatically select the country code dropdown and `phone?.phone` to populate the phone number input field.

- **Foreign Key Selection Rules**:
  - **Form Submission**: Always submit the entity `id` for foreign key selections (e.g., when selecting a country, submit the country `id`).
  - **Edit Form Pre-filling**: When populating edit forms from API responses containing relational objects (e.g., `country: { id, name }`), use optional chaining `country?.id` to automatically select the item in the select dropdown.

---

## 3. Data Fetching, Caching & API Architecture

Maintain a strict two-layer data architecture: **Services** for network calls and **Queries** for state/caching, powered by a centralized **API Endpoints** registry.

### 1. API Endpoints Registry (`src/utils/api-endpoints.ts` or `src/constants/endpoints.ts`)

- Maintain a central `API_ENDPOINTS` object (`as const`) defining all API route strings.
- Example:
  ```typescript
  export const API_ENDPOINTS = {
      GET_PRODUCTS: 'products/products/',
      GET_PRODUCT: 'products/products/:id/',
      GET_COUNTRIES: 'core/countries/',
  } as const;
  ```

### 2. API Services (`src/services/`)

- Pure asynchronous functions performing HTTP requests via the configured Axios client (`src/lib/axios.ts`) referencing `API_ENDPOINTS`.
- Filename format: `<feature>.service.ts` (e.g., `product.service.ts`, `cart.service.ts`).

### 3. React Query Hooks & Query Key Synchronization (`src/queries/`)

- Custom hooks encapsulating `useQuery` and `useMutation` from `@tanstack/react-query`.
- Filename format: `use-<feature>.ts` (e.g., `use-products.ts`, `use-cart.ts`).
- **Query Key Synchronization Rule**: Always import `API_ENDPOINTS` and use the endpoint constant directly as the `queryKey` (or as the base query key array item) so query keys and API routes stay 100% synchronized!

#### Example Query Hook (`src/queries/use-products.ts`):

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/utils/api-endpoints';
import { fetchProducts } from '@/services/product.service';

export function useFetchProducts() {
    return useQuery({
        queryKey: [API_ENDPOINTS.GET_PRODUCTS],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
```

---

## 4. Animation, Smooth Scroll & UI Performance Standards

### Card Stacking Z-Index Hierarchy
When creating stacked layout transitions, enforce a strictly ascending z-index hierarchy down the DOM flow so downstream sections naturally cover upstream sections without peeking:
- Section 1 (`HeroSection`): `relative z-10`
- Section 2 (`FeatureSection`): `relative z-20`
- Section 3 (`ProductGridSection`): `relative z-10` (or `z-30` if card overlay required)
- Section 4 (`TestimonialSection`): `relative z-10`
- Footer (`Footer`): `relative z-10`

### Motion & Hover Stability (Eliminating Flickering)
- **Avoid Animation Property Conflicts**: Do NOT mix inline Framer Motion `whileHover={{ y: -6 }}` with CSS `transition-all` on the same DOM element. This causes transform calculation conflicts and 60Hz flickering.
- **In-View Reveal Stability**: Always use `viewport={{ once: true }}` for `whileInView` scroll reveal animations. This unbinds the `IntersectionObserver` callback after the initial reveal, preventing re-triggering during hover or smooth scroll updates.
- **Hardware-Accelerated Hover**: Use GPU CSS transforms (e.g., `className="transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"`) for smooth, jitter-free hover lift.

### Image Gallery & Slideshow Preloading
- When hovering over product cards with image slideshows, always preload gallery images into browser GPU memory via `new Image().src` on mount.
- Use pre-rendered stacked images (`absolute inset-0`) with CSS opacity cross-fading (`transition-opacity duration-500 ease-out`) to eliminate white flashes or network flickering.

---

## 5. API Service & Authentication Utilities

### Cookie Token Management (`src/utils/auth.ts`)
- Access tokens and refresh tokens MUST be managed via cookies.
- ALWAYS use `authUtils` from `src/utils/auth.ts` (`authUtils.getAccessToken()`, `authUtils.getRefreshToken()`, `authUtils.setTokens()`, `authUtils.removeTokens()`) for token operations and authentication state checks.
- Do NOT store tokens directly in `localStorage` or `sessionStorage`.

### API Builders & Response Handlers
- **URL Construction (`src/utils/api-builder.ts`)**: ALWAYS use `ApiBuilder` for constructing API endpoint URLs, query parameters (`.query('q', search)`), and path parameters (`.path('id', id)`).
- **Response Parsing (`src/utils/api-handler.ts`)**: ALWAYS wrap API response promises with `handleApiResponse(response)` to standardize success payload formatting and error extraction across all network services.

---

## 6. Modal & Dialog Standards (`src/components/Modals/`)

- Place all application modals inside `src/components/Modals/`.
- **`ModalWrapper` Requirement**: Every modal component MUST wrap its layout inside `ModalWrapper` (`src/components/ui/ModalWrapper.tsx`) to guarantee consistent backdrop blur, z-index hierarchy, focus lock, and escape key handling.
- **Common Modal Reusability**: Re-use existing common modals (`DeleteModal.tsx`, `ConfirmationModal.tsx`, `AuthRequiredModal.tsx`) across feature pages via props (`open`, `onClose`, `onConfirm`, `title`, `description`, `loading`) instead of creating duplicate modal files for similar flows.

---

## 7. Reusable Hooks, Utilities & Shared Components

### Proactive Asset Reusability & Extraction Mandate
1. **Search Existing Assets First**: Before writing any new function, form input, modal, or hook, ALWAYS search the codebase (`src/components/`, `src/utils/`, `src/hooks/`) to reuse existing implementations.
2. **Proactive Utility Extraction (`src/utils/`)**: Whenever creating data transformations, formatters, string manipulators, or math/validation helpers, ALWAYS extract them into a clean, typed helper function in `src/utils/` rather than writing duplicate inline functions inside component files.
3. **Proactive Component Extraction (`src/components/`)**: Whenever implementing UI patterns, cards, form inputs, or dialogs that might be reused in future tasks, ALWAYS build them as reusable components in `src/components/ui/` (for base primitives) or `src/components/shared/` (for domain/compound elements).
4. **Proactive Hook Extraction (`src/hooks/`)**: Whenever implementing recurring stateful logic, extract it into a clean, reusable custom hook in `src/hooks/use-<feature>.ts`.

### Custom Hooks (`src/hooks/`)
- **Outside Clicks**: ALWAYS use `useOutsideClick` (`src/hooks/use-outside-click.ts`) when building dropdowns, popovers, or floating menus that close on outside clicks.
- **Debouncing**: ALWAYS use `useDebounce` (`src/hooks/use-debounce.ts`) for input search debouncing and deferred API filtering.

### Shared Components & Centralized Company Constants
- **Search Inputs**: ALWAYS use the shared `SearchInput` component from `src/components/shared/` for all search bars and filtering headers.
- **Company & Contact Information**: ALWAYS reference company name, address, email, phone numbers, and location details from `src/constants/company.ts` (or `COMPANY_CONTACT` in `src/constants/constants.ts`). Never hardcode company phone numbers or addresses in component JSX; add missing fields to `src/constants/company.ts` first.

---

## 8. Styling, Color Palette & Design Tokens

### Theme Colors & Color Palette Standards
- **Primary Color**: Use the configured primary theme colors (`bg-primary`, `text-primary`, `#4E3325` / `#552C10` primary chocolate brown) for main CTA buttons, titles, and active highlights.
- **Secondary & Accent Colors**: Use secondary/gold accents (`text-[#C4994A]`, `border-[#CDAB78]`, `bg-[#FAF3E2]`, `bg-[#FCFAF4]`) for badges, borders, hover states, and background highlights.
- **Strict Color Palette Enforcement**: NEVER use random, ad-hoc, or plain browser default colors (plain blue, plain red, cyan). Always style components using the project's established Tailwind CSS theme tokens and CSS variables defined in `src/app/globals.css`.

### Typography Tokens
- **Body & Interface Font**: Use Inter Tight (`font-sans` / `font-inter-tight`) for interface text, inputs, buttons, and body content.
- **Headings & Display Font**: Use Bricolage Grotesque (`font-bricolage`) for section headings, titles, and hero typography.

### Page Layout & Container Alignment (`.wrapper`)
- **Global `.wrapper` Utility Rule**: ALWAYS wrap page section content inside a `<div className="wrapper">` container (configured in `src/app/globals.css` with `max-width: 1440px; width: 90%; margin: auto;`) to guarantee consistent horizontal max-width constraints, centering, and responsive side padding across all page views.

---

## 9. Accessibility, SEO & Responsive Design

### Accessibility (a11y) & SEO Standards
1. **Semantic HTML5**: Ensure proper heading hierarchy (exactly one `<h1>` per page, followed sequentially by `<h2>`, `<h3>`). Use `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>`.
2. **Interactive Accessibility**: All interactive elements (buttons, links, inputs) must have descriptive `aria-label` attributes if lacking visual text, keyboard event handlers (`onKeyDown` for enter/space key), and visible focus rings (`focus-visible:ring-2`).
3. **SEO Metadata**: Define page titles and descriptions using Next.js `metadata` exports in `page.tsx` or `layout.tsx`.

### Responsive Layout & Touch Targets
1. **Mobile-First Breakpoints**: Style screens mobile-first using Tailwind default breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
2. **Touch Target Size**: Interactive buttons and form inputs on mobile devices must have a minimum touch height/width of `44px` (`h-11` or `h-12`).

---

## 10. TypeScript & Best Practices

1. **Strict Typing**: Avoid `any`. Define interfaces in `src/types/` for API responses, domain models, and prop types.
2. **Client Components**: Add `'use client';` strictly at the top of interactive components (using hooks or event handlers). Keep page components server-rendered where possible.
3. **Clean Code**: Keep components concise and focused. Extract sub-views or complex logic into dedicated helper functions or custom hooks in `src/hooks/`.
4. **Mandatory Optional Chaining**: When accessing property paths on objects (e.g., relational entities like `country.id` or payload structs like `phone.full_phone`), ALWAYS use optional chaining syntax (`country?.id`, `phone?.full_phone`) to guard against uninitialized or missing nested properties.
