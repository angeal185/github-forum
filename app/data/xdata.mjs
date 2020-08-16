import { routes } from './routes.mjs';
import { jsonld } from './jsonld.mjs';

// defaults
const repo = 'angeal185/github-forum-issues',
news_repo = 'angeal185/github-forum-news',
report_repo = 'angeal185/github-forum-report',
report_repo_issue = '1',
news_id = 142029577,
origin = 'https://angeal185.github.io/github-forum',
code_base = 'https://github.com/angeal185/github-forum',
github_api = 'https://api.github.com',
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
    csp: "default-src 'self';img-src *;object-src 'none';frame-src 'none';block-all-mixed-content;upgrade-insecure-requests;connect-src https://angeal185.github.io "+ github_api,
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
      cache_maxage: 60000
    }
  },
  app: {
    api: api,
    search: github_api +'/search/',
    forum_id: 142029577,
    user_logo: './app/img/user.png',
    user_data: github_api +'/user',
    users_data: github_api+ '/users/',
    code_base: code_base,
    new_token_base: github_api +'/settings/tokens/new',
    issues_feed: issues_feed,
    news_feed: news_feed,
    comment_per_page: 100,
    forum: {
      latest_issues_max: 3,
      max_tags: 3,
      max_tag_length: 16,
      max_issue_length: 500,
      max_issue_title_length: 32,
      max_comment_length: 500,
      issues_per_page: 100, // don't change me yet
      base_url: github_api +'/'+ repo +'/repos/issues',
      tag_cloud_len: 20,
      cat_search: github_api +'/search/issues?q=[cat:{{category}}]in:title+repo:'+ repo +'+type:issue+state:open&page={{page}}',
      search: github_api +'/search/issues?q={{search}}in:title+repo:'+ repo +'+type:issue+state:open&page={{page}}',
      cat_issue: github_api +'/repos/'+ repo +'/issues/{{issue}}/comments?page={{page}}',
      latest: github_api +'/repos/'+ repo +'/issues?sort=created&state=open&per_page=30',
      popular: github_api +'/repos/'+ repo +'/issues?sort=comments&state=open&per_page=30',
      create_issue: github_api +'/repos/'+ repo +'/issues',
      create_comment: github_api +'/repos/'+ repo +'/issues/{{issue}}/comments',
      create_report: github_api +'/repos/'+ report_repo +'/issues/'+ report_repo_issue +'/comments',
      user_issues: github_api +'/search/issues?q=[catin:title+repo:'+ repo +'+type:issue+state:open+{{type}}:{{user}}',
    },
    news: {
      base_url: github_api +'/'+ news_repo +'/repos/issues',
      news_issue: github_api +'/repos/'+ news_repo +'/issues/{{issue}}/comments',
      issues: github_api +'/search/issues?q=+repo:'+ news_repo +'+type:issue+state:open+label:news&page={{page}}'
    }
  }
}, routes)

export { xdata }
