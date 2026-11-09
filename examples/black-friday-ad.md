# Example — 20-second Black Friday ad (Egyptian)

## Draft (what people usually paste)

```
الجمعة البيضاء وصلت! خصم 20% على كل المنتجات. مخدات بجل تبريد بـ 964 جنيه بدل 1,205. العرض من 5 لـ 15 نوفمبر. اطلب من shop.com
```

Typical result: «عشرون بالمئة», «خمسة عشر», «جَل» with a hard g, «شوب كوم».

## After `normalize.mjs --dialect=egy --pauses`

```
الجمعة البيضاء وصلت! [short pause] خصم عشرين في المية على كل المنتجات. [short pause] مخدات بـ gel تبريد بـ تسعمية وأربعة وستين جنيه بدل ألف وميتين وخمسة. [short pause] العرض من خمسة لِـخمستاشر نوفمبر. [short pause] اطلب من shop دوت كوم
```

## After the manual pass (final)

```
[excited] الجمعة البِيضاء وصلت! [short pause] خَصْم عشرين في المية على كل المنتجات. [short pause] مخدات بـ gel للتبريد، [short pause] بـ تسعمية وأربعة وستين جنيه بدل ألف وميتين وخمسة. [short pause] العرض من خمسة لِخَمَسْتاشَر نوفمبر بس. [short pause] [excited] اطلب دلوقتي من shop دوت كوم!
```

What changed by hand: one vowel on «البِيضاء» and «خَصْم», «بس» for urgency, two `[excited]` tags (hook and CTA only).
