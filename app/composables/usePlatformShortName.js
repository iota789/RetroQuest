const PLATFORM_SHORT_NAMES = {
    nes: 'NES',
    gb: 'GB',
    gba: 'GBA',
    segaMD: 'SEGA',
    snes: 'SNES',
}

export const usePlatformShortName = (platform) => PLATFORM_SHORT_NAMES[platform] || platform
