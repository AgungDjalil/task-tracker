# TaskTracker - Vue.js 3 + TypeScript

Aplikasi TaskTracker dengan Vue.js 3, TypeScript, Tailwind CSS, Pinia, dan Vite.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Type checking
npm run type-check

# 4. Build for production
npm run build
```

## 📂 Project Structure

```
src/
├── api/          # Axios API client
├── components/   # Reusable components
├── layouts/      # Layout components
├── pages/        # Page components
├── router/       # Vue Router
├── stores/       # Pinia stores
├── styles/       # Global styles
├── types.ts      # TypeScript types
├── main.ts       # Entry point
└── App.vue       # Root component
```

## 🔧 Technologies

- Vue.js 3 (Composition API)
- TypeScript
- Tailwind CSS
- Pinia (State Management)
- Vue Router
- Axios
- Vite

## 📝 Features

✅ Authentication (Login/Logout)
✅ Dashboard with Statistics
✅ Project Management (CRUD)
✅ Task Management (CRUD)
✅ Search & Filter
✅ Responsive Design
✅ Form Validation
✅ Error Handling

## 🔌 API Configuration

Edit `src/api/index.ts`:

```typescript
const API_BASE_URL: string = 'http://your-api-url/api'
```

## 📦 Type Safety

Full TypeScript support with:
- Type definitions in `src/types.ts`
- Strict type checking
- Vue component types
- API response types

## 🎨 Styling

Uses Tailwind CSS with no custom CSS files. All styles are utility-based.

## 🧪 Type Checking

```bash
npm run type-check
```

Validates TypeScript without emitting files.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 📄 License

MIT
