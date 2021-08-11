let str = 13005992896
let of = str.replace(/(\d{3}).*(\d{4})/, '$1****$2')
console.log(of)