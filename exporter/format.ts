export interface G11nExport {
    version: string
    console: string
    keys: G11nExportKey[]
}

export interface G11nExportKey {
    key: string
    description: string
    screens: string[]
    uri: string
    url?: string
}