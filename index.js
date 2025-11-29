import express from "express"
import bodyParser from "body-parser"
import defaultPosts from "./public/posts/defaultPosts.js"
import { unicID, dateStamp, stringToArray, concatArray } from "./middleware/tools.js"

const app = express()
const port = 3000
let currentPosts = JSON.parse(JSON.stringify(defaultPosts))

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index.ejs', { data: currentPosts })
})

app.get("/addpost", (req, res) => {
  res.render('form.ejs')
})

app.get("/article/id/:id", (req, res) => {
  const id = req.params["id"]
  const post = currentPosts.find(item => item.id === id)

  res.render('article.ejs', { data: post })
})

app.post("/submit", (req, res) => {
  const title = req.body["title"]
  const content = req.body["content"]
  const editedPostId = req.body["id"]
  const formattedContent = stringToArray(content)

  if (title || content) {
    if (editedPostId) {
      const postIndex = currentPosts.findIndex((item) => item.id === editedPostId)

      currentPosts.unshift({
        "id": unicID(),
        "title": title,
        "content": formattedContent,
        "createDate": currentPosts[postIndex].createDate,
        "lastEdit": dateStamp()
      })

      currentPosts.splice(postIndex + 1, 1)
    } else {
      currentPosts.unshift({
        "id": unicID(),
        "title": title,
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
  const editedPost = currentPosts.find(item => item.id === id)
  const editedPostContent = concatArray(editedPost.content)

  res.render('form.ejs', { editedPostId: editedPost.id, editedPostTitle: editedPost.title, editedPostContent: editedPostContent })
})

app.post("/deletepost/id/:id", (req, res) => {
  const id = req.params["id"]
  const postIndex = currentPosts.findIndex((item) => item.id === id)

  //Delete the actual post
  currentPosts.splice(postIndex, 1)

  res.redirect('/')
})

app.get("/reset", (req, res) => {
  currentPosts = JSON.parse(JSON.stringify(defaultPosts))

  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`http://localhost:${port}`)
})
