import { ArrowRight, FileText, MapPin, Users } from "lucide-react";

/** Small illustrations built from each project's documented behaviour, not screenshots or sample data. */
export function ProjectPreview({ slug }: { slug: string }) {
  if (slug === "helpee") {
    const steps = ["Care Manager request", "Customer Success review", "Approval"];
    return (
      <div aria-hidden="true" className="preview flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <span key={step} className="flex items-center gap-2">
            {index > 0 && <ArrowRight className="size-3.5 text-muted" />}
            <span className="preview-step rounded-md border border-line bg-surface px-2.5 py-1.5" style={{ transitionDelay: `${index * 90}ms` }}>
              {step}
            </span>
          </span>
        ))}
      </div>
    );
  }

  if (slug === "paimana") {
    // The synthetic glucose row from the project's own prompt-injection test report.
    return (
      <div aria-hidden="true" className="preview space-y-2.5">
        <p className="flex items-baseline justify-between gap-3">
          <span>Fasting Glucose</span>
          <span>
            140 <span className="text-muted">mg/dL</span>
          </span>
        </p>
        <div className="relative h-1.5 rounded-full bg-line">
          {/* To scale: 70–100 spans 25–50% of the bar, so 140 sits at about 83%. */}
          <span className="absolute inset-y-0 left-[25%] w-[25%] rounded-full bg-success/60" />
          <span className="preview-step absolute top-1/2 left-[83%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-error" />
        </div>
        <p className="flex items-center justify-between gap-3 text-muted">
          <span>Printed range 70 – 100</span>
          <span className="preview-step rounded border border-line px-1.5 text-xs font-semibold text-error" style={{ transitionDelay: "90ms" }}>
            HIGH · by code
          </span>
        </p>
      </div>
    );
  }

  if (slug === "schemelens") {
    // The question and answer are the PM-KISAN example from the project's own tests.
    return (
      <div aria-hidden="true" className="preview space-y-2">
        <p className="text-muted">How much does PM-KISAN pay per year?</p>
        <p className="leading-relaxed">
          Rs. 6,000 a year, in three instalments{" "}
          <span className="preview-step rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-accent">[1]</span>
        </p>
        <p className="flex items-center gap-1.5 text-muted">
          <FileText className="size-3.5" /> Official PDF, cited page
          <span className="ml-auto flex gap-1">
            {["EN", "हि", "ಕ"].map((lang, index) => (
              <span key={lang} className="preview-step rounded border border-line px-1.5 text-xs" style={{ transitionDelay: `${index * 90}ms` }}>
                {lang}
              </span>
            ))}
          </span>
        </p>
      </div>
    );
  }

  if (slug === "corelog") {
    return (
      <div aria-hidden="true" className="preview">
        <p className="leading-relaxed">
          Read <span className="preview-step rounded bg-surface px-1.5 py-0.5">{"{{pages}}"}</span> pages of{" "}
          <span className="preview-step rounded bg-surface px-1.5 py-0.5" style={{ transitionDelay: "90ms" }}>
            {"{{book_name}}"}
          </span>
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-muted">
          <MapPin className="size-3.5" /> Geotagged journal entry
        </p>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="preview flex items-center justify-between gap-2">
      <span className="preview-step rounded-md border border-line bg-surface px-2.5 py-1.5">Mentor</span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5 text-muted">
        <span className="h-px flex-1 bg-line" />
        <Users className="size-3.5 flex-none" />
        <span className="h-px flex-1 bg-line" />
      </span>
      <span className="preview-step rounded-md border border-line bg-surface px-2.5 py-1.5" style={{ transitionDelay: "90ms" }}>
        Mentee
      </span>
    </div>
  );
}
