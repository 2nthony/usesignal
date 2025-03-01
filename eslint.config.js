// @ts-check
import antfu from '@antfu/eslint-config'
import { fixupPluginRules } from '@eslint/compat'
import pluginReactHooks from 'eslint-plugin-react-hooks'

export default antfu(
  {
    type: 'lib',
  },
  {
    plugins: {
      // @ts-ignore
      'react-hooks': fixupPluginRules(pluginReactHooks),
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
    },
  },
  {
    rules: {
      'ts/explicit-function-return-type': 0,
    },
  },
  {
    files: ['**/fixture.jsx'],
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
)
