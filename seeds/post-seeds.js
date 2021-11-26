const { Post } = require('../models');

const postData = [{
        title: "Steering wheel from a `72 Ford F250",
        content: "Nice, round and black as night. $45",
        user_id: 2,
        category_id: 1
    },
    {
        title: "Corduroy shorts",
        content: "Knee Length and brown. asking $15",
        user_id: 2,
        category_id: 2
    },
    {
        title: "RGB Gaming Mouse",
        content: "Good weight, smooth glide. selling because I don't have room in my new apartment. need this gone yesterday! $20 obo",
        user_id: 1,
        category_id: 3
    },
    {
        title: "Electric nose hair trimmer",
        content: "Long and slender, gets in all the right places. Got a new one for halloween but this ol' gal's still got some legs to `er! $8 to a good home.",
        user_id: 2,
        category_id: 4
    },
    {
        title: "Mop and Bucket 2pc set",
        content: "Haven't met a floor they could't clean yet! $12 no low ballers!",
        user_id: 1,
        category_id: 5
    },
    {
        title: "Arken Stone",
        content: "Precious Dwarven artifact! $12,000 no less!",
        user_id: 1,
        category_id: 6
    },
    {
        title: "Kune Kune Piglets",
        content: "Small and snorty, these hairy troublemakers are looking for a good home. $300 a piece, get 'em while their hot!",
        user_id: 2,
        category_id: 7
    },
    {
        title: "Golf Shoes (like NEW)",
        content: "Hardly ever worn, barely even stink! $25 firm",
        user_id: 1,
        category_id: 8
    },
    {
        title: "Wanted: Pong for Atari 2600",
        content: "I'll need two paddles too, mine broke. offering $10",
        user_id: 1,
        category_id: 9
    },



];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;