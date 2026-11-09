---
name: arabic-voice-ready
description: Prepare Arabic (Egyptian dialect or MSA) voiceover and ad scripts so ElevenLabs and other TTS engines pronounce them correctly. Use whenever writing or fixing an Arabic script for text-to-speech, a reel/ad voiceover, an IVR prompt or an audiobook line; when Arabic TTS mispronounces numbers, prices, dates, percentages, brand names, English loanwords or domains; or when the user asks for Egyptian «عامية» narration.
---

# Arabic Voice Ready

Arabic TTS fails in predictable places. Fix them **in the text** before generating audio — every regeneration costs credits.

## Workflow

1. **Write the script in the target dialect.** Egyptian ads read naturally in عامية («اطلب دلوقتي», «بس», «في المية»). Keep sentences short: one idea per sentence, 4–9 words.
2. **Run the normalizer** on the draft — it spells numbers the way the dialect says them, handles `%`, ranges, thousands separators, Arabic-Indic digits, domains and common loanwords:
   ```bash
   node scripts/normalize.mjs "خصم 20% من 5 لـ 15 نوفمبر بـ 359 جنيه" --dialect=egy --pauses
   # خصم عشرين في المية من خمسة لِـخمستاشر نوفمبر بـ تلتمية وتسعة وخمسين جنيه
   ```
   `--dialect=msa` gives فصحى numbers (خمسة عشر، عشرون بالمئة). `--pauses` adds `[short pause]` between sentences (ElevenLabs v3/v4 audio tags).
3. **Apply the manual rules** in [references/pronunciation.md](references/pronunciation.md) for what a script can't decide: diacritics on ambiguous words, brand names, the letters ج / ق / ث / ذ in Egyptian, stress on loanwords.
4. **Add delivery tags** from [references/elevenlabs-tags.md](references/elevenlabs-tags.md) — sparingly (one emotion tag per 2–3 sentences).
5. **Generate 2 takes, listen, then fix only the words that broke.** Note each fix in the script so the next take keeps it.

## Rules that matter most

- **Never leave digits for the engine to guess.** «15» may become «خمسة عشر» in an Egyptian ad, «20%» may be read «عشرون بالمئة». Always pre-spell.
- **Loanwords → Latin script when the Arabic letter is ambiguous.** In Egyptian, «ج» is a hard /g/, so «جل» is read *gal*. Write `gel`. Same for `memory foam` if it breaks, `.com` → «دوت كوم».
- **Diacritics only where needed.** Fully vowelled text sounds robotic. Add a vowel only to a word that was misread: «البِيضاء», «خَصْم», «كُمْفُورْت».
- **Brands:** spell them the way the brand says them, with sukun on clusters: «ماكْس كُمْفُورْت», «نُون», «جُومْيا».
- **Prices:** say the currency once: «بـ تلتمية وتسعة وخمسين جنيه بدل أربعمية وتسعة وأربعين».
- **Dates:** «من خمسة لِخَمَسْتاشَر نوفمبر» — the ل joins the number; diacritics on «خمستاشر» stop it becoming «خمسة عشر».
- **Don't promise what you can't prove.** Ad scripts must not invent prices, discounts or medical claims; read numbers from the real source.

## Files

- `scripts/normalize.mjs` — zero-dependency normalizer (CLI + `import { normalize, numberToWords }`).
- `scripts/normalize.test.mjs` — `node --test scripts/normalize.test.mjs`.
- `references/pronunciation.md` — Egyptian pronunciation pitfalls and fixes.
- `references/elevenlabs-tags.md` — audio tags that work well with Arabic.
- `examples/` — before/after scripts.
