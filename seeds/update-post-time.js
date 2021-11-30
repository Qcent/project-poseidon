const { Post } = require('../models');

const updateTimestamp = function(id) {
    return Post.findById(id).then((itemInstance) => {
        return itemIstance.update({ created_at: '11/11/2020' }).then((self) => {
            return self;
        });
    }).catch(e => {
        console.log(e);
    });
}

module.exports = updateTimestamp;