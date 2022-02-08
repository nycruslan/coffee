const { Router } = require('express');

const itemRoutes = Router();

itemRoutes.get('/', (req, res) => {
  setTimeout(
    () => res.json([
      {
        id: 'apple',
        imageId: 'apple',
        title: 'Red Apple',
        price: 0.98,
      },
      {
        id: 'coffee',
        imageId: 'coffee',
        title: 'Coffee',
        price: 2,
      },
      {
        id: 'cookie',
        imageId: 'cookie',
        title: 'Cookie',
        price: 1,
      },
      {
        id: 'hamburger',
        imageId: 'hamburger',
        title: 'Hamburger',
        price: 2.50,
      },
      {
        id: 'ice-cream',
        imageId: 'ice-cream',
        title: 'Ice Cream',
        price: 0.99,
      },
      {
        id: 'pizza',
        imageId: 'pizza',
        title: 'Pizza',
        price: 1,
      },
      {
        id: 'stroopwafel',
        imageId: 'stroopwafel',
        title: 'Stroopwafel',
        price: 0.50,
      },
      {
        id: 'tea',
        imageId: 'tea',
        title: 'Tea',
        price: 1,
      },
      {
        id: 'toast',
        imageId: 'toast',
        title: 'Toast',
        price: 1,
      },
      {
        id: 'wine',
        imageId: 'wine',
        title: 'Wine',
        price: 10,
      },
    ]),
    // Adds a fake server side delay
    500,
  );
});

module.exports = itemRoutes;
