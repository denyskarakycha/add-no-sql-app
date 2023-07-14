const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor (username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save () {
    const db = getDb();
    return db.collection('users').insertOne(this)
     .then(result => {
      console.log("User Created");
     })
     .catch(err => console.log(err))
  }

  addToCart (product) {
    let updateCart;
    if (!this.cart) {
        updateCart = {items: [{productId: new mongodb.ObjectId(product._id), quantity: 1}]};
    } else {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1; 
    const updateCartItems = [...this.cart.items];
    
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;  
      updateCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updateCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: 1});
    }

    updateCart = {items: updateCartItems};
  }
    const db = getDb();
    return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: updateCart}})
  }

  static findById (userId) {
    const db = getDb();
    return db.collection('users').findOne({_id: new mongodb.ObjectId(userId)});
  }
}


module.exports = User;
