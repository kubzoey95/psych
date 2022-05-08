let key = CryptoJS.SHA3(prompt("Password please"), { outputLength: 512 });

console.log(key.toString())
// let encrypted = CryptoJS.AES.encrypt("", key.toString(), {iv: CryptoJS.lib.WordArray.random(128 / 8)});
// console.log(encrypted.toString())
let token = null

await jQuery.get('https://raw.githubusercontent.com/kubzoey95/psych/master/token', function(data) {
    token = data
});

let decrypted = CryptoJS.AES.decrypt(token, key.toString());

console.log(decrypted.toString(CryptoJS.enc.Utf8))
