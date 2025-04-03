import '@/styles/global.css'

export const metadata = {
  title: 'Car-teBleue',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
