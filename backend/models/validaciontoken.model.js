const { Schema, model } = require('mongoose');

const validationTokenSchema = Schema({

    token: { 
        type: String,
        required: true 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 43200
    }
    
}, { collection: 'ValidationToken' });

validationTokenSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();

    object.uid = _id;
    return object;

});

module.exports = model('validationToken', validationTokenSchema);
