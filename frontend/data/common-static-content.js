export const layoutContent = {
  navbarContent: {
    navItems: [
      {
        name: 'About me',
        path: '/about-me',
        subnavs: [],
      },
      {
        name: 'Dropdown',
        path: '#',
        subnavs: [
          {
            name: 'Dropdown Item 1',
            path: '/dropdown/item-1',
          },
          {
            name: 'Dropdown Item 2',
            path: '/dropdown/item-2',
          },
          {
            name: 'Dropdown Item 3',
            path: '/dropdown/item-3',
          },
        ],
      },
      {
        name: 'Contact',
        path: '#',
        subnavs: [],
      },
    ],
  },

  footerContent: {
    siteLinks: [
      {
        name: 'Home',
        path: '/',
      },
      {
        name: 'About me',
        path: '/about-me',
      },
    ],

    socialLinks: {
      fb: 'https://www.facebook.com/nahid.iftekhar',
      yt: 'https://www.youtube.com/channel/UC-UzjvhN05zfBcZeDlJKTpA',
      tw: '',
    },
  },

  metaContent: {
    title: 'Resort Marshal',
    keywords: 'some, keywords, that, seem, important, for, search',
    desctiprion: 'Resort management system',
  },
};
