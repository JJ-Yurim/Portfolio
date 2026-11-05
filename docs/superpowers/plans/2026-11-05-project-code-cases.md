# Project code cases and visual refinement

Goal: Add a readable core-code explanation to all six project details and give the portfolio a clearer visual hierarchy for the ONDA application.

Agreed direction: problem and implementation explanation beside a short highlighted code excerpt, followed by a source or verification link. Preserve the existing project stories and public URL.

## Constraints
- Use exact excerpts with pinned public source links for GotYA, Itdam, Kkakkung and this portfolio.
- AXCore must use newly written, generic Java-style pseudocode labelled as an explanatory example; never copy internal source, identifiers, documents or data.
- HomeKeeper has no original notebook in the inspected materials. Label its generic Python workflow as an explanatory example, not an original excerpt.
- Use native HTML details/summary for code disclosure, no new runtime dependencies.
- Keep code scroll within its panel on narrow screens and retain existing modal focus behavior.

## Tasks
1. Verify public excerpt ranges and provenance; prepare the two clearly labelled illustrative examples.
2. Update index.html with six code-and-explanation sections, card teasers and a concise experience strip.
3. Add code-cases.css for responsive code panels and visual hierarchy; update asset cache versions.
4. Run the existing test suite, syntax and whitespace checks; inspect desktop and mobile layouts and native disclosures in the browser.
5. Request a read-only review, resolve material findings, commit and deploy through the existing Git login. Verify the final Pages run and public page, then save screenshots.

## Review focus
- Excerpts must match their linked source and never execute as scripts.
- Example code must be visibly distinct from original implementation.
- Long lines must not cause page overflow on mobile.
- Native code disclosures and source links must work inside the existing modal.
- Only intended portfolio files enter the deployment commit.
