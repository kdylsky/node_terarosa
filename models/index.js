const Sequelize = require("sequelize");

// 클래스를 불러온다.
const User = require("./user");
const Category = require("./category");
const SubCategory = require("./subcategory");
const Size = require("./size");
const Taste = require("./taste");
const Grinding = require("./grinding");
const Product = require("./product");
const Cart = require("./cart");
const Order = require("./order");
const OrderItem = require("./orderitem");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];

const db = {};

// new Sequelize를 통해 MySQL 연결 객체를 생성한다.
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 연결객체를 나중에 재사용하기 위해 db.sequelize에 넣어둔다.
db.sequelize = sequelize;

// 모델 클래스를 넣음.
db.User = User;
db.Category = Category;
db.SubCategory = SubCategory;
db.Size = Size;
db.Taste = Taste;
db.Grinding = Grinding;
db.Product = Product;
db.Cart = Cart;
db.Order = Order;
db.OrderItem = OrderItem;

// 모델과 테이블 종합적인 연결이 설정된다.
User.init(sequelize);
Category.init(sequelize);
SubCategory.init(sequelize);
Size.init(sequelize);
Taste.init(sequelize);
Grinding.init(sequelize);
Product.init(sequelize);
Cart.init(sequelize);
Order.init(sequelize);
OrderItem.init(sequelize);

// db객체 안에 있는 모델들 간의 관계가 설정된다.
User.associate(db);
Category.associate(db);
SubCategory.associate(db);
Size.associate(db);
Taste.associate(db);
Grinding.associate(db);
Product.associate(db);
Cart.associate(db);
Order.associate(db);
OrderItem.associate(db);

// 모듈로 꺼낸다.
module.exports = db;
