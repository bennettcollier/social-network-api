const router = require('express').Router();

const  {User, Thought, Reaction} = require('../../models');

const getAllThoughts = ((req,res) => {
    Thought.find({})
    .then(dbThgt => {
        res.json(dbThgt)
    })
    .catch(err => res.json(err))
}) 

const makeThought = ((req,res)=>{
    Thought.create(req.body)
    .then(dbThgt => {
        User.findOneAndUpdate(
            {_id:req.body.userId},
            {$push: {thoughts : dbThgt._id}},
            {new:true},
            ).then(dbUser => {
                if(!dbUser){
                    req.status(404).json({message: "There is no user with that ID."})
                }
                console.log("User was successfully updated.");
            })
        res.json(dbThgt)
    })
    .catch(err => res.json(err))
});

const getThoughtById = ((req, res) => {
    Thought.findOne({_id:req.params.id})
    .then(dbThgt => {
        if(!dbThgt){
            res.status(404).json({message:"No thoughts with that ID."})
        }
        res.json(dbThgt)
    }).catch(err => res.json(err))
}); 


const updateThoughtWithId = ((req, res) => {
    Thought.findOneAndUpdate(
        {_id:req.params.id},
        req.body,
        {new: true}
        )
    .then(dbThgt => {
        if(!dbThgt){
            res.status(404).json({message:"No thoughts with that ID."})
            return;
        }
        res.json(dbThgt)
    }).catch(err => res.json(err))
}); 


const deleteThoughtById = ((req, res) => {
    Thought.findOneAndDelete({_id: req.params.id})
    .then(dbThgt => {
        if(!dbThgt){
            res.status(404).json({message:"No thoughts with that ID."})
        }
        res.json(dbThgt)
    }).catch(err => res.json(err))
}); 

const putReactionOnThought = ((req,res) =>{
    Thought.findOneAndUpdate(
        {_id: req.params.id},
        {$push: {reactions: req.body}},
        {new:true}
        ).then(dbReact => {
            if(!dbReact){
                res.status(404).json({message: "No thought!"})
                return
            }
            res.json(dbReact)
        }).catch(err => res.json(err))

}); 

const deleteReactionFromThought = ((req,res) =>{
    
    Thought.findOneAndUpdate(
        {_id: req.params.id},
        {$pull: {reactions: {reactionId:req.params.reactionId}}},
        {new:true}
        ).then(dbReact => {
            if(!dbReact){
                res.status(404).json({message: "No thought!"})
                return
            }
            res.json(dbReact)
        }).catch(err => res.json(err))
}); 

router.route('/')
.get(getAllThoughts)
.post(makeThought);

router.route('/:id')
.get(getThoughtById)
.put(updateThoughtWithId)
.delete(deleteThoughtById);

router.route('/:id/reactions')
.post(putReactionOnThought)

router.route('/:id/reactions/:reactionId')
.delete(deleteReactionFromThought)


module.exports = router;