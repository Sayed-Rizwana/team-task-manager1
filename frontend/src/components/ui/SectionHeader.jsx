export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.35em] text-brand-300">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
    </div>
    {action}
  </div>
);
