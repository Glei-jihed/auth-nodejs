const express = require('express');
const bcrypt = require('bcryptjs');
const User  = require('../models/user');
const jwt = require('jsonwebtoken');

const router = new express.Router();

router.post('/registre', async (req,res,next)=> {
    
    try {
        const user = new User(req.body);
        const userSave = await user.save();
        const {password, ...data} = await userSave.toJSON()
        res.status(201).send(data);
    } catch (e) {
        res.status(400).send('vérifiez vos informations');
    }
    
});

router.post('/login', async (req,res)=>{
    const user = await User.findOne({email: req.body.email});
    if (!user){
        res.status(404).send({
            message : ' user not found !'
        })
    }
   if ( ! await bcrypt.compare(req.body.password , user.password )) {
    res.status(400).send({
        message : ' email or password is wrong '
    })
   }
   const token = jwt.sign({_id : user._id} , 'secret' )

   res.cookie('jwt', token , {
    httpOnly: true ,
    maxAge : 24 * 60 * 60 * 1000

   });

   res.status(201).send({
    message : ' Connected with success ! '
   });
});

router.get('/user', async  (req,res)=>{
    try {
        const cookie = req.cookies['jwt']
    const claims = jwt.verify( cookie, 'secret');
    if(!claims){
        return res.status(401).send({
            message : ' connection dained !! please login '
        });
    }
    const user = await User.findOne({_id : claims._id}) ;
    const {password , ...data} = await user.toJSON();
    res.send(data);
    } catch(e){
        res.status(401).send({
            message : 'connection dained please login '
        })
    }
    
});

router.post('/logout',(req,res)=>{
    res.cookie('jwt','', {
        maxAge : 0
    })
    res.send({
        messsage : 'you are deconnected with success ! '
    })
})



module.exports = router 