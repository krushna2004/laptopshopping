  const express = require('express');
  const cors = require('cors');
  const app = express();
  const jwt = require('jsonwebtoken');
  const port = 3001;
  const laptopJSON = require('./public/products.json');
  const connectDB = require("./DB/Connection");

  const uri ="mongodb+srv://krushnakanani:krushna@cluster0.4jthqsr.mongodb.net/Laptops?retryWrites=true&w=majority";
  const laptopSchema = require('./model/Product_Model');
  const myCartSchema = require('./model/MyCart');
  const ExpectedCartSchema = require('./model/ExpectedCart');
  const userSchema = require('./model/Users');
  const nodemailer = require('nodemailer');


  app.use(cors());
  connectDB(uri);
  app.use(express.json());



  app.get('/fetch', async (req, res) => {
      
      const allProducts = await laptopSchema.find({});
      
      console.log("fetched all products");
      res.json(allProducts);
    
  });

  app.post('/signup', async (req, res) => {
    try {
      const { name, phone,email, password } = req.body;

      // Use the User model for database operations
      const user = new userSchema({ name, phone,email, password });
      
      // Use create method to insert data into the collection
      const result = await userSchema.create(user);

      if (result) {
        res.status(201).json({ message: 'Signup successful' });
        
      } else {
        res.status(500).json({ message: 'Failed to insert data' });
      }
    } catch (err) {
      console.error('Error during signup:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/login", async (req, res) => {
    const { phone} = req.body;


    try {
      const user = await userSchema.findOne({ phone});

      if (user) {
        const token = jwt.sign({ userId: user._id , phone: user.phone}, 'your-secret-key', { expiresIn: '1h' });
        
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const requireAuth = (req, res, next) => {
    console.log(req.header('Authorization'));
    const token = req.header('Authorization');

    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      console.log('Decoded Token:', decoded); // Log the decoded token
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };


  app.post('/addToCart',requireAuth,  async (req, res) => {
    const userPhone = req.user.phone; // Updated from userEmail to userPhone
    console.log(userPhone);

    const product = {
      phone: userPhone, // Updated from email to phone
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      ram: req.body.ram,
      storage: req.body.storage,
      image_url: req.body.image_url,
      rating: req.body.rating,
      quantity: req.body.quantity,
    };

    myCartSchema.create(product)
      .then(() => {
        console.log('Added to cart');
        res.json({ message: 'Product added to cart' });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });

  app.post("/expectedCart",requireAuth,  (req, res) => {
    const { productId, expectedPrice } = req.body;
    const userPhone = req.user.phone;

    const info = {
      phone : userPhone,
      id : productId,
      expectedPrice : expectedPrice,
    }
    console.log(`Adding product ${productId} to cart with expected price: ${expectedPrice} of  ${userPhone}  `);
    
    ExpectedCartSchema.create(info)
    .then(() => {
      res.json({ success: true });
      
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    });
  
  });

  app.get('/myCart', requireAuth, async (req, res) => {
    const userPhone = req.user.phone;
    console.log(userPhone);
    try {
      const userCartItems = await myCartSchema.find({ phone: userPhone });
      res.json(userCartItems);
    } catch (error) {
      console.error('Error fetching user cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



    app.put('/editProduct/:productId', async (req, res) => {
      try {
        const productId = req.params.productId;
        const updatedProductData = req.body;

        const EpcUser = await ExpectedCartSchema.find({ id: productId });

        EpcUser.forEach(async(EpcUser) => {
          if (updatedProductData.price < EpcUser.expectedPrice) {
            console.log(`User with phone ${EpcUser.phone} has expected price less than the updated price for product ${productId}`);
           
            userEmail = await userSchema.find({phone: EpcUser.phone});

            userEmail.forEach((user) => {
          
            console.log(`User with email  ${ user.email}`);

            
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use the email service you prefer (e.g., 'gmail', 'hotmail', 'yahoo')
    auth: {
      user: 'laptopplaza12@gmail.com',
      pass: 'nniyxsnoxbbkgfet',
    },
  });
  
  // Define the email options
  const mailOptions = {
    from: 'laptopplaza12@gmail.com',
    to: user.email,
    subject: 'Exciting News! Your Liked Product is Now Available at Your Expected Price',
    html: `
      <p>Dear Customer,</p>
      <p>We hope this email finds you well. We are thrilled to share some exciting news with you!</p>
      <p>The product you liked, is now available at your expected price. We understand how important this item is to you, and we're delighted to make it more accessible.</p>
      <p>Here are the details:</p>
      <ul>
        <li>Product Name: ${updatedProductData.name}</li>
        <li>Expected Price: ${EpcUser.expectedPrice}</li>
        <li>Current Price: ${updatedProductData.price}</li>
      </ul>
      <p>To purchase the product at the new price, simply visit our website or click the link below:</p>
      <a href="">Product Link</a>
      <p>Thank you for being a valued customer. We appreciate your continued support, and we hope you enjoy your new purchase!</p>
      <p>If you have any questions or need further assistance, please don't hesitate to contact our customer support team at laptopplaza@gmail.com.</p>
      <p>Happy shopping!</p>
      <p>Best regards,</p>
      <p>LaptopPlaza</p>
      <p>www.LaptopPlaza.com</p>
    `,
  };
  

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
         
        });
          }
        });

        

    
        // Find and update the product in your database (MongoDB)
        const updatedProduct = await laptopSchema.findOneAndUpdate(
          { id: productId }, // Assuming "_id" is the product's MongoDB ID
          updatedProductData,
          { new: true } // To return the updated product
        );
    
        if (!updatedProduct) {
          return res.status(404).json({ error: 'Product not found' });
        }
    
        res.json(updatedProduct);
      } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    
    app.post('/removeProduct/:productId', async (req, res) => {
      try {
        const productId = req.params.productId;
        const myData = await myCartSchema.deleteOne({ id: productId }); 
        
        if (myData.deletedCount === 0) {
          res.status(404).json({ error: "Product not found" });
        } else {
          res.json({ message: "Product successfully removed from cart" });
        }
      } catch (error) {
        console.error("Error Removing from cart:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })

    app.get('/create',(req, res) =>{
      myCartSchema.create(laptopJSON)
      .then(() => console.log("create"))
      .catch((err) => console.log(err))
    })
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    





  // app.use(session({
  //   secret: 'mysecret',
  //   resave: false,
  //   saveUninitialized: true,
  //   cookie: {
  //     secure: false, // Set to true in production if using HTTPS
  //     maxAge: 3600000, // Session timeout in milliseconds (e.g., 1 hour)
  //   },
  // }));

  // const corsOptions = {
  //   origin: 'http://localhost:3000', // Replace with the actual origin of your React app
  //   credentials: true, // Enable credentials (cookies)
  // };

  // app.get("/getSession", async (req, res) => {
  //   const username = req.session.username || "guest";
  //     res.send('hello, ' + username);
  // })

  // app.get("/setSession", async (req, res) => {
  //   req.session.username = 'het';
  //   res.json({ message: "Session is set" }); // Sending a JSON response
  // });