const redisClient = require('../redis')

module.exports.rateLimiter = (secondsLimit, limitAmount) =>
    async (req, res, next) => {
        const ip = req.connection.remoteAddress.slice(0, 4);
        const [response] = await redisClient
            .multi()
            .incr(ip)
            .expire(ip, secondsLimit)
            .exec();
        console.log(response);
        if (response[1] > limitAmount)
            res.json({
                loggedIn: false,
                status: "Slow down try again later after 1 minute"
            })
        else next();
    }
