# Egyptian Arabic pronunciation pitfalls for TTS

Each row is a real failure mode seen when generating Egyptian ad voiceovers, with the fix that worked.

| Problem | Written as | Engine says | Fix in the script |
|---|---|---|---|
| Teen numbers read as MSA | `15` | خمسة عشر | `خَمَسْتاشَر` (normalizer does this) |
| Percent read as MSA | `20%` | عشرون بالمئة | `عشرين في المية` |
| Loanword with /dʒ/ | `جل` | *gal* (hard g) | write `gel` in Latin |
| Domain | `shop.com` | *shop com* or letters | `shop دوت كوم` |
| Ambiguous vowel | `البيضاء` | *al-bayḍā* vs *al-bīḍā* | add the vowel you want: `البِيضاء` |
| Imperative stress | `خصم` | *khaṣam* | `خَصْم` |
| Brand name | `ماكس كمفورت` | *makas kamfart* | `ماكْس كُمْفُورْت` |
| Spoken vs written word | `الظهر` / `الضهر` | both work; pick what the brand uses on screen | keep one spelling in script and captions |
| English inside Arabic flips direction in editors | `React Native` | fine in audio | keep, but check the on-screen captions separately |

## Letters to watch in Egyptian

- **ج** → /g/ (جمعة = *gumʕa*). For a real /dʒ/ sound use Latin (`gel`, `jacket`).
- **ق** → glottal stop in casual speech (قلب = *ʔalb*). Usually fine; if you need /q/ (formal brand), write it in MSA style and add sukun.
- **ث** → /t/ or /s/ (تلاتة, ثانية → تانية). Write the spoken form.
- **ذ** → /d/ or /z/ (ده, هذا → ده). Write the spoken form.

## Numbers cheat sheet (Egyptian)

| n | spoken | n | spoken |
|---|---|---|---|
| 11 | حداشر | 100 | مية |
| 12 | اتناشر | 200 | ميتين |
| 13 | تلتاشر | 300 | تلتمية |
| 14 | أربعتاشر | 400 | ربعمية |
| 15 | خمستاشر | 1000 | ألف |
| 16 | ستاشر | 2000 | ألفين |
| 17 | سبعتاشر | 3000 | تلات تلاف |
| 18 | تمنتاشر | 25 | خمسة وعشرين |
| 19 | تسعتاشر | 1205 | ألف وميتين وخمسة |
