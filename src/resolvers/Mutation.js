import {v4} from  'uuid'
import Post from './Post'

const Mutation = {
    createUser(parent,args,{db},info) {
        const emailTaken = db.users.some((user) => user.email === args.data.email)
        if (emailTaken) {
            throw new Error("email already taken")
        }
        const user = {
            id: v4(),
            ...args.data
        }
        db.users.push(user)
        return user
    },
    deleteUser(parent,args,{db},info) {
        const userIndex = db.users.findIndex((user) => user.id === args.id)
        if (userIndex==-1) {
            throw new Error("user not found")
        }
        const deletedUsers = users.splice(userIndex,1)
        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }
            return !match
        })
        db.comments = db.comments.filter((comment) => comment.author!== args.id)
        return deletedUsers[0]
    },
    updateUser(parent,args,{db},info) {
        const {id,data} = args
        const user = db.users.find((user) => user.id === id)
        if (!user) {
            throw new Error("user not found")
        }
        if (typeof data.email === "string") {
            const emailTaken = db.users.some((user) => user.email === data.email)
            if (emailTaken) {
                throw new Error("email taken")
            }
            user.email = data.email
        }
        if (typeof data.name === "string") {
            user.name = data.name
        }
        if (typeof data.age !== "undefined") {
            user.age = data.age
        }
        return user
    },
    createPost(parent,args,{db,pubsub},info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        if (!userExists) {
            throw new Error("user doesn't exists")
        }
        const post = {
            id: v4(),
            ...args.data
        }
        db.posts.push(post)
        if (args.data.published){
            pubsub.publish('post', {
                post: {
                mutation: "CREATED",
                data: post
                }
            })
        }
        return post
    },
    deletePost(parent,args,{db,pubsub},info){
        const postIndex = db.posts.findIndex((post)=>post.id === args.id)
        if (postIndex== -1) {
            throw new Error("post not found")
        }
        const [post] = db.posts.splice(postIndex,1)
        db.comments = comments.filter((comment) => comment.post !== args.id)
        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: post
                }
            })
        }
        return post
    }
    ,
    updatePost(parent,args,{db,pubsub},info) {
        const {id,data} = args
        const post = db.posts.find((post) => post.id === id)
        const orgPost = {...post}
        if (!post) {
            throw new Error("post not found")
        }
        if (typeof data.title === "string") {
            post.title = data.title
        }
        if (typeof data.body === "string") {
            post.body = data.body
        }
        if (typeof data.published === "string") {
            post.published = data.published
            if (orgPost.published && !post.published){
                pubsub.publish('post',{
                    post: {
                        mutation: 'DELETED',
                        post: orgPost
                    }
                })
            }
            else if (!orgPost.published && post.published){
                pubsub.publish('post',{
                    post: {
                        mutation: 'CREATED',
                        post: Post
                    }
                })    
            }
        }
        else if (post.published) {
            pubsub.publish('post',{
                post: {
                    mutation: 'UPDATED',
                    post: post
                }
            })
        }
        return post
    },
    createComment(parent,args,{db,pubsub},info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => {return post.id === args.data.post && post.published==true})
        if (!userExists || !postExists) {
            throw new Error("post or user doesn't exists")
        }
        const comment = {
            id: v4(),
            ...args.data
        }
        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: "CREATED",
                data: comment
            }
        })
        return comment
    }
    ,
    
    deleteComment(parent,args,{db,pubsub},info){
        const commentIndex = db.comments.findIndex((comment)=>comment.id === args.id)
        if (commentIndex== -1) {
            throw new Error("comment not found")
        }
        const [deletedComment] = db.comments.splice(postIndex,1)
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: "DELETED",
                data: deletedComment
            }
        })
        return deletedComment
    },
    updateComment(parent,args,{db,pubsub},info) {
        const {id,data} = args
        const comment = db.comments.find((comment) => comment.id === id)
        if (!comment) {
            throw new Error("comment not found")
        }
        if (typeof data.text === "string") {
            comment.text = data.text
        }
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })
        return comment
    }
}
export default Mutation