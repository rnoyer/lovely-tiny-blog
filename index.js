import express from "express"
import bodyParser from "body-parser"
import posts from "./public/posts/posts.js"
import {unicID, dateStamp, stringToArray, concatArray} from "./middleware/tools.js"

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req,res) => {
  res.render('index.ejs', {data: posts})
})

app.get("/addpost", (req, res) => {
  res.render('form.ejs')
})

app.get("/article/id/:id", (req, res) => {
  const id = req.params["id"]
  const post = posts.find(item => item.id === id)
  
  res.render('article.ejs', {data: post})
})

app.post("/submit", (req,res) => {
  const title = req.body["title"]
  const content = req.body["content"]
  const editedPostId = req.body["id"]
  const formattedContent = stringToArray(content)

  if(title || content){
    if(editedPostId){
      const postIndex = posts.findIndex((item) => item.id === editedPostId)

      posts.unshift({
        "id" : unicID(),
        "title" : title,
        "content": formattedContent,
        "createDate": posts[postIndex].createDate,
        "lastEdit": dateStamp()
      })

      posts.splice(postIndex + 1, 1)
    } else {
        posts.unshift(  {
          "id" : unicID(),
          "title" : title,
          "content": formattedContent,
          "createDate": dateStamp(),
          "lastEdit": ""
        })
      }
  } else {
    console.log('🫥 Empty post')
  }

  res.redirect('/')
})

app.post("/editpost", (req, res) => {
  const id = req.body["id"]
  const editedPost = posts.find(item => item.id === id)
  const editedPostContent = concatArray(editedPost.content)

  res.render('form.ejs', {editedPostId: editedPost.id, editedPostTitle: editedPost.title, editedPostContent: editedPostContent})
})

app.post("/deletepost/id/:id", (req, res) => {
  const id = req.params["id"]
  const postIndex = posts.findIndex((item) => item.id === id)
  
  //Delete the actual post
  posts.splice(postIndex, 1)

  res.render('index.ejs', {data: posts})
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`http://localhost:${port}`)
})
