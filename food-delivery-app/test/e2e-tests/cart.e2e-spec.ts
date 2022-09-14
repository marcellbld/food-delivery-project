import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as LoginTokenSetups from '../helpers/get-login-token';
import { resetDb } from '../helpers/reset-database';
import { getApplication } from '../helpers/get-application';

describe('CartController (e2e)', () => {
  let app: INestApplication;

  const setupTokenForUser = () => LoginTokenSetups.setupTokenForUser(app);
  const setupTokenForUser2 = () => LoginTokenSetups.setupTokenForUser2(app);
  const setupTokenForOwner = () => LoginTokenSetups.setupTokenForOwner(app);
  const setupTokenForAdmin = () => LoginTokenSetups.setupTokenForAdmin(app);

  beforeAll(async () => {
    app = (await getApplication()).app;
  });

  beforeEach(async () => {
    await resetDb();
  });

  describe('findUnpurchasedByUser (GET /carts/unpurchased)', () => {
    const GET_UNPURCHASED_CART_URL = '/carts/unpurchased';

    it('should return self unpurchased cart as User - return 200', async () => {
      const token = await setupTokenForUser();

      return request(app.getHttpServer())
        .get(GET_UNPURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const cart = res.body;
          expect(cart).toEqual({
            id: 1,
            purchased: false,
            purchasedDate: null,
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              image: null,
              categories: [],
            },
            cartItems: [
              {
                id: 1,
                count: 1,
                item: {
                  id: 1,
                  description: 'Test Item Description',
                  name: 'Test Item 1',
                  image: null,
                  price: 1.05,
                  restaurant: expect.anything(),
                },
                price: 1.05,
              },
              {
                id: 2,
                count: 2,
                item: {
                  id: 2,
                  description: 'Test Item Description',
                  name: 'Test Item 2',
                  image: null,
                  price: 2.05,
                  restaurant: expect.anything(),
                },
                price: 4.1,
              },
            ],
            user: {
              id: 2,
              role: 'USER',
              username: 'tuser1',
              createdAt: expect.anything(),
            },
          });
        });
    });
    it('should return empty object as User without cart - return 200', async () => {
      const token = await setupTokenForUser2();

      return request(app.getHttpServer())
        .get(GET_UNPURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const cart = res.body;

          expect(cart).toEqual({});
        });
    });
    it('should not return cart as Owner - return 403', async () => {
      const token = await setupTokenForOwner();

      return request(app.getHttpServer())
        .get(GET_UNPURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });
  describe('findAllPurchasedByUser (GET /carts/purchased)', () => {
    const GET_PURCHASED_CARTS_URL = '/carts/purchased';

    it('should return self purchased carts as User - return 200', async () => {
      const token = await setupTokenForUser();

      return request(app.getHttpServer())
        .get(GET_PURCHASED_CARTS_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const carts = res.body;

          expect(carts).toContainEqual({
            id: 2,
            purchased: true,
            purchasedDate: expect.anything(),
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              image: null,
              categories: [],
            },
            user: {
              id: 2,
              username: 'tuser1',
              role: 'USER',
              createdAt: expect.anything(),
            },
            cartItems: [
              {
                id: 3,
                count: 2,
                item: {
                  id: 1,
                  name: 'Test Item 1',
                  description: 'Test Item Description',
                  image: null,
                  price: 1.05,
                  restaurant: expect.anything(),
                },
                price: 2.1,
              },
            ],
          });
          expect(carts).toContainEqual({
            id: 3,
            purchased: true,
            purchasedDate: expect.anything(),
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              image: null,
              categories: [],
            },
            user: {
              id: 2,
              username: 'tuser1',
              role: 'USER',
              createdAt: expect.anything(),
            },
            cartItems: [
              {
                id: 4,
                count: 3,
                item: {
                  id: 1,
                  name: 'Test Item 1',
                  description: 'Test Item Description',
                  image: null,
                  price: 1.05,
                  restaurant: expect.anything(),
                },
                price: 3.15,
              },
            ],
          });
        });
    });
    it('should return empty array as User without purchased carts - return 200', async () => {
      const token = await setupTokenForUser2();

      return request(app.getHttpServer())
        .get(GET_PURCHASED_CARTS_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const cart = res.body;

          expect(cart).toEqual([]);
        });
    });
    it('should not return cart as Owner - return 403', async () => {
      const token = await setupTokenForOwner();

      return request(app.getHttpServer())
        .get(GET_PURCHASED_CARTS_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
  });
  describe('findOne (GET /carts/:id)', () => {
    const GET_CART_URL = '/carts/1';
    const GET_CART_WRONG_URL = '/carts/99';
    it('should return cart as User - return 200', async () => {
      const token = await setupTokenForUser();

      return request(app.getHttpServer())
        .get(GET_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const cart = res.body;
          expect(cart).toEqual({
            id: 1,
            purchased: false,
            purchasedDate: null,
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              image: null,
              categories: [],
            },
            cartItems: [
              {
                id: 1,
                count: 1,
                item: {
                  id: 1,
                  description: 'Test Item Description',
                  name: 'Test Item 1',
                  image: null,
                  price: 1.05,
                  restaurant: expect.anything(),
                },
                price: 1.05,
              },
              {
                id: 2,
                count: 2,
                item: {
                  id: 2,
                  description: 'Test Item Description',
                  name: 'Test Item 2',
                  image: null,
                  price: 2.05,
                  restaurant: expect.anything(),
                },
                price: 4.1,
              },
            ],
            user: {
              id: 2,
              role: 'USER',
              username: 'tuser1',
              createdAt: expect.anything(),
            },
          });
        });
    });
    it('should return cart as Admin - return 200', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .get(GET_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const cart = res.body;
          expect(cart).toEqual({
            id: 1,
            purchased: false,
            purchasedDate: null,
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              image: null,
              categories: [],
            },
            cartItems: [
              {
                id: 1,
                count: 1,
                item: {
                  id: 1,
                  description: 'Test Item Description',
                  name: 'Test Item 1',
                  image: null,
                  price: 1.05,
                  restaurant: expect.anything(),
                },
                price: 1.05,
              },
              {
                id: 2,
                count: 2,
                item: {
                  id: 2,
                  description: 'Test Item Description',
                  name: 'Test Item 2',
                  image: null,
                  price: 2.05,
                  restaurant: expect.anything(),
                },
                price: 4.1,
              },
            ],
            user: {
              id: 2,
              role: 'USER',
              username: 'tuser1',
              createdAt: expect.anything(),
            },
          });
        });
    });
    it('should not return cart as not owner User of cart - return 403', async () => {
      const token = await setupTokenForUser2();

      return request(app.getHttpServer())
        .get(GET_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not return cart as Owner - return 403', async () => {
      const token = await setupTokenForOwner();

      return request(app.getHttpServer())
        .get(GET_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not return cart without token - return 401', async () => {
      return request(app.getHttpServer()).get(GET_CART_URL).expect(401);
    });
    it('should not return cart with incorrect id - return 404', async () => {
      const token = await setupTokenForAdmin();

      return request(app.getHttpServer())
        .get(GET_CART_WRONG_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });
  });
  describe('setPurchased, (PATCH /carts/:id)', () => {
    const PATCH_SET_PURCHASED_CART_URL = '/carts/1';
    const PATCH_SET_PURCHASED_CART_PURCHASED_URL = '/carts/2';
    const PATCH_SET_PURCHASED_CART_WRONG_URL = '/carts/99';
    it('should not set to be purchased as NOT owner User of cart - return 403', async () => {
      const token = await setupTokenForUser2();
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not set to be purchased as Owner - return 403', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not set to be purchased as Admin - return 403', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not set to be purchased without token - return 401', async () => {
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_URL)
        .expect(401);
    });
    it('should set to be purchased and return cartDto as User - return 200', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const cart = res.body;
          expect(cart).toEqual({
            id: 1,
            purchased: true,
            purchasedDate: expect.anything(),
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              image: null,
              categories: [],
            },
            cartItems: [
              {
                id: 1,
                count: 1,
                item: {
                  id: 1,
                  description: 'Test Item Description',
                  name: 'Test Item 1',
                  image: null,
                  price: 1.05,
                  restaurant: expect.anything(),
                },
                price: 1.05,
              },
              {
                id: 2,
                count: 2,
                item: {
                  id: 2,
                  description: 'Test Item Description',
                  name: 'Test Item 2',
                  image: null,
                  price: 2.05,
                  restaurant: expect.anything(),
                },
                price: 4.1,
              },
            ],
            user: {
              id: 2,
              role: 'USER',
              username: 'tuser1',
              createdAt: expect.anything(),
            },
          });
        });
    });
    it('should not set to be purchased a purchased cart - return 400', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_PURCHASED_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(400);
    });
    it('should not set to be purchased a cart with invalid id - return 400', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(PATCH_SET_PURCHASED_CART_WRONG_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });
  });
  describe('delete (DELETE /carts/:id)', () => {
    const DELETE_CART_URL = '/carts/1';
    const DELETE_CART_WRONG_URL = '/carts/99';
    const DELETE_PURCHASED_CART_URL = '/carts/2';
    it('should not delete cart as NOT owner User of cart - return 403', async () => {
      const token = await setupTokenForUser2();
      return request(app.getHttpServer())
        .delete(DELETE_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not delete cart as Owner - return 403', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .delete(DELETE_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should delete cart as Admin - return 200', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .delete(DELETE_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200);
    });
    it('should not delete cart without token - return 401', async () => {
      return request(app.getHttpServer()).delete(DELETE_CART_URL).expect(401);
    });
    it('should delete cart and return true as owner User of cart - return 200', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .delete(DELETE_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const result = response.body;
          expect(result).toBeTruthy();
        });
    });
    it('should not delete a purchased cart- return 400', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .delete(DELETE_PURCHASED_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(400);
    });
    it('should not delete a cart with invalid id - return 404', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .delete(DELETE_CART_WRONG_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(404);
    });
  });
  describe('createItem (POST /carts/items)', () => {
    const CREATE_ITEM_URL = '/carts/items';

    it('should not create item as Admin - return 403', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ restaurantItemId: 1 })
        .expect(403);
    });
    it('should not create item as Owner - return 403', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ restaurantItemId: 1 })
        .expect(403);
    });
    it('should not create item without token - return 401', async () => {
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .send({ restaurantItemId: 1 })
        .expect(401);
    });
    it('should create item as User - return 201', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ restaurantItemId: 1 })
        .expect(201)
        .then((response) => {
          const item = response.body;
          expect(item).toEqual({
            id: 1,
            count: 2,
            item: {
              id: 1,
              name: 'Test Item 1',
              description: 'Test Item Description',
              restaurant: expect.anything(),
              price: 1.05,
              image: null,
            },
            price: 2.1,
          });
        });
    });
    it("should create item as User when cart still doesn't exists - return 201", async () => {
      const token = await setupTokenForUser2();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ restaurantItemId: 1 })
        .expect(201)
        .then((response) => {
          const item = response.body;
          expect(item).toEqual({
            id: expect.anything(),
            count: 1,
            item: {
              id: 1,
              name: 'Test Item 1',
              description: 'Test Item Description',
              restaurant: expect.anything(),
              price: 1.05,
              image: null,
            },
            price: 1.05,
          });
        });
    });
    it("should not create item with restaurantItem that's belongs to other restaurant than the cart - return 400", async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ restaurantItemId: 4 })
        .expect(400);
    });
    it('should not create item without restaurantItemId - return 404', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({})
        .expect(404);
    });
    it('should not create item with invalid restaurantItemId - return 404', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .post(CREATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ restaurantItemId: 99 })
        .expect(404);
    });
  });
  describe('updateItem (PATCH /carts/items/:id)', () => {
    const UPDATE_ITEM_URL = '/carts/items/1';

    it('should not update item as Admin - return 403', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ count: 9 })
        .expect(403);
    });
    it('should not update item as Owner - return 403', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ count: 9 })
        .expect(403);
    });
    it('should not update item without token - return 401', async () => {
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .send({ count: 9 })
        .expect(401);
    });
    it('should update item as User - return 200', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ count: 9 })
        .expect(200)
        .then((response) => {
          const item = response.body;
          expect(item).toEqual({
            id: 1,
            count: 9,
            item: {
              id: 1,
              name: 'Test Item 1',
              description: 'Test Item Description',
              restaurant: expect.anything(),
              price: 1.05,
              image: null,
            },
            price: 9.45,
          });
        });
    });
    it('should not update item if it is not in the cart already - return 403', async () => {
      const token = await setupTokenForUser2();
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ count: 10 })
        .expect(400);
    });
    it('should not update item with 0 count - return 400', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ count: 0 })
        .expect(400);
    });
    it('should not update item with negative count - return 400', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(UPDATE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({ count: -1 })
        .expect(400);
    });
  });
  describe('deleteItem (DELETE /carts/items/:id)', () => {
    const DELETE_ITEM_URL = '/carts/items/1';
    const DELETE_ITEM_NOT_IN_CART_URL = '/carts/items/5';
    it('should not delete item as Admin - return 403', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not update item as Owner - return 403', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not update item without token - return 401', async () => {
      return request(app.getHttpServer()).delete(DELETE_ITEM_URL).expect(401);
    });
    it('should delete item and return true as User - return 200', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const result = response.body;
          expect(result).toBeTruthy();
        });
    });
    it('should not delete item if it is not in the cart already - return 403', async () => {
      const token = await setupTokenForUser2();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_NOT_IN_CART_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(400);
    });
  });
});
