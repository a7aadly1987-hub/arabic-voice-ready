<div align="center">

# 🎙️ arabic-voice-ready

**Make Arabic voiceovers sound right in ElevenLabs & other TTS — the first time.**

An Agent Skill for **Claude Code, Codex, Cursor & any agent** + a zero-dependency CLI that fixes the things Arabic text-to-speech always gets wrong: numbers, prices, percentages, dates, brand names, loanwords and domains — in **Egyptian dialect (عامية)** or **MSA (فصحى)**.

[![tests](https://img.shields.io/badge/tests-passing-7DBE45?style=flat-square)](scripts/normalize.test.mjs)
[![deps](https://img.shields.io/badge/dependencies-0-0B4F9C?style=flat-square)](scripts/normalize.mjs)
[![license](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](LICENSE)
[![skill](https://img.shields.io/badge/Agent_Skill-SKILL.md-D97757?style=flat-square)](SKILL.md)

[العربية ⬇](#بالعربي)

</div>

---

## The problem

You paste an Egyptian ad script into ElevenLabs:

```
خصم 20% من 5 لـ 15 نوفمبر. مخدة بجل تبريد. اطلب من shop.com
```

and get: «**عشرون بالمئة**» (formal), «**خمسة عشر**» (formal), «**جَل**» with a hard *g*, «**شوب كوم**». Every regeneration burns credits.

## The fix

```bash
node scripts/normalize.mjs "خصم 20% من 5 لـ 15 نوفمبر. مخدة بجل تبريد. اطلب من shop.com" --pauses
```

```
خصم عشرين في المية من خمسة لِـخمستاشر نوفمبر. [short pause] مخدة بـ gel تبريد. [short pause] اطلب من shop دوت كوم
```

| Input | Egyptian (`--dialect=egy`, default) | MSA (`--dialect=msa`) |
|---|---|---|
| `20%` | عشرين في المية | عشرون بالمئة |
| `15` | خمستاشر | خمسة عشر |
| `359` | تلتمية وتسعة وخمسين | ثلاثمئة وتسعة وخمسون |
| `1,205` | ألف وميتين وخمسة | ألف ومئتان وخمسة |
| `3000` | تلات تلاف | ثلاثة آلاف |
| `٣٥٩` (Arabic-Indic) | تلتمية وتسعة وخمسين | ثلاثمئة وتسعة وخمسون |
| `5 لـ 15` | خمسة لِـخمستاشر | خمسة إلى خمسة عشر |
| `shop.com` | shop دوت كوم | shop دوت كوم |
| `جل تبريد` | gel تبريد | gel تبريد |

## Install as an Agent Skill

**Claude Code**

```bash
git clone https://github.com/a7aadly1987-hub/arabic-voice-ready ~/.claude/skills/arabic-voice-ready
```

Then just ask: *“write a 20-second Egyptian voiceover for this offer and make it ElevenLabs-ready”* — the skill loads automatically.

**Other agents (Codex, Cursor, OpenCode, …):** clone anywhere and point your agent at [`SKILL.md`](SKILL.md).

## Use the CLI / library

```bash
node scripts/normalize.mjs "النص هنا" [--dialect=egy|msa] [--pauses]
echo "خصم 20%" | node scripts/normalize.mjs
```

```js
import { normalize, numberToWords } from './scripts/normalize.mjs';
normalize('بـ 359 جنيه');           // 'بـ تلتمية وتسعة وخمسين جنيه'
numberToWords(1205, 'msa');          // 'ألف ومئتان وخمسة'
```

Requires Node 18+. No dependencies. Tests: `node --test scripts/normalize.test.mjs`.

## What's inside

```
SKILL.md                      the skill: workflow + rules for the agent
scripts/normalize.mjs         normalizer (CLI + library)
scripts/normalize.test.mjs    tests
references/pronunciation.md   Egyptian pitfalls: ج = /g/, numbers, brands, vowels
references/elevenlabs-tags.md audio tags that work with Arabic
examples/black-friday-ad.md   draft → normalized → final, end to end
```

## Roadmap

- [ ] Gulf (خليجي) and Levantine (شامي) number dialects
- [ ] Phone numbers and times (`3:30` → تلاتة ونص)
- [ ] Ordinals and dates (`1/11` → أول نوفمبر)
- [ ] Bigger loanword dictionary — **PRs very welcome**

---

<div dir="rtl" align="right">

## بالعربي

<a id="بالعربي"></a>

**أداة مفتوحة المصدر تخلّي الفويس أوفر العربي يطلع صح من أول مرة في ElevenLabs وأي محرك تحويل نص لصوت.**

لو بتعمل إعلانات أو ريلز بالعامية المصري، أكيد قابلت المشاكل دي:
- «20%» تتقرا «عشرون بالمئة» بالفصحى
- «15» تتقرا «خمسة عشر» بدل «خمستاشر»
- «جل» تتقرا بالجيم المصري بدل «gel»
- «.com» تتقرا غلط

وكل محاولة جديدة بتاكل من رصيدك.

**الأداة دي بتعمل إيه؟**
1. **مهارة (Skill) للذكاء الاصطناعي:** حطها في Claude Code أو Codex أو أي Agent، واطلب منه يكتبلك إعلان، وهيكتبه جاهز للنطق الصح.
2. **أداة سطر أوامر:** بتحوّل الأرقام والأسعار والنسب والتواريخ لكلام بالعامية المصري أو بالفصحى، من غير أي مكتبات إضافية.
3. **دليل نطق:** فيه المشاكل اللي بتحصل في العامية المصري وحلها: حرف الجيم، والتشكيل وإمتى نستخدمه، وأسماء البراندات.

```bash
node scripts/normalize.mjs "خصم 20% من 5 لـ 15 نوفمبر" --pauses
# خصم عشرين في المية من خمسة لِـخمستاشر نوفمبر
```

**عايز تساعد؟** ضيف كلمات أجنبية بتتنطق غلط، أو أرقام بلهجة خليجي أو شامي، وابعت Pull Request 🙏

لو الأداة فادتك، ادّيها ⭐ عشان توصل لناس أكتر.

</div>

---

<div align="center">

Made by **[Ahmed Hendawy](https://github.com/a7aadly1987-hub)** · DIMA Digital Studio · MIT License

</div>
