"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const picocolors_1 = __importDefault(require("picocolors"));
const vite_1 = require("vite");
let exitHandlersBound = false;
/**
 * Laravel plugin for Vite.
 *
 * @param config - A config object or relative path(s) of the scripts to be compiled.
 */
function laravel(config) {
    const pluginConfig = resolvePluginConfig(config);
    let viteDevServerUrl;
    let resolvedConfig;
    const cssManifest = {};
    const defaultAliases = {
        '@': '/resources/js',
    };
    return {
        name: 'laravel',
        enforce: 'post',
        config: (userConfig, { command, mode }) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            const ssr = !!((_a = userConfig.build) === null || _a === void 0 ? void 0 : _a.ssr);
            const env = (0, vite_1.loadEnv)(mode, userConfig.envDir || process.cwd(), '');
            const assetUrl = (_b = env.ASSET_URL) !== null && _b !== void 0 ? _b : '';
            return {
                base: command === 'build' ? resolveBase(pluginConfig, assetUrl) : '',
                publicDir: false,
                build: {
                    manifest: !ssr,
                    outDir: (_d = (_c = userConfig.build) === null || _c === void 0 ? void 0 : _c.outDir) !== null && _d !== void 0 ? _d : resolveOutDir(pluginConfig, ssr),
                    rollupOptions: {
                        input: (_g = (_f = (_e = userConfig.build) === null || _e === void 0 ? void 0 : _e.rollupOptions) === null || _f === void 0 ? void 0 : _f.input) !== null && _g !== void 0 ? _g : resolveInput(pluginConfig, ssr)
                    },
                },
                server: {
                    origin: '__laravel_vite_placeholder__',
                    ...(process.env.LARAVEL_SAIL ? {
                        host: (_j = (_h = userConfig.server) === null || _h === void 0 ? void 0 : _h.host) !== null && _j !== void 0 ? _j : '0.0.0.0',
                        port: (_l = (_k = userConfig.server) === null || _k === void 0 ? void 0 : _k.port) !== null && _l !== void 0 ? _l : (env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173),
                        strictPort: (_o = (_m = userConfig.server) === null || _m === void 0 ? void 0 : _m.strictPort) !== null && _o !== void 0 ? _o : true,
                    } : undefined)
                },
                resolve: {
                    alias: Array.isArray((_p = userConfig.resolve) === null || _p === void 0 ? void 0 : _p.alias)
                        ? [
                            ...(_r = (_q = userConfig.resolve) === null || _q === void 0 ? void 0 : _q.alias) !== null && _r !== void 0 ? _r : [],
                            ...Object.keys(defaultAliases).map(alias => ({
                                find: alias,
                                replacement: defaultAliases[alias]
                            }))
                        ]
                        : {
                            ...defaultAliases,
                            ...(_s = userConfig.resolve) === null || _s === void 0 ? void 0 : _s.alias,
                        }
                },
                ssr: {
                    noExternal: noExternalInertiaHelpers(userConfig),
                },
            };
        },
        configResolved(config) {
            resolvedConfig = config;
        },
        transform(code) {
            if (resolvedConfig.command === 'serve') {
                return code.replace(/__laravel_vite_placeholder__/g, viteDevServerUrl);
            }
        },
        configureServer(server) {
            var _a;
            const hotFile = path_1.default.join(pluginConfig.publicDirectory, 'hot');
            (_a = server.httpServer) === null || _a === void 0 ? void 0 : _a.once('listening', () => {
                var _a;
                const address = (_a = server.httpServer) === null || _a === void 0 ? void 0 : _a.address();
                const isAddressInfo = (x) => typeof x === 'object';
                if (isAddressInfo(address)) {
                    const protocol = server.config.server.https ? 'https' : 'http';
                    const configHost = typeof server.config.server.host === 'string' ? server.config.server.host : null;
                    const serverAddress = address.family === 'IPv6' ? `[${address.address}]` : address.address;
                    const host = configHost !== null && configHost !== void 0 ? configHost : serverAddress;
                    viteDevServerUrl = `${protocol}://${host}:${address.port}`;
                    fs_1.default.writeFileSync(hotFile, viteDevServerUrl);
                    const envDir = resolvedConfig.envDir || process.cwd();
                    const appUrl = (0, vite_1.loadEnv)('', envDir, 'APP_URL').APP_URL;
                    setTimeout(() => {
                        server.config.logger.info(picocolors_1.default.red(`\n  Laravel ${laravelVersion()} `));
                        server.config.logger.info(`\n  > APP_URL: ` + picocolors_1.default.cyan(appUrl));
                    });
                }
            });
            if (exitHandlersBound) {
                return;
            }
            const clean = () => {
                if (fs_1.default.existsSync(hotFile)) {
                    fs_1.default.rmSync(hotFile);
                }
            };
            process.on('exit', clean);
            process.on('SIGINT', process.exit);
            process.on('SIGTERM', process.exit);
            process.on('SIGHUP', process.exit);
            exitHandlersBound = true;
        },
        // The following two hooks are a workaround to help solve a "flash of unstyled content" with Blade.
        // They add any CSS entry points into the manifest because Vite does not currently do this.
        renderChunk(_, chunk) {
            var _a;
            const cssLangs = `\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`;
            const cssLangRE = new RegExp(cssLangs);
            if (!chunk.isEntry || chunk.facadeModuleId === null || !cssLangRE.test(chunk.facadeModuleId)) {
                return null;
            }
            const relativeChunkPath = (0, vite_1.normalizePath)(path_1.default.relative(resolvedConfig.root, chunk.facadeModuleId));
            cssManifest[relativeChunkPath] = {
                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                /* @ts-ignore */
                file: (_a = Array.from(chunk.viteMetadata.importedCss)[0]) !== null && _a !== void 0 ? _a : chunk.fileName,
                src: relativeChunkPath,
                isEntry: true,
            };
            return null;
        },
        writeBundle() {
            const manifestConfig = resolveManifestConfig(resolvedConfig);
            if (manifestConfig === false) {
                return;
            }
            const manifestPath = path_1.default.resolve(resolvedConfig.root, resolvedConfig.build.outDir, manifestConfig);
            if (!fs_1.default.existsSync(manifestPath)) {
                // The manifest does not exist yet when first writing the legacy asset bundle.
                return;
            }
            const manifest = JSON.parse(fs_1.default.readFileSync(manifestPath).toString());
            const newManifest = {
                ...manifest,
                ...cssManifest,
            };
            fs_1.default.writeFileSync(manifestPath, JSON.stringify(newManifest, null, 2));
        }
    };
}
exports.default = laravel;
/**
 * The version of Laravel being run.
 */
function laravelVersion() {
    var _a, _b, _c;
    try {
        const composer = JSON.parse(fs_1.default.readFileSync('composer.lock').toString());
        return (_c = (_b = (_a = composer.packages) === null || _a === void 0 ? void 0 : _a.find((composerPackage) => composerPackage.name === 'laravel/framework')) === null || _b === void 0 ? void 0 : _b.version) !== null && _c !== void 0 ? _c : '';
    }
    catch {
        return '';
    }
}
/**
 * Convert the users configuration into a standard structure with defaults.
 */
function resolvePluginConfig(config) {
    var _a, _b, _c, _d;
    if (typeof config === 'undefined') {
        throw new Error('laravel-vite-plugin: missing configuration.');
    }
    if (typeof config === 'string' || Array.isArray(config)) {
        config = { input: config, ssr: config };
    }
    if (typeof config.input === 'undefined') {
        throw new Error('laravel-vite-plugin: missing configuration for "input".');
    }
    if (typeof config.publicDirectory === 'string') {
        config.publicDirectory = config.publicDirectory.trim().replace(/^\/+/, '');
        if (config.publicDirectory === '') {
            throw new Error('laravel-vite-plugin: publicDirectory must be a subdirectory. E.g. \'public\'.');
        }
    }
    if (typeof config.buildDirectory === 'string') {
        config.buildDirectory = config.buildDirectory.trim().replace(/^\/+/, '').replace(/\/+$/, '');
        if (config.buildDirectory === '') {
            throw new Error('laravel-vite-plugin: buildDirectory must be a subdirectory. E.g. \'build\'.');
        }
    }
    if (typeof config.ssrOutputDirectory === 'string') {
        config.ssrOutputDirectory = config.ssrOutputDirectory.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    }
    return {
        input: config.input,
        publicDirectory: (_a = config.publicDirectory) !== null && _a !== void 0 ? _a : 'public',
        buildDirectory: (_b = config.buildDirectory) !== null && _b !== void 0 ? _b : 'build',
        ssr: (_c = config.ssr) !== null && _c !== void 0 ? _c : config.input,
        ssrOutputDirectory: (_d = config.ssrOutputDirectory) !== null && _d !== void 0 ? _d : 'storage/ssr',
    };
}
/**
 * Resolve the Vite base option from the configuration.
 */
function resolveBase(config, assetUrl) {
    return assetUrl + (!assetUrl.endsWith('/') ? '/' : '') + config.buildDirectory + '/';
}
/**
 * Resolve the Vite input path from the configuration.
 */
function resolveInput(config, ssr) {
    if (ssr) {
        return config.ssr;
    }
    return config.input;
}
/**
 * Resolve the Vite outDir path from the configuration.
 */
function resolveOutDir(config, ssr) {
    if (ssr) {
        return config.ssrOutputDirectory;
    }
    return path_1.default.join(config.publicDirectory, config.buildDirectory);
}
/**
 * Resolve the Vite manifest config from the configuration.
 */
function resolveManifestConfig(config) {
    const manifestConfig = config.build.ssr
        ? config.build.ssrManifest
        : config.build.manifest;
    if (manifestConfig === false) {
        return false;
    }
    if (manifestConfig === true) {
        return config.build.ssr ? 'ssr-manifest.json' : 'manifest.json';
    }
    return manifestConfig;
}
/**
 * Add the Interia helpers to the list of SSR dependencies that aren't externalized.
 *
 * @see https://vitejs.dev/guide/ssr.html#ssr-externals
 */
function noExternalInertiaHelpers(config) {
    var _a;
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    /* @ts-ignore */
    const userNoExternal = (_a = config.ssr) === null || _a === void 0 ? void 0 : _a.noExternal;
    const pluginNoExternal = ['laravel-vite-plugin'];
    if (userNoExternal === true) {
        return true;
    }
    if (typeof userNoExternal === 'undefined') {
        return pluginNoExternal;
    }
    return [
        ...(Array.isArray(userNoExternal) ? userNoExternal : [userNoExternal]),
        ...pluginNoExternal,
    ];
}
