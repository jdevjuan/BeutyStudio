export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-bege bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
        <h1 className="text-4xl text-grafite sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl leading-relaxed text-marrom">{description}</p>}
      </div>
    </div>
  );
}
