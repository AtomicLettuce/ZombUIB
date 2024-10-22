var config = {
    port: 80,
    db: {
        host: ''
        , user: ''
        , password: ''
        , database: ''
    }
    , blockedPaths: ['/config.js', '/index.js', '/keys/cert.csr', '/keys/cert.pem', '/keys/key.pem']
}


if (process.env.NODE_ENV === "production") {
    config.db.host = '[HOST][HOST][HOST]',
        config.db.user = '[USER][USER][USER]',
        config.db.password = '[PASSWORD][PASSWORD][PASSWORD]',
        config.db.database = '[DATABASE][DATABASE][DATABASE]'
}else if (process.env.NODE_ENV==="fira"){
    config.db.host = '[HOST][HOST][HOST]',
        config.db.user = '[USER][USER][USER]',
        config.db.password = '[PASSWORD][PASSWORD][PASSWORD]',
        config.db.database = '[DATABASE][DATABASE][DATABASE]'
}
else {
    config.db.host = '[HOST][HOST][HOST]',
        config.db.user = '[USER][USER][USER]',
        config.db.password = '[PASSWORD][PASSWORD][PASSWORD]',
        config.db.database = '[DATABASE][DATABASE][DATABASE]'
}


module.exports = config;