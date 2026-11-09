// node --test scripts/
import test from 'node:test';
import assert from 'node:assert/strict';
import {normalize, numberToWords} from './normalize.mjs';

test('egyptian numbers', () => {
  assert.equal(numberToWords(5), 'خمسة');
  assert.equal(numberToWords(15), 'خمستاشر');
  assert.equal(numberToWords(20), 'عشرين');
  assert.equal(numberToWords(25), 'خمسة وعشرين');
  assert.equal(numberToWords(100), 'مية');
  assert.equal(numberToWords(200), 'ميتين');
  assert.equal(numberToWords(359), 'تلتمية وتسعة وخمسين');
  assert.equal(numberToWords(1000), 'ألف');
  assert.equal(numberToWords(2000), 'ألفين');
  assert.equal(numberToWords(3000), 'تلات تلاف');
  assert.equal(numberToWords(1205), 'ألف وميتين وخمسة');
  assert.equal(numberToWords(15000), 'خمستاشر ألف');
});

test('msa numbers', () => {
  assert.equal(numberToWords(15, 'msa'), 'خمسة عشر');
  assert.equal(numberToWords(25, 'msa'), 'خمسة وعشرون');
  assert.equal(numberToWords(3000, 'msa'), 'ثلاثة آلاف');
});

test('percent, range, url, digits', () => {
  assert.equal(normalize('خصم 20%'), 'خصم عشرين في المية');
  assert.equal(normalize('خصم %20'), 'خصم عشرين في المية');
  assert.equal(normalize('من 5 لـ 15 نوفمبر'), 'من خمسة لِـخمستاشر نوفمبر');
  assert.equal(normalize('بـ ٣٥٩ جنيه'), 'بـ تلتمية وتسعة وخمسين جنيه');
  assert.equal(normalize('اطلب من shop.com'), 'اطلب من shop دوت كوم');
  assert.equal(normalize('بدل 1,205 جنيه'), 'بدل ألف وميتين وخمسة جنيه');
  assert.equal(normalize('خصم 20%', {dialect: 'msa'}), 'خصم عشرون بالمئة');
});

test('loanwords and pauses', () => {
  assert.equal(normalize('مخدة بطبقة جل تبريد'), 'مخدة بطبقة gel تبريد');
  assert.equal(normalize('مخدة بجل التبريد'), 'مخدة بـ gel التبريد');
  assert.equal(normalize('كلمنا واتس'), 'كلمنا واتساب');
  assert.equal(normalize('عرض جديد. اطلب دلوقتي!', {pauses: true}), 'عرض جديد. [short pause] اطلب دلوقتي!');
});
