import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    altNames : {
        type : [String],
        default : []
    },
    price : {
        type : Number,
        required : true
    },
    labeledPrice : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    images : {
        type : [String],
        required : true,
        default : ["https://th.bing.com/th/id/OIP.0fxmsoNh_touNaybjr1EjAHaEK?w=317&h=180&c=7&r=0&o=5&cb=iwc2&dpr=1.3&pid=1.7"]
    },
    stock : {
        type : Number,
        required : true
    }
})

const Product = mongoose.model("products",productSchema);
export default Product;
