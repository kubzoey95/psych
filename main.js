import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
const fs = new LightningFS('fs')

const dir = '/test-clone'
git.clone({ fs, http, dir, url: 'https://github.com/isomorphic-git/lightning-fs', corsProxy: 'https://cors.isomorphic-git.org' }).then(console.log)
