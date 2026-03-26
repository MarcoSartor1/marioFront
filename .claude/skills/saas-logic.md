# Skill: SaaS & Multi-tenancy Logic (White Label)

## Branding & Theming
- **Dynamic Styling**: Use Tailwind CSS with CSS variables (e.g., `--primary`, `--secondary`) defined in `globals.css`.
- **Dark Mode**: Implementation via `next-themes`. Colors must have dark-mode equivalents.
- **Assets**: Logos, favicons, and banners must be fetched from a configuration source (DB or Config File), not hardcoded.

## Configuration (Tenant Settings)
- **Store Config**: Store-specific data like Store Name, Contact Email, and Social Links.
- **Payment Methods**: Toggle switches for Mercado Pago, Bank Transfer, and others.
- **Shipping**: Configuration for custom shipping messages and carrier info.

## Reusability Rules
- **No Hardcoding**: Never hardcode hex colors or specific brand names in components.
- **Component Abstraction**: UI components in `src/components/ui/` must be generic and styled via theme variables.
- **Admin Control**: All store identity changes must be performable via the `/admin/settings` dashboard.