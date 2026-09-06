import Link from "next/link";

type Props = {
  children: React.ReactNode;
  activePage?: "about" | "blog";
  maxWidth?: "6xl" | "7xl";
};

export default function SiteShell({
  children,
  activePage,
  maxWidth = "6xl",
}: Props) {
  const containerClass = maxWidth === "6xl" ? "max-w-6xl" : "max-w-7xl";

  return (
    <main className="min-h-screen bg-white text-black">
      <div className={`mx-auto ${containerClass} px-6 py-10`}>
        <SiteNav activePage={activePage} />
        {children}
      </div>
    </main>
  );
}

function SiteNav({ activePage }: Pick<Props, "activePage">) {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 pb-6">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Gaurav
      </Link>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <NavLink href="/overview" active={activePage === "about"}>
          About
        </NavLink>

        <NavLink href="/blog" active={activePage === "blog"}>
          Blog
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({
  children,
  href,
  active,
}: {
  children: React.ReactNode;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`transition hover:text-black ${
        active ? "font-medium text-black" : ""
      }`}
    >
      {children}
    </Link>
  );
}
