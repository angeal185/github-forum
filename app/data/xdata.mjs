const repo = 'angeal185/github-forum';

const xdata = {
  default:{
    version: '1.0.0', // don't delete me
    title: 'github forum',
    origin: 'http://localhost:8000',
    params: true,
    error: '/error',
    base_path: '/forum',
    delete_meta: false,
    webmanifest: './manifest.webmanifest',
    base_script_name: 'main',
    csp: "default-src 'self';img-src *;object-src 'none';frame-src 'none';block-all-mixed-content;upgrade-insecure-requests;connect-src https://api.github.com",
    meta: [],
    styles:[{
      href: './app/css/bootstrap.min.css',
      rel: 'stylesheet'
    },{
      href: './app/css/main.min.css',
      rel: 'stylesheet'
    },{
      rel: 'alternate',
      type: 'application/atom+xml',
      title: "github-forum feed",
      href: './atom/issues.atom'
    }],
    js_head:[],
    js_body:[],
    jsonLD: [{
      "@context":"http://schema.org",
      "@type":"Code",
      "name":"github-forum",
      "description":"",
      "image":"https://example.com/logo.png",
      "thumbnailUrl":"https://example.com/logo.png",
      "author":{
        "@type":"Person",
        "name":"Ben eaves"
      },
      "creator":{
        "@type":"Person",
        "name":"Ben eaves"
      },
      "creativeWorkStatus": "published",
      "url":"https://example.com",
      "encoding":{
        "encodingFormat":"application/javascript"
      },
      "keywords":"",
      "license":"MIT",
      "version":"v1.0.0"
    }],
    strip_unsafe: ['eval'],
    storage: {
      max_age: 9999999999,
      prefix: 'rt'
    },
    stream: {
      download: {
        type: 'text/plain',
        charset: 'utf-8'
      },
      fetch: {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.squirrel-girl-preview',
          'Content-Type': 'application/json',
          'Sec-Fetch-Dest': 'object',
          'Sec-Fetch-mode': 'cors',
          'Sec-Fetch-Site': 'cross-site'
        }
      },
      post: {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.v3+json ',
          'Content-Type': 'application/json',
          'Sec-Fetch-Dest': 'object',
          'Sec-Fetch-mode': 'cors',
          'Sec-Fetch-Site': 'cross-site'
        }
      },
      react: {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.squirrel-girl-preview',
          'Content-Type': 'application/json',
          'Sec-Fetch-Dest': 'object',
          'Sec-Fetch-mode': 'cors',
          'Sec-Fetch-Site': 'cross-site'
        }
      }
    },
    idb: {
      version: 1,
      title: "db",
      objects: ["cache"],
      cache_maxage: 1000 * 60 * 1
    }
  },
  app: {
    api: 'https://api.github.com/',
    search: 'https://api.github.com/search/',
    forum_id: 142029577,
    blog_id: 142029577,
    user_logo: './app/img/user.png',
    user_data: 'https://api.github.com/user',
    forum: {
      latest_issues_max: 5,
      max_tags: 3,
      max_tag_length: 16,
      max_issue_length: 500,
      max_issue_title_length: 32,
      max_comment_length: 500,
      issues_per_page: 100, // don't change me yet
      comment_per_page: 2,
      base_url: 'https://api.github.com/'+ repo +'/repos/issues',
      categories: ['cat1', 'cat2', 'cat3'],
      tag_cloud: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      tag_cloud_len: 12,
      cat_search: 'https://api.github.com/search/issues?q=[cat:{{category}}]in:title+repo:'+ repo +'+state:open+type:issue+state:open&page={{page}}',
      search: 'https://api.github.com/search/issues?q={{search}}in:title+repo:'+ repo +'+state:open+type:issue+state:open&page={{page}}',
      cat_issue: 'https://api.github.com/repos/'+ repo +'/issues/{{issue}}/comments?page={{page}}',
      latest: 'https://api.github.com/search/issues?q=[catin:title+repo:'+ repo +'+state:open+type:issue+state:open&per_page=5',
      create_issue: 'https://api.github.com/repos/'+ repo +'/issues',
      create_comment: 'https://api.github.com/repos/'+ repo +'/issues/{{issue}}/comments',
      user_issues: 'https://api.github.com/search/issues?q=[catin:title+repo:'+ repo +'+state:open+type:issue+state:open+{{type}}:{{user}}',
    },
    blog: {
      base_url: '',
      categories: [],
      cat_search: 'https://api.github.com/search/issues?q=repo:'+ repo +'+state:open+label:{{category}}+type:issue+state:open&page={{page}}',
      blog_issue: 'https://api.github.com/repos/'+ repo +'/issues/{{issue}}/comments'
    }
  },
  base: {
    nav: ['forum', 'blog', 'about', 'contact', 'terms']
  },
  profile: {
    items_a: {
      name: 'Name',
      email: 'Email',
      url: 'URL',
      created_at: 'Created',
      updated_at: 'Updated',
      disk_usage: 'Disk usage',
      hireable: 'Hireable'
    },
    items_b: {
      company: 'Company',
      total_private_repos: 'Private repos',
      public_repos: 'Public repos',
      private_gists: 'Private gists',
      public_gists: 'Public gists',
      followers: 'Followers',
      following: 'Following'
    }
  },
  login: {
    msg: 'portal page'
  },
  forum: {
    msg: 'forum page'
  },
  blog: {
    msg: 'blog page'
  },
  about: {
    msg: 'about page'
  },
  contact: {
    msg: 'contact page'
  },
  terms: {
    msg: 'terms page'
  }
}

export { xdata }
