import { routes } from './routes.mjs';
import { jsonld } from './jsonld.mjs';

// defaults
const repo = 'angeal185/github-forum-issues',
news_repo = 'angeal185/github-forum-news',
report_repo = 'angeal185/github-forum-report',
report_repo_issue = '1',
news_id = 142029577,
origin = 'https://angeal185.github.io/github-forum',
api = origin +'/api',
issues_feed = origin +'/atom/issues.atom',
news_feed = origin +'/atom/news.atom';

const xdata = Object.assign({
  default:{
    version: '1.0.0', // don't delete me
    title: 'github forum',
    logo: './app/img/logo.png',
    origin: origin,
    params: true,
    error: '/error',
    base_path: '/forum',
    delete_meta: false,
    webmanifest: './app/manifest.webmanifest',
    base_script_name: 'main',
    csp: "default-src 'self';img-src *;object-src 'none';frame-src 'none';block-all-mixed-content;upgrade-insecure-requests;connect-src https://api.github.com https://angeal185.github.io",
    meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },{
      name: 'msapplication-config',
      content: './app/browserconfig.xml'
    },{
      name: 'apple-mobile-web-app-title',
      content: 'github-forum'
    },{
      name: 'application-name',
      content: 'github-forum'
    }],
    styles:[{
      href: './app/css/bootstrap.min.css',
      rel: 'stylesheet'
    },{
      href: './app/css/main.min.css',
      rel: 'stylesheet'
    },{
      rel: 'alternate',
      type: 'application/atom+xml',
      title: "github-forum issues feed",
      href: issues_feed
    },{
      rel: 'alternate',
      type: 'application/atom+xml',
      title: "github-forum news feed",
      href: news_feed
    },{
      rel: 'apple-touch-icon',
      href: './app/img/ico/apple-touch-icon.png',
      sizes: '180x180'
    },{
      rel: 'mask-icon',
      href: './app/img/ico/safari-pinned-tab.svg',
      color: '#000000'
    }],
    js_head:[],
    js_body:[],
    jsonLD: jsonld,
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
      json: {
        method: 'GET',
        headers: {
          'Sec-Fetch-Dest': 'object',
          'Sec-Fetch-mode': 'cors',
          'Sec-Fetch-Site': 'cross-site'
        }
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
    api: api,
    search: 'https://api.github.com/search/',
    forum_id: 142029577,
    user_logo: './app/img/user.png',
    user_data: 'https://api.github.com/user',
    users_data: 'https://api.github.com/users/',
    code_base: 'https://github.com/angeal185/github-forum',
    new_token_base: 'https://github.com/settings/tokens/new',
    issues_feed: issues_feed,
    news_feed: news_feed,
    comment_per_page: 100,
    moderators: [{
      name: 'angeal185',
      img: 'https://avatars3.githubusercontent.com/u/18084234?v=4'
    },{
      name: 'cloudanon',
      img: 'https://avatars2.githubusercontent.com/u/68107105?v=4'
    }],
    forum: {
      latest_issues_max: 3,
      max_tags: 3,
      max_tag_length: 16,
      max_issue_length: 500,
      max_issue_title_length: 32,
      max_comment_length: 500,
      issues_per_page: 100, // don't change me yet
      base_url: 'https://api.github.com/'+ repo +'/repos/issues',
      categories: ['cat1', 'cat2', 'cat3'],
      tag_cloud: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      tag_cloud_len: 20,
      cat_search: 'https://api.github.com/search/issues?q=[cat:{{category}}]in:title+repo:'+ repo +'+type:issue+state:open&page={{page}}',
      search: 'https://api.github.com/search/issues?q={{search}}in:title+repo:'+ repo +'+type:issue+state:open&page={{page}}',
      cat_issue: 'https://api.github.com/repos/'+ repo +'/issues/{{issue}}/comments?page={{page}}',
      latest: 'https://api.github.com/repos/'+ repo +'/issues?sort=created&state=open&per_page=30',
      popular: 'https://api.github.com/repos/'+ repo +'/issues?sort=comments&state=open&per_page=30',
      create_issue: 'https://api.github.com/repos/'+ repo +'/issues',
      create_comment: 'https://api.github.com/repos/'+ repo +'/issues/{{issue}}/comments',
      create_report: 'https://api.github.com/repos/'+ report_repo +'/issues/'+ report_repo_issue +'/comments',
      user_issues: 'https://api.github.com/search/issues?q=[catin:title+repo:'+ repo +'+type:issue+state:open+{{type}}:{{user}}',
    },
    news: {
      base_url: 'https://api.github.com/'+ news_repo +'/repos/issues',
      news_issue: 'https://api.github.com/repos/'+ news_repo +'/issues/{{issue}}/comments',
      issues: 'https://api.github.com/search/issues?q=+repo:'+ news_repo +'+type:issue+state:open+label:news&page={{page}}'
    }
  }
}, routes)

export { xdata }
