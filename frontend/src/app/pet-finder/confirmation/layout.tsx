// Disable static generation for this route
export const dynamic = 'force-dynamic'

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
