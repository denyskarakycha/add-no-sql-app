const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => {
        console.log("User Created");
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    let updateCart;
    if (!this.cart) {
      updateCart = {
        items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }],
      };
    } else {
      const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
      });

      let newQuantity = 1;
      const updateCartItems = [...this.cart.items];

      if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updateCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updateCartItems.push({
          productId: new mongodb.ObjectId(product._id),
          quantity: 1,
        });
      }

      updateCart = { items: updateCartItems };
    }
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updateCart } }
      );
  }

    getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((element) => {
      return element.productId;
    });
    return db.collection("products")
      .find({ _id: { $in: productIds} })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => console.log(err));
  }

  deleteItemFromCart(prodId) {
    const db = getDb();

    const updateCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== prodId.toString();
    });

    return db
    .collection("users")
    .updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      { $set: { cart: {items: updateCartItems} } }
    );
    
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name,
        }
      };  
      return db.collection('orders').insertOne(order);
    })
    .then(result => {
        this.cart = {item: []};
        return db.collection("users")
        .updateOne(
         { _id: new mongodb.ObjectId(this._id) },
         { $set: { cart: {items: []} } }
        );
      })
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find()
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
