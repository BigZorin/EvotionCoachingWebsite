import { test } from 'node:test'
import assert from 'node:assert'
import { cn } from './utils'

test('merges overlapping Tailwind classes', () => {
  assert.strictEqual(cn('px-2', 'px-4'), 'px-4')
})

test('handles multiple classnames', () => {
  assert.strictEqual(
    cn('text-sm', 'text-lg', 'font-bold', 'px-2', 'px-4'),
    'text-lg font-bold px-4'
  )
})

test('handles conditional classes', () => {
  const condition = false
  assert.strictEqual(cn('p-2', condition && 'p-4'), 'p-2')
  assert.strictEqual(cn('p-2', { 'p-4': true }), 'p-4')
})

test('returns empty string for no input', () => {
  assert.strictEqual(cn(), '')
})
