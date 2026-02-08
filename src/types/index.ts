export interface IModuleOptions {
    enabledEnvs: string[]
    headerName: string
}

export interface IRequestLabelizeConfig {
    headerName: string
}

export interface ILabeledOptions {
    requestLabel?: string
    index?: number
    headers?: HeadersInit
    [key: string]: unknown
}
