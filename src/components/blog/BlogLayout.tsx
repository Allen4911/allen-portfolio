interface BlogLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
}

export default function BlogLayout({ children, sidebar }: BlogLayoutProps) {
  return (
    <div
      data-testid="blog-layout"
      className="max-w-[1080px] mx-auto px-6 pb-20"
    >
      {sidebar ? (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_320px] gap-16">
          <main>{children}</main>
          <aside className="hidden md:block">{sidebar}</aside>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </div>
  )
}
