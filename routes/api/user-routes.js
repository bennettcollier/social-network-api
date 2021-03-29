const router = require('express').Router();

const  {User, Thought} = require('../../models');

const getAllUsers = ((req,res) => {
    User.find({})
    .populate({path: 'friends', select: "-__v"})
    .then(dbUser => res.json(dbUser))
    .catch(err => res.status(400).json(err))
})

const createUser = ((req,res)=>{
    User.create(req.body)
    .then(dbUser => res.json(dbUser))
    .catch(err => res.status(400).json(err));
})

const getUserById = ((req,res) => {
    User.findOne({_id:req.params.id})
    .populate({path: 'friends', select: "-__v"})
    .populate({path: 'thoughts', select: "-__v"})
    .then(dbUser => {
        if(!dbUser){
            res.status(404).json({message: "There is no user with that ID."});
            return;
        }
        res.json(dbUser);
        
    })
    .catch(err => {
        console.log("Error.")
        res.status(400).json(err);
    });
});

const updateUser = ((req,res) => {
    User.findOneAndUpdate(
        {_id:req.params.id},
        req.body,
        {new:true}
        )
        .then(dbUser => {
            if(!dbUser){
                res.status(404).json({message: "There is no user with that ID."});
                return;
            }
            res.json(dbUser);

        })
        .catch(err=>{
            res.status(400).json(err)
        })
});


const deleteUser = ((req,res) => {    
    User.findOneAndDelete({_id:req.params.id})
    .then(dbUser => {
        if(!dbUser){
            res.status(404).json({message:"There is no user with that ID."})
        }
        Thought.deleteMany({_id:{$in: dbUser.thoughts}}).then(console.log)
        res.json(dbUser)
    })
    .catch(err => res.json(err))
});

const addFriend = ((req,res) => {
    User.findOneAndUpdate(
        {_id:req.params.id},
        {$push: {friends : req.params.friendId}},
        {new:true}
    )
    .then(dbUser => {
        if(!dbUser){
            res.status(404).json({message: "There is no user with that ID."})
        }
        res.json(dbUser);
    })
});

const deleteFriend = ((req,res) => {
    User.findOneAndUpdate(
        {_id:req.params.id},
        {$pull: {friends : req.params.friendId}},
        {new:true}
    )
    .then(dbUser => {
        if(!dbUser){
            res.status(404).json({message: "There is no user with that ID."})
        }
        res.json(dbUser);
    })
});

router.route('/')
.get(getAllUsers)
.post(createUser);

router.route('/:id')
.get(getUserById)
.put(updateUser)
.delete(deleteUser);

router.route('/:id/friends/:friendId')
.post(addFriend)
.delete(deleteFriend)


module.exports = router;