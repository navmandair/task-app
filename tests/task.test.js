const { setupDatabase, cleanupDatabase, testUser, testUser2, task1 } = require('./fixtures/util');
const request = require('supertest');
const { app } = require('../src/routers/app');
const Task = require('../src/db/modals/task');

beforeAll(setupDatabase)

afterAll(cleanupDatabase);

test('Database is test db', async () => {
    if (!process.env.DB_NAME.endsWith('test-db')) {
        throw new Error('Database is not a test db')
    }
})

test('Create a new Task for user 1', async () => {
    const result = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({description: 'clean the car of user 1'})
    .expect(201);
    const task = await Task.findById(result.body._id)
    expect(result.body.description).toBe(task.description)
})

test('Get tasks list for user 2', async () => {
    const result = await request(app)
    .get('/tasks/me')
    .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
    .expect(200);
    expect(result.body.length).toBe(2)
})


test('Delete task of other user', async () => {
    const result = await request(app)
    .delete(`/tasks/${task1._id}`)
    .set('Authorization', `Bearer ${testUser2.tokens[0].token}`)
    .expect(404);
})

test('Delete task of authorised user', async () => {
    const result = await request(app)
    .delete(`/tasks/${task1._id}`)
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .expect(200);
})