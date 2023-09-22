let comments = [
    {
        id:"aa",
        text: "comm1",
        author: "laksdlk",
        post: "1"
    },
    {
        id:"bb",
        text: "comm2",
        author: "laksdlk",
        post: "1"
    },
    {
        id:"cc",
        text: "comm3",
        author: "asd",
        post: "2"
    },
    {
        id:"dd",
        text: "comm4",
        author: "asd",
        post: "2"
    }
]

let users = [{
    id: "asd",
    name: "asdasd",
    email:"me@example.com"
},
{
    id: "laksdlk",
    name: "asdad",
    email:"me@exasdample.com"
}]
let posts = [{
    id: "1",
    title: "clean code",
    body: "some sasdasdas",
    published: true,
    author: "asd"
},
{
    id: "2",
    title: "head first desgin patterns",
    body: "aaaaaaaaaaaaaaaa",
    published: false,
    author: "laksdlk"
}
]

const db = {
    users,
    posts,
    comments
}

export default db