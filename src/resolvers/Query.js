const Query = {
    posts(parent,args,{db},info) {
        if (!args.query) {
            return db.posts
        }
        return db.posts.filter((user) => {
            return user.title.toLowerCase().includes(args.query.toLowerCase()) ||
            user.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    users(parent,args,{db},info){
        if (!args.query){
            return db.users
        }
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments(parent,args,{db},info) {
        return db.comments
    }
    ,
    me() {
        return {
            id: "abc13",
            name: "ahmed",
            email: "a@a.com",
        }
    },
    post() {
        return {
            id: "asd'as;d",
            title: "clean code",
            body: "asdasd",
            published: true
        }
    }

}
export default Query