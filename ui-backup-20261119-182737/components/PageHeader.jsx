export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
      <div>
        {eyebrow && (
          <p className="text-[10px] uppercase tracking-[.18em] font-bold text-[#176D68] mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[#81918B] mt-2 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
