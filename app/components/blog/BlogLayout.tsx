import SiteShell from "../SiteShell";
import BlogSidebar from "./BlogSidebar";

type Props = {
  children: React.ReactNode;
  currentSlug?: string;
  showSidebar?: boolean;
  maxWidth?: "6xl" | "7xl";
};

export default function BlogLayout({
  children,
  currentSlug,
  showSidebar = true,
  maxWidth = "7xl",
}: Props) {
  return (
    <SiteShell activePage="blog" maxWidth={maxWidth}>
      <div className={`mt-12 flex items-start ${showSidebar ? "gap-12" : ""}`}>
        {showSidebar && <BlogSidebar currentSlug={currentSlug} />}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </SiteShell>
  );
}
