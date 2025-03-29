export default {
    required : {
        required : true , message : "this field is required"
    },
    numeric:{
        type : "number",
        transform : (value)=>Number(value),
        message : "must be numeric !"
    },
    greaterThanZero:{
        type : "number",
        min :0.01,
        message: "must be greater than zero"
    }
};
