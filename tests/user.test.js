test('Hello World', ()=>{
    console.log(process.env['DB_NAME'])
    let s = 'Hello World'
    assert(s, 'Hello World')
})
