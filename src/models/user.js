const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');








    /**Creation de schema pour le model  */

   const userSchema = new mongoose.Schema({
    email : {
        
        type : String,
        required : true,
        validate(v) {
            if(!validator.isEmail(v)) throw new Error('Email non valide')  // avec le module validator
        },
        unique : true ,   // email unique 
        trim : true
    },
    name : { 
        type: String,
        required : true,    // il sera obligatoire
        
    },
    age : {
        type: Number,
        required : true,
        validate(v){
            if(v < 12){
                throw new Error('Age doit etre superieur ou egale à 12 ans');
            }

           
        }
    },
    password : {
        type: String,
        validate(v){
            if(!validator.isLength(v , {min : 6 , max :10})) {
                throw new Error('mot de passe non valide');
            } 
        }
    }
   });


   

   

   /** Cryptage de mot de passe avec le middlewares  */
   userSchema.pre('save', async function (req,res){
    if(this.isModified('password')) this.password = await bcrypt.hash(this.password,8);
   });

   /** Creation de model de la base dd  */
   const User = mongoose.model('User',userSchema);

module.exports =  User ;