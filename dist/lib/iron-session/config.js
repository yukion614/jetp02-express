// iron-session config，目前只有使用password，其他都使用預設值
export const config = {
    // 產生: https://1password.com/password-generator/
    password: 'XKBsTNhGKjasnas7n79wqrikY3K5m0QmncDvMFFzaWPyH1E8hNqfNURLRgAF2QtvZdTgkwA5UTdwTZE33B', // 32 characters
    ttl: 60 * 60 * 24 * 7, // 7 days
    cookieOptions: {
        secure: false, // false in local (non-HTTPS) development
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 - 60, // Expire cookie before the session expires.
        path: '/',
    },
};
//# sourceMappingURL=config.js.map