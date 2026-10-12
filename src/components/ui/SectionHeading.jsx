export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className = "",
}) {
  const alignClass =
    align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignClass} ${className}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="font-display text-display-md text-porcelain">
        {title}
      </h2>
      {description ? (
        <p
          className={`text-lead leading-relaxed max-w-xl ${
            light ? "text-oat/85" : "text-porcelain/70"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
