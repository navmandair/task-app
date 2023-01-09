const db = require('../src/db/mongoose');
const request = require('supertest');
const { app } = require('../src/routers/app');
const User = require('../src/db/modals/user');
const { setupDatabase, cleanupDatabase, testUser } = require('./fixtures/util');

beforeAll(setupDatabase)

afterAll(cleanupDatabase);

test('Database is test', async () => {
    if (!process.env.DB_NAME.endsWith('test-db')) {
        throw new Error('Database is not a test db')
    }
})

test('Can post a user', async () => {
    const result = await request(app).post('/users').send({
        name: 'Nav',
        email: 'newuser@test.com',
        password: 'Pass@1234'
    }).expect(201);
    const user = await User.findById(result.body.user._id)
    expect(result.body.user.name).toBe(user.name)
    expect(result.body.user.password).toBeUndefined()
    expect(user.password).not.toBe(result.body.user.password)
    expect(user.password).not.toBeNull()
})

test('User cannot login with bad credentials', async () => {
    await request(app).post('/users/login').send({
        email: testUser.email,
        password: testUser.password + '5'  // Incorrect password
    }).expect(400);
})

test('User can login', async () => {
    const result = await request(app).post('/users/login').send({
        email: testUser.email,
        password: testUser.password
    }).expect(200);
})

test('Upload User Profile Avatar when authenticated', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/avatar.jpg')
        .expect(200);
    const user = await User.findOne({ token: testUser.tokens[0].token })
    expect(user.avatar).not.toBeNull()

})

test('Patch User Name when authenticated', async () => {
    let newName = 'Nav Singh'
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({ name: newName })
        .expect(200);
    const user = await User.findOne({ token: testUser.tokens[0].token })
    expect(user.name).not.toBe(testUser.name)
    expect(user.name).toBe(newName)
})

test('Do not Patch User Name when not authenticated', async () => {
    let newName = 'Nav Singhg'
    await request(app)
        .patch('/users/me')
        .send({ name: newName })
        .expect(401);
    const user = await User.findOne({ token: testUser.tokens[0].token })
    expect(user.name).not.toBe(newName)
})

test('Patch User Invalid Key when authenticated', async () => {
    let newName = 'Nav Singhg'
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({ invalid: newName })
        .expect(400);
    const user = await User.findOne({ token: testUser.tokens[0].token })
    expect(user.invalid).toBeUndefined()
})

test('Get User Profile when not authenticated', async () => {
    await request(app).get('/users/me').send().expect(401);
})

test('Get User Profile when authenticated', async () => {
    await request(app).get('/users/me').set('Authorization', `Bearer ${testUser.tokens[0].token}`).send().expect(200);
})

test('Cannot Delete User Profile when not authenticated', async () => {
    await request(app).delete('/users/me').send().expect(401);
    const user = await User.findOne({ token: testUser.tokens[0].token })
    expect(user).not.toBeNull()
})

test('Delete User Profile when authenticated', async () => {
    const result = await request(app).delete('/users/me').set('Authorization', `Bearer ${testUser.tokens[0].token}`).send().expect(200);
    const user = await User.findById(result.body.id)
    expect(user).toBeNull()

})
