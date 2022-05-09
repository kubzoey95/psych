import { Octokit, App } from "https://cdn.skypack.dev/octokit";

let key = CryptoJS.SHA3(prompt("Password please"), { outputLength: 512 });

console.log(key.toString())
// let encrypted = CryptoJS.AES.encrypt("", key.toString(), {iv: CryptoJS.lib.WordArray.random(128 / 8)});
// console.log(encrypted.toString())
let token = null

await jQuery.get('https://raw.githubusercontent.com/kubzoey95/psych/master/token', function(data) {
    token = data
});

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

let new_tree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
  owner: 'kubzoey95',
  repo: 'psych',
  base_tree: tree.data.tree.sha,
  tree: [
    {
      path: 'data.json',
      mode: '100644',
      type: 'blob',
      content: '{"a": "b"}'
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
    date: '2008-07-09T16:13:30+12:00'
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
//   force: true
})

console.log(decrypted)
