import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Components may group imports per concern; ordering is not enforced.
      'import/order': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '.turbo/'],
  },
]

export default eslintConfig
