import { Plugin, UserConfig, ConfigEnv } from 'vite';
interface PluginConfig {
    /**
     * The path or paths of the entry points to compile.
     */
    input: string | string[];
    /**
     * Laravel's public directory.
     *
     * @default 'public'
     */
    publicDirectory?: string;
    /**
     * The public subdirectory where compiled assets should be written.
     *
     * @default 'build'
     */
    buildDirectory?: string;
    /**
     * The path of the SSR entry point.
     */
    ssr?: string | string[];
    /**
     * The directory where the SSR bundle should be written.
     *
     * @default 'storage/ssr'
     */
    ssrOutputDirectory?: string;
}
interface LaravelPlugin extends Plugin {
    config: (config: UserConfig, env: ConfigEnv) => UserConfig;
}
/**
 * Laravel plugin for Vite.
 *
 * @param config - A config object or relative path(s) of the scripts to be compiled.
 */
export default function laravel(config: string | string[] | PluginConfig): LaravelPlugin;
export {};
