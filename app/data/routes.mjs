const routes = {
  base: {
    nav: ['forum', 'news', 'about', 'contact', 'terms']
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
  news: {
    msg: 'news page'
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

export { routes }
