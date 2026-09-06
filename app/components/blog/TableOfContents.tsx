type TocItem = {
  id: string;
  title: string;
  level: number;
};

type Props = {
  items: TocItem[];
};

export default function TableOfContents({ items }: Props) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
          On this page
        </p>

        <nav className="border-l">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block border-l-2 py-1.5 text-sm leading-5 text-gray-500 transition hover:text-black ${
                item.level === 3 ? "pl-6" : "pl-4"
              }`}
            >
              {item.title}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
