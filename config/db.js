const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password:process.env.PASSWORD,
    port: 5432,
    sslmode: 'require',
    ssl: true
})

//Melakukan koneksi dan menunjukkan indikasi database terhubung
pool.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('Database berhasil terkoneksi')
})

module.exports = pool;