const axios = require('axios');
const Dev = require('../models/Dev');
module.exports = {
  async index(request, response){
    const { user } = request.headers; 
    
    const loggerdDev = await Dev.findById(user);

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggerdDev.likes } },
        { _id: { $nin: loggerdDev.dislikes } }
      ],
    });

    return response.json(users);
  },


  async store(request, response) {
    const { username } = request.body;

    const userExist = await Dev.findOne({ user: username });
    
    if(userExist){
      return response.json(userExist);
    }

    const responseAxios = await axios.get(`https://api.github.com/users/${ username }`);

    const { name, bio, avatar_url: avatar } = responseAxios.data;

    const dev = await Dev.create({
      name,
      user: username,
      bio,
      avatar
    });

    return response.json(dev);
  }
}