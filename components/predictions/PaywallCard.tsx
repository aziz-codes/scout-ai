export function PaywallCard() {
  return (
    <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5 text-center">
      <h3 className="font-display text-[28px] text-white tracking-wide mb-1.5">
        Unlock All 8 Matches Today
      </h3>
      <p className="text-[13px] text-white/45 leading-relaxed mb-5 max-w-xs mx-auto">
        Full AI analysis, predicted lineups, injury reports, and fantasy picks for every World Cup match.
      </p>

      {/* Pricing */}
      <div className="flex gap-3 justify-center mb-5">
        {[
          { label: "Daily",      price: "$2",  period: "per day",     featured: false },
          { label: "Tournament", price: "$19", period: "full 39 days", featured: true  },
        ].map((plan) => (
          <div
            key={plan.label}
            className={`rounded-xl border px-5 py-3.5 text-center cursor-pointer transition-colors ${
              plan.featured
                ? "border-green-500/40 bg-green-500/10"
                : "border-white/[0.08] bg-white/[0.04] hover:border-white/20"
            }`}
          >
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-1">
              {plan.label}
            </p>
            <p
              className={`font-display text-[32px] leading-none ${
                plan.featured ? "text-green-400" : "text-white"
              }`}
            >
              {plan.price}
            </p>
            <p className="text-[11px] text-white/35 mt-1">{plan.period}</p>
          </div>
        ))}
      </div>

      <button className="bg-green-400 text-[#07100d] font-bold text-[14px] rounded-xl px-8 py-3 hover:opacity-90 active:scale-[0.99] transition-all">
        Get Premium Access
      </button>
    </div>
  );
}
