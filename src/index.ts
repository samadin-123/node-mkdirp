import { mkdirpManual, mkdirpManualSync } from './mkdirp-manual.js'
import { mkdirpNative, mkdirpNativeSync } from './mkdirp-native.js'
import { MkdirpOptions, optsArg } from './opts-arg.js'
import { useNative, useNativeSync } from './use-native.js'
import { parse, resolve } from 'path'

const platform = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform
/* c8 ignore start */
export { mkdirpManual, mkdirpManualSync } from './mkdirp-manual.js'
export { mkdirpNative, mkdirpNativeSync } from './mkdirp-native.js'
export { useNative, useNativeSync } from './use-native.js'
/* c8 ignore stop */

export const mkdirpSync = (path: string, opts?: MkdirpOptions) => {
  // Inline path validation to reduce function call overhead
  if (/\0/.test(path)) {
    throw Object.assign(
      new TypeError('path must be a string without null bytes'),
      {
        path,
        code: 'ERR_INVALID_ARG_VALUE',
      }
    )
  }

  path = resolve(path)
  if (platform === 'win32') {
    const badWinChars = /[*|"<>?:]/
    const { root } = parse(path)
    if (badWinChars.test(path.substring(root.length))) {
      throw Object.assign(new Error('Illegal characters in path.'), {
        path,
        code: 'EINVAL',
      })
    }
  }

  const resolved = optsArg(opts)
  return useNativeSync(resolved)
    ? mkdirpNativeSync(path, resolved)
    : mkdirpManualSync(path, resolved)
}

export const sync = mkdirpSync
export const manual = mkdirpManual
export const manualSync = mkdirpManualSync
export const native = mkdirpNative
export const nativeSync = mkdirpNativeSync
export const mkdirp = Object.assign(
  async (path: string, opts?: MkdirpOptions) => {
    // Inline path validation to reduce function call overhead
    if (/\0/.test(path)) {
      throw Object.assign(
        new TypeError('path must be a string without null bytes'),
        {
          path,
          code: 'ERR_INVALID_ARG_VALUE',
        }
      )
    }

    path = resolve(path)
    if (platform === 'win32') {
      const badWinChars = /[*|"<>?:]/
      const { root } = parse(path)
      if (badWinChars.test(path.substring(root.length))) {
        throw Object.assign(new Error('Illegal characters in path.'), {
          path,
          code: 'EINVAL',
        })
      }
    }

    const resolved = optsArg(opts)
    return useNative(resolved)
      ? mkdirpNative(path, resolved)
      : mkdirpManual(path, resolved)
  },
  {
    mkdirpSync,
    mkdirpNative,
    mkdirpNativeSync,
    mkdirpManual,
    mkdirpManualSync,

    sync: mkdirpSync,
    native: mkdirpNative,
    nativeSync: mkdirpNativeSync,
    manual: mkdirpManual,
    manualSync: mkdirpManualSync,
    useNative,
    useNativeSync,
  }
)
