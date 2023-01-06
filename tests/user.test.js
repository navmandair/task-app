const db = require('../src/db/mongoose');
const request = require('supertest');
const { app } = require('../src/routers/app');
const User = require('../src/db/modals/user');

const testUser1 = {
    name: 'Nav',
    email: 'mandair96@gmail.com',
    password: 'Pass@1234'
}

beforeAll(async () => {
    await db.init();
    await User.deleteMany({});
})

afterAll(async () => await db.mongoose.disconnect());

test('Database is test', async () => {
    if (!process.env.DB_NAME.endsWith('test-db')) {
        throw new Error('Database is not a test db')
    }
})

test('Can connect to server', async () => {
    await request(app).get('/').expect(200);
})

test('Can post a user', async () => {
    const result = await request(app).post('/users').send(testUser1).expect(201);
    const user = await User.findById(result.body.user._id)
    expect(result.body.user.name).toBe(user.name)
    expect(result.body.user.password).toBeUndefined()
    expect(user.password).not.toBe(result.body.user.password)
    expect(user.password).not.toBeNull()
})

test('User cannot login with bad credentials', async () => {
    await request(app).post('/users/login').send({
        email: testUser1.email,
        password: testUser1.password + '5'  // Incorrect password
    }).expect(400);
})

test('User can login', async () => {
    const result = await request(app).post('/users/login').send({
        email: testUser1.email,
        password: testUser1.password
    }).expect(200);
    const jsonResult = JSON.parse(result.text);
    testUser1.token = jsonResult.token
})

test('Upload User Profile Avatar when authenticated', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .attach('avatar', 'tests/fixtures/avatar.jpg')
        .expect(200);
    const user = await User.findOne({ token: testUser1.token })
    expect(user.avatar).not.toBeNull()

})

test('Patch User Name when authenticated', async () => {
    let newName = 'Nav Singh'
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send({ name: newName })
        .expect(200);
    const user = await User.findOne({ token: testUser1.token })
    expect(user.name).not.toBe(testUser1.name)
    expect(user.name).toBe(newName)
})

test('Do not Patch User Name when not authenticated', async () => {
    let newName = 'Nav Singhg'
    await request(app)
        .patch('/users/me')
        .send({ name: newName })
        .expect(401);
    const user = await User.findOne({ token: testUser1.token })
    expect(user.name).not.toBe(newName)
})

test('Patch User Invalid Key when authenticated', async () => {
    let newName = 'Nav Singhg'
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${testUser1.token}`)
        .send({ invalid: newName })
        .expect(400);
    const user = await User.findOne({ token: testUser1.token })
    expect(user.invalid).toBeUndefined()
})

test('Get User Profile when not authenticated', async () => {
    await request(app).get('/users/me').send().expect(401);
})

test('Get User Profile when authenticated', async () => {
    await request(app).get('/users/me').set('Authorization', `Bearer ${testUser1.token}`).send().expect(200);
})

test('Cannot Delete User Profile when not authenticated', async () => {
    await request(app).delete('/users/me').send().expect(401);
    const user = await User.findOne({ token: testUser1.token })
    expect(user).not.toBeNull()
})

test('Delete User Profile when authenticated', async () => {
    await request(app).delete('/users/me').set('Authorization', `Bearer ${testUser1.token}`).send().expect(200);
    const user = await User.findOne({ token: testUser1.token })
    expect(user).toBeNull()

})
