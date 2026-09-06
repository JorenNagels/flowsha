// Brand theming for Clerk's prebuilt components (<SignIn>, <UserButton>), mapped
// to the Flowsha palette so auth UI matches the rest of the site.
export const clerkAppearance = {
  variables: {
    colorPrimary: '#d3793b', // terracotta — the logo orange
    colorBackground: '#2b402e', // forest.dark
    colorText: '#f7f1e3', // cream
    colorTextSecondary: 'rgba(247, 241, 227, 0.7)',
    colorInputBackground: 'rgba(76, 114, 82, 0.5)',
    colorInputText: '#f7f1e3',
    colorNeutral: '#f7f1e3',
    borderRadius: '0.75rem',
    fontFamily: 'var(--font-nunito)',
  },
  elements: {
    card: 'border border-cream/10',
    headerTitle: 'font-display',
    formButtonPrimary: 'bg-terracotta-deep hover:bg-clay text-cream',
  },
} as const;
