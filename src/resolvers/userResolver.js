import models from '../models/index.js';
import bcrypt from 'bcryptjs';

const {User} = models

const resolvers = {
    
    Query: {
        me: async(root, args, req, info) => {
            return User.findById(req.session.userId, fields(info)).exec()
          },
        findUser: async(root, args, context, info)=>{
            return await User.findOne({username: args.inputUsername.valueOf()})
        }
    },
    Mutation: {
        signUp: async(root, args, context, info)=>{
            //we get username password and email from the args
            const userExist = await User.findOne({username: args.inputUsername.valueOf()});
            
            if (userExist) {
                throw new Error(`User exists ${userExist.username.valueOf()}`)
            }
            bcrypt.hash(args.inputPassword.valueOf(), 10, function(err, hash) {
            });  
            const user = await User.create({name: args.name.valueOf(), email: args.email.valueOf(), username: args.inputUsername.valueOf(), password: args.inputPassword.valueOf()})

            return user

    
        },
        signIn: async (root, args, context, info)=> {
            const findUser = await User.findOne({username: args.inputUsername.toString()});

            if(!findUser){
                throw new Error(`No matching email and password found`)
            }
            const correctPass = findUser.matchesPassword(args.inputPassword)

            if(correctPass){
                return findUser
            }
            else{
                throw new Error(`Invalid password`)
            }
            
            
        }

    }
}

export default resolvers;