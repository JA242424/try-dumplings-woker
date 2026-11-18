const CONFIG = {

    KV_BINDING_NAME: 'MC_DB',

    KV_NAMESPACE_ID: '944c1d75fe224420a9c6b575d93d388a',

    FRONTEND_ORIGINS: [
        'https://dumplings-djq.pages.dev',
        'https://dumplings.2181751527.workers.dev',
        'http://localhost:3000',
        'http://localhost:5173',
    ],

    get FRONTEND_ORIGIN() { return this.FRONTEND_ORIGINS[0]; },

    BACKEND_ORIGIN: 'https://mc-backend.2181751527.workers.dev',

    ENVIRONMENT: 'production',

    TOKEN_SECRET: '',

    PBKDF2_ITERATIONS: 100000,

    PBKDF2_KEY_LEN: 32,

    TOKEN_TTL_SECONDS: 7 * 24 * 60 * 60,

    MAX_SUPER_ADMINS: 5,

    MAX_ADMINS: 50,

    MAX_PLAYERS: 5000,

    DEFAULT_PAGE_SIZE: 50,

    KV_LIST_LIMIT: 1000,

    DEBUG_MODE: false,

    PASSPHRASE_GRACE_DAYS: 10,

    PASSPHRASE_HISTORY_TTL_SECONDS: 120 * 24 * 60 * 60,

    // QQ 头像公开接口（无需授权，只要 QQ 号即可拉头像）
    QQ_AVATAR_TEMPLATE: 'https://q.qlogo.cn/headimg_dl?dst_uin={uin}&spec=100',

    QQ_AVATAR_SPEC: 100,

    // 文件上传（存 KV；KV 单值上限 25 MiB，这里留余量设 20 MiB）
    FILE_MAX_BYTES: 20 * 1024 * 1024,

    FILE_TTL_SECONDS: 400 * 24 * 60 * 60,

    // 允许上传的扩展名（媒体 + 投影 + 常用文档）
    FILE_ALLOWED_EXT: [
        'mp4', 'webm', 'mov', 'mp3', 'ogg', 'wav', 'm4a', 'flac',
        'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf',
        'litematic', 'nbt', 'schematic', 'zip', 'json', 'mcstructure', 'litemod', 'txt', 'md',
    ],

    // 扩展名 -> Content-Type
    FILE_CONTENT_TYPES: {
        mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
        mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4', flac: 'audio/flac',
        png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
        webp: 'image/webp', svg: 'image/svg+xml', pdf: 'application/pdf',
        json: 'application/json', txt: 'text/plain; charset=utf-8', md: 'text/markdown; charset=utf-8',
        zip: 'application/zip',
    },
};

const ROLES = {
    GUEST: 'guest',
    PLAYER: 'player',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
};

const ROLE_PRIORITY = {
    guest: 0,
    player: 1,
    admin: 2,
    super_admin: 3,
};

const KEYS = {
    USER: (username) => `mcdb:users:${username}`,
    USER_PENDING: (username) => `mcdb:user:pending:${username}`,
    USER_ACTIVE: (username) => `mcdb:user:active:${username}`,
    PASSPHRASE: (period) => `mcdb:passphrase:${period}`,
    PASSPHRASE_CURRENT: 'mcdb:passphrase:current',
    PASSPHRASE_LOG: (ts, username) => `mcdb:passphrase:log:${ts}:${username}`,
    SERVER_INFO: 'mcdb:server:info',
    FILE_BLOB: (id) => `mcdb:file:blob:${id}`,
    FILE_META: (id) => `mcdb:file:meta:${id}`,
    FILE_INDEX: 'mcdb:file:index:',
    PWRESET_REQ: (id) => `mcdb:pwreset:req:${id}`,
    ANN_FULL: (id) => `mcdb:ann:full:${id}`,
    ANN_GROUP: (id) => `mcdb:ann:group:${id}`,
    SURVEY: (id) => `mcdb:survey:${id}`,
    SURVEY_PENDING: (id) => `mcdb:survey:pending:${id}`,
    SURVEY_DONE: (username, surveyId) => `mcdb:survey:done:${username}:${surveyId}`,
    DISPATCH: (id) => `mcdb:dispatch:${id}`,
    MEDIA: (id) => `mcdb:media:${id}`,
    PROJECTION: (id) => `mcdb:projection:${id}`,
    BUG: (id) => `mcdb:bug:${id}`,
    EVENT: (id) => `mcdb:event:${id}`,
    EVENT_JOIN: (eventId, username) => `mcdb:event:join:${eventId}:${username}`,
    REVIEW: (type, id) => `mcdb:review:${type}:${id}`,
    COUNTER: (name) => `mcdb:counter:${name}`,
    BOOTSTRAP: 'mcdb:bootstrap',
};

const CF_DEPLOY = {

    CF_ZONE_ID: '',

    CF_API_TOKEN: '',

    CF_WORKER_URL: 'https://mc-backend.2181751527.workers.dev',

    CF_PAGES_URL: 'https://dumplings-djq.pages.dev',

    CF_ENVIRONMENT: 'production',

    CF_KV_ID: '944c1d75fe224420a9c6b575d93d388a',

    CF_KV_BINDING: 'MC_DB',
};

const SERVER_ONLY_FIELDS = ['CF_ZONE_ID', 'CF_API_TOKEN', 'TOKEN_SECRET', 'PBKDF2_SALT_GLOBAL'];

function safeJsonStringify(value) {
    try {
        return JSON.stringify(value);
    } catch (err) {

        return '{}';
    }
}

function safeJsonParse(text, fallback = null) {
    if (text == null) return fallback;
    try {
        return JSON.parse(text);
    } catch (err) {

        return fallback;
    }
}

function uuid() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function bufToHex(buf) {
    const bytes = new Uint8Array(buf);
    let out = '';
    for (let i = 0; i < bytes.length; i++) {
        out += bytes[i].toString(16).padStart(2, '0');
    }
    return out;
}

function hexToBuf(hex) {
    const clean = hex.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '');
    const out = new Uint8Array(Math.floor(clean.length / 2));
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}

function strToBytes(str) {
    return new TextEncoder().encode(str);
}

function bytesToStr(bytes) {
    return new TextDecoder().decode(bytes);
}

function deepClone(obj) {
    return safeJsonParse(safeJsonStringify(obj), null);
}

function now() {
    return Math.floor(Date.now() / 1000);
}

function formatTime(ts) {
    if (!ts) return '';
    const date = new Date(ts * 1000);

    const opts = { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    return new Intl.DateTimeFormat('zh-CN', opts).format(date);
}

function relativeTime(ts) {
    if (!ts) return '';
    const delta = now() - ts;
    if (delta < 60) return '刚刚';
    if (delta < 3600) return `${Math.floor(delta / 60)} 分钟前`;
    if (delta < 86400) return `${Math.floor(delta / 3600)} 小时前`;
    if (delta < 86400 * 7) return `${Math.floor(delta / 86400)} 天前`;
    return formatTime(ts);
}

function sanitizeString(s, maxLen = 1000) {
    if (typeof s !== 'string') return '';

    let cleaned = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    cleaned = cleaned.trim();
    if (cleaned.length > maxLen) cleaned = cleaned.slice(0, maxLen);
    return cleaned;
}

function isValidUsername(name) {
    if (typeof name !== 'string') return false;
    return /^[A-Za-z][A-Za-z0-9_]{2,19}$/.test(name);
}

function isValidGameId(gameId) {
    if (typeof gameId !== 'string') return false;
    return gameId.length >= 1 && gameId.length <= 32 && !/[\u0000-\u001F]/.test(gameId);
}

function isValidUrl(url) {
    if (typeof url !== 'string') return false;
    try {
        const u = new URL(url);
        return u.protocol === 'http:' || u.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

async function generateSalt() {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    return bufToHex(buf.buffer);
}

async function derivePassword(password, salt) {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        strToBytes(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: hexToBuf(salt),
            iterations: CONFIG.PBKDF2_ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        CONFIG.PBKDF2_KEY_LEN * 8
    );
    return bufToHex(bits);
}

async function hashPassword(password) {
    const salt = await generateSalt();
    const hash = await derivePassword(password, salt);
    return {
        algo: 'pbkdf2-sha256',
        iterations: CONFIG.PBKDF2_ITERATIONS,
        salt,
        hash,
    };
}

async function verifyPassword(password, record) {
    if (!record || typeof record !== 'object') return false;
    if (record.algo !== 'pbkdf2-sha256') return false;
    const derived = await derivePassword(password, record.salt || '');
    return constantTimeEqual(derived, record.hash || '');
}

function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) {

        let dummy = 0;
        const len = Math.max(a.length, b.length);
        for (let i = 0; i < len; i++) {
            dummy |= (a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length));
        }
        return false;
    }
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

async function hmacSign(key, message) {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        hexToBuf(key),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, strToBytes(message));
    return bufToHex(sig);
}

async function hmacVerify(key, message, signature) {
    const expected = await hmacSign(key, message);
    return constantTimeEqual(expected, signature || '');
}

async function issueToken(user, tokenSecretHex) {
    const payload = {
        sub: user.username,
        role: user.role,
        iat: now(),
        exp: now() + CONFIG.TOKEN_TTL_SECONDS,
        jti: uuid(),
    };
    const payloadJson = safeJsonStringify(payload);
    const payloadB64 = base64UrlEncode(payloadJson);
    const sig = await hmacSign(tokenSecretHex, payloadB64);
    return `${payloadB64}.${sig}`;
}

async function verifyToken(token, tokenSecretHex) {
    if (typeof token !== 'string' || !token) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadB64, sig] = parts;

    const ok = await hmacVerify(tokenSecretHex, payloadB64, sig);
    if (!ok) return null;
    const payloadJson = base64UrlDecode(payloadB64);
    const payload = safeJsonParse(payloadJson, null);
    if (!payload || typeof payload !== 'object') return null;
    if (typeof payload.exp !== 'number' || payload.exp < now()) return null;
    return payload;
}

function base64UrlEncode(str) {

    const bytes = strToBytes(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    const b64 = btoa(bin);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(b64) {
    try {
        let padded = b64.replace(/-/g, '+').replace(/_/g, '/');
        while (padded.length % 4 !== 0) padded += '=';
        const bin = atob(padded);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytesToStr(bytes);
    } catch (err) {
        return '';
    }
}

const KV = {

    async get(namespace, key) {
        if (!namespace) throw new Error('KV 命名空间未绑定');
        if (typeof key !== 'string' || !key) return null;
        try {
            return await namespace.get(key);
        } catch (err) {
            console.error(`[KV.get] key=${key} err=`, err);
            throw new Error('KV 读取失败');
        }
    },

    async getJson(namespace, key, fallback = null) {
        const raw = await KV.get(namespace, key);
        if (raw == null) return fallback;
        return safeJsonParse(raw, fallback);
    },

    async put(namespace, key, value, ttl) {
        if (!namespace) throw new Error('KV 命名空间未绑定');
        if (typeof key !== 'string' || !key) throw new Error('KV key 不能为空');
        if (typeof value !== 'string') throw new Error('KV value 必须是字符串');
        try {
            const opts = ttl ? { expirationTtl: ttl } : undefined;
            await namespace.put(key, value, opts);
        } catch (err) {
            console.error(`[KV.put] key=${key} err=`, err);
            throw new Error('KV 写入失败');
        }
    },

    async putJson(namespace, key, value, ttl) {
        await KV.put(namespace, key, safeJsonStringify(value), ttl);
    },

    /** 读取二进制（文件上传用） */
    async getBinary(namespace, key) {
        if (!namespace) throw new Error('KV 命名空间未绑定');
        if (typeof key !== 'string' || !key) return null;
        try {
            return await namespace.get(key, 'arrayBuffer');
        } catch (err) {
            console.error(`[KV.getBinary] key=${key} err=`, err);
            throw new Error('KV 读取失败');
        }
    },

    /** 写入二进制（文件上传用，KV 支持 ArrayBuffer/stream） */
    async putBinary(namespace, key, value, ttl) {
        if (!namespace) throw new Error('KV 命名空间未绑定');
        if (typeof key !== 'string' || !key) throw new Error('KV key 不能为空');
        if (!(value instanceof ArrayBuffer) && !ArrayBuffer.isView(value) && typeof value !== 'string') {
            throw new Error('KV 二进制值类型不支持');
        }
        try {
            const opts = ttl ? { expirationTtl: ttl } : undefined;
            await namespace.put(key, value, opts);
        } catch (err) {
            console.error(`[KV.putBinary] key=${key} err=`, err);
            throw new Error('KV 写入失败');
        }
    },

    async del(namespace, key) {
        if (!namespace) throw new Error('KV 命名空间未绑定');
        try {
            await namespace.delete(key);
        } catch (err) {
            console.error(`[KV.del] key=${key} err=`, err);
            throw new Error('KV 删除失败');
        }
    },

    async listKeys(namespace, prefix, limit = CONFIG.KV_LIST_LIMIT) {
        if (!namespace) throw new Error('KV 命名空间未绑定');
        try {
            const result = await namespace.list({ prefix, limit });
            return result && Array.isArray(result.keys) ? result.keys : [];
        } catch (err) {
            console.error(`[KV.list] prefix=${prefix} err=`, err);
            return [];
        }
    },

    async listJson(namespace, prefix, limit = CONFIG.KV_LIST_LIMIT) {
        const keys = await KV.listKeys(namespace, prefix, limit);
        if (keys.length === 0) return [];
        const entries = await Promise.all(
            keys.map(async k => {
                const value = await KV.getJson(namespace, k.name, null);
                return { key: k.name, value };
            })
        );
        return entries.filter(e => e.value != null);
    },

    async incr(namespace, name) {
        const key = KEYS.COUNTER(name);
        for (let attempt = 0; attempt < 3; attempt++) {
            const current = await KV.getJson(namespace, key, 0) || 0;
            const next = current + 1;
            try {
                await namespace.put(key, String(next));
                return next;
            } catch (err) {

                console.warn(`[KV.incr] retry attempt=${attempt} err=`, err);
                await sleep(50);
            }
        }
        throw new Error('计数器自增失败');
    },
};

function sleep(ms) {
    return Promise.resolve();
}

function checkPasswordStrength(password) {
    if (typeof password !== 'string') {
        return { ok: false, reason: '密码不能为空', hits: 0 };
    }
    if (password.length < 8) {
        return { ok: false, reason: '密码长度至少 8 位', hits: 0 };
    }
    if (password.length > 64) {
        return { ok: false, reason: '密码长度不能超过 64 位', hits: 0 };
    }
    if (/\s/.test(password)) {
        return { ok: false, reason: '密码不能包含空白字符', hits: 0 };
    }
    const has = {
        digit: /\d/.test(password),
        lower: /[a-z]/.test(password),
        upper: /[A-Z]/.test(password),
        symbol: /[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]/.test(password),
    };
    const hits = (has.digit ? 1 : 0) + (has.lower ? 1 : 0) + (has.upper ? 1 : 0) + (has.symbol ? 1 : 0);
    if (hits < 2) {
        return { ok: false, reason: '密码需包含数字、小写字母、大写字母、特殊符号中至少 2 类', hits };
    }
    return { ok: true, reason: '', hits };
}

function jsonRes(status, body, extraHeaders = {}) {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...extraHeaders,
    };
    return new Response(safeJsonStringify(body), { status, headers });
}

function ok(data = null, message = '操作成功') {
    return jsonRes(200, { success: true, message, data });
}

function fail(message = '操作失败', status = 400, extra = null) {
    const body = { success: false, message, error: message };
    if (extra) body.data = extra;
    return jsonRes(status, body);
}

function handleCorsPreflight(req) {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Max-Age': '86400',
            },
        });
    }
    return null;
}

async function extractAuth(req, tokenSecretHex) {
    try {
        const auth = req.headers.get('Authorization') || '';
        if (!auth.startsWith('Bearer ')) return null;
        const token = auth.slice(7).trim();
        if (!token) return null;
        return await verifyToken(token, tokenSecretHex);
    } catch (err) {
        console.warn('[extractAuth] err=', err);
        return null;
    }
}

async function loadUser(ns, username) {
    if (!username) return null;
    const user = await KV.getJson(ns, KEYS.USER(username), null);
    if (!user) return null;

    if (!user.role) user.role = ROLES.GUEST;
    if (!user.status) user.status = 'pending';
    if (!user.createdAt) user.createdAt = now();
    if (!user.updatedAt) user.updatedAt = now();
    return user;
}

function toPublicUser(user) {
    if (!user) return null;
    return {
        username: user.username,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        nickname: user.nickname || user.username,
        avatar: user.avatar || '',
        qqUin: user.qqUin || '',
    };
}

function compareRoles(roleA, roleB) {
    const pa = ROLE_PRIORITY[roleA] ?? -1;
    const pb = ROLE_PRIORITY[roleB] ?? -1;
    return pa - pb;
}

function hasRole(payload, minRole) {
    if (!payload || !payload.role) return false;
    return compareRoles(payload.role, minRole) >= 0;
}

function requireRole(payload, minRole) {
    if (!payload) {
        return fail('请先登录', 401);
    }
    if (!hasRole(payload, minRole)) {
        return fail('权限不足', 403);
    }
    return null;
}

const PASSPHRASE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generatePassphraseText(groups = 4, groupLen = 4) {
    const parts = [];
    const max = Math.floor(256 / PASSPHRASE_ALPHABET.length) * PASSPHRASE_ALPHABET.length;
    for (let g = 0; g < groups; g++) {
        let part = '';
        while (part.length < groupLen) {
            const buf = new Uint8Array(groupLen * 2);
            crypto.getRandomValues(buf);
            for (let i = 0; i < buf.length && part.length < groupLen; i++) {
                if (buf[i] >= max) continue;
                part += PASSPHRASE_ALPHABET[buf[i] % PASSPHRASE_ALPHABET.length];
            }
        }
        parts.push(part);
    }
    return parts.join('-');
}

function normalizePassphrase(raw) {
    if (typeof raw !== 'string') return '';
    return raw
        .replace(/[\u0000-\u001F\u007F]/g, '')
        .replace(/[\s\u3000]+/g, '')
        .replace(/[-_—–·.]/g, '')
        .toUpperCase();
}

function currentPeriod(date = new Date()) {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    return `${y}${m}`;
}

function periodLabel(period) {
    if (typeof period !== 'string' || period.length !== 6) return period || '';
    return `${period.slice(0, 4)} 年 ${Number(period.slice(4, 6))} 月`;
}

function periodExpiresAt(period) {
    const y = Number(period.slice(0, 4));
    const m = Number(period.slice(4, 6));
    return Date.UTC(y, m, 1, 0, 0, 0) + CONFIG.PASSPHRASE_GRACE_DAYS * 24 * 60 * 60 * 1000;
}

async function getActivePassphrase(ns) {
    const pointer = await KV.getJson(ns, KEYS.PASSPHRASE_CURRENT, null);
    if (pointer && pointer.period) {
        const record = await KV.getJson(ns, KEYS.PASSPHRASE(pointer.period), null);
        if (record) return record;
    }
    const legacy = await KV.getJson(ns, KEYS.PASSPHRASE('legacy'), null);
    if (legacy) return legacy;
    return null;
}

async function verifyPassphrase(ns, rawText) {
    const normalized = normalizePassphrase(rawText);
    if (!normalized) return { status: 'empty', period: null };
    const record = await getActivePassphrase(ns);
    if (!record) return { status: 'not-configured', period: null };
    const expiresAt = record.expiresAt || periodExpiresAt(record.period || '');
    if (expiresAt && now() > expiresAt) {
        return { status: 'expired', period: record.period || '', expiresAt };
    }
    const candidate = await derivePassword(normalized, record.salt);
    const matched = constantTimeEqual(candidate, record.hash || '');
    if (!matched) {
        return { status: 'mismatch', period: record.period || '', expiresAt };
    }
    return { status: 'ok', period: record.period || '', expiresAt, label: record.label || '' };
}

async function createPassphrase(ns, opts = {}) {
    const period = opts.period || currentPeriod();
    const plaintext = opts.plaintext || generatePassphraseText();
    const normalized = normalizePassphrase(plaintext);
    const passwordRecord = await hashPassword(normalized);
    const ts = now();
    const expiresAt = periodExpiresAt(period);
    const record = {
        period,
        label: opts.label || `${periodLabel(period)}口令`,
        algo: passwordRecord.algo,
        iterations: passwordRecord.iterations,
        salt: passwordRecord.salt,
        hash: passwordRecord.hash,
        createdAt: ts,
        createdBy: opts.createdBy || 'system',
        expiresAt,
        ttlSeconds: CONFIG.PASSPHRASE_HISTORY_TTL_SECONDS,
    };
    await KV.putJson(ns, KEYS.PASSPHRASE(period), record, CONFIG.PASSPHRASE_HISTORY_TTL_SECONDS);
    // 只有「当月」口令才会成为当前生效口令，历史/预生成周期不会顶掉线上口令
    const isCurrentPeriod = period === currentPeriod();
    if (isCurrentPeriod) {
        await KV.putJson(ns, KEYS.PASSPHRASE_CURRENT, { period, updatedAt: ts, updatedBy: record.createdBy });
    }
    return { record, plaintext, activated: isCurrentPeriod };
}

function passphrasePublicInfo(record) {
    if (!record) {
        return { configured: false, period: '', label: '', expiresAt: 0, expired: false };
    }
    const expiresAt = record.expiresAt || periodExpiresAt(record.period || '');
    return {
        configured: true,
        period: record.period || '',
        label: record.label || periodLabel(record.period || ''),
        createdAt: record.createdAt || 0,
        createdBy: record.createdBy || '',
        expiresAt,
        graceDays: CONFIG.PASSPHRASE_GRACE_DAYS,
        expired: expiresAt > 0 && now() > expiresAt,
    };
}

async function logPassphraseUse(ns, username, result) {
    try {
        await KV.putJson(ns, KEYS.PASSPHRASE_LOG(now(), username), {
            username,
            status: result.status,
            period: result.period || '',
            at: now(),
        }, 180 * 24 * 60 * 60);
    } catch (err) {
        console.warn('[logPassphraseUse] 写入失败：', err);
    }
}

async function bootstrapSystem(ns) {
    try {
        const flag = await KV.get(ns, KEYS.BOOTSTRAP);
        if (flag) {

            return;
        }

        const username = 'JA242424';
        const initialPassword = 'cya130826';

        const strength = checkPasswordStrength(initialPassword);
        if (!strength.ok) {
            console.warn('[bootstrap] 初始密码强度不达标：', strength.reason);
        }
        const passwordRecord = await hashPassword(initialPassword);
        const ts = now();
        const superAdmin = {
            username,
            nickname: 'JA242424',
            role: ROLES.SUPER_ADMIN,
            status: 'active',
            password: passwordRecord,
            createdBy: 'system',
            createdAt: ts,
            updatedAt: ts,
            avatar: '',
        };
        await KV.putJson(ns, KEYS.USER(username), superAdmin);
        await KV.putJson(ns, KEYS.USER_ACTIVE(username), { username, role: ROLES.SUPER_ADMIN });

        await KV.put(ns, KEYS.BOOTSTRAP, String(ts));
        console.log('[bootstrap] 超级管理员初始账号已创建');
    } catch (err) {

        console.error('[bootstrap] 初始化失败：', err);
    }
}

async function handleLogin(req, ns, _payload, _params, env, tokenSecretHex) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    const password = body.password || '';
    if (!username || !password) {
        return fail('请填写用户名与密码', 400);
    }
    if (!isValidUsername(username)) {
        return fail('用户名格式不正确', 400);
    }
    const user = await loadUser(ns, username);
    if (!user) {

        return fail('用户名或密码错误', 401);
    }
    if (user.status === 'pending') {
        return fail('账号待审核，请等待管理员通过', 403);
    }
    if (user.status === 'banned' || user.status === 'disabled') {
        return fail('账号已被禁用，请联系管理员', 403);
    }
    const pwdOk = await verifyPassword(password, user.password);
    if (!pwdOk) {
        return fail('用户名或密码错误', 401);
    }

    const token = await issueToken(user, tokenSecretHex || getTokenSecret(env));

    user.lastLoginAt = now();
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(username), user);
    return ok({ token, user: toPublicUser(user) }, '登录成功');
}

async function handleRegister(req, ns, _payload, _params, env) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    const password = body.password || '';
    const confirmPassword = body.confirmPassword || '';
    const passphrase = typeof body.passphrase === 'string' ? body.passphrase : '';
    const rawQq = body.qqUin != null ? body.qqUin : body.qq;
    const qqUin = normalizeQqUin(rawQq);
    if (rawQq && !qqUin) {
        return fail('QQ 号格式不正确（5-12 位数字，用于拉取头像）', 400);
    }

    if (!username || !password) {
        return fail('请填写完整的注册信息', 400);
    }
    if (!isValidUsername(username)) {
        return fail('用户名需以字母开头，3-20 位字母数字下划线', 400);
    }
    const strength = checkPasswordStrength(password);
    if (!strength.ok) {
        return fail(strength.reason, 400);
    }
    if (password !== confirmPassword) {
        return fail('两次输入的密码不一致', 400);
    }

    const existing = await loadUser(ns, username);
    if (existing) {
        return fail('用户名已被占用', 409);
    }

    const players = await KV.listKeys(ns, 'mcdb:users:', CONFIG.MAX_PLAYERS + 100);
    if (players.length >= CONFIG.MAX_PLAYERS) {
        return fail('注册用户数已达上限', 503);
    }

    const verify = await verifyPassphrase(ns, passphrase);
    const passed = verify.status === 'ok';
    const passwordRecord = await hashPassword(password);
    const ts = now();
    const newUser = {
        username,
        nickname: username,
        role: ROLES.GUEST,
        status: 'pending',
        password: passwordRecord,
        createdBy: 'self',
        createdAt: ts,
        updatedAt: ts,
        avatar: qqUin ? buildQqAvatar(qqUin) : '',
        qqUin: qqUin || '',
        passphraseStatus: passed ? 'passed' : verify.status,
        passphrasePeriod: verify.period || '',
    };
    await KV.putJson(ns, KEYS.USER(username), newUser);
    await KV.putJson(ns, KEYS.USER_PENDING(username), { username, requestedAt: ts });
    await logPassphraseUse(ns, username, verify);
    await writeAuditLog(ns, {
        action: passed ? 'register_passphrase_ok' : 'register_passphrase_fail',
        actor: username,
        target: username,
        detail: passed
            ? `口令校验通过（period=${verify.period}），待管理员审核后设为正式玩家`
            : `口令校验未通过（${verify.status}），按游客排队审核`,
    });
    return ok({
        username,
        qqUin: qqUin || '',
        avatar: qqUin ? buildQqAvatar(qqUin) : '',
        passphrase: {
            passed,
            status: verify.status,
            period: verify.period || '',
            expiresAt: verify.expiresAt || 0,
            message: passed ? '本月口令校验通过，审核通过后即为正式玩家' : passphraseFailureMessage(verify.status),
        },
    }, passed ? '注册成功，口令校验通过，请等待管理员审核' : '注册成功，口令未通过，请等待管理员审核');
}

async function handleLogout(req, ns, payload) {

    if (payload && payload.sub) {
        const user = await loadUser(ns, payload.sub);
        if (user) {
            user.lastLogoutAt = now();
            user.updatedAt = now();
            await KV.putJson(ns, KEYS.USER(payload.sub), user);
        }
    }
    return ok(null, '已登出');
}

async function handleMe(req, ns, payload) {
    if (!payload) return fail('请先登录', 401);
    const user = await loadUser(ns, payload.sub);
    if (!user) return fail('用户不存在', 404);
    return ok({ user: toPublicUser(user) });
}

async function handlePasswordResetRequest(req, ns) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    if (!isValidUsername(username)) {
        return fail('用户名格式不正确', 400);
    }
    const user = await loadUser(ns, username);
    if (!user) {

        return ok(null, '申请已提交，请等待管理员审核');
    }

    const existing = await KV.listKeys(ns, 'mcdb:pwreset:req:', CONFIG.KV_LIST_LIMIT);
    for (const k of existing) {
        const reqObj = await KV.getJson(ns, k.name, null);
        if (reqObj && reqObj.requester === username && reqObj.status === 'pending') {
            return fail('您已有一条待审核的申请，请勿重复提交', 409);
        }
    }
    const id = uuid();
    const ts = now();
    const resetReq = {
        id,
        requester: username,
        requesterRole: user.role,
        status: 'pending',
        handler: '',
        newPassword: null,
        createdAt: ts,
        updatedAt: ts,
        note: sanitizeString(body.note || '', 200),
    };
    await KV.putJson(ns, KEYS.PWRESET_REQ(id), resetReq);
    return ok({ id }, '申请已提交，请等待管理员审核');
}

async function handlePasswordResetList(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:pwreset:req:', CONFIG.DEFAULT_PAGE_SIZE);

    entries.sort((a, b) => (b.value.createdAt || 0) - (a.value.createdAt || 0));
    const list = entries.map(e => e.value);
    return ok({ list });
}

async function handlePasswordResetApprove(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const action = body.action === 'approve' ? 'approve' : (body.action === 'reject' ? 'reject' : '');
    if (!id || !action) return fail('参数缺失', 400);
    const resetReq = await KV.getJson(ns, KEYS.PWRESET_REQ(id), null);
    if (!resetReq) return fail('申请不存在', 404);
    if (resetReq.status !== 'pending') return fail('该申请已处理', 409);

    const requesterRole = resetReq.requesterRole || ROLES.GUEST;
    if (requesterRole === ROLES.SUPER_ADMIN && payload.role !== ROLES.SUPER_ADMIN) {
        return fail('仅超级管理员可处理超管账号的重置申请', 403);
    }
    if (requesterRole === ROLES.ADMIN && payload.role !== ROLES.SUPER_ADMIN) {
        return fail('仅超级管理员可处理管理员账号的重置申请', 403);
    }

    if (action === 'reject') {
        resetReq.status = 'rejected';
        resetReq.handler = payload.sub;
        resetReq.updatedAt = now();
        await KV.putJson(ns, KEYS.PWRESET_REQ(id), resetReq);
        return ok(null, '申请已拒绝');
    }

    resetReq.status = 'approved';
    resetReq.handler = payload.sub;
    resetReq.updatedAt = now();
    await KV.putJson(ns, KEYS.PWRESET_REQ(id), resetReq);
    return ok(null, '申请已通过，请引导用户设置新密码');
}

async function handlePasswordResetExecute(req, ns) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const newPassword = body.newPassword || '';
    const confirmPassword = body.confirmPassword || '';
    if (!id || !newPassword) return fail('参数缺失', 400);
    if (newPassword !== confirmPassword) return fail('两次输入的密码不一致', 400);
    const strength = checkPasswordStrength(newPassword);
    if (!strength.ok) return fail(strength.reason, 400);

    const resetReq = await KV.getJson(ns, KEYS.PWRESET_REQ(id), null);
    if (!resetReq) return fail('申请不存在', 404);
    if (resetReq.status !== 'approved') return fail('申请尚未通过审核', 403);

    const user = await loadUser(ns, resetReq.requester);
    if (!user) return fail('用户不存在', 404);

    user.password = await hashPassword(newPassword);
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(user.username), user);

    resetReq.status = 'done';
    resetReq.updatedAt = now();
    await KV.putJson(ns, KEYS.PWRESET_REQ(id), resetReq);

    return ok(null, '密码已重置，请使用新密码登录');
}

async function handlePasswordResetAdminSet(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const targetUsername = sanitizeString(body.targetUsername || '', 64);
    const newPassword = body.newPassword || '';
    if (!targetUsername || !newPassword) return fail('参数缺失', 400);

    const target = await loadUser(ns, targetUsername);
    if (!target) return fail('目标用户不存在', 404);

    if (target.role === ROLES.SUPER_ADMIN) {
        return fail('超管密码不可由管理员重置', 403);
    }
    if (target.role === ROLES.ADMIN && payload.role !== ROLES.SUPER_ADMIN) {
        return fail('仅超级管理员可重置管理员密码', 403);
    }
    const strength = checkPasswordStrength(newPassword);
    if (!strength.ok) return fail(strength.reason, 400);

    target.password = await hashPassword(newPassword);
    target.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(targetUsername), target);
    return ok(null, `已为 ${targetUsername} 重置密码`);
}

async function handleListUsers(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status') || '';
    const roleFilter = url.searchParams.get('role') || '';
    const limitParam = parseInt(url.searchParams.get('limit') || '', 10);
    const limit = isNaN(limitParam) ? CONFIG.DEFAULT_PAGE_SIZE : Math.min(limitParam, CONFIG.DEFAULT_PAGE_SIZE);

    const entries = await KV.listJson(ns, 'mcdb:users:', limit * 4);
    let list = entries.map(e => e.value).filter(Boolean);

    if (statusFilter) list = list.filter(u => u.status === statusFilter);
    if (roleFilter) list = list.filter(u => u.role === roleFilter);

    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    list = list.slice(0, limit);

    return ok({ list: list.map(toPublicUser) });
}

async function handleListPendingUsers(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:user:pending:', CONFIG.DEFAULT_PAGE_SIZE);
    const list = entries.map(e => e.value).filter(Boolean);
    return ok({ list });
}

async function handleApproveUser(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    if (!username) return fail('用户名不能为空', 400);
    const user = await loadUser(ns, username);
    if (!user) return fail('用户不存在', 404);
    if (user.status !== 'pending') return fail('该用户已被处理或已激活', 409);

    user.status = 'active';
    user.role = ROLES.PLAYER;
    user.approvedBy = payload.sub;
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(username), user);

    await KV.del(ns, KEYS.USER_PENDING(username));

    await KV.putJson(ns, KEYS.USER_ACTIVE(username), { username, role: user.role });
    await writeAuditLog(ns, {
        action: 'approve_user',
        actor: payload.sub,
        target: username,
        detail: user.passphraseStatus === 'passed'
            ? '口令校验已通过，审核后授予正式玩家'
            : `口令状态=${user.passphraseStatus || 'unknown'}，审核后授予正式玩家`,
    });
    return ok({ user: toPublicUser(user) }, `已通过 ${username} 的注册申请`);
}

async function handleRejectUser(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    if (!username) return fail('用户名不能为空', 400);
    const user = await loadUser(ns, username);
    if (!user) return fail('用户不存在', 404);
    if (user.role === ROLES.SUPER_ADMIN) return fail('不可拒绝超管账号', 403);

    await KV.del(ns, KEYS.USER(username));
    await KV.del(ns, KEYS.USER_PENDING(username));
    await KV.del(ns, KEYS.USER_ACTIVE(username));
    return ok(null, `已拒绝 ${username} 的申请`);
}

async function handleBanUser(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    const reason = sanitizeString(body.reason || '', 200);
    if (!username) return fail('用户名不能为空', 400);
    const user = await loadUser(ns, username);
    if (!user) return fail('用户不存在', 404);
    if (user.role === ROLES.SUPER_ADMIN) return fail('不可封禁超级管理员', 403);
    if (user.role === ROLES.ADMIN && payload.role !== ROLES.SUPER_ADMIN) {
        return fail('仅超级管理员可封禁管理员', 403);
    }
    user.status = 'banned';
    user.banReason = reason;
    user.bannedBy = payload.sub;
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(username), user);
    await KV.del(ns, KEYS.USER_ACTIVE(username));
    return ok(null, `已封禁 ${username}`);
}

async function handleUnbanUser(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    if (!username) return fail('用户名不能为空', 400);
    const user = await loadUser(ns, username);
    if (!user) return fail('用户不存在', 404);
    if (user.status !== 'banned') return fail('该用户未被封禁', 409);
    user.status = 'active';
    user.banReason = '';
    user.bannedBy = '';
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(username), user);
    await KV.putJson(ns, KEYS.USER_ACTIVE(username), { username, role: user.role });
    return ok(null, `已解封 ${username}`);
}

async function handleCreateStaff(req, ns, payload) {
    const denied = requireRole(payload, ROLES.SUPER_ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    const password = body.password || '';
    const role = body.role === ROLES.SUPER_ADMIN ? ROLES.SUPER_ADMIN : ROLES.ADMIN;
    if (!username || !password) return fail('参数缺失', 400);
    if (!isValidUsername(username)) return fail('用户名格式不正确', 400);
    const strength = checkPasswordStrength(password);
    if (!strength.ok) return fail(strength.reason, 400);

    const existing = await loadUser(ns, username);
    if (existing) return fail('用户名已被占用', 409);

    if (role === ROLES.SUPER_ADMIN) {
        const allUsers = await KV.listJson(ns, 'mcdb:users:', CONFIG.KV_LIST_LIMIT);
        const superCount = allUsers.filter(e => e.value && e.value.role === ROLES.SUPER_ADMIN && e.value.status === 'active').length;
        if (superCount >= CONFIG.MAX_SUPER_ADMINS) {
            return fail(`超级管理员已达上限 ${CONFIG.MAX_SUPER_ADMINS} 人`, 409);
        }
    }

    if (role === ROLES.ADMIN) {
        const allUsers = await KV.listJson(ns, 'mcdb:users:', CONFIG.KV_LIST_LIMIT);
        const adminCount = allUsers.filter(e => e.value && e.value.role === ROLES.ADMIN && e.value.status === 'active').length;
        if (adminCount >= CONFIG.MAX_ADMINS) {
            return fail(`管理员已达上限 ${CONFIG.MAX_ADMINS} 人`, 409);
        }
    }

    const ts = now();
    const newStaff = {
        username,
        nickname: username,
        role,
        status: 'active',
        password: await hashPassword(password),
        createdBy: payload.sub,
        createdAt: ts,
        updatedAt: ts,
        avatar: '',
    };
    await KV.putJson(ns, KEYS.USER(username), newStaff);
    await KV.putJson(ns, KEYS.USER_ACTIVE(username), { username, role });
    return ok({ user: toPublicUser(newStaff) }, '工作人员账号创建成功');
}

async function handlePromoteUser(req, ns, payload) {
    const denied = requireRole(payload, ROLES.SUPER_ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    if (!username) return fail('用户名不能为空', 400);
    const user = await loadUser(ns, username);
    if (!user) return fail('用户不存在', 404);
    if (user.role !== ROLES.PLAYER && user.role !== ROLES.GUEST) {
        return fail('仅可提升玩家为管理员', 409);
    }

    const allUsers = await KV.listJson(ns, 'mcdb:users:', CONFIG.KV_LIST_LIMIT);
    const adminCount = allUsers.filter(e => e.value && e.value.role === ROLES.ADMIN && e.value.status === 'active').length;
    if (adminCount >= CONFIG.MAX_ADMINS) {
        return fail(`管理员已达上限 ${CONFIG.MAX_ADMINS} 人`, 409);
    }
    user.role = ROLES.ADMIN;
    user.promotedBy = payload.sub;
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(username), user);
    await KV.putJson(ns, KEYS.USER_ACTIVE(username), { username, role: ROLES.ADMIN });
    return ok({ user: toPublicUser(user) }, `${username} 已被提升为管理员`);
}

async function handleDemoteUser(req, ns, payload) {
    const denied = requireRole(payload, ROLES.SUPER_ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const username = sanitizeString(body.username || '', 64);
    if (!username) return fail('用户名不能为空', 400);
    const user = await loadUser(ns, username);
    if (!user) return fail('用户不存在', 404);
    if (user.role !== ROLES.ADMIN) return fail('仅可降级管理员为玩家', 409);
    user.role = ROLES.PLAYER;
    user.demotedBy = payload.sub;
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(username), user);
    await KV.putJson(ns, KEYS.USER_ACTIVE(username), { username, role: ROLES.PLAYER });
    return ok({ user: toPublicUser(user) }, `${username} 已被降级为玩家`);
}

async function handleListAnnouncements(req, ns) {
    const url = new URL(req.url);
    const limitParam = parseInt(url.searchParams.get('limit') || '', 10);
    const limit = isNaN(limitParam) ? CONFIG.DEFAULT_PAGE_SIZE : Math.min(limitParam, CONFIG.DEFAULT_PAGE_SIZE);
    const entries = await KV.listJson(ns, 'mcdb:ann:full:', limit * 2);
    let list = entries.map(e => e.value).filter(Boolean);
    list.sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    list = list.slice(0, limit);
    return ok({ list });
}

async function handleCreateAnnouncement(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const title = sanitizeString(body.title || '', 100);
    const content = sanitizeString(body.content || '', 2000);
    const important = !!body.important;
    if (!title || !content) return fail('标题与内容不能为空', 400);

    const ts = now();
    const id = uuid();
    const ann = {
        id,
        title,
        content,
        author: payload.sub,
        authorRole: payload.role,
        pinned: false,
        important,
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.ANN_FULL(id), ann);
    return ok({ announcement: ann }, '公告已发布');
}

async function handlePinAnnouncement(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const pinned = !!body.pinned;
    if (!id) return fail('公告 ID 不能为空', 400);
    const ann = await KV.getJson(ns, KEYS.ANN_FULL(id), null);
    if (!ann) return fail('公告不存在', 404);
    ann.pinned = pinned;
    ann.updatedAt = now();
    await KV.putJson(ns, KEYS.ANN_FULL(id), ann);
    return ok({ announcement: ann }, pinned ? '已置顶' : '已取消置顶');
}

async function handleDeleteAnnouncement(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('公告 ID 不能为空', 400);
    const key = KEYS.ANN_FULL(id);
    const ann = await KV.getJson(ns, key, null);
    if (!ann) return fail('公告不存在', 404);
    await KV.del(ns, key);
    return ok(null, '公告已删除');
}

async function handleListGroupAnnouncements(req, ns) {
    const entries = await KV.listJson(ns, 'mcdb:ann:group:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean).filter(a => a.status === 'approved');
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleListGroupAnnouncementsPending(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:ann:group:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    const list = entries.map(e => e.value).filter(Boolean).filter(a => a.status === 'pending');
    return ok({ list });
}

async function handleCreateGroupAnnouncement(req, ns, payload) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const title = sanitizeString(body.title || '', 100);
    const content = sanitizeString(body.content || '', 2000);
    if (!title || !content) return fail('标题与内容不能为空', 400);

    const ts = now();
    const id = uuid();
    const ann = {
        id,
        title,
        content,
        author: payload.sub,
        authorRole: payload.role,
        status: hasRole(payload, ROLES.ADMIN) ? 'approved' : 'pending',
        reviewer: '',
        reviewedAt: 0,
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.ANN_GROUP(id), ann);
    if (ann.status === 'pending') {
        await KV.putJson(ns, KEYS.REVIEW('group', id), { type: 'group', id, author: payload.sub, createdAt: ts });
        return ok({ announcement: ann }, '已提交审核');
    }
    return ok({ announcement: ann }, '群公告已发布');
}

async function handleReviewGroupAnnouncement(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const action = body.action === 'approve' ? 'approve' : (body.action === 'reject' ? 'reject' : '');
    if (!id || !action) return fail('参数缺失', 400);
    const ann = await KV.getJson(ns, KEYS.ANN_GROUP(id), null);
    if (!ann) return fail('群公告不存在', 404);
    if (ann.status !== 'pending') return fail('该群公告已审核', 409);
    ann.status = action === 'approve' ? 'approved' : 'rejected';
    ann.reviewer = payload.sub;
    ann.reviewedAt = now();
    ann.updatedAt = now();
    await KV.putJson(ns, KEYS.ANN_GROUP(id), ann);
    await KV.del(ns, KEYS.REVIEW('group', id));
    return ok(null, action === 'approve' ? '已通过审核' : '已拒绝');
}

async function handleListSurveys(req, ns) {
    const entries = await KV.listJson(ns, 'mcdb:survey:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean).filter(s => s.status === 'approved');
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleListPendingSurveys(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:survey:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    const list = entries.map(e => e.value).filter(Boolean).filter(s => s.status === 'pending');
    return ok({ list });
}

async function handleCreateSurvey(req, ns, payload) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const name = sanitizeString(body.name || '', 100);
    const intro = sanitizeString(body.intro || '', 500);
    const creator = sanitizeString(body.creator || '', 50);
    const url = sanitizeString(body.url || '', 500);
    if (!name || !intro || !creator || !url) return fail('所有字段均为必填', 400);
    if (!isValidUrl(url)) return fail('问卷填写地址格式不正确', 400);

    const ts = now();
    const id = uuid();
    const survey = {
        id, name, intro, creator, url,
        status: hasRole(payload, ROLES.ADMIN) ? 'approved' : 'pending',
        reviewer: '',
        reviewedAt: 0,
        completedBy: [],
        author: payload.sub,
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.SURVEY(id), survey);
    if (survey.status === 'pending') {
        await KV.putJson(ns, KEYS.SURVEY_PENDING(id), { id, author: payload.sub, createdAt: ts });
        return ok({ survey }, '已提交审核');
    }
    return ok({ survey }, '问卷已发布');
}

async function handleReviewSurvey(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const action = body.action === 'approve' ? 'approve' : (body.action === 'reject' ? 'reject' : '');
    if (!id || !action) return fail('参数缺失', 400);
    const survey = await KV.getJson(ns, KEYS.SURVEY(id), null);
    if (!survey) return fail('问卷不存在', 404);
    if (survey.status !== 'pending') return fail('该问卷已审核', 409);
    survey.status = action === 'approve' ? 'approved' : 'rejected';
    survey.reviewer = payload.sub;
    survey.reviewedAt = now();
    survey.updatedAt = now();
    await KV.putJson(ns, KEYS.SURVEY(id), survey);
    await KV.del(ns, KEYS.SURVEY_PENDING(id));
    return ok(null, action === 'approve' ? '已通过审核' : '已拒绝');
}

async function handleCompleteSurvey(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('问卷 ID 不能为空', 400);
    const survey = await KV.getJson(ns, KEYS.SURVEY(id), null);
    if (!survey) return fail('问卷不存在', 404);
    if (survey.status !== 'approved') return fail('该问卷未通过审核', 409);

    const doneKey = KEYS.SURVEY_DONE(payload.sub, id);
    const alreadyDone = await KV.getJson(ns, doneKey, null);
    if (alreadyDone) return fail('您已标记完成此问卷', 409);

    await KV.putJson(ns, doneKey, { username: payload.sub, surveyId: id, completedAt: now() });
    if (!Array.isArray(survey.completedBy)) survey.completedBy = [];
    survey.completedBy.push(payload.sub);
    survey.updatedAt = now();
    await KV.putJson(ns, KEYS.SURVEY(id), survey);
    return ok(null, '已标记完成');
}

async function handleDeleteSurvey(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('问卷 ID 不能为空', 400);
    const survey = await KV.getJson(ns, KEYS.SURVEY(id), null);
    if (!survey) return fail('问卷不存在', 404);
    const isAuthor = survey.author === payload.sub;
    const isAdmin = hasRole(payload, ROLES.ADMIN);
    if (!isAuthor && !isAdmin) return fail('无权删除', 403);
    await KV.del(ns, KEYS.SURVEY(id));
    await KV.del(ns, KEYS.SURVEY_PENDING(id));

    if (Array.isArray(survey.completedBy)) {
        for (const u of survey.completedBy) {
            await KV.del(ns, KEYS.SURVEY_DONE(u, id));
        }
    }
    return ok(null, '问卷已删除');
}

async function handleListDispatches(req, ns, payload) {
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status') || '';
    const mine = url.searchParams.get('mine') === 'true';
    const entries = await KV.listJson(ns, 'mcdb:dispatch:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean);
    if (statusFilter) list = list.filter(d => d.status === statusFilter);
    if (mine && payload) {
        list = list.filter(d => d.publisher === payload.sub || d.acceptor === payload.sub);
    }
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleCreateDispatch(req, ns, payload) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const name = sanitizeString(body.name || '', 100);
    const requirements = sanitizeString(body.requirements || '', 1000);
    const reward = sanitizeString(body.reward || '', 200);
    const breachFee = sanitizeString(body.breachFee || '', 200);
    if (!name || !requirements || !reward) return fail('名称、要求、报酬均为必填', 400);

    const ts = now();
    const id = uuid();
    const dispatch = {
        id, name, requirements, reward, breachFee,
        publisher: payload.sub,
        publisherRole: payload.role,
        acceptor: '',
        acceptorRole: '',
        status: 'open',
        contactAdmin: false,
        contactReason: '',
        createdAt: ts,
        acceptedAt: 0,
        completedAt: 0,
        cancelledAt: 0,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.DISPATCH(id), dispatch);
    return ok({ dispatch }, '派遣任务已发布');
}

async function handleAcceptDispatch(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('派遣 ID 不能为空', 400);
    const dispatch = await KV.getJson(ns, KEYS.DISPATCH(id), null);
    if (!dispatch) return fail('派遣不存在', 404);
    if (dispatch.status !== 'open') return fail('该派遣已被接受或已完成', 409);
    if (dispatch.publisher === payload.sub) return fail('不可接受自己发布的派遣', 409);
    dispatch.acceptor = payload.sub;
    dispatch.acceptorRole = payload.role;
    dispatch.status = 'accepted';
    dispatch.acceptedAt = now();
    dispatch.updatedAt = now();
    await KV.putJson(ns, KEYS.DISPATCH(id), dispatch);
    return ok({ dispatch }, '已接受派遣');
}

async function handleCompleteDispatch(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('派遣 ID 不能为空', 400);
    const dispatch = await KV.getJson(ns, KEYS.DISPATCH(id), null);
    if (!dispatch) return fail('派遣不存在', 404);
    if (dispatch.status !== 'accepted') return fail('该派遣不在进行中', 409);
    if (dispatch.publisher !== payload.sub && dispatch.acceptor !== payload.sub) {
        return fail('仅派遣双方可标记完成', 403);
    }
    dispatch.status = 'completed';
    dispatch.completedAt = now();
    dispatch.updatedAt = now();
    await KV.putJson(ns, KEYS.DISPATCH(id), dispatch);
    return ok({ dispatch }, '派遣已完成');
}

async function handleCancelDispatch(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('派遣 ID 不能为空', 400);
    let body = {};
    try { body = await req.json(); } catch (err) {   }
    const dispatch = await KV.getJson(ns, KEYS.DISPATCH(id), null);
    if (!dispatch) return fail('派遣不存在', 404);
    if (dispatch.publisher !== payload.sub) return fail('仅发布者可取消', 403);
    if (dispatch.status === 'completed') return fail('已完成的派遣不可取消', 409);
    dispatch.status = 'cancelled';
    dispatch.cancelReason = sanitizeString(body.reason || '', 200);
    dispatch.payBreachFee = !!body.payBreachFee;
    dispatch.cancelledAt = now();
    dispatch.updatedAt = now();
    await KV.putJson(ns, KEYS.DISPATCH(id), dispatch);
    return ok({ dispatch }, '派遣已取消');
}

async function handleDispatchContactAdmin(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('派遣 ID 不能为空', 400);
    let body = {};
    try { body = await req.json(); } catch (err) {   }
    const dispatch = await KV.getJson(ns, KEYS.DISPATCH(id), null);
    if (!dispatch) return fail('派遣不存在', 404);
    if (dispatch.publisher !== payload.sub && dispatch.acceptor !== payload.sub) {
        return fail('仅派遣双方可联系管理员', 403);
    }
    dispatch.contactAdmin = true;
    dispatch.contactReason = sanitizeString(body.reason || '', 200);
    dispatch.contactBy = payload.sub;
    dispatch.updatedAt = now();
    await KV.putJson(ns, KEYS.DISPATCH(id), dispatch);
    return ok({ dispatch }, '已通知管理员介入');
}

async function handleDeleteDispatch(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('派遣 ID 不能为空', 400);
    const dispatch = await KV.getJson(ns, KEYS.DISPATCH(id), null);
    if (!dispatch) return fail('派遣不存在', 404);
    const isAuthor = dispatch.publisher === payload.sub;
    const isAdmin = hasRole(payload, ROLES.ADMIN);
    if (!isAuthor && !isAdmin) return fail('无权删除', 403);
    await KV.del(ns, KEYS.DISPATCH(id));
    return ok(null, '派遣已删除');
}

const MEDIA_ALLOWED_EXT = ['mp4', 'mp3', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'webm', 'mov', 'ogg', 'wav'];

function isValidMediaExt(ext) {
    if (typeof ext !== 'string') return false;
    return MEDIA_ALLOWED_EXT.includes(ext.toLowerCase());
}

async function handleListMedia(req, ns, payload) {
    const entries = await KV.listJson(ns, 'mcdb:media:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean).filter(m => m.status === 'approved');

    if (!payload || !hasRole(payload, ROLES.PLAYER)) {
        list = list.slice(0, 10);
    }
    list.sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleListPendingMedia(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:media:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    const list = entries.map(e => e.value).filter(Boolean).filter(m => m.status === 'pending');
    return ok({ list });
}

async function handleCreateMedia(req, ns, payload) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const name = sanitizeString(body.name || '', 100);
    const fileExt = sanitizeString(body.fileExt || '', 20).toLowerCase();
    const fileUrl = sanitizeString(body.fileUrl || '', 1000);
    const description = sanitizeString(body.description || '', 500);
    if (!name || !fileExt || !fileUrl) return fail('名称、文件类型、地址均为必填', 400);
    if (!isValidMediaExt(fileExt)) return fail(`文件类型不被允许，仅支持：${MEDIA_ALLOWED_EXT.join(', ')}`, 400);
    if (!isValidUrl(fileUrl)) return fail('文件地址格式不正确', 400);

    const ts = now();
    const id = uuid();
    const media = {
        id, name, fileExt, fileUrl, description,
        author: payload.sub,
        authorRole: payload.role,
        pinned: false,
        status: hasRole(payload, ROLES.ADMIN) ? 'approved' : 'pending',
        reviewer: '',
        reviewedAt: 0,
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.MEDIA(id), media);
    if (media.status === 'pending') {
        await KV.putJson(ns, KEYS.REVIEW('media', id), { type: 'media', id, author: payload.sub, createdAt: ts });
        return ok({ media }, '已提交审核');
    }
    return ok({ media }, '媒体已发布');
}

async function handleReviewMedia(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const action = body.action === 'approve' ? 'approve' : (body.action === 'reject' ? 'reject' : '');
    if (!id || !action) return fail('参数缺失', 400);
    const media = await KV.getJson(ns, KEYS.MEDIA(id), null);
    if (!media) return fail('媒体不存在', 404);
    if (media.status !== 'pending') return fail('该媒体已审核', 409);
    media.status = action === 'approve' ? 'approved' : 'rejected';
    media.reviewer = payload.sub;
    media.reviewedAt = now();
    media.updatedAt = now();
    await KV.putJson(ns, KEYS.MEDIA(id), media);
    await KV.del(ns, KEYS.REVIEW('media', id));
    return ok(null, action === 'approve' ? '已通过审核' : '已拒绝');
}

async function handlePinMedia(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const pinned = !!body.pinned;
    if (!id) return fail('媒体 ID 不能为空', 400);
    const media = await KV.getJson(ns, KEYS.MEDIA(id), null);
    if (!media) return fail('媒体不存在', 404);
    media.pinned = pinned;
    media.updatedAt = now();
    await KV.putJson(ns, KEYS.MEDIA(id), media);
    return ok({ media }, pinned ? '已置顶' : '已取消置顶');
}

async function handleDeleteMedia(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('媒体 ID 不能为空', 400);
    const media = await KV.getJson(ns, KEYS.MEDIA(id), null);
    if (!media) return fail('媒体不存在', 404);
    const isAuthor = media.author === payload.sub;
    const isAdmin = hasRole(payload, ROLES.ADMIN);
    if (!isAuthor && !isAdmin) return fail('无权删除', 403);
    await KV.del(ns, KEYS.MEDIA(id));
    await KV.del(ns, KEYS.REVIEW('media', id));
    return ok(null, '媒体已删除');
}

const PROJECTION_ALLOWED_EXT = ['litematic', 'nbt', 'schematic', 'zip', 'json', 'mcstructure', 'litemod'];

async function handleListProjections(req, ns, payload) {
    const entries = await KV.listJson(ns, 'mcdb:projection:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean).filter(p => p.status === 'approved');
    if (!payload || !hasRole(payload, ROLES.PLAYER)) {
        list = list.slice(0, 10);
    }
    list.sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleListPendingProjections(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:projection:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    const list = entries.map(e => e.value).filter(Boolean).filter(p => p.status === 'pending');
    return ok({ list });
}

async function handleCreateProjection(req, ns, payload) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const name = sanitizeString(body.name || '', 100);
    const purpose = sanitizeString(body.purpose || '', 500);
    const fileUrl = sanitizeString(body.fileUrl || '', 1000);
    const fileExt = sanitizeString(body.fileExt || '', 20).toLowerCase();
    if (!name || !purpose || !fileUrl || !fileExt) return fail('所有字段均为必填', 400);
    if (!isValidUrl(fileUrl)) return fail('文件地址格式不正确', 400);
    if (!PROJECTION_ALLOWED_EXT.includes(fileExt)) {
        return fail(`文件类型不被允许，仅支持：${PROJECTION_ALLOWED_EXT.join(', ')}`, 400);
    }
    const ts = now();
    const id = uuid();
    const proj = {
        id, name, purpose, fileUrl, fileExt,
        author: payload.sub,
        authorRole: payload.role,
        pinned: false,
        status: hasRole(payload, ROLES.ADMIN) ? 'approved' : 'pending',
        reviewer: '',
        reviewedAt: 0,
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.PROJECTION(id), proj);
    if (proj.status === 'pending') {
        await KV.putJson(ns, KEYS.REVIEW('projection', id), { type: 'projection', id, author: payload.sub, createdAt: ts });
        return ok({ projection: proj }, '已提交审核');
    }
    return ok({ projection: proj }, '投影文件已发布');
}

async function handleReviewProjection(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const action = body.action === 'approve' ? 'approve' : (body.action === 'reject' ? 'reject' : '');
    if (!id || !action) return fail('参数缺失', 400);
    const proj = await KV.getJson(ns, KEYS.PROJECTION(id), null);
    if (!proj) return fail('投影文件不存在', 404);
    if (proj.status !== 'pending') return fail('该投影已审核', 409);
    proj.status = action === 'approve' ? 'approved' : 'rejected';
    proj.reviewer = payload.sub;
    proj.reviewedAt = now();
    proj.updatedAt = now();
    await KV.putJson(ns, KEYS.PROJECTION(id), proj);
    await KV.del(ns, KEYS.REVIEW('projection', id));
    return ok(null, action === 'approve' ? '已通过审核' : '已拒绝');
}

async function handlePinProjection(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const pinned = !!body.pinned;
    if (!id) return fail('投影 ID 不能为空', 400);
    const proj = await KV.getJson(ns, KEYS.PROJECTION(id), null);
    if (!proj) return fail('投影文件不存在', 404);
    proj.pinned = pinned;
    proj.updatedAt = now();
    await KV.putJson(ns, KEYS.PROJECTION(id), proj);
    return ok({ projection: proj }, pinned ? '已置顶' : '已取消置顶');
}

async function handleDeleteProjection(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('投影 ID 不能为空', 400);
    const proj = await KV.getJson(ns, KEYS.PROJECTION(id), null);
    if (!proj) return fail('投影文件不存在', 404);
    const isAuthor = proj.author === payload.sub;
    const isAdmin = hasRole(payload, ROLES.ADMIN);
    if (!isAuthor && !isAdmin) return fail('无权删除', 403);
    await KV.del(ns, KEYS.PROJECTION(id));
    await KV.del(ns, KEYS.REVIEW('projection', id));
    return ok(null, '投影已删除');
}

async function handleListBugs(req, ns, payload) {
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get('status') || '';
    const mine = url.searchParams.get('mine') === 'true';
    const entries = await KV.listJson(ns, 'mcdb:bug:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean);
    if (statusFilter) list = list.filter(b => b.status === statusFilter);
    if (mine && payload) list = list.filter(b => b.reporter === payload.sub);
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleCreateBug(req, ns, payload) {
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const title = sanitizeString(body.title || '', 100);
    const description = sanitizeString(body.description || '', 2000);
    const severity = ['low', 'medium', 'high', 'critical'].includes(body.severity) ? body.severity : 'medium';
    if (!title || !description) return fail('标题与描述不能为空', 400);

    const ts = now();
    const id = uuid();
    const bug = {
        id, title, description, severity,
        reporter: payload ? payload.sub : 'guest',
        reporterRole: payload ? payload.role : ROLES.GUEST,
        status: 'open',
        handler: '',
        handlerNote: '',
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.BUG(id), bug);
    return ok({ bug }, 'Bug 已提交，感谢反馈');
}

async function handleFixBug(req, ns, payload, params) {
    const denied = requireRole(payload, ROLES.SUPER_ADMIN);
    if (denied) return denied;
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('Bug ID 不能为空', 400);
    let body = {};
    try { body = await req.json(); } catch (err) {   }
    const status = ['fixed', 'wontfix', 'in-progress'].includes(body.status) ? body.status : 'fixed';
    const bug = await KV.getJson(ns, KEYS.BUG(id), null);
    if (!bug) return fail('Bug 不存在', 404);
    bug.status = status;
    bug.handler = payload.sub;
    bug.handlerNote = sanitizeString(body.note || '', 500);
    bug.updatedAt = now();
    await KV.putJson(ns, KEYS.BUG(id), bug);
    return ok({ bug }, status === 'fixed' ? '已标记为已修复' : `状态已更新：${status}`);
}

async function handleDeleteBug(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('Bug ID 不能为空', 400);
    const bug = await KV.getJson(ns, KEYS.BUG(id), null);
    if (!bug) return fail('Bug 不存在', 404);
    const isAuthor = bug.reporter === payload.sub;
    const isSuper = payload.role === ROLES.SUPER_ADMIN;
    if (!isAuthor && !isSuper) return fail('无权删除', 403);
    await KV.del(ns, KEYS.BUG(id));
    return ok(null, 'Bug 已删除');
}

async function handleListEvents(req, ns) {
    const entries = await KV.listJson(ns, 'mcdb:event:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean).filter(ev => ev.status === 'approved' || ev.status === 'ongoing' || ev.status === 'ended');
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    list = list.slice(0, CONFIG.DEFAULT_PAGE_SIZE);
    return ok({ list });
}

async function handleListPendingEvents(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    const entries = await KV.listJson(ns, 'mcdb:event:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    const list = entries.map(e => e.value).filter(Boolean).filter(ev => ev.status === 'pending');
    return ok({ list });
}

async function handleListMyEvents(req, ns, payload) {
    if (!payload) return fail('请先登录', 401);
    const entries = await KV.listJson(ns, 'mcdb:event:', CONFIG.DEFAULT_PAGE_SIZE * 2);
    let list = entries.map(e => e.value).filter(Boolean).filter(ev => {
        if (ev.publisher === payload.sub) return true;
        if (Array.isArray(ev.participants)) {
            return ev.participants.some(p => p.username === payload.sub);
        }
        return false;
    });
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return ok({ list });
}

async function handleCreateEvent(req, ns, payload) {
    const denied = requireRole(payload, ROLES.PLAYER);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const name = sanitizeString(body.name || '', 100);
    const intro = sanitizeString(body.intro || '', 1000);
    const eventDate = sanitizeString(body.eventDate || '', 50);
    const host = sanitizeString(body.host || '', 100);
    const organizer = sanitizeString(body.organizer || '', 100);
    const sponsor = sanitizeString(body.sponsor || '', 200);
    if (!name || !intro || !eventDate || !host) return fail('活动名称、介绍、日期、主办方均为必填', 400);

    const ts = now();
    const id = uuid();
    const event = {
        id, name, intro, eventDate,
        host, organizer, sponsor,
        publisher: payload.sub,
        publisherRole: payload.role,
        status: hasRole(payload, ROLES.ADMIN) ? 'approved' : 'pending',
        reviewer: '',
        reviewedAt: 0,
        startedAt: 0,
        endedAt: 0,
        participants: [],
        createdAt: ts,
        updatedAt: ts,
    };
    await KV.putJson(ns, KEYS.EVENT(id), event);
    if (event.status === 'pending') {
        await KV.putJson(ns, KEYS.REVIEW('event', id), { type: 'event', id, author: payload.sub, createdAt: ts });
        return ok({ event }, '已提交审核');
    }
    return ok({ event }, '活动已发布');
}

async function handleReviewEvent(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const id = sanitizeString(body.id || '', 64);
    const action = body.action === 'approve' ? 'approve' : (body.action === 'reject' ? 'reject' : '');
    if (!id || !action) return fail('参数缺失', 400);
    const event = await KV.getJson(ns, KEYS.EVENT(id), null);
    if (!event) return fail('活动不存在', 404);
    if (event.status !== 'pending') return fail('该活动已审核', 409);
    event.status = action === 'approve' ? 'approved' : 'rejected';
    event.reviewer = payload.sub;
    event.reviewedAt = now();
    event.updatedAt = now();
    await KV.putJson(ns, KEYS.EVENT(id), event);
    await KV.del(ns, KEYS.REVIEW('event', id));
    return ok(null, action === 'approve' ? '已通过审核' : '已拒绝');
}

async function handleStartEvent(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('活动 ID 不能为空', 400);
    const event = await KV.getJson(ns, KEYS.EVENT(id), null);
    if (!event) return fail('活动不存在', 404);
    if (event.publisher !== payload.sub && !hasRole(payload, ROLES.ADMIN)) {
        return fail('仅发布者或管理员可开始活动', 403);
    }
    if (event.status !== 'approved') return fail('活动当前状态不可开始', 409);
    event.status = 'ongoing';
    event.startedAt = now();
    event.updatedAt = now();
    await KV.putJson(ns, KEYS.EVENT(id), event);
    return ok({ event }, '活动已开始');
}

async function handleEndEvent(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('活动 ID 不能为空', 400);
    const event = await KV.getJson(ns, KEYS.EVENT(id), null);
    if (!event) return fail('活动不存在', 404);
    if (event.publisher !== payload.sub && !hasRole(payload, ROLES.ADMIN)) {
        return fail('仅发布者或管理员可结束活动', 403);
    }
    if (event.status !== 'ongoing') return fail('活动当前状态不可结束', 409);
    event.status = 'ended';
    event.endedAt = now();
    event.updatedAt = now();
    await KV.putJson(ns, KEYS.EVENT(id), event);
    return ok({ event }, '活动已结束');
}

async function handleJoinEvent(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);

    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('活动 ID 不能为空', 400);
    let body = {};
    try { body = await req.json(); } catch (err) {   }
    const gameId = sanitizeString(body.gameId || '', 32);
    if (!isValidGameId(gameId)) return fail('游戏名格式不正确（1-32 字符）', 400);
    const event = await KV.getJson(ns, KEYS.EVENT(id), null);
    if (!event) return fail('活动不存在', 404);
    if (event.status !== 'approved' && event.status !== 'ongoing') {
        return fail('活动当前状态不可报名', 409);
    }
    if (!Array.isArray(event.participants)) event.participants = [];
    const already = event.participants.find(p => p.username === payload.sub);
    if (already) return fail('您已报名此活动', 409);
    const participant = { username: payload.sub, gameId, joinedAt: now() };
    event.participants.push(participant);
    event.updatedAt = now();
    await KV.putJson(ns, KEYS.EVENT(id), event);
    await KV.putJson(ns, KEYS.EVENT_JOIN(id, payload.sub), participant);
    return ok({ event }, '报名成功');
}

async function handleLeaveEvent(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('活动 ID 不能为空', 400);
    const event = await KV.getJson(ns, KEYS.EVENT(id), null);
    if (!event) return fail('活动不存在', 404);
    if (!Array.isArray(event.participants)) event.participants = [];
    const idx = event.participants.findIndex(p => p.username === payload.sub);
    if (idx < 0) return fail('您未报名此活动', 409);
    event.participants.splice(idx, 1);
    event.updatedAt = now();
    await KV.putJson(ns, KEYS.EVENT(id), event);
    await KV.del(ns, KEYS.EVENT_JOIN(id, payload.sub));
    return ok(null, '已取消报名');
}

async function handleDeleteEvent(req, ns, payload, params) {
    if (!payload) return fail('请先登录', 401);
    const id = sanitizeString(params.id || '', 64);
    if (!id) return fail('活动 ID 不能为空', 400);
    const event = await KV.getJson(ns, KEYS.EVENT(id), null);
    if (!event) return fail('活动不存在', 404);
    const isAuthor = event.publisher === payload.sub;
    const isAdmin = hasRole(payload, ROLES.ADMIN);
    if (!isAuthor && !isAdmin) return fail('无权删除', 403);
    await KV.del(ns, KEYS.EVENT(id));
    await KV.del(ns, KEYS.REVIEW('event', id));

    if (Array.isArray(event.participants)) {
        for (const p of event.participants) {
            await KV.del(ns, KEYS.EVENT_JOIN(id, p.username));
        }
    }
    return ok(null, '活动已删除');
}

async function handleHealthCheck(req, ns, _payload, _params, env) {
    env = env || {};
    let kvOk = false;
    let bootstrapOk = false;
    let tokenSecretOk = false;
    let bootstrapTime = 0;
    try {
        const flag = await KV.get(ns, KEYS.BOOTSTRAP);
        if (flag) {
            bootstrapOk = true;
            bootstrapTime = parseInt(flag, 10) || 0;
        }
        kvOk = true;
    } catch (err) {
        kvOk = false;
    }

    if (typeof env.TOKEN_SECRET === 'string' && env.TOKEN_SECRET.length >= 32) {
        tokenSecretOk = true;
    }
    return ok({
        service: 'mc-backend',
        version: '1.0.0',
        environment: CONFIG.ENVIRONMENT,
        kvBinding: CONFIG.KV_BINDING_NAME,
        kvOk,
        bootstrapOk,
        bootstrapTime: bootstrapTime ? formatTime(bootstrapTime) : '',
        tokenSecretOk,
        qqAvatar: {
            enabled: true,
            template: CONFIG.QQ_AVATAR_TEMPLATE,
            spec: CONFIG.QQ_AVATAR_SPEC,
        },
        passphrase: passphrasePublicInfo(await getActivePassphrase(ns)),
        timestamp: now(),
        frontendOrigin: CONFIG.FRONTEND_ORIGIN,
        hints: {
            kvNotBound: !kvOk ? 'KV 命名空间未绑定，请在 Worker Settings 中绑定 MC_DB' : null,
            tokenSecretMissing: !tokenSecretOk ? 'TOKEN_SECRET 未设置或长度不足 32，请在 Secrets 中注入 64 字符十六进制密钥' : null,
            bootstrapNotRun: !bootstrapOk ? 'Bootstrap 尚未运行，超管账号未创建。请重新访问本端点触发。' : null,
            passphraseNotConfigured: '口令未生成时可在超管面板「本月口令」中一键生成',
        },
    }, 'ok');
}

// ----------------------------------------------------------------------------
// QQ 头像（路线二：不接入 QQ 互联，只按 QQ 号拉公开头像）
// 头像接口：https://q.qlogo.cn/headimg_dl?dst_uin=<QQ号>&spec=100
// 该接口无需授权、无需实名，知道 QQ 号即可取得头像，因此注册流程改为
// 「游戏 ID + QQ 号 + 本月口令」，身份校验仍然只依赖口令哈希与有效期。
// ----------------------------------------------------------------------------

function isValidQqUin(uin) {
    if (typeof uin !== 'string' && typeof uin !== 'number') return false;
    const s = String(uin).trim();
    return /^[1-9][0-9]{4,11}$/.test(s);
}

function normalizeQqUin(uin) {
    const s = sanitizeString(String(uin == null ? '' : uin), 16).replace(/\D/g, '');
    return isValidQqUin(s) ? s : '';
}

function buildQqAvatar(uin, spec) {
    const qq = normalizeQqUin(uin);
    if (!qq) return '';
    const size = Number(spec) || CONFIG.QQ_AVATAR_SPEC;
    return CONFIG.QQ_AVATAR_TEMPLATE
        .replace('{uin}', encodeURIComponent(qq))
        .replace('spec=100', `spec=${size}`);
}

async function handleQqAvatarInfo(req, ns, _payload, params) {
    // 公开接口：无论是否登录都可调用（注册页需要在未登录状态下预览头像）
    let body = {};
    try {
        body = await req.json();
    } catch (err) {
        body = {};
    }
    let fromQuery = '';
    try {
        if (req.method === 'GET') fromQuery = new URL(req.url).searchParams.get('uin') || '';
    } catch (err) {
        fromQuery = '';
    }
    const raw = (body.uin != null ? body.uin : (fromQuery || (params && params.uin)));
    const uin = normalizeQqUin(raw);
    if (!uin) return fail('QQ 号格式不正确（5-12 位数字）', 400);
    return ok({ uin, avatar: buildQqAvatar(uin) });
}

async function handleUpdateQqAvatar(req, ns, payload) {
    const deny = requireRole(payload, ROLES.GUEST);
    if (deny) return deny;
    let body = {};
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const uin = normalizeQqUin(body.uin);
    if (!uin) return fail('QQ 号格式不正确（5-12 位数字）', 400);
    const user = await loadUser(ns, payload.sub);
    if (!user) return fail('用户不存在', 404);
    user.qqUin = uin;
    user.avatar = buildQqAvatar(uin);
    user.updatedAt = now();
    await KV.putJson(ns, KEYS.USER(user.username), user);
    await writeAuditLog(ns, {
        action: 'update_qq_avatar',
        actor: payload.sub,
        target: user.username,
        detail: `更新 QQ 头像（uin=${uin}）`,
    });
    return ok({ user: toPublicUser(user), avatar: user.avatar }, 'QQ 头像已更新');
}

function passphraseFailureMessage(status) {
    switch (status) {
        case 'empty':
            return '未填写口令，当前为游客身份';
        case 'expired':
            return '本月口令已过期，当前为游客身份';
        case 'not-configured':
            return '服务端尚未配置口令，当前为游客身份';
        case 'mismatch':
            return '口令不正确，当前为游客身份';
        default:
            return '口令校验未通过，当前为游客身份';
    }
}

function getTokenSecret(env) {
    if (env && typeof env.TOKEN_SECRET === 'string' && env.TOKEN_SECRET) return env.TOKEN_SECRET;
    if (CONFIG.TOKEN_SECRET) return CONFIG.TOKEN_SECRET;
    return '';
}

// ----------------------------------------------------------------------------
// 服务器信息（IP / 版本），可由超级管理员在门户里修改，存 KV
// ----------------------------------------------------------------------------

const SERVER_INFO_DEFAULT = {
    ip: 'play.yourserver.com',
    version: '1.20.4',
    versionNote: 'Java 版，支持 1.20.4 - 1.21.x',
    updatedAt: 0,
    updatedBy: '',
};

function isValidHost(host) {
    if (typeof host !== 'string') return false;
    const s = host.trim();
    if (s.length < 3 || s.length > 120) return false;
    // 允许域名、IPv4、IPv6、带端口
    return /^[A-Za-z0-9._:\-\[\]]+$/.test(s);
}

function sanitizeServerInfo(input, base) {
    const out = {
        ip: base.ip,
        version: base.version,
        versionNote: base.versionNote,
    };
    if (input && typeof input === 'object') {
        if (input.ip != null) {
            const ip = sanitizeString(String(input.ip), 200).trim();
            // 留空表示「不修改此项」，避免误清空线上地址
            if (ip) {
                if (!isValidHost(ip)) return { error: '服务器地址格式不正确（只能是域名 / IP，可带端口，最长 120 字符）' };
                out.ip = ip;
            }
        }
        if (input.version != null) {
            const raw = sanitizeString(String(input.version), 80).trim();
            if (raw) {
                if (raw.length > 40) return { error: '游戏版本过长（最多 40 字符）' };
                if (!/^[0-9A-Za-z._+\- ]{1,40}$/.test(raw)) return { error: '游戏版本格式不正确（如 1.20.4）' };
                out.version = raw;
            }
        }
        if (input.versionNote != null) {
            out.versionNote = sanitizeString(String(input.versionNote), 160).trim();
        }
    }
    return { value: out };
}

async function getServerInfo(ns) {
    const stored = await KV.getJson(ns, KEYS.SERVER_INFO, null);
    if (!stored) return { ...SERVER_INFO_DEFAULT };
    const merged = sanitizeServerInfo(stored, SERVER_INFO_DEFAULT);
    return merged.value || { ...SERVER_INFO_DEFAULT };
}

async function handleServerInfo(req, ns) {
    return ok({ serverInfo: await getServerInfo(ns) });
}

async function handleUpdateServerInfo(req, ns, payload) {
    const deny = requireRole(payload, ROLES.SUPER_ADMIN);
    if (deny) return deny;
    let body;
    try {
        body = await req.json();
    } catch (err) {
        return fail('请求体格式错误', 400);
    }
    const current = await getServerInfo(ns);
    const parsed = sanitizeServerInfo(body, current);
    if (parsed.error) return fail(parsed.error, 400);
    const next = {
        ...parsed.value,
        updatedAt: now(),
        updatedBy: payload.sub,
    };
    await KV.putJson(ns, KEYS.SERVER_INFO, next);
    await writeAuditLog(ns, {
        action: 'update_server_info',
        actor: payload.sub,
        target: 'server',
        detail: `IP=${next.ip} 版本=${next.version}`,
    });
    return ok({ serverInfo: next }, '服务器信息已更新');
}

// ----------------------------------------------------------------------------
// 文件上传（媒体 / 投影）
// 说明：二进制存 KV（单值上限 25 MiB，故限制 20 MiB）。
//   上传：POST /api/upload?filename=xxx.mp3&ext=mp3   body = 原始二进制
//   读取：GET  /api/files/:id                        支持 Range（音视频拖动播放）
//   fileUrl 直接落成绝对地址，媒体/投影原有的 fileUrl 字段与渲染逻辑无需改动。
// ----------------------------------------------------------------------------

function getFileContentType(ext) {
    return CONFIG.FILE_CONTENT_TYPES[String(ext || '').toLowerCase()] || 'application/octet-stream';
}

function isAllowedFileExt(ext) {
    return CONFIG.FILE_ALLOWED_EXT.includes(String(ext || '').toLowerCase());
}

function fileIdFromName(name) {
    // 保留中文等 Unicode 字母数字（用于 Content-Disposition 的下载名），其余替换为下划线
    const safe = sanitizeString(String(name || ''), 120)
        .replace(/\.[^.]*$/, '')                     // 去掉扩展名，扩展名单独记录
        .replace(/[^\p{L}\p{N}._-]+/gu, '_')
        .replace(/^[_.]+|[_.]+$/g, '')
        .slice(0, 48);
    return `${Date.now().toString(36)}_${uuid().slice(0, 8)}_${safe || 'file'}`;
}

function parseRangeHeader(header, size) {
    if (typeof header !== 'string' || !header.startsWith('bytes=')) return null;
    const spec = header.slice(6).split(',')[0].trim();
    const [startRaw, endRaw] = spec.split('-');
    let start = startRaw === '' ? null : parseInt(startRaw, 10);
    let end = endRaw === '' ? null : parseInt(endRaw, 10);
    if (start === null && end === null) return null;
    if (start === null) {
        // 形如 bytes=-500：最后 500 字节
        const suffix = end;
        if (!Number.isFinite(suffix) || suffix <= 0) return null;
        start = Math.max(0, size - suffix);
        end = size - 1;
    } else {
        if (!Number.isFinite(start) || start < 0) return null;
        if (end === null || !Number.isFinite(end) || end >= size) end = size - 1;
    }
    if (start > end || start >= size) return null;
    return { start, end };
}

async function handleUploadFile(req, ns, payload, params, env) {
    const deny = requireRole(payload, ROLES.PLAYER);
    if (deny) return deny;

    const url = new URL(req.url);
    const ext = sanitizeString(url.searchParams.get('ext') || '', 12).toLowerCase();
    const filename = sanitizeString(url.searchParams.get('filename') || '', 120);
    if (!ext) return fail('缺少文件扩展名（ext 参数）', 400);
    if (!isAllowedFileExt(ext)) {
        return fail(`不支持的文件类型 .${ext}，允许：${CONFIG.FILE_ALLOWED_EXT.join(', ')}`, 400);
    }

    const declared = parseInt(req.headers.get('Content-Length') || '0', 10) || 0;
    if (declared && declared > CONFIG.FILE_MAX_BYTES) {
        return fail(`文件过大：${(declared / 1048576).toFixed(1)} MiB，上限 ${(CONFIG.FILE_MAX_BYTES / 1048576).toFixed(0)} MiB（更大文件请改用外链）`, 413);
    }

    let buffer;
    try {
        buffer = await req.arrayBuffer();
    } catch (err) {
        return fail('读取上传内容失败', 400);
    }
    const bytes = buffer.byteLength;
    if (!bytes) return fail('上传内容为空', 400);
    if (bytes > CONFIG.FILE_MAX_BYTES) {
        return fail(`文件过大：${(bytes / 1048576).toFixed(1)} MiB，上限 ${(CONFIG.FILE_MAX_BYTES / 1048576).toFixed(0)} MiB（更大文件请改用外链）`, 413);
    }

    const id = fileIdFromName(filename || `upload.${ext}`);
    const meta = {
        id,
        name: filename || `upload.${ext}`,
        ext,
        size: bytes,
        contentType: getFileContentType(ext),
        uploader: payload.sub,
        createdAt: now(),
    };
    try {
        await KV.putBinary(ns, KEYS.FILE_BLOB(id), buffer, CONFIG.FILE_TTL_SECONDS);
        await KV.putJson(ns, KEYS.FILE_META(id), meta, CONFIG.FILE_TTL_SECONDS);
    } catch (err) {
        console.error('[handleUploadFile] 写入失败:', err);
        return fail('文件保存失败（可能是文件过大或存储配额不足）', 500);
    }

    const backendOrigin = `${url.protocol}//${url.host}`;
    const fileUrl = `${backendOrigin}/api/files/${encodeURIComponent(id)}`;
    await writeAuditLog(ns, {
        action: 'upload_file',
        actor: payload.sub,
        target: id,
        detail: `${meta.name}（${(bytes / 1024).toFixed(0)} KB, .${ext}）`,
    });
    return ok({ id, url: fileUrl, fileUrl, size: bytes, ext, contentType: meta.contentType }, '上传成功');
}

async function handleGetFile(req, ns, _payload, params) {
    const id = sanitizeString((params && params.id) || '', 140);
    if (!id) return fail('缺少文件 id', 400);
    let meta = await KV.getJson(ns, KEYS.FILE_META(id), null);
    let buffer = null;
    try {
        buffer = await KV.getBinary(ns, KEYS.FILE_BLOB(id));
    } catch (err) {
        console.error('[handleGetFile] 读取失败:', err);
        buffer = null;
    }
    if (!buffer) {
        return new Response('文件不存在或已过期', {
            status: 404,
            headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
    }
    const bytes = new Uint8Array(buffer);
    const total = bytes.byteLength;
    const ext = (meta && meta.ext) || sanitizeString(id.split('.').pop() || '', 12);
    const contentType = (meta && meta.contentType) || getFileContentType(ext);
    const baseHeaders = {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=604800, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent((meta && meta.name) || id)}`,
    };

    const range = parseRangeHeader(req.headers.get('Range'), total);
    if (range) {
        const slice = bytes.slice(range.start, range.end + 1);
        return new Response(slice, {
            status: 206,
            headers: {
                ...baseHeaders,
                'Content-Range': `bytes ${range.start}-${range.end}/${total}`,
                'Content-Length': String(slice.byteLength),
            },
        });
    }
    return new Response(bytes, {
        status: 200,
        headers: { ...baseHeaders, 'Content-Length': String(total) },
    });
}

async function handleDeleteFile(req, ns, payload, params) {
    const id = sanitizeString((params && params.id) || '', 140);
    if (!id) return fail('缺少文件 id', 400);
    const meta = await KV.getJson(ns, KEYS.FILE_META(id), null);
    if (!meta) return fail('文件不存在', 404);
    const isOwner = meta.uploader === payload.sub;
    if (!isOwner && !hasRole(payload, ROLES.ADMIN)) {
        return fail('只能删除自己上传的文件', 403);
    }
    await KV.del(ns, KEYS.FILE_BLOB(id));
    await KV.del(ns, KEYS.FILE_META(id));
    await writeAuditLog(ns, { action: 'delete_file', actor: payload.sub, target: id, detail: meta.name || '' });
    return ok({ id }, '文件已删除');
}

async function handlePassphraseCurrent(req, ns) {    const record = await getActivePassphrase(ns);
    return ok({ passphrase: passphrasePublicInfo(record) });
}

async function handlePassphraseGenerate(req, ns, payload, _params, env) {
    const deny = requireRole(payload, ROLES.SUPER_ADMIN);
    if (deny) return deny;
    let body = {};
    try {
        body = await req.json();
    } catch (err) {
        body = {};
    }
    const period = sanitizeString(body.period || '', 6) || currentPeriod();
    if (!/^\d{6}$/.test(period)) return fail('口令周期格式应为 YYYYMM', 400);
    const { record, plaintext, activated } = await createPassphrase(ns, { period, createdBy: payload.sub });
    await writeAuditLog(ns, {
        action: 'passphrase_generate',
        actor: payload.sub,
        target: period,
        detail: `生成 ${periodLabel(period)} 口令（仅哈希入库，${activated ? '已生效' : '未生效/历史周期'}）`,
    });
    return ok({
        passphrase: passphrasePublicInfo(record),
        plaintext,
        activated,
    }, activated
        ? '口令已生成并生效，请立即复制并发布到正式群（明文仅显示这一次）'
        : '口令已生成（该周期不是当月，不会顶替当前生效口令）');
}

async function handlePassphraseList(req, ns, payload) {
    const deny = requireRole(payload, ROLES.ADMIN);
    if (deny) return deny;
    const keys = await KV.listKeys(ns, 'mcdb:passphrase:', CONFIG.KV_LIST_LIMIT);
    const periods = keys
        .filter((k) => /^mcdb:passphrase:\d{6}$/.test(k))
        .map((k) => k.slice('mcdb:passphrase:'.length))
        .sort()
        .reverse()
        .slice(0, 12);
    const list = [];
    for (const p of periods) {
        const rec = await KV.getJson(ns, KEYS.PASSPHRASE(p), null);
        if (rec) list.push(passphrasePublicInfo(rec));
    }
    const active = passphrasePublicInfo(await getActivePassphrase(ns));
    return ok({ active, list });
}

async function writeAuditLog(ns, entry) {    try {
        const id = uuid();
        const ts = now();
        const log = {
            id,
            action: sanitizeString(entry.action || 'unknown', 50),
            actor: sanitizeString(entry.actor || 'system', 64),
            target: sanitizeString(entry.target || '', 64),
            detail: sanitizeString(entry.detail || '', 500),
            timestamp: ts,
        };
        await KV.putJson(ns, `mcdb:audit:${id}`, log);
    } catch (err) {

        console.warn('[writeAuditLog] 失败:', err);
    }
}

async function handleStats(req, ns, payload) {
    const denied = requireRole(payload, ROLES.ADMIN);
    if (denied) return denied;
    try {

        const [
            usersKeys,
            pendingUsersKeys,
            annFullKeys,
            annGroupKeys,
            surveyKeys,
            dispatchKeys,
            mediaKeys,
            projectionKeys,
            bugKeys,
            eventKeys,
            pwresetKeys,
            auditKeys,
        ] = await Promise.all([
            KV.listKeys(ns, 'mcdb:users:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:user:pending:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:ann:full:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:ann:group:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:survey:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:dispatch:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:media:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:projection:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:bug:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:event:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:pwreset:req:', CONFIG.KV_LIST_LIMIT),
            KV.listKeys(ns, 'mcdb:audit:', CONFIG.KV_LIST_LIMIT),
        ]);

        const users = await KV.listJson(ns, 'mcdb:users:', CONFIG.KV_LIST_LIMIT);
        const roleCounts = {
            guest: 0,
            player: 0,
            admin: 0,
            super_admin: 0,
        };
        const statusCounts = {
            active: 0,
            pending: 0,
            banned: 0,
        };
        for (const u of users) {
            const user = u.value;
            if (!user) continue;
            if (roleCounts[user.role] != null) roleCounts[user.role]++;
            if (statusCounts[user.status] != null) statusCounts[user.status]++;
        }
        return ok({
            totals: {
                users: usersKeys.length,
                pendingUsers: pendingUsersKeys.length,
                announcements: annFullKeys.length,
                groupAnnouncements: annGroupKeys.length,
                surveys: surveyKeys.length,
                dispatches: dispatchKeys.length,
                media: mediaKeys.length,
                projections: projectionKeys.length,
                bugs: bugKeys.length,
                events: eventKeys.length,
                passwordResetRequests: pwresetKeys.length,
                auditLogs: auditKeys.length,
            },
            roleCounts,
            statusCounts,
            timestamp: now(),
        });
    } catch (err) {
        console.error('[handleStats] 失败:', err);
        return fail('统计查询失败', 500);
    }
}

async function handleListAuditLogs(req, ns, payload) {
    const denied = requireRole(payload, ROLES.SUPER_ADMIN);
    if (denied) return denied;
    const url = new URL(req.url);
    const limitParam = parseInt(url.searchParams.get('limit') || '', 10);
    const limit = isNaN(limitParam) ? CONFIG.DEFAULT_PAGE_SIZE : Math.min(limitParam, CONFIG.DEFAULT_PAGE_SIZE);
    const entries = await KV.listJson(ns, 'mcdb:audit:', limit * 2);
    let list = entries.map(e => e.value).filter(Boolean);
    list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    list = list.slice(0, limit);
    return ok({ list });
}

function handleVersion(req) {
    return ok({
        service: 'mc-backend',
        version: '1.0.0',
        environment: CONFIG.ENVIRONMENT,
        buildTime: '2026-10-02',
        apiVersion: 'v1',
        endpoints: ROUTES.length,
    });
}

const ROUTES = [

    { method: 'POST',   pattern: '/api/auth/login',                       handler: handleLogin,                       publicApi: true },
    { method: 'POST',   pattern: '/api/auth/register',                    handler: handleRegister,                    publicApi: true },
    { method: 'POST',   pattern: '/api/auth/logout',                      handler: handleLogout,                      minRole: ROLES.GUEST },
    { method: 'GET',    pattern: '/api/auth/me',                          handler: handleMe,                          minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/qq/avatar',                        handler: handleQqAvatarInfo,                publicApi: true },
    { method: 'POST',   pattern: '/api/qq/avatar',                        handler: handleUpdateQqAvatar,              minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/server/info',                      handler: handleServerInfo,                  publicApi: true },
    { method: 'POST',   pattern: '/api/server/info',                      handler: handleUpdateServerInfo,            minRole: ROLES.SUPER_ADMIN },

    { method: 'POST',   pattern: '/api/upload',                           handler: handleUploadFile,                  minRole: ROLES.PLAYER },
    { method: 'GET',    pattern: '/api/files/:id',                        handler: handleGetFile,                     publicApi: true },
    { method: 'DELETE', pattern: '/api/files/:id',                        handler: handleDeleteFile,                  minRole: ROLES.PLAYER },

    { method: 'GET',    pattern: '/api/passphrase/current',               handler: handlePassphraseCurrent,           publicApi: true },    { method: 'GET',    pattern: '/api/passphrase/list',                  handler: handlePassphraseList,              minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/passphrase/generate',              handler: handlePassphraseGenerate,          minRole: ROLES.SUPER_ADMIN },

    { method: 'POST',   pattern: '/api/password-reset/request',           handler: handlePasswordResetRequest,        publicApi: true },
    { method: 'GET',    pattern: '/api/password-reset/requests',           handler: handlePasswordResetList,           minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/password-reset/approve',            handler: handlePasswordResetApprove,        minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/password-reset/execute',           handler: handlePasswordResetExecute,        publicApi: true },
    { method: 'POST',   pattern: '/api/password-reset/admin-set',          handler: handlePasswordResetAdminSet,       minRole: ROLES.ADMIN },

    { method: 'GET',    pattern: '/api/users',                           handler: handleListUsers,                   minRole: ROLES.ADMIN },
    { method: 'GET',    pattern: '/api/users/pending',                   handler: handleListPendingUsers,            minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/users/approve',                    handler: handleApproveUser,                 minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/users/reject',                     handler: handleRejectUser,                  minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/users/ban',                       handler: handleBanUser,                     minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/users/unban',                      handler: handleUnbanUser,                   minRole: ROLES.ADMIN },

    { method: 'POST',   pattern: '/api/staff/create',                     handler: handleCreateStaff,                 minRole: ROLES.SUPER_ADMIN },
    { method: 'POST',   pattern: '/api/staff/promote',                    handler: handlePromoteUser,                 minRole: ROLES.SUPER_ADMIN },
    { method: 'POST',   pattern: '/api/staff/demote',                     handler: handleDemoteUser,                  minRole: ROLES.SUPER_ADMIN },

    { method: 'GET',    pattern: '/api/announcements',                    handler: handleListAnnouncements,           publicApi: true },
    { method: 'POST',   pattern: '/api/announcements',                    handler: handleCreateAnnouncement,          minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/announcements/pin',               handler: handlePinAnnouncement,             minRole: ROLES.ADMIN },
    { method: 'DELETE', pattern: '/api/announcements/:id',                handler: handleDeleteAnnouncement,          minRole: ROLES.ADMIN },

    { method: 'GET',    pattern: '/api/group-announcements',              handler: handleListGroupAnnouncements,      publicApi: true },
    { method: 'GET',    pattern: '/api/group-announcements/pending',       handler: handleListGroupAnnouncementsPending, minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/group-announcements',              handler: handleCreateGroupAnnouncement,     minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/group-announcements/review',       handler: handleReviewGroupAnnouncement,     minRole: ROLES.ADMIN },

    { method: 'GET',    pattern: '/api/surveys',                          handler: handleListSurveys,                 publicApi: true },
    { method: 'GET',    pattern: '/api/surveys/pending',                  handler: handleListPendingSurveys,          minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/surveys',                          handler: handleCreateSurvey,                minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/surveys/review',                   handler: handleReviewSurvey,                minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/surveys/:id/complete',             handler: handleCompleteSurvey,               minRole: ROLES.PLAYER },
    { method: 'DELETE', pattern: '/api/surveys/:id',                      handler: handleDeleteSurvey,                minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/dispatches',                       handler: handleListDispatches,              publicApi: true },
    { method: 'POST',   pattern: '/api/dispatches',                       handler: handleCreateDispatch,              minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/dispatches/:id/accept',             handler: handleAcceptDispatch,              minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/dispatches/:id/complete',          handler: handleCompleteDispatch,            minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/dispatches/:id/cancel',            handler: handleCancelDispatch,              minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/dispatches/:id/contact-admin',    handler: handleDispatchContactAdmin,        minRole: ROLES.PLAYER },
    { method: 'DELETE', pattern: '/api/dispatches/:id',                   handler: handleDeleteDispatch,              minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/media',                             handler: handleListMedia,                    publicApi: true },
    { method: 'GET',    pattern: '/api/media/pending',                      handler: handleListPendingMedia,            minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/media',                             handler: handleCreateMedia,                 minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/media/review',                       handler: handleReviewMedia,                 minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/media/pin',                          handler: handlePinMedia,                    minRole: ROLES.ADMIN },
    { method: 'DELETE', pattern: '/api/media/:id',                          handler: handleDeleteMedia,                 minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/projections',                       handler: handleListProjections,             publicApi: true },
    { method: 'GET',    pattern: '/api/projections/pending',                handler: handleListPendingProjections,      minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/projections',                       handler: handleCreateProjection,            minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/projections/review',                 handler: handleReviewProjection,            minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/projections/pin',                    handler: handlePinProjection,               minRole: ROLES.ADMIN },
    { method: 'DELETE', pattern: '/api/projections/:id',                    handler: handleDeleteProjection,            minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/bugs',                               handler: handleListBugs,                    publicApi: true },
    { method: 'POST',   pattern: '/api/bugs',                               handler: handleCreateBug,                   publicApi: true },
    { method: 'POST',   pattern: '/api/bugs/:id/fix',                       handler: handleFixBug,                      minRole: ROLES.SUPER_ADMIN },
    { method: 'DELETE', pattern: '/api/bugs/:id',                           handler: handleDeleteBug,                   minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/events',                             handler: handleListEvents,                  publicApi: true },
    { method: 'GET',    pattern: '/api/events/pending',                      handler: handleListPendingEvents,           minRole: ROLES.ADMIN },
    { method: 'GET',    pattern: '/api/events/mine',                         handler: handleListMyEvents,                minRole: ROLES.GUEST },
    { method: 'POST',   pattern: '/api/events',                             handler: handleCreateEvent,                 minRole: ROLES.PLAYER },
    { method: 'POST',   pattern: '/api/events/review',                       handler: handleReviewEvent,                 minRole: ROLES.ADMIN },
    { method: 'POST',   pattern: '/api/events/:id/start',                    handler: handleStartEvent,                 minRole: ROLES.GUEST },
    { method: 'POST',   pattern: '/api/events/:id/end',                      handler: handleEndEvent,                    minRole: ROLES.GUEST },
    { method: 'POST',   pattern: '/api/events/:id/join',                     handler: handleJoinEvent,                   minRole: ROLES.GUEST },
    { method: 'POST',   pattern: '/api/events/:id/leave',                   handler: handleLeaveEvent,                  minRole: ROLES.GUEST },
    { method: 'DELETE', pattern: '/api/events/:id',                         handler: handleDeleteEvent,                 minRole: ROLES.GUEST },

    { method: 'GET',    pattern: '/api/stats',                              handler: handleStats,                       minRole: ROLES.ADMIN },
    { method: 'GET',    pattern: '/api/audit-logs',                          handler: handleListAuditLogs,              minRole: ROLES.SUPER_ADMIN },

    { method: 'GET',    pattern: '/api/health',                             handler: handleHealthCheck,                 publicApi: true },
    { method: 'GET',    pattern: '/api/version',                            handler: handleVersion,                     publicApi: true },
];

function matchPath(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
        const p = patternParts[i];
        const v = pathParts[i];
        if (p.startsWith(':')) {
            params[p.slice(1)] = decodeURIComponent(v);
        } else if (p !== v) {
            return null;
        }
    }
    return params;
}

function findRoute(method, path) {
    for (const route of ROUTES) {
        if (route.method !== method) continue;
        const params = matchPath(route.pattern, path);
        if (params) {
            return { route, params };
        }
    }
    return null;
}

async function handleRequest(request, env, ctx) {

    const corsRes = handleCorsPreflight(request);
    if (corsRes) return corsRes;

    let url;
    try {
        url = new URL(request.url);
    } catch (err) {
        return fail('URL 解析失败', 400);
    }
    const path = url.pathname;
    const method = request.method;

    const ns = env && env[CONFIG.KV_BINDING_NAME];
    if (!ns) {
        console.error('[handleRequest] KV 绑定未找到：', CONFIG.KV_BINDING_NAME);
        return fail('服务端配置错误：KV 未绑定', 500);
    }

    const match = findRoute(method, path);
    if (!match) {
        return fail(`接口不存在：${method} ${path}`, 404);
    }
    const { route, params } = match;

    let tokenSecretHex = '';
    if (env && typeof env.TOKEN_SECRET === 'string') {
        tokenSecretHex = env.TOKEN_SECRET;
    } else if (CONFIG.TOKEN_SECRET) {
        tokenSecretHex = CONFIG.TOKEN_SECRET;
    } else {

        console.error('[handleRequest] TOKEN_SECRET 未配置');
        return fail('服务端配置错误：TOKEN_SECRET 未设置', 500);
    }

    let payload = null;
    if (!route.publicApi) {
        payload = await extractAuth(request, tokenSecretHex);
        if (!payload) {
            return fail('请先登录', 401);
        }

        if (route.minRole && !hasRole(payload, route.minRole)) {
            return fail('权限不足', 403);
        }
    } else {

        payload = await extractAuth(request, tokenSecretHex);
    }

    try {
        return await route.handler(request, ns, payload, params, env, tokenSecretHex);
    } catch (err) {
        console.error(`[handleRequest] handler 异常: ${route.pattern}`, err);
        return fail(`服务器内部错误：${err.message || 'unknown'}`, 500);
    }
}

export default {

    async fetch(request, env, ctx) {

        const corsRes = handleCorsPreflight(request);
        if (corsRes) return corsRes;

        const ns = env && env[CONFIG.KV_BINDING_NAME];
        let url;
        try { url = new URL(request.url); } catch (err) { url = { pathname: '' }; }
        const isHealthCheck = url.pathname === '/api/health';
        if (ns) {
            if (isHealthCheck) {

                try { await bootstrapSystem(ns); } catch (err) { console.error('[fetch] bootstrap 异常:', err); }
            } else {
                ctx.waitUntil(bootstrapSystem(ns).catch(err => console.error('[fetch] bootstrap 异常:', err)));
            }
        }

        return handleRequest(request, env, ctx);
    },

    async scheduled(event, env, ctx) {
        const ns = env && env[CONFIG.KV_BINDING_NAME];
        if (!ns) return;

        console.log('[scheduled] 触发时间：', new Date(event.scheduledTime).toISOString());
    },
};

