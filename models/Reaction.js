const { Schema, Types } = require('mongoose');
const moment = require('moment'); 
const ReactionSchema = new Schema(
    {
        reactionId:{
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody:{
            type: String,
            required:true,
            maxlength:280
        },
        username:{
            type: String,
            required:true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: v => moment(v).format('DD/MM/YYYY hh:mm a') 
        },
    },
    {
        toJSON: {
            getters: true,
          },
    }
);

module.exports = ReactionSchema;
