// Content lifted verbatim from hireglobal_battlecard_3.html.
// `stats` is an array of maps rather than pairs because Firestore rejects nested arrays.

export const competitors = {
  deel: {
    name: 'Deel',
    order: 0,
    stats: [
      { label: 'Contractor mgmt', value: '$49/mo' },
      { label: 'EOR', value: '$599–899/mo' },
      { label: 'Lock-in', value: 'Month-to-month' },
      { label: 'FX markup', value: '0.6–2% (reports up to 5.5%)' },
      { label: 'Rate rises', value: '5–10%/yr on negotiated multi-year deals' },
    ],
    weak: [
      "Most expensive headline EOR price of the group ($599–899 vs HireGlobal's $399)",
      'FX transparency complaints — realized spreads often run above the published 0.6–2%',
      'Multi-year contracts can carry an undisclosed 5–10%/yr escalator if not capped at signing',
      'Currently in active litigation with Rippling over alleged corporate espionage — no finding yet, but a live story',
    ],
    push: [
      'HireGlobal covers comparable country breadth (150–180+) at roughly a third less on EOR',
      "No disclosed FX markup and no withdrawal fees, vs Deel's published + real-world spread gap",
      'No lock-in and no rate-rise history to negotiate around',
    ],
    quote:
      "“Deel's coverage and brand are real — but you're paying $599–899 and still risking FX creep on top. HireGlobal covers the same ground for $399, no FX surprises.”",
  },

  rippling: {
    name: 'Rippling',
    order: 1,
    stats: [
      { label: 'Contractor mgmt', value: 'Bundled, not standalone' },
      { label: 'EOR', value: '$499–599/mo, quote-only' },
      { label: 'Lock-in', value: 'Annual + minimum headcount, mandatory' },
      { label: 'FX markup', value: 'Undisclosed (est. 2–10%)' },
      { label: 'Rate rises', value: '5–7%/yr renewal escalator' },
      { label: 'Support', value: 'Chat/email only under 150 employees' },
    ],
    weak: [
      'Least transparent pricing of the group — most costs beyond the $8 base are quote-only',
      "Mandatory annual contract with a minimum headcount floor — fees don't drop if headcount does, only at renewal",
      'Undisclosed FX margin (industry estimate 2–10%) — no published rate to hold them to',
      'Standard 5–7%/yr renewal escalator, often not obvious upfront',
      'EOR is a bolt-on, not the core product — thinner country depth than dedicated EOR platforms',
    ],
    push: [
      'HireGlobal is fully published pricing across every tier — no quote-gating',
      'No contract minimum and no headcount floor — scales down with the client, not against them',
      "No disclosed FX markup vs Rippling's opaque 2–10% estimate",
      'No rate-rise history to budget defensively against',
    ],
    quote:
      "“Rippling's unified platform is genuinely useful — but the EOR/global piece sits behind a quote, an undisclosed FX rate, and a contract that won't flex down if your headcount does. HireGlobal is published pricing, no lock-in, no creep.”",
  },

  remote: {
    name: 'Remote',
    order: 2,
    stats: [
      { label: 'Contractor mgmt', value: '$29/mo (no free tier)' },
      { label: 'EOR', value: '$599/mo annual · $699/mo monthly' },
      { label: 'Lock-in', value: 'Discounted rates require annual commit' },
      { label: 'FX markup', value: '~0.5–1%, methodology undisclosed' },
      { label: 'Rate rises', value: 'None disclosed — pricing has moved down historically' },
    ],
    weak: [
      'Narrower country coverage than HireGlobal — 90+ owned entities vs 150–180+',
      'No free contractor management tier — cost adds up on contractor-heavy teams',
      'Cheaper published rate is gated behind a 12-month annual commitment',
      "FX methodology isn't published — Remote tells prospects to ask their account team directly",
    ],
    push: [
      "HireGlobal is $399 EOR vs Remote's $599 — a meaningful gap even before FX",
      "Broader country footprint at 150–180+ vs Remote's 90+",
      'No deposit and no annual commitment required to access the best rate',
    ],
    quote:
      "“Remote's no-deposit policy is fair to like — but you're at $599 with narrower coverage, and the better rate needs a 12-month commitment. HireGlobal is $399, broader coverage, no deposit, no lock-in required.”",
  },

  gusto: {
    name: 'Gusto',
    order: 3,
    stats: [
      { label: 'Global EOR', value: '$699/mo, ~7–12 countries only' },
      { label: 'Lock-in', value: 'None — month-to-month' },
      { label: 'FX markup', value: 'Baked into rate + wire fees' },
      { label: 'Rate rises', value: '2 increases in 12mo: Simple +23%, EOR +17%' },
      { label: 'Coverage', value: 'Effectively US-domestic tool' },
    ],
    weak: [
      '“Global” capability is a thin layer on top of a Remote partnership — only ~7–12 countries for EOR',
      "Two price increases in the past 12 months alone (Simple plan +23%, Global EOR +17%) with zero contract protection since there's no lock-in to shield against it",
      "Not built for companies whose primary need is international hiring — it's a bolt-on to a domestic payroll product",
      'Adding an employee in a second state forces an upgrade tier, even domestically',
    ],
    push: [
      "HireGlobal covers 150–180+ countries vs Gusto's ~7–12 for EOR",
      "No public rate-increase history vs Gusto's two hikes in the last year",
      'Purpose-built for global hiring, not an add-on to a US payroll tool',
    ],
    quote:
      "“Keep Gusto for US payroll — no argument there. But the moment you're hiring outside those ~10 countries, or if pricing volatility worries you, HireGlobal is purpose-built for global with a much wider footprint.”",
  },

  adp: {
    name: 'ADP',
    order: 4,
    stats: [
      { label: 'RUN (US payroll)', value: '~$79/mo + $4/employee' },
      { label: 'Global/EOR', value: 'No standalone EOR — custom quote via partners' },
      { label: 'Lock-in', value: '1-yr auto-renew, 30–60 day cancel window' },
      { label: 'FX / intl pricing', value: 'Not published — varies by country/complexity' },
      { label: 'Rate rises', value: '3–8%/yr standard; rate-lock must be negotiated' },
    ],
    weak: [
      "No standalone global EOR product — international hiring runs through third-party partners (e.g. G-P), so it isn't a direct fast-start EOR solution",
      'Pricing opacity is the most consistent theme in independent reviews — hidden fees for add-ons and international services',
      "Contracts auto-renew annually with a narrow 30–60 day cancellation window — miss it and you're locked in another year, sometimes with an early termination fee",
      'Standard annual increases of 3–8%; avoiding them requires proactively negotiating a rate lock at signing',
      'Slower, more complex setup — built for depth and long-term compliance scale, not fast onboarding in a new market',
    ],
    push: [
      'HireGlobal has purpose-built EOR and AOR products out of the box — no third-party hand-off needed to hire internationally',
      "Fully published pricing vs ADP's quote-gated, opaque model",
      'No annual lock-in or narrow cancellation window — cancel anytime',
      'No history of standard annual increases to negotiate around',
    ],
    quote:
      "“ADP's depth is real if you're running large-scale, long-term multi-country payroll — but there's no standalone EOR, pricing is opaque, and you're locked into a year at a time with a narrow window to get out. HireGlobal gets you hiring internationally today, at a published price, with no lock-in.”",
  },
};

export const hireglobal = {
  name: 'HireGlobal',
  order: 5,
  stats: [
    { label: 'Contractor Management', value: '$19/mo' },
    { label: 'Agent of Record', value: '$49/mo' },
    { label: 'Virtual EOR', value: '$199/mo — $1M indemnification' },
    { label: 'Employer of Record', value: '$399/mo' },
    { label: 'Coverage', value: '150–180+ countries, 50+ currencies' },
  ],
  strengths: [
    'Cheapest published rate on nearly every tier vs Deel, Rippling, Remote, Gusto, and ADP',
    'Virtual EOR tier ($199/mo) offers $1M indemnification per worker — a middle option none of the others match in that shape',
    'No deposit, no lock-in, no disclosed FX markup, no withdrawal fees',
    'No public price-increase history — lead with pricing stability as a differentiator',
    "Backed by Toptal's existing infrastructure — $5B+ processed, 40+ in-house lawyers, SOC 2 compliant",
  ],
  watch: [
    "Thin third-party review volume compared to competitors' thousands of reviews",
    'EOR delivered through a trusted partner network, not fully-owned entities',
    'No HRIS/IT suite — not a fit if the client wants one consolidated platform for HR, IT, and payroll',
    'Contractor Management pricing has shown up as both $19 and $29/mo across sources — confirm the live rate before quoting',
  ],
  quote:
    "“Across the board — Deel, Rippling, Remote, Gusto, ADP — you're either paying more, locked into a contract, absorbing an undisclosed FX markup, or getting hit with rate increases with no protection. HireGlobal is published pricing, no lock-in, no disclosed FX markup, and no price-hike history.”",
};

export const objectionHandling = {
  name: 'Objection handling',
  order: 6,
  html:
    "<p>This is a harder conversation than a standard upsell — it's a requirement, not an option, so the framing has to lead with rationale and value, not just features. Two distinct audiences below; use the right one.</p>" +
    '<h2>Segment A: prospects/clients who only want talent (not yet at 10, or approaching it)</h2>' +
    '<p><strong>Likely reaction:</strong> “I just want to hire people through Toptal — why do I need another platform bolted on?”</p>' +
    '<h3>Framework: Acknowledge → Rationale → Reframe → De-risk → Bridge</h3>' +
    '<ol>' +
    '<li><strong>Acknowledge:</strong> “Totally fair — you came here for talent, not for a second platform to manage.”</li>' +
    "<li><strong>Rationale (the why, not just the what):</strong> “Once you're coordinating 10+ people internationally, the compliance surface area — contracts, classification, payments across countries — gets real. This isn't Toptal adding friction; it's us making sure your growth doesn't create risk you're not equipped to carry alone.”</li>" +
    '<li><strong>Reframe:</strong> “Think of it less as ‘another platform’ and more as the layer that makes the other 9 hires as easy as your first one was.”</li>' +
    "<li><strong>De-risk:</strong> Point to whichever tier fits their actual need — most talent-only clients at this stage are contractor relationships, so lead with Contractor Management at $19/mo, not the full EOR conversation. Make clear this is not scope creep — it's the cheapest tier, sized to what they're already doing.</li>" +
    '<li><strong>Bridge question:</strong> “Where are you at headcount-wise right now, and is most of that international or domestic?” — this tells you which tier actually applies and keeps the conversation concrete instead of abstract.</li>' +
    '</ol>' +
    "<h3>If they push back hard (“I don't want to pay for something I don't need”)</h3>" +
    '<ul>' +
    "<li>Don't argue the principle — argue the number. “At $19/mo per contractor, this is usually a smaller line item than people expect before they see it — let's look at what it actually adds up to for your specific headcount before deciding it's not worth it.”</li>" +
    "<li>If they're pre-10 and just anxious about the future: “You're not there yet, so nothing changes today. I just want you to know it's coming so it's not a surprise at hire #10 — and so we can get you set up proactively instead of reactively.”</li>" +
    '</ul>' +
    '<h2>Segment B: existing clients who worked with us before this change</h2>' +
    "<p><strong>Likely reaction:</strong> “This wasn't the deal when I signed up — why is the goalpost moving?” This is fundamentally a trust conversation, not a product conversation. Lead with that.</p>" +
    '<h3>Framework: Validate → Own it → Explain the shift → Protect their relationship → Path forward</h3>' +
    '<ol>' +
    "<li><strong>Validate the frustration directly — don't minimize it:</strong> “You're right to flag that — this is a change from what you originally signed up for, and I'm not going to pretend otherwise.”</li>" +
    "<li><strong>Own it, don't deflect to policy:</strong> Avoid “this is just company policy now” — it reads as you hiding behind a wall. Instead: “As we've scaled, we've seen real compliance issues show up for clients past the 10-person mark who weren't on a structured platform — this change exists because of what we were seeing happen to clients, not as a revenue play.”</li>" +
    "<li><strong>Explain the shift honestly:</strong> If there's a real reason (misclassification exposure, payment reliability issues, whatever underlies the policy) — say it plainly. Clients forgive a real reason; they don't forgive a vague one.</li>" +
    "<li><strong>Protect their relationship — look for what you can control:</strong> Even if the requirement itself isn't negotiable, look for what is: onboarding timeline flexibility, waived setup friction, your own hands-on support during the transition, or the cheapest applicable tier. “I can't waive the requirement, but I can make sure this transition costs you as little time and money as possible.”</li>" +
    "<li><strong>Path forward, not just the ask:</strong> Give them a concrete, small first step rather than “go sign up for HireGlobal.” E.g., “Let's start with just moving your existing contractors onto Contractor Management — that's the $19 tier, and I'll walk you through it personally so it's a non-event.”</li>" +
    '</ol>' +
    '<h3>If they threaten to leave / push back on loyalty grounds</h3>' +
    '<ul>' +
    "<li>Don't get defensive. “I hear you, and I don't want to lose you over this. What specifically feels like the biggest cost here — is it the money, the extra step, or the principle of it changing on you?” Their answer tells you which lever to pull (price framing, hands-on onboarding support, or an honest conversation about why the policy exists).</li>" +
    "<li>If it's purely principle/trust: acknowledge that no discount fixes that — what fixes it is follow-through. “The best thing I can do is make sure this is the smoothest, most transparent part of working with us, not the worst.”</li>" +
    '</ul>' +
    '<h3>What NOT to do with legacy clients</h3>' +
    '<ul>' +
    "<li>Don't lead with the product pitch (indemnification, $1M coverage, etc.) before you've addressed the trust break — it reads as changing the subject.</li>" +
    "<li>Don't imply the change is non-negotiable in a way that sounds like an ultimatum. Frame it as “this is where the company's headed and I want to help you get there without friction,” not “comply or lose access.”</li>" +
    "<li>Don't oversell HireGlobal's newness as a selling point to a skeptical legacy client — “it's new” cuts against trust-rebuilding here, even though it's a fine angle for Segment A.</li>" +
    '</ul>' +
    '<h2>Quick reference</h2>' +
    '<table>' +
    '<tr><th></th><th>Segment A (new/talent-only)</th><th>Segment B (legacy, pre-change)</th></tr>' +
    '<tr><td><strong>Opening move</strong></td><td>Explain the “why” behind the requirement</td><td>Validate the frustration first, before anything else</td></tr>' +
    '<tr><td><strong>Tone</strong></td><td>Informative, forward-looking</td><td>Ownership, trust-repair</td></tr>' +
    '<tr><td><strong>First ask</strong></td><td>Small — lowest applicable tier, tied to their actual headcount</td><td>Smaller still — one concrete first step, hands-on support offered</td></tr>' +
    '<tr><td><strong>Risk if mishandled</strong></td><td>Feels like unnecessary upsell</td><td>Feels like broken trust / bait-and-switch</td></tr>' +
    '</table>',
};

export const discovery = {
  name: 'Discovery',
  order: 7,
  html:
    '<p>Built on CHAMP (Challenges, Authority, Money, Prioritization). Questions marked <strong>[REQUIRED]</strong> are non-negotiable — ask these on every discovery call regardless of how the conversation is flowing. Everything else is there to deepen the conversation around them.</p>' +
    '<h2>C — Challenges</h2>' +
    '<p><span class="req">Required</span>“How are you handling payroll and contracts for your team? Are you using any platforms like Deel or Rippling?”<br>→ Purpose: establish current setup so you can speak to the specific differences and value props of HireGlobal, not generic ones.</p>' +
    '<p><span class="req">Required</span>“How has that been working for you? Any pain points with cost, onboarding, or managing people?”<br>→ Purpose: surface pain explicitly or implicitly — lean into whatever comes up as you move through the rest of the call.</p>' +
    '<h3>Supporting questions (use as needed to go deeper)</h3>' +
    '<ul>' +
    "<li>“Walk me through how you're currently paying and contracting your international team — what does that process look like end to end?”</li>" +
    "<li>“What's the most frustrating part of managing contractors or employees across borders today?”</li>" +
    '<li>“Have you ever had a payment delay, a compliance scare, or an onboarding delay that cost you real time or money?”</li>' +
    "<li>“Has your current provider ever surprised you with a fee you didn't expect?”</li>" +
    '</ul>' +
    '<h2>H — Authority</h2>' +
    '<p>No required question here, but always establish this before going deep on pricing:</p>' +
    '<ul>' +
    '<li>“Who else, besides you, is involved in choosing or approving a platform like this?”</li>' +
    '<li>“Has your team evaluated or switched vendors like this before — who ran that process?”</li>' +
    '<li>“If we got to a point where this made sense, what would the approval process look like internally?”</li>' +
    '</ul>' +
    '<h2>A(2) — Headcount (not part of standard CHAMP, added for the 10+ requirement)</h2>' +
    "<p><span class=\"req\">Required — new</span>Establish current and projected total headcount early in the call — this means the client's whole team, not just people hired through Toptal. Once total headcount hits 10+, HireGlobal enrollment is required to access/expand talent, regardless of how many of those hires came through us versus elsewhere. This isn't optional to ask — you need it to know whether you're in a “here's why this helps you” conversation or a “here's what's required to keep scaling” conversation.</p>" +
    '<ul>' +
    "<li>“What's your total team headcount right now — including anyone hired outside of Toptal — and where do you see that going over the next 6–12 months?”</li>" +
    "<li>If they're already past 10 and not on HireGlobal: this is the point to transition into the 10+ headcount objection handling framework — segment them as either talent-only or legacy client depending on how long they've been with us.</li>" +
    '</ul>' +
    '<h2>M — Money</h2>' +
    '<ul>' +
    '<li>“What are you currently spending, all-in, on contractor/EOR management each month?”</li>' +
    '<li>“Has cost ever caused you to hold off on hiring somewhere you wanted to?”</li>' +
    '<li>“Is there a budget already allocated for this, or would a change need to be justified as new spend?”</li>' +
    '</ul>' +
    '<h2>P — Prioritization</h2>' +
    '<p><span class="req">Required</span>“As you think about growing your business, are compliance or contractor classification becoming bigger concerns?”<br>→ Purpose: this is your pivot into solution-selling — identify which areas of stress HireGlobal can alleviate (compliance risk, classification risk, admin burden) and focus the rest of the call there.</p>' +
    '<h3>Supporting questions</h3>' +
    '<ul>' +
    '<li>“Has anyone on your team ever raised a concern about a contractor being misclassified?”</li>' +
    '<li>“If a labor authority in one of your hiring countries audited you tomorrow, how confident are you in your documentation?”</li>' +
    '<li>“Where does fixing this rank against everything else on your plate right now?”</li>' +
    '<li>“Is there a deadline driving this — a new hire starting soon, a renewal date, a compliance concern with a timeline?”</li>' +
    '</ul>' +
    '<h2>Suggested call flow</h2>' +
    '<ol>' +
    '<li>Open with the two [REQUIRED] Challenges questions — get them talking about current setup and pain before anything else.</li>' +
    "<li>Weave in the [REQUIRED] headcount question naturally once you understand their setup — it tells you which conversation you're actually having (value-add vs. requirement).</li>" +
    "<li>Ask an Authority question once pain is established — feels like you're being thoughtful about their process, not qualifying them.</li>" +
    "<li>Introduce Money once they've named a real cost or pain point — never lead with it.</li>" +
    "<li>Close with the [REQUIRED] compliance/classification question — this is your bridge from discovery into solution-selling, and it's also your natural opening for the compliance/misclassification pitch if that's where their concern lives.</li>" +
    '</ol>',
};
