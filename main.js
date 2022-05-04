import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
const fs = new LightningFS('fs')

const dir = '/test-clone'
git.clone({ fs, http, dir, url: 'https://github.com/kubzoey95/psych'}).then(console.log)
