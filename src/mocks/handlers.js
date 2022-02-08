import { rest } from 'msw';
import { items } from '../items';
import { addOrder, getOrders } from './data';

const handlers = [
  rest.get('/api/items', (req, res, ctx) => res(ctx.json(items))),
  rest.get('/api/auth/current-user', (req, res, ctx) => (
    res(ctx.json({ access: 'associate', username: 'Tester' }))
  )),
  rest.get('/api/orders', (req, res, ctx) => res(ctx.json(getOrders()))),
  rest.post('/api/orders', (req, res, ctx) => {
    addOrder(req.body);
    return res(ctx.status(201));
  }),
];

export default handlers;
