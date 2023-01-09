const { setupDatabase, cleanupDatabase, testUser } = require('./fixtures/util');
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

test('Create a new Task', async () => {
    const result = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
    .send({description: 'clean the car'})
    .expect(201);
    const task = await Task.findById(result.body._id)
    expect(result.body.description).toBe(task.description)
})