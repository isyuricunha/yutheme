import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
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
