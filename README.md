# AsesoRed - Plataforma Educativa IEST Anáhuac

## Instrucciones para ejecutar el proyecto

### Opción 1: Instalación Local (Recomendado)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   - El proyecto se ejecutará en `http://localhost:5173`
   - Presiona `o` en la terminal para abrirlo automáticamente

### Opción 2: Build para producción

```bash
npm run build
npm run preview
```

## Tecnologías utilizadas

- **React 18** - Framework JavaScript
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Iconos
- **Google Fonts** - Playfair Display & DM Sans

## Características

- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Animaciones suaves y transiciones
- ✅ Efectos de glass morphism
- ✅ Sistema de navegación con scroll
- ✅ Componentes interactivos
- ✅ Optimizado para rendimiento

## Estructura del proyecto

```
asesored/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales de Tailwind
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
└── tailwind.config.js   # Configuración de Tailwind
```

## Secciones de la página

1. **Hero** - Presentación principal con formulario de búsqueda
2. **Estadísticas** - Métricas clave de la plataforma
3. **Características** - Principales funcionalidades
4. **Cómo funciona** - Proceso para estudiantes y asesores
5. **Testimonios** - Opiniones de usuarios
6. **CTA** - Call to action final
7. **Footer** - Información de contacto y enlaces

## Comandos disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm run preview` - Previsualiza build de producción

## Solución de problemas

Si el CSS no se carga:
1. Asegúrate de que `index.css` esté importado en `main.jsx`
2. Verifica que todas las dependencias estén instaladas
3. Limpia la caché: `rm -rf node_modules package-lock.json` y vuelve a instalar

---

Desarrollado para IEST Anáhuac 
