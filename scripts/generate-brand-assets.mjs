import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const ALPHA_THRESHOLD = 3
const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

/** @typedef {{ readonly name: string, readonly source: string, readonly output: string, readonly width: number, readonly height: number, readonly minimumChromaticPixels: number }} AssetMapping */
/** @typedef {{ readonly transparent: number, readonly visible: number, readonly intermediateAlpha: number, readonly chromatic: number, readonly maxRecompositionError: number, readonly maxNonThresholdedError: number }} AssetStatistics */
/** @typedef {{ readonly rgba: Buffer, readonly statistics: AssetStatistics }} ValidatedPixels */
/** @typedef {{ readonly mapping: AssetMapping, readonly sourceRgb: Buffer, readonly expectedRgba: Buffer, readonly png: Buffer, readonly statistics: AssetStatistics }} GeneratedAsset */

/** @type {readonly AssetMapping[]} */
const ASSETS = Object.freeze([
  Object.freeze({
    name: 'wordmark',
    source: 'reference/images/我的名字.png',
    output: 'public/images/brand/lonelyyang3-wordmark.png',
    width: 2172,
    height: 724,
    minimumChromaticPixels: 0,
  }),
  Object.freeze({
    name: 'secondary',
    source: 'reference/images/我的世界.png',
    output: 'public/images/brand/lonelyyang3-myself-world.png',
    width: 1832,
    height: 858,
    minimumChromaticPixels: 1000,
  }),
])

/**
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

/**
 * @param {number} channel
 * @param {number} base
 * @param {number} alpha
 * @returns {number}
 */
function unmatteChannel(channel, base, alpha) {
  return Math.max(0, Math.min(255, Math.round(((channel - base) * 255) / alpha)))
}

/**
 * @param {Buffer} sourceRgb
 * @param {AssetMapping} mapping
 * @returns {Buffer}
 */
function createStraightRgba(sourceRgb, mapping) {
  const pixelCount = mapping.width * mapping.height
  assert(sourceRgb.length === pixelCount * 3, `${mapping.name}: unexpected RGB buffer length`)

  const rgba = Buffer.alloc(pixelCount * 4)
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const sourceOffset = pixel * 3
    const outputOffset = pixel * 4
    const red = sourceRgb[sourceOffset]
    const green = sourceRgb[sourceOffset + 1]
    const blue = sourceRgb[sourceOffset + 2]
    const base = Math.min(red, green, blue)
    const alpha = 255 - base

    if (alpha <= ALPHA_THRESHOLD) {
      rgba[outputOffset] = 0
      rgba[outputOffset + 1] = 0
      rgba[outputOffset + 2] = 0
      rgba[outputOffset + 3] = 0
      continue
    }

    rgba[outputOffset] = unmatteChannel(red, base, alpha)
    rgba[outputOffset + 1] = unmatteChannel(green, base, alpha)
    rgba[outputOffset + 2] = unmatteChannel(blue, base, alpha)
    rgba[outputOffset + 3] = alpha
  }

  return rgba
}

/**
 * @param {Buffer} rgba
 * @param {Buffer} sourceRgb
 * @param {AssetMapping} mapping
 * @returns {AssetStatistics}
 */
function validatePixels(rgba, sourceRgb, mapping) {
  const pixelCount = mapping.width * mapping.height
  assert(rgba.length === pixelCount * 4, `${mapping.name}: unexpected RGBA buffer length`)

  for (const pixel of [0, mapping.width - 1, pixelCount - mapping.width, pixelCount - 1]) {
    const offset = pixel * 4
    assert(
      rgba[offset] === 0 && rgba[offset + 1] === 0 && rgba[offset + 2] === 0 && rgba[offset + 3] === 0,
      `${mapping.name}: corner pixel ${pixel} is not transparent RGB0`,
    )
  }

  let transparent = 0
  let visible = 0
  let intermediateAlpha = 0
  let chromatic = 0
  let maxRecompositionError = 0
  let maxNonThresholdedError = 0

  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const sourceOffset = pixel * 3
    const outputOffset = pixel * 4
    const alpha = rgba[outputOffset + 3]
    const sourceBase = Math.min(sourceRgb[sourceOffset], sourceRgb[sourceOffset + 1], sourceRgb[sourceOffset + 2])
    const sourceAlpha = 255 - sourceBase

    if (alpha === 0) {
      transparent += 1
      assert(
        rgba[outputOffset] === 0 && rgba[outputOffset + 1] === 0 && rgba[outputOffset + 2] === 0,
        `${mapping.name}: transparent pixel ${pixel} contains nonzero RGB`,
      )
    } else {
      visible += 1
      if (alpha < 255) {
        intermediateAlpha += 1
      }
      const minimum = Math.min(rgba[outputOffset], rgba[outputOffset + 1], rgba[outputOffset + 2])
      const maximum = Math.max(rgba[outputOffset], rgba[outputOffset + 1], rgba[outputOffset + 2])
      if (maximum > minimum) {
        chromatic += 1
      }
    }

    for (let channel = 0; channel < 3; channel += 1) {
      const recomposed = Math.round((rgba[outputOffset + channel] * alpha) / 255 + 255 - alpha)
      const error = Math.abs(recomposed - sourceRgb[sourceOffset + channel])
      maxRecompositionError = Math.max(maxRecompositionError, error)
      if (sourceAlpha > ALPHA_THRESHOLD) {
        maxNonThresholdedError = Math.max(maxNonThresholdedError, error)
      }
    }
  }

  assert(transparent > 0, `${mapping.name}: no transparent pixels`)
  assert(visible > 0, `${mapping.name}: no visible pixels`)
  assert(intermediateAlpha > 0, `${mapping.name}: no intermediate-alpha pixels`)
  assert(chromatic > mapping.minimumChromaticPixels, `${mapping.name}: insufficient chromatic pixels (${chromatic})`)
  assert(maxRecompositionError <= ALPHA_THRESHOLD, `${mapping.name}: recomposition error ${maxRecompositionError} exceeds ${ALPHA_THRESHOLD}`)
  assert(maxNonThresholdedError <= 1, `${mapping.name}: non-thresholded recomposition error ${maxNonThresholdedError} exceeds 1`)

  return {
    transparent,
    visible,
    intermediateAlpha,
    chromatic,
    maxRecompositionError,
    maxNonThresholdedError,
  }
}

/**
 * @param {Buffer} png
 * @param {Buffer} sourceRgb
 * @param {AssetMapping} mapping
 * @returns {Promise<ValidatedPixels>}
 */
async function validatePng(png, sourceRgb, mapping) {
  const metadata = await sharp(png, { failOn: 'error' }).metadata()
  assert(metadata.format === 'png', `${mapping.name}: output is not PNG`)
  assert(metadata.width === mapping.width && metadata.height === mapping.height, `${mapping.name}: output dimensions changed`)
  assert(metadata.hasAlpha === true && metadata.channels === 4, `${mapping.name}: output is not four-channel RGBA`)

  const decoded = await sharp(png, { failOn: 'error' }).raw().toBuffer({ resolveWithObject: true })
  assert(decoded.info.width === mapping.width && decoded.info.height === mapping.height, `${mapping.name}: decoded dimensions changed`)
  assert(decoded.info.channels === 4, `${mapping.name}: decoded output does not have four channels`)

  return {
    rgba: decoded.data,
    statistics: validatePixels(decoded.data, sourceRgb, mapping),
  }
}

/**
 * @param {AssetMapping} mapping
 * @returns {Promise<GeneratedAsset>}
 */
async function generateAsset(mapping) {
  const sourcePath = path.resolve(PROJECT_ROOT, mapping.source)
  const source = await readFile(sourcePath)
  const metadata = await sharp(source, { failOn: 'error' }).metadata()
  assert(metadata.format === 'png', `${mapping.name}: source is not PNG`)
  assert(metadata.width === mapping.width && metadata.height === mapping.height, `${mapping.name}: source dimensions do not match contract`)
  assert(metadata.channels === 3 && metadata.hasAlpha === false, `${mapping.name}: source must be three-channel RGB without alpha`)

  const decoded = await sharp(source, { failOn: 'error' }).raw().toBuffer({ resolveWithObject: true })
  assert(decoded.info.width === mapping.width && decoded.info.height === mapping.height, `${mapping.name}: decoded source dimensions changed`)
  assert(decoded.info.channels === 3, `${mapping.name}: decoded source is not RGB`)

  const expectedRgba = createStraightRgba(decoded.data, mapping)
  const png = await sharp(expectedRgba, {
    raw: { width: mapping.width, height: mapping.height, channels: 4 },
  }).png({
    compressionLevel: 9,
    adaptiveFiltering: true,
    palette: false,
    progressive: false,
  }).toBuffer()
  const validated = await validatePng(png, decoded.data, mapping)
  assert(validated.rgba.equals(expectedRgba), `${mapping.name}: PNG encoding changed RGBA pixels`)

  return {
    mapping,
    sourceRgb: decoded.data,
    expectedRgba,
    png,
    statistics: validated.statistics,
  }
}

/**
 * @param {string} mode
 * @param {GeneratedAsset} asset
 * @param {AssetStatistics} statistics
 */
function printStatistics(mode, asset, statistics) {
  console.log(
    `${mode} ${asset.mapping.name}: transparent=${statistics.transparent} visible=${statistics.visible} intermediate-alpha=${statistics.intermediateAlpha} chromatic=${statistics.chromatic} max-recomposition-error=${statistics.maxRecompositionError} max-non-thresholded-error=${statistics.maxNonThresholdedError}`,
  )
}

async function main() {
  const options = process.argv.slice(2)
  assert(options.length === 0 || (options.length === 1 && options[0] === '--check'), `Unknown option(s): ${options.join(' ') || '(none)'}`)
  const checkOnly = options[0] === '--check'
  const generated = await Promise.all(ASSETS.map(generateAsset))

  if (!checkOnly) {
    for (const asset of generated) {
      await writeFile(path.resolve(PROJECT_ROOT, asset.mapping.output), asset.png)
    }
  }

  for (const asset of generated) {
    const runtime = await readFile(path.resolve(PROJECT_ROOT, asset.mapping.output))
    const validated = await validatePng(runtime, asset.sourceRgb, asset.mapping)
    assert(validated.rgba.equals(asset.expectedRgba), `${asset.mapping.name}: runtime RGBA pixels differ from generated expectation`)
    printStatistics(checkOnly ? 'checked' : 'generated', asset, validated.statistics)
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`generate-brand-assets: ${message}`)
  process.exitCode = 1
})
