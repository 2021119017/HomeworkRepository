const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./product.db');
const fs = require("fs");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  db.all("SELECT * FROM products", (error, rows) => {
    if(error) {
      res.status(500).send(error.message);
      return;
    }
    res.render('index', {products: rows, category: 'all', searchTerm: ''});
  });
});

app.get('/product/:id', (req, res) => {
  db.get(`SELECT * FROM products WHERE product_id = ?`, [req.params.id], (error, row) => {
    if(error) {
      res.status(500).send(error.message);
      return;
    }
    fs.readFile('public/comment.json', (error, data) => {
      if (error) {
        res.status(500).send("error reading the comments file");
        return;
      }

      let comments = JSON.parse(data);
    res.render('product', {product: row, comments: comments});
  });
});
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/filter', (req, res) => {
    let category = req.body.category; // 선택한 카테고리
    let searchTerm = req.body.searchTerm; // 입력한 검색어
    
    let sql = "SELECT * FROM products";
    let params = [];
  
    if (category !== "all") {
      sql += " WHERE product_category = ?";
      params.push(category);
    }
  
    if(searchTerm) {
      sql += (category !== "all" ? " AND" : " WHERE") + " product_title LIKE ?";
      params.push('%' + searchTerm + '%');
  }
  
    db.all(sql, params, (error, rows) => {
      if (error) {
        res.status(500).send(error.message);
        return;
      }
      res.render('index', {products: rows, category: category, searchTerm: searchTerm});
    });
  });


app.post("/write-reviews", function (req, res) {
  const newReview = req.body.content;
  const productId = req.body.product_id;

  if (!newReview) {
    res.status(400).send("400에러! content가 post body에 없습니다.");
    return;
  }

  fs.readFile('public/comment.json', (error, data) => {
    if (error) {
      res.status(500).send("error reading the file")
      return;
    }
    let reviews = JSON.parse(data);
    reviews.push({content: newReview});
  
  fs.writeFile("public/comment.json", JSON.stringify(reviews, null, 2), (error) => {
    if (error) {
      res.status(500).send("500 서버 에러");
      return;
    }
    res.redirect('/product/' + productId);
  });
  });
});

app.get("/read_feedback", function(req, res) {
  consolg.log(req.query);
})
 
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
