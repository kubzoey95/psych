import { Octokit, App } from "https://cdn.skypack.dev/octokit";

let key = CryptoJS.SHA3(prompt("Password please"), { outputLength: 512 });

console.log(key.toString())

let token = null

await jQuery.get('https://raw.githubusercontent.com/kubzoey95/psych/master/token', function(data) {
    token = data
});

let data_enc = null

await jQuery.get('https://raw.githubusercontent.com/kubzoey95/psych/master/data.json', function(data) {
    data_enc = data
});

console.log(CryptoJS.AES.decrypt(data_enc, key.toString()).toString(CryptoJS.enc.Utf8))

let decrypted = CryptoJS.AES.decrypt(token, key.toString());

decrypted = decrypted.toString(CryptoJS.enc.Utf8)

const octokit = new Octokit({
  auth: decrypted
})

let ref = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
  owner: 'kubzoey95',
  repo: 'psych',
  ref: 'heads/master'
})

console.log(ref)

let tree = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
  owner: 'kubzoey95',
  repo: 'psych',
  commit_sha: ref.data.object.sha
})

console.log(tree)

// let encrypted = CryptoJS.AES.encrypt("", key.toString(), {iv: CryptoJS.lib.WordArray.random(128 / 8)});
// console.log(encrypted.toString())

let new_tree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
  owner: 'kubzoey95',
  repo: 'psych',
  base_tree: tree.data.tree.sha,
  tree: [
    {
      path: 'data.json',
      mode: '100644',
      type: 'blob',
      content: CryptoJS.AES.encrypt(`{"date": "${new Date().toISOString()}"}`, key.toString(), {iv: CryptoJS.lib.WordArray.random(128 / 8)}).toString()
    }
  ]
})


let commit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
  owner: 'kubzoey95',
  repo: 'psych',
  message: 'my commit message',
  author: {
    name: 'Webpage',
    email: 'webpage@beifbgy.com',
    date: new Date().toISOString()
  },
  parents: [
    ref.data.object.sha
  ],
  tree: new_tree.data.sha,
})
let new_ref = await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
  owner: 'kubzoey95',
  repo: 'psych',
  ref: 'heads/master',
  sha: commit.data.sha,
  force: true
})

console.log(decrypted)
