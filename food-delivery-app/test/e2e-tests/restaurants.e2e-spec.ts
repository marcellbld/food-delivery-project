import { INestApplication } from '@nestjs/common';
import * as LoginTokenSetups from '../helpers/get-login-token';
import { resetDb } from '../helpers/reset-database';
import * as request from 'supertest';
import { getApplication } from '../helpers/get-application';

describe('RestaurantsController (e2e)', () => {
  let app: INestApplication;

  const setupTokenForUser = () => LoginTokenSetups.setupTokenForUser(app);
  const setupTokenForOwner = () => LoginTokenSetups.setupTokenForOwner(app);
  const setupTokenForOwner2 = () => LoginTokenSetups.setupTokenForOwner2(app);
  const setupTokenForAdmin = () => LoginTokenSetups.setupTokenForAdmin(app);

  beforeAll(async () => {
    app = (await getApplication()).app;
  });

  beforeEach(async () => {
    await resetDb();
  });

  describe('findAll (GET /restaurants?skip=x)', () => {
    const GET_RESTAURANTS_URL = '/restaurants?skip=0';
    const GET_RESTAURANTS_SKIP_1_URL = '/restaurants?skip=1';
    const GET_RESTAURANTS_SKIP_100_URL = '/restaurants?skip=100';
    const GET_RESTAURANTS_NO_QUERY_URL = '/restaurants';

    it('should find restaurants when skip is 0 - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_RESTAURANTS_URL)
        .expect(200)
        .then((res: request.Response) => {
          const restaurants = res.body;
          expect(restaurants.length).toBe(3);
          expect(restaurants[0]).toEqual({
            id: 1,
            name: 'Test Restaurant',
            description: 'Test Restaurant Description',
            createdAt: expect.anything(),
            categories: [
              { id: 2, name: 'Primary 2', primary: true },
              { id: 3, name: 'Secondary 1', primary: false },
            ],
            image: null,
            location: [1, 1],
          });
          for (let i = 1; i < 3; i++) {
            expect(restaurants[i]).toEqual({
              id: i + 1,
              name: `Test Restaurant ${i + 1}`,
              description: `Test Restaurant Description ${i + 1}`,
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            });
          }
        });
    });
    it('should find restaurants when no query added - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_RESTAURANTS_NO_QUERY_URL)
        .expect(200)
        .then((res: request.Response) => {
          const restaurants = res.body;
          expect(restaurants.length).toBe(3);
          expect(restaurants[0]).toEqual({
            id: 1,
            name: 'Test Restaurant',
            description: 'Test Restaurant Description',
            createdAt: expect.anything(),
            categories: [
              { id: 2, name: 'Primary 2', primary: true },
              { id: 3, name: 'Secondary 1', primary: false },
            ],
            image: null,
            location: [1, 1],
          });
          for (let i = 1; i < 3; i++) {
            expect(restaurants[i]).toEqual({
              id: i + 1,
              name: `Test Restaurant ${i + 1}`,
              description: `Test Restaurant Description ${i + 1}`,
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            });
          }
        });
    });
    it('should find restaurants when skip is 1 - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_RESTAURANTS_SKIP_1_URL)
        .expect(200)
        .then((res: request.Response) => {
          const restaurants = res.body;
          expect(restaurants.length).toBe(2);

          for (let i = 0; i < 2; i++) {
            expect(restaurants[i]).toEqual({
              id: i + 2,
              name: `Test Restaurant ${i + 2}`,
              description: `Test Restaurant Description ${i + 2}`,
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            });
          }
        });
    });
    it('should find empty array when skip is 100 - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_RESTAURANTS_SKIP_100_URL)
        .expect(200)
        .then((res: request.Response) => {
          const restaurants = res.body;
          expect(restaurants.length).toBe(0);
        });
    });
  });
  describe('findSelfRestaurants (GET /restaurants/self)', () => {
    const GET_SELF_RESTAURANTS = '/restaurants/self';
    it('should find restaurants as Owner - return 200', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .get(GET_SELF_RESTAURANTS)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const restaurants = res.body;
          expect(restaurants.length).toBe(3);
          expect(restaurants[0]).toEqual({
            id: 1,
            name: 'Test Restaurant',
            description: 'Test Restaurant Description',
            createdAt: expect.anything(),
            categories: [
              { id: 2, name: 'Primary 2', primary: true },
              { id: 3, name: 'Secondary 1', primary: false },
            ],
            image: null,
            location: [1, 1],
          });
          for (let i = 1; i < 3; i++) {
            expect(restaurants[i]).toEqual({
              id: i + 1,
              name: `Test Restaurant ${i + 1}`,
              description: `Test Restaurant Description ${i + 1}`,
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            });
          }
        });
    });
    it('should find empty array as Owner when still no restaurant added - return 200', async () => {
      const token = await setupTokenForOwner2();
      return request(app.getHttpServer())
        .get(GET_SELF_RESTAURANTS)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res: request.Response) => {
          const restaurants = res.body;
          expect(restaurants.length).toBe(0);
        });
    });
    it('should not find restaurants as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .get(GET_SELF_RESTAURANTS)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not find restaurants as Admin - return 403', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .get(GET_SELF_RESTAURANTS)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not find restaurants without token - return 401', async () => {
      return request(app.getHttpServer()).get(GET_SELF_RESTAURANTS).expect(401);
    });
  });
  describe('findOne (GET /restaurants/:id)', () => {
    const GET_RESTAURANT_URL = '/restaurants/1';
    const GET_RESTAURANT_WRONG_URL = '/restaurants/99';
    it('should find restaurant with correct id - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_RESTAURANT_URL)
        .expect(200)
        .then((res: request.Response) => {
          const restaurant = res.body;
          expect(restaurant).toEqual({
            id: 1,
            name: 'Test Restaurant',
            description: 'Test Restaurant Description',
            createdAt: expect.anything(),
            categories: [
              { id: 2, name: 'Primary 2', primary: true },
              { id: 3, name: 'Secondary 1', primary: false },
            ],
            image: null,
            location: [1, 1],
          });
        });
    });
    it('should not find restaurant with incorrect id - return 404', async () => {
      return request(app.getHttpServer())
        .get(GET_RESTAURANT_WRONG_URL)
        .expect(404);
    });
  });
  describe('create (POST /restaurants)', () => {
    const CREATE_RESTAURANT_URL = '/restaurants';
    it('should create restaurant as Owner - return 201', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Restaurant',
          description: 'New Restaurant Description',
          categories: '[1,3]',
          location: '[1,1]',
        })
        .expect(201)
        .then((res: request.Response) => {
          const restaurant = res.body;
          expect(restaurant).toEqual({
            id: expect.any(Number),
            name: 'New Restaurant',
            description: 'New Restaurant Description',
            createdAt: expect.anything(),
            categories: [
              { id: 1, name: 'Primary 1', primary: true },
              { id: 3, name: 'Secondary 1', primary: false },
            ],
            image: null,
            location: [1, 1],
          });
        });
    });
    it('should create restaurant as Admin (with an owner id) - return 201', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Restaurant 2',
          owner: 4,
          description: 'New Restaurant Description 2',
          categories: '[1,3]',
          location: '[1,1]',
        })
        .expect(201)
        .then((res: request.Response) => {
          const restaurant = res.body;
          expect(restaurant).toEqual({
            id: expect.any(Number),
            name: 'New Restaurant 2',
            description: 'New Restaurant Description 2',
            createdAt: expect.anything(),
            categories: [
              { id: 1, name: 'Primary 1', primary: true },
              { id: 3, name: 'Secondary 1', primary: false },
            ],
            image: null,
            location: [1, 1],
          });
        });
    });
    it('should not create restaurant as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Restaurant 3',
          description: 'New Restaurant Description 3',
          categories: '[1,3]',
          location: '[1,1]',
        })
        .expect(403);
    });
    it('should not create restaurant without token - return 401', async () => {
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_URL)
        .send({
          name: 'New Restaurant 3',
          description: 'New Restaurant Description 3',
          categories: '[1,3]',
          location: '[1,1]',
        })
        .expect(401);
    });
    it('should not create restaurant with an existing name as Owner - return 400', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'Test Restaurant',
          description: 'New Restaurant Description',
          categories: '[1,3]',
          location: '[1,1]',
        })
        .expect(400);
    });
    it('should not create restaurant without name - return 400', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'New Restaurant Description 3',
          categories: '[1,3]',
          location: '[1,1]',
        })
        .expect(400);
    });
  });
  describe('update (PATCH /restaurants/:id)', () => {
    const UPDATE_RESTAURANT_URL = '/restaurants/1';
    const UPDATE_RESTAURANT_2_URL = '/restaurants/2';
    const UPDATE_RESTAURANT_WRONG_URL = '/restaurants/99';
    it('should update restaurant as Owner of the restaurant - return 200', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'Updated Description',
          categories: '[4]',
          location: '[1,1]',
        })
        .expect(200)
        .then((res) => {
          const restaurant = res.body;
          expect(restaurant).toEqual({
            id: 1,
            name: 'Test Restaurant',
            description: 'Updated Description',
            createdAt: expect.anything(),
            categories: [{ id: 4, name: 'Secondary 2', primary: false }],
            image: null,
            location: [1, 1],
          });
        });
    });
    it('should update restaurant as Admin - return 200', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_2_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'Updated Description',
          categories: '[1]',
          location: '[1,1]',
        })
        .expect(200)
        .then((res) => {
          const restaurant = res.body;
          expect(restaurant).toEqual({
            id: 2,
            name: 'Test Restaurant 2',
            description: 'Updated Description',
            createdAt: expect.anything(),
            categories: [{ id: 1, name: 'Primary 1', primary: true }],
            image: null,
            location: [1, 1],
          });
        });
    });
    it('should not update restaurant with incorrect id as Admin - return 400', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_WRONG_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'Updated Description',
          categories: '[1]',
          location: '[1,1]',
        })
        .expect(400);
    });
    it('should not update restaurant as not Owner of the restaurant - return 403', async () => {
      const token = await setupTokenForOwner2();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'Updated Description',
          categories: '[4]',
          location: '[1,1]',
        })
        .expect(403);
    });
    it('should not update any restaurant as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'Updated Description',
          categories: '[4]',
          location: '[1,1]',
        })
        .expect(403);
    });
    it('should not update any restaurant without token - return 401', async () => {
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_URL)
        .send({
          description: 'Updated Description',
          categories: '[4]',
          location: '[1,1]',
        })
        .expect(401);
    });
  });
  describe('delete (DELETE /restaurants/:id)', () => {
    const DELETE_RESTAURANT_URL = '/restaurants/1';
    const DELETE_RESTAURANT_2_URL = '/restaurants/2';
    const DELETE_RESTAURANT_3_URL = '/restaurants/3';
    const DELETE_RESTAURANT_WRONG_URL = '/restaurants/99';
    it('should delete restaurant as Owner of the restaurant - return 200', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .delete(DELETE_RESTAURANT_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res) => {
          const result = res.body;
          expect(result).toBeTruthy();
        });
    });
    it('should delete restaurant as Admin - return 200', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .delete(DELETE_RESTAURANT_2_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((res) => {
          const result = res.body;
          expect(result).toBeTruthy();
        });
    });
    it('should not delete restaurant with incorrect id as Admin - return 400', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .delete(DELETE_RESTAURANT_WRONG_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(400);
    });
    it('should not delete restaurant as not Owner of the restaurant - return 403', async () => {
      const token = await setupTokenForOwner2();
      return request(app.getHttpServer())
        .delete(DELETE_RESTAURANT_3_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not delete any restaurant as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .delete(DELETE_RESTAURANT_3_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not delete any restaurant without token - return 401', async () => {
      return request(app.getHttpServer())
        .delete(DELETE_RESTAURANT_3_URL)
        .expect(401);
    });
  });
  describe('findAllItemsByRestaurant (GET /restaurants/:id/items', () => {
    const GET_ITEMS_URL = '/restaurants/1/items';
    const GET_ITEMS_WRONG_URL = '/restaurants/99/items';
    it('should return all items - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_ITEMS_URL)
        .expect(200)
        .then((response) => {
          const items = response.body;

          expect(items.length).toBe(3);
          for (let i = 0; i < items.length; i++) {
            expect(items[i]).toEqual({
              id: i + 1,
              name: `Test Item ${i + 1}`,
              description: 'Test Item Description',
              price: i + 1 + 0.05,
              restaurant: { id: 1, categories: [], location: [null, null] },
              image: null,
            });
          }
        });
    });
    it('should return empty array with incorrect restaurant id - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_ITEMS_WRONG_URL)
        .expect(200)
        .then((response) => {
          const items = response.body;

          expect(items.length).toBe(0);
        });
    });
  });
  describe('findPopularItemsByRestaurant (GET /restaurants/:id/items/popular', () => {
    const GET_ITEMS_URL = '/restaurants/1/items/popular';
    const GET_ITEMS_WRONG_URL = '/restaurants/99/items/popular';
    it('should return all items - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_ITEMS_URL)
        .expect(200)
        .then((response) => {
          const items = response.body;

          expect(items.length).toBe(3);
          for (let i = 0; i < items.length; i++) {
            expect(items[i]).toEqual({
              id: i + 1,
              name: `Test Item ${i + 1}`,
              description: 'Test Item Description',
              price: i + 1 + 0.05,
              restaurant: { id: 1, categories: [], location: [null, null] },
              image: null,
            });
          }
        });
    });
    it('should return empty array with incorrect restaurant id - return 200', async () => {
      return request(app.getHttpServer())
        .get(GET_ITEMS_WRONG_URL)
        .expect(200)
        .then((response) => {
          const items = response.body;

          expect(items.length).toBe(0);
        });
    });
  });
  describe('createItem (POST /restaurants/:id/items)', () => {
    const CREATE_RESTAURANT_ITEM_URL = '/restaurants/1/items';
    it('should create item as Admin - return 201', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Item',
          description: 'New Item Description',
          price: '1.99',
        })
        .expect(201)
        .then((res: request.Response) => {
          const item = res.body;
          expect(item).toEqual({
            id: expect.any(Number),
            name: 'New Item',
            description: 'New Item Description',
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            },
            price: 1.99,
            image: null,
          });
        });
    });
    it('should create item as Owner of the restaurant - return 201', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Item 2',
          description: 'New Item Description 2',
          price: '2.99',
        })
        .expect(201)
        .then((res: request.Response) => {
          const item = res.body;
          expect(item).toEqual({
            id: expect.any(Number),
            name: 'New Item 2',
            description: 'New Item Description 2',
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            },
            price: 2.99,
            image: null,
          });
        });
    });
    it('should not create item as NOT Owner of the restaurant - return 403', async () => {
      const token = await setupTokenForOwner2();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Item 3',
          description: 'New Item Description 3',
          price: '3.99',
        })
        .expect(403);
    });
    it('should not create item as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Item 3',
          description: 'New Item Description 3',
          price: '3.99',
        })
        .expect(403);
    });
    it('should not create item without token - return 401', async () => {
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .send({
          name: 'New Item 3',
          description: 'New Item Description 3',
          price: '3.99',
        })
        .expect(401);
    });
    it('should not create item without price - return 400', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Item 4',
          description: 'New Item Description 4',
        })
        .expect(400);
    });
    it('should not create item without name - return 400', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          description: 'New Item Description 4',
          price: '4.99',
        })
        .expect(400);
    });
    it('should create item without description - return 201', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .post(CREATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'New Item 5',
          price: '5.99',
        })
        .expect(201)
        .then((res: request.Response) => {
          const item = res.body;
          expect(item).toEqual({
            id: expect.any(Number),
            name: 'New Item 5',
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            },
            price: 5.99,
            image: null,
          });
        });
    });
  });
  describe('updateItem (PATCH /restaurants/:id/items', () => {
    const UPDATE_RESTAURANT_ITEM_URL = '/restaurants/1/items';

    it('should update item as Admin - return 200', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: '1',
          name: 'Updated Item Name',
          description: 'Updated Item Description',
          price: '10.54',
        })
        .expect(200)
        .then((res: request.Response) => {
          const item = res.body;
          expect(item).toEqual({
            id: 1,
            name: 'Updated Item Name',
            description: 'Updated Item Description',
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            },
            price: 10.54,
            image: null,
          });
        });
    });
    it('should update item as Owner of the restaurant - return 200', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: '1',
          name: 'Updated Item Name 2',
          description: 'Updated Item Description 2',
          price: '20.54',
        })
        .expect(200)
        .then((res: request.Response) => {
          const item = res.body;
          expect(item).toEqual({
            id: 1,
            name: 'Updated Item Name 2',
            description: 'Updated Item Description 2',
            restaurant: {
              id: 1,
              name: 'Test Restaurant',
              description: 'Test Restaurant Description',
              createdAt: expect.anything(),
              categories: [],
              image: null,
              location: [1, 1],
            },
            price: 20.54,
            image: null,
          });
        });
    });
    it('should not update item as NOT Owner of the restaurant - return 403', async () => {
      const token = await setupTokenForOwner2();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: '1',
          name: 'Updated Item Name 3',
          description: 'Updated Item Description 3',
          price: '30.54',
        })
        .expect(403);
    });
    it('should not update item as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          id: '1',
          name: 'Updated Item Name 3',
          description: 'Updated Item Description 3',
          price: '30.54',
        })
        .expect(403);
    });
    it('should not update item without token - return 401', async () => {
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_ITEM_URL)
        .send({
          id: '1',
          name: 'Updated Item Name 3',
          description: 'Updated Item Description 3',
          price: '30.54',
        })
        .expect(401);
    });
    it('should not update item without id - return 400', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .patch(UPDATE_RESTAURANT_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .send({
          name: 'Updated Item Name 4',
          description: 'Updated Item Description 4',
          price: '40.54',
        })
        .expect(400);
    });
  });
  describe('deleteItem (DELETE /restaurants/:id/items/:itemid', () => {
    const DELETE_ITEM_URL = '/restaurants/1/items/1';
    const DELETE_ITEM_2_URL = '/restaurants/1/items/2';
    const DELETE_ITEM_3_URL = '/restaurants/1/items/3';
    const DELETE_ITEM_WRONG_URL = '/restaurants/1/items/99';
    it('should delete item as Admin and return true - return 200', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const result = response.body;
          expect(result).toBeTruthy();
        });
    });
    it('should delete item as Owner of restaurant and return true - return 200', async () => {
      const token = await setupTokenForOwner();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_2_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(200)
        .then((response) => {
          const result = response.body;
          expect(result).toBeTruthy();
        });
    });
    it('should not delete item as NOT Owner of restaurant - return 403', async () => {
      const token = await setupTokenForOwner2();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_3_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not delete item as User - return 403', async () => {
      const token = await setupTokenForUser();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_3_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(403);
    });
    it('should not delete item without token - return 401', async () => {
      return request(app.getHttpServer()).delete(DELETE_ITEM_3_URL).expect(401);
    });
    it('should not delete item with incorrect itemId - return 400', async () => {
      const token = await setupTokenForAdmin();
      return request(app.getHttpServer())
        .delete(DELETE_ITEM_WRONG_URL)
        .set('Authorization', 'Bearer ' + token)
        .expect(400);
    });
  });
  describe('isRestaurantNameTaken (GET /restaurants/is-name-taken/:name', () => {
    const IS_RESTAURANT_NAME_TAKEN_URL =
      '/restaurants/is-name-taken/Test Restaurant';
    const IS_RESTAURANT_NAME_NOT_TAKEN_URL =
      '/restaurants/is-name-taken/Test Restaurant 999';
    it('should return true if restaurant name is taken - return 200', async () => {
      return request(app.getHttpServer())
        .get(IS_RESTAURANT_NAME_TAKEN_URL)
        .expect(200)
        .then((response) => {
          const result = response.text;
          expect(result).toBe('true');
        });
    });
    it('should return false if restaurant name is not taken - return 200', async () => {
      return request(app.getHttpServer())
        .get(IS_RESTAURANT_NAME_NOT_TAKEN_URL)
        .expect(200)
        .then((response) => {
          const result = response.text;
          expect(result).toBe('false');
        });
    });
  });
});
