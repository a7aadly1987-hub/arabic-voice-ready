#!/usr/bin/env node
// arabic-voice-ready — turn an Arabic ad/voiceover script into text a TTS engine reads correctly.
// Zero dependencies. Usage:
//   node scripts/normalize.mjs "خصم 20% من 5 لـ 15 نوفمبر بـ 359 جنيه" --dialect=egy
//   echo "..." | node scripts/normalize.mjs --dialect=msa
// Library: import { normalize, numberToWords } from './normalize.mjs'

const EGY = {
  ones: ['صفر', 'واحد', 'اتنين', 'تلاتة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'تمانية', 'تسعة', 'عشرة',
    'حداشر', 'اتناشر', 'تلتاشر', 'أربعتاشر', 'خمستاشر', 'ستاشر', 'سبعتاشر', 'تمنتاشر', 'تسعتاشر'],
  tens: ['', '', 'عشرين', 'تلاتين', 'أربعين', 'خمسين', 'ستين', 'سبعين', 'تمانين', 'تسعين'],
  hundreds: ['', 'مية', 'ميتين', 'تلتمية', 'ربعمية', 'خمسمية', 'ستمية', 'سبعمية', 'تمنمية', 'تسعمية'],
  thousand: 'ألف', twoThousand: 'ألفين', thousandsPlural: 'تلاف',
  smallThousands: ['', '', '', 'تلات', 'أربع', 'خمس', 'ست', 'سبع', 'تمن', 'تسع', 'عشر'],
  million: 'مليون', twoMillion: 'مليونين', millionsPlural: 'ملايين',
  and: 'و', percent: 'في المية', hundredOf: 'مية',
};

const MSA = {
  ones: ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'],
  tens: ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'],
  hundreds: ['', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة', 'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة'],
  thousand: 'ألف', twoThousand: 'ألفان', thousandsPlural: 'آلاف',
  smallThousands: ['', '', '', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'],
  million: 'مليون', twoMillion: 'مليونان', millionsPlural: 'ملايين',
  and: 'و', percent: 'بالمئة', hundredOf: 'مئة',
};

const DIALECTS = {egy: EGY, msa: MSA};

const below1000 = (n, L) => {
  const parts = [];
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h) parts.push(L.hundreds[h]);
  if (r) {
    if (r < 20) parts.push(L.ones[r]);
    else {
      const t = Math.floor(r / 10);
      const o = r % 10;
      parts.push(o ? `${L.ones[o]} ${L.and}${L.tens[t]}` : L.tens[t]);
    }
  }
  return parts.join(` ${L.and}`);
};

/** 0 … 999,999,999 → words */
export function numberToWords(num, dialect = 'egy') {
  const L = DIALECTS[dialect] ?? EGY;
  let n = Math.floor(Math.abs(Number(num)));
  if (!Number.isFinite(n)) return String(num);
  if (n === 0) return L.ones[0];
  const out = [];
  const millions = Math.floor(n / 1e6);
  n %= 1e6;
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  if (millions) {
    if (millions === 1) out.push(L.million);
    else if (millions === 2) out.push(L.twoMillion);
    else if (millions <= 10) out.push(`${L.smallThousands[millions]} ${L.millionsPlural}`);
    else out.push(`${below1000(millions, L)} ${L.million}`);
  }
  if (thousands) {
    if (thousands === 1) out.push(L.thousand);
    else if (thousands === 2) out.push(L.twoThousand);
    else if (thousands <= 10) out.push(`${L.smallThousands[thousands]} ${L.thousandsPlural}`);
    else out.push(`${below1000(thousands, L)} ${L.thousand}`);
  }
  if (rest) out.push(below1000(rest, L));
  return out.join(` ${L.and}`);
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toLatinDigits = (s) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

/** Loanwords and symbols TTS engines often misread in Arabic text. Latin spelling keeps the original sound. */
export const LOANWORDS = [
  // JS \b doesn't see Arabic letters as word chars, so boundaries are spelled out
  [/(^|[\sبول])(?:الجل|جل|جيل)(?=\s+(?:ال)?(?:تبريد|بارد|مبرد))/g, (_, p) => (/[بول]/.test(p) ? `${p}ـ gel` : `${p}gel`)],
  [/(^|\s)واتس(?:اب)?(?=$|[\s،.!؟])/g, '$1واتساب'],
];

const URL_RE = /\b([a-z0-9-]+)\.(com|net|org|eg|sa|ae|io)\b/gi;

/**
 * Normalize an Arabic script for TTS.
 * @param {string} text
 * @param {{dialect?: 'egy'|'msa', currency?: string, pauses?: boolean}} opts
 */
export function normalize(text, opts = {}) {
  const dialect = opts.dialect ?? 'egy';
  const L = DIALECTS[dialect] ?? EGY;
  let s = toLatinDigits(text);

  // URLs: maxcomfortmed.com → "maxcomfortmed دوت كوم" (spelled domain stays Latin)
  s = s.replace(URL_RE, (_, name, tld) => `${name} دوت ${tld === 'com' ? 'كوم' : tld}`);

  // thousands separators: 1,205 → 1205
  s = s.replace(/(\d),(\d{3})\b/g, '$1$2');

  // percentages: 20% / %20 / 20 ٪
  s = s.replace(/(\d+)\s*[%٪]|[%٪]\s*(\d+)/g, (_, a, b) => `${numberToWords(a ?? b, dialect)} ${L.percent}`);

  // ranges: "5 لـ 15" / "5-15" → words with "لـ"
  s = s.replace(/(\d+)\s*(?:-|–|لـ|ل)\s*(\d+)/g, (_, a, b) => `${numberToWords(a, dialect)} ${dialect === 'egy' ? 'لِـ' : 'إلى '}${numberToWords(b, dialect)}`);

  // decimals: 19.5 → "تسعتاشر ونص" (egy) / "تسعة عشر فاصل خمسة" (msa)
  s = s.replace(/(\d+)\.(\d+)/g, (_, a, b) =>
    dialect === 'egy' && b === '5' ? `${numberToWords(a, dialect)} ونص` : `${numberToWords(a, dialect)} فاصل ${numberToWords(b, dialect)}`);

  // remaining integers
  s = s.replace(/\d+/g, (d) => numberToWords(d, dialect));

  for (const [re, rep] of LOANWORDS) s = s.replace(re, rep);

  // collapse spaces, keep one space before punctuation-free tags
  s = s.replace(/[ \t]+/g, ' ').replace(/ ([،,.!؟?])/g, '$1').trim();

  // optional ElevenLabs v3/v4 pause tags between sentences
  if (opts.pauses) s = s.replace(/([.!؟?،])\s+(?!\[)/g, '$1 [short pause] ');
  return s;
}

// ---- CLI ----
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMain) {
  const args = process.argv.slice(2);
  const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => {
    const [k, v] = a.slice(2).split('=');
    return [k, v ?? true];
  }));
  const positional = args.filter((a) => !a.startsWith('--')).join(' ');
  const run = (t) => process.stdout.write(normalize(t, {dialect: flags.dialect, pauses: !!flags.pauses}) + '\n');
  if (positional) run(positional);
  else {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (buf += c));
    process.stdin.on('end', () => run(buf));
  }
}
